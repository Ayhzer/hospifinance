/**
 * Composant BudgetCard - Carte de résumé budgétaire
 */

import React from 'react';
import { formatCurrency } from '../../utils/formatters';
import { ProgressBar } from '../common/ProgressBar';
import { AlertBanner } from '../common/AlertBanner';
import { BUDGET_THRESHOLDS } from '../../constants/budgetConstants';

export const BudgetCard = ({ title, icon: Icon, totals, iconColor }) => {
  const isOverBudget = totals.tauxUtilisation >= BUDGET_THRESHOLDS.CRITICAL;

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-800">{title}</h2>
        {Icon && <Icon className={iconColor} size={24} />}
      </div>

      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Budget</span>
          <span className="font-semibold text-lg">{formatCurrency(totals.budget)}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Dépensé</span>
          <span className="font-semibold text-lg text-orange-600">
            {formatCurrency(totals.depense)}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Engagé</span>
          <span className="font-semibold text-lg text-yellow-600">
            {formatCurrency(totals.engagement)}
          </span>
        </div>
        <div className="border-t pt-3 flex justify-between items-center">
          <span className="text-gray-600 font-medium">Disponible</span>
          <span
            className={`font-bold text-xl ${
              totals.disponible < 0 ? 'text-red-600' : 'text-green-600'
            }`}
          >
            {formatCurrency(totals.disponible)}
          </span>
        </div>

        <div className="mt-4">
          <ProgressBar value={totals.tauxUtilisation} />
        </div>

        {isOverBudget && (
          <AlertBanner
            type="error"
            message="Alerte: Budget presque épuisé"
            className="mt-3"
          />
        )}
      </div>
    </div>
  );
};
