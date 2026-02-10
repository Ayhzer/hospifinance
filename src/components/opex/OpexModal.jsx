/**
 * Composant OpexModal - Formulaire d'ajout/modification OPEX
 */

import React, { useState, useEffect } from 'react';
import { Save } from 'lucide-react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Input, TextArea } from '../common/Input';
import { OPEX_CATEGORIES } from '../../constants/budgetConstants';
import { useSettings } from '../../contexts/SettingsContext';

const EMPTY_FORM = {
  supplier: '',
  category: '',
  budgetAnnuel: '',
  depenseActuelle: '',
  engagement: '',
  notes: ''
};

export const OpexModal = ({ isOpen, onClose, onSave, editingSupplier }) => {
  const { settings } = useSettings();
  const [formData, setFormData] = useState(EMPTY_FORM);

  // Colonnes personnalisées pour OPEX
  const customColumns = settings.customColumns?.opex || [];

  useEffect(() => {
    if (editingSupplier) {
      setFormData(editingSupplier);
    } else {
      // Initialiser les champs custom à vide
      const emptyForm = { ...EMPTY_FORM };
      customColumns.forEach(col => {
        emptyForm[col.id] = '';
      });
      setFormData(emptyForm);
    }
  }, [editingSupplier, isOpen, customColumns]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    onSave(formData);
    setFormData(EMPTY_FORM);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={editingSupplier ? 'Modifier le fournisseur' : 'Nouveau fournisseur OPEX'}
      size="md"
      footer={
        <>
          <Button variant="outline" onClick={onClose}>
            Annuler
          </Button>
          <Button variant="primary" icon={<Save size={16} />} onClick={handleSubmit}>
            Enregistrer
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Fournisseur"
            required
            value={formData.supplier}
            onChange={(e) => handleChange('supplier', e.target.value)}
            placeholder="Ex: Oracle Health"
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Catégorie <span className="text-red-500">*</span>
            </label>
            <input
              list="categories"
              value={formData.category}
              onChange={(e) => handleChange('category', e.target.value)}
              placeholder="Ex: Logiciels"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <datalist id="categories">
              {OPEX_CATEGORIES.map((cat) => (
                <option key={cat} value={cat} />
              ))}
            </datalist>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <Input
            label="Budget annuel (€)"
            type="number"
            required
            value={formData.budgetAnnuel}
            onChange={(e) => handleChange('budgetAnnuel', e.target.value)}
            placeholder="500000"
            min="0"
          />
          <Input
            label="Dépense actuelle (€)"
            type="number"
            value={formData.depenseActuelle}
            onChange={(e) => handleChange('depenseActuelle', e.target.value)}
            placeholder="0"
            min="0"
          />
          <Input
            label="Engagement (€)"
            type="number"
            value={formData.engagement}
            onChange={(e) => handleChange('engagement', e.target.value)}
            placeholder="0"
            min="0"
          />
        </div>

        <TextArea
          label="Notes"
          value={formData.notes}
          onChange={(e) => handleChange('notes', e.target.value)}
          placeholder="Informations complémentaires..."
          rows={3}
        />

        {/* Colonnes personnalisées */}
        {customColumns.length > 0 && (
          <div className="border-t pt-4 space-y-4">
            <h4 className="text-sm font-semibold text-gray-700">Champs personnalisés</h4>
            <div className="grid grid-cols-2 gap-4">
              {customColumns.map((column) => (
                <div key={column.id}>
                  {column.type === 'text' && (
                    <Input
                      label={column.name}
                      required={column.required}
                      value={formData[column.id] || ''}
                      onChange={(e) => handleChange(column.id, e.target.value)}
                      placeholder={`Entrez ${column.name.toLowerCase()}`}
                    />
                  )}
                  {column.type === 'number' && (
                    <Input
                      label={column.name}
                      type="number"
                      required={column.required}
                      value={formData[column.id] || ''}
                      onChange={(e) => handleChange(column.id, e.target.value)}
                      placeholder="0"
                    />
                  )}
                  {column.type === 'date' && (
                    <Input
                      label={column.name}
                      type="date"
                      required={column.required}
                      value={formData[column.id] || ''}
                      onChange={(e) => handleChange(column.id, e.target.value)}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};
