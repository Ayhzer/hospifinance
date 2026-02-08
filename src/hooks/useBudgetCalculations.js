/**
 * Hook personnalisé pour les calculs budgétaires avec mémorisation
 */

import { useMemo } from 'react';
import { calculateTotals } from '../utils/calculations';

/**
 * Hook pour calculer les totaux OPEX
 */
export const useOpexTotals = (suppliers) => {
  return useMemo(() => {
    return calculateTotals(suppliers, {
      budget: 'budgetAnnuel',
      depense: 'depenseActuelle',
      engagement: 'engagement'
    });
  }, [suppliers]);
};

/**
 * Hook pour calculer les totaux CAPEX
 */
export const useCapexTotals = (projects) => {
  return useMemo(() => {
    return calculateTotals(projects, {
      budget: 'budgetTotal',
      depense: 'depense',
      engagement: 'engagement'
    });
  }, [projects]);
};

/**
 * Hook pour calculer les totaux consolidés
 */
export const useConsolidatedTotals = (opexTotals, capexTotals) => {
  return useMemo(() => ({
    budget: opexTotals.budget + capexTotals.budget,
    depense: opexTotals.depense + capexTotals.depense,
    engagement: opexTotals.engagement + capexTotals.engagement,
    disponible: opexTotals.disponible + capexTotals.disponible
  }), [opexTotals, capexTotals]);
};
