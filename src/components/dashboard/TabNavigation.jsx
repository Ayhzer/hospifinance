/**
 * Composant TabNavigation - Navigation par onglets avec renommage + dashboards custom (drag & drop)
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
  const { settings, reorderDashboards } = useSettings();
  const [customNames, setCustomNames] = useState({});
  const [editingTabId, setEditingTabId] = useState(null);
  const [editValue, setEditValue] = useState('');
  const inputRef = useRef(null);

  // Drag & drop state
  const dragIndexRef = useRef(null);
  const [dropIndex, setDropIndex] = useState(null); // index où l'indicateur de drop apparaît

  const customDashboards = settings.customDashboards || [];

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

  // --- Drag & Drop handlers ---
  const handleDragStart = (e, index) => {
    dragIndexRef.current = index;
    e.dataTransfer.effectAllowed = 'move';
    // Petit délai pour éviter que l'image ghost n'inclue le style hover
    e.currentTarget.style.opacity = '0.5';
  };

  const handleDragEnd = (e) => {
    e.currentTarget.style.opacity = '';
    setDropIndex(null);
    dragIndexRef.current = null;
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (dragIndexRef.current !== null && dragIndexRef.current !== index) {
      setDropIndex(index);
    }
  };

  const handleDragLeave = () => {
    setDropIndex(null);
  };

  const handleDrop = (e, toIndex) => {
    e.preventDefault();
    const fromIndex = dragIndexRef.current;
    if (fromIndex !== null && fromIndex !== toIndex) {
      reorderDashboards(fromIndex, toIndex);
    }
    setDropIndex(null);
    dragIndexRef.current = null;
  };

  // --- Rendu onglet fixe ---
  const renderFixedTab = (tab) => {
    const Icon = tab.icon;
    const displayLabel = customNames[tab.id] || tab.label;
    const isEditing = editingTabId === tab.id;

    return (
      <button
        key={tab.id}
        onClick={() => !isEditing && onTabChange(tab.id)}
        className={`
          flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-3 sm:py-4 font-medium text-xs sm:text-sm border-b-2 transition-colors flex-shrink-0 justify-center touch-manipulation min-w-0 group
          ${activeTab === tab.id
            ? 'border-blue-500 text-blue-600'
            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
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
    );
  };

  // --- Rendu onglet custom (draggable) ---
  const renderCustomTab = (d, index) => {
    const tabId = `custom_${d.id}`;
    const isActive = activeTab === tabId;
    const isDraggingOver = dropIndex === index;

    return (
      <div
        key={d.id}
        className="flex items-center relative"
        draggable
        onDragStart={(e) => handleDragStart(e, index)}
        onDragEnd={handleDragEnd}
        onDragOver={(e) => handleDragOver(e, index)}
        onDragLeave={handleDragLeave}
        onDrop={(e) => handleDrop(e, index)}
      >
        {/* Indicateur de drop à gauche */}
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
          <span className="truncate max-w-[8rem]">{d.name}</span>
        </button>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-md mb-4 sm:mb-6">
      <div className="border-b border-gray-200">
        <nav className="flex -mb-px overflow-x-auto">
          {/* Onglets fixes — non déplaçables */}
          {DEFAULT_TABS.map(tab => renderFixedTab(tab))}

          {/* Séparateur visuel si des dashboards custom existent */}
          {customDashboards.length > 0 && (
            <div className="flex-shrink-0 flex items-center px-1">
              <div className="h-5 w-px bg-gray-200" />
            </div>
          )}

          {/* Onglets custom — draggables */}
          {customDashboards.map((d, i) => renderCustomTab(d, i))}

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
