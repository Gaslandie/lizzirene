# Benchmarking — flowers4washington.com

## Contexte et objectif

L'utilisateur demande un benchmarking complet de `https://www.flowers4washington.com/`,
puis la mise en place sur le site Lizzirène Déco de ce qui lui convient
réellement.

Le but n'est pas de copier un site : c'est d'identifier, chez un concurrent
international, les mécaniques qui font vendre des fleurs en ligne, puis de ne
retenir que celles qui ont un sens pour une boutique artisanale de Kipé qui
encaisse en espèces à la livraison.

## Méthode et limites

Le site refuse `WebFetch` (HTTP 403). L'analyse a été menée sur le HTML de la
page d'accueil récupéré avec un agent navigateur (552 Ko), puis dépouillé :
texte visible, navigation, données structurées JSON-LD, feuilles de style,
points d'entrée AJAX.

Limites à garder en tête :

- les pages internes (`/flower-delivery/`, `/customer-satisfaction-reviews/`,
  `/en/faq/`) renvoient également 403 hors navigateur : leur contenu n'a pas
  été lu, seules leurs entrées de navigation le sont ;
- la grille de produits en vedette est chargée en AJAX
  (`/includes/google_ajax.php`) : les prix réels n'apparaissent pas dans le
  HTML initial ;
- aucune mesure de performance (Lighthouse, Core Web Vitals) n'a été faite sur
  l'un ou l'autre site ;
- aucune donnée de conversion n'est disponible, ni chez eux ni chez nous. Tout
  ce qui suit est un jugement de conception, pas un résultat mesuré.

## Ce qu'est réellement flowers4washington.com

Ce n'est pas un fleuriste. C'est **une façade locale d'un réseau
d'intermédiaires** : `Internet Florist LLC`, immatriculée à Sheridan (Wyoming),
qui exploite plus d'un millier de domaines du même moule
(`flowers4berlin.com`, `flowers4conakry`, `flowers4guinea.com`…). Le site prend
la commande, une main-d'œuvre florale locale l'exécute.

Cela change complètement la lecture du benchmark : leurs points forts sont
ceux d'une **machine à capter du trafic et à rassurer un inconnu qui paie
d'avance**. Leurs points faibles sont ceux d'un site sans visage. Lizzirène
Déco est exactement l'inverse — une vraie boutique, une vraie fondatrice, une
vraie preuve sociale — et doit garder cet avantage plutôt que de l'échanger
contre leurs recettes.

### Structure de leur page d'accueil, dans l'ordre

1. bandeau d'avis permanent : « Join the 12,000+ customers who gave us a 5 star
   rating ★★★★★ » ;
2. barre utilitaire : 33 langues, ~150 devises, 6 numéros de téléphone par pays ;
3. navigation par **type de produit** avec vignettes : Flowers, Gift Baskets,
   Plants, Chocolates, Cakes, Gifts ;
4. bloc de texte SEO local replié derrière « Read more / Read less » ;
5. **« Choose Your Category »** — 6 tuiles illustrées, chacune avec son titre,
   sa promesse et un bouton « Shop Now » ;
6. bandeau visuel « Fresh Flowers — Find your own Happiness » ;
7. **« Upcoming Events »** — un calendrier des prochaines occasions
   (Journée des enseignants 05.10, Toussaint 01.11, Journée de l'homme 19.11,
   réveillon 24.12, Noël 25.12), chacune cliquable vers une collection ;
8. « Same Day Flower Delivery » + grille de bouquets en vedette (AJAX) ;
9. bloc éditorial « Local Florists, Same-Day Service » ;
10. **« Why Choose Our Flower Delivery Service »** — 6 arguments en liste ;
11. **FAQ** : jours de livraison, créneaux horaires, heure limite pour le jour
    même, choix du créneau, zones couvertes ;
12. « Shop With Confidence » : livraison, CGV, confidentialité, cookies ;
13. pied de page : téléphones par pays, ~25 moyens de paiement, adresse légale ;
14. ferme de liens SEO : plus de 1 000 liens « Flowers for <ville> ».

### Leurs vraies forces

| Force | Détail |
| --- | --- |
| Données structurées | JSON-LD complet : `Organization`, `WebSite`, `WebPage`, `City`, `Service`, `FAQPage`, `BreadcrumbList` — Google comprend le site sans deviner |
| Navigation par occasion | Les fêtes à venir sont datées et cliquables : elles créent l'urgence et l'intention d'achat |
| Tuiles de catégories | Chaque famille de produits a son image, sa phrase et son bouton — impossible de rater une gamme |
| Transparence logistique | Jours livrés, créneau 9 h–19 h, heure limite 13 h pour le jour même, exceptions aux fêtes : le doute est levé avant l'achat |
| Réassurance permanente | Note client, moyens de paiement, mentions légales, support 7 j/7 affichés partout |
| SEO local | Le nom de la ville est répété dans le titre, la description, les titres, le texte et le balisage |

### Leurs faiblesses, à ne surtout pas reproduire

- **Aucun visage.** Pas de fondatrice, pas de boutique, pas de photo de
  l'atelier. Le site pourrait être celui de n'importe quelle ville.
- **Preuve sociale invérifiable.** « 12 000 avis 5 étoiles » agrégés sur
  l'ensemble du réseau, pas sur Washington.
- **Ferme de liens.** Plus de mille liens de villes en pied de page : c'est du
  spam de maillage, exactement ce que les moteurs sanctionnent aujourd'hui.
- **Contenu généré.** Les textes sont des gabarits où le nom de la ville est
  substitué — d'où le « Washington , » avec son espace avant la virgule, visible
  une douzaine de fois sur la page.
- **Interface datée.** jQuery UI 1.11, `slick`, feuille `ie.css`, palette
  violette/rose incohérente (`#744080`, `#9848b2`, `#dc2640`, `#51cbee`).
- **Surcharge utilitaire.** 33 langues et 150 devises dans le premier écran :
  du bruit pour 99 % des visiteurs.

## Comparaison poste par poste

| Poste | flowers4washington | Lizzirène Déco (avant) | Verdict |
| --- | --- | --- | --- |
| Identité de marque | inexistante | fondatrice, boutique, histoire, palette du logo | **Nous** |
| Preuve sociale | 12 000 avis non vérifiables | Miss Guinée 2025, partenaires réels | **Nous** (qualité contre quantité) |
| Catalogue | 6 gammes hors métier (gâteaux, parfums) | 8 familles cohérentes, fiches détaillées | **Nous** |
| Panier & commande | tunnel classique, paiement en ligne | panier + WhatsApp + paiement à la réception | **Nous** (adapté au marché) |
| Design & accessibilité | 2015, contrastes hasardeux | palette maîtrisée, focus, `aria`, révélations | **Nous** |
| Navigation par occasion | calendrier daté et cliquable | absente | **Eux** |
| Tuiles de catégories | 6 tuiles illustrées + CTA | liens texte « Et aussi… » | **Eux** |
| Données structurées | JSON-LD complet | **aucune** | **Eux** |
| FAQ visible en accueil | oui, + `FAQPage` | seulement sur `/contact` | **Eux** |
| Texte SEO local | oui, repliable | absent | **Eux** |
| `robots.txt` / `sitemap.xml` | oui | **absents** | **Eux** |
| Détail logistique | jours, créneaux, heure limite | « 7 j/7 » seulement | **Eux** |

Le site est meilleur qu'eux sur tout ce qui touche à la marque et au produit.
Il perd sur tout ce qui touche à **la découvrabilité et à la levée du doute**.
C'est précisément là qu'il faut agir.

## Décision retenue

### Adopté

1. **Données structurées JSON-LD.** `LocalBusiness/Florist` avec adresse,
   horaires, zone desservie et moyen de paiement, `WebSite`, `FAQPage` sur
   l'accueil, `Product` + `BreadcrumbList` sur les fiches produits. C'est le
   poste au meilleur rapport gain/effort : ils en tirent leur visibilité, et
   nous n'en avions aucune.
2. **Section « Occasions ».** L'équivalent local de leur « Upcoming Events »,
   avec le calendrier réellement pertinent à Conakry : Saint-Valentin, fête des
   mères, Ramadan, Tabaski, mariages, naissances, remises de diplôme,
   hommages. Chaque occasion renvoie vers une famille de produits ou un thème
   de services déjà existant.
3. **Tuiles de familles de produits** sur l'accueil, avec photo, à la place de
   l'énumération en liens texte.
4. **FAQ sur l'accueil**, alimentée par la même source que la page contact —
   une seule liste de questions dans `src/data/faq.js`, exposée aussi en
   `FAQPage`.
5. **Bloc éditorial local repliable** « Fleuriste à Kipé, Conakry », qui donne
   au moteur le vocabulaire du métier et de la ville sans polluer la page.
6. **`robots.txt` et `sitemap.xml`.**

### Écarté, et pourquoi

| Écarté | Raison |
| --- | --- |
| Sélecteur de langue et de devise | Clientèle locale, francophone, en GNF |
| Comptes clients | Aucun back-end, et une friction inutile avant WhatsApp |
| « X milliers d'avis 5 étoiles » | Les témoignages provisoires ont été retirés du site **exprès**. On ne remet aucune preuve sociale non vérifiable |
| Logos de moyens de paiement | Le modèle est le paiement en espèces à la réception |
| Ferme de liens de villes | Pratique pénalisable, et sans objet pour une boutique unique |
| Chocolats, gâteaux, parfums | Hors métier |
| Heure limite de commande, frais de livraison chiffrés | **Information commerciale non connue.** Rien n'a été inventé : la section livraison ne reprend que ce que le site affirme déjà. À compléter avec la cliente (voir « Reste à confirmer ») |

## Implémentation et vérifications

Fichiers ajoutés :

- `src/data/occasions.js` — le calendrier des occasions et leur destination
- `src/data/faq.js` — source unique des questions fréquentes
- `src/components/Occasions.jsx` — section « Occasions » de l'accueil
- `src/components/FamillesVitrine.jsx` — tuiles des familles de produits
- `src/components/Faq.jsx` — liste de questions réutilisable
- `src/components/FleuristeLocal.jsx` — bloc éditorial local repliable
- `src/utils/donneesStructurees.js` — construction du JSON-LD
- `public/robots.txt`, `public/sitemap.xml`

Fichiers modifiés : `src/App.jsx`, `src/pages/Accueil.jsx`,
`src/pages/Contact.jsx`, `src/components/BoutiqueAccueil.jsx`,
`src/index.css`, `index.html`.

Vérifications faites : `npm run lint`, `npm run build`, contrôle du JSON-LD
généré à l'exécution.

## Reste à confirmer avec la cliente

Ces informations lèveraient le principal doute d'achat qui subsiste, mais
aucune n'est connue à ce jour et aucune n'a été inventée :

- **heure limite** pour être livré le jour même ;
- **créneaux horaires** de livraison ;
- **frais de livraison** par commune (actuellement « confirmés avant l'envoi ») ;
- délai de préparation pour un événement ou un bouquet sur mesure ;
- pseudo Instagram exact et page Facebook (le lien Facebook du pied de page
  pointe toujours sur `#`).
