/**
 * Modal d'import — CSV (comportement original) ou XLSX SAGE/MAGH2
 */

import { useState, useRef } from 'react';
import * as XLSX from 'xlsx';
import { FileUp, AlertCircle, CheckCircle, FileSpreadsheet } from 'lucide-react';
import { Modal } from './Modal';
import { Button } from './Button';
import { AlertBanner } from './AlertBanner';
import { importFromSageExtraction, importFromMAGH2, detectFormat } from '../../services/xlsxImportService';

const isXlsxFile = (file) =>
  file && (file.name.endsWith('.xlsx') || file.name.endsWith('.xls'));

export default function ImportModal({ isOpen, onClose, onImport, onSageImport, title, type, moteur = null }) {
  const [file, setFile]               = useState(null);
  const [sageFile, setSageFile]       = useState(false);
  const [importing, setImporting]     = useState(false);
  const [result, setResult]           = useState(null);
  const [formatDetecte, setFormatDetecte] = useState(null); // 'ANCIEN' | 'MAGH2' | 'INCONNU' | null
  const [exercice, setExercice]       = useState('2026');
  const [convertHT, setConvertHT]     = useState(true);
  const fileInputRef = useRef(null);

  const handleFileChange = async (e) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    const xlsx = isXlsxFile(selectedFile);
    const csv  = selectedFile.type === 'text/csv' || selectedFile.name.endsWith('.csv');

    if (!xlsx && !csv) {
      setResult({ success: false, errors: ['Veuillez sélectionner un fichier CSV ou XLSX valide'] });
      setFile(null);
      setFormatDetecte(null);
      return;
    }

    setFile(selectedFile);
    setSageFile(xlsx);
    setResult(null);
    setFormatDetecte(null);

    if (xlsx) {
      try {
        // Lecture légère — noms d'onglets seulement, sans charger les données
        const buffer   = await selectedFile.arrayBuffer();
        const workbook = XLSX.read(buffer, { bookSheets: true });
        setFormatDetecte(detectFormat(workbook));
      } catch {
        setFormatDetecte('INCONNU');
      }
    }
  };

  const handleImport = async () => {
    if (!file) {
      setResult({ success: false, errors: ['Veuillez sélectionner un fichier'] });
      return;
    }

    setImporting(true);
    setResult(null);

    try {
      if (sageFile && type === 'opex') {
        let parsed;
        if (formatDetecte === 'MAGH2') {
          parsed = await importFromMAGH2(file, exercice, convertHT, moteur);
        } else {
          parsed = await importFromSageExtraction(file, exercice, moteur);
        }

        if (parsed.errors.length > 0 && parsed.opexSuppliers.length === 0) {
          setResult({ success: false, errors: parsed.errors.map(e => `Ligne ${e.ligne}: ${e.erreur}`) });
          return;
        }
        if (onSageImport) await onSageImport(parsed);

        const formatLabel = formatDetecte === 'MAGH2' ? 'MAGH2' : 'SAGE';
        const htNote = formatDetecte === 'MAGH2' && convertHT ? ' (montants TTC→HT)' : '';
        setResult({
          success: true,
          message: `Import ${formatLabel} réussi (${exercice})${htNote} : ${parsed.opexSuppliers.length} fournisseurs OPEX, ${parsed.capexProjects.length} projets CAPEX, ${parsed.opexOrders.length} commandes`,
        });
        setTimeout(() => handleClose(), 3000);

      } else {
        // Import CSV classique
        const importResult = await onImport(file);
        setResult(importResult);
        if (importResult.success) setTimeout(() => handleClose(), 2000);
      }
    } catch (error) {
      setResult({ success: false, errors: [`Erreur inattendue: ${error.message}`] });
    } finally {
      setImporting(false);
    }
  };

  const handleClose = () => {
    setFile(null);
    setSageFile(false);
    setResult(null);
    setFormatDetecte(null);
    setExercice('2026');
    setConvertHT(true);
    if (fileInputRef.current) fileInputRef.current.value = '';
    onClose();
  };

  const renderInstructions = () => {
    if (sageFile && type === 'opex') {
      if (formatDetecte === 'MAGH2') return [
        'Format MAGH2 détecté — onglet "Commandes IT"',
        'Filtre sur compte ordonnateur H6x/I6x → OPEX | H2x → CAPEX',
        `Exercice sélectionné : ${exercice}`,
        convertHT ? 'Montants TTC convertis en HT via taux TVA' : 'Montants conservés en TTC',
        'Groupement par (Fournisseur + Compte ordonnateur)',
      ];
      return [
        `Format SAGE ancien — onglet "${exercice}"`,
        'Filtre sur Code Gestionnaire = IT',
        'Lignes H6x/I6x → OPEX   |   Lignes H2x → CAPEX',
        'Groupement par (Fournisseur + Compte ordonnateur)',
      ];
    }
    const instructions = {
      opex: [
        'Fichier CSV : colonnes supplier, category, budgetAnnuel, depenseActuelle, engagement, notes',
        'Ou glissez un fichier XLSX EXTRACTION COMMANDES SAGE/MAGH2 pour import direct',
      ],
      capex: [
        'Colonnes : project, enveloppe, budgetTotal, depense, engagement, dateDebut, dateFin, status, notes',
        'Statuts valides : Planifié, En cours, Terminé, Suspendu, Annulé',
      ],
      opexOrders: [
        'Colonnes : supplierName, description, montant, status, dateCommande, dateFacture, reference, notes',
      ],
      capexOrders: [
        'Colonnes : projectName, description, montant, status, dateCommande, dateFacture, reference, notes',
      ],
    };
    return instructions[type] || [];
  };

  const isMagh2  = formatDetecte === 'MAGH2';
  const isAncien = formatDetecte === 'ANCIEN';

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title={title} size="lg"
      footer={
        <div className="flex justify-end gap-2">
          <Button variant="secondary" onClick={handleClose}>Annuler</Button>
          <Button variant="primary" onClick={handleImport} disabled={!file || importing} icon={<FileUp size={16} />}>
            {importing ? 'Import en cours...' : 'Importer'}
          </Button>
        </div>
      }
    >
      <div className="space-y-4">

        {/* Bandeau format détecté */}
        {sageFile && type === 'opex' && (
          <div className={`border rounded-lg p-3 space-y-2 ${
            isMagh2  ? 'bg-purple-50 border-purple-300' :
            isAncien ? 'bg-green-50  border-green-300'  :
                       'bg-gray-50   border-gray-300'
          }`}>
            <div className="flex items-center gap-3">
              <FileSpreadsheet size={20} className={isMagh2 ? 'text-purple-700' : isAncien ? 'text-green-700' : 'text-gray-500'} />
              <div>
                <p className={`font-semibold text-sm ${isMagh2 ? 'text-purple-900' : isAncien ? 'text-green-900' : 'text-gray-700'}`}>
                  {isMagh2  ? 'Format MAGH2 détecté — onglet "Commandes IT"' :
                   isAncien ? 'Format SAGE ancien détecté — onglet annuel' :
                   formatDetecte === 'INCONNU' ? 'Format inconnu — structure non reconnue' :
                   'Détection du format en cours…'}
                </p>
                <p className={`text-xs ${isMagh2 ? 'text-purple-700' : 'text-green-700'}`}>
                  Import automatique OPEX + CAPEX
                  {isMagh2 && convertHT && ' — montants TTC convertis en HT'}
                </p>
              </div>
            </div>

            {/* Sélecteur exercice */}
            <div className="flex items-center gap-3">
              <label className="text-xs font-medium text-gray-700 w-20">Exercice :</label>
              <select
                value={exercice}
                onChange={e => setExercice(e.target.value)}
                className="border border-gray-300 rounded px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                {['2021','2022','2023','2024','2025','2026'].map(y => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </div>

            {/* Option TTC→HT (MAGH2 seulement) */}
            {isMagh2 && (
              <label className="flex items-center gap-2 text-xs text-gray-700 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={convertHT}
                  onChange={e => setConvertHT(e.target.checked)}
                  className="accent-purple-600"
                />
                Convertir montants TTC → HT (recommandé pour comparaison EPRD)
              </label>
            )}
          </div>
        )}

        {/* Instructions */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
            <AlertCircle size={18} />
            Instructions d'import
          </h4>
          <ul className="text-sm text-blue-800 space-y-1 ml-6 list-disc">
            {renderInstructions().map((instruction, index) => (
              <li key={index}>{instruction}</li>
            ))}
          </ul>
        </div>

        {/* Sélection de fichier */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {type === 'opex' ? 'Fichier CSV, XLSX SAGE ou MAGH2 à importer' : 'Fichier CSV à importer'}
          </label>
          <input
            ref={fileInputRef}
            type="file"
            accept={type === 'opex' ? '.csv,.xlsx,.xls' : '.csv'}
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded file:border-0
              file:text-sm file:font-semibold
              file:bg-blue-50 file:text-blue-700
              hover:file:bg-blue-100
              cursor-pointer"
          />
          {file && (
            <p className="mt-2 text-sm text-gray-600 flex items-center gap-2">
              <CheckCircle size={16} className="text-green-600" />
              Fichier sélectionné : <span className="font-medium">{file.name}</span>
            </p>
          )}
        </div>

        {/* Résultat */}
        {result && (
          <div className="mt-4">
            {result.success ? (
              <AlertBanner type="success" onClose={() => setResult(null)}>
                <div>
                  <p className="font-semibold">{result.message}</p>
                  <p className="text-sm mt-1">La fenêtre va se fermer automatiquement…</p>
                </div>
              </AlertBanner>
            ) : (
              <AlertBanner type="error" onClose={() => setResult(null)}>
                <div>
                  <p className="font-semibold mb-2">Erreurs lors de l'import</p>
                  {result.errors?.length > 0 && (
                    <div className="max-h-48 overflow-y-auto">
                      <ul className="text-sm space-y-1 list-disc list-inside">
                        {result.errors.map((error, index) => (
                          <li key={index}>{error}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </AlertBanner>
            )}
          </div>
        )}

        <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded">
          <strong>Note :</strong> L'import remplace toutes les données existantes.
        </div>
      </div>
    </Modal>
  );
}
