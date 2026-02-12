/**
 * Contexte de paramétrage avec API MongoDB
 * Version migrée pour utiliser l'API Render au lieu de localStorage
 */

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import * as api from '../services/apiService';

const SettingsContext = createContext(null);

const DEFAULT_SETTINGS = {
  // Nom de l'application
  appName: 'Tableau de Bord Financier DSI',

  // Couleurs principales
  colors: {
    primary: '#2563eb',    // blue-600
    success: '#16a34a',    // green-600
    warning: '#d97706',    // amber-600
    danger: '#dc2626',     // red-600
    info: '#0891b2',       // cyan-600
    accent: '#7c3aed'      // violet-600
  },

  // Visibilité des colonnes OPEX
  opexColumns: {
    supplier: true,
    category: true,
    budgetAnnuel: true,
    depenseActuelle: true,
    engagement: true,
    disponible: true,
    utilisation: true,
    notes: true,
    actions: true
  },

  // Visibilité des colonnes CAPEX
  capexColumns: {
    project: true,
    budgetTotal: true,
    depense: true,
    engagement: true,
    disponible: true,
    utilisation: true,
    status: true,
    period: true,
    notes: true,
    actions: true
  },

  // Règles de gestion
  rules: {
    warningThreshold: 75,
    criticalThreshold: 90
  },

  // Colonnes personnalisées
  customColumns: {
    opex: [],
    capex: []
  }
};

export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // Chargement initial depuis l'API
  useEffect(() => {
    const loadSettingsFromAPI = async () => {
      try {
        const token = localStorage.getItem('authToken');
        if (!token) {
          // Pas de token, utiliser les settings par défaut
          setLoading(false);
          return;
        }

        const apiSettings = await api.getSettings();

        // Merger avec les défauts pour les nouvelles clés
        setSettings({
          ...DEFAULT_SETTINGS,
          ...apiSettings,
          colors: { ...DEFAULT_SETTINGS.colors, ...(apiSettings.colors || {}) },
          opexColumns: { ...DEFAULT_SETTINGS.opexColumns, ...(apiSettings.opexColumns || {}) },
          capexColumns: { ...DEFAULT_SETTINGS.capexColumns, ...(apiSettings.capexColumns || {}) },
          rules: { ...DEFAULT_SETTINGS.rules, ...(apiSettings.rules || {}) },
          customColumns: {
            opex: apiSettings.customColumns?.opex || [],
            capex: apiSettings.customColumns?.capex || []
          }
        });
      } catch (error) {
        console.error('Erreur chargement settings:', error);
        // En cas d'erreur, utiliser les settings par défaut
      } finally {
        setLoading(false);
      }
    };

    loadSettingsFromAPI();
  }, []);

  // Appliquer les couleurs CSS custom properties
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--color-primary', settings.colors.primary);
    root.style.setProperty('--color-success', settings.colors.success);
    root.style.setProperty('--color-warning', settings.colors.warning);
    root.style.setProperty('--color-danger', settings.colors.danger);
    root.style.setProperty('--color-info', settings.colors.info);
    root.style.setProperty('--color-accent', settings.colors.accent);
  }, [settings.colors]);

  /**
   * Sauvegarder les settings dans l'API
   */
  const saveSettingsToAPI = useCallback(async (updatedSettings) => {
    try {
      const token = localStorage.getItem('authToken');
      if (token) {
        await api.updateSettings(updatedSettings);
      }
    } catch (error) {
      console.error('Erreur sauvegarde settings:', error);
    }
  }, []);

  const updateSettings = useCallback((newSettings) => {
    setSettings(prev => {
      const updated = { ...prev, ...newSettings };
      saveSettingsToAPI(updated);
      return updated;
    });
  }, [saveSettingsToAPI]);

  const updateColors = useCallback((colorKey, value) => {
    setSettings(prev => {
      const updated = {
        ...prev,
        colors: { ...prev.colors, [colorKey]: value }
      };
      saveSettingsToAPI(updated);
      return updated;
    });
  }, [saveSettingsToAPI]);

  const toggleOpexColumn = useCallback((columnKey) => {
    setSettings(prev => {
      const updated = {
        ...prev,
        opexColumns: { ...prev.opexColumns, [columnKey]: !prev.opexColumns[columnKey] }
      };
      saveSettingsToAPI(updated);
      return updated;
    });
  }, [saveSettingsToAPI]);

  const toggleCapexColumn = useCallback((columnKey) => {
    setSettings(prev => {
      const updated = {
        ...prev,
        capexColumns: { ...prev.capexColumns, [columnKey]: !prev.capexColumns[columnKey] }
      };
      saveSettingsToAPI(updated);
      return updated;
    });
  }, [saveSettingsToAPI]);

  const updateRules = useCallback((ruleKey, value) => {
    setSettings(prev => {
      const updated = {
        ...prev,
        rules: { ...prev.rules, [ruleKey]: value }
      };
      saveSettingsToAPI(updated);
      return updated;
    });
  }, [saveSettingsToAPI]);

  const resetSettings = useCallback(() => {
    setSettings(DEFAULT_SETTINGS);
    saveSettingsToAPI(DEFAULT_SETTINGS);
  }, [saveSettingsToAPI]);

  /**
   * Ajoute une colonne personnalisée via l'API
   */
  const addCustomColumn = useCallback(async (type, column) => {
    try {
      const updatedSettings = await api.addCustomColumn(type, column);
      setSettings({
        ...DEFAULT_SETTINGS,
        ...updatedSettings,
        colors: { ...DEFAULT_SETTINGS.colors, ...(updatedSettings.colors || {}) },
        customColumns: {
          opex: updatedSettings.customColumns?.opex || [],
          capex: updatedSettings.customColumns?.capex || []
        }
      });
    } catch (error) {
      console.error('Erreur ajout colonne personnalisée:', error);
    }
  }, []);

  /**
   * Supprime une colonne personnalisée via l'API
   */
  const removeCustomColumn = useCallback(async (type, columnId) => {
    try {
      const updatedSettings = await api.removeCustomColumn(type, columnId);
      setSettings({
        ...DEFAULT_SETTINGS,
        ...updatedSettings,
        colors: { ...DEFAULT_SETTINGS.colors, ...(updatedSettings.colors || {}) },
        customColumns: {
          opex: updatedSettings.customColumns?.opex || [],
          capex: updatedSettings.customColumns?.capex || []
        }
      });
    } catch (error) {
      console.error('Erreur suppression colonne personnalisée:', error);
    }
  }, []);

  /**
   * Met à jour une colonne personnalisée
   * Note: Cette fonctionnalité nécessite d'être implémentée côté serveur
   */
  const updateCustomColumn = useCallback((type, columnId, updates) => {
    // TODO: Implémenter côté serveur
    console.warn('updateCustomColumn pas encore implémenté côté API');
    setSettings(prev => {
      const updated = {
        ...prev,
        customColumns: {
          ...prev.customColumns,
          [type]: prev.customColumns[type].map(col =>
            col.id === columnId ? { ...col, ...updates } : col
          )
        }
      };
      saveSettingsToAPI(updated);
      return updated;
    });
  }, [saveSettingsToAPI]);

  return (
    <SettingsContext.Provider value={{
      settings,
      isSettingsOpen,
      setIsSettingsOpen,
      updateSettings,
      updateColors,
      toggleOpexColumn,
      toggleCapexColumn,
      updateRules,
      resetSettings,
      addCustomColumn,
      removeCustomColumn,
      updateCustomColumn,
      DEFAULT_SETTINGS,
      loading
    }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings doit être utilisé dans un SettingsProvider');
  }
  return context;
};
