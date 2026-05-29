import React, { useMemo, useState } from 'react';
import { TrendingUp, AlertTriangle, ChevronRight, ChevronDown, Package, Calendar, Building2 } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';
import { calculateChargeEngagee, calculateProjections } from '../../utils/calculations';
import { BUDGET_EPRD_TOTAL_OPEX_SI, NB_MOIS_REALISES } from '../../constants/analytiqueConstants';

const fmt = (n) => formatCurrency(n);
const pct = (n, total) => total > 0 ? `${((n / total) * 100).toFixed(0)} %` : '—';

const TRIMESTRES = [
  { id: 'Q1', label: 'Q1 — Jan · Fév · Mar', months: [0, 1, 2] },
  { id: 'Q2', label: 'Q2 — Avr · Mai · Jun', months: [3, 4, 5] },
  { id: 'Q3', label: 'Q3 — Jul · Aoû · Sep', months: [6, 7, 8] },
  { id: 'Q4', label: 'Q4 — Oct · Nov · Déc', months: [9, 10, 11] },
];

const getQuarter = (dateStr) => {
  if (!dateStr) return null;
  const d = new Date(dateStr);
  if (isNaN(d)) return null;
  const m = d.getMonth(); // 0-based
  return TRIMESTRES.find(q => q.months.includes(m))?.id ?? null;
};

// ── Niveau 4 : commandes ────────────────────────────────────────────────────

const DrillCommandes = ({ orders }) => {
  if (!orders.length) {
    return <div className="px-4 py-3 text-xs text-gray-400 italic">Aucune commande trouvée.</div>;
  }
  const sorted = [...orders].sort((a, b) => (b.dateCommande || '').localeCompare(a.dateCommande || ''));
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-xs border-collapse">
        <thead>
          <tr className="bg-gray-50 text-gray-500">
            <th className="text-left px-3 py-1.5 border-b">Date cmd</th>
            <th className="text-left px-3 py-1.5 border-b">Référence</th>
            <th className="text-left px-3 py-1.5 border-b">Désignation</th>
            <th className="text-left px-3 py-1.5 border-b">Statut</th>
            <th className="text-right px-3 py-1.5 border-b">Montant</th>
          </tr>
        </thead>
        <tbody>
          {sorted.map(o => (
            <tr key={o.id} className="border-b hover:bg-gray-50">
              <td className="px-3 py-1.5 text-gray-500 whitespace-nowrap">{o.dateCommande || '—'}</td>
              <td className="px-3 py-1.5 font-mono text-gray-600">{o.reference || o.numeroMarche || '—'}</td>
              <td className="px-3 py-1.5 text-gray-800 max-w-xs truncate" title={o.description}>{o.description || '—'}</td>
              <td className="px-3 py-1.5 text-gray-500">{o.etatSage || o.status || '—'}</td>
              <td className="px-3 py-1.5 text-right font-semibold text-indigo-700">{fmt(o.montant || 0)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// ── Niveau 3 : fournisseurs / éditeurs ─────────────────────────────────────

const DrillFournisseurs = ({ orders, suppliers }) => {
  const [openFourn, setOpenFourn] = useState(null);

  const supplierMap = useMemo(() =>
    Object.fromEntries(suppliers.map(s => [String(s.id), s.nom || s.supplier || s.fournisseur || s.name || ''])),
  [suppliers]);

  const byFourn = useMemo(() => {
    const map = new Map();
    orders.forEach(o => {
      const key = String(o.parentId ?? '');
      const nom = supplierMap[key] || o.fournisseur || `Fournisseur #${key}`;
      if (!map.has(key)) map.set(key, { key, nom, montant: 0, orders: [] });
      const g = map.get(key);
      g.montant += o.montant || 0;
      g.orders.push(o);
    });
    return [...map.values()].sort((a, b) => b.montant - a.montant);
  }, [orders, supplierMap]);

  const total = byFourn.reduce((s, f) => s + f.montant, 0);

  return (
    <div className="divide-y divide-gray-100">
      {byFourn.map(f => {
        const isOpen = openFourn === f.key;
        return (
          <div key={f.key}>
            <button
              onClick={() => setOpenFourn(isOpen ? null : f.key)}
              className="w-full flex items-center gap-2 px-4 py-2 text-xs hover:bg-violet-50 transition-colors text-left"
            >
              {isOpen
                ? <ChevronDown size={12} className="text-violet-500 flex-shrink-0" />
                : <ChevronRight size={12} className="text-violet-400 flex-shrink-0" />}
              <Building2 size={12} className="text-violet-400 flex-shrink-0" />
              <span className="flex-1 font-medium text-gray-800">{f.nom}</span>
              <span className="text-gray-400 mr-4">{f.orders.length} cmd</span>
              <span className="text-gray-500 w-16 text-right">{pct(f.montant, total)}</span>
              <span className="font-semibold text-violet-700 w-28 text-right">{fmt(f.montant)}</span>
            </button>
            {isOpen && (
              <div className="bg-white border-t border-violet-100 ml-8">
                <DrillCommandes orders={f.orders} />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

// ── Niveau 2 : trimestres ───────────────────────────────────────────────────

const DrillTrimestres = ({ compteOrders, suppliers, nbMoisRealises }) => {
  const [openQ, setOpenQ] = useState(null);

  // Mois déjà réalisés (0-based)
  const moisRealises = useMemo(() => {
    const set = new Set();
    for (let i = 0; i < nbMoisRealises; i++) set.add(i);
    return set;
  }, [nbMoisRealises]);

  const byQ = useMemo(() => {
    const map = new Map(TRIMESTRES.map(q => [q.id, { ...q, montant: 0, orders: [] }]));
    compteOrders.forEach(o => {
      const q = getQuarter(o.dateCommande);
      if (q && map.has(q)) {
        map.get(q).montant += o.montant || 0;
        map.get(q).orders.push(o);
      }
    });
    return TRIMESTRES.map(q => map.get(q.id));
  }, [compteOrders]);

  const total = byQ.reduce((s, q) => s + q.montant, 0);

  const isRealise = (q) => q.months.some(m => moisRealises.has(m));

  return (
    <div className="divide-y divide-gray-100">
      {byQ.map(q => {
        const realise = isRealise(q);
        const isOpen = openQ === q.id;
        const hasData = q.orders.length > 0;

        return (
          <div key={q.id}>
            <button
              disabled={!realise || !hasData}
              onClick={() => realise && hasData && setOpenQ(isOpen ? null : q.id)}
              className={`w-full flex items-center gap-2 px-4 py-2 text-xs text-left transition-colors
                ${realise && hasData ? 'hover:bg-blue-50 cursor-pointer' : 'cursor-default opacity-50'}`}
            >
              {realise && hasData
                ? (isOpen
                    ? <ChevronDown size={12} className="text-blue-500 flex-shrink-0" />
                    : <ChevronRight size={12} className="text-blue-400 flex-shrink-0" />)
                : <span className="w-3 flex-shrink-0" />}
              <Calendar size={12} className={`flex-shrink-0 ${realise ? 'text-blue-400' : 'text-gray-300'}`} />
              <span className={`flex-1 font-medium ${realise ? 'text-gray-800' : 'text-gray-400'}`}>{q.label}</span>
              {realise
                ? <>
                    <span className="text-gray-400 mr-4">{q.orders.length} cmd</span>
                    <span className="text-gray-500 w-16 text-right">{pct(q.montant, total)}</span>
                    <span className="font-semibold text-blue-700 w-28 text-right">{fmt(q.montant)}</span>
                  </>
                : <span className="text-gray-300 text-xs italic">Non réalisé</span>}
            </button>
            {isOpen && (
              <div className="bg-white border-t border-blue-100 ml-8">
                {q.orders.length === 0
                  ? <p className="px-4 py-3 text-xs text-gray-400 italic">Aucune commande pour ce trimestre.</p>
                  : <DrillFournisseurs orders={q.orders} suppliers={suppliers} />}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

// ── Niveau 1 : tableau principal ────────────────────────────────────────────

const MOIS_LABELS = ['','Jan','Fév','Mar','Avr','Mai','Jun','Jul','Aoû','Sep','Oct','Nov','Déc'];

export default function ProjectionAnnuelle({ suppliers = [], orders = [], eprd = [], nbMoisRealises: nbMoisProp = NB_MOIS_REALISES }) {
  const [openCompte, setOpenCompte] = useState(null);
  const [nbMoisRealises, setNbMoisRealises] = useState(nbMoisProp);

  const eprdMap = useMemo(() =>
    Object.fromEntries(eprd.map(e => [e.compteOrdonnateur, e])),
  [eprd]);

  // Index orders par compte ordonnateur
  const ordersByCompte = useMemo(() => {
    const map = new Map();
    orders.forEach(o => {
      const c = o.compteOrdonnateur;
      if (!c) return;
      if (!map.has(c)) map.set(c, []);
      map.get(c).push(o);
    });
    return map;
  }, [orders]);

  const byCompte = useMemo(() => {
    const map = new Map();

    // 1) Initialiser depuis eprd[] — tous les comptes budgétés, même sans commandes importées
    eprd.forEach(e => {
      map.set(e.compteOrdonnateur, {
        compte:       e.compteOrdonnateur,
        libelle:      e.libelleCompte || e.compteOrdonnateur,
        budgetEPRD:   e.budgetEPRD || 0,
        chargeEngagee: 0,
      });
    });

    // 2) Ajouter les charges et comptes hors-EPRD depuis les suppliers importés
    suppliers.forEach(s => {
      const compte = s.compteOrdonnateur;
      if (!compte) return;
      const eprdEntry = eprdMap[compte];
      const charge   = calculateChargeEngagee(s.depenseActuelle || 0, s.engagement || 0);

      if (!map.has(compte)) {
        map.set(compte, {
          compte,
          libelle:    s.category || eprdEntry?.libelleCompte || compte,
          budgetEPRD: eprdEntry?.budgetEPRD || 0,
          chargeEngagee: 0,
        });
      }
      map.get(compte).chargeEngagee += charge;
    });

    return [...map.values()].sort((a, b) => b.chargeEngagee - a.chargeEngagee);
  }, [suppliers, eprd, eprdMap]);

  const totaux = useMemo(() => ({
    budgetEPRD:    byCompte.reduce((s, c) => s + c.budgetEPRD, 0) || BUDGET_EPRD_TOTAL_OPEX_SI,
    chargeEngagee: byCompte.reduce((s, c) => s + c.chargeEngagee, 0),
  }), [byCompte]);

  const totalProj = calculateProjections(totaux.chargeEngagee, totaux.budgetEPRD, nbMoisRealises);

  const depassements = byCompte.filter(c => {
    const p = calculateProjections(c.chargeEngagee, c.budgetEPRD, nbMoisRealises);
    return p.worstCase > c.budgetEPRD && c.budgetEPRD > 0;
  });

  return (
    <div className="space-y-6 p-4">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-800">Projection annuelle — DSITM/HFAR 2026</h2>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500">Mois réalisés :</span>
          <select
            value={nbMoisRealises}
            onChange={e => setNbMoisRealises(Number(e.target.value))}
            className="text-xs border border-blue-200 bg-blue-50 text-blue-700 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-400"
          >
            {Array.from({ length: 12 }, (_, i) => i + 1).map(m => (
              <option key={m} value={m}>{m} — Jan–{MOIS_LABELS[m]}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Alerte dépassements */}
      {depassements.length > 0 && (
        <div className="bg-red-50 border border-red-300 rounded-lg p-4 flex gap-3">
          <AlertTriangle size={20} className="text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-red-800 text-sm">
              {depassements.length} compte(s) en risque de dépassement (scénario worst case) :
            </p>
            <ul className="mt-1 text-xs text-red-700 list-disc ml-4">
              {depassements.map(c => {
                const p = calculateProjections(c.chargeEngagee, c.budgetEPRD, nbMoisRealises);
                return <li key={c.compte}>{c.compte} — {c.libelle} : dépassement estimé {fmt(p.depassementWorstCase)}</li>;
              })}
            </ul>
          </div>
        </div>
      )}

      {/* Tableau principal avec drill-down */}
      <div className="border rounded-lg overflow-hidden">
        {/* En-têtes */}
        <div className="bg-gray-100 grid grid-cols-[1fr_2fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr_32px] text-xs text-gray-600 font-medium">
          <div className="px-3 py-2">Compte</div>
          <div className="px-3 py-2">Libellé</div>
          <div className="px-3 py-2 text-right">EPRD</div>
          <div className="px-3 py-2 text-right">Charge ({nbMoisRealises}M)</div>
          <div className="px-3 py-2 text-right">Linéaire</div>
          <div className="px-3 py-2 text-right text-green-700">Best −5%</div>
          <div className="px-3 py-2 text-right">Central +10%</div>
          <div className="px-3 py-2 text-right">Worst +25%</div>
          <div className="px-3 py-2 text-right">Reste</div>
          <div />
        </div>

        {/* Lignes N1 */}
        {byCompte.map(c => {
          const p = calculateProjections(c.chargeEngagee, c.budgetEPRD, nbMoisRealises);
          const worstOver = p.worstCase > c.budgetEPRD && c.budgetEPRD > 0;
          const isOpen = openCompte === c.compte;
          const compteOrders = ordersByCompte.get(c.compte) || [];
          const hasOrders = compteOrders.length > 0;

          return (
            <div key={c.compte} className="border-t">
              {/* Ligne principale cliquable */}
              <div
                role="button"
                tabIndex={0}
                onClick={() => hasOrders && setOpenCompte(isOpen ? null : c.compte)}
                onKeyDown={e => e.key === 'Enter' && hasOrders && setOpenCompte(isOpen ? null : c.compte)}
                className={`grid grid-cols-[1fr_2fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr_32px] text-xs items-center
                  ${isOpen ? 'bg-indigo-50' : worstOver ? 'bg-red-50 hover:bg-red-100' : 'bg-white hover:bg-gray-50'}
                  ${hasOrders ? 'cursor-pointer' : 'cursor-default'} select-none transition-colors`}
              >
                <div className="px-3 py-2.5 font-mono text-gray-500">{c.compte}</div>
                <div className="px-3 py-2.5 text-gray-800 truncate" title={c.libelle}>{c.libelle}</div>
                <div className="px-3 py-2.5 text-right text-gray-600">{c.budgetEPRD > 0 ? fmt(c.budgetEPRD) : '—'}</div>
                <div className="px-3 py-2.5 text-right text-indigo-700 font-semibold">{fmt(c.chargeEngagee)}</div>
                <div className="px-3 py-2.5 text-right text-blue-700">{fmt(p.lineaire)}</div>
                <div className="px-3 py-2.5 text-right text-green-700">{fmt(p.bestCase)}</div>
                <div className="px-3 py-2.5 text-right text-orange-600">{fmt(p.central)}</div>
                <div className={`px-3 py-2.5 text-right font-semibold ${worstOver ? 'text-red-700' : 'text-gray-600'}`}>{fmt(p.worstCase)}</div>
                <div className={`px-3 py-2.5 text-right ${p.resteAEngager < 0 ? 'text-red-600 font-semibold' : 'text-green-700'}`}>
                  {c.budgetEPRD > 0 ? fmt(p.resteAEngager) : '—'}
                </div>
                <div className="flex items-center justify-center">
                  {hasOrders
                    ? (isOpen
                        ? <ChevronDown size={14} className="text-indigo-500" />
                        : <ChevronRight size={14} className="text-gray-400" />)
                    : null}
                </div>
              </div>

              {/* Drill-down N2 : trimestres */}
              {isOpen && (
                <div className="bg-indigo-50 border-t border-indigo-100">
                  <div className="flex items-center gap-2 px-4 py-1.5 text-xs text-indigo-600 font-medium border-b border-indigo-100">
                    <TrendingUp size={11} />
                    <span>Répartition trimestrielle — {compteOrders.length} commande(s)</span>
                  </div>
                  <DrillTrimestres
                    compteOrders={compteOrders}
                    suppliers={suppliers}
                    nbMoisRealises={nbMoisRealises}
                  />
                </div>
              )}
            </div>
          );
        })}

        {/* Ligne total */}
        <div className="bg-gray-100 border-t-2 border-gray-300 grid grid-cols-[1fr_2fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr_32px] text-xs font-bold">
          <div className="px-3 py-2.5 col-span-2">TOTAL DSITM</div>
          <div className="px-3 py-2.5 text-right">{fmt(totaux.budgetEPRD)}</div>
          <div className="px-3 py-2.5 text-right text-indigo-700">{fmt(totaux.chargeEngagee)}</div>
          <div className="px-3 py-2.5 text-right text-blue-700">{fmt(totalProj.lineaire)}</div>
          <div className="px-3 py-2.5 text-right text-green-700">{fmt(totalProj.bestCase)}</div>
          <div className="px-3 py-2.5 text-right text-orange-600">{fmt(totalProj.central)}</div>
          <div className={`px-3 py-2.5 text-right ${totalProj.depassementWorstCase > 0 ? 'text-red-700' : 'text-gray-700'}`}>{fmt(totalProj.worstCase)}</div>
          <div className={`px-3 py-2.5 text-right ${totalProj.resteAEngager < 0 ? 'text-red-600' : 'text-green-700'}`}>{fmt(totalProj.resteAEngager)}</div>
          <div />
        </div>
      </div>

      {/* Légende */}
      <div className="bg-gray-50 border rounded-lg p-4 text-xs text-gray-600 grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div><span className="font-semibold text-blue-700">Linéaire</span> — Charge × 12 / {nbMoisRealises} (extrapolation pure)</div>
        <div><span className="font-semibold text-green-700">Best −5%</span> — Charge × 0,95 (légère sous-consommation)</div>
        <div><span className="font-semibold text-orange-600">Central +10%</span> — Charge × 1,10 (légère hausse)</div>
        <div><span className="font-semibold text-red-700">Worst +25%</span> — Charge × 1,25 (forte hausse / imprévus)</div>
      </div>

      {byCompte.length === 0 && (
        <div className="text-center py-12 text-gray-400 text-sm">
          Aucune donnée OPEX — importez un fichier SAGE ou ajoutez des fournisseurs.
        </div>
      )}
    </div>
  );
}
