import Icon from '../components/Icon.jsx'
import Media from '../components/Media.jsx'
import ProductCard from '../components/ProductCard.jsx'
import Reveal from '../components/Reveal.jsx'
import { useCart } from '../context/CartContext.jsx'
import {
  LIBELLES_CATEGORIES_PRODUITS,
  normaliserCategorie,
  produitsPourCategorie,
  trouverProduit,
} from '../data/products.js'
import { formatPrice, waLink } from '../config.js'
import {
  intercepterNavigation,
  urlAccueil,
  urlProduits,
} from '../utils/navigation.js'
import Introuvable from './Introuvable.jsx'

function Produit({ produitId, onAller, onCategorie, onProduit }) {
  const { add } = useCart()
  const produit = trouverProduit(produitId)

  if (!produit) return <Introuvable produit onAller={onAller} />

  const famille = normaliserCategorie(produit.category)
  const libelleCategorie = LIBELLES_CATEGORIES_PRODUITS[produit.category]
  const produitsApparentes = produitsPourCategorie(famille)
    .filter((item) => item.id !== produit.id)
    .slice(0, 3)

  const allerAccueil = (event) => {
    if (!intercepterNavigation(event)) return
    onAller?.('accueil')
  }

  const allerCatalogue = (event) => {
    if (!intercepterNavigation(event)) return
    onCategorie?.(famille, { ajouterHistorique: true })
  }

  return (
    <>
      <section className="product-page">
        <div className="container">
          <nav className="breadcrumbs" aria-label="Fil d'Ariane">
            <a href={urlAccueil()} onClick={allerAccueil}>
              Accueil
            </a>
            <Icon name="chevron" size={14} />
            <a href={urlProduits(famille)} onClick={allerCatalogue}>
              Nos produits
            </a>
            <Icon name="chevron" size={14} />
            <span aria-current="page">{produit.name}</span>
          </nav>

          <div className="product-detail">
            <Reveal variant="left">
              <div className="product-detail-visual">
                <Media
                  src={produit.src}
                  srcSet={produit.srcSet}
                  sizes="(max-width: 720px) calc(100vw - 40px), (max-width: 980px) 620px, 560px"
                  alt={produit.alt}
                  width={produit.width}
                  height={produit.height}
                  loading="eager"
                  fetchPriority="high"
                  variant={produit.variant}
                  label={produit.name}
                />
                <span className="product-badge">{produit.tag}</span>
              </div>
            </Reveal>

            <Reveal variant="right" delay={100}>
              <div className="product-detail-content">
                <span className="product-detail-category">
                  {libelleCategorie}
                </span>
                <h1 tabIndex={-1}>{produit.name}</h1>
                <p className="product-detail-description">{produit.desc}</p>
                <div className="product-detail-price">
                  {produit.price != null ? (
                    <>
                      {produit.prixPrefixe && (
                        <small>{produit.prixPrefixe}</small>
                      )}
                      <span>{formatPrice(produit.price)}</span>
                      {produit.prixProvisoire && (
                        <small>Prix provisoire — à confirmer</small>
                      )}
                    </>
                  ) : (
                    'Prix sur devis'
                  )}
                </div>

                <div className="product-detail-actions">
                  {produit.price != null ? (
                    <button
                      className="btn btn-primary"
                      onClick={() => add(produit)}
                    >
                      <Icon name="plus" size={18} />
                      Ajouter au panier
                    </button>
                  ) : (
                    <a
                      className="btn btn-whatsapp"
                      href={waLink(
                        `Bonjour Lizzirene Déco ! Je souhaite un devis pour : ${produit.name}.`,
                      )}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <Icon name="whatsapp" size={19} />
                      Demander un devis
                    </a>
                  )}
                  <a
                    className="btn btn-outline"
                    href={waLink(
                      `Bonjour Lizzirene Déco ! J'aimerais en savoir plus sur : ${produit.name}.`,
                    )}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <Icon name="whatsapp" size={18} />
                    Poser une question
                  </a>
                </div>

                <ul className="product-detail-points">
                  <li>
                    <Icon name="check" size={16} />
                    Préparé avec soin à la boutique de Kipé
                  </li>
                  <li>
                    <Icon name="truck" size={17} />
                    Livraison disponible partout à Conakry
                  </li>
                  <li>
                    <Icon name="cash" size={17} />
                    Paiement à la livraison
                  </li>
                </ul>

                <a
                  className="back-to-products"
                  href={urlProduits(famille)}
                  onClick={allerCatalogue}
                >
                  <Icon name="arrow" size={17} />
                  Retour à {famille === 'fleurs' ? 'nos fleurs' : 'la famille'}
                </a>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {produitsApparentes.length > 0 && (
        <section className="related-products">
          <div className="container">
            <Reveal>
              <div className="section-head">
                <span className="eyebrow">À découvrir aussi</span>
                <h2>Dans la même famille</h2>
              </div>
            </Reveal>
            <div className="boutique-grid related-products-grid">
              {produitsApparentes.map((item, index) => (
                <Reveal key={item.id} variant="zoom" delay={index * 90}>
                  <ProductCard produit={item} onProduit={onProduit} />
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  )
}

export default Produit
