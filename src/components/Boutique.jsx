import { useState } from 'react'
import Media from './Media.jsx'
import Reveal from './Reveal.jsx'
import Icon from './Icon.jsx'
import { useCart } from '../context/CartContext.jsx'
import { CATEGORIES, PRODUCTS } from '../data/products.js'
import { formatPrice, waLink } from '../config.js'

const ARGUMENTS = [
  { icon: 'cash', title: 'Paiement à la livraison', text: 'Vous payez en espèces à la réception.' },
  { icon: 'truck', title: 'Livraison à Conakry', text: 'Toutes communes, 7j/7.' },
  { icon: 'leaf', title: 'Fleurs fraîches', text: 'Sélectionnées et montées à la main.' },
  { icon: 'whatsapp', title: 'Catalogue sur WhatsApp', text: 'Le catalogue complet en un message.' },
]

function Boutique() {
  const [filter, setFilter] = useState('tous')
  const { add } = useCart()

  const visible =
    filter === 'tous' ? PRODUCTS : PRODUCTS.filter((p) => p.category === filter)

  return (
    <section className="boutique" id="boutique">
      <div className="container">
        <Reveal>
          <ul className="assurances">
            {ARGUMENTS.map((a) => (
              <li key={a.title}>
                <span className="assurance-icon">
                  <Icon name={a.icon} size={22} />
                </span>
                <div>
                  <strong>{a.title}</strong>
                  <span>{a.text}</span>
                </div>
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal>
          <div className="section-head">
            <span className="eyebrow">La boutique</span>
            <h2>Commandez en quelques clics</h2>
            <p>
              Ajoutez vos créations au panier, indiquez votre adresse et payez
              à la livraison. C'est aussi simple que ça.
            </p>
          </div>
        </Reveal>

        {/* Pas d'animation sur les filtres : ce sont des commandes,
            elles doivent être utilisables immédiatement. */}
        <div className="filters">
          {CATEGORIES.map((c) => (
            <button
              key={c.id}
              className={`filter ${filter === c.id ? 'active' : ''}`}
              onClick={() => setFilter(c.id)}
            >
              {c.label}
            </button>
          ))}
        </div>

        <div className="boutique-grid">
          {visible.map((p, i) => (
            <Reveal key={p.id} variant="zoom" delay={(i % 4) * 90}>
              <article className="product-card">
                <div className="product-media">
                  <Media
                    src={p.src}
                    alt={p.alt}
                    variant={p.variant}
                    label={p.name}
                  />
                  <span className="product-badge">{p.tag}</span>
                </div>
                <div className="product-body">
                  <h3>{p.name}</h3>
                  <p className="product-desc">{p.desc}</p>
                  <div className="product-foot">
                    {p.price ? (
                      <>
                        <span className="price">{formatPrice(p.price)}</span>
                        <button
                          className="btn btn-primary add-btn"
                          onClick={() => add(p)}
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
                            `Bonjour Lizzirene Déco ! Je souhaite un devis pour : ${p.name}.`,
                          )}
                          target="_blank"
                          rel="noreferrer"
                        >
                          <Icon name="whatsapp" size={17} />
                          Demander
                        </a>
                      </>
                    )}
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </div>

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
