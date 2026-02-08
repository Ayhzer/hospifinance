/**
 * Composant CapexTable - Tableau des projets CAPEX
 */

import React, { useState, useCallback } from 'react';
import { Edit2, Trash2, Download, Plus } from 'lucide-react';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { calculateAvailable, calculateUsageRate } from '../../utils/calculations';
import { exportToCSV, exportToJSON } from '../../utils/exportUtils';
import { STATUS_COLORS } from '../../constants/budgetConstants';
import { Button } from '../common/Button';
import { ProgressBar } from '../common/ProgressBar';
import { ConfirmDialog } from '../common/ConfirmDialog';

export const CapexTable = ({ projects, totals, onEdit, onDelete, onAdd }) => {
  const [deleteConfirm, setDeleteConfirm] = useState({ isOpen: false, project: null });

  const handleDeleteClick = useCallback((project) => {
    setDeleteConfirm({ isOpen: true, project });
  }, []);

  const handleDeleteConfirm = useCallback(() => {
    if (deleteConfirm.project) {
      onDelete(deleteConfirm.project.id);
    }
    setDeleteConfirm({ isOpen: false, project: null });
  }, [deleteConfirm, onDelete]);

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Gestion CAPEX - Projets</h2>
        <div className="flex gap-3">
          <Button
            variant="secondary"
            icon={Download}
            onClick={() => exportToCSV(projects, 'capex_projets')}
          >
            CSV
          </Button>
          <Button
            variant="secondary"
            icon={Download}
            onClick={() => exportToJSON(projects, 'capex_projets')}
          >
            JSON
          </Button>
          <Button variant="success" icon={Plus} onClick={onAdd}>
            Nouveau projet
          </Button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b">
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Projet</th>
              <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">Statut</th>
              <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">
                Budget total
              </th>
              <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Dépensé</th>
              <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Engagé</th>
              <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">
                Disponible
              </th>
              <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">
                Utilisation
              </th>
              <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">Période</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Notes</th>
              <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {projects.map((project) => {
              const disponible = calculateAvailable(
                project.budgetTotal,
                project.depense,
                project.engagement
              );
              const utilisation = calculateUsageRate(
                project.budgetTotal,
                project.depense,
                project.engagement
              );

              return (
                <tr key={project.id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">{project.project}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                        STATUS_COLORS[project.status] || STATUS_COLORS.Planifié
                      }`}
                    >
                      {project.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-right text-gray-900">
                    {formatCurrency(project.budgetTotal)}
                  </td>
                  <td className="px-4 py-3 text-sm text-right text-orange-600">
                    {formatCurrency(project.depense)}
                  </td>
                  <td className="px-4 py-3 text-sm text-right text-yellow-600">
                    {formatCurrency(project.engagement)}
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
                  <td className="px-4 py-3 text-sm text-center text-gray-700">
                    {project.dateDebut && project.dateFin && (
                      <div className="text-xs">
                        <div>{formatDate(project.dateDebut)}</div>
                        <div className="text-gray-500">→</div>
                        <div>{formatDate(project.dateFin)}</div>
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600 max-w-xs truncate">
                    {project.notes}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2 justify-center">
                      <button
                        onClick={() => onEdit(project)}
                        className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                        title="Modifier"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(project)}
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
              <td colSpan="3"></td>
            </tr>
          </tfoot>
        </table>
      </div>

      <ConfirmDialog
        isOpen={deleteConfirm.isOpen}
        onClose={() => setDeleteConfirm({ isOpen: false, project: null })}
        onConfirm={handleDeleteConfirm}
        title="Supprimer le projet"
        message={`Êtes-vous sûr de vouloir supprimer le projet "${deleteConfirm.project?.project}" ? Cette action est irréversible.`}
        confirmText="Supprimer"
        variant="danger"
      />
    </div>
  );
};
