// Références de la boutique — organisations qui lui ont fait confiance.
// Liste communiquée par la cliente le 2026-07-29.
//
// ⚠ RÈGLE : on ne cite que des références réelles, confirmées par la cliente.
// Aucun nom n'est ajouté par déduction ou pour « remplir » la grille.
//
// Les logos arriveront dans un second temps. Tant qu'une entrée n'a pas de
// champ `logo`, la vignette affiche simplement le nom en toutes lettres —
// c'est volontaire, et c'est aussi le choix le plus sûr : afficher l'emblème
// d'une ambassade suppose une autorisation écrite, citer son nom comme
// référence commerciale ne l'exige pas de la même manière.
//
// Pour ajouter un logo plus tard :
//   1. déposer le fichier dans public/partenaires/ (PNG ou SVG, fond
//      transparent, hauteur utile ~120 px) ;
//   2. ajouter `logo: 'partenaires/<fichier>'` à l'entrée concernée ;
//   3. s'assurer que l'organisation a autorisé cet usage.
export const PARTENAIRES = [
  {
    id: 'ambassade-france',
    nom: 'Ambassade de France',
    logo: 'partenaires/ambassade-france.svg',
  },
  {
    id: 'ambassade-russie',
    nom: 'Ambassade de Russie',
    logo: 'partenaires/ambassade-russie.png',
  },
  // Intitulé exact à confirmer avec la cliente.
  { id: 'ambassade-eau', nom: 'Ambassade des Émirats arabes unis' },
  { id: 'prima', nom: 'Prima' },
  // « Guinée Fashion » lu comme un seul nom — à confirmer.
  { id: 'guinee-fashion', nom: 'Guinée Fashion' },
  // « Comisgui » = Comité Miss Guinée, confirmé par la cliente.
  { id: 'comite-miss-guinee', nom: 'Comité Miss Guinée' },
]

// Rungis Paris a été retiré de cette liste : c'est le marché de gros où la
// cliente s'approvisionne, donc un fournisseur et non une référence cliente.
// À valoriser plus tard dans une rubrique dédiée si elle le souhaite.

// Référence mise en avant sous la grille : une photo vaut mieux qu'un logo
// quand on peut montrer le travail lui-même.
export const REFERENCE_VEDETTE = {
  partenaireId: 'comite-miss-guinee',
  titre: 'Élection Miss Guinée',
  texte:
    'Les bouquets remis aux lauréates de l’élection Miss Guinée, réalisés par Lizzirene Déco.',
}

// Nombre d'emplacements affichés tant qu'aucun partenaire n'est renseigné.
export const EMPLACEMENTS_VIDES = 6
