/**
 * Contexte de paramétrage - dual-mode LocalStorage / API
 * LocalStorage si VITE_API_URL absent, API sinon
 */

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import * as api from '../services/apiService';
import { saveSettings, loadSettings } from '../services/storageService';

const USE_API = !!import.meta.env.VITE_API_URL;

const SettingsContext = createContext(null);

const DEFAULT_SETTINGS = {
  appName: 'Tableau de Bord Financier DSI',
  colors: {
    primary: '#2563eb',
    success: '#16a34a',
    warning: '#d97706',
    danger: '#dc2626',
    info: '#0891b2',
    accent: '#7c3aed'
  },
  opexColumns: {
    supplier: true, category: true, budgetAnnuel: true,
    depenseActuelle: true, engagement: true, disponible: true,
    utilisation: true, notes: true, actions: true
  },
  capexColumns: {
    project: true, budgetTotal: true, depense: true,
    engagement: true, disponible: true, utilisation: true,
    status: true, period: true, notes: true, actions: true
  },
  rules: { warningThreshold: 75, criticalThreshold: 90 },
  customColumns: { opex: [], capex: [] }
};

const mergeSettings = (stored) => ({
  ...DEFAULT_SETTINGS,
  ...stored,
  colors: { ...DEFAULT_SETTINGS.colors, ...(stored.colors || {}) },
  opexColumns: { ...DEFAULT_SETTINGS.opexColumns, ...(stored.opexColumns || {}) },
  capexColumns: { ...DEFAULT_SETTINGS.capexColumns, ...(stored.capexColumns || {}) },
  rules: { ...DEFAULT_SETTINGS.rules, ...(stored.rules || {}) },
  customColumns: {
    opex: stored.customColumns?.opex || [],
    capex: stored.customColumns?.capex || []
  }
});

export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      if (USE_API) {
        try {
          const token = localStorage.getItem('authToken');
          if (token) {
            const apiSettings = await api.getSettings();
            setSettings(mergeSettings(apiSettings));
          }
        } catch (err) {
          if (!err.message?.includes('Token') && !err.message?.includes('401')) {
            console.error('Erreur chargement settings:', err);
          }
        } finally {
          setLoading(false);
        }
      } else {
        const stored = loadSettings();
        if (stored) setSettings(mergeSettings(stored));
        setLoading(false);
      }
    };
    loadData();
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

  const persist = useCallback(async (updated) => {
    if (USE_API) {
      try {
        const token = localStorage.getItem('authToken');
        if (token) await api.updateSettings(updated);
      } catch { /* silence */ }
    } else {
      saveSettings(updated);
    }
    return updated;
  }, []);

  const updateSettings = useCallback((newSettings) => {
    setSettings(prev => { const u = { ...prev, ...newSettings }; persist(u); return u; });
  }, [persist]);

  const updateColors = useCallback((colorKey, value) => {
    setSettings(prev => { const u = { ...prev, colors: { ...prev.colors, [colorKey]: value } }; persist(u); return u; });
  }, [persist]);

  const toggleOpexColumn = useCallback((columnKey) => {
    setSettings(prev => { const u = { ...prev, opexColumns: { ...prev.opexColumns, [columnKey]: !prev.opexColumns[columnKey] } }; persist(u); return u; });
  }, [persist]);

  const toggleCapexColumn = useCallback((columnKey) => {
    setSettings(prev => { const u = { ...prev, capexColumns: { ...prev.capexColumns, [columnKey]: !prev.capexColumns[columnKey] } }; persist(u); return u; });
  }, [persist]);

  const updateRules = useCallback((ruleKey, value) => {
    setSettings(prev => { const u = { ...prev, rules: { ...prev.rules, [ruleKey]: value } }; persist(u); return u; });
  }, [persist]);

  const resetSettings = useCallback(() => {
    setSettings(DEFAULT_SETTINGS);
    persist(DEFAULT_SETTINGS);
  }, [persist]);

  const addCustomColumn = useCallback(async (type, column) => {
    if (USE_API) {
      try {
        const updatedSettings = await api.addCustomColumn(type, column);
        setSettings(mergeSettings(updatedSettings));
      } catch { /* silence */ }
    } else {
      setSettings(prev => {
        const u = { ...prev, customColumns: { ...prev.customColumns, [type]: [...(prev.customColumns[type] || []), { ...column, id: Date.now().toString() }] } };
        saveSettings(u);
        return u;
      });
    }
  }, []);

  const removeCustomColumn = useCallback(async (type, columnId) => {
    if (USE_API) {
      try {
        const updatedSettings = await api.removeCustomColumn(type, columnId);
        setSettings(mergeSettings(updatedSettings));
      } catch { /* silence */ }
    } else {
      setSettings(prev => {
        const u = { ...prev, customColumns: { ...prev.customColumns, [type]: prev.customColumns[type].filter(col => col.id !== columnId) } };
        saveSettings(u);
        return u;
      });
    }
  }, []);

  const updateCustomColumn = useCallback((type, columnId, updates) => {
    setSettings(prev => {
      const u = { ...prev, customColumns: { ...prev.customColumns, [type]: prev.customColumns[type].map(col => col.id === columnId ? { ...col, ...updates } : col) } };
      persist(u);
      return u;
    });
  }, [persist]);

  return (
    <SettingsContext.Provider value={{
      settings, isSettingsOpen, setIsSettingsOpen, loading,
      updateSettings, updateColors, toggleOpexColumn, toggleCapexColumn,
      updateRules, resetSettings, addCustomColumn, removeCustomColumn, updateCustomColumn,
      DEFAULT_SETTINGS
    }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) throw new Error('useSettings doit être utilisé dans un SettingsProvider');
  return context;
};
