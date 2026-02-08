/**
 * Composant principal de l'application Hospifinance
 * Tableau de bord financier DSI - Version optimisée
 */

import React, { useState, useCallback } from 'react';
import { DollarSign, Server } from 'lucide-react';

// Hooks
import { useOpexData } from './hooks/useOpexData';
import { useCapexData } from './hooks/useCapexData';
import {
  useOpexTotals,
  useCapexTotals,
  useConsolidatedTotals
} from './hooks/useBudgetCalculations';

// Composants
import { TabNavigation } from './components/dashboard/TabNavigation';
import { BudgetCard } from './components/dashboard/BudgetCard';
import { ConsolidatedBudget } from './components/dashboard/ConsolidatedBudget';
import { BudgetCharts } from './components/dashboard/BudgetCharts';
import { OpexTable } from './components/opex/OpexTable';
import { OpexModal } from './components/opex/OpexModal';
import { CapexTable } from './components/capex/CapexTable';
import { CapexModal } from './components/capex/CapexModal';
import { AlertBanner } from './components/common/AlertBanner';

const HospitalITFinanceDashboard = () => {
  // États pour les onglets
  const [activeTab, setActiveTab] = useState('overview');

  // États pour les modales OPEX
  const [showOpexModal, setShowOpexModal] = useState(false);
  const [editingOpex, setEditingOpex] = useState(null);

  // États pour les modales CAPEX
  const [showCapexModal, setShowCapexModal] = useState(false);
  const [editingCapex, setEditingCapex] = useState(null);

  // Hooks de données OPEX
  const {
    suppliers,
    loading: opexLoading,
    error: opexError,
    addSupplier,
    updateSupplier,
    deleteSupplier,
    setError: setOpexError
  } = useOpexData();

  // Hooks de données CAPEX
  const {
    projects,
    loading: capexLoading,
    error: capexError,
    addProject,
    updateProject,
    deleteProject,
    setError: setCapexError
  } = useCapexData();

  // Calculs mémorisés
  const opexTotals = useOpexTotals(suppliers);
  const capexTotals = useCapexTotals(projects);
  const consolidatedTotals = useConsolidatedTotals(opexTotals, capexTotals);

  // Handlers OPEX
  const handleAddOpex = useCallback(() => {
    setEditingOpex(null);
    setShowOpexModal(true);
  }, []);

  const handleEditOpex = useCallback((supplier) => {
    setEditingOpex(supplier);
    setShowOpexModal(true);
  }, []);

  const handleSaveOpex = useCallback(
    (data) => {
      const result = editingOpex
        ? updateSupplier(editingOpex.id, data)
        : addSupplier(data);

      if (result.success) {
        setShowOpexModal(false);
        setEditingOpex(null);
      }
    },
    [editingOpex, addSupplier, updateSupplier]
  );

  const handleDeleteOpex = useCallback(
    (id) => {
      deleteSupplier(id);
    },
    [deleteSupplier]
  );

  // Handlers CAPEX
  const handleAddCapex = useCallback(() => {
    setEditingCapex(null);
    setShowCapexModal(true);
  }, []);

  const handleEditCapex = useCallback((project) => {
    setEditingCapex(project);
    setShowCapexModal(true);
  }, []);

  const handleSaveCapex = useCallback(
    (data) => {
      const result = editingCapex
        ? updateProject(editingCapex.id, data)
        : addProject(data);

      if (result.success) {
        setShowCapexModal(false);
        setEditingCapex(null);
      }
    },
    [editingCapex, addProject, updateProject]
  );

  const handleDeleteCapex = useCallback(
    (id) => {
      deleteProject(id);
    },
    [deleteProject]
  );

  // Chargement
  if (opexLoading || capexLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement des données...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* En-tête */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Tableau de Bord Financier DSI
          </h1>
          <p className="text-gray-600">
            Suivi budgétaire OPEX & CAPEX - Année {new Date().getFullYear()}
          </p>
        </div>

        {/* Alertes d'erreur */}
        {opexError && (
          <AlertBanner
            type="error"
            message={opexError}
            className="mb-4"
          />
        )}
        {capexError && (
          <AlertBanner
            type="error"
            message={capexError}
            className="mb-4"
          />
        )}

        {/* Navigation par onglets */}
        <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />

        {/* Vue d'ensemble */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <BudgetCard
                title="OPEX - Dépenses d'exploitation"
                icon={DollarSign}
                totals={opexTotals}
                iconColor="text-blue-500"
              />
              <BudgetCard
                title="CAPEX - Investissements"
                icon={Server}
                totals={capexTotals}
                iconColor="text-green-500"
              />
            </div>
            <ConsolidatedBudget consolidatedTotals={consolidatedTotals} />
            <BudgetCharts opexTotals={opexTotals} capexTotals={capexTotals} />
          </div>
        )}

        {/* Onglet OPEX */}
        {activeTab === 'opex' && (
          <OpexTable
            suppliers={suppliers}
            totals={opexTotals}
            onEdit={handleEditOpex}
            onDelete={handleDeleteOpex}
            onAdd={handleAddOpex}
          />
        )}

        {/* Onglet CAPEX */}
        {activeTab === 'capex' && (
          <CapexTable
            projects={projects}
            totals={capexTotals}
            onEdit={handleEditCapex}
            onDelete={handleDeleteCapex}
            onAdd={handleAddCapex}
          />
        )}

        {/* Modales */}
        <OpexModal
          isOpen={showOpexModal}
          onClose={() => {
            setShowOpexModal(false);
            setEditingOpex(null);
            setOpexError(null);
          }}
          onSave={handleSaveOpex}
          editingSupplier={editingOpex}
        />

        <CapexModal
          isOpen={showCapexModal}
          onClose={() => {
            setShowCapexModal(false);
            setEditingCapex(null);
            setCapexError(null);
          }}
          onSave={handleSaveCapex}
          editingProject={editingCapex}
        />
      </div>
    </div>
  );
};

export default HospitalITFinanceDashboard;
