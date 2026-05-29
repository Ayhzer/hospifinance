/**
 * Hook personnalisé pour les calculs budgétaires avec mémorisation
 * Intègre l'impact des commandes sur les budgets
 */

import { useMemo } from 'react';
import { calculateTotals } from '../utils/calculations';
import { computeOrderImpact } from '../utils/orderCalculations';

/**
 * Hook pour calculer les totaux OPEX.
 * Les suppliers issus de l'import SAGE/MAGH2 contiennent déjà depenseActuelle
 * et engagement agrégés — ne pas ajouter l'impact des commandes (double comptage).
 */
export const useOpexTotals = (suppliers, opexOrders = []) => {
  return useMemo(() => {
    const hasSupplierAmounts = suppliers.some(
      s => (Number(s.depenseActuelle) || 0) + (Number(s.engagement) || 0) > 0
    );
    const orderImpact = hasSupplierAmounts ? null : computeOrderImpact(opexOrders);
    return calculateTotals(suppliers, {
      budget: 'budgetAnnuel',
      depense: 'depenseActuelle',
      engagement: 'engagement'
    }, orderImpact);
  }, [suppliers, opexOrders]);
};

/**
 * Hook pour calculer les totaux CAPEX.
 * Même logique : pas d'ajout de l'impact commandes si les projets ont déjà des montants.
 */
export const useCapexTotals = (projects, capexOrders = []) => {
  return useMemo(() => {
    const hasProjectAmounts = projects.some(
      p => (Number(p.depense) || 0) + (Number(p.engagement) || 0) > 0
    );
    const orderImpact = hasProjectAmounts ? null : computeOrderImpact(capexOrders);
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
