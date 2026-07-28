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
- Images du hero adaptées au mobile (768 px) et au desktop (jusqu'à 1920 px).
- Ajout de `srcSet`, `sizes`, dimensions intrinsèques, lazy loading et décodage
  asynchrone au composant `Media`.
- Propagation des métadonnées d'image jusqu'au panier afin de conserver la même
  ressource entre carte, fiche et panier.
- Réutilisation du coffret emballé sur les emplacements cohérents du catalogue.
- Ajout des deux nouvelles photos florales à la galerie.
- Création d'un visuel Open Graph 1200 × 630 et préchargement responsive de la
  première image du hero.

Les résultats détaillés des contrôles finaux seront ajoutés après le lint et le
build de production.
