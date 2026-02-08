/**
 * Utilitaires de calculs budgétaires
 */

/**
 * Calcule le budget disponible
 * @param {number} budget - Budget total
 * @param {number} depense - Montant dépensé
 * @param {number} engagement - Montant engagé
 * @returns {number} Budget disponible
 */
export const calculateAvailable = (budget, depense, engagement) => {
  return budget - depense - engagement;
};

/**
 * Calcule le taux d'utilisation
 * @param {number} budget - Budget total
 * @param {number} depense - Montant dépensé
 * @param {number} engagement - Montant engagé
 * @returns {number} Taux d'utilisation en pourcentage
 */
export const calculateUsageRate = (budget, depense, engagement) => {
  if (budget === 0) return 0;
  return ((depense + engagement) / budget) * 100;
};

/**
 * Calcule les totaux pour une liste d'items
 * @param {Array} items - Liste d'items (OPEX ou CAPEX)
 * @param {Object} keys - Clés pour budget, depense, engagement
 * @returns {Object} Totaux calculés
 */
export const calculateTotals = (items, keys = {
  budget: 'budgetAnnuel',
  depense: 'depenseActuelle',
  engagement: 'engagement'
}) => {
  const budget = items.reduce((sum, item) => sum + (item[keys.budget] || 0), 0);
  const depense = items.reduce((sum, item) => sum + (item[keys.depense] || 0), 0);
  const engagement = items.reduce((sum, item) => sum + (item[keys.engagement] || 0), 0);
  const disponible = calculateAvailable(budget, depense, engagement);
  const tauxUtilisation = calculateUsageRate(budget, depense, engagement);

  return {
    budget,
    depense,
    engagement,
    disponible,
    tauxUtilisation
  };
};

/**
 * Détermine le niveau d'alerte selon le taux d'utilisation
 * @param {number} rate - Taux d'utilisation
 * @returns {string} Niveau d'alerte (critical, warning, safe)
 */
export const getAlertLevel = (rate) => {
  if (rate > 90) return 'critical';
  if (rate > 75) return 'warning';
  return 'safe';
};
