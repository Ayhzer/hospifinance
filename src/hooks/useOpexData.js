/**
 * Hook personnalisé pour la gestion des données OPEX avec API MongoDB
 * Version migrée pour utiliser l'API Render au lieu de localStorage
 */

import { useState, useEffect, useCallback } from 'react';
import * as api from '../services/apiService';
import { validateOpexData } from '../utils/validators';

export const useOpexData = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Chargement initial des données depuis l'API
  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await api.getOpex();
        setSuppliers(data || []);
      } catch (err) {
        console.error('Erreur chargement OPEX:', err);
        setError(err.message);
        setSuppliers([]);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  /**
   * Ajoute un nouveau fournisseur
   */
  const addSupplier = useCallback(async (supplierData) => {
    const validation = validateOpexData(supplierData);

    if (!validation.isValid) {
      setError(validation.errors.join(', '));
      return { success: false, errors: validation.errors };
    }

    try {
      const newSupplier = await api.createOpex(supplierData);
      setSuppliers(prev => [...prev, newSupplier]);
      setError(null);
      return { success: true, data: newSupplier };
    } catch (err) {
      console.error('Erreur ajout OPEX:', err);
      setError(err.message);
      return { success: false, errors: [err.message] };
    }
  }, []);

  /**
   * Met à jour un fournisseur existant
   */
  const updateSupplier = useCallback(async (id, supplierData) => {
    const validation = validateOpexData(supplierData);

    if (!validation.isValid) {
      setError(validation.errors.join(', '));
      return { success: false, errors: validation.errors };
    }

    try {
      const updatedSupplier = await api.updateOpex(id, supplierData);
      setSuppliers(prev => prev.map(s => s.id === id ? updatedSupplier : s));
      setError(null);
      return { success: true, data: updatedSupplier };
    } catch (err) {
      console.error('Erreur mise à jour OPEX:', err);
      setError(err.message);
      return { success: false, errors: [err.message] };
    }
  }, []);

  /**
   * Supprime un fournisseur
   */
  const deleteSupplier = useCallback(async (id) => {
    try {
      await api.deleteOpex(id);
      setSuppliers(prev => prev.filter(s => s.id !== id));
      setError(null);
      return { success: true };
    } catch (err) {
      console.error('Erreur suppression OPEX:', err);
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

  return {
    suppliers,
    loading,
    error,
    addSupplier,
    updateSupplier,
    deleteSupplier,
    resetToDefaults,
    setError
  };
};
