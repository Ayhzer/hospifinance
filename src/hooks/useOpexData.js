/**
 * Hook personnalisé pour la gestion des données OPEX
 */

import { useState, useEffect, useCallback } from 'react';
import { saveOpexData, loadOpexData } from '../services/storageService';
import { validateOpexData, parseNumber, sanitizeString } from '../utils/validators';

// Données par défaut
const DEFAULT_OPEX_DATA = [
  {
    id: 1,
    supplier: 'Oracle Health',
    category: 'Logiciels',
    budgetAnnuel: 500000,
    depenseActuelle: 375000,
    engagement: 50000,
    notes: 'Contrat de maintenance annuel'
  },
  {
    id: 2,
    supplier: 'Microsoft',
    category: 'Licences',
    budgetAnnuel: 300000,
    depenseActuelle: 280000,
    engagement: 15000,
    notes: 'Azure + Microsoft 365'
  },
  {
    id: 3,
    supplier: 'Dell Technologies',
    category: 'Support matériel',
    budgetAnnuel: 150000,
    depenseActuelle: 95000,
    engagement: 20000,
    notes: 'Contrat support serveurs'
  }
];

export const useOpexData = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Chargement initial des données
  useEffect(() => {
    const storedData = loadOpexData();
    setSuppliers(storedData || DEFAULT_OPEX_DATA);
    setLoading(false);
  }, []);

  // Sauvegarde automatique à chaque modification
  useEffect(() => {
    if (!loading && suppliers.length > 0) {
      saveOpexData(suppliers);
    }
  }, [suppliers, loading]);

  /**
   * Ajoute un nouveau fournisseur
   */
  const addSupplier = useCallback((supplierData) => {
    const validation = validateOpexData(supplierData);

    if (!validation.isValid) {
      setError(validation.errors.join(', '));
      return { success: false, errors: validation.errors };
    }

    const newSupplier = {
      id: Date.now() + Math.random(), // ID plus robuste
      supplier: sanitizeString(supplierData.supplier),
      category: sanitizeString(supplierData.category),
      budgetAnnuel: parseNumber(supplierData.budgetAnnuel, 0),
      depenseActuelle: parseNumber(supplierData.depenseActuelle, 0),
      engagement: parseNumber(supplierData.engagement, 0),
      notes: sanitizeString(supplierData.notes)
    };

    setSuppliers(prev => [...prev, newSupplier]);
    setError(null);
    return { success: true, data: newSupplier };
  }, []);

  /**
   * Met à jour un fournisseur existant
   */
  const updateSupplier = useCallback((id, supplierData) => {
    const validation = validateOpexData(supplierData);

    if (!validation.isValid) {
      setError(validation.errors.join(', '));
      return { success: false, errors: validation.errors };
    }

    const updatedSupplier = {
      id,
      supplier: sanitizeString(supplierData.supplier),
      category: sanitizeString(supplierData.category),
      budgetAnnuel: parseNumber(supplierData.budgetAnnuel, 0),
      depenseActuelle: parseNumber(supplierData.depenseActuelle, 0),
      engagement: parseNumber(supplierData.engagement, 0),
      notes: sanitizeString(supplierData.notes)
    };

    setSuppliers(prev => prev.map(s => s.id === id ? updatedSupplier : s));
    setError(null);
    return { success: true, data: updatedSupplier };
  }, []);

  /**
   * Supprime un fournisseur
   */
  const deleteSupplier = useCallback((id) => {
    setSuppliers(prev => prev.filter(s => s.id !== id));
    setError(null);
    return { success: true };
  }, []);

  /**
   * Réinitialise aux données par défaut
   */
  const resetToDefaults = useCallback(() => {
    setSuppliers(DEFAULT_OPEX_DATA);
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
