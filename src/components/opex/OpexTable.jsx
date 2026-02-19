/**
 * Composant OpexTable - Tableau des fournisseurs OPEX
 */

import React, { useState, useCallback, useMemo } from 'react';
import { Edit2, Trash2, Download, Plus, FileUp, FileDown, RotateCcw, FilterX, GripVertical } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';
import { calculateAvailable, calculateUsageRate } from '../../utils/calculations';
import { computeOrderImpactByParent } from '../../utils/orderCalculations';
import { exportToCSV, exportToJSON, exportOpexTemplate } from '../../utils/exportUtils';
import { importOpexFromCSV } from '../../utils/importUtils';
import { usePermissions } from '../../contexts/PermissionsContext';
import { useSettings } from '../../contexts/SettingsContext';
import { useColumnResize } from '../../hooks/useColumnResize.jsx';
import { useTableControls } from '../../hooks/useTableControls.jsx';
import { useColumnOrder } from '../../hooks/useColumnOrder';
import { Button } from '../common/Button';
import { ProgressBar } from '../common/ProgressBar';
import { ConfirmDialog } from '../common/ConfirmDialog';
import ImportModal from '../common/ImportModal';

const OPEX_DEFAULT_WIDTHS = {
  supplier: 180,
  category: 140,
  budgetAnnuel: 120,
  depenseActuelle: 110,
  engagement: 110,
  disponible: 120,
  utilisation: 110,
  notes: 180,
  actions: 80,
};

/** Colonnes réordonnables (sans actions) */
const OPEX_COL_KEYS = ['supplier', 'category', 'budgetAnnuel', 'depenseActuelle', 'engagement', 'disponible', 'utilisation', 'notes'];

export const OpexTable = ({ suppliers, totals, orders = [], onEdit, onDelete, onAdd, onImport, columnVisibility = {} }) => {
  const col = (key) => (columnVisibility || {})[key] !== false;
  const permissions = usePermissions();
  const { settings } = useSettings();

  const { getHeaderProps, getCellProps, ResizeHandle, resetAll } = useColumnResize('opex', OPEX_DEFAULT_WIDTHS);
  const { order: colOrder, resetOrder, getDragSourceProps, getDropProps, dropTarget } = useColumnOrder('opex', OPEX_COL_KEYS);

  // Colonnes visibles dans l'ordre courant
  const visibleOrder = colOrder.filter(k => col(k));

  // Impact des commandes par fournisseur
  const orderImpactBySupplier = computeOrderImpactByParent(orders);
  const [deleteConfirm, setDeleteConfirm] = useState({ isOpen: false, supplier: null });
  const [importModalOpen, setImportModalOpen] = useState(false);

  // Colonnes personnalisées pour OPEX
  const customColumns = settings.customColumns?.opex || [];

  // Enrichir les données
  const enrichedSuppliers = useMemo(() => {
    return suppliers.map(supplier => {
      const impact = orderImpactBySupplier[String(supplier.id)] || { engagement: 0, depense: 0 };
      const totalDepense = (Number(supplier.depenseActuelle) || 0) + impact.depense;
      const totalEngagement = (Number(supplier.engagement) || 0) + impact.engagement;
      const disponible = calculateAvailable(supplier.budgetAnnuel, totalDepense, totalEngagement);
      const utilisation = calculateUsageRate(supplier.budgetAnnuel, totalDepense, totalEngagement);
      return { ...supplier, _totalDepense: totalDepense, _totalEngagement: totalEngagement, _disponible: disponible, _utilisation: utilisation };
    });
  }, [suppliers, orderImpactBySupplier]);

  const { processedData, toggleSort, SortIcon, FilterInput, hasActiveFilters, clearFilters } = useTableControls(enrichedSuppliers, {
    numericColumns: ['budgetAnnuel', 'depenseActuelle', 'engagement', '_disponible', '_utilisation', '_totalDepense', '_totalEngagement'],
  });

  const handleDeleteClick = useCallback((supplier) => {
    setDeleteConfirm({ isOpen: true, supplier });
  }, []);

  const handleDeleteConfirm = useCallback(() => {
    if (deleteConfirm.supplier) onDelete(deleteConfirm.supplier.id);
    setDeleteConfirm({ isOpen: false, supplier: null });
  }, [deleteConfirm, onDelete]);

  const handleImport = useCallback(async (file) => {
    const result = await importOpexFromCSV(file, suppliers);
    if (result.success && result.data) result.data.forEach(s => onImport(s));
    return result;
  }, [suppliers, onImport]);

  const thBase = "px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm font-semibold text-gray-700 whitespace-nowrap relative";
  const tdBase = "px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm whitespace-nowrap overflow-hidden text-ellipsis";

  // --- Rendu des cellules par colonne ---
  const grip = (k) => (
    <span
      {...getDragSourceProps(k)}
      className="inline-flex items-center cursor-grab mr-0.5 align-middle"
      onClick={e => e.stopPropagation()}
      title="Glisser pour déplacer"
    >
      <GripVertical size={11} className="text-gray-300" />
    </span>
  );

  const dropIndicator = (k) => dropTarget === k
    ? <span className="absolute inset-y-1 left-0 w-0.5 bg-blue-500 rounded-full" />
    : null;

  const renderTh = (k) => {
    const drop = getDropProps(k);
    const isDrop = dropTarget === k;
    const base = `${thBase} relative${isDrop ? ' bg-blue-50' : ''}`;

    switch (k) {
      case 'supplier':
        return <th key="supplier" className={`${base} text-left cursor-pointer select-none`} {...getHeaderProps('supplier')} {...drop} onClick={() => toggleSort('supplier')}>
          {dropIndicator(k)}{grip(k)}Fournisseur<SortIcon columnKey="supplier" /><ResizeHandle columnKey="supplier" />
        </th>;
      case 'category':
        return <th key="category" className={`${base} text-left cursor-pointer select-none`} {...getHeaderProps('category')} {...drop} onClick={() => toggleSort('category')}>
          {dropIndicator(k)}{grip(k)}Catégorie<SortIcon columnKey="category" /><ResizeHandle columnKey="category" />
        </th>;
      case 'budgetAnnuel':
        return <th key="budgetAnnuel" className={`${base} text-right cursor-pointer select-none`} {...getHeaderProps('budgetAnnuel')} {...drop} onClick={() => toggleSort('budgetAnnuel')}>
          {dropIndicator(k)}{grip(k)}Budget annuel<SortIcon columnKey="budgetAnnuel" /><ResizeHandle columnKey="budgetAnnuel" />
        </th>;
      case 'depenseActuelle':
        return <th key="depenseActuelle" className={`${base} text-right cursor-pointer select-none`} {...getHeaderProps('depenseActuelle')} {...drop} onClick={() => toggleSort('_totalDepense')}>
          {dropIndicator(k)}{grip(k)}Dépensé<SortIcon columnKey="_totalDepense" /><ResizeHandle columnKey="depenseActuelle" />
        </th>;
      case 'engagement':
        return <th key="engagement" className={`${base} text-right cursor-pointer select-none`} {...getHeaderProps('engagement')} {...drop} onClick={() => toggleSort('_totalEngagement')}>
          {dropIndicator(k)}{grip(k)}Engagé<SortIcon columnKey="_totalEngagement" /><ResizeHandle columnKey="engagement" />
        </th>;
      case 'disponible':
        return <th key="disponible" className={`${base} text-right cursor-pointer select-none`} {...getHeaderProps('disponible')} {...drop} onClick={() => toggleSort('_disponible')}>
          {dropIndicator(k)}{grip(k)}Disponible<SortIcon columnKey="_disponible" /><ResizeHandle columnKey="disponible" />
        </th>;
      case 'utilisation':
        return <th key="utilisation" className={`${base} text-center cursor-pointer select-none`} {...getHeaderProps('utilisation')} {...drop} onClick={() => toggleSort('_utilisation')}>
          {dropIndicator(k)}{grip(k)}Utilisation<SortIcon columnKey="_utilisation" /><ResizeHandle columnKey="utilisation" />
        </th>;
      case 'notes':
        return <th key="notes" className={`${base} text-left cursor-pointer select-none`} {...getHeaderProps('notes')} {...drop} onClick={() => toggleSort('notes')}>
          {dropIndicator(k)}{grip(k)}Notes<SortIcon columnKey="notes" /><ResizeHandle columnKey="notes" />
        </th>;
      default: return null;
    }
  };

  const renderFilterTh = (k) => {
    switch (k) {
      case 'supplier':     return <th key="supplier" className="px-1 py-1" {...getCellProps('supplier')}><FilterInput columnKey="supplier" placeholder="Fournisseur..." /></th>;
      case 'category':    return <th key="category" className="px-1 py-1" {...getCellProps('category')}><FilterInput columnKey="category" placeholder="Catégorie..." /></th>;
      case 'budgetAnnuel':    return <th key="budgetAnnuel" className="px-1 py-1" {...getCellProps('budgetAnnuel')}></th>;
      case 'depenseActuelle': return <th key="depenseActuelle" className="px-1 py-1" {...getCellProps('depenseActuelle')}></th>;
      case 'engagement':  return <th key="engagement" className="px-1 py-1" {...getCellProps('engagement')}></th>;
      case 'disponible':  return <th key="disponible" className="px-1 py-1" {...getCellProps('disponible')}></th>;
      case 'utilisation': return <th key="utilisation" className="px-1 py-1" {...getCellProps('utilisation')}></th>;
      case 'notes':       return <th key="notes" className="px-1 py-1" {...getCellProps('notes')}><FilterInput columnKey="notes" placeholder="Notes..." /></th>;
      default: return null;
    }
  };

  const renderTd = (k, supplier) => {
    switch (k) {
      case 'supplier':
        return <td key="supplier" className={`${tdBase} font-medium text-gray-900`} {...getCellProps('supplier')}>{supplier.supplier}</td>;
      case 'category':
        return <td key="category" className={`${tdBase} text-gray-700`} {...getCellProps('category')}>{supplier.category}</td>;
      case 'budgetAnnuel':
        return <td key="budgetAnnuel" className={`${tdBase} text-right text-gray-900`} {...getCellProps('budgetAnnuel')}>{formatCurrency(supplier.budgetAnnuel)}</td>;
      case 'depenseActuelle':
        return <td key="depenseActuelle" className={`${tdBase} text-right text-orange-600`} {...getCellProps('depenseActuelle')}>{formatCurrency(supplier._totalDepense)}</td>;
      case 'engagement':
        return <td key="engagement" className={`${tdBase} text-right text-yellow-600`} {...getCellProps('engagement')}>{formatCurrency(supplier._totalEngagement)}</td>;
      case 'disponible':
        return <td key="disponible" className={`${tdBase} text-right font-semibold ${supplier._disponible < 0 ? 'text-red-600' : 'text-green-600'}`} {...getCellProps('disponible')}>{formatCurrency(supplier._disponible)}</td>;
      case 'utilisation':
        return <td key="utilisation" className={tdBase} {...getCellProps('utilisation')}>
          <div className="flex flex-col items-center">
            <span className="text-xs sm:text-sm font-semibold mb-1">{supplier._utilisation.toFixed(1)}%</span>
            <ProgressBar value={supplier._utilisation} showLabel={false} size="sm" warningThreshold={settings.rules.warningThreshold} criticalThreshold={settings.rules.criticalThreshold} />
          </div>
        </td>;
      case 'notes':
        return <td key="notes" className={`${tdBase} text-gray-600`} {...getCellProps('notes')}>{supplier.notes}</td>;
      default: return null;
    }
  };

  const renderFooterTd = (k) => {
    switch (k) {
      case 'supplier':     return <td key="supplier" className={`${tdBase} text-gray-900`}>TOTAL</td>;
      case 'category':     return <td key="category"></td>;
      case 'budgetAnnuel': return <td key="budgetAnnuel" className={`${tdBase} text-right text-gray-900`}>{formatCurrency(totals.budget)}</td>;
      case 'depenseActuelle': return <td key="depenseActuelle" className={`${tdBase} text-right text-orange-600`}>{formatCurrency(totals.depense)}</td>;
      case 'engagement':   return <td key="engagement" className={`${tdBase} text-right text-yellow-600`}>{formatCurrency(totals.engagement)}</td>;
      case 'disponible':   return <td key="disponible" className={`${tdBase} text-right ${totals.disponible < 0 ? 'text-red-600' : 'text-green-600'}`}>{formatCurrency(totals.disponible)}</td>;
      case 'utilisation':  return <td key="utilisation" className={`${tdBase} text-center`}>{totals.tauxUtilisation.toFixed(1)}%</td>;
      case 'notes':        return <td key="notes"></td>;
      default: return null;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-3 sm:p-4 md:p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 gap-3">
        <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800">Gestion OPEX - Fournisseurs</h2>
        <div className="flex flex-wrap gap-2 sm:gap-3 w-full sm:w-auto">
          <Button
            variant="outline" size="sm" icon={<RotateCcw size={14} />}
            onClick={() => { resetAll(); resetOrder(); }}
            className="flex-1 sm:flex-none"
            title="Réinitialiser la largeur et l'ordre des colonnes"
          >
            <span className="hidden sm:inline">Colonnes</span>
          </Button>
          {hasActiveFilters && (
            <Button variant="outline" size="sm" icon={<FilterX size={14} />} onClick={clearFilters} className="flex-1 sm:flex-none" title="Effacer tous les filtres">
              <span className="hidden sm:inline">Effacer filtres</span>
            </Button>
          )}
          {permissions.canDownloadTemplate && (
            <Button variant="secondary" icon={<FileDown size={16} />} size="sm" onClick={exportOpexTemplate} className="flex-1 sm:flex-none" title="Télécharger un modèle CSV vierge">
              <span className="hidden sm:inline">Modèle</span>
              <span className="sm:hidden">📄</span>
            </Button>
          )}
          {permissions.can('import', 'opex') && (
            <Button variant="secondary" icon={<FileUp size={16} />} size="sm" onClick={() => setImportModalOpen(true)} className="flex-1 sm:flex-none" title="Importer des fournisseurs depuis CSV">
              <span className="hidden sm:inline">Importer</span>
              <span className="sm:hidden">📥</span>
            </Button>
          )}
          {permissions.can('export', 'opex') && (
            <>
              <Button variant="secondary" icon={<Download size={16} />} size="sm" onClick={() => exportToCSV(suppliers, 'opex_fournisseurs')} className="flex-1 sm:flex-none">
                <span className="hidden sm:inline">CSV</span><span className="sm:hidden">CSV</span>
              </Button>
              <Button variant="secondary" icon={<Download size={16} />} size="sm" onClick={() => exportToJSON(suppliers, 'opex_fournisseurs')} className="flex-1 sm:flex-none">
                <span className="hidden sm:inline">JSON</span><span className="sm:hidden">JSON</span>
              </Button>
            </>
          )}
          {permissions.can('add', 'opex') && (
            <Button variant="primary" icon={<Plus size={16} />} size="sm" onClick={onAdd} className="w-full sm:w-auto">
              <span className="hidden sm:inline">Nouveau fournisseur</span>
              <span className="sm:hidden">Nouveau</span>
            </Button>
          )}
        </div>
      </div>

      {/* Bandeau de synthèse */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-4 sm:mb-6">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <div className="text-xs text-blue-600 font-medium">Budget annuel</div>
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

      <div className="overflow-x-auto -mx-3 sm:mx-0">
        <div className="inline-block min-w-full align-middle">
          <div className="overflow-hidden">
            <table className="w-full" style={{ tableLayout: 'fixed' }}>
              <thead>
                <tr className="bg-gray-50 border-b">
                  {visibleOrder.map(k => renderTh(k))}
                  {customColumns.map(column => (
                    <th key={column.id} className={`${thBase} text-left cursor-pointer select-none`} {...getHeaderProps(column.id)} onClick={() => toggleSort(column.id)}>
                      {column.name}<SortIcon columnKey={column.id} /><ResizeHandle columnKey={column.id} />
                    </th>
                  ))}
                  {col('actions') && <th className={`${thBase} text-center`} {...getHeaderProps('actions')}>Actions</th>}
                </tr>
                <tr className="bg-white border-b">
                  {visibleOrder.map(k => renderFilterTh(k))}
                  {customColumns.map(column => (
                    <th key={column.id} className="px-1 py-1" {...getCellProps(column.id)}><FilterInput columnKey={column.id} placeholder={`${column.name}...`} /></th>
                  ))}
                  {col('actions') && <th className="px-1 py-1" {...getCellProps('actions')}></th>}
                </tr>
              </thead>
              <tbody>
                {processedData.map((supplier) => (
                  <tr key={supplier.id} className="border-b hover:bg-gray-50">
                    {visibleOrder.map(k => renderTd(k, supplier))}
                    {customColumns.map(column => (
                      <td key={column.id} className={`${tdBase} text-gray-700`} {...getCellProps(column.id)}>
                        {supplier[column.id] || '-'}
                      </td>
                    ))}
                    {col('actions') && (
                      <td className={tdBase} {...getCellProps('actions')}>
                        <div className="flex gap-1 sm:gap-2 justify-center">
                          {permissions.can('edit', 'opex') && (
                            <button onClick={() => onEdit(supplier)} className="p-1 text-blue-600 hover:bg-blue-50 rounded touch-manipulation" title="Modifier">
                              <Edit2 size={16} />
                            </button>
                          )}
                          {permissions.can('delete', 'opex') && (
                            <button onClick={() => handleDeleteClick(supplier)} className="p-1 text-red-600 hover:bg-red-50 rounded touch-manipulation" title="Supprimer">
                              <Trash2 size={16} />
                            </button>
                          )}
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-gray-100 font-semibold">
                <tr>
                  {visibleOrder.map(k => renderFooterTd(k))}
                  {customColumns.map(column => <td key={column.id}></td>)}
                  {col('actions') && <td></td>}
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

      <ImportModal
        isOpen={importModalOpen}
        onClose={() => setImportModalOpen(false)}
        onImport={handleImport}
        title="Importer des Fournisseurs OPEX"
        type="opex"
      />
    </div>
  );
};
