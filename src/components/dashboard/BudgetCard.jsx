/**
 * Composant BudgetCard - Carte de résumé budgétaire
 * Lit les seuils depuis les props (transmis par settings)
 */

import React from 'react';
import { formatCurrency } from '../../utils/formatters';
import { ProgressBar } from '../common/ProgressBar';
import { AlertBanner } from '../common/AlertBanner';
import { BUDGET_THRESHOLDS } from '../../constants/budgetConstants';

export const BudgetCard = ({ title, icon: Icon, totals, iconColor, warningThreshold, criticalThreshold }) => {
  const critAt = criticalThreshold ?? BUDGET_THRESHOLDS.CRITICAL;
  const isOverBudget = totals.tauxUtilisation >= critAt;

  return (
    <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <h2 className="text-lg sm:text-xl font-bold text-gray-800 leading-tight">{title}</h2>
        {Icon && <Icon className={iconColor} size={20} />}
      </div>

      <div className="space-y-2 sm:space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-sm sm:text-base text-gray-600">Budget</span>
          <span className="font-semibold text-base sm:text-lg text-right">{formatCurrency(totals.budget)}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm sm:text-base text-gray-600">Dépensé</span>
          <span className="font-semibold text-base sm:text-lg text-orange-600 text-right">
            {formatCurrency(totals.depense)}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm sm:text-base text-gray-600">Engagé</span>
          <span className="font-semibold text-base sm:text-lg text-yellow-600 text-right">
            {formatCurrency(totals.engagement)}
          </span>
        </div>
        <div className="border-t pt-2 sm:pt-3 flex justify-between items-center">
          <span className="text-sm sm:text-base text-gray-600 font-medium">Disponible</span>
          <span
            className={`font-bold text-lg sm:text-xl ${
              totals.disponible < 0 ? 'text-red-600' : 'text-green-600'
            } text-right`}
          >
            {formatCurrency(totals.disponible)}
          </span>
        </div>

        <div className="mt-4">
          <ProgressBar
            value={totals.tauxUtilisation}
            warningThreshold={warningThreshold}
            criticalThreshold={criticalThreshold}
          />
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
