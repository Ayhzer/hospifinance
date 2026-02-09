/**
 * Panneau de paramétrage caché - Accessible via Ctrl+Shift+P
 */

import React, { useState } from 'react';
import { Settings, Palette, Columns, Shield, Users, RotateCcw, Save, FileText, Trash2 } from 'lucide-react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { useSettings } from '../../contexts/SettingsContext';
import { useAuth } from '../../contexts/AuthContext';

const SETTINGS_TABS = [
  { id: 'appearance', label: 'Apparence', icon: Palette },
  { id: 'columns', label: 'Colonnes', icon: Columns },
  { id: 'rules', label: 'Règles', icon: Shield },
  { id: 'users', label: 'Utilisateurs', icon: Users },
  { id: 'logs', label: 'Logs', icon: FileText }
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

const ROLE_LABELS = {
  superadmin: 'Superadministrateur',
  admin: 'Administrateur',
  user: 'Utilisateur'
};

const ROLE_BADGES = {
  superadmin: 'bg-purple-100 text-purple-800',
  admin: 'bg-blue-100 text-blue-800',
  user: 'bg-gray-100 text-gray-700'
};

const LOG_TYPE_LABELS = {
  login_success: { label: 'Connexion', color: 'text-green-600', bg: 'bg-green-50' },
  login_failed: { label: 'Échec connexion', color: 'text-red-600', bg: 'bg-red-50' },
  logout: { label: 'Déconnexion', color: 'text-gray-600', bg: 'bg-gray-50' },
  account_disabled: { label: 'Compte désactivé', color: 'text-orange-600', bg: 'bg-orange-50' },
  account_enabled: { label: 'Compte réactivé', color: 'text-blue-600', bg: 'bg-blue-50' }
};

export const SettingsPanel = () => {
  const { settings, isSettingsOpen, setIsSettingsOpen, updateColors, updateSettings, toggleOpexColumn, toggleCapexColumn, updateRules, resetSettings } = useSettings();
  const { users, addUser, deleteUser, toggleUserDisabled, changePassword, isAdmin, isSuperAdmin, authLogs, clearLogs } = useAuth();
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

  const handleDeleteUser = (userId) => {
    const result = deleteUser(userId);
    if (!result.success) {
      setUserError(result.error);
      setTimeout(() => setUserError(''), 3000);
    }
  };

  const handleToggleDisabled = (userId) => {
    const result = toggleUserDisabled(userId);
    if (!result.success) {
      setUserError(result.error);
      setTimeout(() => setUserError(''), 3000);
    }
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
            {userError && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-lg text-sm">
                {userError}
              </div>
            )}

            {isAdmin && (
              <div className="bg-blue-50 rounded-lg p-4">
                <h3 className="text-sm font-semibold text-gray-700 mb-3">Ajouter un utilisateur</h3>
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
              {users.map(u => {
                const isSuperAdminUser = u.username === 'admin';
                const canManage = isAdmin && !isSuperAdminUser || isSuperAdmin;
                const canDelete = isSuperAdmin && !isSuperAdminUser;

                return (
                  <div
                    key={u.id}
                    className={`flex items-center justify-between rounded-lg p-3 ${
                      u.disabled ? 'bg-red-50 border border-red-200' : 'bg-gray-50'
                    }`}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className={`text-sm font-medium ${u.disabled ? 'text-gray-400 line-through' : 'text-gray-800'}`}>
                          {u.username}
                        </p>
                        <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${ROLE_BADGES[u.role] || ROLE_BADGES.user}`}>
                          {ROLE_LABELS[u.role] || 'Utilisateur'}
                        </span>
                        {u.disabled && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded-full font-medium bg-red-100 text-red-700">
                            Désactivé
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-500">
                        {u.createdAt && `Créé le ${new Date(u.createdAt).toLocaleDateString('fr-FR')}`}
                      </p>
                    </div>
                    {isAdmin && (
                      <div className="flex gap-1 flex-shrink-0 ml-2">
                        {changePasswordId === u.id ? (
                          <div className="flex gap-1">
                            <input
                              type="password"
                              placeholder="Nouveau MDP"
                              value={changePasswordValue}
                              onChange={(e) => setChangePasswordValue(e.target.value)}
                              className="px-2 py-1 border border-gray-300 rounded text-sm w-28"
                            />
                            <Button variant="success" size="sm" onClick={() => handleChangePassword(u.id)}>OK</Button>
                            <Button variant="secondary" size="sm" onClick={() => { setChangePasswordId(null); setChangePasswordValue(''); }}>X</Button>
                          </div>
                        ) : (
                          <>
                            <Button variant="secondary" size="sm" onClick={() => setChangePasswordId(u.id)}>
                              MDP
                            </Button>
                            {/* Bouton activer/désactiver - pas sur le superadmin */}
                            {!isSuperAdminUser && (
                              <Button
                                variant={u.disabled ? 'success' : 'warning'}
                                size="sm"
                                onClick={() => handleToggleDisabled(u.id)}
                              >
                                {u.disabled ? 'Activer' : 'Désact.'}
                              </Button>
                            )}
                            {/* Bouton supprimer - seulement superadmin, jamais sur lui-même */}
                            {canDelete && (
                              <Button
                                variant="danger"
                                size="sm"
                                onClick={() => handleDeleteUser(u.id)}
                              >
                                Suppr.
                              </Button>
                            )}
                          </>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Logs de connexion */}
        {activeSettingsTab === 'logs' && (
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-semibold text-gray-700">
                Journal des connexions
                <span className="text-xs font-normal text-gray-500 ml-1">
                  ({authLogs.length} entrée{authLogs.length > 1 ? 's' : ''})
                </span>
              </h3>
              {isAdmin && authLogs.length > 0 && (
                <Button variant="secondary" size="sm" icon={<Trash2 size={16} />} onClick={clearLogs}>
                  Purger
                </Button>
              )}
            </div>

            {authLogs.length === 0 ? (
              <p className="text-sm text-gray-500 italic text-center py-8">Aucun log de connexion</p>
            ) : (
              <div className="max-h-[350px] overflow-y-auto space-y-1">
                {authLogs.map(log => {
                  const typeInfo = LOG_TYPE_LABELS[log.type] || { label: log.type, color: 'text-gray-600', bg: 'bg-gray-50' };
                  return (
                    <div key={log.id} className={`flex items-start gap-3 rounded-lg p-2.5 ${typeInfo.bg}`}>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className={`text-xs font-semibold ${typeInfo.color}`}>
                            {typeInfo.label}
                          </span>
                          <span className="text-xs font-medium text-gray-800">
                            {log.username}
                          </span>
                        </div>
                        {log.detail && (
                          <p className="text-xs text-gray-500 mt-0.5">{log.detail}</p>
                        )}
                      </div>
                      <span className="text-[10px] text-gray-400 whitespace-nowrap flex-shrink-0">
                        {new Date(log.timestamp).toLocaleDateString('fr-FR')}{' '}
                        {new Date(log.timestamp).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-200">
        <Button variant="secondary" icon={<RotateCcw size={16} />} size="sm" onClick={resetSettings}>
          Réinitialiser
        </Button>
        <Button variant="primary" icon={<Save size={16} />} size="sm" onClick={() => setIsSettingsOpen(false)}>
          Fermer
        </Button>
      </div>
    </Modal>
  );
};
