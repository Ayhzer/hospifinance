/**
 * Hook personnalisé pour la gestion des données CAPEX avec API MongoDB
 * Version migrée pour utiliser l'API Render au lieu de localStorage
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import * as api from '../services/apiService';
import { validateCapexData } from '../utils/validators';
import { calculateAvailable, calculateUsageRate } from '../utils/calculations';

export const useCapexData = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Chargement initial des données depuis l'API
  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await api.getCapex();
        setProjects(data || []);
      } catch (err) {
        console.error('Erreur chargement CAPEX:', err);
        setError(err.message);
        setProjects([]);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  /**
   * Ajoute un nouveau projet
   */
  const addProject = useCallback(async (projectData) => {
    const validation = validateCapexData(projectData);

    if (!validation.isValid) {
      setError(validation.errors.join(', '));
      return { success: false, errors: validation.errors };
    }

    try {
      const newProject = await api.createCapex(projectData);
      setProjects(prev => [...prev, newProject]);
      setError(null);
      return { success: true, data: newProject };
    } catch (err) {
      console.error('Erreur ajout CAPEX:', err);
      setError(err.message);
      return { success: false, errors: [err.message] };
    }
  }, []);

  /**
   * Met à jour un projet existant
   */
  const updateProject = useCallback(async (id, projectData) => {
    const validation = validateCapexData(projectData);

    if (!validation.isValid) {
      setError(validation.errors.join(', '));
      return { success: false, errors: validation.errors };
    }

    try {
      const updatedProject = await api.updateCapex(id, projectData);
      setProjects(prev => prev.map(p => p.id === id ? updatedProject : p));
      setError(null);
      return { success: true, data: updatedProject };
    } catch (err) {
      console.error('Erreur mise à jour CAPEX:', err);
      setError(err.message);
      return { success: false, errors: [err.message] };
    }
  }, []);

  /**
   * Supprime un projet
   */
  const deleteProject = useCallback(async (id) => {
    try {
      await api.deleteCapex(id);
      setProjects(prev => prev.filter(p => p.id !== id));
      setError(null);
      return { success: true };
    } catch (err) {
      console.error('Erreur suppression CAPEX:', err);
      setError(err.message);
      return { success: false, errors: [err.message] };
    }
  }, []);

  /**
   * Réinitialise aux données par défaut
   * Note: Avec l'API, cela pourrait supprimer toutes les données
   * À utiliser avec précaution
   */
  const resetToDefaults = useCallback(async () => {
    console.warn('resetToDefaults pas implémenté avec l\'API');
    setError(null);
  }, []);

  /**
   * Calcule le total par enveloppe budgétaire
   */
  const calculateEnveloppeTotal = useCallback((enveloppe) => {
    const enveloppeProjects = projects.filter(p => p.enveloppe === enveloppe);

    return enveloppeProjects.reduce(
      (acc, project) => ({
        budget: acc.budget + (project.budgetTotal || 0),
        depense: acc.depense + (project.depense || 0),
        engagement: acc.engagement + (project.engagement || 0)
      }),
      { budget: 0, depense: 0, engagement: 0 }
    );
  }, [projects]);

  /**
   * Récupère la liste des enveloppes utilisées
   */
  const getUsedEnveloppes = useCallback(() => {
    const enveloppes = new Set(projects.map(p => p.enveloppe || 'Autre'));
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
    setError,
    calculateEnveloppeTotal,
    getUsedEnveloppes
  };
};
