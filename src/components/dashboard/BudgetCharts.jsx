/**
 * Composant BudgetCharts - Tableaux de bord de pilotage budgétaire
 * Vue Stratégique : KPIs, atterrissage, répartition
 * Vue Opérationnelle : suivi mensuel, courbe de consommation, risques
 */

import React, { useState, useMemo } from 'react';
import {
  PieChart, Pie, Cell,
  BarChart, Bar,
  LineChart, Line,
  ComposedChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, ReferenceLine
} from 'recharts';
import { TrendingUp, TrendingDown, Target, AlertTriangle, BarChart3, Activity } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';
import { COLORS, CATEGORY_COLORS, formatK, CustomTooltip } from '../../utils/chartUtils';
import { ORDER_IMPACT } from '../../constants/orderConstants';

const MONTHS = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'];

/** KPI Card */
const KpiCard = ({ label, value, subtitle, icon: Icon, color = 'blue', trend }) => {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-700 border-blue-200',
    green: 'bg-green-50 text-green-700 border-green-200',
    orange: 'bg-orange-50 text-orange-700 border-orange-200',
    red: 'bg-red-50 text-red-700 border-red-200',
    purple: 'bg-purple-50 text-purple-700 border-purple-200',
    gray: 'bg-gray-50 text-gray-700 border-gray-200'
  };
  return (
    <div className={`rounded-lg border p-3 sm:p-4 ${colorClasses[color] || colorClasses.blue}`}>
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs sm:text-sm font-medium opacity-80">{label}</span>
        {Icon && <Icon size={16} className="opacity-60" />}
      </div>
      <div className="text-lg sm:text-xl md:text-2xl font-bold">{value}</div>
      {subtitle && (
        <div className="text-xs mt-1 opacity-70 flex items-center gap-1">
          {trend === 'up' && <TrendingUp size={12} />}
          {trend === 'down' && <TrendingDown size={12} />}
          {subtitle}
        </div>
      )}
    </div>
  );
};

export const BudgetCharts = ({ opexTotals, capexTotals, suppliers = [], projects = [], opexOrders = [], capexOrders = [] }) => {
  const [view, setView] = useState('strategic');
  const currentMonth = new Date().getMonth(); // 0-indexed
  const monthsElapsed = currentMonth + 1;

  // ── Données calculées ──────────────────────────────
  const computed = useMemo(() => {
    const totalBudget = opexTotals.budget + capexTotals.budget;
    const totalDepense = opexTotals.depense + capexTotals.depense;
    const totalEngagement = opexTotals.engagement + capexTotals.engagement;
    const totalConsomme = totalDepense + totalEngagement;
    const totalDisponible = totalBudget - totalConsomme;
    const tauxGlobal = totalBudget > 0 ? (totalConsomme / totalBudget) * 100 : 0;

    // Atterrissage : projection linéaire basée sur la consommation actuelle
    const rythme = monthsElapsed > 0 ? totalDepense / monthsElapsed : 0;
    const atterrissageTotal = rythme * 12 + totalEngagement;
    const atterrissageOpex = monthsElapsed > 0
      ? (opexTotals.depense / monthsElapsed) * 12 + opexTotals.engagement
      : opexTotals.engagement;
    const atterrissageCapex = monthsElapsed > 0
      ? (capexTotals.depense / monthsElapsed) * 12 + capexTotals.engagement
      : capexTotals.engagement;

    // Commandes actives (non annulées, non payées)
    const activeOrders = [...opexOrders, ...capexOrders].filter(o =>
      ORDER_IMPACT[o.status] !== null && o.status !== 'Payée'
    );

    // OPEX par catégorie
    const categoryMap = {};
    suppliers.forEach(s => {
      const cat = s.category || 'Autre';
      if (!categoryMap[cat]) categoryMap[cat] = { budget: 0, depense: 0, engagement: 0 };
      categoryMap[cat].budget += s.budgetAnnuel || 0;
      categoryMap[cat].depense += s.depenseActuelle || 0;
      categoryMap[cat].engagement += s.engagement || 0;
    });
    const categoryData = Object.entries(categoryMap)
      .map(([name, data]) => ({ name, ...data, consomme: data.depense + data.engagement }))
      .sort((a, b) => b.budget - a.budget);

    // Données mensuelles (répartition linéaire pour simulation)
    const monthlyData = MONTHS.map((name, i) => {
      const isPast = i < monthsElapsed;
      const isCurrent = i === currentMonth;
      // Répartition linéaire de la dépense réelle sur les mois écoulés
      const opexMensuel = isPast ? opexTotals.depense / monthsElapsed : 0;
      const capexMensuel = isPast ? capexTotals.depense / monthsElapsed : 0;
      // Budget linéaire mensuel
      const budgetMensuelOpex = opexTotals.budget / 12;
      const budgetMensuelCapex = capexTotals.budget / 12;

      return {
        name,
        month: i,
        isPast,
        isCurrent,
        opex: Math.round(opexMensuel),
        capex: Math.round(capexMensuel),
        total: Math.round(opexMensuel + capexMensuel),
        budgetLineaire: Math.round(budgetMensuelOpex + budgetMensuelCapex),
        budgetOpex: Math.round(budgetMensuelOpex),
        budgetCapex: Math.round(budgetMensuelCapex),
        // Forecast pour mois futurs
        forecast: !isPast ? Math.round(rythme) : null
      };
    });

    // Données cumulées pour courbe de consommation
    let cumulDepense = 0;
    let cumulBudget = 0;
    const cumulativeData = monthlyData.map((m, i) => {
      if (m.isPast) {
        cumulDepense += m.total;
      }
      cumulBudget += m.budgetLineaire;
      const forecastCumul = m.isPast ? null : cumulDepense + rythme * (i - currentMonth);
      return {
        ...m,
        cumulDepense: m.isPast ? Math.round(cumulDepense) : null,
        cumulBudget: Math.round(cumulBudget),
        cumulForecast: forecastCumul ? Math.round(forecastCumul) : null,
        cumulDepensePoint: m.isCurrent ? Math.round(cumulDepense) : null
      };
    });

    // Top risques (items avec taux utilisation > 75%)
    const riskItems = [
      ...suppliers.map(s => ({
        name: s.supplier,
        type: 'OPEX',
        budget: s.budgetAnnuel,
        consomme: (s.depenseActuelle || 0) + (s.engagement || 0),
        taux: s.budgetAnnuel > 0 ? ((s.depenseActuelle || 0) + (s.engagement || 0)) / s.budgetAnnuel * 100 : 0
      })),
      ...projects.map(p => ({
        name: p.project,
        type: 'CAPEX',
        budget: p.budgetTotal,
        consomme: (p.depense || 0) + (p.engagement || 0),
        taux: p.budgetTotal > 0 ? ((p.depense || 0) + (p.engagement || 0)) / p.budgetTotal * 100 : 0
      }))
    ].sort((a, b) => b.taux - a.taux).slice(0, 5);

    return {
      totalBudget, totalDepense, totalEngagement, totalConsomme, totalDisponible, tauxGlobal,
      rythme, atterrissageTotal, atterrissageOpex, atterrissageCapex,
      activeOrders, categoryData, monthlyData, cumulativeData, riskItems
    };
  }, [opexTotals, capexTotals, suppliers, projects, opexOrders, capexOrders, monthsElapsed, currentMonth]);

  // ── Données graphiques ──────────────────────────────
  const landingData = [
    {
      name: 'OPEX',
      Budget: opexTotals.budget,
      Atterrissage: computed.atterrissageOpex,
      isOver: computed.atterrissageOpex > opexTotals.budget
    },
    {
      name: 'CAPEX',
      Budget: capexTotals.budget,
      Atterrissage: computed.atterrissageCapex,
      isOver: computed.atterrissageCapex > capexTotals.budget
    },
    {
      name: 'TOTAL',
      Budget: computed.totalBudget,
      Atterrissage: computed.atterrissageTotal,
      isOver: computed.atterrissageTotal > computed.totalBudget
    }
  ];

  const consolidatedPieData = [
    { name: 'OPEX Dépensé', value: opexTotals.depense, color: '#3b82f6' },
    { name: 'OPEX Engagé', value: opexTotals.engagement, color: '#93c5fd' },
    { name: 'CAPEX Dépensé', value: capexTotals.depense, color: '#10b981' },
    { name: 'CAPEX Engagé', value: capexTotals.engagement, color: '#6ee7b7' },
    { name: 'Disponible', value: Math.max(computed.totalDisponible, 0), color: '#e5e7eb' }
  ].filter(d => d.value > 0);

  // ── RENDU ──────────────────────────────

  return (
    <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
      {/* Header avec toggle */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-5 gap-3">
        <h2 className="text-lg sm:text-xl font-bold text-gray-800">Pilotage Budgétaire</h2>
        <div className="flex bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setView('strategic')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
              view === 'strategic' ? 'bg-white shadow text-blue-700' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <BarChart3 size={14} />
            <span className="hidden sm:inline">Stratégique</span>
            <span className="sm:hidden">Strat.</span>
          </button>
          <button
            onClick={() => setView('operational')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
              view === 'operational' ? 'bg-white shadow text-blue-700' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <Activity size={14} />
            <span className="hidden sm:inline">Opérationnel</span>
            <span className="sm:hidden">Opér.</span>
          </button>
        </div>
      </div>

      {/* ═══════════════ VUE STRATÉGIQUE ═══════════════ */}
      {view === 'strategic' && (
        <div className="space-y-6">
          {/* KPIs Stratégiques */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <KpiCard
              label="Budget Total"
              value={formatK(computed.totalBudget)}
              subtitle={`OPEX ${formatK(opexTotals.budget)} + CAPEX ${formatK(capexTotals.budget)}`}
              icon={Target}
              color="blue"
            />
            <KpiCard
              label="Consommé"
              value={`${computed.tauxGlobal.toFixed(1)}%`}
              subtitle={formatCurrency(computed.totalConsomme)}
              icon={computed.tauxGlobal > 90 ? AlertTriangle : TrendingUp}
              color={computed.tauxGlobal > 90 ? 'red' : computed.tauxGlobal > 75 ? 'orange' : 'green'}
            />
            <KpiCard
              label="Atterrissage annuel"
              value={formatK(computed.atterrissageTotal)}
              subtitle={computed.atterrissageTotal > computed.totalBudget
                ? `Dépassement ${formatK(computed.atterrissageTotal - computed.totalBudget)}`
                : `Sous budget de ${formatK(computed.totalBudget - computed.atterrissageTotal)}`}
              icon={computed.atterrissageTotal > computed.totalBudget ? TrendingUp : TrendingDown}
              color={computed.atterrissageTotal > computed.totalBudget ? 'red' : 'green'}
              trend={computed.atterrissageTotal > computed.totalBudget ? 'up' : 'down'}
            />
            <KpiCard
              label="Disponible"
              value={formatK(computed.totalDisponible)}
              subtitle={`${(100 - computed.tauxGlobal).toFixed(1)}% restant`}
              icon={TrendingDown}
              color={computed.totalDisponible < 0 ? 'red' : 'green'}
            />
          </div>

          {/* Graphiques stratégiques - Ligne 1 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Comparaison OPEX vs CAPEX */}
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Répartition OPEX vs CAPEX</h3>
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={[
                  { name: 'OPEX', Dépensé: opexTotals.depense, Engagé: opexTotals.engagement, Disponible: Math.max(opexTotals.disponible, 0) },
                  { name: 'CAPEX', Dépensé: capexTotals.depense, Engagé: capexTotals.engagement, Disponible: Math.max(capexTotals.disponible, 0) }
                ]} layout="vertical" barCategoryGap="20%">
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                  <XAxis type="number" tickFormatter={formatK} style={{ fontSize: '11px' }} />
                  <YAxis type="category" dataKey="name" width={50} style={{ fontSize: '12px' }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend wrapperStyle={{ fontSize: '11px' }} />
                  <Bar dataKey="Dépensé" stackId="a" fill={COLORS.depense} />
                  <Bar dataKey="Engagé" stackId="a" fill={COLORS.engagement} />
                  <Bar dataKey="Disponible" stackId="a" fill={COLORS.disponible} radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Donut consolidé */}
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Vue consolidée</h3>
              <ResponsiveContainer width="100%" height={240}>
                <PieChart>
                  <Pie
                    data={consolidatedPieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {consolidatedPieData.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v) => formatCurrency(v)} />
                  <Legend
                    wrapperStyle={{ fontSize: '11px' }}
                    formatter={(value) => <span className="text-gray-600">{value}</span>}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Atterrissage budgétaire */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-3">
              Atterrissage budgétaire annuel
              <span className="text-xs font-normal text-gray-500 ml-2">
                (projection linéaire basée sur {monthsElapsed} mois écoulés)
              </span>
            </h3>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
              {landingData.map((item) => (
                <div
                  key={item.name}
                  className={`rounded-lg border p-3 ${
                    item.isOver ? 'border-red-200 bg-red-50' : 'border-green-200 bg-green-50'
                  }`}
                >
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-semibold text-gray-700">{item.name}</span>
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                      item.isOver ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                    }`}>
                      {item.isOver ? 'Dépassement' : 'Sous budget'}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <div>
                      <div className="text-gray-500 text-xs">Budget</div>
                      <div className="font-semibold">{formatK(item.Budget)}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-gray-500 text-xs">Atterrissage</div>
                      <div className={`font-semibold ${item.isOver ? 'text-red-600' : 'text-green-600'}`}>
                        {formatK(item.Atterrissage)}
                      </div>
                    </div>
                  </div>
                  <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all ${item.isOver ? 'bg-red-500' : 'bg-green-500'}`}
                      style={{ width: `${Math.min((item.Atterrissage / item.Budget) * 100, 100)}%` }}
                    />
                  </div>
                  <div className="text-xs text-gray-500 mt-1 text-right">
                    {((item.Atterrissage / item.Budget) * 100).toFixed(1)}% du budget
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* OPEX par catégorie */}
          {computed.categoryData.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-3">OPEX par catégorie</h3>
              <ResponsiveContainer width="100%" height={Math.max(180, computed.categoryData.length * 40)}>
                <BarChart data={computed.categoryData} layout="vertical" barCategoryGap="15%">
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                  <XAxis type="number" tickFormatter={formatK} style={{ fontSize: '11px' }} />
                  <YAxis
                    type="category"
                    dataKey="name"
                    width={120}
                    style={{ fontSize: '11px' }}
                    tick={{ fill: '#374151' }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend wrapperStyle={{ fontSize: '11px' }} />
                  <Bar dataKey="depense" name="Dépensé" stackId="a" fill={COLORS.depense} />
                  <Bar dataKey="engagement" name="Engagé" stackId="a" fill={COLORS.engagement} />
                  <Bar
                    dataKey="budget"
                    name="Budget"
                    fill="none"
                    stroke={COLORS.budget}
                    strokeWidth={2}
                    strokeDasharray="5 5"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      )}

      {/* ═══════════════ VUE OPÉRATIONNELLE ═══════════════ */}
      {view === 'operational' && (
        <div className="space-y-6">
          {/* KPIs Opérationnels */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <KpiCard
              label="Mois en cours"
              value={MONTHS[currentMonth]}
              subtitle={`${monthsElapsed}/12 mois écoulés`}
              icon={Target}
              color="purple"
            />
            <KpiCard
              label="Rythme mensuel"
              value={formatK(computed.rythme)}
              subtitle={`Cible : ${formatK(computed.totalBudget / 12)}/mois`}
              icon={computed.rythme > computed.totalBudget / 12 ? TrendingUp : TrendingDown}
              color={computed.rythme > computed.totalBudget / 12 ? 'orange' : 'green'}
            />
            <KpiCard
              label="Reste à consommer"
              value={formatK(Math.max(computed.totalDisponible, 0))}
              subtitle={`Sur ${12 - monthsElapsed} mois restants`}
              icon={TrendingDown}
              color="blue"
            />
            <KpiCard
              label="Commandes actives"
              value={computed.activeOrders.length}
              subtitle={formatCurrency(computed.activeOrders.reduce((s, o) => s + (o.montant || 0), 0))}
              icon={Activity}
              color="gray"
            />
          </div>

          {/* Courbe de consommation cumulée */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-3">
              Consommation cumulée vs Budget linéaire
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <ComposedChart data={computed.cumulativeData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" style={{ fontSize: '11px' }} />
                <YAxis tickFormatter={formatK} style={{ fontSize: '11px' }} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
                <ReferenceLine y={computed.totalBudget} stroke={COLORS.danger} strokeDasharray="8 4" label={{ value: 'Budget total', position: 'right', fontSize: 10, fill: COLORS.danger }} />
                <Area
                  type="monotone"
                  dataKey="cumulBudget"
                  name="Budget linéaire"
                  stroke={COLORS.budget}
                  fill={COLORS.budget}
                  fillOpacity={0.08}
                  strokeWidth={2}
                  strokeDasharray="5 5"
                />
                <Line
                  type="monotone"
                  dataKey="cumulDepense"
                  name="Consommation réelle"
                  stroke={COLORS.opex}
                  strokeWidth={2.5}
                  dot={{ r: 3, fill: COLORS.opex }}
                  connectNulls={false}
                />
                <Line
                  type="monotone"
                  dataKey="cumulForecast"
                  name="Prévision"
                  stroke={COLORS.forecast}
                  strokeWidth={2}
                  strokeDasharray="6 3"
                  dot={false}
                  connectNulls={false}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>

          {/* Barres mensuelles OPEX / CAPEX */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-3">
              Dépenses mensuelles OPEX / CAPEX
            </h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={computed.monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" style={{ fontSize: '11px' }} />
                <YAxis tickFormatter={formatK} style={{ fontSize: '11px' }} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
                <Bar dataKey="opex" name="OPEX" stackId="a" fill={COLORS.opex}>
                  {computed.monthlyData.map((entry, i) => (
                    <Cell key={i} fill={entry.isPast ? COLORS.opex : '#dbeafe'} />
                  ))}
                </Bar>
                <Bar dataKey="capex" name="CAPEX" stackId="a" fill={COLORS.capex} radius={[2, 2, 0, 0]}>
                  {computed.monthlyData.map((entry, i) => (
                    <Cell key={i} fill={entry.isPast ? COLORS.capex : '#d1fae5'} />
                  ))}
                </Bar>
                <Line
                  type="monotone"
                  dataKey="budgetLineaire"
                  name="Budget mensuel cible"
                  stroke={COLORS.budget}
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={false}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Top 5 Risques + Tableau de suivi */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Top risques */}
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-3">
                Top 5 - Lignes à risque
                <span className="text-xs font-normal text-gray-500 ml-1">(taux consommation)</span>
              </h3>
              <div className="space-y-3">
                {computed.riskItems.map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-medium text-gray-800 truncate">{item.name}</span>
                        <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                          <span className={`text-xs px-1.5 py-0.5 rounded ${
                            item.type === 'OPEX' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'
                          }`}>{item.type}</span>
                          <span className={`text-sm font-semibold ${
                            item.taux > 90 ? 'text-red-600' : item.taux > 75 ? 'text-orange-600' : 'text-green-600'
                          }`}>{item.taux.toFixed(1)}%</span>
                        </div>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all ${
                            item.taux > 90 ? 'bg-red-500' : item.taux > 75 ? 'bg-yellow-500' : 'bg-green-500'
                          }`}
                          style={{ width: `${Math.min(item.taux, 100)}%` }}
                        />
                      </div>
                      <div className="flex justify-between text-xs text-gray-500 mt-0.5">
                        <span>{formatK(item.consomme)} consommé</span>
                        <span>{formatK(item.budget)} budget</span>
                      </div>
                    </div>
                  </div>
                ))}
                {computed.riskItems.length === 0 && (
                  <p className="text-sm text-gray-500 italic">Aucune donnée disponible</p>
                )}
              </div>
            </div>

            {/* Tableau de suivi mensuel */}
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Suivi mensuel détaillé</h3>
              <div className="overflow-x-auto max-h-[350px] overflow-y-auto">
                <table className="w-full text-xs">
                  <thead className="sticky top-0 bg-gray-50">
                    <tr>
                      <th className="px-2 py-1.5 text-left font-semibold text-gray-600">Mois</th>
                      <th className="px-2 py-1.5 text-right font-semibold text-gray-600">OPEX</th>
                      <th className="px-2 py-1.5 text-right font-semibold text-gray-600">CAPEX</th>
                      <th className="px-2 py-1.5 text-right font-semibold text-gray-600">Total</th>
                      <th className="px-2 py-1.5 text-right font-semibold text-gray-600">Cible</th>
                      <th className="px-2 py-1.5 text-right font-semibold text-gray-600">Ecart</th>
                    </tr>
                  </thead>
                  <tbody>
                    {computed.monthlyData.map((m, i) => {
                      const ecart = m.total - m.budgetLineaire;
                      return (
                        <tr key={i} className={`border-t ${
                          m.isCurrent ? 'bg-blue-50 font-semibold' : !m.isPast ? 'text-gray-400' : ''
                        }`}>
                          <td className="px-2 py-1.5">
                            {m.name}
                            {m.isCurrent && <span className="ml-1 text-blue-600 text-[10px]">en cours</span>}
                          </td>
                          <td className="px-2 py-1.5 text-right">{formatK(m.opex)}</td>
                          <td className="px-2 py-1.5 text-right">{formatK(m.capex)}</td>
                          <td className="px-2 py-1.5 text-right font-medium">{formatK(m.total)}</td>
                          <td className="px-2 py-1.5 text-right text-gray-500">{formatK(m.budgetLineaire)}</td>
                          <td className={`px-2 py-1.5 text-right ${
                            !m.isPast ? 'text-gray-300' : ecart > 0 ? 'text-red-600' : 'text-green-600'
                          }`}>
                            {m.isPast ? `${ecart > 0 ? '+' : ''}${formatK(ecart)}` : '-'}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                  <tfoot className="border-t-2 bg-gray-50 font-semibold">
                    <tr>
                      <td className="px-2 py-1.5">TOTAL</td>
                      <td className="px-2 py-1.5 text-right">{formatK(opexTotals.depense)}</td>
                      <td className="px-2 py-1.5 text-right">{formatK(capexTotals.depense)}</td>
                      <td className="px-2 py-1.5 text-right">{formatK(computed.totalDepense)}</td>
                      <td className="px-2 py-1.5 text-right text-gray-500">
                        {formatK(computed.totalBudget / 12 * monthsElapsed)}
                      </td>
                      <td className={`px-2 py-1.5 text-right ${
                        computed.totalDepense > (computed.totalBudget / 12 * monthsElapsed) ? 'text-red-600' : 'text-green-600'
                      }`}>
                        {formatK(computed.totalDepense - (computed.totalBudget / 12 * monthsElapsed))}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
