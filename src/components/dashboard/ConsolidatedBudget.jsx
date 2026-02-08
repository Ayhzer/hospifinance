/**
 * Composant ConsolidatedBudget - Vue budgétaire consolidée
 */

import React from 'react';
import { formatCurrency } from '../../utils/formatters';

export const ConsolidatedBudget = ({ consolidatedTotals }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Budget Consolidé DSI</h2>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-gray-600 mb-1">Budget Total</p>
          <p className="text-2xl font-bold text-blue-700">
            {formatCurrency(consolidatedTotals.budget)}
          </p>
        </div>
        <div className="p-4 bg-orange-50 rounded-lg">
          <p className="text-sm text-gray-600 mb-1">Total Dépensé</p>
          <p className="text-2xl font-bold text-orange-700">
            {formatCurrency(consolidatedTotals.depense)}
          </p>
        </div>
        <div className="p-4 bg-yellow-50 rounded-lg">
          <p className="text-sm text-gray-600 mb-1">Total Engagé</p>
          <p className="text-2xl font-bold text-yellow-700">
            {formatCurrency(consolidatedTotals.engagement)}
          </p>
        </div>
        <div className="p-4 bg-green-50 rounded-lg">
          <p className="text-sm text-gray-600 mb-1">Total Disponible</p>
          <p className="text-2xl font-bold text-green-700">
            {formatCurrency(consolidatedTotals.disponible)}
          </p>
        </div>
      </div>
    </div>
  );
};
