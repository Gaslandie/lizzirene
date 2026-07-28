# Optimisation et réutilisation des images

## Contexte

De nouvelles photos ont été déposées dans `public/`. L'objectif est d'optimiser
toutes les images réellement affichées par le site et de réutiliser une même
ressource lorsque le même visuel apparaît à plusieurs endroits.

## Avis de Codex

La démarche professionnelle retenue est la suivante :

1. Conserver les originaux comme sources de qualité dans `image-sources/`, hors
   du dossier public, et ne jamais les charger directement dans l'interface.
2. Générer des WebP aux dimensions adaptées : une petite et une grande variante
   pour les cartes, la galerie et le hero.
3. Centraliser chaque visuel dans `src/config.js`, avec son `src`, son `srcSet`,
   ses dimensions et son texte alternatif. Les produits ne dupliquent donc pas
   les chemins de fichiers.
4. Laisser le navigateur choisir la variante appropriée avec `srcSet` et `sizes`.
   Les images ordinaires sont chargées paresseusement ; la photo principale d'une
   fiche et la première image du hero restent prioritaires.
5. Réutiliser exactement la même URL pour une photo répétée. Cela évite les copies
   et permet au cache HTTP de ne télécharger la ressource qu'une seule fois.
6. Créer une image sociale horizontale dédiée, au lieu d'envoyer aux plateformes
   une photo produit verticale.
7. Automatiser la génération avant chaque build afin que l'optimisation reste
   reproductible quand de nouvelles photos seront ajoutées.

Les nouvelles images sont affectées avec prudence :

- `paquet-emballé.jpeg` illustre la box romantique, l'emballage premium et la
  galerie ; le même fichier optimisé est réutilisé partout ;
- `fleure-fraiches.jpg` et `deco-floral.jpg` enrichissent la galerie, sans être
  attribuées à un produit tarifé précis tant que la cliente ne l'a pas confirmé ;
- la capture `iPhone-13-PRO-localhost.png` reste un document de contrôle et non
  une image du site ;
- le favicon SVG reste inchangé, car il est déjà vectoriel et très léger.

## Avis de Claude Code

À compléter si une seconde revue est souhaitée.

## Décision retenue

Utiliser WebP et deux largeurs pertinentes par famille de visuels, centraliser
les métadonnées dans `PHOTOS`, et exécuter automatiquement le script d'optimisation
avant le build. Les fichiers originaux sont déplacés dans `image-sources/` : ils
restent disponibles pour les futures réexportations sans alourdir le site publié.

## Implémentation et vérifications

- Ajout de `scripts/optimize-images.mjs` et de la commande
  `npm run optimize:images`.
- Ajout de Sharp comme dépendance de développement.
- Génération des variantes dans `public/optimized/`.
- Conservation des originaux dans `image-sources/` et de la capture de contrôle
  dans `captures/`, donc hors du déploiement GitHub Pages.
- Images du hero recadrées en portrait pour le mobile (jusqu'à 900 × 1200 px)
  et redimensionnées jusqu'à 1920 px pour le desktop.
- Ajout de `srcSet`, `sizes`, dimensions intrinsèques, lazy loading et décodage
  asynchrone au composant `Media`.
- Propagation des métadonnées d'image jusqu'au panier afin de conserver la même
  ressource entre carte, fiche et panier.
- Réutilisation du coffret emballé sur les emplacements cohérents du catalogue.
- Ajout des deux nouvelles photos florales à la galerie.
- Création d'un visuel Open Graph 1200 × 630. Les fonds du hero utilisent un
  `<picture>` responsive : la première image est prioritaire et les suivantes
  ne sont montées qu'après le chargement initial.

Résultats des contrôles :

- `npm run optimize:images` : 9,02 Mo de sources transformés en 2,09 Mo pour
  l'ensemble des variantes WebP et du JPEG social ;
- première image du hero : environ 4 Mo à l'origine, 191 Ko sur desktop et
  104 Ko sur mobile ;
- `dist/` : environ 2,5 Mo, contre environ 12 Mo lorsque les originaux étaient
  encore copiés dans le site publié ;
- aucune référence aux anciens JPEG ni à la capture de contrôle dans `dist/` ;
- `git diff --check` : OK ;
- `npm run lint` : OK, avec le seul avertissement Fast Refresh historique de
  `CartContext.jsx` ;
- `npm run build` : OK ;
- contrôle HTTP local : ressources WebP servies en 200 avec le bon type MIME et
  un contenu identique aux fichiers générés ;
- contrôle visuel Chrome headless : hero validé à 1440 px et à 390 px, logo et
  recadrage mobile corrects ; fiche produit contrôlée dans le DOM, image chargée
  depuis le `srcSet` optimisé avec ses dimensions naturelles.
