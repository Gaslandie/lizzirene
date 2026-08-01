// Entrée du site par l'intention plutôt que par le produit : le visiteur sait
// rarement s'il lui faut « des fleurs naturelles » ou « une box cadeau », mais
// il sait toujours pour quelle occasion il commande.
//
// Chaque occasion mène soit à une famille du catalogue, soit à un thème de
// services — rien de neuf à créer, seulement un autre chemin vers l'existant.
//
// `periode` reste volontairement textuelle. Les fêtes musulmanes suivent le
// calendrier lunaire et se décalent chaque année : afficher une date fixe
// serait faux au bout d'un an, et personne ne penserait à la corriger.
export const OCCASIONS = [
  {
    id: 'saint-valentin',
    label: 'Saint-Valentin',
    periode: '14 février',
    texte: 'Roses rouges, peluches et coffrets à offrir.',
    icon: 'heart',
    destination: { type: 'categorie', id: 'fleurs' },
  },
  {
    id: 'journee-des-femmes',
    label: 'Journée des femmes',
    periode: '8 mars',
    texte: 'Bouquets et attentions pour celles qui comptent.',
    icon: 'sparkles',
    destination: { type: 'categorie', id: 'fleurs' },
  },
  {
    id: 'fete-des-meres',
    label: 'Fête des mères',
    periode: 'au mois de mai',
    texte: 'Une composition rien que pour elle, livrée chez elle.',
    icon: 'bouquet',
    destination: { type: 'categorie', id: 'fleurs' },
  },
  {
    id: 'ramadan-tabaski',
    label: 'Ramadan & Tabaski',
    periode: 'selon le calendrier lunaire',
    texte: 'Paniers garnis et coffrets à partager en famille.',
    icon: 'gift',
    destination: { type: 'categorie', id: 'box-cadeaux' },
  },
  {
    id: 'mariages',
    label: 'Mariages',
    periode: 'toute l’année',
    texte: 'Bouquet de la mariée, décor de salle et centres de table.',
    icon: 'gem',
    destination: { type: 'theme', id: 'evenements' },
  },
  {
    id: 'anniversaires',
    label: 'Anniversaires',
    periode: 'toute l’année',
    texte: 'Bouquets et mises en scène qui marquent la journée.',
    icon: 'cake',
    destination: { type: 'theme', id: 'evenements' },
  },
  {
    id: 'naissances',
    label: 'Naissances & baptêmes',
    periode: 'toute l’année',
    texte: 'Douceurs et fleurs pour féliciter les jeunes parents.',
    icon: 'groupe',
    destination: { type: 'theme', id: 'creations' },
  },
  {
    id: 'remises-de-diplome',
    label: 'Remises de diplôme',
    periode: 'en fin d’année scolaire',
    texte: 'Le bouquet de félicitations qui restera sur les photos.',
    icon: 'diplome',
    destination: { type: 'theme', id: 'creations' },
  },
  {
    id: 'fetes-de-fin-dannee',
    label: 'Fêtes de fin d’année',
    periode: 'décembre & janvier',
    texte: 'Décor de saison, coffrets et cadeaux d’entreprise.',
    icon: 'etoile',
    destination: { type: 'categorie', id: 'box-cadeaux' },
  },
  // Toujours en dernier, et jamais mis en avant : on ne propose pas une gerbe
  // de deuil au milieu des anniversaires.
  {
    id: 'hommages',
    label: 'Hommages & condoléances',
    periode: 'préparé en priorité',
    texte: 'Couronnes et gerbes, préparées avec discrétion.',
    icon: 'flower',
    destination: { type: 'theme', id: 'hommages' },
  },
]
