import React, { useState, useEffect } from 'react';
import { Download, Plus, Trash2, Edit2, Save, X, AlertTriangle, TrendingUp, DollarSign, Users, Server } from 'lucide-react';

const HospitalITFinanceDashboard = () => {
  // États pour les données OPEX
  const [opexSuppliers, setOpexSuppliers] = useState([
    { id: 1, supplier: 'Oracle Health', category: 'Logiciels', budgetAnnuel: 500000, depenseActuelle: 375000, engagement: 50000, notes: 'Contrat de maintenance annuel' },
    { id: 2, supplier: 'Microsoft', category: 'Licences', budgetAnnuel: 300000, depenseActuelle: 280000, engagement: 15000, notes: 'Azure + Microsoft 365' },
    { id: 3, supplier: 'Dell Technologies', category: 'Support matériel', budgetAnnuel: 150000, depenseActuelle: 95000, engagement: 20000, notes: 'Contrat support serveurs' }
  ]);

  // États pour les données CAPEX
  const [capexProjects, setCapexProjects] = useState([
    { id: 1, project: 'Renouvellement Datacenter', budgetTotal: 2000000, depense: 1200000, engagement: 300000, dateDebut: '2024-01-01', dateFin: '2024-12-31', status: 'En cours', notes: 'Phase 2 en cours' },
    { id: 2, project: 'Déploiement VDI', budgetTotal: 800000, depense: 650000, engagement: 100000, dateDebut: '2024-03-01', dateFin: '2024-11-30', status: 'En cours', notes: '85% des postes déployés' },
    { id: 3, project: 'Cybersécurité - SIEM', budgetTotal: 500000, depense: 500000, engagement: 0, dateDebut: '2023-09-01', dateFin: '2024-02-28', status: 'Terminé', notes: 'Projet finalisé' }
  ]);

  // États pour les modales et formulaires
  const [showOpexModal, setShowOpexModal] = useState(false);
  const [showCapexModal, setShowCapexModal] = useState(false);
  const [editingOpex, setEditingOpex] = useState(null);
  const [editingCapex, setEditingCapex] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

  // Formulaire OPEX
  const [opexForm, setOpexForm] = useState({
    supplier: '',
    category: '',
    budgetAnnuel: '',
    depenseActuelle: '',
    engagement: '',
    notes: ''
  });

  // Formulaire CAPEX
  const [capexForm, setCapexForm] = useState({
    project: '',
    budgetTotal: '',
    depense: '',
    engagement: '',
    dateDebut: '',
    dateFin: '',
    status: 'Planifié',
    notes: ''
  });

  // Calculs pour le résumé OPEX
  const opexTotals = {
    budget: opexSuppliers.reduce((sum, s) => sum + s.budgetAnnuel, 0),
    depense: opexSuppliers.reduce((sum, s) => sum + s.depenseActuelle, 0),
    engagement: opexSuppliers.reduce((sum, s) => sum + s.engagement, 0)
  };
  opexTotals.disponible = opexTotals.budget - opexTotals.depense - opexTotals.engagement;
  opexTotals.tauxUtilisation = (((opexTotals.depense + opexTotals.engagement) / opexTotals.budget) * 100).toFixed(1);

  // Calculs pour le résumé CAPEX
  const capexTotals = {
    budget: capexProjects.reduce((sum, p) => sum + p.budgetTotal, 0),
    depense: capexProjects.reduce((sum, p) => sum + p.depense, 0),
    engagement: capexProjects.reduce((sum, p) => sum + p.engagement, 0)
  };
  capexTotals.disponible = capexTotals.budget - capexTotals.depense - capexTotals.engagement;
  capexTotals.tauxUtilisation = (((capexTotals.depense + capexTotals.engagement) / capexTotals.budget) * 100).toFixed(1);

  // Fonctions OPEX
  const handleAddOpex = () => {
    setEditingOpex(null);
    setOpexForm({ supplier: '', category: '', budgetAnnuel: '', depenseActuelle: '', engagement: '', notes: '' });
    setShowOpexModal(true);
  };

  const handleEditOpex = (supplier) => {
    setEditingOpex(supplier);
    setOpexForm(supplier);
    setShowOpexModal(true);
  };

  const handleSaveOpex = () => {
    if (!opexForm.supplier || !opexForm.category || !opexForm.budgetAnnuel) {
      alert('Veuillez remplir les champs obligatoires');
      return;
    }

    const opexData = {
      ...opexForm,
      budgetAnnuel: parseFloat(opexForm.budgetAnnuel) || 0,
      depenseActuelle: parseFloat(opexForm.depenseActuelle) || 0,
      engagement: parseFloat(opexForm.engagement) || 0
    };

    if (editingOpex) {
      setOpexSuppliers(opexSuppliers.map(s => s.id === editingOpex.id ? { ...opexData, id: editingOpex.id } : s));
    } else {
      setOpexSuppliers([...opexSuppliers, { ...opexData, id: Date.now() }]);
    }
    setShowOpexModal(false);
  };

  const handleDeleteOpex = (id) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce fournisseur ?')) {
      setOpexSuppliers(opexSuppliers.filter(s => s.id !== id));
    }
  };

  // Fonctions CAPEX
  const handleAddCapex = () => {
    setEditingCapex(null);
    setCapexForm({ project: '', budgetTotal: '', depense: '', engagement: '', dateDebut: '', dateFin: '', status: 'Planifié', notes: '' });
    setShowCapexModal(true);
  };

  const handleEditCapex = (project) => {
    setEditingCapex(project);
    setCapexForm(project);
    setShowCapexModal(true);
  };

  const handleSaveCapex = () => {
    if (!capexForm.project || !capexForm.budgetTotal) {
      alert('Veuillez remplir les champs obligatoires');
      return;
    }

    const capexData = {
      ...capexForm,
      budgetTotal: parseFloat(capexForm.budgetTotal) || 0,
      depense: parseFloat(capexForm.depense) || 0,
      engagement: parseFloat(capexForm.engagement) || 0
    };

    if (editingCapex) {
      setCapexProjects(capexProjects.map(p => p.id === editingCapex.id ? { ...capexData, id: editingCapex.id } : p));
    } else {
      setCapexProjects([...capexProjects, { ...capexData, id: Date.now() }]);
    }
    setShowCapexModal(false);
  };

  const handleDeleteCapex = (id) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce projet ?')) {
      setCapexProjects(capexProjects.filter(p => p.id !== id));
    }
  };

  // Fonctions d'export
  const exportToCSV = (data, filename) => {
    if (data.length === 0) return;
    
    const headers = Object.keys(data[0]).filter(key => key !== 'id');
    const csvContent = [
      headers.join(','),
      ...data.map(row => headers.map(header => {
        const value = row[header];
        return typeof value === 'string' && value.includes(',') ? `"${value}"` : value;
      }).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${filename}_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  const exportToJSON = (data, filename) => {
    const jsonContent = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonContent], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${filename}_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(value);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Planifié': return 'bg-gray-100 text-gray-800';
      case 'En cours': return 'bg-blue-100 text-blue-800';
      case 'Terminé': return 'bg-green-100 text-green-800';
      case 'Suspendu': return 'bg-yellow-100 text-yellow-800';
      case 'Annulé': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* En-tête */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Tableau de Bord Financier DSI</h1>
          <p className="text-gray-600">Suivi budgétaire OPEX & CAPEX - Année {new Date().getFullYear()}</p>
        </div>

        {/* Navigation par onglets */}
        <div className="bg-white rounded-lg shadow-md mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              {[
                { id: 'overview', label: 'Vue d\'ensemble', icon: TrendingUp },
                { id: 'opex', label: 'OPEX', icon: DollarSign },
                { id: 'capex', label: 'CAPEX', icon: Server }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-4 font-medium text-sm border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <tab.icon size={18} />
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Contenu selon l'onglet actif */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Cartes de résumé */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Résumé OPEX */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-gray-800">OPEX - Dépenses d'exploitation</h2>
                  <DollarSign className="text-blue-500" size={24} />
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Budget annuel</span>
                    <span className="font-semibold text-lg">{formatCurrency(opexTotals.budget)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Dépensé</span>
                    <span className="font-semibold text-lg text-orange-600">{formatCurrency(opexTotals.depense)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Engagé</span>
                    <span className="font-semibold text-lg text-yellow-600">{formatCurrency(opexTotals.engagement)}</span>
                  </div>
                  <div className="border-t pt-3 flex justify-between items-center">
                    <span className="text-gray-600 font-medium">Disponible</span>
                    <span className={`font-bold text-xl ${opexTotals.disponible < 0 ? 'text-red-600' : 'text-green-600'}`}>
                      {formatCurrency(opexTotals.disponible)}
                    </span>
                  </div>
                  <div className="mt-4">
                    <div className="flex justify-between text-sm mb-1">
                      <span>Taux d'utilisation</span>
                      <span className="font-semibold">{opexTotals.tauxUtilisation}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className={`h-3 rounded-full transition-all ${
                          parseFloat(opexTotals.tauxUtilisation) > 90 ? 'bg-red-500' :
                          parseFloat(opexTotals.tauxUtilisation) > 75 ? 'bg-yellow-500' : 'bg-green-500'
                        }`}
                        style={{ width: `${Math.min(opexTotals.tauxUtilisation, 100)}%` }}
                      />
                    </div>
                  </div>
                  {parseFloat(opexTotals.tauxUtilisation) > 90 && (
                    <div className="flex items-center gap-2 mt-3 p-3 bg-red-50 rounded-lg">
                      <AlertTriangle size={18} className="text-red-600" />
                      <span className="text-sm text-red-800">Alerte: Budget OPEX presque épuisé</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Résumé CAPEX */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-gray-800">CAPEX - Investissements</h2>
                  <Server className="text-green-500" size={24} />
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Budget total</span>
                    <span className="font-semibold text-lg">{formatCurrency(capexTotals.budget)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Dépensé</span>
                    <span className="font-semibold text-lg text-orange-600">{formatCurrency(capexTotals.depense)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Engagé</span>
                    <span className="font-semibold text-lg text-yellow-600">{formatCurrency(capexTotals.engagement)}</span>
                  </div>
                  <div className="border-t pt-3 flex justify-between items-center">
                    <span className="text-gray-600 font-medium">Disponible</span>
                    <span className={`font-bold text-xl ${capexTotals.disponible < 0 ? 'text-red-600' : 'text-green-600'}`}>
                      {formatCurrency(capexTotals.disponible)}
                    </span>
                  </div>
                  <div className="mt-4">
                    <div className="flex justify-between text-sm mb-1">
                      <span>Taux d'utilisation</span>
                      <span className="font-semibold">{capexTotals.tauxUtilisation}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className={`h-3 rounded-full transition-all ${
                          parseFloat(capexTotals.tauxUtilisation) > 90 ? 'bg-red-500' :
                          parseFloat(capexTotals.tauxUtilisation) > 75 ? 'bg-yellow-500' : 'bg-green-500'
                        }`}
                        style={{ width: `${Math.min(capexTotals.tauxUtilisation, 100)}%` }}
                      />
                    </div>
                  </div>
                  {parseFloat(capexTotals.tauxUtilisation) > 90 && (
                    <div className="flex items-center gap-2 mt-3 p-3 bg-red-50 rounded-lg">
                      <AlertTriangle size={18} className="text-red-600" />
                      <span className="text-sm text-red-800">Alerte: Budget CAPEX presque épuisé</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Vue consolidée */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Budget Consolidé DSI</h2>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Budget Total</p>
                  <p className="text-2xl font-bold text-blue-700">{formatCurrency(opexTotals.budget + capexTotals.budget)}</p>
                </div>
                <div className="p-4 bg-orange-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Total Dépensé</p>
                  <p className="text-2xl font-bold text-orange-700">{formatCurrency(opexTotals.depense + capexTotals.depense)}</p>
                </div>
                <div className="p-4 bg-yellow-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Total Engagé</p>
                  <p className="text-2xl font-bold text-yellow-700">{formatCurrency(opexTotals.engagement + capexTotals.engagement)}</p>
                </div>
                <div className="p-4 bg-green-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Total Disponible</p>
                  <p className="text-2xl font-bold text-green-700">{formatCurrency(opexTotals.disponible + capexTotals.disponible)}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'opex' && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Gestion OPEX - Fournisseurs</h2>
              <div className="flex gap-3">
                <button
                  onClick={() => exportToCSV(opexSuppliers, 'opex_fournisseurs')}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
                >
                  <Download size={18} />
                  CSV
                </button>
                <button
                  onClick={() => exportToJSON(opexSuppliers, 'opex_fournisseurs')}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
                >
                  <Download size={18} />
                  JSON
                </button>
                <button
                  onClick={handleAddOpex}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                  <Plus size={18} />
                  Nouveau fournisseur
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b">
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Fournisseur</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Catégorie</th>
                    <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Budget annuel</th>
                    <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Dépensé</th>
                    <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Engagé</th>
                    <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Disponible</th>
                    <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">Utilisation</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Notes</th>
                    <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {opexSuppliers.map(supplier => {
                    const disponible = supplier.budgetAnnuel - supplier.depenseActuelle - supplier.engagement;
                    const utilisation = ((supplier.depenseActuelle + supplier.engagement) / supplier.budgetAnnuel * 100).toFixed(1);
                    
                    return (
                      <tr key={supplier.id} className="border-b hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm font-medium text-gray-900">{supplier.supplier}</td>
                        <td className="px-4 py-3 text-sm text-gray-700">{supplier.category}</td>
                        <td className="px-4 py-3 text-sm text-right text-gray-900">{formatCurrency(supplier.budgetAnnuel)}</td>
                        <td className="px-4 py-3 text-sm text-right text-orange-600">{formatCurrency(supplier.depenseActuelle)}</td>
                        <td className="px-4 py-3 text-sm text-right text-yellow-600">{formatCurrency(supplier.engagement)}</td>
                        <td className={`px-4 py-3 text-sm text-right font-semibold ${disponible < 0 ? 'text-red-600' : 'text-green-600'}`}>
                          {formatCurrency(disponible)}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex flex-col items-center">
                            <span className="text-sm font-semibold mb-1">{utilisation}%</span>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className={`h-2 rounded-full ${
                                  parseFloat(utilisation) > 90 ? 'bg-red-500' :
                                  parseFloat(utilisation) > 75 ? 'bg-yellow-500' : 'bg-green-500'
                                }`}
                                style={{ width: `${Math.min(utilisation, 100)}%` }}
                              />
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">{supplier.notes}</td>
                        <td className="px-4 py-3">
                          <div className="flex gap-2 justify-center">
                            <button
                              onClick={() => handleEditOpex(supplier)}
                              className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                              title="Modifier"
                            >
                              <Edit2 size={16} />
                            </button>
                            <button
                              onClick={() => handleDeleteOpex(supplier.id)}
                              className="p-1 text-red-600 hover:bg-red-50 rounded"
                              title="Supprimer"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot className="bg-gray-100 font-semibold">
                  <tr>
                    <td colSpan="2" className="px-4 py-3 text-sm text-gray-900">TOTAL</td>
                    <td className="px-4 py-3 text-sm text-right text-gray-900">{formatCurrency(opexTotals.budget)}</td>
                    <td className="px-4 py-3 text-sm text-right text-orange-600">{formatCurrency(opexTotals.depense)}</td>
                    <td className="px-4 py-3 text-sm text-right text-yellow-600">{formatCurrency(opexTotals.engagement)}</td>
                    <td className={`px-4 py-3 text-sm text-right ${opexTotals.disponible < 0 ? 'text-red-600' : 'text-green-600'}`}>
                      {formatCurrency(opexTotals.disponible)}
                    </td>
                    <td className="px-4 py-3 text-sm text-center">{opexTotals.tauxUtilisation}%</td>
                    <td colSpan="2"></td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'capex' && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Gestion CAPEX - Projets</h2>
              <div className="flex gap-3">
                <button
                  onClick={() => exportToCSV(capexProjects, 'capex_projets')}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
                >
                  <Download size={18} />
                  CSV
                </button>
                <button
                  onClick={() => exportToJSON(capexProjects, 'capex_projets')}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
                >
                  <Download size={18} />
                  JSON
                </button>
                <button
                  onClick={handleAddCapex}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                >
                  <Plus size={18} />
                  Nouveau projet
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b">
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Projet</th>
                    <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">Statut</th>
                    <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Budget total</th>
                    <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Dépensé</th>
                    <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Engagé</th>
                    <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Disponible</th>
                    <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">Utilisation</th>
                    <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">Période</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Notes</th>
                    <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {capexProjects.map(project => {
                    const disponible = project.budgetTotal - project.depense - project.engagement;
                    const utilisation = ((project.depense + project.engagement) / project.budgetTotal * 100).toFixed(1);
                    
                    return (
                      <tr key={project.id} className="border-b hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm font-medium text-gray-900">{project.project}</td>
                        <td className="px-4 py-3">
                          <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(project.status)}`}>
                            {project.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-right text-gray-900">{formatCurrency(project.budgetTotal)}</td>
                        <td className="px-4 py-3 text-sm text-right text-orange-600">{formatCurrency(project.depense)}</td>
                        <td className="px-4 py-3 text-sm text-right text-yellow-600">{formatCurrency(project.engagement)}</td>
                        <td className={`px-4 py-3 text-sm text-right font-semibold ${disponible < 0 ? 'text-red-600' : 'text-green-600'}`}>
                          {formatCurrency(disponible)}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex flex-col items-center">
                            <span className="text-sm font-semibold mb-1">{utilisation}%</span>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className={`h-2 rounded-full ${
                                  parseFloat(utilisation) > 90 ? 'bg-red-500' :
                                  parseFloat(utilisation) > 75 ? 'bg-yellow-500' : 'bg-green-500'
                                }`}
                                style={{ width: `${Math.min(utilisation, 100)}%` }}
                              />
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm text-center text-gray-700">
                          {project.dateDebut && project.dateFin && (
                            <div className="text-xs">
                              <div>{new Date(project.dateDebut).toLocaleDateString('fr-FR')}</div>
                              <div className="text-gray-500">→</div>
                              <div>{new Date(project.dateFin).toLocaleDateString('fr-FR')}</div>
                            </div>
                          )}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">{project.notes}</td>
                        <td className="px-4 py-3">
                          <div className="flex gap-2 justify-center">
                            <button
                              onClick={() => handleEditCapex(project)}
                              className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                              title="Modifier"
                            >
                              <Edit2 size={16} />
                            </button>
                            <button
                              onClick={() => handleDeleteCapex(project.id)}
                              className="p-1 text-red-600 hover:bg-red-50 rounded"
                              title="Supprimer"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot className="bg-gray-100 font-semibold">
                  <tr>
                    <td colSpan="2" className="px-4 py-3 text-sm text-gray-900">TOTAL</td>
                    <td className="px-4 py-3 text-sm text-right text-gray-900">{formatCurrency(capexTotals.budget)}</td>
                    <td className="px-4 py-3 text-sm text-right text-orange-600">{formatCurrency(capexTotals.depense)}</td>
                    <td className="px-4 py-3 text-sm text-right text-yellow-600">{formatCurrency(capexTotals.engagement)}</td>
                    <td className={`px-4 py-3 text-sm text-right ${capexTotals.disponible < 0 ? 'text-red-600' : 'text-green-600'}`}>
                      {formatCurrency(capexTotals.disponible)}
                    </td>
                    <td className="px-4 py-3 text-sm text-center">{capexTotals.tauxUtilisation}%</td>
                    <td colSpan="3"></td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        )}

        {/* Modal OPEX */}
        {showOpexModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-2xl font-bold text-gray-800">
                    {editingOpex ? 'Modifier le fournisseur' : 'Nouveau fournisseur OPEX'}
                  </h3>
                  <button
                    onClick={() => setShowOpexModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X size={24} />
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Fournisseur <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={opexForm.supplier}
                        onChange={(e) => setOpexForm({ ...opexForm, supplier: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Ex: Oracle Health"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Catégorie <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={opexForm.category}
                        onChange={(e) => setOpexForm({ ...opexForm, category: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Ex: Logiciels"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Budget annuel (€) <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        value={opexForm.budgetAnnuel}
                        onChange={(e) => setOpexForm({ ...opexForm, budgetAnnuel: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="500000"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Dépense actuelle (€)
                      </label>
                      <input
                        type="number"
                        value={opexForm.depenseActuelle}
                        onChange={(e) => setOpexForm({ ...opexForm, depenseActuelle: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="0"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Engagement (€)
                      </label>
                      <input
                        type="number"
                        value={opexForm.engagement}
                        onChange={(e) => setOpexForm({ ...opexForm, engagement: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="0"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Notes
                    </label>
                    <textarea
                      value={opexForm.notes}
                      onChange={(e) => setOpexForm({ ...opexForm, notes: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      rows="3"
                      placeholder="Informations complémentaires..."
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3 mt-6">
                  <button
                    onClick={() => setShowOpexModal(false)}
                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Annuler
                  </button>
                  <button
                    onClick={handleSaveOpex}
                    className="flex items-center gap-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                  >
                    <Save size={18} />
                    Enregistrer
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Modal CAPEX */}
        {showCapexModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-2xl font-bold text-gray-800">
                    {editingCapex ? 'Modifier le projet' : 'Nouveau projet CAPEX'}
                  </h3>
                  <button
                    onClick={() => setShowCapexModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X size={24} />
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nom du projet <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={capexForm.project}
                      onChange={(e) => setCapexForm({ ...capexForm, project: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="Ex: Renouvellement Datacenter"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Statut
                      </label>
                      <select
                        value={capexForm.status}
                        onChange={(e) => setCapexForm({ ...capexForm, status: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      >
                        <option value="Planifié">Planifié</option>
                        <option value="En cours">En cours</option>
                        <option value="Terminé">Terminé</option>
                        <option value="Suspendu">Suspendu</option>
                        <option value="Annulé">Annulé</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Budget total (€) <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        value={capexForm.budgetTotal}
                        onChange={(e) => setCapexForm({ ...capexForm, budgetTotal: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="2000000"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Dépense (€)
                      </label>
                      <input
                        type="number"
                        value={capexForm.depense}
                        onChange={(e) => setCapexForm({ ...capexForm, depense: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="0"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Engagement (€)
                      </label>
                      <input
                        type="number"
                        value={capexForm.engagement}
                        onChange={(e) => setCapexForm({ ...capexForm, engagement: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="0"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Date de début
                      </label>
                      <input
                        type="date"
                        value={capexForm.dateDebut}
                        onChange={(e) => setCapexForm({ ...capexForm, dateDebut: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Date de fin
                      </label>
                      <input
                        type="date"
                        value={capexForm.dateFin}
                        onChange={(e) => setCapexForm({ ...capexForm, dateFin: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Notes
                    </label>
                    <textarea
                      value={capexForm.notes}
                      onChange={(e) => setCapexForm({ ...capexForm, notes: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      rows="3"
                      placeholder="Informations complémentaires..."
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3 mt-6">
                  <button
                    onClick={() => setShowCapexModal(false)}
                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Annuler
                  </button>
                  <button
                    onClick={handleSaveCapex}
                    className="flex items-center gap-2 px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                  >
                    <Save size={18} />
                    Enregistrer
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HospitalITFinanceDashboard;
