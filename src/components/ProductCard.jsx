import Icon from './Icon.jsx'
import Media from './Media.jsx'
import { useCart } from '../context/CartContext.jsx'
import { LIBELLES_CATEGORIES_PRODUITS } from '../data/products.js'
import { formatPrice, waLink } from '../config.js'
import { intercepterNavigation, urlProduit } from '../utils/navigation.js'

function ProductCard({ produit, onProduit, headingLevel = 'h3' }) {
  const { add } = useCart()
  const categorie = LIBELLES_CATEGORIES_PRODUITS[produit.category]
  const Heading = headingLevel

  const ouvrirProduit = (event) => {
    if (!intercepterNavigation(event)) return
    onProduit?.(produit.id)
  }

  return (
    <article className="product-card">
      <a
        className="product-detail-link"
        href={urlProduit(produit.id)}
        onClick={ouvrirProduit}
        aria-label={`Voir la fiche de ${produit.name}`}
      >
        <div className="product-media">
          <Media
            src={produit.src}
            srcSet={produit.srcSet}
            sizes={produit.sizes}
            alt={produit.alt}
            width={produit.width}
            height={produit.height}
            variant={produit.variant}
            label={produit.name}
            style={
              produit.imagePosition
                ? { '--media-position': produit.imagePosition }
                : undefined
            }
          />
          <span className="product-badge">{produit.tag}</span>
        </div>
        <div className="product-body">
          {categorie && <span className="product-category">{categorie}</span>}
          <Heading>{produit.name}</Heading>
          <p className="product-desc">{produit.desc}</p>
          <span className="product-discover" aria-hidden="true">
            Voir la fiche
            <Icon name="arrow" size={16} />
          </span>
        </div>
      </a>

      <div className="product-foot">
        {produit.price != null ? (
          <>
            <div className="price-stack">
              {produit.prixPrefixe && (
                <small className="price-prefix">{produit.prixPrefixe}</small>
              )}
              <span className="price">{formatPrice(produit.price)}</span>
            </div>
            <button
              className="btn btn-primary add-btn"
              onClick={() => add(produit)}
              aria-label={`Ajouter ${produit.name} au panier`}
            >
              <Icon name="plus" size={17} />
              Ajouter
            </button>
          </>
        ) : (
          <>
            <span className="price price-devis">Sur devis</span>
            <a
              className="btn btn-whatsapp add-btn"
              href={waLink(
                `Bonjour Lizzirene Déco ! Je souhaite un devis pour : ${produit.name}.`,
              )}
              target="_blank"
              rel="noreferrer"
              aria-label={`Demander un devis pour ${produit.name} sur WhatsApp`}
            >
              <Icon name="whatsapp" size={17} />
              Demander
            </a>
          </>
        )}
      </div>
    </article>
  )
}

export default ProductCard
