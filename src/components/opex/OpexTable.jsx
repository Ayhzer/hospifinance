/**
 * Composant OpexTable - Tableau des fournisseurs OPEX
 */

import React, { useState, useCallback } from 'react';
import { Edit2, Trash2, Download, Plus } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';
import { calculateAvailable, calculateUsageRate } from '../../utils/calculations';
import { exportToCSV, exportToJSON } from '../../utils/exportUtils';
import { Button } from '../common/Button';
import { ProgressBar } from '../common/ProgressBar';
import { ConfirmDialog } from '../common/ConfirmDialog';

export const OpexTable = ({ suppliers, totals, onEdit, onDelete, onAdd }) => {
  const [deleteConfirm, setDeleteConfirm] = useState({ isOpen: false, supplier: null });

  const handleDeleteClick = useCallback((supplier) => {
    setDeleteConfirm({ isOpen: true, supplier });
  }, []);

  const handleDeleteConfirm = useCallback(() => {
    if (deleteConfirm.supplier) {
      onDelete(deleteConfirm.supplier.id);
    }
    setDeleteConfirm({ isOpen: false, supplier: null });
  }, [deleteConfirm, onDelete]);

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Gestion OPEX - Fournisseurs</h2>
        <div className="flex gap-3">
          <Button
            variant="secondary"
            icon={Download}
            onClick={() => exportToCSV(suppliers, 'opex_fournisseurs')}
          >
            CSV
          </Button>
          <Button
            variant="secondary"
            icon={Download}
            onClick={() => exportToJSON(suppliers, 'opex_fournisseurs')}
          >
            JSON
          </Button>
          <Button variant="primary" icon={Plus} onClick={onAdd}>
            Nouveau fournisseur
          </Button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b">
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                Fournisseur
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                Catégorie
              </th>
              <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">
                Budget annuel
              </th>
              <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">
                Dépensé
              </th>
              <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">
                Engagé
              </th>
              <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">
                Disponible
              </th>
              <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">
                Utilisation
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                Notes
              </th>
              <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {suppliers.map((supplier) => {
              const disponible = calculateAvailable(
                supplier.budgetAnnuel,
                supplier.depenseActuelle,
                supplier.engagement
              );
              const utilisation = calculateUsageRate(
                supplier.budgetAnnuel,
                supplier.depenseActuelle,
                supplier.engagement
              );

              return (
                <tr key={supplier.id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">
                    {supplier.supplier}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">{supplier.category}</td>
                  <td className="px-4 py-3 text-sm text-right text-gray-900">
                    {formatCurrency(supplier.budgetAnnuel)}
                  </td>
                  <td className="px-4 py-3 text-sm text-right text-orange-600">
                    {formatCurrency(supplier.depenseActuelle)}
                  </td>
                  <td className="px-4 py-3 text-sm text-right text-yellow-600">
                    {formatCurrency(supplier.engagement)}
                  </td>
                  <td
                    className={`px-4 py-3 text-sm text-right font-semibold ${
                      disponible < 0 ? 'text-red-600' : 'text-green-600'
                    }`}
                  >
                    {formatCurrency(disponible)}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-col items-center min-w-[100px]">
                      <span className="text-sm font-semibold mb-1">
                        {utilisation.toFixed(1)}%
                      </span>
                      <ProgressBar value={utilisation} showLabel={false} size="sm" />
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600 max-w-xs truncate">
                    {supplier.notes}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2 justify-center">
                      <button
                        onClick={() => onEdit(supplier)}
                        className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                        title="Modifier"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(supplier)}
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
              <td colSpan="2" className="px-4 py-3 text-sm text-gray-900">
                TOTAL
              </td>
              <td className="px-4 py-3 text-sm text-right text-gray-900">
                {formatCurrency(totals.budget)}
              </td>
              <td className="px-4 py-3 text-sm text-right text-orange-600">
                {formatCurrency(totals.depense)}
              </td>
              <td className="px-4 py-3 text-sm text-right text-yellow-600">
                {formatCurrency(totals.engagement)}
              </td>
              <td
                className={`px-4 py-3 text-sm text-right ${
                  totals.disponible < 0 ? 'text-red-600' : 'text-green-600'
                }`}
              >
                {formatCurrency(totals.disponible)}
              </td>
              <td className="px-4 py-3 text-sm text-center">
                {totals.tauxUtilisation.toFixed(1)}%
              </td>
              <td colSpan="2"></td>
            </tr>
          </tfoot>
        </table>
      </div>

      <ConfirmDialog
        isOpen={deleteConfirm.isOpen}
        onClose={() => setDeleteConfirm({ isOpen: false, supplier: null })}
        onConfirm={handleDeleteConfirm}
        title="Supprimer le fournisseur"
        message={`Êtes-vous sûr de vouloir supprimer le fournisseur "${deleteConfirm.supplier?.supplier}" ? Cette action est irréversible.`}
        confirmText="Supprimer"
        variant="danger"
      />
    </div>
  );
};
