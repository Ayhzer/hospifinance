/**
 * Modal d'import de données avec validation
 */

import { useState, useRef } from 'react';
import { FileUp, AlertCircle, CheckCircle, X } from 'lucide-react';
import { Modal } from './Modal';
import { Button } from './Button';
import { AlertBanner } from './AlertBanner';

export default function ImportModal({ isOpen, onClose, onImport, title, type }) {
  const [file, setFile] = useState(null);
  const [importing, setImporting] = useState(false);
  const [result, setResult] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && selectedFile.type === 'text/csv') {
      setFile(selectedFile);
      setResult(null);
    } else {
      setResult({
        success: false,
        errors: ['Veuillez sélectionner un fichier CSV valide']
      });
      setFile(null);
    }
  };

  const handleImport = async () => {
    if (!file) {
      setResult({
        success: false,
        errors: ['Veuillez sélectionner un fichier']
      });
      return;
    }

    setImporting(true);
    setResult(null);

    try {
      const importResult = await onImport(file);
      setResult(importResult);

      if (importResult.success) {
        // Fermer après 2 secondes en cas de succès
        setTimeout(() => {
          handleClose();
        }, 2000);
      }
    } catch (error) {
      setResult({
        success: false,
        errors: [`Erreur inattendue: ${error.message}`]
      });
    } finally {
      setImporting(false);
    }
  };

  const handleClose = () => {
    setFile(null);
    setResult(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    onClose();
  };

  const renderInstructions = () => {
    const instructions = {
      opex: [
        'Le fichier doit contenir les colonnes: supplier, category, budgetAnnuel, depenseActuelle, engagement, notes',
        'Catégories valides: Logiciels, Licences, Support matériel, Maintenance, Cloud & Hébergement, Télécommunications, Services externes, Formation',
        'Les montants doivent être des nombres positifs',
        'Les noms de fournisseurs doivent être uniques'
      ],
      capex: [
        'Le fichier doit contenir les colonnes: project, budgetTotal, depense, engagement, dateDebut, dateFin, status, notes',
        'Statuts valides: Planifié, En cours, Terminé, Suspendu, Annulé',
        'Les dates doivent être au format YYYY-MM-DD',
        'La date de début doit être antérieure à la date de fin',
        'Les noms de projets doivent être uniques'
      ],
      opexOrders: [
        'Le fichier doit contenir les colonnes: supplierName, description, montant, status, dateCommande, dateFacture, reference, notes',
        'Le fournisseur doit exister dans vos données OPEX',
        'Statuts valides: En attente, Commandée, Livrée, Facturée, Payée, Annulée',
        'Les montants doivent être supérieurs à 0'
      ],
      capexOrders: [
        'Le fichier doit contenir les colonnes: projectName, description, montant, status, dateCommande, dateFacture, reference, notes',
        'Le projet doit exister dans vos données CAPEX',
        'Statuts valides: En attente, Commandée, Livrée, Facturée, Payée, Annulée',
        'Les montants doivent être supérieurs à 0'
      ]
    };

    return instructions[type] || [];
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={title}
      size="lg"
      footer={
        <div className="flex justify-end gap-2">
          <Button variant="secondary" onClick={handleClose}>
            Annuler
          </Button>
          <Button
            variant="primary"
            onClick={handleImport}
            disabled={!file || importing}
            icon={<FileUp size={16} />}
          >
            {importing ? 'Import en cours...' : 'Importer'}
          </Button>
        </div>
      }
    >
      <div className="space-y-4">
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
            Fichier CSV à importer
          </label>
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv"
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
              Fichier sélectionné: <span className="font-medium">{file.name}</span>
            </p>
          )}
        </div>

        {/* Résultat de l'import */}
        {result && (
          <div className="mt-4">
            {result.success ? (
              <AlertBanner type="success" onClose={() => setResult(null)}>
                <div>
                  <p className="font-semibold">{result.message}</p>
                  <p className="text-sm mt-1">La fenêtre va se fermer automatiquement...</p>
                </div>
              </AlertBanner>
            ) : (
              <AlertBanner type="error" onClose={() => setResult(null)}>
                <div>
                  <p className="font-semibold mb-2">
                    ❌ Erreurs détectées lors de l'import
                  </p>
                  {result.errors && result.errors.length > 0 && (
                    <div className="max-h-48 overflow-y-auto">
                      <ul className="text-sm space-y-1 list-disc list-inside">
                        {result.errors.map((error, index) => (
                          <li key={index}>{error}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {result.partialData && result.partialData.length > 0 && (
                    <p className="text-sm mt-2 text-yellow-700 bg-yellow-50 p-2 rounded">
                      ℹ️ {result.partialData.length} ligne(s) valide(s) trouvée(s), mais l'import est annulé en raison des erreurs ci-dessus.
                      Corrigez les erreurs et réessayez.
                    </p>
                  )}
                </div>
              </AlertBanner>
            )}
          </div>
        )}

        {/* Note de sécurité */}
        <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded">
          <strong>Note:</strong> L'import ajoutera les données au lieu de les remplacer.
          Vos données existantes seront préservées. Les doublons seront rejetés.
        </div>
      </div>
    </Modal>
  );
}
