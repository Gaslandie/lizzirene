# Lizzirene Déco — site vitrine & boutique

Site de **Lizzirene Déco by Madame Sandouno Irene Mayer** — fleuriste et décoration d'intérieur à Kipé, Conakry (Guinée).
_« Des fleurs pour chaque émotion »_

Bouquets personnalisés, compositions florales, terrariums faits main, box cadeaux, plantes
et décoration florale d'événements. Livraison partout à Conakry, **paiement à la livraison**.

Le front propose plusieurs pages avec des URL partageables : accueil, catalogue,
fiches produits et contact.

## Stack

| Étape | Technologie |
| --- | --- |
| Front-end (actuel) | React 19 + Vite, CSS natif (variables) |
| Back-end (à venir) | NestJS |
| Base de données (à venir) | MongoDB |

## Démarrer

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # génère dist/
npm run preview  # prévisualise le build
```

## Structure

```
image-sources/          originaux conservés hors du site publié
public/optimized/       variantes légères générées pour le site
public/robots.txt       ouvert à tous les moteurs, pointe vers le sitemap
public/sitemap.xml      généré avant chaque build depuis le catalogue réel
src/
  config.js             coordonnées, photos, zones de livraison, format des prix
  data/products.js      catalogue (nom, catégorie, prix, photo)
  data/services.js      prestations, regroupées par thème
  data/occasions.js     entrées par occasion (Saint-Valentin, Tabaski, mariages…)
  data/faq.js           source unique des questions fréquentes
  context/CartContext   panier (état + persistance navigateur)
  components/           sections et composants réutilisables
  pages/                accueil, catalogue, fiche produit et contact
  hooks/useRouter.js    navigation entre les pages sans dépendance externe
  utils/navigation.js  construction centralisée des URL internes
  utils/donneesStructurees.js  balisage schema.org injecté à chaque page
  index.css             toute la mise en forme (palette en haut du fichier)
```

### Points d'entrée pour modifier le site

- **Couleurs / typographie** → variables en haut de `src/index.css`
- **Téléphone, WhatsApp, email, adresse** → `src/config.js`
- **Produits et prix** → `src/data/products.js` (`price: null` affiche « Sur devis »)
- **Photos** → déposer les sources dans `image-sources/`, les ajouter au manifeste de
  `scripts/optimize-images.mjs`, puis référencer leurs variantes dans `PHOTOS`
  (`src/config.js`)
- **Questions fréquentes** → `src/data/faq.js` (accueil, page contact et balisage
  `FAQPage` lisent la même liste)
- **Occasions** → `src/data/occasions.js`
- **Adresse publique du site** → `SITE` dans `src/utils/donneesStructurees.js`,
  `SITE` dans `scripts/generer-sitemap.mjs` et `base` dans `vite.config.js` :
  ces trois valeurs changent ensemble le jour du nom de domaine définitif

### Référencement

Chaque page injecte un graphe [schema.org](https://schema.org) unique
(`src/utils/donneesStructurees.js`) : la boutique (`Florist` / `LocalBusiness`
avec adresse, horaires réels et zone desservie), le site, les questions
fréquentes sur l'accueil et le contact, puis la fiche `Product` et le fil
d'Ariane sur les pages produits. Un article « sur devis » ne publie aucun
montant ; un prix « à partir de » est déclaré comme minimum, jamais comme prix
ferme.

```bash
npm run sitemap   # régénère public/sitemap.xml depuis le catalogue
```

Le sitemap est reconstruit automatiquement avant chaque build : un produit
ajouté à `src/data/products.js` s'y retrouve sans intervention.

### Optimisation des images

```bash
npm run optimize:images
```

La commande produit dans `public/optimized/` des variantes WebP redimensionnées,
sans agrandir les sources. Elle est aussi lancée automatiquement avant chaque build.
Les composants utilisent `srcSet` et `sizes` pour laisser le navigateur choisir la
bonne largeur. Une photo répétée doit rester définie une seule fois dans `PHOTOS`, puis
être réutilisée dans les produits, les fiches, le panier et la galerie : le navigateur
ne la télécharge ainsi qu'une fois grâce à son cache.

Les fichiers source restent dans `image-sources/` pour permettre une nouvelle compression
sans perte quand d'autres formats ou dimensions seront nécessaires. Comme ce dossier est
hors de `public/`, GitHub Pages ne publie que les variantes de `public/optimized/`.

La palette est extraite du logo officiel : turquoise `#36C0C0`, bleu-vert `#2A585C`,
jaune `#FBDD13`.

## Le panier

Panier fonctionnel côté client, conservé dans le navigateur (`localStorage`).
Le tunnel de commande se fait en trois étapes — panier, coordonnées de livraison,
confirmation — et la commande part sur WhatsApp avec le récapitulatif complet.

Les champs (`id`, `name`, `price`, `qty`) sont déjà alignés sur le futur modèle
MongoDB : le branchement sur l'API NestJS se fera sans retoucher l'interface.

## Reste à faire avant la mise en ligne

- [x] Retirer les **témoignages provisoires** ; cette section ne reviendra
      qu'avec de vrais avis clients et leur accord de publication
- [ ] Confirmer les **prix** des articles actuellement « Sur devis »
- [ ] Ajouter les **photos** manquantes (galerie, boutique, produits)
- [ ] Vérifier le **pseudo Instagram** exact dans `src/config.js`
- [ ] Brancher le formulaire de contact et les commandes sur l'API NestJS
