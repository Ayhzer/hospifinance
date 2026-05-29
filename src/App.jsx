/**
 * Composant principal de l'application Hospifinance
 * Tableau de bord financier DSI - Version 3.2
 */

import { useState, useCallback, useRef, useEffect } from 'react';
import { DollarSign, Server, LogOut, Settings } from 'lucide-react';
import { useDashboardData } from './hooks/useDashboardData';
import { DashboardBuilder } from './components/dashboard-builder/DashboardBuilder';
import { CreateDashboardModal } from './components/dashboard-builder/CreateDashboardModal';

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
import VueAnalytiqueIT from './components/analytique/VueAnalytiqueIT';
import AnomaliesPanel from './components/analytique/AnomaliesPanel';
import ProjectionAnnuelle from './components/analytique/ProjectionAnnuelle';
import VueComptes from './components/analytique/VueComptes';
import EprdBudgetEditor from './components/analytique/EprdBudgetEditor';
import ReclassementPage from './components/reclassement/ReclassementPage';
import { EPRD_STATIC } from './constants/analytiqueConstants';
import { useReclassementData } from './hooks/useReclassementData';

const HospitalITFinanceDashboard = () => {
  const { user, logout, loading: authLoading } = useAuth();
  const permissions = usePermissions();
  const { settings, setIsSettingsOpen, addDashboard, addOpexSupplier, addOpexCategory } = useSettings();
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

  // Refs pour éviter les closures stale dans les handlers async
  // Synchronisés immédiatement dans les handlers add/edit (pas via useEffect)
  const editingOpexRef = useRef(null);
  const editingCapexRef = useRef(null);
  const editingOpexOrderRef = useRef(null);
  const editingCapexOrderRef = useRef(null);

  // Hooks de données OPEX
  const {
    suppliers,
    loading: opexLoading,
    error: opexError,
    addSupplier,
    updateSupplier,
    deleteSupplier,
    clearAll: clearAllOpex,
    replaceAllSuppliers,
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
    clearAll: clearAllCapex,
    replaceAllProjects,
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
    clearAll: clearAllOpexOrders,
    replaceAllOrders: replaceAllOpexOrders,
    setError: setOpexOrdersError
  } = useOrderData('opex');

  const {
    orders: capexOrders,
    loading: capexOrdersLoading,
    error: capexOrdersError,
    addOrder: addCapexOrder,
    updateOrder: updateCapexOrder,
    deleteOrder: deleteCapexOrder,
    clearAll: clearAllCapexOrders,
    replaceAllOrders: replaceAllCapexOrders,
    setError: setCapexOrdersError
  } = useOrderData('capex');

  // Calculs mémorisés avec impact des commandes
  const opexTotals = useOpexTotals(suppliers, opexOrders);
  const capexTotals = useCapexTotals(projects, capexOrders);
  const consolidatedTotals = useConsolidatedTotals(opexTotals, capexTotals);

  // Moteur de reclassement analytique
  const {
    moteur,
    loading: reclassementLoading,
    error: reclassementError,
    addFournisseur,
    updateFournisseur,
    deleteFournisseur,
    addRegleMultiNature,
    updateRegleMultiNature,
    deleteRegleMultiNature,
    reorderReglesMultiNature,
    addRegleMosCles,
    updateRegleMosCles,
    deleteRegleMosCles,
    reorderReglesMosCles,
    updateMappingCompte,
  } = useReclassementData();

  // Données EPRD — initialisées avec les données statiques, enrichies par l'API si disponible
  const [eprdData, setEprdData] = useState(EPRD_STATIC);
  useEffect(() => {
    const apiUrl = import.meta.env.VITE_API_URL;
    if (apiUrl) {
      fetch(`${apiUrl}/eprd`)
        .then(r => r.ok ? r.json() : null)
        .then(data => { if (Array.isArray(data) && data.length > 0) setEprdData(data); })
        .catch(() => {});
    } else {
      try {
        const stored = localStorage.getItem('hospifinance_eprd');
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length > 0) setEprdData(parsed);
        }
      } catch {}
    }
  }, []);

  // Handler reclassement bulk — met à jour familleAnalytique sur l'objet complet (pas de patch partiel)
  const handleApplyReclassement = useCallback(async (enrichedSuppliers) => {
    for (const s of enrichedSuppliers) {
      await updateSupplier(s.id, { ...s });
    }
  }, [updateSupplier]);

  // Handler import SAGE XLSX (reçu depuis ImportModal via OpexTable)
  // MODE REPLACE : remplace toutes les données existantes (pas d'accumulation)
  const handleSageImport = useCallback(async (parsed) => {
    const { opexSuppliers = [], opexOrders = [], capexProjects = [], capexOrders = [] } = parsed;

    // OPEX : remplacement complet (suppliers + orders)
    await replaceAllSuppliers(opexSuppliers);
    opexSuppliers.forEach(s => {
      if (s.supplier) addOpexSupplier(s.supplier);
      if (s.category) addOpexCategory(s.category);
    });
    replaceAllOpexOrders(opexOrders);

    // CAPEX : remplacement complet
    if (capexProjects.length > 0) {
      await replaceAllProjects(capexProjects);
      replaceAllCapexOrders(capexOrders);
    }
  }, [replaceAllSuppliers, replaceAllOpexOrders, replaceAllProjects, replaceAllCapexOrders, addOpexSupplier, addOpexCategory]);

  // Dashboard builder data
  const dashboardData = useDashboardData({
    suppliers, projects, opexOrders, capexOrders,
    opexTotals, capexTotals, consolidatedTotals
  });

  // État pour la modale de création de dashboard
  const [showCreateDashboard, setShowCreateDashboard] = useState(false);

  // État pour l'éditeur EPRD
  const [showEprdEditor, setShowEprdEditor] = useState(false);

  const handleCreateDashboard = useCallback((name) => {
    const id = `dash_${Date.now()}`;
    addDashboard({ id, name, widgets: [] });
    setActiveTab(`custom_${id}`);
  }, [addDashboard]);

  // Handlers OPEX
  const handleAddOpex = useCallback(() => {
    editingOpexRef.current = null;
    setEditingOpex(null);
    setShowOpexModal(true);
  }, []);

  const handleEditOpex = useCallback((supplier) => {
    editingOpexRef.current = supplier;
    setEditingOpex(supplier);
    setShowOpexModal(true);
  }, []);

  const handleSaveOpex = useCallback(
    async (data) => {
      const current = editingOpexRef.current;
      const result = current
        ? await updateSupplier(current.id, data)
        : await addSupplier(data);

      if (result.success) {
        setShowOpexModal(false);
        setEditingOpex(null);
      } else {
        setOpexError(result.errors ? result.errors.join(', ') : 'Erreur lors de la sauvegarde');
      }
    },
    [addSupplier, updateSupplier, setOpexError]
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
    editingCapexRef.current = null;
    setEditingCapex(null);
    setShowCapexModal(true);
  }, []);

  const handleEditCapex = useCallback((project) => {
    editingCapexRef.current = project;
    setEditingCapex(project);
    setShowCapexModal(true);
  }, []);

  const handleSaveCapex = useCallback(
    async (data) => {
      const current = editingCapexRef.current;
      const result = current
        ? await updateProject(current.id, data)
        : await addProject(data);

      if (result.success) {
        setShowCapexModal(false);
        setEditingCapex(null);
      } else {
        setCapexError(result.errors ? result.errors.join(', ') : 'Erreur lors de la sauvegarde');
      }
    },
    [addProject, updateProject, setCapexError]
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
    editingOpexOrderRef.current = null;
    setEditingOpexOrder(null);
    setShowOpexOrderModal(true);
  }, []);

  const handleEditOpexOrder = useCallback((order) => {
    editingOpexOrderRef.current = order;
    setEditingOpexOrder(order);
    setShowOpexOrderModal(true);
  }, []);

  const handleSaveOpexOrder = useCallback(
    async (data) => {
      const current = editingOpexOrderRef.current;
      const result = current
        ? await updateOpexOrder(current.id, data)
        : await addOpexOrder(data);

      if (result.success) {
        setShowOpexOrderModal(false);
        setEditingOpexOrder(null);
      } else {
        setOpexOrdersError(result.errors ? result.errors.join(', ') : 'Erreur lors de la sauvegarde');
      }
    },
    [addOpexOrder, updateOpexOrder, setOpexOrdersError]
  );

  const handleDeleteOpexOrder = useCallback(
    (id) => { deleteOpexOrder(id); },
    [deleteOpexOrder]
  );

  // Handlers Commandes CAPEX
  const handleAddCapexOrder = useCallback(() => {
    editingCapexOrderRef.current = null;
    setEditingCapexOrder(null);
    setShowCapexOrderModal(true);
  }, []);

  const handleEditCapexOrder = useCallback((order) => {
    editingCapexOrderRef.current = order;
    setEditingCapexOrder(order);
    setShowCapexOrderModal(true);
  }, []);

  const handleSaveCapexOrder = useCallback(
    async (data) => {
      const current = editingCapexOrderRef.current;
      const result = current
        ? await updateCapexOrder(current.id, data)
        : await addCapexOrder(data);

      if (result.success) {
        setShowCapexOrderModal(false);
        setEditingCapexOrder(null);
      } else {
        setCapexOrdersError(result.errors ? result.errors.join(', ') : 'Erreur lors de la sauvegarde');
      }
    },
    [addCapexOrder, updateCapexOrder, setCapexOrdersError]
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
        <TabNavigation
          activeTab={activeTab}
          onTabChange={setActiveTab}
          onCreateDashboard={() => setShowCreateDashboard(true)}
        />

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
            onSageImport={handleSageImport}
            moteur={moteur}
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

        {/* Onglet Vue analytique */}
        {activeTab === 'analytique' && (
          <div className="space-y-4">
            <div className="flex justify-end">
              <button
                onClick={() => setShowEprdEditor(true)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium flex items-center gap-2"
              >
                Gérer les budgets EPRD
              </button>
            </div>
            <VueAnalytiqueIT suppliers={suppliers} eprd={eprdData} />
          </div>
        )}

        {/* Onglet Anomalies */}
        {activeTab === 'anomalies' && (
          <AnomaliesPanel suppliers={suppliers} orders={opexOrders} eprd={eprdData} />
        )}

        {/* Onglet Projection */}
        {activeTab === 'projection' && (
          <ProjectionAnnuelle suppliers={suppliers} orders={opexOrders} eprd={eprdData} nbMoisRealises={5} />
        )}

        {/* Onglet Vue par comptes */}
        {activeTab === 'comptes' && (
          <VueComptes suppliers={suppliers} eprd={eprdData} />
        )}

        {/* Onglet Reclassement analytique */}
        {activeTab === 'reclassement' && (
          <ReclassementPage
            moteur={moteur}
            loading={reclassementLoading}
            error={reclassementError}
            suppliers={suppliers}
            onAddFournisseur={addFournisseur}
            onUpdateFournisseur={updateFournisseur}
            onDeleteFournisseur={deleteFournisseur}
            onAddRegleMultiNature={addRegleMultiNature}
            onUpdateRegleMultiNature={updateRegleMultiNature}
            onDeleteRegleMultiNature={deleteRegleMultiNature}
            onReorderReglesMultiNature={reorderReglesMultiNature}
            onAddRegleMosCles={addRegleMosCles}
            onUpdateRegleMosCles={updateRegleMosCles}
            onDeleteRegleMosCles={deleteRegleMosCles}
            onReorderReglesMosCles={reorderReglesMosCles}
            onUpdateMappingCompte={updateMappingCompte}
            onApplyReclassement={handleApplyReclassement}
          />
        )}

        {/* Dashboards custom */}
        {activeTab.startsWith('custom_') && (
          <DashboardBuilder
            dashboardId={activeTab.replace('custom_', '')}
            dashboardData={dashboardData}
            onDeleteDashboard={() => setActiveTab('overview')}
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

        {/* Éditeur EPRD */}
        {showEprdEditor && (
          <EprdBudgetEditor
            eprd={eprdData}
            onUpdated={(compte, budget) => {
              setEprdData(prev => prev.map(e => e.compteOrdonnateur === compte ? { ...e, budgetEPRD: budget } : e));
            }}
            onClose={() => setShowEprdEditor(false)}
          />
        )}

        {/* Modale création de dashboard */}
        <CreateDashboardModal
          isOpen={showCreateDashboard}
          onClose={() => setShowCreateDashboard(false)}
          onSave={handleCreateDashboard}
        />

        {/* Panneau de paramétrage */}
        <SettingsPanel
          onClearOpex={() => { clearAllOpex(); clearAllOpexOrders(); }}
          onClearCapex={() => { clearAllCapex(); clearAllCapexOrders(); }}
          onRenameEnveloppe={(oldName, newName) => {
            projects.forEach(p => {
              if (p.enveloppe === oldName) updateProject(p.id, { ...p, enveloppe: newName });
            });
          }}
          onRenameOpexSupplier={(oldName, newName) => {
            suppliers.forEach(s => {
              if (s.supplier === oldName) updateSupplier(s.id, { ...s, supplier: newName });
            });
          }}
          onRenameOpexCategory={(oldName, newName) => {
            suppliers.forEach(s => {
              if (s.category === oldName) updateSupplier(s.id, { ...s, category: newName });
            });
          }}
        />
      </div>
    </div>
  );
};

export default HospitalITFinanceDashboard;
