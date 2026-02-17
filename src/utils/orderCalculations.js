/**
 * Utilitaires de calcul d'impact des commandes sur les budgets
 */

import { ORDER_IMPACT } from '../constants/orderConstants';

/**
 * Calcule l'impact total des commandes (engagement + dépense)
 * @param {Array} orders - Liste des commandes
 * @returns {Object} { engagement, depense }
 */
export const computeOrderImpact = (orders) => {
  let engagement = 0;
  let depense = 0;

  orders.forEach(order => {
    const impact = ORDER_IMPACT[order.status];
    if (impact === 'engagement') {
      engagement += Number(order.montant) || 0;
    } else if (impact === 'depense') {
      depense += Number(order.montant) || 0;
    }
  });

  return { engagement, depense };
};

/**
 * Calcule l'impact des commandes par parent (fournisseur/projet)
 * @param {Array} orders - Liste des commandes
 * @returns {Object} { [parentId]: { engagement, depense } }
 */
export const computeOrderImpactByParent = (orders) => {
  const byParent = {};

  orders.forEach(order => {
    const impact = ORDER_IMPACT[order.status];
    if (!impact) return;

    if (!byParent[order.parentId]) {
      byParent[order.parentId] = { engagement: 0, depense: 0 };
    }

    if (impact === 'engagement') {
      byParent[order.parentId].engagement += Number(order.montant) || 0;
    } else if (impact === 'depense') {
      byParent[order.parentId].depense += Number(order.montant) || 0;
    }
  });

  return byParent;
};

/**
 * Enrichit les items (fournisseurs/projets) avec l'impact des commandes
 * @param {Array} items - Fournisseurs ou projets
 * @param {Array} orders - Commandes liées
 * @returns {Object} { totalOrderEngagement, totalOrderDepense }
 */
export const computeTotalOrderImpact = (orders) => {
  return computeOrderImpact(orders);
};
