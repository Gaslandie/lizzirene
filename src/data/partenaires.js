// Partenaires de la boutique.
//
// ⚠ AUCUN NOM N'EST INVENTÉ ICI : annoncer un partenariat qui n'existe pas
// engagerait la responsabilité de la cliente vis-à-vis de l'entreprise citée.
// Tant que la liste est vide, la section affiche des emplacements neutres.
//
// Pour ajouter un vrai partenaire :
//   1. déposer son logo dans public/partenaires/ (PNG ou SVG, fond
//      transparent, hauteur utile ~120 px) ;
//   2. ajouter une entrée ci-dessous ;
//   3. ne publier qu'avec l'accord du partenaire — un logo est une marque
//      déposée, son usage doit être autorisé.
//
// Exemple d'entrée :
//   {
//     id: 'nom-partenaire',
//     nom: 'Nom du partenaire',
//     logo: 'partenaires/nom-partenaire.png',
//     type: 'Hôtel',        // facultatif : Hôtel, Agence, Restaurant…
//     url: 'https://…',     // facultatif : site du partenaire
//   }
export const PARTENAIRES = []

// Nombre d'emplacements affichés tant qu'aucun partenaire n'est renseigné.
export const EMPLACEMENTS_VIDES = 6
