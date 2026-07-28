# Ameliorations site web

## Contexte et objectif

Demande utilisateur du 2026-07-28 :

- Mettre a jour les familles de produits : fleurs naturelles, fleurs artificielles, plantes, vases, peluches, box cadeaux, tableaux, materiel decoratif, luminaire professionnel et caches postes.
- Mettre a jour les horaires : lundi au samedi de 8h30 a 21h30, dimanche de 10h a 18h.
- Remplacer le titre hero "Des fleurs pour chaque emotion" par : "L'amour se dit en fleur et chaque fleur a une histoire ..."
- Mettre surtout en place un onglet "Nos Produits" dans la barre de navigation.
- Retirer "Galerie" et "Evenements" de la barre de navigation.
- Les familles produits doivent apparaitre comme un sous-menu de "Nos Produits" :
  - sur PC / grand ecran : ouverture au survol et disparition quand la souris sort de la zone ;
  - sur telephone : ouverture / fermeture au clic.

## Avis de Codex

Le changement est clair et doit rester simple :

1. Mettre a jour `CONTACT.tagline` et `CONTACT.hours` dans `src/config.js`, car le footer et la zone contact s'appuient deja sur cette source centrale.
2. Remplacer le titre statique du hero dans `src/components/Hero.jsx` par la nouvelle phrase. Je recommande de conserver l'emphase visuelle sur un morceau court de la phrase, par exemple `chaque fleur`, pour garder le style actuel sans compliquer le balisage.
3. Mettre a jour le ticker dans `src/components/Ticker.jsx`, car il contient encore l'ancienne phrase.
4. Remplacer les filtres `CATEGORIES` dans `src/data/products.js` par les familles exactes demandees.
5. Adapter les produits d'exemple existants pour qu'ils pointent vers ces nouvelles categories. Comme le site ne contient pas encore de vraies photos/catalogue pour chaque famille, je recommande d'ajouter des cartes "sur devis" sobres pour les nouvelles familles manquantes, sans inventer de prix.
6. Mettre a jour les textes du footer et du formulaire contact pour aligner la boutique avec cette offre plus large.
7. Modifier `src/components/Navbar.jsx` pour remplacer le lien "Boutique" par "Nos Produits" tout en gardant l'ancre `#boutique`, puis retirer les liens "Evenements" et "Galerie" de la navigation principale.
8. Transformer "Nos Produits" en entree avec sous-menu. La liste doit reprendre les categories produits demandees par l'utilisateur.

Decision proposee : appliquer ces changements sans modifier l'architecture, parce que le besoin est du contenu editorial, catalogue et navigation. Pas besoin de backend ni de nouvelle abstraction maintenant. Je recommande de ne pas supprimer les sections `Events` et `Gallery` dans cette passe, sauf demande explicite : on retire seulement leurs entrees de la barre de navigation.

### Demarche professionnelle recommandee

Pour un rendu fiable, moderne et "site international", je recommande :

1. Definir les familles produits dans une seule source de verite, idealement `src/data/products.js`, afin que les filtres de la section produits et le sous-menu utilisent les memes ids / labels.
2. Dans `Navbar.jsx`, remplacer le simple lien "Boutique" par un groupe `Nos Produits` avec un bouton ou lien principal et un panneau de sous-menu.
3. Desktop : ouvrir le sous-menu via CSS `:hover` et `:focus-within`, pour que cela fonctionne aussi au clavier. Le sous-menu doit rester visible quand la souris passe du bouton vers le panneau.
4. Mobile / burger : piloter l'ouverture avec un etat React (`productsOpen`) et un bouton `aria-expanded`, car le hover n'existe pas sur telephone.
5. Chaque item du sous-menu doit pointer vers `#boutique` avec une information de categorie. La meilleure option est de permettre a la section `Boutique` de lire une categorie depuis le hash ou un parametre interne, afin qu'un clic sur "Vases" affiche directement les produits de cette famille.
6. Accessibilite : ajouter `aria-haspopup="menu"`, `aria-expanded`, fermeture apres selection mobile, navigation clavier propre, et zone cliquable confortable.
7. UI : utiliser un panneau clair, propre, avec ombre legere, bordure subtile, espacement regulier, et une largeur suffisante pour les longs labels comme "Luminaire professionnel" et "Materiel decoratif".
8. Verification : tester desktop, tablette et mobile ; verifier que le menu ne deborde pas, que le hover ne clignote pas, que le clic mobile ouvre/ferme correctement, et que les categories filtrent bien les produits.

Point de vigilance : si on garde `#boutique` seulement, tous les items du sous-menu iront a la section sans filtrer. Pour un rendu vraiment professionnel, il faut connecter le sous-menu aux filtres de produits, par exemple via un hash de type `#boutique?categorie=vases` ou un mecanisme React equivalent.

## Avis de Claude Code

### Accord global

D'accord sur l'essentiel : le besoin est éditorial et navigationnel, pas architectural.
Pas de backend, pas de router, pas de nouvelle abstraction. D'accord aussi pour garder
les sections `Events` et `Gallery` et ne retirer que leurs entrées de la barre — le footer
les référence déjà, donc elles restent atteignables.

En revanche, trois points de la démarche proposée sont techniquement faux ou fragiles,
et il manque cinq sujets qui se verront en production.

### Corrections

**1. `#boutique?categorie=vases` n'est pas une URL valide.**

C'est le point de vigilance final de Codex, et c'est justement là qu'il y a une erreur.
La grammaire des URL est `chemin?query#fragment` : tout ce qui suit le `#` **est** le
fragment. `#boutique?categorie=vases` crée donc un fragment nommé littéralement
`boutique?categorie=vases`, qui ne correspond à aucun `id` : la page ne défilera pas et
le paramètre ne sera jamais lu.

La forme correcte est **`?categorie=vases#boutique`** — query d'abord, fragment ensuite.
Elle fonctionne telle quelle sur GitHub Pages (hébergement statique, la query est
simplement transmise au client).

**2. `aria-haspopup="menu"` est le mauvais motif d'accessibilité.**

`role="menu"` / `menuitem` et `aria-haspopup="menu"` sont réservés aux menus
**d'application** (barre de menus type logiciel bureautique). Les annoncer impose au
lecteur d'écran un mode de navigation aux flèches qui casse la navigation normale par
liens, et déroute les utilisateurs.

Un sous-menu de navigation contenant des liens relève du motif **disclosure** :

```
<button aria-expanded={ouvert} aria-controls="sous-menu-produits">Nos Produits</button>
<ul id="sous-menu-produits"> … liens … </ul>
```

Pas de `role="menu"`, pas de `aria-haspopup`. C'est ce que font GOV.UK, Stripe et
Shopify, et c'est la recommandation constante des praticiens accessibilité pour ce cas
précis. Tab circule naturellement dans les liens, ce qui est le comportement attendu.

**3. Le `:hover` CSS pur ne suffit pas, même complété par `:focus-within`.**

Il manque quatre comportements qu'on attend d'un site professionnel :
- fermeture par la touche **Échap** (avec retour du focus sur le déclencheur) ;
- fermeture au **clic en dehors** ;
- sur les **appareils hybrides** (portables tactiles, tablettes avec souris), un appui
  déclenche un état `:hover` collant que rien ne vient annuler ;
- si le déclencheur est un `<a href="#boutique">`, l'utilisateur tactile **navigue avant
  de voir le sous-menu**.

La bonne approche est **un seul état React** qui pilote desktop et mobile, le survol
n'étant qu'une amélioration progressive conditionnée par
`matchMedia('(hover: hover) and (pointer: fine)')`. Un délai de fermeture d'environ
150 ms évite le clignotement quand la souris traverse l'espace entre le bouton et le
panneau — c'est plus fiable que d'essayer de coller les deux zones.

Conséquence : le déclencheur doit être un `<button>`, pas un lien. Pour ne pas perdre
l'accès direct à la boutique, le premier élément du panneau est **« Tout le catalogue »**
pointant vers `#boutique`. C'est la solution propre et courante ; un bouton scindé
(lien + chevron séparé) serait plus lourd et moins bon au doigt.

### Réponses aux quatre questions

**La démarche est-elle propre pour un site professionnel ?**
Oui sur la structure, non sur l'interaction et l'accessibilité — voir les trois
corrections ci-dessus. Une fois celles-ci intégrées, on est au niveau attendu.

**Source de vérité unique pour les catégories ?**
Oui, sans réserve. `CATEGORIES` dans `src/data/products.js`, importé par la barre de
filtres **et** par le sous-menu. Une seule nuance : `tous` sert au filtre mais pas au
sous-menu, donc le menu consomme `CATEGORIES.filter((c) => c.id !== 'tous')`, avec
« Tout le catalogue » ajouté en tête comme lien vers `#boutique`.

**Le clic sur une catégorie doit-il filtrer la section produits ?**
Oui, sinon le sous-menu n'est qu'une table des matières décorative. Je vais plus loin que
Codex : il faut que **l'URL porte la catégorie**, pas seulement l'état React. Pour cette
boutique qui vend par WhatsApp, pouvoir envoyer
`https://gaslandie.github.io/lizzirene/?categorie=vases#boutique` en disant « voici nos
vases » est un vrai bénéfice commercial. Ça donne aussi le bouton Retour du navigateur
gratuitement.

L'état vit dans `App` (Navbar et Boutique sont deux enfants directs : deux props, aucun
prop drilling), synchronisé avec l'URL via `history.pushState` + un écouteur `popstate`.
Pas besoin de contexte pour ça.

**Meilleure approche React / CSS / accessibilité ?**
Voir la proposition d'implémentation ci-dessous.

### Cinq points manquants

**a) La nouvelle phrase ne peut pas remplacer le slogan partout.**
`CONTACT.tagline` est affiché **sous le logo** dans la navbar (bloc de 58 px de haut) et
dans le footer. « L'amour se dit en fleur et chaque fleur a une histoire … » fait 49
caractères : sous le logo, ça cassera la mise en page.

Je recommande de **distinguer les deux** : garder « Des fleurs pour chaque émotion »
comme signature de marque (navbar, footer, meta, ticker — c'est leur signature Facebook
établie et elle est bonne pour le référencement), et n'utiliser la nouvelle phrase que
comme **titre H1 du hero**. Deux champs distincts dans `config.js` : `tagline` et
`heroTitle`.

**b) Dix familles → onze boutons de filtre.**
Sur desktop la barre passera sur deux lignes, sur mobile ce sera un long défilement
horizontal. C'est acceptable, mais il faut le savoir : le sous-menu devient alors le
chemin d'accès principal, et la barre de filtres un raccourci secondaire.

**c) Des catégories vides.**
Avec 10 familles et 8 produits de démonstration, plusieurs catégories n'auront aucun
produit : cliquer sur « Tableaux » affichera une grille vide. La proposition de Codex
(une carte « sur devis » par famille manquante) règle le problème et évite d'inventer des
prix — d'accord. J'ajoute quand même un **état vide** en filet de sécurité (« Cette
famille arrive bientôt — demandez le catalogue sur WhatsApp »), parce que la cliente
éditera le catalogue et créera tôt ou tard une catégorie vide.

**d) Bug existant : les ancres passent sous la navbar collante.**
`.navbar` est en `position: sticky; top: 0` et aucune section n'a de `scroll-margin-top`.
Tous les liens d'ancrage actuels — pas seulement le futur sous-menu — amènent le haut de
la section **sous** la barre.

Mesuré sur le site en ligne, en cliquant réellement sur « Boutique » :

| Écran | Bas de la navbar | Haut du 1er contenu | Résultat |
| --- | --- | --- | --- |
| Mobile 375 px | 75 px | 64 px | **11 px de contenu masqué** |
| Desktop 1440 px | 89 px | 110 px | 21 px de marge, rien de masqué |

Donc : gênant sur mobile, invisible sur desktop aujourd'hui — uniquement parce que le
rembourrage généreux des sections compense par chance. Ce filet disparaîtra dès qu'on
réduira un `padding`, et le sous-menu produits va multiplier les allers-retours vers
`#boutique`. À corriger maintenant, c'est deux lignes :

```css
section[id] { scroll-margin-top: 100px; }
@media (max-width: 900px) { section[id] { scroll-margin-top: 86px; } }
```

**e) Les filtres actifs ne sont pas annoncés.**
Les boutons de filtre n'ont qu'une classe `.active` visuelle : un lecteur d'écran ne peut
pas savoir quel filtre est sélectionné. Ajouter `aria-pressed={filtre === c.id}`.
Et après un clic depuis le sous-menu, déplacer le focus sur la section boutique
(`tabIndex={-1}` + `.focus()`), sinon le focus reste dans la navigation alors que le
contenu a changé plus bas.

**f) Horaires sur deux plages.**
`CONTACT.hours` est aujourd'hui une chaîne unique rendue dans un `<span>`. Avec
« Lun – Sam : 8h30 – 21h30 » et « Dim : 10h – 18h », passer à un tableau de deux lignes
rendra mieux que tout concaténer, surtout sur mobile.

**g) « Caches postes » est confirme par l'utilisateur.**
La cliente vend bien des caches postes, c'est-a-dire des housses decoratives
pour postes TV. Le libelle public retenu est donc **Caches postes**, avec l'id
d'URL `caches-postes`.

### Proposition d'implémentation

**Source de vérité** — `src/data/products.js` :

```js
export const CATEGORIES = [
  { id: 'tous', label: 'Tout voir' },
  { id: 'fleurs-naturelles', label: 'Fleurs naturelles' },
  { id: 'fleurs-artificielles', label: 'Fleurs artificielles' },
  { id: 'plantes', label: 'Plantes' },
  { id: 'vases', label: 'Vases' },
  { id: 'peluches', label: 'Peluches' },
  { id: 'box-cadeaux', label: 'Box cadeaux' },
  { id: 'tableaux', label: 'Tableaux' },
  { id: 'materiel-decoratif', label: 'Matériel décoratif' },
  { id: 'luminaire', label: 'Luminaire professionnel' },
  { id: 'caches-postes', label: 'Caches postes' },
]

// Le sous-menu n'affiche pas « Tout voir » : il a son propre lien en tête.
export const FAMILLES = CATEGORIES.filter((c) => c.id !== 'tous')
```

**État partagé, adossé à l'URL** — `src/hooks/useCategorie.js` :

```js
import { useCallback, useEffect, useState } from 'react'

const lireUrl = () =>
  new URLSearchParams(window.location.search).get('categorie') || 'tous'

export function useCategorie() {
  const [categorie, setCategorie] = useState(lireUrl)

  // Bouton Retour du navigateur
  useEffect(() => {
    const sync = () => setCategorie(lireUrl())
    window.addEventListener('popstate', sync)
    return () => window.removeEventListener('popstate', sync)
  }, [])

  const choisir = useCallback((id, { defiler = false } = {}) => {
    const url = new URL(window.location.href)
    if (id === 'tous') url.searchParams.delete('categorie')
    else url.searchParams.set('categorie', id)
    url.hash = 'boutique'
    window.history.pushState({}, '', url)
    setCategorie(id)

    // pushState ne fait jamais défiler : on s'en charge, focus compris.
    if (defiler) {
      const section = document.getElementById('boutique')
      section?.scrollIntoView({ behavior: 'smooth' })
      section?.focus({ preventScroll: true })
    }
  }, [])

  return [categorie, choisir]
}
```

Appelé une seule fois dans `App`, puis `<Navbar onCategorie={choisir} />` et
`<Boutique categorie={categorie} onCategorie={choisir} />`.

**Le sous-menu** — un seul composant pour desktop et mobile :

```jsx
function MenuProduits({ onCategorie, onNaviguer }) {
  const [ouvert, setOuvert] = useState(false)
  const zone = useRef(null)
  const declencheur = useRef(null)
  const fermeture = useRef()

  // Le survol n'existe que sur les appareils à souris.
  const survolDispo = () =>
    window.matchMedia('(hover: hover) and (pointer: fine)').matches

  useEffect(() => {
    if (!ouvert) return
    const horsZone = (e) => {
      if (!zone.current?.contains(e.target)) setOuvert(false)
    }
    const echap = (e) => {
      if (e.key === 'Escape') {
        setOuvert(false)
        declencheur.current?.focus()
      }
    }
    document.addEventListener('pointerdown', horsZone)
    document.addEventListener('keydown', echap)
    return () => {
      document.removeEventListener('pointerdown', horsZone)
      document.removeEventListener('keydown', echap)
    }
  }, [ouvert])

  useEffect(() => () => clearTimeout(fermeture.current), [])

  const choisir = (e, id) => {
    e.preventDefault()
    onCategorie(id, { defiler: true })
    setOuvert(false)
    onNaviguer?.() // referme aussi le burger sur mobile
  }

  return (
    <div
      className="nav-produits"
      ref={zone}
      onMouseEnter={() => {
        if (!survolDispo()) return
        clearTimeout(fermeture.current)
        setOuvert(true)
      }}
      onMouseLeave={() => {
        if (!survolDispo()) return
        fermeture.current = setTimeout(() => setOuvert(false), 160)
      }}
    >
      <button
        ref={declencheur}
        className="nav-produits-btn"
        aria-expanded={ouvert}
        aria-controls="sous-menu-produits"
        onClick={() => setOuvert((o) => !o)}
      >
        Nos Produits
        <Icon name="chevron" size={16} className={ouvert ? 'pivote' : ''} />
      </button>

      <ul
        id="sous-menu-produits"
        className={`sous-menu ${ouvert ? 'ouvert' : ''}`}
      >
        <li>
          <a href="#boutique" onClick={(e) => choisir(e, 'tous')}>
            Tout le catalogue
          </a>
        </li>
        {FAMILLES.map((f) => (
          <li key={f.id}>
            <a
              href={`?categorie=${f.id}#boutique`}
              onClick={(e) => choisir(e, f.id)}
            >
              {f.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}
```

Les `href` sont de vraies URL : le clic milieu, « ouvrir dans un nouvel onglet » et le
partage de lien fonctionnent, et la navigation reste utilisable si le JS échoue.

**CSS** — même technique que le tiroir panier, pour rester cohérent :

```css
.nav-produits { position: relative; }

.sous-menu {
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%) translateY(6px);
  min-width: 260px;
  padding: 10px;
  background: var(--white);
  border: 1px solid rgba(42, 88, 92, 0.1);
  border-radius: 16px;
  box-shadow: var(--shadow);
  opacity: 0;
  visibility: hidden;      /* retire aussi du parcours clavier */
  pointer-events: none;
  transition: opacity 0.2s ease, transform 0.2s ease, visibility 0s linear 0.2s;
}

.sous-menu.ouvert {
  opacity: 1;
  visibility: visible;
  pointer-events: auto;
  transform: translateX(-50%) translateY(0);
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.sous-menu a { display: block; padding: 11px 16px; border-radius: 10px; white-space: nowrap; }
.sous-menu a:hover { background: var(--primary-soft); color: var(--primary-dark); }

/* Dans le burger : le panneau se déroule dans le flux, pas en surcouche. */
@media (max-width: 1100px) {
  .sous-menu {
    position: static;
    transform: none;
    min-width: 0;
    box-shadow: none;
    border: none;
    border-left: 2px solid var(--primary-soft);
    border-radius: 0;
    margin: 4px 0 4px 8px;
    display: none;
  }
  .sous-menu.ouvert { display: block; transform: none; }
}
```

Deux remarques CSS :
- `visibility: hidden` (et pas seulement `opacity: 0`) est indispensable, sinon les liens
  du panneau fermé restent atteignables au clavier — c'est la même correction que celle
  appliquée au tiroir panier.
- L'`overflow-x: clip` posé sur `body` ne rognera pas le panneau : `clip` sur un seul axe
  laisse l'axe vertical en `visible`, contrairement à `hidden`. C'est précisément pourquoi
  `clip` avait été choisi.

**À prévoir aussi :** ajouter une icône `chevron` dans `Icon.jsx` (elle n'existe pas
encore, il n'y a que `arrow`).

**Effet de bord favorable :** la barre passera de 6 à 4 entrées (Univers, Nos Produits,
À propos, Contact). Le basculement en burger, actuellement forcé dès 1100 px parce que
la navigation débordait, pourra être ramené vers 900 px — la barre complète restera donc
visible sur tablette en paysage.

### Vérifications à faire avant de publier

1. Survol desktop : pas de clignotement quand la souris passe du bouton au panneau.
2. Clavier : Tab entre dans le panneau, Échap ferme et rend le focus au bouton.
3. Tactile : un appui ouvre, un second ferme, un choix referme le burger.
4. Un clic sur « Vases » filtre réellement la grille **et** amène la section sous la
   navbar sans la masquer.
5. `?categorie=vases#boutique` collé directement dans la barre d'adresse ouvre la page
   déjà filtrée.
6. Aucun débordement horizontal de 320 à 1440 px (le script d'audit utilisé
   précédemment reste valable).
7. Chaque famille affiche soit des produits, soit l'état vide — jamais une grille nue.

### Point resté ouvert

Les trois témoignages de `Testimonials.jsx` sont toujours fictifs et le site est
désormais public. À remplacer par de vrais avis ou à retirer avant de communiquer
davantage le lien.

## Decision retenue

Appliquer les corrections de Claude Code et la correction utilisateur finale :

- URL de filtrage au format valide `?categorie=vases#boutique`.
- Sous-menu traite comme un disclosure : bouton `Nos Produits` avec
  `aria-expanded` / `aria-controls`, puis liste de liens, sans `role="menu"` ni
  `aria-haspopup`.
- Un seul etat React pilote l'ouverture desktop et mobile ; le survol desktop est
  limite aux appareils avec souris fine via `matchMedia('(hover: hover) and (pointer: fine)')`.
- Fermeture du sous-menu par Echap avec retour du focus au bouton, et fermeture
  au clic exterieur.
- `CONTACT.tagline` reste la signature de marque. La nouvelle phrase est stockee
  separement dans `CONTACT.heroTitle` et utilisee uniquement comme H1 du hero.
- La famille confirmee par l'utilisateur est `Caches postes`, avec l'id
  `caches-postes`, pour des housses decoratives de postes TV.
- Les sections `Events` et `Gallery` restent dans la page, mais leurs liens sont
  retires de la barre de navigation principale.

## Implementation et verifications

Implementation effectuee :

- Ajout de `src/hooks/useCategorie.js` pour synchroniser la categorie active avec
  l'URL et le bouton Retour du navigateur.
- `App.jsx` partage maintenant la categorie entre `Navbar` et `Boutique`.
- `Navbar.jsx` affiche un sous-menu `Nos Produits` base sur `FAMILLES`, avec
  `Tout le catalogue` en premier lien, puis les 10 familles produits.
- `Boutique.jsx` utilise la categorie active, ajoute `aria-pressed` aux filtres,
  rend la section focusable apres un clic depuis le sous-menu et affiche un etat
  vide de secours.
- `products.js` contient les 10 familles demandees et des cartes "sur devis" pour
  les familles qui n'avaient pas de produit de demonstration.
- `config.js`, `Hero.jsx`, `Contact.jsx`, `Footer.jsx` et `Ticker.jsx` ont ete
  alignes sur les nouveaux horaires, le H1 hero et l'offre produits.
- `Icon.jsx` contient maintenant l'icone `chevron`.
- `index.css` contient les styles du sous-menu, l'etat vide, les horaires
  multi-lignes et `scroll-margin-top` sur `section[id]` : 100 px desktop, 86 px
  sous 900 px.

Verifications effectuees :

- `npm run lint` : OK, avec un avertissement existant dans
  `src/context/CartContext.jsx` sur `react(only-export-components)`.
- `npm run build` : OK.
- Serveur Vite lance sur `http://127.0.0.1:5174/lizzirene/`.
- Requete locale vers `http://127.0.0.1:5174/lizzirene/?categorie=vases#boutique`
  : HTTP 200.
- Recherche statique dans `src/` : aucun ancien id de categorie lie aux pots ne
  reste dans le code.
- Recherche statique dans `src/` : pas d'URL invalide de type fragment + query,
  pas de `aria-haspopup`, pas de `role="menu"`.
- Controle catalogue : 11 categories dont `tous`, 10 familles, 13 produits,
  aucune categorie produit inconnue, aucune famille vide.

## Evolution : page catalogue et fiches produits

### Nouvelle demande utilisateur

- Le site ne doit plus presenter le catalogue comme une section de l'accueil.
- Creer une vraie page `Nos Produits`.
- Ouvrir une fiche dediee quand un visiteur choisit un produit.
- Remplacer `Univers` par `Accueil` et placer `Accueil` avant `Nos Produits`.
- Raccourcir le sous-menu avec une seule entree `Fleurs` ; cette entree doit
  presenter les fleurs naturelles et les fleurs artificielles.

### Avis de Codex

Le routeur React leger deja present peut etre etendu sans ajouter de dependance.
Les URL retenues sont :

- `/lizzirene/` pour l'accueil ;
- `/lizzirene/produits` pour le catalogue ;
- `/lizzirene/produits?categorie=fleurs` pour les deux familles de fleurs ;
- `/lizzirene/produits/<id-produit>` pour une fiche produit ;
- `/lizzirene/contact` pour la page contact existante.

La categorie `fleurs` doit etre une famille de navigation virtuelle. Les
produits conservent leurs categories precises `fleurs-naturelles` et
`fleurs-artificielles`, ce qui permet de les presenter dans deux groupes
clairement titres sur la page catalogue. Les autres familles restent inchangees.

Pour une implementation professionnelle :

1. conserver de vraies URL dans tous les liens afin que le clic milieu, le
   nouvel onglet et le partage fonctionnent ;
2. retirer le catalogue complet de l'accueil et mettre a jour tous les anciens
   liens `#boutique` ;
3. rendre l'image et le nom de chaque carte produit cliquables sans imbriquer
   les boutons `Ajouter` ou `Demander` dans un lien ;
4. proposer sur chaque fiche un fil d'Ariane, le prix ou le devis, le panier ou
   WhatsApp, un retour au catalogue et des produits apparentes ;
5. conserver la compatibilite avec les anciennes URL de boutique en les
   convertissant vers `/produits?categorie=...` ;
6. gerer les produits et chemins inconnus avec un vrai etat introuvable ;
7. mettre a jour le titre et la description de page selon le catalogue ou le
   produit affiche.

### Decision retenue pour cette evolution

L'utilisateur a demande l'implementation directe. Le routeur maison est
conserve, la famille `Fleurs` agrege les deux categories florales et les fiches
utilisent les identifiants produit stables deja presents dans les donnees.

### Implementation et verifications de cette evolution

Implementation effectuee :

- Le routeur maison gere maintenant `accueil`, `produits`, `produit`, `contact`
  et les chemins introuvables.
- La page `src/pages/Produits.jsx` porte le H1 du catalogue et reutilise la
  grille filtree de `Boutique.jsx`.
- La page `src/pages/Produit.jsx` affiche une fiche dediee : fil d'Ariane,
  visuel, categorie, description, prix ou devis, panier / WhatsApp, garanties
  et produits apparentes.
- `src/pages/Introuvable.jsx` couvre les produits inconnus et les chemins 404.
- `ProductCard.jsx` rend le visuel, le nom et la description accessibles par un
  vrai lien vers `/produits/<id>` ; les actions panier et WhatsApp restent des
  controles independants.
- Le catalogue complet a ete retire de l'accueil. Le CTA principal du hero
  ouvre maintenant `/produits?categorie=fleurs`.
- La navigation principale est desormais ordonnee `Accueil`, `Nos Produits`,
  `A propos`, `Contact`. `Univers` a ete retire.
- Le sous-menu utilise une seule famille `Fleurs`. Cette famille agrege les
  categories produit `fleurs-naturelles` et `fleurs-artificielles`, affichees
  dans deux groupes distincts sur le catalogue.
- Les liens du footer, du hero et du bouton `Commander` utilisent les nouvelles
  URL. Les clics modifies (Ctrl / Cmd / Maj) gardent leur comportement natif.
- Les anciennes URL `/?categorie=...#boutique` sont reconnues puis remplacees
  par `/produits?categorie=...` afin de ne casser aucun lien deja partage.
- Le sous-menu se ferme aussi quand le focus clavier quitte sa zone ; le burger
  expose `aria-controls` et se ferme avec Echap.
- Le titre, la meta description et les principales balises Open Graph sont mis
  a jour selon la page ou le produit affiche.

Verifications effectuees :

- `npm run lint` : OK, avec uniquement l'avertissement historique de
  `CartContext.jsx` sur `react(only-export-components)`.
- `npm run build` : OK ; le fallback `dist/404.html` est genere pour GitHub
  Pages.
- Requetes HTTP locales : statut 200 sur `/produits`,
  `/produits?categorie=fleurs` et `/produits/bouquet-fraicheur`.
- Controle Chrome headless de `/produits?categorie=fleurs` : un seul filtre
  `Fleurs` actif, puis deux titres `Fleurs naturelles` et
  `Fleurs artificielles`, avec les bonnes fiches produits.
- Controle Chrome headless de la fiche `bouquet-fraicheur` : titre de document,
  H1, fil d'Ariane, ajout au panier et produits apparentes presents.
- Controle de l'ancienne URL `/?categorie=vases#boutique` : elle affiche le
  catalogue filtre sur les vases.
- Controle d'un id produit inconnu : page 404 produit affichee.
- Inspection visuelle par captures Chrome : catalogue desktop 1440 px et fiche
  produit mobile 390 px conformes, sans debordement visible.
- Recherche statique : aucun ancien lien `#boutique`, aucune entree `Univers`
  dans la navbar, aucune occurrence de `role="menu"` ou `aria-haspopup`, et une
  seule entree publique `Fleurs` dans les familles de navigation.
- Correction visuelle mobile apres inspection de
  `captures/iPhone-13-PRO-localhost.png` : le libelle `Nos Produits` est centre
  sur le meme axe que les autres liens du burger, tandis que le chevron reste
  positionne a droite. Lint et build verifies apres correction.
