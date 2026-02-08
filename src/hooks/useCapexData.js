/**
 * Hook personnalisé pour la gestion des données CAPEX
 */

import { useState, useEffect, useCallback } from 'react';
import { saveCapexData, loadCapexData } from '../services/storageService';
import { validateCapexData, parseNumber, sanitizeString } from '../utils/validators';

// Données par défaut
const DEFAULT_CAPEX_DATA = [
  {
    id: 1,
    project: 'Renouvellement Datacenter',
    budgetTotal: 2000000,
    depense: 1200000,
    engagement: 300000,
    dateDebut: '2024-01-01',
    dateFin: '2024-12-31',
    status: 'En cours',
    notes: 'Phase 2 en cours'
  },
  {
    id: 2,
    project: 'Déploiement VDI',
    budgetTotal: 800000,
    depense: 650000,
    engagement: 100000,
    dateDebut: '2024-03-01',
    dateFin: '2024-11-30',
    status: 'En cours',
    notes: '85% des postes déployés'
  },
  {
    id: 3,
    project: 'Cybersécurité - SIEM',
    budgetTotal: 500000,
    depense: 500000,
    engagement: 0,
    dateDebut: '2023-09-01',
    dateFin: '2024-02-28',
    status: 'Terminé',
    notes: 'Projet finalisé'
  }
];

export const useCapexData = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Chargement initial des données
  useEffect(() => {
    const storedData = loadCapexData();
    setProjects(storedData || DEFAULT_CAPEX_DATA);
    setLoading(false);
  }, []);

  // Sauvegarde automatique à chaque modification
  useEffect(() => {
    if (!loading && projects.length > 0) {
      saveCapexData(projects);
    }
  }, [projects, loading]);

  /**
   * Ajoute un nouveau projet
   */
  const addProject = useCallback((projectData) => {
    const validation = validateCapexData(projectData);

    if (!validation.isValid) {
      setError(validation.errors.join(', '));
      return { success: false, errors: validation.errors };
    }

    const newProject = {
      id: Date.now() + Math.random(), // ID plus robuste
      project: sanitizeString(projectData.project),
      budgetTotal: parseNumber(projectData.budgetTotal, 0),
      depense: parseNumber(projectData.depense, 0),
      engagement: parseNumber(projectData.engagement, 0),
      dateDebut: projectData.dateDebut || '',
      dateFin: projectData.dateFin || '',
      status: projectData.status || 'Planifié',
      notes: sanitizeString(projectData.notes)
    };

    setProjects(prev => [...prev, newProject]);
    setError(null);
    return { success: true, data: newProject };
  }, []);

  /**
   * Met à jour un projet existant
   */
  const updateProject = useCallback((id, projectData) => {
    const validation = validateCapexData(projectData);

    if (!validation.isValid) {
      setError(validation.errors.join(', '));
      return { success: false, errors: validation.errors };
    }

    const updatedProject = {
      id,
      project: sanitizeString(projectData.project),
      budgetTotal: parseNumber(projectData.budgetTotal, 0),
      depense: parseNumber(projectData.depense, 0),
      engagement: parseNumber(projectData.engagement, 0),
      dateDebut: projectData.dateDebut || '',
      dateFin: projectData.dateFin || '',
      status: projectData.status || 'Planifié',
      notes: sanitizeString(projectData.notes)
    };

    setProjects(prev => prev.map(p => p.id === id ? updatedProject : p));
    setError(null);
    return { success: true, data: updatedProject };
  }, []);

  /**
   * Supprime un projet
   */
  const deleteProject = useCallback((id) => {
    setProjects(prev => prev.filter(p => p.id !== id));
    setError(null);
    return { success: true };
  }, []);

  /**
   * Réinitialise aux données par défaut
   */
  const resetToDefaults = useCallback(() => {
    setProjects(DEFAULT_CAPEX_DATA);
    setError(null);
  }, []);

  return {
    projects,
    loading,
    error,
    addProject,
    updateProject,
    deleteProject,
    resetToDefaults,
    setError
  };
};
