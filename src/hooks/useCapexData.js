/**
 * Hook CAPEX - dual-mode LocalStorage / API
 * LocalStorage si VITE_API_URL absent, API sinon
 */

import { useState, useEffect, useCallback, useRef } from 'react';

const USE_API = !!import.meta.env.VITE_API_URL;

import { saveCapexData, loadCapexData, hasCapexData, markAsInitialized } from '../services/storageService';
import { validateCapexData, parseNumber, sanitizeString } from '../utils/validators';
import * as api from '../services/apiService';
import * as github from '../services/githubStorageService';

const DEFAULT_CAPEX_DATA = [
  { id: 1, enveloppe: 'Infrastructure', project: 'Renouvellement Datacenter', budgetTotal: 2000000, depense: 1200000, engagement: 300000, dateDebut: '2024-01-01', dateFin: '2024-12-31', status: 'En cours', notes: 'Phase 2 en cours' },
  { id: 2, enveloppe: 'Poste de travail', project: 'Déploiement VDI', budgetTotal: 800000, depense: 650000, engagement: 100000, dateDebut: '2024-03-01', dateFin: '2024-11-30', status: 'En cours', notes: '85% des postes déployés' },
  { id: 3, enveloppe: 'Cybersécurité', project: 'Cybersécurité - SIEM', budgetTotal: 500000, depense: 500000, engagement: 0, dateDebut: '2023-09-01', dateFin: '2024-02-28', status: 'Terminé', notes: 'Projet finalisé' }
];

export const useCapexData = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const githubPushTimer = useRef(null);
  const skipNextGithubPush = useRef(false);

  useEffect(() => {
    const loadData = async () => {
      if (USE_API) {
        try {
          const token = localStorage.getItem('authToken');
          if (!token) { setLoading(false); return; }
          const data = await api.getCapex();
          setProjects(data || []);
        } catch (err) {
          if (!err.message?.includes('Token') && !err.message?.includes('401')) {
            setError(err.message);
          }
          setProjects([]);
        } finally {
          setLoading(false);
        }
      } else {
        const storedData = loadCapexData();
        if (storedData && storedData.length > 0) {
          setProjects(storedData);
        } else if (!hasCapexData()) {
          setProjects(DEFAULT_CAPEX_DATA);
          saveCapexData(DEFAULT_CAPEX_DATA);
          markAsInitialized();
        } else {
          setProjects([]);
        }
        setLoading(false);

        // Sync depuis GitHub après chargement local
        if (github.isGitHubEnabled()) {
          github.fetchCapex().then(data => {
            if (data !== null) {
              skipNextGithubPush.current = true;
              setProjects(data);
              saveCapexData(data);
            }
          }).catch(err => console.warn('[GitHub] Sync CAPEX échoué:', err.message));
        }
      }
    };
    loadData();
  }, []);

  useEffect(() => {
    if (!USE_API && !loading) {
      saveCapexData(projects);
      if (github.isGitHubEnabled()) {
        if (skipNextGithubPush.current) {
          skipNextGithubPush.current = false;
          return;
        }
        clearTimeout(githubPushTimer.current);
        githubPushTimer.current = setTimeout(() => {
          github.pushCapex(projects).catch(err => console.warn('[GitHub] Push CAPEX échoué:', err.message));
        }, 800);
      }
    }
  }, [projects, loading]);

  const addProject = useCallback(async (projectData) => {
    const validation = validateCapexData(projectData);
    if (!validation.isValid) {
      setError(validation.errors.join(', '));
      return { success: false, errors: validation.errors };
    }

    if (USE_API) {
      try {
        const newProject = await api.createCapex(projectData);
        setProjects(prev => [...prev, newProject]);
        setError(null);
        return { success: true, data: newProject };
      } catch (err) {
        setError(err.message);
        return { success: false, errors: [err.message] };
      }
    } else {
      const customFields = {};
      Object.keys(projectData).forEach(k => { if (k.startsWith('custom_')) customFields[k] = projectData[k]; });
      const newProject = {
        id: Date.now() + Math.random(),
        enveloppe: projectData.enveloppe || 'Autre',
        project: sanitizeString(projectData.project),
        budgetTotal: parseNumber(projectData.budgetTotal, 0),
        depense: parseNumber(projectData.depense, 0),
        engagement: parseNumber(projectData.engagement, 0),
        dateDebut: projectData.dateDebut || '',
        dateFin: projectData.dateFin || '',
        status: projectData.status || 'Planifié',
        notes: sanitizeString(projectData.notes),
        ...customFields
      };
      setProjects(prev => [...prev, newProject]);
      setError(null);
      return { success: true, data: newProject };
    }
  }, []);

  const updateProject = useCallback(async (id, projectData) => {
    const validation = validateCapexData(projectData);
    if (!validation.isValid) {
      setError(validation.errors.join(', '));
      return { success: false, errors: validation.errors };
    }

    if (USE_API) {
      try {
        const updated = await api.updateCapex(id, projectData);
        setProjects(prev => prev.map(p => p.id === id ? updated : p));
        setError(null);
        return { success: true, data: updated };
      } catch (err) {
        setError(err.message);
        return { success: false, errors: [err.message] };
      }
    } else {
      const customFields = {};
      Object.keys(projectData).forEach(k => { if (k.startsWith('custom_')) customFields[k] = projectData[k]; });
      const updated = {
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
        ...customFields
      };
      setProjects(prev => prev.map(p => p.id === id ? updated : p));
      setError(null);
      return { success: true, data: updated };
    }
  }, []);

  const deleteProject = useCallback(async (id) => {
    if (USE_API) {
      try {
        await api.deleteCapex(id);
        setProjects(prev => prev.filter(p => p.id !== id));
        setError(null);
        return { success: true };
      } catch (err) {
        setError(err.message);
        return { success: false, errors: [err.message] };
      }
    } else {
      setProjects(prev => prev.filter(p => p.id !== id));
      setError(null);
      return { success: true };
    }
  }, []);

  const resetToDefaults = useCallback(() => {
    if (!USE_API) setProjects(DEFAULT_CAPEX_DATA);
    setError(null);
  }, []);

  const calculateEnveloppeTotal = useCallback((enveloppe) => {
    return projects
      .filter(p => p.enveloppe === enveloppe)
      .reduce((acc, p) => ({
        budget: acc.budget + (p.budgetTotal || 0),
        depense: acc.depense + (p.depense || 0),
        engagement: acc.engagement + (p.engagement || 0),
        count: acc.count + 1
      }), { budget: 0, depense: 0, engagement: 0, count: 0 });
  }, [projects]);

  const getUsedEnveloppes = useCallback(() => {
    return Array.from(new Set(projects.map(p => p.enveloppe).filter(Boolean))).sort();
  }, [projects]);

  return { projects, loading, error, addProject, updateProject, deleteProject, resetToDefaults, setError, calculateEnveloppeTotal, getUsedEnveloppes };
};
