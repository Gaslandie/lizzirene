import Reveal from './Reveal.jsx'
import Icon from './Icon.jsx'
import ProductCard from './ProductCard.jsx'
import { FAMILLES, PRODUCTS } from '../data/products.js'
import { intercepterNavigation, urlProduits } from '../utils/navigation.js'

// Une icône par famille, pour que la grille reste lisible tant que les
// photos produit ne sont pas toutes disponibles.
const ICONES = {
  fleurs: 'bouquet',
  plantes: 'leaf',
  vases: 'flower',
  peluches: 'heart',
  'box-cadeaux': 'gift',
  tableaux: 'ecran',
  'materiel-decoratif': 'sparkles',
  luminaire: 'etoile',
  'cache-pots': 'maison',
}

const compterProduits = (famille) =>
  PRODUCTS.filter((produit) => famille.categories.includes(produit.category))
    .length

// Articles mis en avant : un par famille, pour montrer l'étendue de la
// boutique plutôt que quatre bouquets d'affilée. Seuls les produits dont le
// prix est connu sont retenus — l'accueil doit mener à un panier possible.
const PHARES = FAMILLES.reduce((choisis, famille) => {
  if (choisis.length >= 4) return choisis
  const produit = PRODUCTS.find(
    (article) => article.price && famille.categories.includes(article.category),
  )
  return produit ? [...choisis, produit] : choisis
}, [])

function BoutiqueAccueil({ onCategorie, onProduit }) {
  const ouvrir = (event, id) => {
    if (!intercepterNavigation(event)) return
    onCategorie?.(id, { ajouterHistorique: true })
  }

  return (
    <section className="boutique-accueil" id="boutique">
      <div className="container">
        <Reveal>
          <div className="section-head">
            <span className="eyebrow">La boutique en ligne</span>
            <h2>Commandez dès maintenant</h2>
            <p>
              Fleurs fraîches et artificielles, plantes, cadeaux et
              décoration — livrés partout à Conakry, payés à la réception.
            </p>
          </div>
        </Reveal>

        {/* Entrée principale : on choisit sa famille et on arrive au
            catalogue déjà filtré. */}
        <ul className="familles-grille">
          {FAMILLES.map((famille, i) => {
            const nombre = compterProduits(famille)
            return (
              <Reveal key={famille.id} variant="zoom" delay={(i % 5) * 70}>
                <li>
                  <a
                    className="famille-carte"
                    href={urlProduits(famille.id)}
                    onClick={(event) => ouvrir(event, famille.id)}
                  >
                    <span className="famille-icone">
                      <Icon name={ICONES[famille.id] || 'flower'} size={26} />
                    </span>
                    <span className="famille-nom">{famille.label}</span>
                    <span className="famille-compte">
                      {nombre} article{nombre > 1 ? 's' : ''}
                    </span>
                  </a>
                </li>
              </Reveal>
            )
          })}
        </ul>

        {PHARES.length > 0 && (
          <>
            <Reveal>
              <div className="section-head boutique-accueil-sous-titre">
                <h3>Nos créations du moment</h3>
              </div>
            </Reveal>
            <div className="boutique-grid">
              {PHARES.map((produit, i) => (
                <Reveal key={produit.id} variant="zoom" delay={(i % 4) * 80}>
                  <ProductCard produit={produit} onProduit={onProduit} />
                </Reveal>
              ))}
            </div>
          </>
        )}

        <Reveal variant="fade">
          <div className="boutique-accueil-cta">
            <a
              className="btn btn-primary"
              href={urlProduits()}
              onClick={(event) => ouvrir(event, 'tous')}
            >
              Voir tout le catalogue
              <Icon name="arrow" size={18} />
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

export default BoutiqueAccueil
