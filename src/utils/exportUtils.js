/**
 * Utilitaires d'export de données
 */

import { generateFilename } from './formatters';

/**
 * Exporte des données en CSV
 * @param {Array} data - Données à exporter
 * @param {string} filename - Nom du fichier
 */
export const exportToCSV = (data, filename) => {
  if (!data || data.length === 0) {
    console.warn('Aucune donnée à exporter');
    return;
  }

  const headers = Object.keys(data[0]).filter(key => key !== 'id');
  const csvContent = [
    headers.join(','),
    ...data.map(row => headers.map(header => {
      const value = row[header];
      // Échapper les virgules et guillemets
      if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
        return `"${value.replace(/"/g, '""')}"`;
      }
      return value ?? '';
    }).join(','))
  ].join('\n');

  downloadFile(csvContent, generateFilename(filename, 'csv'), 'text/csv;charset=utf-8;');
};

/**
 * Exporte des données en JSON
 * @param {Array} data - Données à exporter
 * @param {string} filename - Nom du fichier
 */
export const exportToJSON = (data, filename) => {
  if (!data || data.length === 0) {
    console.warn('Aucune donnée à exporter');
    return;
  }

  const jsonContent = JSON.stringify(data, null, 2);
  downloadFile(jsonContent, generateFilename(filename, 'json'), 'application/json');
};

/**
 * Télécharge un fichier
 * @param {string} content - Contenu du fichier
 * @param {string} filename - Nom du fichier
 * @param {string} mimeType - Type MIME
 */
const downloadFile = (content, filename, mimeType) => {
  const blob = new Blob([content], { type: mimeType });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(link.href);
};
