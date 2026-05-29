import React, { useState } from 'react';
import { Users, Key, GitBranch, Map, PlayCircle, Loader2 } from 'lucide-react';
import ReferentielFournisseurs from './ReferentielFournisseurs';
import ReglesMultiNature from './ReglesMultiNature';
import ReglesMosCles from './ReglesMosCles';
import MappingComptes from './MappingComptes';
import PreviewReclassement from './PreviewReclassement';

const TABS = [
  { id: 'referentiel',  label: 'Référentiel fournisseurs', icon: Users,     desc: 'Niveau 1 — Prioritaire' },
  { id: 'multinature',  label: 'Règles contextuelles',     icon: GitBranch, desc: 'Niveau 2' },
  { id: 'moscles',      label: 'Mots-clés',                icon: Key,       desc: 'Niveau 3' },
  { id: 'mapping',      label: 'Mapping comptes',           icon: Map,       desc: 'Niveau 4 — Fallback' },
  { id: 'preview',      label: 'Simuler & appliquer',       icon: PlayCircle, desc: 'Test & application' },
];

export default function ReclassementPage({
  moteur,
  loading,
  error,
  suppliers,
  onAddFournisseur,
  onUpdateFournisseur,
  onDeleteFournisseur,
  onAddRegleMultiNature,
  onUpdateRegleMultiNature,
  onDeleteRegleMultiNature,
  onReorderReglesMultiNature,
  onAddRegleMosCles,
  onUpdateRegleMosCles,
  onDeleteRegleMosCles,
  onReorderReglesMosCles,
  onUpdateMappingCompte,
  onApplyReclassement,
}) {
  const [activeTab, setActiveTab] = useState('referentiel');

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16 text-gray-400">
        <Loader2 size={20} className="animate-spin mr-2" />
        Chargement du moteur de reclassement…
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 text-sm">{error}</div>
    );
  }

  return (
    <div className="space-y-4">
      {/* En-tête */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <h2 className="text-lg font-bold text-gray-800">Moteur de reclassement analytique</h2>
        <p className="text-xs text-gray-500 mt-1">
          Pipeline à 4 niveaux : Référentiel fournisseurs → Règles contextuelles → Mots-clés → Mapping compte ordonnateur.
          La première correspondance trouvée est utilisée.
        </p>
        <div className="flex flex-wrap gap-3 mt-3">
          <span className="text-xs bg-green-50 border border-green-200 text-green-700 px-2 py-1 rounded">
            📋 {moteur.referentielFournisseurs?.length || 0} fournisseur{(moteur.referentielFournisseurs?.length || 0) > 1 ? 's' : ''}
          </span>
          <span className="text-xs bg-blue-50 border border-blue-200 text-blue-700 px-2 py-1 rounded">
            ⚙️ {moteur.reglesMultiNature?.length || 0} règle{(moteur.reglesMultiNature?.length || 0) > 1 ? 's' : ''} contextuelles
          </span>
          <span className="text-xs bg-yellow-50 border border-yellow-200 text-yellow-700 px-2 py-1 rounded">
            🔑 {moteur.reglesMosCles?.length || 0} règle{(moteur.reglesMosCles?.length || 0) > 1 ? 's' : ''} mots-clés
          </span>
          <span className="text-xs bg-gray-50 border border-gray-200 text-gray-600 px-2 py-1 rounded">
            🗂️ {moteur.mappingComptes?.length || 0} compte{(moteur.mappingComptes?.length || 0) > 1 ? 's' : ''} mappés
          </span>
        </div>
      </div>

      {/* Navigation secondaire */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex overflow-x-auto -mb-px">
            {TABS.map(tab => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-1.5 px-3 sm:px-4 py-3 text-xs font-medium border-b-2 flex-shrink-0 whitespace-nowrap transition-colors ${
                    isActive ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon size={13} />
                  <span>{tab.label}</span>
                  <span className={`hidden sm:inline text-xs opacity-60 ${isActive ? 'text-blue-500' : 'text-gray-400'}`}>— {tab.desc}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Contenu */}
        <div className="p-4 sm:p-6">
          {activeTab === 'referentiel' && (
            <ReferentielFournisseurs
              referentiel={moteur.referentielFournisseurs || []}
              nomenclature={moteur.nomenclature || []}
              onAdd={onAddFournisseur}
              onUpdate={onUpdateFournisseur}
              onDelete={onDeleteFournisseur}
            />
          )}
          {activeTab === 'multinature' && (
            <ReglesMultiNature
              regles={moteur.reglesMultiNature || []}
              nomenclature={moteur.nomenclature || []}
              onAdd={onAddRegleMultiNature}
              onUpdate={onUpdateRegleMultiNature}
              onDelete={onDeleteRegleMultiNature}
              onReorder={onReorderReglesMultiNature}
            />
          )}
          {activeTab === 'moscles' && (
            <ReglesMosCles
              regles={moteur.reglesMosCles || []}
              nomenclature={moteur.nomenclature || []}
              onAdd={onAddRegleMosCles}
              onUpdate={onUpdateRegleMosCles}
              onDelete={onDeleteRegleMosCles}
              onReorder={onReorderReglesMosCles}
            />
          )}
          {activeTab === 'mapping' && (
            <MappingComptes
              mappingComptes={moteur.mappingComptes || []}
              onUpdate={onUpdateMappingCompte}
            />
          )}
          {activeTab === 'preview' && (
            <PreviewReclassement
              moteur={moteur}
              suppliers={suppliers}
              onApply={onApplyReclassement}
            />
          )}
        </div>
      </div>
    </div>
  );
}
