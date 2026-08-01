# Benchmarking — livelyroot.com (UI/UX)

## Contexte et objectif

Deuxième benchmark de la journée, après flowers4washington.com. L'utilisateur
demande cette fois une analyse UI/UX de `https://www.livelyroot.com/` et la
liste de ce qui est empruntable pour Lizzirène Déco.

Lively Root est un cas bien plus intéressant que le précédent : c'est une
**vraie marque** (pépinière familiale, Californie/Caroline du Nord, Shopify),
pas une façade SEO. Son métier recouvre une partie du nôtre — plantes
d'intérieur, cadeaux végétaux, pots — et son niveau d'exécution e-commerce
est nettement au-dessus de la moyenne du secteur.

## Méthode et limites

Sources collectées et dépouillées en texte : accueil, page collection
(best-sellers), fiche produit complète (« Money Tree »), page quiz, à-propos,
FAQ, plus le flux JSON du catalogue Shopify (options et variantes réelles des
produits).

L'analyse a été menée en deux temps :

1. **cinq analystes en parallèle** (workflow multi-agents), chacun sur une
   dimension : architecture de navigation, fiche produit, merchandising et
   conversion, réassurance et contenu de marque, état du site Lizzirène Déco ;
2. **trois juges**, chacun avec une lentille différente — réalité du marché de
   Conakry, faisabilité sans backend, cohérence avec l'identité de la
   boutique — notant chaque idée de 0 (à écarter) à 3 (prioritaire). Une
   idée mise à 0 par une seule lentille est disqualifiée.

Limites : pas de mesure de performance ni d'audit accessibilité du site
étudié ; le rendu JavaScript complet (quiz interactif, carrousels d'avis) n'a
pas été exécuté — l'analyse porte sur le HTML servi et les données Shopify ;
aucune donnée de conversion n'est disponible de part ou d'autre.

## Ce qu'est livelyroot.com

Une pépinière-marque D2C : les plantes partent de la serre vers le client
final, avec un discours familial, éducatif et durable. L'ossature e-commerce
est du Shopify soigné : collections par intention, fiches produits très
denses, tunnel cadeau complet, garantie martelée à chaque écran.

### Les patterns UI/UX observés (lecture directe)

| Pattern | Détail |
| --- | --- |
| **Navigation par contexte de vie** | Les collections ne suivent pas la botanique mais la vie du client : *Pet Friendly*, *Easy Care*, *Low Light*, *Bedroom*, *Office*, *Air Purifying*, *Large Plants*. La taxonomie (« Ficus, Orchids… ») existe, mais en second rideau. |
| **Bandeau de réassurance sous le hero** | Quatre items : *Shipped Direct from the Nursery* · *30 Day Happiness Guarantee* · *Expert Customer Support* · *Care Instructions Provided*. |
| **Garantie omniprésente** | La « 30 Day Happiness Guarantee » apparaît dans la barre d'annonce, sur la fiche produit à côté du bouton d'achat, dans la FAQ, sur l'à-propos — avec la marche à suivre (photos sous 30 jours → remplacement). |
| **Fiche produit très riche** | Nom botanique, badges (*Pet Safe*), guide d'entretien structuré : lumière / eau / humidité / température avec niveau (High, Medium…), puis fertilisation, rempotage, taille, propagation. Cross-sell « Goes great with ». |
| **Options produit** | Taille S/M/L/XL avec guide des tailles, type de pot (Grower, Eco, Custom gravé, Basket, Smart Watering), couleur du pot — noms de couleurs de marque (Coconut, Earl Grey, Chai, Macadamia…). |
| **Badges sur les cartes produits** | *Best Seller*, *Pet Friendly*, *✎ Personalizable*, *Up to 25% OFF* — plusieurs par carte, prix « from $43.00 » avec prix barré en promo. |
| **Tunnel cadeau complet** | Message cadeau imprimé sur carte **sans le prix**, aperçu par e-mail au destinataire, relance « Gifting? Add gift options » dans le panier. |
| **Quiz de recommandation** | « Find Your Perfect Plant » en 3 étapes annoncées : répondre → correspondance → réception. |
| **Colisage expliqué** | 4 étapes illustrées : sac à terre, manchon de feuilles, calage sur mesure, carton — pour désamorcer la peur d'acheter du vivant à distance. |
| **QR code d'entretien** | Chaque commande embarque un QR vers le guide d'entretien numérique de la plante. |
| **Contenu éducatif comme SEO** | Blog *Plant Care* alimenté (guides par niveau de lumière, par pièce, pet-safe), lié depuis l'accueil et les collections. |
| **Mécaniques US non transposables** | Abonnements trimestriels par carte bancaire, Garden Club (fidélité), cadeaux d'agents immobiliers, remise militaire, newsletter à coupon. |

## Analyse croisée et idées jugées

Les cinq analystes ont produit **47 idées** ; les trois juges les ont notées
de 0 à 3, une note 0 d'une seule lentille valant disqualification. Deux
idées ont été disqualifiées — à juste titre, ce sont des doublons de
l'existant : le champ « message pour la carte » (déjà dans le panier) et un
nouveau bandeau de réassurance sous le hero (les trois repères y sont déjà).

Enseignement notable : les deux idées les mieux notées (3/3 aux trois
lentilles) ne viennent **pas** de Lively Root, mais de l'analyste chargé de
défendre le site actuel — le benchmark a surtout servi de révélateur de nos
propres manques.

### Classement de tête (moyenne des trois lentilles)

| Note | Idée | Sort |
| --- | --- | --- |
| 3.00 | Filtre par budget + tri par prix au catalogue | **Fait** |
| 3.00 | Ne plus vider le panier avant confirmation de l'envoi WhatsApp | **Fait** |
| 2.67 | Bloc « Entretien en un clin d'œil » sur les plantes | **Fait** (à faire relire) |
| 2.67 | FAQ enrichie sur l'après-commande et la fraîcheur | **Fait** (partiel) |
| 2.67 | Monter le référentiel fleurs & coloris qui dormait dans le repo | **Fait** |
| 2.67 | Plusieurs photos par fiche produit | Reporté — photos à fournir |
| 2.33 | « Le conseil d'Irma » signé sur les fiches | Reporté — vraies citations à collecter |
| 2.33 | Cross-sell « Se marie bien avec » (fiche + panier) | **Fait** |
| 2.33 | Réassurance factorisée en composant partagé | Écarté (cosmétique, faible gain) |
| 2.33 | Recherche produit côté client | **Fait** |
| 2.33 | Relier les occasions aux produits (vue transverse) | Reporté — produits à taguer avec la cliente |

Bas de classement (écarté sans appel) : abonnements par carte, programme de
fidélité, quiz long, page cadeaux d'entreprise dédiée, newsletter à coupon —
des mécaniques US qui présupposent des habitudes d'achat qui n'existent pas
à Conakry, ou des moyens que la boutique n'a pas.

## Décision retenue

### Implémenté dans cette séance

1. **Le panier ne se vide plus avant confirmation** (`CartDrawer.jsx`).
   L'ancien code vidait le panier au clic sur « Envoyer sur WhatsApp » : si
   wa.me ne s'ouvrait pas (ordinateur sans WhatsApp, pop-up bloquée), le
   panier composé était détruit. Désormais : bouton « J'ai bien envoyé ma
   commande » qui vide et ferme, et « Copier le récapitulatif » en secours
   (presse-papiers avec repli `execCommand`).
2. **Outils du catalogue** (`Boutique.jsx`) : recherche insensible aux
   accents (« seoul » trouve « Séoul », « oeillet » trouve « œillet »),
   pastilles de budget calées sur la distribution réelle (26 / 24 / 6
   produits + 29 sur devis), tri prix croissant/décroissant. Le tri
   éditorial (photos d'abord, hommages après) reste le tri de base et
   départage les prix égaux ; les « sur devis » vont en fin de liste.
3. **Référentiel fleurs & coloris monté** : `FlowerAvailability.jsx` était
   terminé, stylé… et importé nulle part. Il s'affiche maintenant sous la
   famille Fleurs du catalogue.
4. **« L'entretien en un clin d'œil »** (`FicheEntretien.jsx` + champ
   `entretien` sur 10 plantes) : lumière, arrosage, difficulté, plus une
   précaution quand la plante le mérite (sève irritante du dieffenbachia,
   du jatropha et de l'euphorbe — fait botanique vérifiable).
5. **Cross-sell « Se marie bien avec »** (`SeMarieBienAvec.jsx`) : mapping
   statique entre familles (fleurs → vases + peluches, plantes →
   cache-pots…), les moins chers d'abord, jamais d'hommage, jamais de
   produit sans prix ou sans photo. Rangée de cartes sous la fiche produit,
   deux lignes compactes dans le tiroir panier.
6. **FAQ** : deux questions ajoutées — « Que se passe-t-il après l'envoi ? »
   (ne promet que ce que le tunnel fait déjà) et « Comment garder mon
   bouquet frais ? » (conseil de fleuriste, sans engagement de stock). Les
   quatre premières questions sont inchangées : l'accueil n'affiche qu'elles.

### Écarté, et pourquoi

| Écarté | Raison |
| --- | --- |
| Abonnements, Garden Club, points de fidélité | Présupposent carte bancaire et habitudes US |
| Quiz « plant finder » long | Sur-ingénierie pour 84 produits ; la recherche + les occasions y répondent |
| Garantie « 30 jours » | Promesse intenable telle quelle pour des fleurs fraîches ; la version locale (« remplacement si abîmé à la livraison ») est une **proposition à valider** |
| Newsletter | Pas d'outil d'envoi ; le canal réel est WhatsApp/Instagram |
| Sélecteur de devise, comptes clients, avis agrégés | Mêmes raisons que le benchmark précédent |

## Implémentation et vérifications

Fichiers créés : `src/components/SeMarieBienAvec.jsx`,
`src/components/FicheEntretien.jsx`. Fichiers modifiés :
`src/components/Boutique.jsx`, `src/components/CartDrawer.jsx`,
`src/components/Icon.jsx` (icônes copier, soleil, goutte, info, recherche),
`src/pages/Produit.jsx`, `src/data/products.js` (champ `entretien` sur 10
plantes), `src/data/faq.js`, `src/index.css`.

Vérifié en navigateur réel (CDP) : recherche « seoul » → 1 résultat
« Bouquet Séoul » ; budget ≤ 500 000 → 26 articles ; tri croissant correct ;
état « aucun résultat » avec bouton d'effacement ; bloc entretien sur la
langue de belle-mère ; cross-sell cache-pots sur la fiche plante et vases
dans le panier d'un bouquet ; le panier survit à l'étape de confirmation et
ne se vide qu'au clic « J'ai bien envoyé ma commande ». `npm run lint` et
`npm run build` passent. Rendu contrôlé en 1440 px et 390 px.

## Reste à confirmer avec la cliente

- Les **conseils d'entretien des 10 plantes** publiés dans cette séance sont
  des règles horticoles standard, rédigées prudemment pour le climat de
  Conakry — **à faire relire par la fondatrice**, c'est elle l'experte.
- Une **promesse de fraîcheur / remplacement** façon « garantie » ne peut
  être affichée qu'avec l'accord explicite de la boutique et une règle
  qu'elle peut tenir (ex. : fleurs remplacées si abîmées à la livraison).
  Rien n'a été publié sans validation.
- **« Le conseil d'Irma »** sur les fiches produits : collecter de vraies
  citations auprès de la fondatrice (jamais rédigées à sa place).
- **Deuxième photo par produit** (mise en situation, échelle) : à demander,
  la structure du site est prête à les recevoir.
- **Livraison surprise à un tiers** (cadeau) : à cadrer avant d'apparaître
  dans la FAQ — qui paie, comment, que dit le livreur.
