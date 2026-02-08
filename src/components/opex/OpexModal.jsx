/**
 * Composant OpexModal - Formulaire d'ajout/modification OPEX
 */

import React, { useState, useEffect } from 'react';
import { Save } from 'lucide-react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Input, TextArea } from '../common/Input';
import { OPEX_CATEGORIES } from '../../constants/budgetConstants';

const EMPTY_FORM = {
  supplier: '',
  category: '',
  budgetAnnuel: '',
  depenseActuelle: '',
  engagement: '',
  notes: ''
};

export const OpexModal = ({ isOpen, onClose, onSave, editingSupplier }) => {
  const [formData, setFormData] = useState(EMPTY_FORM);

  useEffect(() => {
    if (editingSupplier) {
      setFormData(editingSupplier);
    } else {
      setFormData(EMPTY_FORM);
    }
  }, [editingSupplier, isOpen]);

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
          <Button variant="primary" icon={Save} onClick={handleSubmit}>
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
      </div>
    </Modal>
  );
};
