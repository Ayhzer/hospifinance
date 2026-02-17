/**
 * Hook OPEX - dual-mode LocalStorage / API
 * LocalStorage si VITE_API_URL absent, API sinon
 */

import { useState, useEffect, useCallback, useRef } from 'react';

const USE_API = !!import.meta.env.VITE_API_URL;

import { saveOpexData, loadOpexData, hasOpexData, markAsInitialized } from '../services/storageService';
import { validateOpexData, parseNumber, sanitizeString } from '../utils/validators';
import * as api from '../services/apiService';
import * as github from '../services/githubStorageService';

const DEFAULT_OPEX_DATA = [
  { id: 1, supplier: 'Oracle Health', category: 'Logiciels', budgetAnnuel: 500000, depenseActuelle: 375000, engagement: 50000, notes: 'Contrat de maintenance annuel' },
  { id: 2, supplier: 'Microsoft', category: 'Licences', budgetAnnuel: 300000, depenseActuelle: 280000, engagement: 15000, notes: 'Azure + Microsoft 365' },
  { id: 3, supplier: 'Dell Technologies', category: 'Support matériel', budgetAnnuel: 150000, depenseActuelle: 95000, engagement: 20000, notes: 'Contrat support serveurs' }
];

export const useOpexData = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const githubPushTimer = useRef(null);
  const skipNextGithubPush = useRef(false);

  // ---- Chargement initial ----
  useEffect(() => {
    const loadData = async () => {
      if (USE_API) {
        try {
          const token = localStorage.getItem('authToken');
          if (!token) { setLoading(false); return; }
          const data = await api.getOpex();
          setSuppliers(data || []);
        } catch (err) {
          if (!err.message?.includes('Token') && !err.message?.includes('401')) {
            setError(err.message);
          }
          setSuppliers([]);
        } finally {
          setLoading(false);
        }
      } else {
        const storedData = loadOpexData();
        if (storedData && storedData.length > 0) {
          setSuppliers(storedData);
        } else if (!hasOpexData()) {
          setSuppliers(DEFAULT_OPEX_DATA);
          saveOpexData(DEFAULT_OPEX_DATA);
          markAsInitialized();
        } else {
          setSuppliers([]);
        }
        setLoading(false);

        // Sync depuis GitHub après chargement local (source de vérité distante)
        if (github.isGitHubEnabled()) {
          github.fetchOpex().then(data => {
            if (data !== null) {
              skipNextGithubPush.current = true;
              setSuppliers(data);
              saveOpexData(data);
            }
          }).catch(err => console.warn('[GitHub] Sync OPEX échoué:', err.message));
        }
      }
    };
    loadData();
  }, []);

  // ---- Sauvegarde auto localStorage + push GitHub (débounce 800ms) ----
  useEffect(() => {
    if (!USE_API && !loading) {
      saveOpexData(suppliers);
      if (github.isGitHubEnabled()) {
        if (skipNextGithubPush.current) {
          skipNextGithubPush.current = false;
          return;
        }
        clearTimeout(githubPushTimer.current);
        githubPushTimer.current = setTimeout(() => {
          github.pushOpex(suppliers).catch(err => console.warn('[GitHub] Push OPEX échoué:', err.message));
        }, 800);
      }
    }
  }, [suppliers, loading]);

  const addSupplier = useCallback(async (supplierData) => {
    const validation = validateOpexData(supplierData);
    if (!validation.isValid) {
      setError(validation.errors.join(', '));
      return { success: false, errors: validation.errors };
    }

    if (USE_API) {
      try {
        const newSupplier = await api.createOpex(supplierData);
        setSuppliers(prev => {
          if (prev.some(s => String(s.id) === String(newSupplier.id))) return prev;
          return [...prev, newSupplier];
        });
        setError(null);
        return { success: true, data: newSupplier };
      } catch (err) {
        setError(err.message);
        return { success: false, errors: [err.message] };
      }
    } else {
      const customFields = {};
      Object.keys(supplierData).forEach(k => { if (k.startsWith('custom_')) customFields[k] = supplierData[k]; });
      const newSupplier = {
        id: Date.now() + Math.random(),
        supplier: sanitizeString(supplierData.supplier),
        category: sanitizeString(supplierData.category),
        budgetAnnuel: parseNumber(supplierData.budgetAnnuel, 0),
        depenseActuelle: parseNumber(supplierData.depenseActuelle, 0),
        engagement: parseNumber(supplierData.engagement, 0),
        notes: sanitizeString(supplierData.notes),
        ...customFields
      };
      setSuppliers(prev => {
        if (prev.some(s => String(s.id) === String(newSupplier.id))) return prev;
        return [...prev, newSupplier];
      });
      setError(null);
      return { success: true, data: newSupplier };
    }
  }, []);

  const updateSupplier = useCallback(async (id, supplierData) => {
    const validation = validateOpexData(supplierData);
    if (!validation.isValid) {
      setError(validation.errors.join(', '));
      return { success: false, errors: validation.errors };
    }

    if (USE_API) {
      try {
        const updated = await api.updateOpex(id, supplierData);
        setSuppliers(prev => {
          const deduped = prev.filter((s, i, arr) => arr.findIndex(x => String(x.id) === String(s.id)) === i);
          return deduped.map(s => String(s.id) === String(id) ? updated : s);
        });
        setError(null);
        return { success: true, data: updated };
      } catch (err) {
        setError(err.message);
        return { success: false, errors: [err.message] };
      }
    } else {
      const customFields = {};
      Object.keys(supplierData).forEach(k => { if (k.startsWith('custom_')) customFields[k] = supplierData[k]; });
      const updated = {
        id,
        supplier: sanitizeString(supplierData.supplier),
        category: sanitizeString(supplierData.category),
        budgetAnnuel: parseNumber(supplierData.budgetAnnuel, 0),
        depenseActuelle: parseNumber(supplierData.depenseActuelle, 0),
        engagement: parseNumber(supplierData.engagement, 0),
        notes: sanitizeString(supplierData.notes),
        ...customFields
      };
      setSuppliers(prev => {
        const deduped = prev.filter((s, i, arr) => arr.findIndex(x => String(x.id) === String(s.id)) === i);
        return deduped.map(s => String(s.id) === String(id) ? updated : s);
      });
      setError(null);
      return { success: true, data: updated };
    }
  }, []);

  const deleteSupplier = useCallback(async (id) => {
    if (USE_API) {
      try {
        await api.deleteOpex(id);
        setSuppliers(prev => prev.filter(s => s.id !== id));
        setError(null);
        return { success: true };
      } catch (err) {
        setError(err.message);
        return { success: false, errors: [err.message] };
      }
    } else {
      setSuppliers(prev => prev.filter(s => s.id !== id));
      setError(null);
      return { success: true };
    }
  }, []);

  const resetToDefaults = useCallback(() => {
    if (!USE_API) setSuppliers(DEFAULT_OPEX_DATA);
    setError(null);
  }, []);

  return { suppliers, loading, error, addSupplier, updateSupplier, deleteSupplier, resetToDefaults, setError };
};
