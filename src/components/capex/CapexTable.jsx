/**
 * Composant CapexTable - Tableau des projets CAPEX
 */

import React, { useState, useCallback } from 'react';
import { Edit2, Trash2, Download, Plus, FileUp, FileDown } from 'lucide-react';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { calculateAvailable, calculateUsageRate } from '../../utils/calculations';
import { computeOrderImpactByParent } from '../../utils/orderCalculations';
import { exportToCSV, exportToJSON, exportCapexTemplate } from '../../utils/exportUtils';
import { importCapexFromCSV } from '../../utils/importUtils';
import { usePermissions } from '../../contexts/PermissionsContext';
import { useSettings } from '../../contexts/SettingsContext';
import { STATUS_COLORS, ENVELOPPE_COLORS } from '../../constants/budgetConstants';
import { Button } from '../common/Button';
import { ProgressBar } from '../common/ProgressBar';
import { ConfirmDialog } from '../common/ConfirmDialog';
import ImportModal from '../common/ImportModal';
import EnveloppesSummary from './EnveloppesSummary';

export const CapexTable = ({ projects, totals, orders = [], onEdit, onDelete, onAdd, onImport, calculateEnveloppeTotal, getUsedEnveloppes }) => {
  const permissions = usePermissions();
  const { settings } = useSettings();
  const [deleteConfirm, setDeleteConfirm] = useState({ isOpen: false, project: null });
  const [importModalOpen, setImportModalOpen] = useState(false);

  // Colonnes personnalisées pour CAPEX
  const customColumns = settings.customColumns?.capex || [];

  // Impact des commandes par projet
  const orderImpactByProject = computeOrderImpactByParent(orders);

  const handleDeleteClick = useCallback((project) => {
    setDeleteConfirm({ isOpen: true, project });
  }, []);

  const handleDeleteConfirm = useCallback(() => {
    if (deleteConfirm.project) {
      onDelete(deleteConfirm.project.id);
    }
    setDeleteConfirm({ isOpen: false, project: null });
  }, [deleteConfirm, onDelete]);

  const handleImport = useCallback(async (file) => {
    const result = await importCapexFromCSV(file, projects);

    if (result.success && result.data) {
      result.data.forEach(project => {
        onImport(project);
      });
    }

    return result;
  }, [projects, onImport]);

  return (
    <div className="bg-white rounded-lg shadow-md p-3 sm:p-4 md:p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 gap-3">
        <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800">Gestion CAPEX - Projets</h2>
        <div className="flex flex-wrap gap-2 sm:gap-3 w-full sm:w-auto">
          {permissions.canDownloadTemplate && (
            <Button
              variant="secondary"
              icon={<FileDown size={16} />}
              size="sm"
              onClick={exportCapexTemplate}
              className="flex-1 sm:flex-none"
              title="Télécharger un modèle CSV vierge"
            >
              <span className="hidden sm:inline">Modèle</span>
              <span className="sm:hidden">📄</span>
            </Button>
          )}
          {permissions.can('import', 'capex') && (
            <Button
              variant="secondary"
              icon={<FileUp size={16} />}
              size="sm"
              onClick={() => setImportModalOpen(true)}
              className="flex-1 sm:flex-none"
              title="Importer des projets depuis CSV"
            >
              <span className="hidden sm:inline">Importer</span>
              <span className="sm:hidden">📥</span>
            </Button>
          )}
          {permissions.can('export', 'capex') && (
            <>
              <Button
                variant="secondary"
                icon={<Download size={16} />}
                size="sm"
                onClick={() => exportToCSV(projects, 'capex_projets')}
                className="flex-1 sm:flex-none"
              >
                <span className="hidden sm:inline">CSV</span>
                <span className="sm:hidden">CSV</span>
              </Button>
              <Button
                variant="secondary"
                icon={<Download size={16} />}
                size="sm"
                onClick={() => exportToJSON(projects, 'capex_projets')}
                className="flex-1 sm:flex-none"
              >
                <span className="hidden sm:inline">JSON</span>
                <span className="sm:hidden">JSON</span>
              </Button>
            </>
          )}
          {permissions.can('add', 'capex') && (
            <Button variant="success" icon={<Plus size={16} />} size="sm" onClick={onAdd} className="w-full sm:w-auto">
              <span className="hidden sm:inline">Nouveau projet</span>
              <span className="sm:hidden">Nouveau</span>
            </Button>
          )}
        </div>
      </div>

      {/* Bandeau de synthèse */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-4 sm:mb-6">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <div className="text-xs text-blue-600 font-medium">Budget total</div>
          <div className="text-base sm:text-lg font-bold text-blue-800">{formatCurrency(totals.budget)}</div>
        </div>
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
          <div className="text-xs text-orange-600 font-medium">Dépensé</div>
          <div className="text-base sm:text-lg font-bold text-orange-700">{formatCurrency(totals.depense)}</div>
        </div>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
          <div className="text-xs text-yellow-600 font-medium">Engagé</div>
          <div className="text-base sm:text-lg font-bold text-yellow-700">{formatCurrency(totals.engagement)}</div>
        </div>
        <div className={`rounded-lg p-3 border ${totals.disponible < 0 ? 'bg-red-50 border-red-200' : 'bg-green-50 border-green-200'}`}>
          <div className={`text-xs font-medium ${totals.disponible < 0 ? 'text-red-600' : 'text-green-600'}`}>Disponible</div>
          <div className={`text-base sm:text-lg font-bold ${totals.disponible < 0 ? 'text-red-700' : 'text-green-700'}`}>{formatCurrency(totals.disponible)}</div>
        </div>
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 col-span-2 sm:col-span-1">
          <div className="text-xs text-gray-600 font-medium mb-1">Utilisation</div>
          <div className="text-base sm:text-lg font-bold text-gray-800 mb-1">{totals.tauxUtilisation.toFixed(1)}%</div>
          <ProgressBar value={totals.tauxUtilisation} showLabel={false} size="sm" warningThreshold={settings.rules.warningThreshold} criticalThreshold={settings.rules.criticalThreshold} />
        </div>
      </div>

      {/* Synthèse par enveloppe */}
      {calculateEnveloppeTotal && getUsedEnveloppes && (
        <EnveloppesSummary
          projects={projects}
          calculateEnveloppeTotal={calculateEnveloppeTotal}
          getUsedEnveloppes={getUsedEnveloppes}
        />
      )}

      <div className="overflow-x-auto -mx-3 sm:mx-0">
        <div className="inline-block min-w-full align-middle">
          <div className="overflow-hidden">
        <table className="w-full min-w-[800px]">
          <thead>
            <tr className="bg-gray-50 border-b">
              <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-xs sm:text-sm font-semibold text-gray-700 whitespace-nowrap">Enveloppe</th>
              <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-xs sm:text-sm font-semibold text-gray-700 whitespace-nowrap">Projet</th>
              <th className="px-2 sm:px-4 py-2 sm:py-3 text-center text-xs sm:text-sm font-semibold text-gray-700 whitespace-nowrap">Statut</th>
              <th className="px-2 sm:px-4 py-2 sm:py-3 text-right text-xs sm:text-sm font-semibold text-gray-700 whitespace-nowrap">Budget total</th>
              <th className="px-2 sm:px-4 py-2 sm:py-3 text-right text-xs sm:text-sm font-semibold text-gray-700 whitespace-nowrap">Dépensé</th>
              <th className="px-2 sm:px-4 py-2 sm:py-3 text-right text-xs sm:text-sm font-semibold text-gray-700 whitespace-nowrap">Engagé</th>
              <th className="px-2 sm:px-4 py-2 sm:py-3 text-right text-xs sm:text-sm font-semibold text-gray-700 whitespace-nowrap">Disponible</th>
              <th className="px-2 sm:px-4 py-2 sm:py-3 text-center text-xs sm:text-sm font-semibold text-gray-700 whitespace-nowrap">Utilisation</th>
              <th className="px-2 sm:px-4 py-2 sm:py-3 text-center text-xs sm:text-sm font-semibold text-gray-700 whitespace-nowrap">Période</th>
              <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-xs sm:text-sm font-semibold text-gray-700 whitespace-nowrap">Notes</th>
              {customColumns.map(column => (
                <th key={column.id} className="px-2 sm:px-4 py-2 sm:py-3 text-left text-xs sm:text-sm font-semibold text-gray-700 whitespace-nowrap">
                  {column.name}
                </th>
              ))}
              <th className="px-2 sm:px-4 py-2 sm:py-3 text-center text-xs sm:text-sm font-semibold text-gray-700 whitespace-nowrap">Actions</th>
            </tr>
          </thead>
          <tbody>
            {projects.map((project) => {
              const impact = orderImpactByProject[String(project.id)] || { engagement: 0, depense: 0 };
              const totalDepense = (Number(project.depense) || 0) + impact.depense;
              const totalEngagement = (Number(project.engagement) || 0) + impact.engagement;
              const disponible = calculateAvailable(
                project.budgetTotal,
                totalDepense,
                totalEngagement
              );
              const utilisation = calculateUsageRate(
                project.budgetTotal,
                totalDepense,
                totalEngagement
              );

              return (
                <tr key={project.id} className="border-b hover:bg-gray-50">
                  <td className="px-2 sm:px-4 py-2 sm:py-3 whitespace-nowrap">
                    <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${ENVELOPPE_COLORS[project.enveloppe] || ENVELOPPE_COLORS['Autre']}`}>
                      {project.enveloppe || 'Autre'}
                    </span>
                  </td>
                  <td className="px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm font-medium text-gray-900 whitespace-nowrap">{project.project}</td>
                  <td className="px-2 sm:px-4 py-2 sm:py-3 whitespace-nowrap">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${STATUS_COLORS[project.status] || STATUS_COLORS.Planifié}`}>
                      {project.status}
                    </span>
                  </td>
                  <td className="px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-right text-gray-900 whitespace-nowrap">
                    {formatCurrency(project.budgetTotal)}
                  </td>
                  <td className="px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-right text-orange-600 whitespace-nowrap">
                    {formatCurrency(totalDepense)}
                  </td>
                  <td className="px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-right text-yellow-600 whitespace-nowrap">
                    {formatCurrency(totalEngagement)}
                  </td>
                  <td className={`px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-right font-semibold whitespace-nowrap ${disponible < 0 ? 'text-red-600' : 'text-green-600'}`}>
                    {formatCurrency(disponible)}
                  </td>
                  <td className="px-2 sm:px-4 py-2 sm:py-3">
                    <div className="flex flex-col items-center min-w-[80px] sm:min-w-[100px]">
                      <span className="text-xs sm:text-sm font-semibold mb-1">{utilisation.toFixed(1)}%</span>
                      <ProgressBar value={utilisation} showLabel={false} size="sm" warningThreshold={settings.rules.warningThreshold} criticalThreshold={settings.rules.criticalThreshold} />
                    </div>
                  </td>
                  <td className="px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-center text-gray-700">
                    {project.dateDebut && project.dateFin && (
                      <div className="text-xs">
                        <div>{formatDate(project.dateDebut)}</div>
                        <div className="text-gray-500">→</div>
                        <div>{formatDate(project.dateFin)}</div>
                      </div>
                    )}
                  </td>
                  <td className="px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-gray-600 max-w-[120px] sm:max-w-xs truncate">
                    {project.notes}
                  </td>
                  {customColumns.map(column => (
                    <td key={column.id} className="px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-gray-700 whitespace-nowrap">
                      {project[column.id] || '-'}
                    </td>
                  ))}
                  <td className="px-2 sm:px-4 py-2 sm:py-3">
                    <div className="flex gap-1 sm:gap-2 justify-center">
                      {permissions.can('edit', 'capex') && (
                        <button onClick={() => onEdit(project)} className="p-1 text-blue-600 hover:bg-blue-50 rounded touch-manipulation" title="Modifier">
                          <Edit2 size={16} />
                        </button>
                      )}
                      {permissions.can('delete', 'capex') && (
                        <button onClick={() => handleDeleteClick(project)} className="p-1 text-red-600 hover:bg-red-50 rounded touch-manipulation" title="Supprimer">
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
          <tfoot className="bg-gray-100 font-semibold">
            <tr>
              <td colSpan="2" className="px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-gray-900 whitespace-nowrap">TOTAL</td>
              <td className="px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-right text-gray-900 whitespace-nowrap">{formatCurrency(totals.budget)}</td>
              <td className="px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-right text-orange-600 whitespace-nowrap">{formatCurrency(totals.depense)}</td>
              <td className="px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-right text-yellow-600 whitespace-nowrap">{formatCurrency(totals.engagement)}</td>
              <td className={`px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-right whitespace-nowrap ${totals.disponible < 0 ? 'text-red-600' : 'text-green-600'}`}>{formatCurrency(totals.disponible)}</td>
              <td className="px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-center whitespace-nowrap">{totals.tauxUtilisation.toFixed(1)}%</td>
              <td colSpan="3"></td>
            </tr>
          </tfoot>
        </table>
          </div>
        </div>
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

      <ImportModal
        isOpen={importModalOpen}
        onClose={() => setImportModalOpen(false)}
        onImport={handleImport}
        title="Importer des Projets CAPEX"
        type="capex"
      />
    </div>
  );
};
