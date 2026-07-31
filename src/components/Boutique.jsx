import Icon from './Icon.jsx'
import ProductCard from './ProductCard.jsx'
import Reveal from './Reveal.jsx'
import {
  CATEGORIES,
  PRODUCTS,
  SOUS_CATEGORIES_FLEURS,
  normaliserCategorie,
  produitsPourCategorie,
} from '../data/products.js'
import { waLink } from '../config.js'

// Ordre d'affichage : produits photographiés d'abord — les visuels
// provisoires ne font jamais la première impression. Au sein des
// photographiés, les compositions de deuil passent après les autres :
// elles ont leur place au catalogue, pas en tête de gondole entre un
// bouquet cadeau et un bouquet de mariée.
const rang = (produit) =>
  (produit.src ? 0 : 2) + (produit.tag === 'Hommage' ? 1 : 0)

const photosDAbord = (produits) =>
  [...produits].sort((a, b) => rang(a) - rang(b))

function GrilleProduits({ produits, onProduit, headingLevel = 'h3' }) {
  return (
    <div className="boutique-grid">
      {produits.map((produit, index) => (
        <Reveal key={produit.id} variant="zoom" delay={(index % 4) * 90}>
          <ProductCard
            produit={produit}
            onProduit={onProduit}
            headingLevel={headingLevel}
          />
        </Reveal>
      ))}
    </div>
  )
}

function Boutique({ categorie = 'tous', onCategorie, onProduit }) {
  const categorieActive = normaliserCategorie(categorie)
  const familleActive = CATEGORIES.find(({ id }) => id === categorieActive)
  const produitsVisibles = photosDAbord(produitsPourCategorie(categorieActive))
  const groupesFleurs = SOUS_CATEGORIES_FLEURS.map((groupe) => ({
    ...groupe,
    produits: photosDAbord(
      PRODUCTS.filter((produit) => produit.category === groupe.id),
    ),
  }))

  const nombreVisible =
    categorieActive === 'fleurs'
      ? groupesFleurs.reduce((total, groupe) => total + groupe.produits.length, 0)
      : produitsVisibles.length

  return (
    <section className="boutique catalogue" id="catalogue" tabIndex={-1}>
      <div className="container">
        {/* Filtres à gauche, compteur à droite : une barre d'outils,
            pas une section de plus. */}
        <div className="catalogue-barre">
          <div className="filters" aria-label="Filtrer les produits">
            {CATEGORIES.map((item) => (
              <button
                key={item.id}
                className={`filter ${
                  categorieActive === item.id ? 'active' : ''
                }`}
                aria-pressed={categorieActive === item.id}
                onClick={() => onCategorie?.(item.id)}
              >
                {item.label}
              </button>
            ))}
          </div>
          <p className="catalogue-compte" aria-live="polite">
            {nombreVisible} article{nombreVisible > 1 ? 's' : ''}
          </p>
        </div>

        {categorieActive === 'fleurs' ? (
          <div className="flower-groups">
            {groupesFleurs.map((groupe) => (
              <div className="product-group" key={groupe.id}>
                <div className="product-group-head">
                  <h3>{groupe.label}</h3>
                  <span>
                    {groupe.produits.length} création
                    {groupe.produits.length > 1 ? 's' : ''}
                  </span>
                </div>
                {groupe.produits.length > 0 ? (
                  <GrilleProduits
                    produits={groupe.produits}
                    onProduit={onProduit}
                    headingLevel="h4"
                  />
                ) : (
                  <p className="product-group-empty">
                    Cette sélection sera enrichie prochainement.
                  </p>
                )}
              </div>
            ))}
          </div>
        ) : produitsVisibles.length > 0 ? (
          <GrilleProduits
            key={categorieActive}
            produits={produitsVisibles}
            onProduit={onProduit}
          />
        ) : (
          <Reveal variant="fade">
            <div className="empty-products">
              <Icon name="flower" size={32} />
              <h3>{familleActive?.label || 'Cette famille'} arrive bientôt</h3>
              <p>
                Cette famille sera enrichie prochainement. Demandez le catalogue
                complet sur WhatsApp pour voir les disponibilités du moment.
              </p>
              <a
                className="btn btn-whatsapp"
                href={waLink(
                  `Bonjour Lizzirene Déco ! Je souhaite connaître vos disponibilités pour : ${familleActive?.label || 'vos produits'}.`,
                )}
                target="_blank"
                rel="noreferrer"
              >
                <Icon name="whatsapp" size={18} />
                Demander le catalogue
              </a>
            </div>
          </Reveal>
        )}

        <Reveal variant="fade">
          <p className="boutique-note">
            {categorieActive === 'fleurs' ? (
              <>
                Les bouquets démarrent à <strong>300 000 GNF</strong> et sont
                composés selon l’occasion, les couleurs et le volume souhaité.
              </>
            ) : categorieActive === 'box-cadeaux' ? (
              <>
                Les créations cadeaux démarrent à <strong>500 000 GNF</strong>.
                Leur contenu est adapté à l’occasion et à vos envies.
              </>
            ) : (
              <>
                Les prix et disponibilités du catalogue sont confirmés avec
                vous avant chaque commande.
              </>
            )}
            <a
              href={waLink(
                'Bonjour Lizzirene Déco ! Je souhaite recevoir votre catalogue complet.',
              )}
              target="_blank"
              rel="noreferrer"
            >
              Recevoir le catalogue complet sur WhatsApp
              <Icon name="arrow" size={17} />
            </a>
          </p>
        </Reveal>
      </div>
    </section>
  )
}

export default Boutique
