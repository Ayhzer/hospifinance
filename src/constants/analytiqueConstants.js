export const FAMILLE_ANALYTIQUE = {
  INFRASTRUCTURE:  'Infrastructures',
  APPLICATIONS:    'Applications',
  SUPPORT_USERS:   'Support et services utilisateurs',
  CYBERSECURITE:   'Cybersécurité',
  DATA_PILOTAGE:   'Data et pilotage',
  PRESTATIONS:     'Prestations externes récurrentes',
  HORS_PERIMETRE:  'Hors périmètre DSI',
};

// Mapping compte ordonnateur SAGE → famille analytique DSITM
export const COMPTE_TO_FAMILLE = {
  'H60625100': FAMILLE_ANALYTIQUE.SUPPORT_USERS,
  'H60625211': FAMILLE_ANALYTIQUE.HORS_PERIMETRE,
  'H61325100': FAMILLE_ANALYTIQUE.INFRASTRUCTURE,
  'H61525400': FAMILLE_ANALYTIQUE.APPLICATIONS,
  'H61526100': FAMILLE_ANALYTIQUE.APPLICATIONS,
  'H61841500': FAMILLE_ANALYTIQUE.PRESTATIONS,
  'H62281000': FAMILLE_ANALYTIQUE.PRESTATIONS,
  'I62281000': FAMILLE_ANALYTIQUE.PRESTATIONS,
  'H62610000': FAMILLE_ANALYTIQUE.INFRASTRUCTURE,
  'H62630000': FAMILLE_ANALYTIQUE.HORS_PERIMETRE,
  'H62631000': FAMILLE_ANALYTIQUE.INFRASTRUCTURE,
  'H62650000': FAMILLE_ANALYTIQUE.INFRASTRUCTURE,
  'H62881100': FAMILLE_ANALYTIQUE.APPLICATIONS,
  'H62882000': FAMILLE_ANALYTIQUE.HORS_PERIMETRE,
  'H65100000': FAMILLE_ANALYTIQUE.APPLICATIONS,
};

// Budget EPRD 2026 par compte (source : Budget_Global_DSITM_HFAR_2026.xlsx)
export const BUDGET_EPRD_2026 = {
  'H61526100': 1200000,
  'H65100000': 450000,
  'H62630000': 250000,
  'H62631000': 250000,
  'H61325100': 300000,
  'H62610000': 500000,
  'H62881100': 200000,
  'H62281000': 210000,
  'H61841500': 150000,
  'H62882000': 140000,
  'H62650000': 150000,
};

export const BUDGET_EPRD_TOTAL_OPEX_SI = 3800000; // somme réelle eprd.json (11 comptes vérifiés)

// Données EPRD statiques (miroir de eprd.json) — utilisées comme fallback si l'API ne répond pas
export const EPRD_STATIC = [
  { compteOrdonnateur: 'H61526100', libelleCompte: 'MAINT INFORM DIVERSES',              familleAnalytique: 'Applications',                    budgetEPRD: 1200000, annee: 2026 },
  { compteOrdonnateur: 'H65100000', libelleCompte: 'REDEVANCES, BREVETS, LICENCES',      familleAnalytique: 'Applications',                    budgetEPRD: 450000,  annee: 2026 },
  { compteOrdonnateur: 'H62630000', libelleCompte: 'AFFRANCHISSEMENTS',                  familleAnalytique: 'Hors périmètre DSI',               budgetEPRD: 250000,  annee: 2026 },
  { compteOrdonnateur: 'H62631000', libelleCompte: 'TELEPHONIE DISTANCE / CALL CENTER',  familleAnalytique: 'Infrastructures',                  budgetEPRD: 250000,  annee: 2026 },
  { compteOrdonnateur: 'H61325100', libelleCompte: 'LOC EQUIP MAT INFO',                 familleAnalytique: 'Infrastructures',                  budgetEPRD: 300000,  annee: 2026 },
  { compteOrdonnateur: 'H62610000', libelleCompte: 'LIAISONS INFO OU SPECIALISEES',      familleAnalytique: 'Infrastructures',                  budgetEPRD: 500000,  annee: 2026 },
  { compteOrdonnateur: 'H62881100', libelleCompte: 'ABONNEMENT RDV EN LIGNE',            familleAnalytique: 'Applications',                    budgetEPRD: 200000,  annee: 2026 },
  { compteOrdonnateur: 'H62281000', libelleCompte: 'HON INFORMATIQUE',                   familleAnalytique: 'Prestations externes récurrentes', budgetEPRD: 210000,  annee: 2026 },
  { compteOrdonnateur: 'H61841500', libelleCompte: 'COTISATIONS DSI',                    familleAnalytique: 'Prestations externes récurrentes', budgetEPRD: 150000,  annee: 2026 },
  { compteOrdonnateur: 'H62882000', libelleCompte: "ARCHIVAGES A L'EXT",                 familleAnalytique: 'Hors périmètre DSI',               budgetEPRD: 140000,  annee: 2026 },
  { compteOrdonnateur: 'H62650000', libelleCompte: 'TELEPHONE (CONSOMMATION)',            familleAnalytique: 'Infrastructures',                  budgetEPRD: 150000,  annee: 2026 },
];

// Nombre de mois réalisés à date — mettre à jour à chaque extraction
export const NB_MOIS_REALISES = 5; // Jan–Mai 2026

export const SEUILS_ALERTE_DSI = {
  CRITIQUE:   85,
  SURVEILLER: 50,
  NORMAL:      0,
};
