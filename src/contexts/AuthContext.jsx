/**
 * Contexte d'authentification
 * - Rôle superadmin réservé au compte "admin" (non supprimable, non désactivable)
 * - Possibilité de désactiver un utilisateur sans le supprimer
 * - Logs de connexion (succès, échec, déconnexion)
 */

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { hashPassword, verifyPassword } from '../utils/authUtils';
import {
  saveAuthUsers, loadAuthUsers,
  saveAuthSession, loadAuthSession, clearAuthSession,
  saveAuthLog, loadAuthLogs, clearAuthLogs
} from '../services/storageService';

const AuthContext = createContext(null);

const SUPERADMIN_USERNAME = 'admin';
const DEFAULT_ADMIN_PASSWORD = 'admin';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [authLogs, setAuthLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Helper pour ajouter un log
  const addLog = useCallback((type, username, detail = '') => {
    const entry = {
      id: Date.now(),
      type,
      username,
      detail,
      timestamp: new Date().toISOString()
    };
    saveAuthLog(entry);
    setAuthLogs(prev => [entry, ...prev].slice(0, 200));
  }, []);

  // Initialisation
  useEffect(() => {
    const init = async () => {
      let storedUsers = loadAuthUsers();

      if (!storedUsers || storedUsers.length === 0) {
        const adminHash = await hashPassword(DEFAULT_ADMIN_PASSWORD);
        storedUsers = [{
          id: 1,
          username: SUPERADMIN_USERNAME,
          passwordHash: adminHash,
          role: 'superadmin',
          disabled: false,
          createdAt: new Date().toISOString()
        }];
        saveAuthUsers(storedUsers);
      } else {
        // Migration : s'assurer que le compte "admin" a le rôle superadmin et les champs requis
        let needsSave = false;
        storedUsers = storedUsers.map(u => {
          const updates = {};
          if (u.username === SUPERADMIN_USERNAME && u.role !== 'superadmin') {
            updates.role = 'superadmin';
            updates.disabled = false;
            needsSave = true;
          }
          if (u.disabled === undefined) {
            updates.disabled = false;
            needsSave = true;
          }
          return Object.keys(updates).length > 0 ? { ...u, ...updates } : u;
        });
        if (needsSave) saveAuthUsers(storedUsers);
      }

      setUsers(storedUsers);
      setAuthLogs(loadAuthLogs());

      // Restaurer la session
      const session = loadAuthSession();
      if (session) {
        const sessionUser = storedUsers.find(u => u.id === session.userId);
        if (sessionUser && !sessionUser.disabled) {
          setUser({ id: sessionUser.id, username: sessionUser.username, role: sessionUser.role });
        } else {
          clearAuthSession();
        }
      }

      setLoading(false);
    };

    init();
  }, []);

  const login = useCallback(async (username, password) => {
    const foundUser = users.find(u => u.username === username);
    if (!foundUser) {
      addLog('login_failed', username, 'Utilisateur inconnu');
      return { success: false, error: 'Identifiants incorrects' };
    }

    if (foundUser.disabled) {
      addLog('login_failed', username, 'Compte désactivé');
      return { success: false, error: 'Ce compte a été désactivé. Contactez un administrateur.' };
    }

    const valid = await verifyPassword(password, foundUser.passwordHash);
    if (!valid) {
      addLog('login_failed', username, 'Mot de passe incorrect');
      return { success: false, error: 'Identifiants incorrects' };
    }

    const sessionUser = { id: foundUser.id, username: foundUser.username, role: foundUser.role };
    setUser(sessionUser);
    saveAuthSession({ userId: foundUser.id });
    addLog('login_success', username);
    return { success: true };
  }, [users, addLog]);

  const logout = useCallback(() => {
    if (user) {
      addLog('logout', user.username);
    }
    setUser(null);
    clearAuthSession();
  }, [user, addLog]);

  const addUser = useCallback(async (username, password, role = 'user') => {
    if (users.find(u => u.username === username)) {
      return { success: false, error: 'Ce nom d\'utilisateur existe déjà' };
    }

    if (username === SUPERADMIN_USERNAME) {
      return { success: false, error: 'Ce nom d\'utilisateur est réservé' };
    }

    if (role === 'admin' && user?.role !== 'superadmin') {
      return { success: false, error: 'Seul le superadministrateur peut créer des administrateurs' };
    }

    const passwordHash = await hashPassword(password);
    const newUser = {
      id: Date.now(),
      username,
      passwordHash,
      role,
      disabled: false,
      createdAt: new Date().toISOString()
    };

    const updatedUsers = [...users, newUser];
    setUsers(updatedUsers);
    saveAuthUsers(updatedUsers);
    return { success: true };
  }, [users, user]);

  const deleteUser = useCallback((userId) => {
    const userToDelete = users.find(u => u.id === userId);

    if (userToDelete?.username === SUPERADMIN_USERNAME) {
      return { success: false, error: 'Le compte superadministrateur ne peut pas être supprimé' };
    }

    if (userToDelete?.role === 'admin' && user?.role !== 'superadmin') {
      return { success: false, error: 'Seul le superadministrateur peut supprimer un administrateur' };
    }

    const updatedUsers = users.filter(u => u.id !== userId);
    setUsers(updatedUsers);
    saveAuthUsers(updatedUsers);
    return { success: true };
  }, [users, user]);

  const toggleUserDisabled = useCallback((userId) => {
    const targetUser = users.find(u => u.id === userId);

    if (targetUser?.username === SUPERADMIN_USERNAME) {
      return { success: false, error: 'Le compte superadministrateur ne peut pas être désactivé' };
    }

    if (user?.role !== 'admin' && user?.role !== 'superadmin') {
      return { success: false, error: 'Droits insuffisants' };
    }

    if (targetUser?.role === 'admin' && user?.role !== 'superadmin') {
      return { success: false, error: 'Seul le superadministrateur peut désactiver un administrateur' };
    }

    const newDisabled = !targetUser.disabled;
    const updatedUsers = users.map(u =>
      u.id === userId ? { ...u, disabled: newDisabled } : u
    );
    setUsers(updatedUsers);
    saveAuthUsers(updatedUsers);

    if (newDisabled) {
      addLog('account_disabled', targetUser.username, `Désactivé par ${user.username}`);
    } else {
      addLog('account_enabled', targetUser.username, `Réactivé par ${user.username}`);
    }

    return { success: true };
  }, [users, user, addLog]);

  const changePassword = useCallback(async (userId, newPassword) => {
    const passwordHash = await hashPassword(newPassword);
    const updatedUsers = users.map(u =>
      u.id === userId ? { ...u, passwordHash } : u
    );
    setUsers(updatedUsers);
    saveAuthUsers(updatedUsers);
    return { success: true };
  }, [users]);

  const clearLogs = useCallback(() => {
    clearAuthLogs();
    setAuthLogs([]);
  }, []);

  const isAdmin = user?.role === 'admin' || user?.role === 'superadmin';
  const isSuperAdmin = user?.role === 'superadmin';

  return (
    <AuthContext.Provider value={{
      user,
      users,
      authLogs,
      loading,
      login,
      logout,
      addUser,
      deleteUser,
      toggleUserDisabled,
      changePassword,
      clearLogs,
      isAdmin,
      isSuperAdmin
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth doit être utilisé dans un AuthProvider');
  }
  return context;
};
