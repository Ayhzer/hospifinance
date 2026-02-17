/**
 * Composant principal de l'application Hospifinance
 * Tableau de bord financier DSI - Version 3.0
 */

import { useState, useCallback } from 'react';
import { DollarSign, Server, LogOut, Settings } from 'lucide-react';

// Contextes
import { useAuth } from './contexts/AuthContext';
import { usePermissions } from './contexts/PermissionsContext';
import { useSettings } from './contexts/SettingsContext';

// Hooks
import { useOpexData } from './hooks/useOpexData';
import { useCapexData } from './hooks/useCapexData';
import { useOrderData } from './hooks/useOrderData';
import { useSettingsShortcut } from './hooks/useSettingsShortcut';
import {
  useOpexTotals,
  useCapexTotals,
  useConsolidatedTotals
} from './hooks/useBudgetCalculations';

// Composants
import { LoginPage } from './components/auth/LoginPage';
import { ChangePasswordButton } from './components/auth/ChangePasswordButton';
import { SettingsPanel } from './components/settings/SettingsPanel';
import { TabNavigation } from './components/dashboard/TabNavigation';
import { BudgetCard } from './components/dashboard/BudgetCard';
import { ConsolidatedBudget } from './components/dashboard/ConsolidatedBudget';
import { BudgetCharts } from './components/dashboard/BudgetCharts';
import { OpexTable } from './components/opex/OpexTable';
import { OpexModal } from './components/opex/OpexModal';
import { CapexTable } from './components/capex/CapexTable';
import { CapexModal } from './components/capex/CapexModal';
import { OrderTable } from './components/orders/OrderTable';
import { OrderModal } from './components/orders/OrderModal';
import { AlertBanner } from './components/common/AlertBanner';

const HospitalITFinanceDashboard = () => {
  const { user, logout, loading: authLoading } = useAuth();
  const permissions = usePermissions();
  const { settings, setIsSettingsOpen } = useSettings();
  const { handleTitleClick } = useSettingsShortcut();

  // États pour les onglets
  const [activeTab, setActiveTab] = useState('overview');

  // États pour les modales OPEX
  const [showOpexModal, setShowOpexModal] = useState(false);
  const [editingOpex, setEditingOpex] = useState(null);

  // États pour les modales CAPEX
  const [showCapexModal, setShowCapexModal] = useState(false);
  const [editingCapex, setEditingCapex] = useState(null);

  // États pour les modales Commandes
  const [showOpexOrderModal, setShowOpexOrderModal] = useState(false);
  const [editingOpexOrder, setEditingOpexOrder] = useState(null);
  const [showCapexOrderModal, setShowCapexOrderModal] = useState(false);
  const [editingCapexOrder, setEditingCapexOrder] = useState(null);

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
    calculateEnveloppeTotal,
    getUsedEnveloppes,
    setError: setCapexError
  } = useCapexData();

  // Hooks de données Commandes
  const {
    orders: opexOrders,
    loading: opexOrdersLoading,
    error: opexOrdersError,
    addOrder: addOpexOrder,
    updateOrder: updateOpexOrder,
    deleteOrder: deleteOpexOrder,
    setError: setOpexOrdersError
  } = useOrderData('opex');

  const {
    orders: capexOrders,
    loading: capexOrdersLoading,
    error: capexOrdersError,
    addOrder: addCapexOrder,
    updateOrder: updateCapexOrder,
    deleteOrder: deleteCapexOrder,
    setError: setCapexOrdersError
  } = useOrderData('capex');

  // Calculs mémorisés avec impact des commandes
  const opexTotals = useOpexTotals(suppliers, opexOrders);
  const capexTotals = useCapexTotals(projects, capexOrders);
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
    async (data) => {
      const result = editingOpex
        ? await updateSupplier(editingOpex.id, data)
        : await addSupplier(data);

      if (result.success) {
        setShowOpexModal(false);
        setEditingOpex(null);
      }
    },
    [editingOpex, addSupplier, updateSupplier]
  );

  const handleDeleteOpex = useCallback(
    (id) => { deleteSupplier(id); },
    [deleteSupplier]
  );

  const handleImportOpex = useCallback(
    (supplierData) => {
      addSupplier(supplierData);
    },
    [addSupplier]
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
    async (data) => {
      const result = editingCapex
        ? await updateProject(editingCapex.id, data)
        : await addProject(data);

      if (result.success) {
        setShowCapexModal(false);
        setEditingCapex(null);
      }
    },
    [editingCapex, addProject, updateProject]
  );

  const handleDeleteCapex = useCallback(
    (id) => { deleteProject(id); },
    [deleteProject]
  );

  const handleImportCapex = useCallback(
    (projectData) => {
      addProject(projectData);
    },
    [addProject]
  );

  // Handlers Commandes OPEX
  const handleAddOpexOrder = useCallback(() => {
    setEditingOpexOrder(null);
    setShowOpexOrderModal(true);
  }, []);

  const handleEditOpexOrder = useCallback((order) => {
    setEditingOpexOrder(order);
    setShowOpexOrderModal(true);
  }, []);

  const handleSaveOpexOrder = useCallback(
    async (data) => {
      const result = editingOpexOrder
        ? await updateOpexOrder(editingOpexOrder.id, data)
        : await addOpexOrder(data);

      if (result.success) {
        setShowOpexOrderModal(false);
        setEditingOpexOrder(null);
      }
    },
    [editingOpexOrder, addOpexOrder, updateOpexOrder]
  );

  const handleDeleteOpexOrder = useCallback(
    (id) => { deleteOpexOrder(id); },
    [deleteOpexOrder]
  );

  // Handlers Commandes CAPEX
  const handleAddCapexOrder = useCallback(() => {
    setEditingCapexOrder(null);
    setShowCapexOrderModal(true);
  }, []);

  const handleEditCapexOrder = useCallback((order) => {
    setEditingCapexOrder(order);
    setShowCapexOrderModal(true);
  }, []);

  const handleSaveCapexOrder = useCallback(
    async (data) => {
      const result = editingCapexOrder
        ? await updateCapexOrder(editingCapexOrder.id, data)
        : await addCapexOrder(data);

      if (result.success) {
        setShowCapexOrderModal(false);
        setEditingCapexOrder(null);
      }
    },
    [editingCapexOrder, addCapexOrder, updateCapexOrder]
  );

  const handleDeleteCapexOrder = useCallback(
    (id) => { deleteCapexOrder(id); },
    [deleteCapexOrder]
  );

  // Chargement auth
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Initialisation...</p>
        </div>
      </div>
    );
  }

  // Page de login si non connecté
  if (!user) {
    return <LoginPage />;
  }

  // Chargement des données
  if (opexLoading || capexLoading || opexOrdersLoading || capexOrdersLoading) {
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
    <div className="min-h-screen bg-gray-50 p-3 sm:p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* En-tête */}
        <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 mb-4 sm:mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div>
              <h1
                className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 mb-2 cursor-default select-none"
                onClick={handleTitleClick}
              >
                {settings.appName}
              </h1>
              <p className="text-sm sm:text-base text-gray-600">
                Suivi budgétaire OPEX & CAPEX - Année {new Date().getFullYear()}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500 hidden sm:inline">
                {user.username}
              </span>

              {/* Bouton changement de mot de passe (tous les utilisateurs) */}
              <ChangePasswordButton />

              {/* Bouton Settings (admin et superadmin uniquement) */}
              {permissions.canAccessSettings && (
                <button
                  onClick={() => setIsSettingsOpen(true)}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors touch-manipulation"
                  title="Paramétrage (Ctrl+Shift+P)"
                >
                  <Settings size={18} />
                </button>
              )}

              <button
                onClick={logout}
                className="flex items-center gap-1.5 px-3 py-2 text-sm text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors touch-manipulation"
                title="Déconnexion"
              >
                <LogOut size={16} />
                <span className="hidden sm:inline">Déconnexion</span>
              </button>
            </div>
          </div>
        </div>

        {/* Alertes d'erreur */}
        {opexError && (
          <AlertBanner type="error" message={opexError} className="mb-4" />
        )}
        {capexError && (
          <AlertBanner type="error" message={capexError} className="mb-4" />
        )}
        {opexOrdersError && (
          <AlertBanner type="error" message={opexOrdersError} className="mb-4" />
        )}
        {capexOrdersError && (
          <AlertBanner type="error" message={capexOrdersError} className="mb-4" />
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
                warningThreshold={settings.rules.warningThreshold}
                criticalThreshold={settings.rules.criticalThreshold}
              />
              <BudgetCard
                title="CAPEX - Investissements"
                icon={Server}
                totals={capexTotals}
                iconColor="text-green-500"
                warningThreshold={settings.rules.warningThreshold}
                criticalThreshold={settings.rules.criticalThreshold}
              />
            </div>
            <ConsolidatedBudget consolidatedTotals={consolidatedTotals} />
            <BudgetCharts
              opexTotals={opexTotals}
              capexTotals={capexTotals}
              suppliers={suppliers}
              projects={projects}
              opexOrders={opexOrders}
              capexOrders={capexOrders}
            />
          </div>
        )}

        {/* Onglet OPEX */}
        {activeTab === 'opex' && (
          <OpexTable
            suppliers={suppliers}
            totals={opexTotals}
            orders={opexOrders}
            onEdit={handleEditOpex}
            onDelete={handleDeleteOpex}
            onAdd={handleAddOpex}
            onImport={handleImportOpex}
            columnVisibility={settings.opexColumns}
          />
        )}

        {/* Onglet CAPEX */}
        {activeTab === 'capex' && (
          <CapexTable
            projects={projects}
            totals={capexTotals}
            orders={capexOrders}
            onEdit={handleEditCapex}
            onDelete={handleDeleteCapex}
            onAdd={handleAddCapex}
            onImport={handleImportCapex}
            calculateEnveloppeTotal={calculateEnveloppeTotal}
            getUsedEnveloppes={getUsedEnveloppes}
            columnVisibility={settings.capexColumns}
          />
        )}

        {/* Onglet Commandes OPEX */}
        {activeTab === 'ordersOpex' && (
          <OrderTable
            orders={opexOrders}
            parentItems={suppliers}
            parentLabel="Fournisseur"
            parentNameKey="supplier"
            type="opex"
            onEdit={handleEditOpexOrder}
            onDelete={handleDeleteOpexOrder}
            onAdd={handleAddOpexOrder}
          />
        )}

        {/* Onglet Commandes CAPEX */}
        {activeTab === 'ordersCapex' && (
          <OrderTable
            orders={capexOrders}
            parentItems={projects}
            parentLabel="Projet"
            parentNameKey="project"
            type="capex"
            onEdit={handleEditCapexOrder}
            onDelete={handleDeleteCapexOrder}
            onAdd={handleAddCapexOrder}
          />
        )}

        {/* Modales OPEX */}
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

        {/* Modales CAPEX */}
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

        {/* Modale Commandes OPEX */}
        <OrderModal
          isOpen={showOpexOrderModal}
          onClose={() => {
            setShowOpexOrderModal(false);
            setEditingOpexOrder(null);
            setOpexOrdersError(null);
          }}
          onSave={handleSaveOpexOrder}
          editingOrder={editingOpexOrder}
          parentItems={suppliers}
          parentLabel="Fournisseur"
          parentNameKey="supplier"
        />

        {/* Modale Commandes CAPEX */}
        <OrderModal
          isOpen={showCapexOrderModal}
          onClose={() => {
            setShowCapexOrderModal(false);
            setEditingCapexOrder(null);
            setCapexOrdersError(null);
          }}
          onSave={handleSaveCapexOrder}
          editingOrder={editingCapexOrder}
          parentItems={projects}
          parentLabel="Projet"
          parentNameKey="project"
        />

        {/* Panneau de paramétrage */}
        <SettingsPanel />
      </div>
    </div>
  );
};

export default HospitalITFinanceDashboard;
