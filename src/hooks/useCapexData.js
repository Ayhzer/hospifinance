/**
 * Hook personnalisé pour la gestion des données CAPEX
 */

import { useState, useEffect, useCallback } from 'react';
import { saveCapexData, loadCapexData, hasCapexData, markAsInitialized } from '../services/storageService';
import { validateCapexData, parseNumber, sanitizeString } from '../utils/validators';

// Données par défaut
const DEFAULT_CAPEX_DATA = [
  {
    id: 1,
    enveloppe: 'Infrastructure',
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
    enveloppe: 'Poste de travail',
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
    enveloppe: 'Cybersécurité',
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

    // Si des données existent, les charger (données de production)
    if (storedData && storedData.length > 0) {
      setProjects(storedData);
    }
    // Sinon, charger les données par défaut UNIQUEMENT si aucune donnée n'existe
    else if (!hasCapexData()) {
      setProjects(DEFAULT_CAPEX_DATA);
      saveCapexData(DEFAULT_CAPEX_DATA);
      markAsInitialized(); // Marquer comme initialisé
    }
    // Cas où les données existent mais sont vides (tableau vide)
    else {
      setProjects([]); // Respecter le choix de l'utilisateur d'avoir supprimé toutes les données
    }

    setLoading(false);
  }, []);

  // Sauvegarde automatique à chaque modification
  useEffect(() => {
    if (!loading) {
      saveCapexData(projects); // Sauvegarder même si tableau vide (choix utilisateur)
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

    // Extraire les colonnes personnalisées
    const customFields = {};
    Object.keys(projectData).forEach(key => {
      if (key.startsWith('custom_')) {
        customFields[key] = projectData[key];
      }
    });

    const newProject = {
      id: Date.now() + Math.random(), // ID plus robuste
      enveloppe: projectData.enveloppe || 'Autre',
      project: sanitizeString(projectData.project),
      budgetTotal: parseNumber(projectData.budgetTotal, 0),
      depense: parseNumber(projectData.depense, 0),
      engagement: parseNumber(projectData.engagement, 0),
      dateDebut: projectData.dateDebut || '',
      dateFin: projectData.dateFin || '',
      status: projectData.status || 'Planifié',
      notes: sanitizeString(projectData.notes),
      ...customFields // Inclure les colonnes personnalisées
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

    // Extraire les colonnes personnalisées
    const customFields = {};
    Object.keys(projectData).forEach(key => {
      if (key.startsWith('custom_')) {
        customFields[key] = projectData[key];
      }
    });

    const updatedProject = {
      id,
      enveloppe: projectData.enveloppe || 'Autre',
      project: sanitizeString(projectData.project),
      budgetTotal: parseNumber(projectData.budgetTotal, 0),
      depense: parseNumber(projectData.depense, 0),
      engagement: parseNumber(projectData.engagement, 0),
      dateDebut: projectData.dateDebut || '',
      dateFin: projectData.dateFin || '',
      status: projectData.status || 'Planifié',
      notes: sanitizeString(projectData.notes),
      ...customFields // Inclure les colonnes personnalisées
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

  /**
   * Calcule les totaux par enveloppe
   */
  const calculateEnveloppeTotal = useCallback((enveloppe) => {
    const enveloppeProjects = projects.filter(p => p.enveloppe === enveloppe);

    return enveloppeProjects.reduce((acc, project) => {
      return {
        budget: acc.budget + parseNumber(project.budgetTotal),
        depense: acc.depense + parseNumber(project.depense),
        engagement: acc.engagement + parseNumber(project.engagement),
        count: acc.count + 1
      };
    }, { budget: 0, depense: 0, engagement: 0, count: 0 });
  }, [projects]);

  /**
   * Récupère la liste de toutes les enveloppes utilisées
   */
  const getUsedEnveloppes = useCallback(() => {
    const enveloppes = new Set(projects.map(p => p.enveloppe).filter(Boolean));
    return Array.from(enveloppes).sort();
  }, [projects]);

  return {
    projects,
    loading,
    error,
    addProject,
    updateProject,
    deleteProject,
    resetToDefaults,
    calculateEnveloppeTotal,
    getUsedEnveloppes,
    setError
  };
};
