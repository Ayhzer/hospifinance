/**
 * Panneau de paramétrage caché - Accessible via Ctrl+Shift+P
 */

import React, { useState } from 'react';
import { Settings, Palette, Columns, Shield, Users, RotateCcw, Save } from 'lucide-react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { useSettings } from '../../contexts/SettingsContext';
import { useAuth } from '../../contexts/AuthContext';

const SETTINGS_TABS = [
  { id: 'appearance', label: 'Apparence', icon: Palette },
  { id: 'columns', label: 'Colonnes', icon: Columns },
  { id: 'rules', label: 'Règles', icon: Shield },
  { id: 'users', label: 'Utilisateurs', icon: Users }
];

const COLOR_LABELS = {
  primary: 'Couleur principale',
  success: 'Succès / Disponible',
  warning: 'Avertissement',
  danger: 'Danger / Critique',
  info: 'Information',
  accent: 'Accent'
};

const OPEX_COLUMN_LABELS = {
  supplier: 'Fournisseur',
  category: 'Catégorie',
  budgetAnnuel: 'Budget annuel',
  depenseActuelle: 'Dépensé',
  engagement: 'Engagé',
  disponible: 'Disponible',
  utilisation: 'Utilisation',
  notes: 'Notes',
  actions: 'Actions'
};

const CAPEX_COLUMN_LABELS = {
  project: 'Projet',
  budgetTotal: 'Budget total',
  depense: 'Dépensé',
  engagement: 'Engagé',
  disponible: 'Disponible',
  utilisation: 'Utilisation',
  status: 'Statut',
  period: 'Période',
  notes: 'Notes',
  actions: 'Actions'
};

export const SettingsPanel = () => {
  const { settings, isSettingsOpen, setIsSettingsOpen, updateColors, updateSettings, toggleOpexColumn, toggleCapexColumn, updateRules, resetSettings } = useSettings();
  const { users, addUser, deleteUser, changePassword, isAdmin } = useAuth();
  const [activeSettingsTab, setActiveSettingsTab] = useState('appearance');
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newRole, setNewRole] = useState('user');
  const [userError, setUserError] = useState('');
  const [changePasswordId, setChangePasswordId] = useState(null);
  const [changePasswordValue, setChangePasswordValue] = useState('');

  const handleAddUser = async () => {
    if (!newUsername || !newPassword) {
      setUserError('Identifiant et mot de passe requis');
      return;
    }
    const result = await addUser(newUsername, newPassword, newRole);
    if (result.success) {
      setNewUsername('');
      setNewPassword('');
      setNewRole('user');
      setUserError('');
    } else {
      setUserError(result.error);
    }
  };

  const handleChangePassword = async (userId) => {
    if (!changePasswordValue) return;
    await changePassword(userId, changePasswordValue);
    setChangePasswordId(null);
    setChangePasswordValue('');
  };

  return (
    <Modal
      isOpen={isSettingsOpen}
      onClose={() => setIsSettingsOpen(false)}
      title={
        <div className="flex items-center gap-2">
          <Settings size={20} />
          <span>Paramétrage</span>
        </div>
      }
      size="lg"
    >
      {/* Onglets internes */}
      <div className="flex border-b border-gray-200 mb-4 -mx-1 overflow-x-auto">
        {SETTINGS_TABS.map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSettingsTab(tab.id)}
              className={`flex items-center gap-1.5 px-3 py-2 text-sm font-medium border-b-2 transition-colors whitespace-nowrap mx-1 ${
                activeSettingsTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <Icon size={16} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Contenu des onglets */}
      <div className="min-h-[300px]">
        {/* Apparence */}
        {activeSettingsTab === 'appearance' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nom de l'application</label>
              <input
                type="text"
                value={settings.appName}
                onChange={(e) => updateSettings({ appName: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-base focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Couleurs</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {Object.entries(COLOR_LABELS).map(([key, label]) => (
                  <div key={key} className="flex items-center gap-3">
                    <input
                      type="color"
                      value={settings.colors[key]}
                      onChange={(e) => updateColors(key, e.target.value)}
                      className="w-10 h-10 rounded cursor-pointer border border-gray-300"
                    />
                    <div>
                      <p className="text-sm font-medium text-gray-700">{label}</p>
                      <p className="text-xs text-gray-400">{settings.colors[key]}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Colonnes */}
        {activeSettingsTab === 'columns' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Colonnes OPEX</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {Object.entries(OPEX_COLUMN_LABELS).map(([key, label]) => (
                  <label key={key} className="flex items-center gap-2 text-sm cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.opexColumns[key]}
                      onChange={() => toggleOpexColumn(key)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    {label}
                  </label>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Colonnes CAPEX</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {Object.entries(CAPEX_COLUMN_LABELS).map(([key, label]) => (
                  <label key={key} className="flex items-center gap-2 text-sm cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.capexColumns[key]}
                      onChange={() => toggleCapexColumn(key)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    {label}
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Règles de gestion */}
        {activeSettingsTab === 'rules' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Seuil d'avertissement (%)
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min="50"
                  max="95"
                  value={settings.rules.warningThreshold}
                  onChange={(e) => updateRules('warningThreshold', parseInt(e.target.value))}
                  className="flex-1"
                />
                <span className="text-sm font-semibold text-yellow-600 w-12 text-right">
                  {settings.rules.warningThreshold}%
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Les budgets au-dessus de ce seuil afficheront un avertissement jaune
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Seuil critique (%)
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min="60"
                  max="100"
                  value={settings.rules.criticalThreshold}
                  onChange={(e) => updateRules('criticalThreshold', parseInt(e.target.value))}
                  className="flex-1"
                />
                <span className="text-sm font-semibold text-red-600 w-12 text-right">
                  {settings.rules.criticalThreshold}%
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Les budgets au-dessus de ce seuil afficheront une alerte rouge
              </p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 mt-4">
              <h4 className="text-sm font-semibold text-gray-700 mb-2">Prévisualisation</h4>
              <div className="flex gap-2">
                <div className="flex-1 h-4 bg-green-500 rounded-l" style={{ width: `${settings.rules.warningThreshold}%` }}></div>
                <div className="flex-1 h-4 bg-yellow-500" style={{ width: `${settings.rules.criticalThreshold - settings.rules.warningThreshold}%` }}></div>
                <div className="flex-1 h-4 bg-red-500 rounded-r" style={{ width: `${100 - settings.rules.criticalThreshold}%` }}></div>
              </div>
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>0%</span>
                <span>{settings.rules.warningThreshold}%</span>
                <span>{settings.rules.criticalThreshold}%</span>
                <span>100%</span>
              </div>
            </div>
          </div>
        )}

        {/* Gestion des utilisateurs */}
        {activeSettingsTab === 'users' && (
          <div className="space-y-4">
            {isAdmin && (
              <div className="bg-blue-50 rounded-lg p-4">
                <h3 className="text-sm font-semibold text-gray-700 mb-3">Ajouter un utilisateur</h3>
                {userError && (
                  <p className="text-sm text-red-600 mb-2">{userError}</p>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
                  <input
                    type="text"
                    placeholder="Identifiant"
                    value={newUsername}
                    onChange={(e) => setNewUsername(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  />
                  <input
                    type="password"
                    placeholder="Mot de passe"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  />
                  <select
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  >
                    <option value="user">Utilisateur</option>
                    <option value="admin">Administrateur</option>
                  </select>
                  <Button variant="primary" size="sm" onClick={handleAddUser}>
                    Ajouter
                  </Button>
                </div>
              </div>
            )}

            <div className="space-y-2">
              {users.map(u => (
                <div key={u.id} className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
                  <div>
                    <p className="text-sm font-medium text-gray-800">{u.username}</p>
                    <p className="text-xs text-gray-500">
                      {u.role === 'admin' ? 'Administrateur' : 'Utilisateur'}
                      {u.createdAt && ` - Créé le ${new Date(u.createdAt).toLocaleDateString('fr-FR')}`}
                    </p>
                  </div>
                  {isAdmin && (
                    <div className="flex gap-2">
                      {changePasswordId === u.id ? (
                        <div className="flex gap-1">
                          <input
                            type="password"
                            placeholder="Nouveau MDP"
                            value={changePasswordValue}
                            onChange={(e) => setChangePasswordValue(e.target.value)}
                            className="px-2 py-1 border border-gray-300 rounded text-sm w-32"
                          />
                          <Button variant="success" size="sm" onClick={() => handleChangePassword(u.id)}>OK</Button>
                          <Button variant="secondary" size="sm" onClick={() => { setChangePasswordId(null); setChangePasswordValue(''); }}>X</Button>
                        </div>
                      ) : (
                        <>
                          <Button variant="secondary" size="sm" onClick={() => setChangePasswordId(u.id)}>MDP</Button>
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => deleteUser(u.id)}
                            disabled={u.role === 'admin' && users.filter(x => x.role === 'admin').length <= 1}
                          >
                            Suppr.
                          </Button>
                        </>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-200">
        <Button variant="secondary" icon={RotateCcw} size="sm" onClick={resetSettings}>
          Réinitialiser
        </Button>
        <Button variant="primary" icon={Save} size="sm" onClick={() => setIsSettingsOpen(false)}>
          Fermer
        </Button>
      </div>
    </Modal>
  );
};
