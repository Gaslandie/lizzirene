# Images de fond du hero

## Contexte

La cliente souhaite tester un hero avec des images en arriere-plan a la place
du visuel en pot affiche a droite. Trois images ont d'abord ete deposees dans
`public/hero-images`, puis leurs originaux ont ete archives dans
`image-sources/hero-images` apres optimisation.

## Avis de Codex

- `hero-image3.jpg` est la meilleure image d'ouverture : composition lumineuse,
  ambiance elegante et suffisamment calme pour recevoir du texte avec un voile.
- `hero-image1.jpg` apporte une variation tres florale et coloree, mais necessite
  un voile plus fort car elle est visuellement chargee.
- `hero-image2.jpeg` met en avant les cadeaux et permet de varier le message,
  meme si son cadrage est moins premium que la troisieme image.
- Pour ce test, les trois images seront presentees en fondu. Le texte restera
  un vrai contenu HTML au-dessus des images et non du texte integre aux photos.
- Les images seront decoratives (`aria-hidden`) et des commandes permettront de
  choisir une vue ou de mettre l'animation en pause. La preference systeme
  `prefers-reduced-motion` desactive automatiquement la rotation.
- Un degrade sombre turquoise garantira la lisibilite du H1 et des boutons sur
  les trois visuels.

Point de vigilance initial : `hero-image1.jpg` pesait environ 1,6 Mo et
`hero-image3.jpg` environ 4 Mo. Ce point est maintenant traite par des variantes
WebP responsives de 768 px et jusqu'a 1920 px.

## Avis de Claude Code

A completer si une seconde revue est souhaitee.

## Decision retenue

L'utilisateur a demande une integration d'essai immediate avec les trois
images disponibles. La troisieme image sera affichee en premier.

## Implementation et verifications

Implementation effectuee :

- `HERO_IMAGES` centralise les trois visuels et leurs libelles dans
  `src/config.js`.
- Le visuel en pot situe a droite a ete retire du hero.
- Les trois photos couvrent maintenant toute la section en arriere-plan ;
  `hero-image3.jpg` est la premiere vue.
- Un double degrade turquoise sombre protege la lisibilite du titre, du texte,
  des statistiques et des boutons.
- La rotation automatique change d'image toutes les 5 secondes.
- Trois boutons permettent de choisir manuellement une image et une commande
  permet de mettre la rotation en pause ou de la relancer.
- Une selection manuelle met la rotation en pause pour respecter le choix du
  visiteur.
- `prefers-reduced-motion` desactive la rotation et les transitions pour les
  personnes qui ont reduit les animations dans leur systeme.
- Les images sont decoratives et masquees aux technologies d'assistance ; les
  commandes possedent des libelles accessibles.
- Le hero mobile renforce le voile et adapte sa hauteur au viewport.

Verifications effectuees :

- `git diff --check` : OK.
- `npm run lint` : OK, avec uniquement l'avertissement historique de
  `CartContext.jsx`.
- `npm run build` : OK.
- Les trois sources ont ensuite ete remplacees dans le rendu par leurs variantes
  responsives de `dist/optimized`.
- Inspection visuelle individuelle des trois sources et controle des cadrages.
- La capture automatisee du rendu et le serveur de previsualisation n'ont pas
  pu etre lances dans l'environnement : l'autorisation d'ouverture du port et
  de Chrome headless a expire avant validation. La compilation n'est pas
  affectee.

L'optimisation avant production est terminee et reproductible avec
`npm run optimize:images`.
