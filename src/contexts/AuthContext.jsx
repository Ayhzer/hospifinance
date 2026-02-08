/**
 * Contexte d'authentification
 */

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { hashPassword, verifyPassword } from '../utils/authUtils';
import { saveAuthUsers, loadAuthUsers, saveAuthSession, loadAuthSession, clearAuthSession } from '../services/storageService';

const AuthContext = createContext(null);

const DEFAULT_ADMIN_USERNAME = 'admin';
const DEFAULT_ADMIN_PASSWORD = 'admin';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Initialisation : créer admin par défaut si aucun utilisateur n'existe
  useEffect(() => {
    const init = async () => {
      let storedUsers = loadAuthUsers();

      if (!storedUsers || storedUsers.length === 0) {
        const adminHash = await hashPassword(DEFAULT_ADMIN_PASSWORD);
        storedUsers = [{
          id: 1,
          username: DEFAULT_ADMIN_USERNAME,
          passwordHash: adminHash,
          role: 'admin',
          createdAt: new Date().toISOString()
        }];
        saveAuthUsers(storedUsers);
      }

      setUsers(storedUsers);

      // Restaurer la session
      const session = loadAuthSession();
      if (session) {
        const sessionUser = storedUsers.find(u => u.id === session.userId);
        if (sessionUser) {
          setUser({ id: sessionUser.id, username: sessionUser.username, role: sessionUser.role });
        }
      }

      setLoading(false);
    };

    init();
  }, []);

  const login = useCallback(async (username, password) => {
    const foundUser = users.find(u => u.username === username);
    if (!foundUser) {
      return { success: false, error: 'Identifiants incorrects' };
    }

    const valid = await verifyPassword(password, foundUser.passwordHash);
    if (!valid) {
      return { success: false, error: 'Identifiants incorrects' };
    }

    const sessionUser = { id: foundUser.id, username: foundUser.username, role: foundUser.role };
    setUser(sessionUser);
    saveAuthSession({ userId: foundUser.id });
    return { success: true };
  }, [users]);

  const logout = useCallback(() => {
    setUser(null);
    clearAuthSession();
  }, []);

  const addUser = useCallback(async (username, password, role = 'user') => {
    if (users.find(u => u.username === username)) {
      return { success: false, error: 'Ce nom d\'utilisateur existe déjà' };
    }

    const passwordHash = await hashPassword(password);
    const newUser = {
      id: Date.now(),
      username,
      passwordHash,
      role,
      createdAt: new Date().toISOString()
    };

    const updatedUsers = [...users, newUser];
    setUsers(updatedUsers);
    saveAuthUsers(updatedUsers);
    return { success: true };
  }, [users]);

  const deleteUser = useCallback((userId) => {
    // Ne pas supprimer le dernier admin
    const admins = users.filter(u => u.role === 'admin');
    const userToDelete = users.find(u => u.id === userId);
    if (userToDelete?.role === 'admin' && admins.length <= 1) {
      return { success: false, error: 'Impossible de supprimer le dernier administrateur' };
    }

    const updatedUsers = users.filter(u => u.id !== userId);
    setUsers(updatedUsers);
    saveAuthUsers(updatedUsers);
    return { success: true };
  }, [users]);

  const changePassword = useCallback(async (userId, newPassword) => {
    const passwordHash = await hashPassword(newPassword);
    const updatedUsers = users.map(u =>
      u.id === userId ? { ...u, passwordHash } : u
    );
    setUsers(updatedUsers);
    saveAuthUsers(updatedUsers);
    return { success: true };
  }, [users]);

  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider value={{
      user,
      users,
      loading,
      login,
      logout,
      addUser,
      deleteUser,
      changePassword,
      isAdmin
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
