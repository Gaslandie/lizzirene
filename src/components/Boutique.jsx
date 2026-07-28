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

const ARGUMENTS = [
  {
    icon: 'cash',
    title: 'Paiement à la livraison',
    text: 'Vous payez en espèces à la réception.',
  },
  {
    icon: 'truck',
    title: 'Livraison à Conakry',
    text: 'Toutes communes, 7j/7.',
  },
  {
    icon: 'leaf',
    title: 'Sélection soignée',
    text: 'Des créations choisies et préparées avec attention.',
  },
  {
    icon: 'whatsapp',
    title: 'Catalogue sur WhatsApp',
    text: 'Le catalogue complet en un message.',
  },
]

function GrilleProduits({ produits, onProduit, headingLevel = 'h3' }) {
  return (
    <div className="boutique-grid">
      {produits.map((produit, index) => (
        <Reveal
          key={produit.id}
          variant="zoom"
          delay={(index % 4) * 90}
        >
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
  const produitsVisibles = produitsPourCategorie(categorieActive)
  const groupesFleurs = SOUS_CATEGORIES_FLEURS.map((groupe) => ({
    ...groupe,
    produits: PRODUCTS.filter((produit) => produit.category === groupe.id),
  }))

  return (
    <section className="boutique catalogue" id="catalogue" tabIndex={-1}>
      <div className="container">
        <Reveal>
          <ul className="assurances">
            {ARGUMENTS.map((argument) => (
              <li key={argument.title}>
                <span className="assurance-icon">
                  <Icon name={argument.icon} size={22} />
                </span>
                <div>
                  <strong>{argument.title}</strong>
                  <span>{argument.text}</span>
                </div>
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal>
          <div className="section-head catalogue-head">
            <span className="eyebrow">Toutes nos familles</span>
            <h2>Explorez le catalogue</h2>
            <p>
              Choisissez une famille, découvrez chaque fiche puis ajoutez vos
              coups de cœur au panier ou demandez un devis personnalisé.
            </p>
          </div>
        </Reveal>

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
            Les bouquets démarrent à <strong>300 000 GNF</strong> et évoluent
            selon la quantité de fleurs demandée.
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
