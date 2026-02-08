/**
 * Hook personnalisé pour les calculs budgétaires avec mémorisation
 * Intègre l'impact des commandes sur les budgets
 */

import { useMemo } from 'react';
import { calculateTotals } from '../utils/calculations';
import { computeOrderImpact } from '../utils/orderCalculations';

/**
 * Hook pour calculer les totaux OPEX (avec impact commandes)
 */
export const useOpexTotals = (suppliers, opexOrders = []) => {
  return useMemo(() => {
    const orderImpact = computeOrderImpact(opexOrders);
    return calculateTotals(suppliers, {
      budget: 'budgetAnnuel',
      depense: 'depenseActuelle',
      engagement: 'engagement'
    }, orderImpact);
  }, [suppliers, opexOrders]);
};

/**
 * Hook pour calculer les totaux CAPEX (avec impact commandes)
 */
export const useCapexTotals = (projects, capexOrders = []) => {
  return useMemo(() => {
    const orderImpact = computeOrderImpact(capexOrders);
    return calculateTotals(projects, {
      budget: 'budgetTotal',
      depense: 'depense',
      engagement: 'engagement'
    }, orderImpact);
  }, [projects, capexOrders]);
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
