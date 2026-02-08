/**
 * Composant ProgressBar avec indicateur coloré
 */

import React from 'react';
import { BUDGET_THRESHOLDS, BUDGET_COLORS } from '../../constants/budgetConstants';

export const ProgressBar = ({ value, showLabel = true, size = 'md' }) => {
  const percentage = Math.min(Math.max(value, 0), 100);

  // Déterminer la couleur selon les seuils
  const getColor = () => {
    if (percentage >= BUDGET_THRESHOLDS.CRITICAL) return BUDGET_COLORS.CRITICAL;
    if (percentage >= BUDGET_THRESHOLDS.WARNING) return BUDGET_COLORS.WARNING;
    return BUDGET_COLORS.SAFE;
  };

  const heights = {
    sm: 'h-2',
    md: 'h-3',
    lg: 'h-4'
  };

  return (
    <div className="w-full">
      {showLabel && (
        <div className="flex justify-between text-sm mb-1">
          <span>Taux d'utilisation</span>
          <span className="font-semibold">{percentage.toFixed(1)}%</span>
        </div>
      )}
      <div className={`w-full bg-gray-200 rounded-full ${heights[size]}`}>
        <div
          className={`${heights[size]} rounded-full transition-all duration-300 ${getColor()}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};
