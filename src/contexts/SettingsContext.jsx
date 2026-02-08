/**
 * Contexte de paramétrage - Couleurs, colonnes, règles de gestion
 */

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { saveSettings, loadSettings } from '../services/storageService';

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
  }
};

export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Chargement initial
  useEffect(() => {
    const stored = loadSettings();
    if (stored) {
      // Merge avec les défauts pour les nouvelles clés
      setSettings(prev => ({
        ...DEFAULT_SETTINGS,
        ...stored,
        colors: { ...DEFAULT_SETTINGS.colors, ...(stored.colors || {}) },
        opexColumns: { ...DEFAULT_SETTINGS.opexColumns, ...(stored.opexColumns || {}) },
        capexColumns: { ...DEFAULT_SETTINGS.capexColumns, ...(stored.capexColumns || {}) },
        rules: { ...DEFAULT_SETTINGS.rules, ...(stored.rules || {}) }
      }));
    }
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

  const updateSettings = useCallback((newSettings) => {
    setSettings(prev => {
      const updated = { ...prev, ...newSettings };
      saveSettings(updated);
      return updated;
    });
  }, []);

  const updateColors = useCallback((colorKey, value) => {
    setSettings(prev => {
      const updated = {
        ...prev,
        colors: { ...prev.colors, [colorKey]: value }
      };
      saveSettings(updated);
      return updated;
    });
  }, []);

  const toggleOpexColumn = useCallback((columnKey) => {
    setSettings(prev => {
      const updated = {
        ...prev,
        opexColumns: { ...prev.opexColumns, [columnKey]: !prev.opexColumns[columnKey] }
      };
      saveSettings(updated);
      return updated;
    });
  }, []);

  const toggleCapexColumn = useCallback((columnKey) => {
    setSettings(prev => {
      const updated = {
        ...prev,
        capexColumns: { ...prev.capexColumns, [columnKey]: !prev.capexColumns[columnKey] }
      };
      saveSettings(updated);
      return updated;
    });
  }, []);

  const updateRules = useCallback((ruleKey, value) => {
    setSettings(prev => {
      const updated = {
        ...prev,
        rules: { ...prev.rules, [ruleKey]: value }
      };
      saveSettings(updated);
      return updated;
    });
  }, []);

  const resetSettings = useCallback(() => {
    setSettings(DEFAULT_SETTINGS);
    saveSettings(DEFAULT_SETTINGS);
  }, []);

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
      DEFAULT_SETTINGS
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
