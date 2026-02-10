/**
 * Composant CapexModal - Formulaire d'ajout/modification CAPEX
 */

import React, { useState, useEffect } from 'react';
import { Save } from 'lucide-react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Input, TextArea, Select } from '../common/Input';
import { PROJECT_STATUS, ENVELOPPES_CAPEX } from '../../constants/budgetConstants';

const EMPTY_FORM = {
  enveloppe: 'Autre',
  project: '',
  budgetTotal: '',
  depense: '',
  engagement: '',
  dateDebut: '',
  dateFin: '',
  status: 'Planifié',
  notes: ''
};

const STATUS_OPTIONS = Object.values(PROJECT_STATUS).map((status) => ({
  value: status,
  label: status
}));

const ENVELOPPE_OPTIONS = ENVELOPPES_CAPEX.map((env) => ({
  value: env,
  label: env
}));

export const CapexModal = ({ isOpen, onClose, onSave, editingProject }) => {
  const [formData, setFormData] = useState(EMPTY_FORM);

  useEffect(() => {
    if (editingProject) {
      setFormData(editingProject);
    } else {
      setFormData(EMPTY_FORM);
    }
  }, [editingProject, isOpen]);

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
      title={editingProject ? 'Modifier le projet' : 'Nouveau projet CAPEX'}
      size="md"
      footer={
        <>
          <Button variant="outline" onClick={onClose}>
            Annuler
          </Button>
          <Button variant="success" icon={<Save size={16} />} onClick={handleSubmit}>
            Enregistrer
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <Select
          label="Enveloppe budgétaire"
          required
          value={formData.enveloppe}
          onChange={(e) => handleChange('enveloppe', e.target.value)}
          options={ENVELOPPE_OPTIONS}
        />

        <Input
          label="Nom du projet"
          required
          value={formData.project}
          onChange={(e) => handleChange('project', e.target.value)}
          placeholder="Ex: Renouvellement Datacenter"
        />

        <div className="grid grid-cols-2 gap-4">
          <Select
            label="Statut"
            value={formData.status}
            onChange={(e) => handleChange('status', e.target.value)}
            options={STATUS_OPTIONS}
          />
          <Input
            label="Budget total (€)"
            type="number"
            required
            value={formData.budgetTotal}
            onChange={(e) => handleChange('budgetTotal', e.target.value)}
            placeholder="2000000"
            min="0"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Dépense (€)"
            type="number"
            value={formData.depense}
            onChange={(e) => handleChange('depense', e.target.value)}
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

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Date de début"
            type="date"
            value={formData.dateDebut}
            onChange={(e) => handleChange('dateDebut', e.target.value)}
          />
          <Input
            label="Date de fin"
            type="date"
            value={formData.dateFin}
            onChange={(e) => handleChange('dateFin', e.target.value)}
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
