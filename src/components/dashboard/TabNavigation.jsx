/**
 * Composant TabNavigation - Navigation par onglets
 */

import React from 'react';
import { TrendingUp, DollarSign, Server } from 'lucide-react';

const TABS = [
  { id: 'overview', label: "Vue d'ensemble", icon: TrendingUp },
  { id: 'opex', label: 'OPEX', icon: DollarSign },
  { id: 'capex', label: 'CAPEX', icon: Server }
];

export const TabNavigation = ({ activeTab, onTabChange }) => {
  return (
    <div className="bg-white rounded-lg shadow-md mb-6">
      <div className="border-b border-gray-200">
        <nav className="flex -mb-px">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`
                  flex items-center gap-2 px-6 py-4 font-medium text-sm border-b-2 transition-colors
                  ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }
                `}
              >
                <Icon size={18} />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
};
