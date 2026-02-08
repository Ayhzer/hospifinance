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

export const OpexTable = ({ suppliers, totals, onEdit, onDelete, onAdd, columnVisibility = {} }) => {
  const col = (key) => columnVisibility[key] !== false;
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
    <div className="bg-white rounded-lg shadow-md p-3 sm:p-4 md:p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 gap-3">
        <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800">Gestion OPEX - Fournisseurs</h2>
        <div className="flex flex-wrap gap-2 sm:gap-3 w-full sm:w-auto">
          <Button
            variant="secondary"
            icon={Download}
            size="sm"
            onClick={() => exportToCSV(suppliers, 'opex_fournisseurs')}
            className="flex-1 sm:flex-none"
          >
            <span className="hidden sm:inline">CSV</span>
            <span className="sm:hidden">CSV</span>
          </Button>
          <Button
            variant="secondary"
            icon={Download}
            size="sm"
            onClick={() => exportToJSON(suppliers, 'opex_fournisseurs')}
            className="flex-1 sm:flex-none"
          >
            <span className="hidden sm:inline">JSON</span>
            <span className="sm:hidden">JSON</span>
          </Button>
          <Button variant="primary" icon={Plus} size="sm" onClick={onAdd} className="w-full sm:w-auto">
            <span className="hidden sm:inline">Nouveau fournisseur</span>
            <span className="sm:hidden">Nouveau</span>
          </Button>
        </div>
      </div>

      <div className="overflow-x-auto -mx-3 sm:mx-0">
        <div className="inline-block min-w-full align-middle">
          <div className="overflow-hidden">
        <table className="w-full min-w-[800px]">
          <thead>
            <tr className="bg-gray-50 border-b">
              <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-xs sm:text-sm font-semibold text-gray-700 whitespace-nowrap">
                Fournisseur
              </th>
              <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-xs sm:text-sm font-semibold text-gray-700 whitespace-nowrap">
                Catégorie
              </th>
              <th className="px-2 sm:px-4 py-2 sm:py-3 text-right text-xs sm:text-sm font-semibold text-gray-700 whitespace-nowrap">
                Budget annuel
              </th>
              <th className="px-2 sm:px-4 py-2 sm:py-3 text-right text-xs sm:text-sm font-semibold text-gray-700 whitespace-nowrap">
                Dépensé
              </th>
              <th className="px-2 sm:px-4 py-2 sm:py-3 text-right text-xs sm:text-sm font-semibold text-gray-700 whitespace-nowrap">
                Engagé
              </th>
              <th className="px-2 sm:px-4 py-2 sm:py-3 text-right text-xs sm:text-sm font-semibold text-gray-700 whitespace-nowrap">
                Disponible
              </th>
              <th className="px-2 sm:px-4 py-2 sm:py-3 text-center text-xs sm:text-sm font-semibold text-gray-700 whitespace-nowrap">
                Utilisation
              </th>
              <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-xs sm:text-sm font-semibold text-gray-700 whitespace-nowrap">
                Notes
              </th>
              <th className="px-2 sm:px-4 py-2 sm:py-3 text-center text-xs sm:text-sm font-semibold text-gray-700 whitespace-nowrap">
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
                  <td className="px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm font-medium text-gray-900 whitespace-nowrap">
                    {supplier.supplier}
                  </td>
                  <td className="px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-gray-700 whitespace-nowrap">{supplier.category}</td>
                  <td className="px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-right text-gray-900 whitespace-nowrap">
                    {formatCurrency(supplier.budgetAnnuel)}
                  </td>
                  <td className="px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-right text-orange-600 whitespace-nowrap">
                    {formatCurrency(supplier.depenseActuelle)}
                  </td>
                  <td className="px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-right text-yellow-600 whitespace-nowrap">
                    {formatCurrency(supplier.engagement)}
                  </td>
                  <td
                    className={`px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-right font-semibold whitespace-nowrap ${
                      disponible < 0 ? 'text-red-600' : 'text-green-600'
                    }`}
                  >
                    {formatCurrency(disponible)}
                  </td>
                  <td className="px-2 sm:px-4 py-2 sm:py-3">
                    <div className="flex flex-col items-center min-w-[80px] sm:min-w-[100px]">
                      <span className="text-xs sm:text-sm font-semibold mb-1">
                        {utilisation.toFixed(1)}%
                      </span>
                      <ProgressBar value={utilisation} showLabel={false} size="sm" />
                    </div>
                  </td>
                  <td className="px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-gray-600 max-w-[120px] sm:max-w-xs truncate">
                    {supplier.notes}
                  </td>
                  <td className="px-2 sm:px-4 py-2 sm:py-3">
                    <div className="flex gap-1 sm:gap-2 justify-center">
                      <button
                        onClick={() => onEdit(supplier)}
                        className="p-1 text-blue-600 hover:bg-blue-50 rounded touch-manipulation"
                        title="Modifier"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(supplier)}
                        className="p-1 text-red-600 hover:bg-red-50 rounded touch-manipulation"
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
              <td colSpan="2" className="px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-gray-900 whitespace-nowrap">
                TOTAL
              </td>
              <td className="px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-right text-gray-900 whitespace-nowrap">
                {formatCurrency(totals.budget)}
              </td>
              <td className="px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-right text-orange-600 whitespace-nowrap">
                {formatCurrency(totals.depense)}
              </td>
              <td className="px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-right text-yellow-600 whitespace-nowrap">
                {formatCurrency(totals.engagement)}
              </td>
              <td
                className={`px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-right whitespace-nowrap ${
                  totals.disponible < 0 ? 'text-red-600' : 'text-green-600'
                }`}
              >
                {formatCurrency(totals.disponible)}
              </td>
              <td className="px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-center whitespace-nowrap">
                {totals.tauxUtilisation.toFixed(1)}%
              </td>
              <td colSpan="2"></td>
            </tr>
          </tfoot>
        </table>
          </div>
        </div>
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
