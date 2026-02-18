/**
 * Composant TabNavigation - Navigation par onglets avec renommage + dashboards custom
 */

import React, { useState, useRef, useEffect } from 'react';
import { TrendingUp, DollarSign, Server, ShoppingCart, Pencil, Plus, LayoutDashboard } from 'lucide-react';
import { saveTabNames, loadTabNames } from '../../services/storageService';
import { useSettings } from '../../contexts/SettingsContext';

const DEFAULT_TABS = [
  { id: 'overview', label: "Vue d'ensemble", icon: TrendingUp },
  { id: 'opex', label: 'OPEX', icon: DollarSign },
  { id: 'capex', label: 'CAPEX', icon: Server },
  { id: 'ordersOpex', label: 'Commandes OPEX', icon: ShoppingCart },
  { id: 'ordersCapex', label: 'Commandes CAPEX', icon: ShoppingCart }
];

export const TabNavigation = ({ activeTab, onTabChange, onCreateDashboard }) => {
  const { settings } = useSettings();
  const [customNames, setCustomNames] = useState({});
  const [editingTabId, setEditingTabId] = useState(null);
  const [editValue, setEditValue] = useState('');
  const inputRef = useRef(null);

  const customDashboards = settings.customDashboards || [];

  // Charger les noms personnalisés
  useEffect(() => {
    const stored = loadTabNames();
    if (stored) setCustomNames(stored);
  }, []);

  // Focus l'input quand on entre en mode édition
  useEffect(() => {
    if (editingTabId && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [editingTabId]);

  const startEditing = (e, tabId, currentLabel) => {
    e.stopPropagation();
    setEditingTabId(tabId);
    setEditValue(customNames[tabId] || currentLabel);
  };

  const saveEdit = () => {
    if (editingTabId && editValue.trim()) {
      const updated = { ...customNames, [editingTabId]: editValue.trim() };
      setCustomNames(updated);
      saveTabNames(updated);
    }
    setEditingTabId(null);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      saveEdit();
    } else if (e.key === 'Escape') {
      setEditingTabId(null);
    }
  };

  const renderTab = (tab, isCustom = false) => {
    const Icon = tab.icon;
    const displayLabel = isCustom ? tab.label : (customNames[tab.id] || tab.label);
    const isEditing = editingTabId === tab.id;

    return (
      <button
        key={tab.id}
        onClick={() => !isEditing && onTabChange(tab.id)}
        className={`
          flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-3 sm:py-4 font-medium text-xs sm:text-sm border-b-2 transition-colors flex-shrink-0 justify-center touch-manipulation min-w-0 group
          ${
            activeTab === tab.id
              ? 'border-blue-500 text-blue-600'
              : 'border-transparent text-gray-500 active:text-gray-700 active:border-gray-300'
          }
        `}
      >
        <Icon size={16} className="sm:w-[18px] sm:h-[18px] flex-shrink-0" />
        {isEditing ? (
          <input
            ref={inputRef}
            type="text"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onBlur={saveEdit}
            onKeyDown={handleKeyDown}
            className="w-20 sm:w-28 px-1 py-0 text-xs sm:text-sm border border-blue-300 rounded bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
            onClick={(e) => e.stopPropagation()}
          />
        ) : (
          <>
            <span className="truncate">{displayLabel}</span>
            {!isCustom && (
              <Pencil
                size={12}
                className="flex-shrink-0 opacity-0 group-hover:opacity-50 hover:!opacity-100 cursor-pointer transition-opacity"
                onClick={(e) => startEditing(e, tab.id, displayLabel)}
              />
            )}
          </>
        )}
      </button>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-md mb-4 sm:mb-6">
      <div className="border-b border-gray-200">
        <nav className="flex -mb-px overflow-x-auto">
          {/* Onglets fixes */}
          {DEFAULT_TABS.map(tab => renderTab(tab, false))}

          {/* Onglets custom */}
          {customDashboards.map(d => renderTab(
            { id: `custom_${d.id}`, label: d.name, icon: LayoutDashboard },
            true
          ))}

          {/* Bouton "+" */}
          <button
            onClick={onCreateDashboard}
            className="flex items-center gap-1 px-3 py-3 sm:py-4 text-gray-400 hover:text-blue-500 border-b-2 border-transparent transition-colors flex-shrink-0 touch-manipulation"
            title="Créer un tableau de bord"
          >
            <Plus size={16} />
          </button>
        </nav>
      </div>
    </div>
  );
};
