import * as XLSX from 'xlsx';
import { COMPTE_TO_FAMILLE } from '../constants/analytiqueConstants';
import { reclasser, normaliseFournisseur } from '../utils/reclassementEngine';

const num = (val) => {
  if (val === '-' || val === undefined || val === null || val === '') return 0;
  return Number(val) || 0;
};

const parseSageDate = (val) => {
  if (!val || val === '-') return '';
  if (val instanceof Date) return val.toISOString().split('T')[0];
  if (typeof val === 'number') {
    // Numéro de série Excel
    const date = XLSX.SSF.parse_date_code(val);
    if (date) return `${date.y}-${String(date.m).padStart(2, '0')}-${String(date.d).padStart(2, '0')}`;
  }
  if (typeof val === 'string') {
    // Format MAGH2 : "2022-12-31 00:00:00" ou "2022-12-31"
    const isoMatch = val.match(/^(\d{4}-\d{2}-\d{2})/);
    if (isoMatch) return isoMatch[1];
    // Format SAGE ancien : "31/12/2022"
    const frMatch = val.match(/^(\d{2})\/(\d{2})\/(\d{4})/);
    if (frMatch) return `${frMatch[3]}-${frMatch[2]}-${frMatch[1]}`;
  }
  return '';
};

const mapSageStatus = (etat, montantEngageNonRecu) => {
  const e = String(etat).trim().toLowerCase()
    .normalize('NFD').replace(/[̀-ͯ]/g, ''); // strip accents pour comparaison
  if (e === 'annulee' || e === 'annule')          return 'Annulée';
  if (e === 'soldee'  || e === 'mandate')          return 'Payée';
  if (e === 'liquide' || e === 'facturee')         return 'Facturée';
  return num(montantEngageNonRecu) > 0 ? 'Commandée' : 'Livrée';
};

const getLineType = (compte) => {
  if (!compte) return null;
  const c = String(compte).toUpperCase().trim();
  if (c.startsWith('H6') || c.startsWith('I6')) return 'OPEX';
  if (c.startsWith('H2')) return 'CAPEX';
  return null;
};

const genId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

// ── Détection de format ───────────────────────────────────────────────────────

/**
 * Détecte le format du classeur XLSX.
 * @returns {'ANCIEN'|'MAGH2'|'INCONNU'}
 */
export const detectFormat = (workbook) => {
  if (workbook.SheetNames.includes('Commandes IT')) return 'MAGH2';
  if (workbook.SheetNames.some(n => /^\d{4}$/.test(n))) return 'ANCIEN';
  return 'INCONNU';
};

// ── Helpers MAGH2 ─────────────────────────────────────────────────────────────

const normaliseStr = (val) =>
  val === '-' || val === undefined || val === null ? '' : String(val).trim();

const normaliseTypeCommande = (t) => {
  const map = {
    'bon de commande':          'BC',
    'marche a bons de commande':'MBC',
    'marche':                   'Marché',
    'accord cadre':             'Accord-cadre',
  };
  return map[t.toLowerCase()] || t;
};

const normaliseEtat = (e) => {
  const s = e.toLowerCase();
  if (s === 'soldee' || s === 'soldée')           return 'Soldée';
  if (s === 'en cours')                           return 'En cours';
  if (s === 'liquide' || s === 'liquidé')         return 'Liquidé';
  if (s === 'mandate' || s === 'mandaté')         return 'Mandaté';
  return e;
};

/**
 * Parse une ligne MAGH2 (45 colonnes, index 0-based).
 * Convertit TTC → HT si convertHT=true et tauxTVA > 0.
 */
const parseLigneMaGH2 = (row, convertHT = true) => {
  const tauxTVA = parseFloat(row[18]) || 0;
  const div     = convertHT && tauxTVA > 0 ? (1 + tauxTVA / 100) : 1;
  const toHT    = (v) => Math.round((parseFloat(v) || 0) / div * 100) / 100;

  return {
    numeroCommande:    normaliseStr(row[0]),
    numeroLigne:       normaliseStr(row[1]),
    reference:         `${normaliseStr(row[0])}/${normaliseStr(row[1])}`,
    exercice:          normaliseStr(row[8]),
    typeCommande:      normaliseTypeCommande(normaliseStr(row[2])),
    etatSage:          normaliseEtat(normaliseStr(row[3])),
    compteOrdonnateur: normaliseStr(row[19]),
    libelleCompte:     normaliseStr(row[20]),
    fournisseur:       normaliseStr(row[23]),
    designation:       normaliseStr(row[14]),
    datePassation:     parseSageDate(row[10]),  // col K — Date Passation
    dateImputation:    parseSageDate(row[11]),  // col L — Date Imputation
    dateReception:     parseSageDate(row[25]),  // col Z — Date Réception
    dateFacture:       parseSageDate(row[30]),  // col AE — Date Facture
    tauxTVA,
    montant:           toHT(row[38]),
    engagementNonRecu: toHT(row[39]),
    mandateNet:        toHT(row[42]),
    montantRealise:    toHT(row[44]),
  };
};

/**
 * Importe l'onglet SAGE XLSX et retourne les données structurées.
 * @param {File}   file      - Fichier XLSX uploadé
 * @param {string} sheetName - Onglet cible (défaut "2026")
 * @returns {Promise<{ opexSuppliers, opexOrders, capexProjects, capexOrders, errors, stats }>}
 */
export const importFromSageExtraction = async (file, sheetName = '2026', moteur = null) => {
  const buffer   = await file.arrayBuffer();
  const workbook = XLSX.read(buffer, { cellDates: false, raw: false });

  const sheet = workbook.Sheets[sheetName];
  if (!sheet) {
    const available = workbook.SheetNames.join(', ');
    throw new Error(`Onglet "${sheetName}" introuvable. Onglets disponibles : ${available}`);
  }

  // Tableaux 0-based (header:1 = raw arrays)
  const rowsRaw  = XLSX.utils.sheet_to_json(sheet, { defval: '-', header: 1 });
  const dataRows = rowsRaw.slice(1); // Ignore la ligne d'en-tête

  const opexGroups  = new Map();
  const capexGroups = new Map();
  const opexOrders  = [];
  const capexOrders = [];
  const errors      = [];
  const stats       = { total: dataRows.length, filteredIT: 0, opex: 0, capex: 0, skipped: 0 };

  for (let i = 0; i < dataRows.length; i++) {
    const r = dataRows[i];
    try {
      // Indices 0-based — spec EXTRACTION COMMANDES SAGE (25 colonnes)
      const codeGestionnaire = String(r[2]  ?? '').trim();
      const codeUF           = num(r[5]);
      const noCommande       = String(r[6]  ?? '').trim();
      const noLigne          = String(r[7]  ?? '').trim();
      const designation      = String(r[8]  ?? '').trim();
      const noMarche         = num(r[9]);
      const datePassation    = parseSageDate(r[10]);
      const dateImputation   = parseSageDate(r[11]);
      const dateReception    = parseSageDate(r[12]);
      const compte           = String(r[13] ?? '').trim();
      const libelleCompte    = String(r[14] ?? '').trim();
      const fournisseur      = String(r[15] ?? '').trim();
      const etat             = String(r[16] ?? '').trim();
      const typeCmd          = String(r[17] ?? '').trim();
      const montantEngage    = num(r[18]);
      const montantEngNonRec = num(r[19]);
      const montantMandateNet= num(r[22]);
      const montantRealise   = num(r[24]);

      // Filtre gestionnaire IT
      if (codeGestionnaire !== 'IT') { stats.skipped++; continue; }
      stats.filteredIT++;

      const lineType = getLineType(compte);
      if (!lineType) { stats.skipped++; continue; }

      const groupKey = `${normaliseFournisseur(fournisseur)}||${compte}`;
      const famille  = moteur
        ? reclasser({ fournisseur, designation, compteOrdonnateur: compte }, moteur).famille
        : (COMPTE_TO_FAMILLE[compte] || 'Hors périmètre DSI');
      const status   = mapSageStatus(etat, montantEngNonRec);
      const reference = `${noCommande}/${noLigne}`;

      if (lineType === 'OPEX') {
        stats.opex++;

        if (!opexGroups.has(groupKey)) {
          opexGroups.set(groupKey, {
            id:                genId(),
            supplier:          fournisseur,
            category:          libelleCompte,
            compteOrdonnateur: compte,
            familleAnalytique: famille,
            budgetAnnuel:      0,
            depenseActuelle:   0,
            engagement:        0,
            montantRealise:    0,
            nbCommandes:       0,
            codeUF:            codeUF || 250,
            notes:             '',
          });
        }
        const grp = opexGroups.get(groupKey);
        grp.depenseActuelle += montantMandateNet;
        grp.engagement      += montantEngNonRec;
        grp.montantRealise  += montantRealise;
        grp.nbCommandes     += 1;

        opexOrders.push({
          id:                genId(),
          parentId:          grp.id,
          description:       designation,
          montant:           montantEngage,
          status,
          dateCommande:      datePassation,
          dateFacture:       dateImputation,
          dateReception,
          reference,
          numeroMarche:      noMarche,
          typeCommande:      typeCmd,
          etatSage:          etat,
          compteOrdonnateur: compte,
          notes:             '',
        });

      } else { // CAPEX
        stats.capex++;

        if (!capexGroups.has(groupKey)) {
          capexGroups.set(groupKey, {
            id:                genId(),
            project:           `${fournisseur} — ${libelleCompte}`,
            enveloppe:         famille,
            compteOrdonnateur: compte,
            budgetTotal:       0,
            depense:           0,
            engagement:        0,
            montantRealise:    0,
            status:            'En cours',
            startDate:         datePassation,
            endDate:           '',
            notes:             '',
          });
        }
        const grpC = capexGroups.get(groupKey);
        grpC.depense       += montantMandateNet;
        grpC.engagement    += montantEngNonRec;
        grpC.montantRealise += montantRealise;

        capexOrders.push({
          id:                genId(),
          parentId:          grpC.id,
          description:       designation,
          montant:           montantEngage,
          status,
          dateCommande:      datePassation,
          dateFacture:       dateImputation,
          dateReception,
          reference,
          numeroMarche:      noMarche,
          typeCommande:      typeCmd,
          etatSage:          etat,
          compteOrdonnateur: compte,
          notes:             '',
        });
      }

    } catch (err) {
      errors.push({ ligne: i + 2, erreur: err.message });
    }
  }

  const round2 = (v) => Math.round(v * 100) / 100;

  const opexSuppliers = [...opexGroups.values()].map(s => ({
    ...s,
    depenseActuelle: round2(s.depenseActuelle),
    engagement:      round2(s.engagement),
    montantRealise:  round2(s.montantRealise),
  }));

  const capexProjects = [...capexGroups.values()].map(p => ({
    ...p,
    depense:        round2(p.depense),
    engagement:     round2(p.engagement),
    montantRealise: round2(p.montantRealise),
  }));

  stats.skipped = stats.total - stats.filteredIT;

  return { opexSuppliers, opexOrders, capexProjects, capexOrders, errors, stats };
};

/**
 * Importe l'onglet "Commandes IT" du format MAGH2 (45 colonnes, toutes années).
 * @param {File}    file      - Fichier XLSX uploadé
 * @param {string}  exercice  - Année à filtrer ex. "2026" (null = toutes)
 * @param {boolean} convertHT - Convertir TTC→HT via tauxTVA col[18] (défaut true)
 * @param {object}  moteur    - Moteur de reclassement (optionnel)
 */
export const importFromMAGH2 = async (file, exercice = '2026', convertHT = true, moteur = null) => {
  const buffer   = await file.arrayBuffer();
  const workbook = XLSX.read(buffer, { cellDates: false, raw: false });

  const sheet = workbook.Sheets['Commandes IT'];
  if (!sheet) throw new Error('Onglet "Commandes IT" introuvable dans ce fichier.');

  const rowsRaw  = XLSX.utils.sheet_to_json(sheet, { defval: null, header: 1 });
  const dataRows = rowsRaw.slice(1);

  const opexGroups  = new Map();
  const capexGroups = new Map();
  const opexOrders  = [];
  const capexOrders = [];
  const errors      = [];
  const stats       = { total: dataRows.length, filteredIT: 0, opex: 0, capex: 0, skipped: 0 };

  for (let i = 0; i < dataRows.length; i++) {
    const r = dataRows[i];
    try {
      const rowExercice = normaliseStr(r[8]);
      if (exercice && rowExercice !== String(exercice)) { stats.skipped++; continue; }

      const compte   = normaliseStr(r[19]);
      const lineType = getLineType(compte);
      if (!lineType) { stats.skipped++; continue; }
      stats.filteredIT++;

      const ligne    = parseLigneMaGH2(r, convertHT);
      const groupKey = `${normaliseFournisseur(ligne.fournisseur)}||${ligne.compteOrdonnateur}`;
      const famille  = moteur
        ? reclasser({ fournisseur: ligne.fournisseur, designation: ligne.designation, compteOrdonnateur: ligne.compteOrdonnateur }, moteur).famille
        : (COMPTE_TO_FAMILLE[ligne.compteOrdonnateur] || 'Hors périmètre DSI');
      const status   = mapSageStatus(ligne.etatSage, ligne.engagementNonRecu);

      if (lineType === 'OPEX') {
        stats.opex++;
        if (!opexGroups.has(groupKey)) {
          opexGroups.set(groupKey, {
            id:                genId(),
            supplier:          ligne.fournisseur,
            category:          ligne.libelleCompte,
            compteOrdonnateur: ligne.compteOrdonnateur,
            familleAnalytique: famille,
            budgetAnnuel:      0,
            depenseActuelle:   0,
            engagement:        0,
            montantRealise:    0,
            nbCommandes:       0,
            codeUF:            250,
            notes:             '',
          });
        }
        const grp = opexGroups.get(groupKey);
        grp.depenseActuelle += ligne.mandateNet;
        grp.engagement      += ligne.engagementNonRecu;
        grp.montantRealise  += ligne.montantRealise;
        grp.nbCommandes     += 1;

        opexOrders.push({
          id:                genId(),
          parentId:          grp.id,
          description:       ligne.designation,
          montant:           ligne.montant,
          status,
          dateCommande:      ligne.datePassation,
          dateFacture:       ligne.dateFacture,
          dateReception:     ligne.dateReception,
          reference:         ligne.reference,
          numeroMarche:      0,
          typeCommande:      ligne.typeCommande,
          etatSage:          ligne.etatSage,
          compteOrdonnateur: ligne.compteOrdonnateur,
          notes:             '',
        });

      } else {
        stats.capex++;
        if (!capexGroups.has(groupKey)) {
          capexGroups.set(groupKey, {
            id:                genId(),
            project:           `${ligne.fournisseur} — ${ligne.libelleCompte}`,
            enveloppe:         famille,
            compteOrdonnateur: ligne.compteOrdonnateur,
            budgetTotal:       0,
            depense:           0,
            engagement:        0,
            montantRealise:    0,
            status:            'En cours',
            startDate:         ligne.datePassation,
            endDate:           '',
            notes:             '',
          });
        }
        const grpC = capexGroups.get(groupKey);
        grpC.depense        += ligne.mandateNet;
        grpC.engagement     += ligne.engagementNonRecu;
        grpC.montantRealise += ligne.montantRealise;

        capexOrders.push({
          id:                genId(),
          parentId:          grpC.id,
          description:       ligne.designation,
          montant:           ligne.montant,
          status,
          dateCommande:      ligne.datePassation,
          dateFacture:       ligne.dateFacture,
          dateReception:     ligne.dateReception,
          reference:         ligne.reference,
          numeroMarche:      0,
          typeCommande:      ligne.typeCommande,
          etatSage:          ligne.etatSage,
          compteOrdonnateur: ligne.compteOrdonnateur,
          notes:             '',
        });
      }

    } catch (err) {
      errors.push({ ligne: i + 2, erreur: err.message });
    }
  }

  const round2 = (v) => Math.round(v * 100) / 100;

  return {
    opexSuppliers: [...opexGroups.values()].map(s => ({
      ...s,
      depenseActuelle: round2(s.depenseActuelle),
      engagement:      round2(s.engagement),
      montantRealise:  round2(s.montantRealise),
    })),
    opexOrders,
    capexProjects: [...capexGroups.values()].map(p => ({
      ...p,
      depense:        round2(p.depense),
      engagement:     round2(p.engagement),
      montantRealise: round2(p.montantRealise),
    })),
    capexOrders,
    errors,
    stats,
    sourceFormat: 'MAGH2',
    exercice,
    convertHT,
  };
};
