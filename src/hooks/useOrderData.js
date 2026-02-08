/**
 * Hook personnalisé pour la gestion des commandes (OPEX ou CAPEX)
 */

import { useState, useEffect, useCallback } from 'react';
import {
  saveOpexOrders, loadOpexOrders,
  saveCapexOrders, loadCapexOrders
} from '../services/storageService';
import { validateOrderData, parseNumber, sanitizeString } from '../utils/validators';
import { ORDER_STATUS } from '../constants/orderConstants';

const saveFunctions = {
  opex: saveOpexOrders,
  capex: saveCapexOrders
};

const loadFunctions = {
  opex: loadOpexOrders,
  capex: loadCapexOrders
};

export const useOrderData = (type = 'opex') => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const saveFn = saveFunctions[type];
  const loadFn = loadFunctions[type];

  // Chargement initial
  useEffect(() => {
    const storedData = loadFn();
    setOrders(storedData || []);
    setLoading(false);
  }, [loadFn]);

  // Sauvegarde automatique
  useEffect(() => {
    if (!loading) {
      saveFn(orders);
    }
  }, [orders, loading, saveFn]);

  const addOrder = useCallback((orderData) => {
    const validation = validateOrderData(orderData);
    if (!validation.isValid) {
      setError(validation.errors.join(', '));
      return { success: false, errors: validation.errors };
    }

    const newOrder = {
      id: Date.now() + Math.random(),
      parentId: orderData.parentId,
      description: sanitizeString(orderData.description),
      montant: parseNumber(orderData.montant, 0),
      status: orderData.status || ORDER_STATUS.PENDING,
      dateCommande: orderData.dateCommande || '',
      dateFacture: orderData.dateFacture || '',
      reference: sanitizeString(orderData.reference),
      notes: sanitizeString(orderData.notes)
    };

    setOrders(prev => [...prev, newOrder]);
    setError(null);
    return { success: true, data: newOrder };
  }, []);

  const updateOrder = useCallback((id, orderData) => {
    const validation = validateOrderData(orderData);
    if (!validation.isValid) {
      setError(validation.errors.join(', '));
      return { success: false, errors: validation.errors };
    }

    const updatedOrder = {
      id,
      parentId: orderData.parentId,
      description: sanitizeString(orderData.description),
      montant: parseNumber(orderData.montant, 0),
      status: orderData.status,
      dateCommande: orderData.dateCommande || '',
      dateFacture: orderData.dateFacture || '',
      reference: sanitizeString(orderData.reference),
      notes: sanitizeString(orderData.notes)
    };

    setOrders(prev => prev.map(o => o.id === id ? updatedOrder : o));
    setError(null);
    return { success: true, data: updatedOrder };
  }, []);

  const deleteOrder = useCallback((id) => {
    setOrders(prev => prev.filter(o => o.id !== id));
    setError(null);
    return { success: true };
  }, []);

  return {
    orders,
    loading,
    error,
    addOrder,
    updateOrder,
    deleteOrder,
    setError
  };
};
