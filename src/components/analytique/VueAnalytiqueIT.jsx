import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { formatCurrency } from '../../utils/formatters';
import { calculateChargeEngagee, calculateTauxRealisation, calculateResteAEngager, getAlertLevelDSI } from '../../utils/calculations';
import { BUDGET_EPRD_TOTAL_OPEX_SI } from '../../constants/analytiqueConstants';

const ALERTE_BADGE = {
  critique:   'bg-red-100 text-red-800 border border-red-300',
  surveiller: 'bg-orange-100 text-orange-800 border border-orange-300',
  normal:     'bg-green-100 text-green-700 border border-green-300',
};
const ALERTE_LABEL = { critique: '🔴 Critique', surveiller: '🟠 Surveiller', normal: '🟢 Normal' };

const fmt = (n) => formatCurrency(n);
const pct = (n) => `${n.toFixed(1)}%`;

export default function VueAnalytiqueIT({ suppliers = [], eprd = [] }) {
  // Construire une map compte → EPRD
  const eprdMap = useMemo(() =>
    Object.fromEntries(eprd.map(e => [e.compteOrdonnateur, e])),
  [eprd]);

  // Agréger par famille analytique
  const byFamille = useMemo(() => {
    const map = new Map();

    // 1) Initialiser le budget EPRD une fois par compte (pas par supplier)
    eprd.forEach(e => {
      const famille = e.familleAnalytique || 'Non classé';
      if (!map.has(famille)) map.set(famille, { famille, budgetEPRD: 0, chargeEngagee: 0, lignes: [] });
      map.get(famille).budgetEPRD += e.budgetEPRD || 0;
    });

    // 2) Accumuler la charge engagée depuis les suppliers
    suppliers.forEach(s => {
      const eprdEntry = eprdMap[s.compteOrdonnateur];
      const famille   = s.familleAnalytique || eprdEntry?.familleAnalytique || 'Non classé';
      const charge    = calculateChargeEngagee(s.depenseActuelle || 0, s.engagement || 0);

      if (!map.has(famille)) map.set(famille, { famille, budgetEPRD: 0, chargeEngagee: 0, lignes: [] });
      const grp = map.get(famille);
      grp.chargeEngagee += charge;
      grp.lignes.push({ ...s, budgetEPRD: eprdEntry?.budgetEPRD || 0, chargeEngagee: charge });
    });

    return [...map.values()].sort((a, b) => b.chargeEngagee - a.chargeEngagee);
  }, [suppliers, eprd, eprdMap]);

  // Totaux globaux
  const totaux = useMemo(() => ({
    budgetEPRD:   eprd.reduce((s, e) => s + (e.budgetEPRD || 0), 0) || BUDGET_EPRD_TOTAL_OPEX_SI,
    chargeEngagee: byFamille.reduce((s, f) => s + f.chargeEngagee, 0),
  }), [byFamille, eprd]);

  const chartData = byFamille.map(f => ({
    name:         f.famille.length > 20 ? f.famille.slice(0, 18) + '…' : f.famille,
    fullName:     f.famille,
    EPRD:         Math.round(f.budgetEPRD),
    'Charge engagée': Math.round(f.chargeEngagee),
  }));

  return (
    <div className="space-y-6 p-4">
      <h2 className="text-xl font-bold text-gray-800">Vue analytique IT — DSITM/HFAR 2026</h2>

      {/* KPIs globaux */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'EPRD total OPEX', value: fmt(totaux.budgetEPRD), color: 'blue' },
          { label: 'Charge engagée', value: fmt(totaux.chargeEngagee), color: 'indigo' },
          { label: 'Taux réalisation', value: pct(calculateTauxRealisation(totaux.chargeEngagee, totaux.budgetEPRD)), color: 'orange' },
          { label: 'Reste à engager', value: fmt(calculateResteAEngager(totaux.budgetEPRD, totaux.chargeEngagee)), color: 'green' },
        ].map(({ label, value, color }) => (
          <div key={label} className={`bg-${color}-50 border border-${color}-200 rounded-lg p-3`}>
            <div className={`text-xs text-${color}-600 font-medium`}>{label}</div>
            <div className={`text-base sm:text-lg font-bold text-${color}-800`}>{value}</div>
          </div>
        ))}
      </div>

      {/* Graphique */}
      <div className="bg-white border rounded-lg p-4">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Charge engagée vs EPRD par famille</h3>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={chartData} margin={{ top: 4, right: 16, left: 0, bottom: 60 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" tick={{ fontSize: 11 }} angle={-30} textAnchor="end" interval={0} />
            <YAxis tickFormatter={v => `${(v / 1000).toFixed(0)}k`} tick={{ fontSize: 11 }} />
            <Tooltip formatter={(v) => fmt(v)} labelFormatter={(_, p) => p?.[0]?.payload?.fullName || ''} />
            <Legend />
            <Bar dataKey="EPRD" fill="#93c5fd" name="EPRD" />
            <Bar dataKey="Charge engagée" fill="#6366f1" name="Charge engagée" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Tableau croisé */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-gray-100 text-gray-700 text-xs">
              <th className="text-left px-3 py-2 border">Famille analytique</th>
              <th className="text-right px-3 py-2 border">EPRD</th>
              <th className="text-right px-3 py-2 border">Charge engagée</th>
              <th className="text-right px-3 py-2 border">Taux réal.</th>
              <th className="text-right px-3 py-2 border">Reste à engager</th>
              <th className="text-center px-3 py-2 border">Alerte</th>
            </tr>
          </thead>
          <tbody>
            {byFamille.map(f => {
              const taux   = calculateTauxRealisation(f.chargeEngagee, f.budgetEPRD);
              const reste  = calculateResteAEngager(f.budgetEPRD, f.chargeEngagee);
              const alerte = getAlertLevelDSI(taux);
              return (
                <tr key={f.famille} className="hover:bg-gray-50 border-b">
                  <td className="px-3 py-2 border font-medium text-gray-800">{f.famille}</td>
                  <td className="px-3 py-2 border text-right text-gray-700">{fmt(f.budgetEPRD)}</td>
                  <td className="px-3 py-2 border text-right text-indigo-700 font-semibold">{fmt(f.chargeEngagee)}</td>
                  <td className={`px-3 py-2 border text-right font-semibold ${alerte === 'critique' ? 'text-red-600' : alerte === 'surveiller' ? 'text-orange-500' : 'text-green-600'}`}>
                    {f.budgetEPRD > 0 ? pct(taux) : '—'}
                  </td>
                  <td className={`px-3 py-2 border text-right ${reste < 0 ? 'text-red-600 font-semibold' : 'text-gray-700'}`}>{fmt(reste)}</td>
                  <td className="px-3 py-2 border text-center">
                    <span className={`inline-block px-2 py-0.5 rounded text-xs ${ALERTE_BADGE[alerte]}`}>{ALERTE_LABEL[alerte]}</span>
                  </td>
                </tr>
              );
            })}
            {/* Ligne total */}
            <tr className="bg-gray-100 font-bold border-t-2">
              <td className="px-3 py-2 border">TOTAL DSITM</td>
              <td className="px-3 py-2 border text-right">{fmt(totaux.budgetEPRD)}</td>
              <td className="px-3 py-2 border text-right text-indigo-700">{fmt(totaux.chargeEngagee)}</td>
              <td className={`px-3 py-2 border text-right ${calculateTauxRealisation(totaux.chargeEngagee, totaux.budgetEPRD) >= 85 ? 'text-red-600' : 'text-gray-800'}`}>
                {pct(calculateTauxRealisation(totaux.chargeEngagee, totaux.budgetEPRD))}
              </td>
              <td className={`px-3 py-2 border text-right ${calculateResteAEngager(totaux.budgetEPRD, totaux.chargeEngagee) < 0 ? 'text-red-600' : 'text-green-700'}`}>
                {fmt(calculateResteAEngager(totaux.budgetEPRD, totaux.chargeEngagee))}
              </td>
              <td className="px-3 py-2 border"></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
