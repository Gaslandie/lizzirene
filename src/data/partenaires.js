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
// AJOUTER UN LOGO
//
// Format : SVG de préférence (net à toute taille, quelques Ko). Sinon PNG
// avec fond transparent — un fond blanc formerait un rectangle visible sur
// la vignette claire.
//
// Dimensions : le logo s'affiche sur 64 px de haut au maximum. Prévoir le
// double pour les écrans à forte densité, soit :
//   · logo en bandeau (3:1)  → environ 400 × 130 px
//   · logo carré ou écusson  → environ 256 × 256 px
// Inutile de fournir plus grand : au-delà, c'est du poids sans gain visible.
//
// Poids : un SVG passe directement dans public/partenaires/. Un PNG lourd
// doit passer par le pipeline (scripts/optimize-images.mjs) et être
// référencé depuis public/optimized/ — l'emblème russe fourni en
// 1280 × 1280 pesait 953 Ko, il en fait 41 après optimisation.
//
// Étapes :
//   1. SVG → public/partenaires/. PNG → image-sources/partenaires/ puis
//      déclaré dans scripts/optimize-images.mjs ;
//   2. ajouter `logo: '<chemin>'` à l'entrée concernée ;
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
    logo: 'optimized/partenaire-ambassade-russie-256.webp',
  },
  {
    id: 'ambassade-eau',
    nom: 'Ambassade des Émirats arabes unis',
    logo: 'optimized/partenaire-ambassade-emirats-arabes-unis-400.webp',
  },
  {
    id: 'prima',
    nom: 'Prima Center',
    logo: 'partenaires/prima-center.webp',
  },
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
