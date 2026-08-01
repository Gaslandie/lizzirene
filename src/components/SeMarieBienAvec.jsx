import Icon from './Icon.jsx'
import Media from './Media.jsx'
import Reveal from './Reveal.jsx'
import ProductCard from './ProductCard.jsx'
import { useCart } from '../context/CartContext.jsx'
import { PRODUCTS, normaliserCategorie } from '../data/products.js'
import { formatPrice } from '../config.js'

// Le catalogue est littéralement conçu pour le cross-sell : les vases, les
// cache-pots et les peluches SONT les compléments naturels des fleurs et
// des plantes. Le mapping est statique — aucune donnée nouvelle.
const COMPLEMENTS = {
  fleurs: ['vases', 'peluches'],
  plantes: ['cache-pots'],
  vases: ['fleurs'],
  'cache-pots': ['plantes'],
  peluches: ['fleurs'],
  'box-cadeaux': ['peluches', 'fleurs'],
  tableaux: ['luminaire'],
  luminaire: ['tableaux'],
}

// Jamais suggérés : les hommages (une gerbe de deuil n'accompagne pas un
// bouquet cadeau), les produits sans prix (rien à ajouter au panier d'un
// clic) et les produits sans photo (pas de visuel provisoire ici).
const suggerable = (produit) =>
  produit.src && produit.price != null && produit.tag !== 'Hommage'

// Les compléments les moins chers d'abord : l'accessoire à 120 000 GNF posé
// à côté du bouquet à 700 000 monte le panier sans faire réfléchir.
const suggestionsPour = (familleIds, exclure = [], nombre = 3) => {
  const familles = [...new Set(familleIds.map(normaliserCategorie))]
  const cibles = [...new Set(familles.flatMap((id) => COMPLEMENTS[id] || []))]
    // Une famille déjà représentée n'est pas un complément.
    .filter((id) => !familles.includes(id))
  const exclus = new Set(exclure)

  return cibles
    .flatMap((familleId) =>
      PRODUCTS.filter(
        (produit) =>
          normaliserCategorie(produit.category) === familleId &&
          suggerable(produit) &&
          !exclus.has(produit.id),
      ),
    )
    .sort((a, b) => a.price - b.price)
    .slice(0, nombre)
}

// Version fiche produit : une rangée de cartes complètes sous le détail.
export function SeMarieBienAvec({ produit, onProduit }) {
  const suggestions = suggestionsPour([produit.category], [produit.id])
  if (suggestions.length === 0) return null

  return (
    <section className="cross-sell">
      <div className="container">
        <Reveal>
          <div className="section-head">
            <span className="eyebrow">Pour compléter</span>
            <h2>Se marie bien avec</h2>
          </div>
        </Reveal>
        <div className="boutique-grid related-products-grid">
          {suggestions.map((item, index) => (
            <Reveal key={item.id} variant="zoom" delay={index * 90}>
              <ProductCard produit={item} onProduit={onProduit} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

// Version tiroir panier : lignes compactes avec ajout direct, sans quitter
// le panier. Les articles déjà ajoutés disparaissent des suggestions.
export function SuggestionsPanier() {
  const { items, add } = useCart()
  if (items.length === 0) return null

  // Les lignes du panier ne portent que les champs du futur modèle Mongo
  // (id, name, price, qty…) : la catégorie se retrouve par l'id.
  const categories = items
    .map((item) => PRODUCTS.find((produit) => produit.id === item.id)?.category)
    .filter(Boolean)

  const suggestions = suggestionsPour(
    categories,
    items.map((item) => item.id),
    2,
  )
  if (suggestions.length === 0) return null

  return (
    <div className="cart-suggestions">
      <p className="cart-suggestions-titre">Se marie bien avec</p>
      <ul>
        {suggestions.map((produit) => (
          <li key={produit.id}>
            <Media
              src={produit.src}
              srcSet={produit.srcSet}
              sizes="56px"
              alt={produit.alt}
              width={produit.width}
              height={produit.height}
              label={produit.name}
            />
            <div className="cart-suggestion-info">
              <strong>{produit.name}</strong>
              <span className="price">{formatPrice(produit.price)}</span>
            </div>
            <button
              className="cart-suggestion-add"
              onClick={() => add(produit)}
              aria-label={`Ajouter ${produit.name} au panier`}
            >
              <Icon name="plus" size={16} />
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
