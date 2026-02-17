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
  return (Number(budget) || 0) - (Number(depense) || 0) - (Number(engagement) || 0);
};

/**
 * Calcule le taux d'utilisation
 * @param {number} budget - Budget total
 * @param {number} depense - Montant dépensé
 * @param {number} engagement - Montant engagé
 * @returns {number} Taux d'utilisation en pourcentage
 */
export const calculateUsageRate = (budget, depense, engagement) => {
  const b = Number(budget) || 0;
  const d = Number(depense) || 0;
  const e = Number(engagement) || 0;
  if (b === 0) return 0;
  return ((d + e) / b) * 100;
};

/**
 * Calcule les totaux pour une liste d'items, avec impact optionnel des commandes
 * @param {Array} items - Liste d'items (OPEX ou CAPEX)
 * @param {Object} keys - Clés pour budget, depense, engagement
 * @param {Object} orderImpact - Impact des commandes { engagement, depense } (optionnel)
 * @returns {Object} Totaux calculés
 */
export const calculateTotals = (items, keys = {
  budget: 'budgetAnnuel',
  depense: 'depenseActuelle',
  engagement: 'engagement'
}, orderImpact = null) => {
  const budget = items.reduce((sum, item) => sum + (Number(item[keys.budget]) || 0), 0);
  let depense = items.reduce((sum, item) => sum + (Number(item[keys.depense]) || 0), 0);
  let engagement = items.reduce((sum, item) => sum + (Number(item[keys.engagement]) || 0), 0);

  // Ajouter l'impact des commandes
  if (orderImpact) {
    depense += orderImpact.depense || 0;
    engagement += orderImpact.engagement || 0;
  }

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
 * @param {number} warningThreshold - Seuil d'avertissement (défaut 75)
 * @param {number} criticalThreshold - Seuil critique (défaut 90)
 * @returns {string} Niveau d'alerte (critical, warning, safe)
 */
export const getAlertLevel = (rate, warningThreshold = 75, criticalThreshold = 90) => {
  if (rate > criticalThreshold) return 'critical';
  if (rate > warningThreshold) return 'warning';
  return 'safe';
};
