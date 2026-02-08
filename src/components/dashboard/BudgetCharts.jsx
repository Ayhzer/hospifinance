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
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-6">Visualisations Budgétaires</h2>

      {/* Graphique comparatif en barres */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">
          Comparaison OPEX vs CAPEX
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={comparisonData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis tickFormatter={(value) => `${(value / 1000000).toFixed(1)}M€`} />
            <Tooltip formatter={formatTooltip} />
            <Legend />
            <Bar dataKey="Dépensé" fill={COLORS.depense} />
            <Bar dataKey="Engagé" fill={COLORS.engagement} />
            <Bar dataKey="Disponible" fill={COLORS.disponible} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Graphiques circulaires */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* OPEX Pie Chart */}
        <div>
          <h3 className="text-lg font-semibold text-gray-700 mb-4 text-center">
            Répartition OPEX
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={opexPieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
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
          <h3 className="text-lg font-semibold text-gray-700 mb-4 text-center">
            Répartition CAPEX
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={capexPieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
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
