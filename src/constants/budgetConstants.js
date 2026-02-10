/**
 * Constantes pour la gestion budgétaire
 */

// Seuils d'alerte budgétaire
export const BUDGET_THRESHOLDS = {
  CRITICAL: 90, // Alerte critique à 90%
  WARNING: 75,  // Avertissement à 75%
  SAFE: 0       // Zone sûre
};

// Couleurs selon le taux d'utilisation
export const BUDGET_COLORS = {
  CRITICAL: 'bg-red-500',
  WARNING: 'bg-yellow-500',
  SAFE: 'bg-green-500'
};

// Statuts des projets CAPEX
export const PROJECT_STATUS = {
  PLANNED: 'Planifié',
  IN_PROGRESS: 'En cours',
  COMPLETED: 'Terminé',
  SUSPENDED: 'Suspendu',
  CANCELLED: 'Annulé'
};

// Couleurs des statuts
export const STATUS_COLORS = {
  [PROJECT_STATUS.PLANNED]: 'bg-gray-100 text-gray-800',
  [PROJECT_STATUS.IN_PROGRESS]: 'bg-blue-100 text-blue-800',
  [PROJECT_STATUS.COMPLETED]: 'bg-green-100 text-green-800',
  [PROJECT_STATUS.SUSPENDED]: 'bg-yellow-100 text-yellow-800',
  [PROJECT_STATUS.CANCELLED]: 'bg-red-100 text-red-800'
};

// Catégories OPEX communes
export const OPEX_CATEGORIES = [
  'Logiciels',
  'Licences',
  'Support matériel',
  'Maintenance',
  'Cloud & Hébergement',
  'Télécommunications',
  'Services externes',
  'Formation'
];

// Enveloppes budgétaires CAPEX
export const ENVELOPPES_CAPEX = [
  'Infrastructure',
  'Applications métier',
  'Cybersécurité',
  'Poste de travail',
  'Télécom',
  'Autre'
];

// Couleurs des enveloppes
export const ENVELOPPE_COLORS = {
  'Infrastructure': 'bg-blue-100 text-blue-800 border-blue-300',
  'Applications métier': 'bg-purple-100 text-purple-800 border-purple-300',
  'Cybersécurité': 'bg-red-100 text-red-800 border-red-300',
  'Poste de travail': 'bg-green-100 text-green-800 border-green-300',
  'Télécom': 'bg-orange-100 text-orange-800 border-orange-300',
  'Autre': 'bg-gray-100 text-gray-800 border-gray-300'
};

// Configuration pour les exports
export const EXPORT_CONFIG = {
  DATE_FORMAT: 'fr-FR',
  CSV_ENCODING: 'utf-8',
  JSON_INDENT: 2
};
