import Reveal from './Reveal.jsx'
import Icon from './Icon.jsx'
import ProductCard from './ProductCard.jsx'
import { FAMILLES, PRODUCTS } from '../data/products.js'
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

// Les autres familles ne sont citées qu'en liens texte : l'exploration
// complète se fait dans la boutique.
const AUTRES_FAMILLES = FAMILLES.filter(
  (famille) => !['fleurs', 'plantes'].includes(famille.id),
)

const produitsDe = (ids) =>
  ids
    .map((id) => PRODUCTS.find((produit) => produit.id === id))
    .filter((produit) => produit && produit.src)

function BoutiqueAccueil({ onCategorie, onProduit }) {
  const ouvrir = (event, id) => {
    if (!intercepterNavigation(event)) return
    onCategorie?.(id, { ajouterHistorique: true })
  }

  return (
    <section className="boutique-accueil" id="boutique">
      <div className="container">
        {RANGEES.map((rangee, r) => {
          const produits = produitsDe(rangee.produits)
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

        <Reveal variant="fade">
          <div className="boutique-accueil-suite">
            <p>
              Et aussi{' '}
              {AUTRES_FAMILLES.map((famille, i) => (
                <span key={famille.id}>
                  <a
                    href={urlProduits(famille.id)}
                    onClick={(event) => ouvrir(event, famille.id)}
                  >
                    {famille.label.toLowerCase()}
                  </a>
                  {i < AUTRES_FAMILLES.length - 2 && ', '}
                  {i === AUTRES_FAMILLES.length - 2 && ' et '}
                </span>
              ))}
              .
            </p>
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
