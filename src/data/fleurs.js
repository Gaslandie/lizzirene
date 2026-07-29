// Variétés présentées dans le catalogue imprimé de Lizzirene Déco.
// Ce sont des références de composition soumises aux arrivages, pas des
// produits achetables à l'unité ni des indicateurs de stock en temps réel.
export const GROUPES_VARIETES_FLEURS = [
  {
    id: 'sprays',
    label: 'Sprays',
    variantes: ['Blanc', 'Rouge', 'Orange'],
  },
  {
    id: 'chrysanthemes',
    label: 'Chrysanthèmes',
    variantes: ['Bicolore', 'Violet', 'Blanc'],
  },
  {
    id: 'lys-oriental',
    label: 'Lys oriental',
    variantes: ['Blanc', 'Rose'],
  },
  {
    id: 'roses',
    label: 'Roses',
    variantes: ['Orange', 'Rouge', 'Jaune', 'Blanche', 'Rose'],
  },
  {
    id: 'lys-asiatiques',
    label: 'Lys asiatiques',
    variantes: ['Blanc', 'Orange', 'Rouge'],
  },
  {
    id: 'hortensias',
    label: 'Hortensias',
    variantes: ['Fuchsia', 'Blanc', 'Vert'],
  },
  {
    id: 'autres-fleurs',
    label: 'Autres types de fleurs',
    variantes: ['Limonium', 'Delphinium', 'Wax Rose'],
  },
  {
    id: 'oeillets',
    label: 'Œillets',
    variantes: ['Jaune', 'Blanc', 'Vert'],
  },
  {
    id: 'gypsophiles',
    label: 'Gypsophiles',
    variantes: ['Blanc', 'Rose', 'Orange'],
  },
  {
    id: 'feuillages',
    label: 'Feuillages',
    variantes: ['Solidago', 'Fougère', 'Ruscus'],
  },
]

export const NOMBRE_VARIETES_FLEURS = GROUPES_VARIETES_FLEURS.reduce(
  (total, groupe) => total + groupe.variantes.length,
  0,
)
