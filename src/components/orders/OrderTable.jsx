/**
 * Composant OrderTable - Tableau des commandes (réutilisable OPEX/CAPEX)
 */

import React, { useState, useCallback } from 'react';
import { Edit2, Trash2, Download, Plus } from 'lucide-react';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { exportToCSV, exportToJSON } from '../../utils/exportUtils';
import { Button } from '../common/Button';
import { ConfirmDialog } from '../common/ConfirmDialog';
import { ORDER_STATUS_COLORS } from '../../constants/orderConstants';

export const OrderTable = ({ orders, parentItems, parentLabel, parentNameKey, type, onEdit, onDelete, onAdd }) => {
  const [deleteConfirm, setDeleteConfirm] = useState({ isOpen: false, order: null });

  const handleDeleteClick = useCallback((order) => {
    setDeleteConfirm({ isOpen: true, order });
  }, []);

  const handleDeleteConfirm = useCallback(() => {
    if (deleteConfirm.order) {
      onDelete(deleteConfirm.order.id);
    }
    setDeleteConfirm({ isOpen: false, order: null });
  }, [deleteConfirm, onDelete]);

  const getParentName = (parentId) => {
    const parent = parentItems.find(p => p.id === parentId);
    return parent ? parent[parentNameKey] : 'Inconnu';
  };

  const exportData = orders.map(order => ({
    reference: order.reference,
    [parentLabel]: getParentName(order.parentId),
    description: order.description,
    montant: order.montant,
    statut: order.status,
    dateCommande: order.dateCommande,
    dateFacture: order.dateFacture,
    notes: order.notes
  }));

  return (
    <div className="bg-white rounded-lg shadow-md p-3 sm:p-4 md:p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 gap-3">
        <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800">
          Commandes {type === 'opex' ? 'OPEX' : 'CAPEX'}
        </h2>
        <div className="flex flex-wrap gap-2 sm:gap-3 w-full sm:w-auto">
          <Button variant="secondary" icon={Download} size="sm" onClick={() => exportToCSV(exportData, `commandes_${type}`)} className="flex-1 sm:flex-none">
            CSV
          </Button>
          <Button variant="secondary" icon={Download} size="sm" onClick={() => exportToJSON(exportData, `commandes_${type}`)} className="flex-1 sm:flex-none">
            JSON
          </Button>
          <Button variant="primary" icon={Plus} size="sm" onClick={onAdd} className="w-full sm:w-auto">
            <span className="hidden sm:inline">Nouvelle commande</span>
            <span className="sm:hidden">Nouveau</span>
          </Button>
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <p className="text-lg mb-2">Aucune commande</p>
          <p className="text-sm">Cliquez sur "Nouvelle commande" pour en ajouter une</p>
        </div>
      ) : (
        <div className="overflow-x-auto -mx-3 sm:mx-0">
          <div className="inline-block min-w-full align-middle">
            <div className="overflow-hidden">
              <table className="w-full min-w-[800px]">
                <thead>
                  <tr className="bg-gray-50 border-b">
                    <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-xs sm:text-sm font-semibold text-gray-700 whitespace-nowrap">Référence</th>
                    <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-xs sm:text-sm font-semibold text-gray-700 whitespace-nowrap">{parentLabel}</th>
                    <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-xs sm:text-sm font-semibold text-gray-700 whitespace-nowrap">Description</th>
                    <th className="px-2 sm:px-4 py-2 sm:py-3 text-right text-xs sm:text-sm font-semibold text-gray-700 whitespace-nowrap">Montant</th>
                    <th className="px-2 sm:px-4 py-2 sm:py-3 text-center text-xs sm:text-sm font-semibold text-gray-700 whitespace-nowrap">Statut</th>
                    <th className="px-2 sm:px-4 py-2 sm:py-3 text-center text-xs sm:text-sm font-semibold text-gray-700 whitespace-nowrap">Date cmd</th>
                    <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-xs sm:text-sm font-semibold text-gray-700 whitespace-nowrap">Notes</th>
                    <th className="px-2 sm:px-4 py-2 sm:py-3 text-center text-xs sm:text-sm font-semibold text-gray-700 whitespace-nowrap">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order.id} className="border-b hover:bg-gray-50">
                      <td className="px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm font-medium text-gray-900 whitespace-nowrap">
                        {order.reference || '-'}
                      </td>
                      <td className="px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-gray-700 whitespace-nowrap">
                        {getParentName(order.parentId)}
                      </td>
                      <td className="px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-gray-700 max-w-[150px] truncate">
                        {order.description}
                      </td>
                      <td className="px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-right text-gray-900 whitespace-nowrap font-medium">
                        {formatCurrency(order.montant)}
                      </td>
                      <td className="px-2 sm:px-4 py-2 sm:py-3 text-center">
                        <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${ORDER_STATUS_COLORS[order.status] || 'bg-gray-100 text-gray-800'}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-center text-gray-700 whitespace-nowrap">
                        {order.dateCommande || '-'}
                      </td>
                      <td className="px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-gray-600 max-w-[100px] truncate">
                        {order.notes || '-'}
                      </td>
                      <td className="px-2 sm:px-4 py-2 sm:py-3">
                        <div className="flex gap-1 sm:gap-2 justify-center">
                          <button
                            onClick={() => onEdit(order)}
                            className="p-1 text-blue-600 hover:bg-blue-50 rounded touch-manipulation"
                            title="Modifier"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button
                            onClick={() => handleDeleteClick(order)}
                            className="p-1 text-red-600 hover:bg-red-50 rounded touch-manipulation"
                            title="Supprimer"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-gray-100 font-semibold">
                  <tr>
                    <td colSpan="3" className="px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-gray-900">
                      TOTAL ({orders.length} commande{orders.length > 1 ? 's' : ''})
                    </td>
                    <td className="px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-right text-gray-900 whitespace-nowrap">
                      {formatCurrency(orders.reduce((sum, o) => sum + (o.montant || 0), 0))}
                    </td>
                    <td colSpan="4"></td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>
      )}

      <ConfirmDialog
        isOpen={deleteConfirm.isOpen}
        onClose={() => setDeleteConfirm({ isOpen: false, order: null })}
        onConfirm={handleDeleteConfirm}
        title="Supprimer la commande"
        message={`Êtes-vous sûr de vouloir supprimer la commande "${deleteConfirm.order?.description}" ? Cette action est irréversible.`}
        confirmText="Supprimer"
        variant="danger"
      />
    </div>
  );
};
