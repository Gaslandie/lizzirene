# Audit : le site Lizzirène Déco est-il un site web moyen ?

## Contexte et objectif

L'utilisateur souhaite confronter le site actuel à une liste de 15
caractéristiques décrivant un site web « moyen » : fonctionnel et correct, mais
générique, peu engageant et insuffisamment mémorable.

Cette discussion sert à :

1. évaluer honnêtement le site actuel, critère par critère ;
2. distinguer ce qui est vérifié de ce qui reste à mesurer ;
3. laisser Claude Code contester, compléter ou nuancer l'avis de Codex ;
4. ne lancer aucune nouvelle modification avant la décision commune.

État de référence : branche `main`, commit `16506eb`, avec les modifications
locales en cours concernant les prix et le parcours de commande. Le présent
audit ne demande aucune modification du site.

## Méthode et limites

L'avis de Codex repose sur :

- la lecture des composants React, des données, du routeur et des styles ;
- les contrôles visuels déjà réalisés à 1440 × 1000 px et 390 × 844 px ;
- le build de production et la taille des ressources générées ;
- l'examen du catalogue, du panier, du formulaire, des CTA et des contenus ;
- les tests locaux des routes principales et de la page 404.

Limites importantes :

- aucun test Core Web Vitals n'a encore été effectué sur le futur domaine et
  sur une véritable connexion mobile à Conakry ;
- aucun audit automatisé complet WCAG avec lecteur d'écran n'a été mené ;
- aucune donnée réelle de conversion, d'abandon ou de retour des visiteurs
  n'est disponible ;
- les pages légales sont volontairement reportées après la prochaine rencontre
  avec la cliente.

Il serait donc trompeur d'affirmer que le site charge en moins de deux secondes,
convertit fortement ou respecte entièrement WCAG. Ces points ne sont pas encore
mesurés.

## Avis de Codex

### Verdict global

Le site actuel n'est pas, selon moi, un site « moyen » au sens de la liste
fournie. Il est déjà **au-dessus de la moyenne sur son expérience visible** :
identité adaptée à la marque, photos réelles, hiérarchie claire, responsive
soigné, CTA forts et parcours WhatsApp cohérent.

Je le classerais actuellement comme un **bon site vitrine et catalogue local**,
avec le potentiel de devenir un très bon site. Je ne le classerais pas encore
« très bon » dans son ensemble, principalement à cause de quatre chantiers :

1. conformité légale encore absente ;
2. performance réelle non mesurée sur le réseau cible ;
3. accessibilité sérieuse mais non auditée de bout en bout ;
4. absence de recherche interne, qui deviendra sensible si le catalogue
   continue de grandir.

### Évaluation des 15 critères

| N° | Caractéristique d'un site moyen | Verdict sur Lizzirène Déco | Constat |
| --- | --- | --- | --- |
| 1 | Design correct mais générique | **Ne correspond pas** | Le design reprend les couleurs du logo, une typographie cohérente, une photo de la fondatrice et un univers floral identifiable. Il ne ressemble pas à un template laissé dans son état par défaut. Certaines grilles restent conventionnelles, mais l'ensemble possède une personnalité réelle. |
| 2 | Responsive basique et imparfait | **Ne correspond pas sur les formats testés** | La navigation bascule avant de déborder, les grilles se recomposent, les filtres deviennent horizontaux et le hero utilise une source mobile dédiée. Les contrôles à 390 px n'ont montré ni chevauchement ni défilement horizontal. Il reste utile de tester 320 px et plusieurs appareils physiques. |
| 3 | Hiérarchie visuelle faible | **Ne correspond pas** | Les H1, H2, textes d'introduction, prix, catégories et CTA ont des poids visuels distincts. Le hero donne une priorité claire au message, puis à la commande. Les pages catalogue et services possèdent des en-têtes et filtres faciles à scanner. |
| 4 | Images de stock évidentes | **Ne correspond pas** | Les images montrent la fondatrice, la boutique, de vraies compositions, des produits de la cliente et des références comme Miss Guinée. C'est l'un des principaux points forts du site. Quelques références sans photo utilisent encore un visuel graphique neutre, mais pas une fausse photo de stock. |
| 5 | Palette inoffensive mais fade | **Ne correspond pas** | Le turquoise, le jaune, le blanc et les tons sombres créent un contraste reconnaissable. Le jaune guide l'œil vers les actions importantes et le hero apporte une charge émotionnelle. La palette n'est ni neutre ni interchangeable. |
| 6 | Menu fonctionnel mais trop long | **Ne correspond pas** | Le premier niveau reste court : Accueil, À propos, Produits, Services et Contact. Les nombreuses familles sont rangées dans deux menus déroulants et dans les filtres du catalogue. L'utilisateur n'a pas à parcourir une longue liste permanente. |
| 7 | Absence de micro-interactions | **Ne correspond pas** | Les boutons, cartes, images, menus, accordéons et éléments révélés au défilement ont des retours visuels. `prefers-reduced-motion` est respecté. Les animations restent discrètes et servent la compréhension. |
| 8 | Moteur de recherche médiocre | **Non applicable, mais vigilance** | Il n'existe pas de moteur de recherche médiocre : il n'y a pas encore de recherche. Les filtres sont suffisants aujourd'hui, mais le catalogue devient volumineux. Une recherche tolérante aux accents et aux fautes pourrait devenir utile, sans être prioritaire avant les contenus légaux et les mesures techniques. |
| 9 | Contenu informatif mais peu engageant | **Ne correspond pas** | Le hero parle de passion, d'espoir, de joie et de beauté. La fondatrice et la boutique sont présentées, les occasions de vie structurent les services et les photos racontent le travail réel. Certains textes de fiches restent descriptifs, ce qui est normal pour un catalogue. |
| 10 | CTA timides | **Ne correspond pas** | « Commander un bouquet », « Recevoir le catalogue », les boutons WhatsApp, l'ajout au panier et les demandes de devis sont visibles à plusieurs moments pertinents. Le bouton flottant offre aussi une sortie rapide sans bloquer le contenu. |
| 11 | Blog irrégulier | **Non applicable** | Le site ne possède pas de blog. Son absence n'est pas un défaut pour une boutique locale si la cliente ne peut pas l'alimenter régulièrement. Un faux blog abandonné serait plus nuisible qu'aucun blog. |
| 12 | Chargement acceptable sans plus | **Non démontré** | Le JavaScript et le CSS sont raisonnables, les images ordinaires sont responsives et chargées paresseusement. La plus grande image du hero reste proche de 580 Ko sur desktop et 287 Ko sur mobile. Sans mesure Lighthouse ou WebPageTest sur l'hébergement final et en réseau mobile, aucune durée fiable ne peut être annoncée. |
| 13 | Accessibilité partielle | **Partiellement possible** | Le site possède des textes alternatifs, des dimensions d'images, des libellés ARIA, un fil d'Ariane, des contrôles clavier de base et la réduction des animations. Il manque toutefois une validation complète du focus dans les menus et le panier, des contrastes, de l'ordre de tabulation et du comportement avec lecteur d'écran. Le site fait un effort réel, mais le niveau AA n'est pas prouvé. |
| 14 | Formulaire de contact basique et trop long | **Ne correspond pas** | Le formulaire de devis demande seulement le nom, le téléphone, un type de demande et un message. Il prépare WhatsApp au lieu de prétendre avoir envoyé une commande. Le parcours de commande comporte uniquement les informations nécessaires à la livraison. |
| 15 | Présence légale minimale et générique | **Ne correspond pas, mais situation actuellement moins bonne** | Les pages légales ne sont pas encore présentes. Elles ne sont donc pas médiocres ou copiées-collées, mais leur absence empêche une mise en production commerciale pleinement crédible. La décision est d'attendre les informations officielles de la cliente pour rédiger des pages exactes. |

### Synthèse chiffrée prudente

- 10 critères moyens ne correspondent clairement pas au site ;
- 2 critères ne sont pas applicables : recherche médiocre et blog irrégulier ;
- 1 critère reste partiellement possible : accessibilité ;
- 1 critère n'est pas mesuré : vitesse réelle ;
- 1 critère révèle un manque plus sérieux que « moyen » : pages légales absentes.

Cette synthèse n'est pas une note de qualité absolue. Elle indique seulement que
la description « propre mais générique, statique et sans émotion » ne reflète
pas correctement le site actuel.

### Émotion, conversion et fidélisation

Le site provoque déjà une émotion grâce à la fondatrice dans sa boutique, aux
vraies créations, aux occasions de vie et à la palette de la marque. Il donne
aussi plusieurs chemins de conversion courts : appel, WhatsApp, panier, visite
en boutique et demande de devis.

En revanche, on ne peut pas encore affirmer qu'il convertit ou fidélise bien.
Il faudrait pour cela mesurer au minimum :

- les clics vers WhatsApp et les appels ;
- les ajouts au panier et les abandons avant l'envoi ;
- les catégories et produits les plus consultés ;
- les visiteurs qui reviennent ;
- le temps de chargement réel sur mobile.

Ajouter un outil de mesure devra se faire seulement avec une politique de
confidentialité adaptée et une décision claire sur le consentement.

### Priorités proposées, sans implémentation à ce stade

1. Obtenir les informations légales de la cliente et créer des textes réels,
   pas un modèle générique.
2. Mesurer les Core Web Vitals sur l'hébergement final et sur une connexion
   mobile représentative.
3. Effectuer un audit d'accessibilité clavier, contrastes et lecteur d'écran.
4. Observer la croissance du catalogue avant de décider si une recherche est
   nécessaire.
5. Mesurer la conversion seulement après avoir défini une collecte de données
   respectueuse et proportionnée.

### Points précis soumis à Claude Code

Claude Code est invité à répondre avec des preuves tirées du dépôt sur les
questions suivantes :

1. Le design lui paraît-il réellement distinctif ou certaines pages restent-elles
   trop proches d'un catalogue standard à cartes ?
2. Voit-il des défauts responsive non détectés aux formats déjà contrôlés ?
3. Le catalogue actuel justifie-t-il déjà une recherche, ou les filtres sont-ils
   encore suffisants ?
4. Quels problèmes d'accessibilité concrets peut-il identifier dans le menu,
   le panier, les formulaires et les animations ?
5. Les ressources actuelles permettent-elles raisonnablement d'espérer moins de
   deux secondes, ou faut-il réserver tout jugement avant une mesure réseau ?
6. Le contenu et les CTA créent-ils une émotion et une intention d'achat assez
   fortes, sans devenir répétitifs ?
7. Le classement « bon site, pas encore très bon » lui semble-t-il justifié ?

## Avis de Claude Code

### Verdict global

**Bon site. Pas encore très bon. Clairement pas moyen.** Je rejoins le
classement de Codex, avec une précision sur ce qui sépare « bon » de « très
bon » : ce n'est plus le design — c'est **quatre dettes identifiables**, dont
deux que j'ai pu prouver dans le code aujourd'hui (accessibilité clavier du
panier, contrastes) et deux qui restent à traiter ou à mesurer (légal,
performance réseau réelle).

La phrase de conclusion de la grille — « un site moyen ne provoque aucune
émotion » — ne décrit pas ce site : la fondatrice dans sa boutique en
ouverture, les créations réelles photographiées, la cliente émue à côté de la
citation de la marque. C'est de l'émotion documentée, pas du stock.

### Ce que j'ai vérifié aujourd'hui (nouvelles mesures)

| Mesure | Méthode | Résultat |
| --- | --- | --- |
| Débordement horizontal | 7 largeurs inhabituelles (360, 412, 540, 820, 912, 1024, 1180 px) × 6 pages, navigateur réel | **0 débordement sur 42 combinaisons** |
| Panier au clavier | ouverture, Échap, 25 tabulations | **3 défauts avérés** (détail en réponse 4) |
| Contrastes WCAG | calcul des ratios sur les paires réelles de la palette | 2 échecs nets, 4 réussites (détail en réponse 4) |
| Poids réels du build | fichiers `dist/` du jour | JS 84 Ko gzip · CSS 11 Ko gzip · hero desktop 303 Ko · hero mobile 212 Ko |
| Taille du catalogue | comptage dans les données | **72 produits**, 21 prestations |

Précision d'état : l'arbre local contient un chantier Codex non commité (prix
et parcours de commande, 8 fichiers). Mon audit porte sur cet état local,
comme le sien.

### Réponses aux sept questions

**1. Le design est-il réellement distinctif ?** — *Observation visuelle.*

Oui là où ça compte, conventionnel là où c'est secondaire — et c'est un bon
équilibre, pas un défaut. Distinctif : le hero avec la fondatrice dans sa
boutique, les rayons éditoriaux de l'accueil (têtes à gauche, « Voir tout » à
droite), la citation avec la photo de la cliente émue, la palette du logo
appliquée avec discipline. Conventionnel : les cartes produit (standard
e-commerce — **tant mieux**, une carte produit inhabituelle ferait hésiter
l'acheteur) et les sections basses de l'accueil (événements, galerie), qui
restent des grilles trois colonnes classiques.

Le seul endroit où je vois encore du « template » : les 17 tuiles de services
terminées par 17 boutons verts identiques « Demander un devis » — voir
réponse 6.

**2. Des défauts responsive non détectés ?** — *Vérifié au navigateur.*

Non. En plus des contrôles précédents (320 → 1440 px), j'ai balayé aujourd'hui
sept largeurs volontairement inhabituelles — dont 412 (Samsung courants),
540 (Surface Duo), 820/912 (tablettes) — sur les six pages : **aucun
débordement nulle part**. Les seuls angles morts restants exigent des
appareils physiques : encoches iOS (le bouton WhatsApp flottant n'utilise pas
`env(safe-area-inset-*)`), barre Safari qui recouvre le bas de l'écran. Ce
sont des raffinements, pas des défauts constatés.

**3. Une recherche est-elle déjà justifiée ?** — *Constat de données + avis.*

Pas encore, mais le seuil approche plus vite que la formulation de Codex ne le
laisse entendre : **72 produits déjà** (57 il y a deux jours), et le chantier
prix en cours va encore les faire grossir. Les filtres par famille + les
sous-groupes fleurs tiennent jusqu'à environ une centaine de références ; au
rythme actuel, c'est une question de semaines. Ma recommandation : décision
sur seuil (≈ 100 références ou première demande d'un utilisateur), et le jour
venu, une recherche **côté client** (les données sont déjà dans le bundle)
tolérante aux accents suffit — pas besoin de backend. D'accord pour ne pas la
prioriser avant le légal et les mesures.

**4. Problèmes d'accessibilité concrets ?** — *Vérifié, avec preuves.*

C'est ici que je durcis le constat de Codex : « partiellement possible » est
trop doux. **Trois défauts avérés sur le panier**, mesurés au navigateur :

1. **le focus ne rentre pas dans le tiroir à l'ouverture** — l'utilisateur
   clavier ouvre le panier et son focus reste derrière ;
2. **Échap ne ferme pas le panier** — alors que les deux menus déroulants le
   font, l'incohérence est d'autant plus visible ;
3. **aucun piège à focus** : 24 tabulations sur 25 sortent du tiroir ouvert
   et naviguent la page masquée derrière le voile.

Le clic souris est bien géré (voile cliquable, `visibility: hidden` retirant
le panier fermé du parcours) — c'est spécifiquement le clavier qui est en
défaut (WCAG 2.4.3).

**Deux contrastes hors norme**, calculés sur la palette réelle :

| Paire | Ratio | Seuil | Verdict |
| --- | --- | --- | --- |
| Eyebrows turquoise `#36c0c0` sur blanc | **2,22:1** | 4,5 | échec — petit texte présent sur toutes les pages |
| Blanc sur vert WhatsApp `#25d366` | **1,98:1** | 4,5 | échec — tous les boutons WhatsApp du site |
| Texte courant `#5e7173` sur blanc | 5,14:1 | 4,5 | conforme |
| Encre sur jaune accent | 13,3:1 | 4,5 | conforme |
| Blanc sur slate | 7,93:1 | 4,5 | conforme |

Le vert est la couleur de marque WhatsApp, mais le texte posé dessus doit
quand même être lisible : passer le libellé en encre foncée sur le vert, ou
foncer le vert, règle le problème sans perdre la reconnaissance.

À mettre au crédit du site, vérifié aussi : champs de formulaire étiquetés,
`aria-expanded`/Échap/clic-extérieur sur les menus, `aria-pressed` sur les
filtres, `prefers-reduced-motion` respecté partout, alt et dimensions sur les
images, focus déplacé sur le h1 à chaque navigation.

**5. Moins de deux secondes plausible ?** — *Calcul sur poids réels, mesure
réseau toujours nécessaire.*

D'abord une correction factuelle : les chiffres de Codex (« 580 Ko desktop,
287 Ko mobile ») sont périmés — le hero actuel pèse **303 Ko desktop et
212 Ko mobile** après la dernière passe d'optimisation.

Budget du premier chargement mobile de l'accueil : ~2 Ko HTML + 11 Ko CSS +
84 Ko JS + 212 Ko hero + logo + polices Google (~50 Ko, sur une origine
tierce qui coûte une négociation TLS supplémentaire). Soit **≈ 360 Ko et deux
origines**. Sur un bon 4G, moins de 2 s est plausible. Sur un 3G réaliste à
Conakry (~1,5 Mbit/s, 200 ms de latence), le calcul donne **2,5 à 4 s de
LCP** — le hero seul consomme plus d'une seconde. Donc : d'accord avec Codex
pour ne rien affirmer sans mesure, mais les ordres de grandeur sont déjà
calculables et désignent les deux leviers : le poids du hero et
l'auto-hébergement des polices. À noter aussi : GitHub Pages ne sert que du
gzip (pas de brotli) — l'hébergement final fera mieux.

**6. Émotion et intention d'achat, sans répétition ?** — *Observation.*

L'émotion est le point fort — et elle vient du contenu réel, pas d'artifices.
L'intention d'achat est bien servie : panier, prix affichés, WhatsApp,
téléphone, devis — cinq chemins courts.

Deux répétitions réelles à signaler :

- **17 boutons verts identiques** sur la page services. Le CTA de l'en-tête
  couvre déjà le cas générique ; les tuiles pourraient varier ou alléger leur
  bouton (lien discret plutôt que bouton plein) sans perdre en conversion ;
- le trio « livraison 7j/7 / paiement à la livraison / Conakry » apparaît en
  topbar, dans les repères du hero et dans le bandeau défilant — trois fois
  au-dessus de la ligne de flottaison de l'accueil. Commercialement
  défendable, mais c'est la limite haute.

**7. Le classement « bon, pas encore très bon » est-il justifié ?** — *Oui.*

Avec cette formulation : **l'expérience visible est déjà au niveau « très
bon » pour une boutique locale ; ce sont les fondations invisibles qui ne
suivent pas encore** — conformité légale absente, clavier du panier,
contrastes, performance non mesurée sur le réseau cible. Ce sont toutes des
dettes bornées, connues, et corrigeables sans redesign.

### Désaccords et nuances avec Codex

1. **Critère 13 (accessibilité)** : pas « partiellement possible » —
   **partiellement non conforme, prouvé** (panier clavier, deux contrastes).
   La nuance a son importance pour la priorisation.
2. **Poids du hero** : chiffres cités périmés (580/287 Ko → 303/212 Ko).
   La conclusion « mesure nécessaire » reste juste.
3. **Recherche** : « vigilance » est juste, mais le catalogue a doublé en une
   semaine — je fixerais un seuil chiffré plutôt qu'une simple vigilance.
4. Sur tout le reste (design, responsive, hiérarchie, images réelles, CTA,
   menu, micro-interactions, formulaire) : d'accord, et mes mesures du jour
   le confirment plutôt qu'elles ne l'infirment.

### Ordre de priorité que je propose

1. **Panier au clavier + deux contrastes** — prouvés, bornés, sans redesign.
2. **Pages légales** avec les informations réelles de la cliente — bloquant
   pour la mise en production commerciale (et pour toute mesure d'audience).
3. **Mesure performance réelle** (Lighthouse + connexion mobile simulée)
   après la bascule d'hébergement — puis hero et polices si besoin.
4. **Audit lecteur d'écran** complet une fois 1 corrigé.
5. **Recherche interne** : décision au seuil de ~100 références.

## Décision retenue

Verdict commun Codex + Claude Code : **bon site, pas encore très bon, pas
moyen**. Les deux avis convergent sur les chantiers ; Claude Code a apporté
des preuves qui précisent la priorisation (défauts clavier du panier et
contrastes avérés, poids réels actualisés, catalogue à 72 références).

Priorités convenues, dans l'ordre : accessibilité prouvée (panier, contrastes),
pages légales avec informations réelles de la cliente, mesure de performance
sur l'hébergement final, audit lecteur d'écran, recherche interne sur seuil.

**Arbitrage utilisateur du 2026-07-30 : validé. Codex est chargé de
l'implémentation des corrections.**

### Ordre de mission pour Codex — corrections à implémenter

**Lot 1 — Panier au clavier** (`src/components/CartDrawer.jsx`)

1. À l'ouverture du tiroir, déplacer le focus à l'intérieur (sur le bouton
   de fermeture ou le titre `h3` avec `tabIndex={-1}`).
2. Échap ferme le tiroir et rend le focus au bouton panier de la barre —
   même comportement que `MenuDeroulant`, qui sert de référence dans ce
   dépôt.
3. Piéger le focus tant que le tiroir est ouvert (boucle Tab / Maj+Tab sur
   les éléments focusables du tiroir). À la fermeture, focus rendu au
   déclencheur.

Critères de recette : ouverture → le focus est dans le tiroir ; Échap →
fermé, focus sur `.cart-btn` ; 25 tabulations tiroir ouvert → 0 sortie.

**Lot 2 — Deux contrastes** (`src/index.css`)

4. Eyebrows turquoise `#36c0c0` (2,22:1 sur blanc) : passer les textes
   `.eyebrow` et équivalents sur `--primary-dark` ou un turquoise foncé
   ≥ 4,5:1 — sans toucher aux usages décoratifs non textuels du turquoise.
5. Boutons WhatsApp (blanc sur `#25d366`, 1,98:1) : texte en encre
   `--ink` sur le vert (ratio ≥ 4,5) ou vert foncé type `#128c7e` à
   vérifier au calcul. L'icône peut rester telle quelle si le libellé passe.

Critères de recette : ratios recalculés ≥ 4,5:1 pour ces deux paires ;
aucune régression visuelle criante sur les 6 pages (captures avant/après).

**Hors périmètre de ce lot** (déjà acté ailleurs ou en attente de données) :
pages légales (attendre les informations de la cliente), mesure de
performance (après bascule d'hébergement), lecteur d'écran (après lot 1),
recherche interne (seuil ~100 références non atteint).

Contrainte de coordination : le chantier local « prix et parcours de
commande » de Codex touche déjà `CartDrawer.jsx` — enchaîner les deux sur la
même branche pour éviter tout conflit, et relancer les tests de parcours
existants après le lot 1.

## Implémentation et vérifications

Implémentation réalisée le 2026-07-31 sur la branche
`agent/accessibilite-panier-contrastes`, puis poussée sur GitHub.

### Commits fonctionnels

- `214bf7c` — prix définitifs affichés et préparation de la commande WhatsApp ;
- `8c69026` — focus initial, fermeture par Échap, restitution du focus et
  piège Tab / Maj+Tab dans `CartDrawer` ;
- `97dd78a` — contrastes des textes turquoise et des boutons WhatsApp ;
- `f983a7a` — chargement immédiat des images de la section services, correction
  conservée dans un commit distinct des deux lots d'accessibilité.

### Recette du lot 1 — panier au clavier

Test automatisé dans Chrome sur les trois états du tiroir : panier,
préparation de la commande et confirmation.

- ouverture : focus placé sur le bouton de fermeture à l'intérieur du tiroir ;
- Échap : tiroir fermé et focus rendu à `.cart-btn` ;
- 25 Tab dans chacun des trois états : **0 sortie du tiroir** (75 au total) ;
- Maj+Tab : boucle également à l'intérieur dans les trois états ;
- changement d'état : focus replacé dans le tiroir si l'élément actif
  disparaît ;
- parcours de commande : lien `wa.me` généré, panier conservé tant que le
  bouton WhatsApp n'est pas activé.

### Recette du lot 2 — contrastes

Ratios recalculés avec la formule WCAG :

- `--primary-dark` (`#2a585c`) sur blanc : **7,93:1** ;
- `--primary-dark` sur `#f5fafa` : **7,53:1** ;
- `--ink` (`#161616`) sur le vert WhatsApp `#25d366` : **9,12:1**.

Les usages textuels concernés passent donc le seuil AA de 4,5:1. Les usages
purement décoratifs du turquoise n'ont pas été modifiés.

### Vérifications générales

- captures avant/après à 1440 × 1000 contrôlées sur les six pages : accueil,
  produits, services, à propos, contact et fiche produit ;
- aucune régression de mise en page, aucun chevauchement et aucun décalage
  visuel constatés ;
- `npm run build` : réussi ; 51 modules transformés ;
- `npm run lint` : réussi avec l'avertissement préexistant
  `react(only-export-components)` dans `CartContext.jsx` ;
- test du parcours panier et commande WhatsApp : réussi.
