# Worklog

## 2026-07-28 — Mise en place du mode de collaboration IA

- Création du dossier `discussionsIA/`.
- Chaque nouveau thème de travail aura son propre fichier de discussion.
- Codex y écrira son analyse et sa proposition.
- Claude Code pourra y indiquer son accord, ses corrections ou ses améliorations.
- Codex relira la discussion consolidée avant de passer à l’implémentation.
- Après l’implémentation, le résultat et les vérifications effectuées seront consignés ici.

## 2026-07-28 — Améliorations site web

- Création de la discussion `discussionsIA/2026-07-28-ameliorations-site-web.md`.
- Avis Codex ajouté : mise à jour des familles produits, horaires et phrase principale du site.
- Précision ajoutée : créer l’onglet `Nos Produits`, retirer `Galerie` et `Événements` de la barre de navigation.
- Précision ajoutée : `Nos Produits` doit afficher les familles en sous-menu au survol sur desktop et au clic sur mobile.
- Implémentation effectuée après lecture de l’avis de Claude Code : sous-menu `Nos Produits`, filtres par URL, horaires, H1 hero, catégories produits et correction `caches-postes`.
- Vérifications : `npm run lint`, `npm run build`, requête locale HTTP 200 sur `?categorie=vases#boutique`, contrôles statiques des URLs/accessibilité/catégories.

## 2026-07-28 — Page Nos Produits et fiches produits

- Transformation du catalogue en page dédiée `/produits` ; retrait de la grille complète de l'accueil.
- Ajout des fiches `/produits/<id>` avec fil d'Ariane, prix ou devis, panier / WhatsApp et produits apparentés.
- Navigation réordonnée : `Accueil` en premier, puis `Nos Produits` ; suppression de `Univers` dans la navbar.
- Regroupement de `Fleurs naturelles` et `Fleurs artificielles` sous une seule entrée `Fleurs`, avec deux groupes distincts dans le catalogue.
- Mise à jour du hero, du footer et du bouton `Commander` vers les nouvelles URL.
- Compatibilité conservée avec les anciennes URL `?categorie=...#boutique`.
- Ajout des états page / produit introuvable et des métadonnées dynamiques.
- Vérifications : lint, build, routes HTTP 200, DOM Chrome headless, ancienne URL, 404 produit, captures desktop 1440 px et mobile 390 px.
- Correction de l'alignement mobile de `Nos Produits` d'après la capture iPhone fournie : libellé centré, chevron conservé à droite ; lint et build validés.

## 2026-07-28 — Images de fond du hero

- Création de la discussion `discussionsIA/2026-07-28-hero-images.md`.
- Remplacement du visuel en pot à droite par les trois images initialement déposées dans `public/hero-images`, désormais archivées dans `image-sources/hero-images`.
- Première vue : `hero-image3.jpg`, puis changement automatique entre les trois images toutes les 5 secondes.
- Ajout de commandes de sélection et pause, d'un voile de lisibilité et de la prise en charge de `prefers-reduced-motion`.
- Vérifications : diff, lint, build et présence des trois ressources dans la production.
- Le point d'optimisation avant production est maintenant traité par les variantes
  responsives générées automatiquement.

## 2026-07-28 — Optimisation et réutilisation des images

- Création de la discussion `discussionsIA/2026-07-28-optimisation-images.md`.
- Ajout d'un pipeline Sharp reproductible pour générer les variantes WebP.
- Centralisation des photos responsives dans `src/config.js` et réutilisation des
  mêmes URL entre catalogue, fiches, panier et galerie.
- Intégration prudente des nouvelles photos : coffret emballé sur les offres
  correspondantes, photos florales dans la galerie.
- Ajout d'une image sociale 1200 × 630 ; passage du hero à des `<picture>`
  responsives avec priorité à la première image et chargement différé des autres.
- Déplacement conservatoire des originaux dans `image-sources/` et de la capture
  iPhone dans `captures/`, afin qu'ils ne soient pas copiés dans le site publié.
- Résultat : 9,02 Mo de sources donnent 2,09 Mo pour toutes les variantes ; le
  build publié passe d'environ 12 Mo à 2,5 Mo et l'image initiale du hero tombe
  à 191 Ko sur desktop / 104 Ko sur mobile.
- Vérifications : `git diff --check`, lint (seul avertissement historique de
  `CartContext.jsx`), build de production, types MIME et empreintes HTTP, absence
  des anciens JPEG dans `dist`, captures Chrome à 1440 px et 390 px.

## 2026-07-29 — Domaine et déploiement continu

- Création de la discussion `discussionsIA/2026-07-29-domaine-et-deploiement-continu.md`.
- Audit du dépôt, du workflow GitHub Pages actuel et des anciennes URL `/lizzirene/`.
- Avis Codex ajouté : conserver GitHub comme source et déclencheur, et retenir
  Bluehost comme hébergement public confirmé par l'utilisateur, en raison aussi de
  la restriction de GitHub Pages pour les sites commerciaux.
- Plan DNS, HTTPS, déploiement automatique, SEO, routes React et vérifications de
  production documenté à partir des documentations officielles.
- En attente de l'avis de Claude Code sur la méthode Bluehost exacte ;
  aucune configuration externe ni implémentation n'a encore été effectuée.

## 2026-07-29 — Correction du nom de marque

- Harmonisation du nom visible en `Lizzirene Déco`, avec accent sur `Déco`.
- Conservation volontaire des identifiants techniques sans accent : domaine,
  email, handles sociaux, noms de fichiers et nom de package.
