/**
 * Service de persistence des données (LocalStorage)
 */

const STORAGE_KEYS = {
  OPEX: 'hospifinance_opex_suppliers',
  CAPEX: 'hospifinance_capex_projects',
  VERSION: 'hospifinance_version'
};

const CURRENT_VERSION = '1.0.0';

/**
 * Sauvegarde des données OPEX
 * @param {Array} data - Données OPEX
 */
export const saveOpexData = (data) => {
  try {
    localStorage.setItem(STORAGE_KEYS.OPEX, JSON.stringify(data));
    localStorage.setItem(STORAGE_KEYS.VERSION, CURRENT_VERSION);
    return true;
  } catch (error) {
    console.error('Erreur lors de la sauvegarde des données OPEX:', error);
    return false;
  }
};

/**
 * Chargement des données OPEX
 * @returns {Array} Données OPEX
 */
export const loadOpexData = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.OPEX);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Erreur lors du chargement des données OPEX:', error);
    return null;
  }
};

/**
 * Sauvegarde des données CAPEX
 * @param {Array} data - Données CAPEX
 */
export const saveCapexData = (data) => {
  try {
    localStorage.setItem(STORAGE_KEYS.CAPEX, JSON.stringify(data));
    localStorage.setItem(STORAGE_KEYS.VERSION, CURRENT_VERSION);
    return true;
  } catch (error) {
    console.error('Erreur lors de la sauvegarde des données CAPEX:', error);
    return false;
  }
};

/**
 * Chargement des données CAPEX
 * @returns {Array} Données CAPEX
 */
export const loadCapexData = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.CAPEX);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Erreur lors du chargement des données CAPEX:', error);
    return null;
  }
};

/**
 * Réinitialise toutes les données
 */
export const clearAllData = () => {
  try {
    localStorage.removeItem(STORAGE_KEYS.OPEX);
    localStorage.removeItem(STORAGE_KEYS.CAPEX);
    return true;
  } catch (error) {
    console.error('Erreur lors de la suppression des données:', error);
    return false;
  }
};

/**
 * Vérifie si des données existent
 * @returns {boolean} true si des données existent
 */
export const hasStoredData = () => {
  return localStorage.getItem(STORAGE_KEYS.OPEX) !== null ||
         localStorage.getItem(STORAGE_KEYS.CAPEX) !== null;
};

/**
 * Obtient la version stockée
 * @returns {string} Version
 */
export const getStoredVersion = () => {
  return localStorage.getItem(STORAGE_KEYS.VERSION) || '0.0.0';
};
