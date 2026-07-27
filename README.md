# Lizzirene Déco — site vitrine & boutique

Site de **Lizzirene Déco by Irma** — fleuriste et décoration d'intérieur à Kipé, Conakry (Guinée).
_« Des fleurs pour chaque émotion »_

Bouquets personnalisés, compositions florales, terrariums faits main, box cadeaux, plantes
et décoration florale d'événements. Livraison partout à Conakry, **paiement à la livraison**.

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
public/                 logo et photos de la boutique
src/
  config.js             coordonnées, photos, zones de livraison, format des prix
  data/products.js      catalogue (nom, catégorie, prix, photo)
  context/CartContext   panier (état + persistance navigateur)
  components/           un fichier par section de la page
  index.css             toute la mise en forme (palette en haut du fichier)
```

### Points d'entrée pour modifier le site

- **Couleurs / typographie** → variables en haut de `src/index.css`
- **Téléphone, WhatsApp, email, adresse** → `src/config.js`
- **Produits et prix** → `src/data/products.js` (`price: null` affiche « Sur devis »)
- **Photos** → déposer dans `public/`, référencer dans `PHOTOS` (`src/config.js`),
  puis passer en `src` au composant `Media`

La palette est extraite du logo officiel : turquoise `#36C0C0`, bleu-vert `#2A585C`,
jaune `#FBDD13`.

## Le panier

Panier fonctionnel côté client, conservé dans le navigateur (`localStorage`).
Le tunnel de commande se fait en trois étapes — panier, coordonnées de livraison,
confirmation — et la commande part sur WhatsApp avec le récapitulatif complet.

Les champs (`id`, `name`, `price`, `qty`) sont déjà alignés sur le futur modèle
MongoDB : le branchement sur l'API NestJS se fera sans retoucher l'interface.

## Reste à faire avant la mise en ligne

- [ ] Remplacer les **témoignages provisoires** par de vrais avis clients
      (`src/components/Testimonials.jsx`) — ne pas publier de faux avis
- [ ] Confirmer les **prix** des articles actuellement « Sur devis »
- [ ] Ajouter les **photos** manquantes (galerie, boutique, produits)
- [ ] Vérifier le **pseudo Instagram** exact dans `src/config.js`
- [ ] Brancher le formulaire de contact et les commandes sur l'API NestJS
