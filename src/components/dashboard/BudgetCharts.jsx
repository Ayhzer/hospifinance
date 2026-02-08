/**
 * Composant BudgetCharts - Graphiques de visualisation budgétaire
 */

import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { formatCurrency } from '../../utils/formatters';

const COLORS = {
  depense: '#f97316', // orange-600
  engagement: '#eab308', // yellow-600
  disponible: '#22c55e' // green-600
};

export const BudgetCharts = ({ opexTotals, capexTotals }) => {
  // Données pour le graphique en barres comparatif
  const comparisonData = [
    {
      name: 'OPEX',
      Dépensé: opexTotals.depense,
      Engagé: opexTotals.engagement,
      Disponible: opexTotals.disponible
    },
    {
      name: 'CAPEX',
      Dépensé: capexTotals.depense,
      Engagé: capexTotals.engagement,
      Disponible: capexTotals.disponible
    }
  ];

  // Données pour le graphique circulaire OPEX
  const opexPieData = [
    { name: 'Dépensé', value: opexTotals.depense, color: COLORS.depense },
    { name: 'Engagé', value: opexTotals.engagement, color: COLORS.engagement },
    { name: 'Disponible', value: Math.max(opexTotals.disponible, 0), color: COLORS.disponible }
  ].filter(item => item.value > 0);

  // Données pour le graphique circulaire CAPEX
  const capexPieData = [
    { name: 'Dépensé', value: capexTotals.depense, color: COLORS.depense },
    { name: 'Engagé', value: capexTotals.engagement, color: COLORS.engagement },
    { name: 'Disponible', value: Math.max(capexTotals.disponible, 0), color: COLORS.disponible }
  ].filter(item => item.value > 0);

  // Formateur personnalisé pour les tooltips
  const formatTooltip = (value) => formatCurrency(value);

  return (
    <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
      <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-4 sm:mb-6">Visualisations Budgétaires</h2>

      {/* Graphique comparatif en barres */}
      <div className="mb-6 sm:mb-8">
        <h3 className="text-base sm:text-lg font-semibold text-gray-700 mb-3 sm:mb-4">
          Comparaison OPEX vs CAPEX
        </h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={comparisonData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" style={{ fontSize: '12px' }} />
            <YAxis tickFormatter={(value) => `${(value / 1000000).toFixed(1)}M€`} style={{ fontSize: '11px' }} />
            <Tooltip formatter={formatTooltip} />
            <Legend wrapperStyle={{ fontSize: '12px' }} />
            <Bar dataKey="Dépensé" fill={COLORS.depense} />
            <Bar dataKey="Engagé" fill={COLORS.engagement} />
            <Bar dataKey="Disponible" fill={COLORS.disponible} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Graphiques circulaires */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
        {/* OPEX Pie Chart */}
        <div>
          <h3 className="text-base sm:text-lg font-semibold text-gray-700 mb-3 sm:mb-4 text-center">
            Répartition OPEX
          </h3>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={opexPieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name.substring(0, 3)} ${(percent * 100).toFixed(0)}%`}
                outerRadius={window.innerWidth < 640 ? 60 : 80}
                fill="#8884d8"
                dataKey="value"
                style={{ fontSize: window.innerWidth < 640 ? '11px' : '14px' }}
              >
                {opexPieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={formatTooltip} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* CAPEX Pie Chart */}
        <div>
          <h3 className="text-base sm:text-lg font-semibold text-gray-700 mb-3 sm:mb-4 text-center">
            Répartition CAPEX
          </h3>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={capexPieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name.substring(0, 3)} ${(percent * 100).toFixed(0)}%`}
                outerRadius={window.innerWidth < 640 ? 60 : 80}
                fill="#8884d8"
                dataKey="value"
                style={{ fontSize: window.innerWidth < 640 ? '11px' : '14px' }}
              >
                {capexPieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={formatTooltip} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
