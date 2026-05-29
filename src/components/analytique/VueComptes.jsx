import React, { useMemo, useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';
import { calculateChargeEngagee, calculateTauxRealisation, calculateResteAEngager, getAlertLevelDSI } from '../../utils/calculations';

const fmt = (n) => formatCurrency(n);
const pct = (n) => n === 0 ? '—' : `${n.toFixed(1)}%`;

const ALERTE_CLASS = {
  critique:   'bg-red-100 text-red-800',
  surveiller: 'bg-orange-100 text-orange-800',
  normal:     'bg-green-100 text-green-700',
};

const TAUX_CLASS = (t) => {
  if (t >= 100) return 'text-red-700 font-bold';
  if (t >= 85)  return 'text-red-500 font-semibold';
  if (t >= 50)  return 'text-orange-500 font-semibold';
  return 'text-green-600';
};

export default function VueComptes({ suppliers = [], eprd = [] }) {
  const [collapsed, setCollapsed] = useState({});

  const eprdMap = useMemo(() =>
    Object.fromEntries(eprd.map(e => [e.compteOrdonnateur, e])),
  [eprd]);

  // Agrégation par compte ordonnateur
  const byCompte = useMemo(() => {
    const map = new Map();
    suppliers.forEach(s => {
      const compte = s.compteOrdonnateur;
      if (!compte) return;
      const eprdEntry = eprdMap[compte];
      const budgetEPRD = (s.budgetAnnuel || 0) || (eprdEntry?.budgetEPRD || 0);
      const libelle = eprdEntry?.libelleCompte || s.category || compte;
      const famille = eprdEntry?.familleAnalytique || s.familleAnalytique || 'Hors périmètre';
      const mandaté  = s.depenseActuelle || 0;
      const engNonRec = s.engagement || 0;
      const charge    = calculateChargeEngagee(mandaté, engNonRec);

      if (!map.has(compte)) {
        map.set(compte, { compte, libelle, famille, budgetEPRD, mandaté: 0, engNonRec: 0, charge: 0 });
      }
      const grp = map.get(compte);
      grp.budgetEPRD = Math.max(grp.budgetEPRD, budgetEPRD);
      grp.mandaté   += mandaté;
      grp.engNonRec += engNonRec;
      grp.charge    += charge;
    });
    return [...map.values()];
  }, [suppliers, eprdMap]);

  // Grouper par famille
  const byFamille = useMemo(() => {
    const map = new Map();
    byCompte.forEach(c => {
      if (!map.has(c.famille)) map.set(c.famille, []);
      map.get(c.famille).push(c);
    });
    return [...map.entries()].sort(([a], [b]) => a.localeCompare(b));
  }, [byCompte]);

  const totaux = useMemo(() => ({
    budgetEPRD: byCompte.reduce((s, c) => s + c.budgetEPRD, 0),
    mandaté:    byCompte.reduce((s, c) => s + c.mandaté, 0),
    engNonRec:  byCompte.reduce((s, c) => s + c.engNonRec, 0),
    charge:     byCompte.reduce((s, c) => s + c.charge, 0),
  }), [byCompte]);

  const toggle = (famille) => setCollapsed(prev => ({ ...prev, [famille]: !prev[famille] }));

  const renderCompteRow = (c) => {
    const taux   = calculateTauxRealisation(c.charge, c.budgetEPRD);
    const reste  = calculateResteAEngager(c.budgetEPRD, c.charge);
    const alerte = getAlertLevelDSI(taux);
    return (
      <tr key={c.compte} className={`border-b hover:bg-gray-50 ${alerte === 'critique' ? 'bg-red-50' : alerte === 'surveiller' ? 'bg-orange-50' : ''}`}>
        <td className="px-3 py-2 border font-mono text-xs text-gray-500 pl-8">{c.compte}</td>
        <td className="px-3 py-2 border text-xs text-gray-700 max-w-xs truncate" title={c.libelle}>{c.libelle}</td>
        <td className="px-3 py-2 border text-right text-gray-600 text-xs">{c.budgetEPRD > 0 ? fmt(c.budgetEPRD) : '—'}</td>
        <td className="px-3 py-2 border text-right text-indigo-700 font-semibold text-xs">{fmt(c.mandaté)}</td>
        <td className="px-3 py-2 border text-right text-yellow-700 text-xs">{fmt(c.engNonRec)}</td>
        <td className="px-3 py-2 border text-right font-bold text-xs">{fmt(c.charge)}</td>
        <td className={`px-3 py-2 border text-right text-xs ${TAUX_CLASS(taux)}`}>{c.budgetEPRD > 0 ? pct(taux) : '—'}</td>
        <td className={`px-3 py-2 border text-right text-xs ${reste < 0 ? 'text-red-600 font-bold' : 'text-green-700'}`}>
          {c.budgetEPRD > 0 ? fmt(reste) : '—'}
        </td>
        <td className="px-3 py-2 border text-center">
          <span className={`px-2 py-0.5 rounded text-xs font-medium ${ALERTE_CLASS[alerte]}`}>
            {alerte === 'critique' ? '🔴 >85%' : alerte === 'surveiller' ? '🟠 >50%' : '🟢 OK'}
          </span>
        </td>
      </tr>
    );
  };

  const renderFamilleRow = (famille, comptes) => {
    const isOpen = !collapsed[famille];
    const subtotaux = {
      budgetEPRD: comptes.reduce((s, c) => s + c.budgetEPRD, 0),
      mandaté:    comptes.reduce((s, c) => s + c.mandaté, 0),
      engNonRec:  comptes.reduce((s, c) => s + c.engNonRec, 0),
      charge:     comptes.reduce((s, c) => s + c.charge, 0),
    };
    const taux  = calculateTauxRealisation(subtotaux.charge, subtotaux.budgetEPRD);
    const reste = calculateResteAEngager(subtotaux.budgetEPRD, subtotaux.charge);
    return (
      <React.Fragment key={famille}>
        <tr
          className="bg-blue-50 border-t-2 border-blue-200 cursor-pointer hover:bg-blue-100"
          onClick={() => toggle(famille)}
        >
          <td className="px-3 py-2 border font-bold text-blue-800 text-sm" colSpan={2}>
            <span className="flex items-center gap-2">
              {isOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
              {famille}
              <span className="text-xs font-normal text-blue-600">({comptes.length} compte{comptes.length > 1 ? 's' : ''})</span>
            </span>
          </td>
          <td className="px-3 py-2 border text-right font-semibold text-blue-800">{subtotaux.budgetEPRD > 0 ? fmt(subtotaux.budgetEPRD) : '—'}</td>
          <td className="px-3 py-2 border text-right font-semibold text-indigo-700">{fmt(subtotaux.mandaté)}</td>
          <td className="px-3 py-2 border text-right font-semibold text-yellow-700">{fmt(subtotaux.engNonRec)}</td>
          <td className="px-3 py-2 border text-right font-bold">{fmt(subtotaux.charge)}</td>
          <td className={`px-3 py-2 border text-right font-bold ${TAUX_CLASS(taux)}`}>{subtotaux.budgetEPRD > 0 ? pct(taux) : '—'}</td>
          <td className={`px-3 py-2 border text-right font-bold ${reste < 0 ? 'text-red-600' : 'text-green-700'}`}>{subtotaux.budgetEPRD > 0 ? fmt(reste) : '—'}</td>
          <td className="px-3 py-2 border"></td>
        </tr>
        {isOpen && comptes.sort((a, b) => a.compte.localeCompare(b.compte)).map(renderCompteRow)}
      </React.Fragment>
    );
  };

  if (byCompte.length === 0) {
    return (
      <div className="p-8 text-center text-gray-500">
        <p className="text-lg font-medium mb-2">Aucune donnée disponible</p>
        <p className="text-sm">Importez d'abord une extraction SAGE via l'onglet OPEX → Importer.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 p-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-800">Vue par comptes ordonnateurs — DSITM/HFAR 2026</h2>
        <span className="text-xs bg-blue-50 text-blue-700 border border-blue-200 px-3 py-1 rounded-full">
          {byCompte.length} compte{byCompte.length > 1 ? 's' : ''} actif{byCompte.length > 1 ? 's' : ''}
        </span>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'EPRD Total',      value: fmt(totaux.budgetEPRD),  color: 'blue'   },
          { label: 'Mandaté',         value: fmt(totaux.mandaté),     color: 'indigo' },
          { label: 'Engagé non reçu', value: fmt(totaux.engNonRec),   color: 'yellow' },
          { label: 'Charge totale',   value: fmt(totaux.charge),      color: 'orange' },
        ].map(({ label, value, color }) => (
          <div key={label} className={`bg-${color}-50 border border-${color}-200 rounded-lg p-3`}>
            <div className={`text-xs text-${color}-600 font-medium`}>{label}</div>
            <div className={`text-base font-bold text-${color}-800`}>{value}</div>
          </div>
        ))}
      </div>

      {/* Tableau */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-gray-100 text-gray-700 text-xs">
              <th className="text-left px-3 py-2 border w-36">Compte</th>
              <th className="text-left px-3 py-2 border">Libellé</th>
              <th className="text-right px-3 py-2 border w-28">EPRD</th>
              <th className="text-right px-3 py-2 border w-28">Mandaté</th>
              <th className="text-right px-3 py-2 border w-28">Engagé n.r.</th>
              <th className="text-right px-3 py-2 border w-28">Charge totale</th>
              <th className="text-right px-3 py-2 border w-20">Taux réal.</th>
              <th className="text-right px-3 py-2 border w-28">Reste</th>
              <th className="text-center px-3 py-2 border w-24">Alerte</th>
            </tr>
          </thead>
          <tbody>
            {byFamille.map(([famille, comptes]) => renderFamilleRow(famille, comptes))}
          </tbody>
          <tfoot>
            <tr className="bg-gray-200 font-bold border-t-2 text-sm">
              <td className="px-3 py-2 border" colSpan={2}>TOTAL GÉNÉRAL</td>
              <td className="px-3 py-2 border text-right text-blue-800">{fmt(totaux.budgetEPRD)}</td>
              <td className="px-3 py-2 border text-right text-indigo-700">{fmt(totaux.mandaté)}</td>
              <td className="px-3 py-2 border text-right text-yellow-700">{fmt(totaux.engNonRec)}</td>
              <td className="px-3 py-2 border text-right">{fmt(totaux.charge)}</td>
              <td className={`px-3 py-2 border text-right ${TAUX_CLASS(calculateTauxRealisation(totaux.charge, totaux.budgetEPRD))}`}>
                {pct(calculateTauxRealisation(totaux.charge, totaux.budgetEPRD))}
              </td>
              <td className={`px-3 py-2 border text-right ${calculateResteAEngager(totaux.budgetEPRD, totaux.charge) < 0 ? 'text-red-600' : 'text-green-700'}`}>
                {fmt(calculateResteAEngager(totaux.budgetEPRD, totaux.charge))}
              </td>
              <td className="px-3 py-2 border"></td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Légende */}
      <div className="bg-gray-50 border rounded-lg p-3 text-xs text-gray-600 flex flex-wrap gap-4">
        <span><span className="font-semibold text-indigo-700">Mandaté</span> — montant mandaté net (col. 22 SAGE)</span>
        <span><span className="font-semibold text-yellow-700">Engagé n.r.</span> — engagé non reçu (col. 19 SAGE)</span>
        <span><span className="font-semibold">Charge totale</span> — mandaté + engagé non reçu</span>
        <span><span className="font-semibold text-red-700">🔴 Critique</span> ≥ 85% | <span className="font-semibold text-orange-500">🟠 Surveiller</span> ≥ 50% | <span className="font-semibold text-green-600">🟢 OK</span> &lt; 50%</span>
      </div>
    </div>
  );
}
