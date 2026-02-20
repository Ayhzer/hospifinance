/**
 * Composant TabNavigation - Navigation par onglets avec renommage + drag & drop universel
 * Tous les onglets (fixes et custom) sont réordonnables par glisser-déposer.
 */

import React, { useState, useRef, useEffect, useCallback } from 'react';
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

const FIXED_IDS = DEFAULT_TABS.map(t => t.id);

const TAB_ORDER_KEY = 'hospifinance_tab_order';

const loadTabOrder = () => {
  try {
    const raw = localStorage.getItem(TAB_ORDER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
};

const saveTabOrder = (order) => {
  try { localStorage.setItem(TAB_ORDER_KEY, JSON.stringify(order)); } catch {}
};

/** Fusionne l'ordre sauvegardé avec la liste courante des IDs. */
const buildTabOrder = (savedOrder, allIds) => {
  if (!savedOrder) return allIds;
  const valid = savedOrder.filter(id => allIds.includes(id));
  const newIds = allIds.filter(id => !savedOrder.includes(id));
  return [...valid, ...newIds];
};

export const TabNavigation = ({ activeTab, onTabChange, onCreateDashboard }) => {
  const { settings } = useSettings();
  const [customNames, setCustomNames] = useState({});
  const [editingTabId, setEditingTabId] = useState(null);
  const [editValue, setEditValue] = useState('');
  const inputRef = useRef(null);

  const customDashboards = settings.customDashboards || [];

  // Calcul des IDs courants (fixes + custom)
  const currentIds = [
    ...FIXED_IDS,
    ...customDashboards.map(d => `custom_${d.id}`)
  ];

  // Ordre des onglets (all tabs, fixed + custom, dans l'ordre choisi par l'utilisateur)
  const [tabOrder, setTabOrder] = useState(() =>
    buildTabOrder(loadTabOrder(), [
      ...FIXED_IDS,
      ...( (settings.customDashboards || []).map(d => `custom_${d.id}`) )
    ])
  );

  // Synchroniser tabOrder quand les dashboards custom changent (ajout / suppression)
  const currentIdsKey = currentIds.join(',');
  useEffect(() => {
    setTabOrder(prev => buildTabOrder(prev, currentIds));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIdsKey]);

  // Charger les noms personnalisés des onglets fixes
  useEffect(() => {
    const stored = loadTabNames();
    if (stored) setCustomNames(stored);
  }, []);

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
    if (e.key === 'Enter') saveEdit();
    else if (e.key === 'Escape') setEditingTabId(null);
  };

  // --- Drag & Drop universel ---
  const dragIndexRef = useRef(null);
  const [dropIndex, setDropIndex] = useState(null);

  const handleDragStart = useCallback((e, index) => {
    dragIndexRef.current = index;
    e.dataTransfer.effectAllowed = 'move';
    e.currentTarget.style.opacity = '0.5';
  }, []);

  const handleDragEnd = useCallback((e) => {
    e.currentTarget.style.opacity = '';
    setDropIndex(null);
    dragIndexRef.current = null;
  }, []);

  const handleDragOver = useCallback((e, index) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (dragIndexRef.current !== null && dragIndexRef.current !== index) {
      setDropIndex(index);
    }
  }, []);

  const handleDragLeave = useCallback(() => {
    setDropIndex(null);
  }, []);

  const handleDrop = useCallback((e, toIndex) => {
    e.preventDefault();
    const fromIndex = dragIndexRef.current;
    if (fromIndex !== null && fromIndex !== toIndex) {
      setTabOrder(prev => {
        const arr = [...prev];
        const [moved] = arr.splice(fromIndex, 1);
        arr.splice(toIndex, 0, moved);
        saveTabOrder(arr);
        return arr;
      });
    }
    setDropIndex(null);
    dragIndexRef.current = null;
  }, []);

  // --- Rendu d'un onglet fixe ---
  const renderFixedTab = (tab, index) => {
    const Icon = tab.icon;
    const displayLabel = customNames[tab.id] || tab.label;
    const isEditing = editingTabId === tab.id;
    const isDraggingOver = dropIndex === index;

    return (
      <div
        key={tab.id}
        className="flex items-center relative"
        draggable
        onDragStart={(e) => handleDragStart(e, index)}
        onDragEnd={handleDragEnd}
        onDragOver={(e) => handleDragOver(e, index)}
        onDragLeave={handleDragLeave}
        onDrop={(e) => handleDrop(e, index)}
      >
        {isDraggingOver && (
          <span className="absolute left-0 top-2 bottom-2 w-0.5 bg-blue-500 rounded-full z-10" />
        )}
        <button
          onClick={() => !isEditing && onTabChange(tab.id)}
          title="Glisser pour réorganiser"
          className={`
            flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-3 sm:py-4 font-medium text-xs sm:text-sm border-b-2 transition-colors flex-shrink-0 justify-center touch-manipulation cursor-grab active:cursor-grabbing select-none min-w-0 group
            ${activeTab === tab.id
              ? 'border-blue-500 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
            ${isDraggingOver ? 'bg-blue-50' : ''}
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
              <Pencil
                size={12}
                className="flex-shrink-0 opacity-0 group-hover:opacity-50 hover:!opacity-100 cursor-pointer transition-opacity"
                onClick={(e) => startEditing(e, tab.id, displayLabel)}
              />
            </>
          )}
        </button>
      </div>
    );
  };

  // --- Rendu d'un onglet custom ---
  const renderCustomTab = (dashboard, index) => {
    const tabId = `custom_${dashboard.id}`;
    const isActive = activeTab === tabId;
    const isDraggingOver = dropIndex === index;

    return (
      <div
        key={dashboard.id}
        className="flex items-center relative"
        draggable
        onDragStart={(e) => handleDragStart(e, index)}
        onDragEnd={handleDragEnd}
        onDragOver={(e) => handleDragOver(e, index)}
        onDragLeave={handleDragLeave}
        onDrop={(e) => handleDrop(e, index)}
      >
        {isDraggingOver && (
          <span className="absolute left-0 top-2 bottom-2 w-0.5 bg-blue-500 rounded-full z-10" />
        )}
        <button
          onClick={() => onTabChange(tabId)}
          title="Glisser pour réorganiser"
          className={`
            flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-3 sm:py-4 font-medium text-xs sm:text-sm border-b-2 transition-colors flex-shrink-0 justify-center touch-manipulation cursor-grab active:cursor-grabbing select-none
            ${isActive
              ? 'border-blue-500 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
            ${isDraggingOver ? 'bg-blue-50' : ''}
          `}
        >
          <LayoutDashboard size={16} className="sm:w-[18px] sm:h-[18px] flex-shrink-0" />
          <span className="truncate max-w-[8rem]">{dashboard.name}</span>
        </button>
      </div>
    );
  };

  // --- Rendu unifié dans l'ordre tabOrder ---
  const renderTab = (tabId, index) => {
    if (FIXED_IDS.includes(tabId)) {
      const tab = DEFAULT_TABS.find(t => t.id === tabId);
      return tab ? renderFixedTab(tab, index) : null;
    }
    if (tabId.startsWith('custom_')) {
      const dashId = tabId.replace('custom_', '');
      const dashboard = customDashboards.find(d => String(d.id) === dashId);
      return dashboard ? renderCustomTab(dashboard, index) : null;
    }
    return null;
  };

  return (
    <div className="bg-white rounded-lg shadow-md mb-4 sm:mb-6">
      <div className="border-b border-gray-200">
        <nav className="flex -mb-px overflow-x-auto">
          {tabOrder.map((tabId, index) => renderTab(tabId, index))}

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
