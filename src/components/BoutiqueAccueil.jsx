import Reveal from './Reveal.jsx'
import Icon from './Icon.jsx'
import ProductCard from './ProductCard.jsx'
import FamillesVitrine from './FamillesVitrine.jsx'
import { FAMILLES, normaliserCategorie } from '../data/products.js'
import { useProducts } from '../context/ProductsContext.jsx'
import { intercepterNavigation, urlProduits } from '../utils/navigation.js'

// L'accueil ne montre pas tout le catalogue : deux familles suffisent à
// donner envie, la boutique fait le reste. Chaque rangée n'aligne que des
// produits photographiés, et des photos différentes les unes des autres —
// pas de visuel provisoire ici, c'est la vitrine.
const RANGEES = [
  {
    id: 'fleurs',
    eyebrow: 'Fleurs fraîches',
    titre: 'Des bouquets faits main',
    produits: [
      'bouquet-roses-naturelles',
      'bouquet-roses-colorees',
      'bouquet-seoul',
      'bouquet-de-fleurs-jaune-blanc',
    ],
  },
  {
    id: 'plantes',
    eyebrow: 'Plantes d’intérieur',
    titre: 'Du vert pour la maison et le bureau',
    produits: ['palmier-cuillere', 'terrarium', 'pachira-arbre-argent', 'bambou'],
  },
]

// Les autres familles avaient été reléguées à une phrase de liens texte :
// six rayons sur huit y devenaient invisibles. Elles ont maintenant chacune
// leur tuile illustrée.
const AUTRES_FAMILLES = FAMILLES.filter(
  (famille) => !['fleurs', 'plantes'].includes(famille.id),
)

function BoutiqueAccueil({ onCategorie, onProduit }) {
  const { products } = useProducts()
  const produitsDe = (rangee) => {
    const vedettes = products
      .filter(
        (produit) =>
          produit.featuredHome &&
          normaliserCategorie(produit.category) === rangee.id &&
          produit.src &&
          produit.availability !== 'out_of_stock',
      )
      .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0))

    const source = vedettes.length > 0
      ? vedettes
      : rangee.produits
          .map((id) => products.find((produit) => produit.id === id))
          .filter(Boolean)

    return source.filter((produit) => produit.src).slice(0, 4)
      .filter((produit) => produit.availability !== 'out_of_stock')
  }
  const ouvrir = (event, id) => {
    if (!intercepterNavigation(event)) return
    onCategorie?.(id, { ajouterHistorique: true })
  }

  return (
    <section className="boutique-accueil" id="boutique">
      <div className="container">
        {RANGEES.map((rangee, r) => {
          const produits = produitsDe(rangee)
          if (produits.length === 0) return null
          return (
            <div className="rayon" key={rangee.id}>
              <Reveal>
                <header className="rayon-tete">
                  <div>
                    <span className="eyebrow">{rangee.eyebrow}</span>
                    <h2>{rangee.titre}</h2>
                  </div>
                  <a
                    className="rayon-lien"
                    href={urlProduits(rangee.id)}
                    onClick={(event) => ouvrir(event, rangee.id)}
                  >
                    Voir tout
                    <Icon name="arrow" size={17} />
                  </a>
                </header>
              </Reveal>
              <div className="boutique-grid">
                {produits.map((produit, i) => (
                  <Reveal
                    key={produit.id}
                    variant="zoom"
                    delay={(i % 4) * 80 + (r ? 60 : 0)}
                  >
                    <ProductCard produit={produit} onProduit={onProduit} />
                  </Reveal>
                ))}
              </div>
            </div>
          )
        })}

        <FamillesVitrine
          familles={AUTRES_FAMILLES}
          titre="Et aussi, dans la boutique"
          chapeau="Vases, cache-pots, coffrets, peluches, luminaires et pièces décoratives — de quoi accompagner un bouquet ou habiller un intérieur."
          onCategorie={onCategorie}
        />

        <Reveal variant="fade">
          <div className="boutique-accueil-suite">
            <a
              className="btn btn-primary"
              href={urlProduits()}
              onClick={(event) => ouvrir(event, 'tous')}
            >
              Découvrir toute la boutique
              <Icon name="arrow" size={18} />
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

export default BoutiqueAccueil
