/**
 * Contexte d'authentification avec API MongoDB
 * Version migrée pour utiliser l'API Render au lieu de localStorage
 */

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import * as api from '../services/apiService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [authLogs, setAuthLogs] = useState([]); // TODO: implémenter les logs côté serveur
  const [loading, setLoading] = useState(true);

  // Initialisation : vérifier si un token existe et récupérer l'utilisateur
  useEffect(() => {
    const init = async () => {
      try {
        const token = localStorage.getItem('authToken');
        if (token) {
          // Vérifier que le token est valide
          const response = await api.getCurrentUser();
          setUser(response.user);
        }
      } catch (error) {
        console.error('Erreur initialisation auth:', error);
        // Token invalide ou expiré, on le supprime
        api.setAuthToken(null);
      } finally {
        setLoading(false);
      }
    };

    init();
  }, []);

  // Charger la liste des utilisateurs (seulement pour les admins)
  const loadUsers = useCallback(async () => {
    try {
      const userList = await api.getUsers();
      setUsers(userList);
    } catch (error) {
      console.error('Erreur chargement utilisateurs:', error);
    }
  }, []);

  // Charger les utilisateurs quand un admin se connecte
  useEffect(() => {
    if (user && (user.role === 'admin' || user.role === 'superadmin')) {
      loadUsers();
    }
  }, [user, loadUsers]);

  /**
   * Connexion
   */
  const login = useCallback(async (username, password) => {
    try {
      const response = await api.login(username, password);
      setUser(response.user);
      return { success: true };
    } catch (error) {
      console.error('Erreur login:', error);
      return { success: false, error: error.message || 'Identifiants incorrects' };
    }
  }, []);

  /**
   * Déconnexion
   */
  const logout = useCallback(async () => {
    try {
      await api.logout();
    } catch (error) {
      console.error('Erreur logout:', error);
    } finally {
      setUser(null);
      setUsers([]);
    }
  }, []);

  /**
   * Ajouter un utilisateur
   */
  const addUser = useCallback(async (username, password, role = 'user') => {
    try {
      const newUser = await api.createUser({ username, password, role });
      setUsers(prev => [...prev, newUser]);
      return { success: true };
    } catch (error) {
      console.error('Erreur création utilisateur:', error);
      return { success: false, error: error.message || 'Erreur lors de la création de l\'utilisateur' };
    }
  }, []);

  /**
   * Supprimer un utilisateur
   */
  const deleteUser = useCallback(async (userId) => {
    try {
      await api.deleteUser(userId);
      setUsers(prev => prev.filter(u => u.id !== userId));
      return { success: true };
    } catch (error) {
      console.error('Erreur suppression utilisateur:', error);
      return { success: false, error: error.message || 'Erreur lors de la suppression de l\'utilisateur' };
    }
  }, []);

  /**
   * Activer/Désactiver un utilisateur
   * Note: Cette fonctionnalité nécessite d'être implémentée côté serveur
   */
  const toggleUserDisabled = useCallback(async (userId) => {
    // TODO: Implémenter côté serveur
    console.warn('toggleUserDisabled pas encore implémenté côté API');
    return { success: false, error: 'Fonctionnalité pas encore disponible avec l\'API' };
  }, []);

  /**
   * Changer le mot de passe
   */
  const changePassword = useCallback(async (userId, newPassword, currentPassword = null) => {
    try {
      await api.changePassword(userId, currentPassword, newPassword);
      return { success: true };
    } catch (error) {
      console.error('Erreur changement mot de passe:', error);
      return { success: false, error: error.message || 'Erreur lors du changement de mot de passe' };
    }
  }, []);

  /**
   * Effacer les logs
   * Note: Les logs seront gérés côté serveur dans une future version
   */
  const clearLogs = useCallback(() => {
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
