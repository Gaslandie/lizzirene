import { useEffect, useState } from 'react'
import Icon from './Icon.jsx'
import { CONTACT, HERO_IMAGES, waLink } from '../config.js'
import { intercepterNavigation, urlProduits } from '../utils/navigation.js'

const dureeDiapositive = 5000

function Hero({ onCategorie }) {
  const [avant, apres] = CONTACT.heroTitle.split('chaque fleur')
  const [imageActive, setImageActive] = useState(0)
  const [imagesAutorisees, setImagesAutorisees] = useState(() => new Set([0]))
  const [premiereChargee, setPremiereChargee] = useState(false)
  const [enPause, setEnPause] = useState(false)
  const [mouvementReduit, setMouvementReduit] = useState(() =>
    window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  )
  const rotationEnPause = enPause || mouvementReduit

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    const actualiser = () => setMouvementReduit(media.matches)
    media.addEventListener('change', actualiser)
    return () => media.removeEventListener('change', actualiser)
  }, [])

  useEffect(() => {
    if (!premiereChargee || rotationEnPause || HERO_IMAGES.length < 2) {
      return undefined
    }

    const intervalle = window.setInterval(() => {
      setImageActive((index) => (index + 1) % HERO_IMAGES.length)
    }, dureeDiapositive)

    return () => window.clearInterval(intervalle)
  }, [premiereChargee, rotationEnPause])

  // Le premier fond est prioritaire dans son <picture>. La diapositive suivante
  // n'est montée qu'une fois le chargement initial passé, afin de ne pas lancer
  // les trois grandes images en concurrence avec le LCP.
  useEffect(() => {
    if (!premiereChargee || rotationEnPause || HERO_IMAGES.length < 2) {
      return undefined
    }

    const attente = window.setTimeout(() => {
      const prochaine = (imageActive + 1) % HERO_IMAGES.length
      setImagesAutorisees((indices) => {
        if (indices.has(prochaine)) return indices
        return new Set([...indices, prochaine])
      })
    }, 1200)

    return () => window.clearTimeout(attente)
  }, [imageActive, premiereChargee, rotationEnPause])

  const ouvrirFleurs = (event) => {
    if (!intercepterNavigation(event)) return
    onCategorie?.('fleurs', { ajouterHistorique: true })
  }

  const choisirImage = (index) => {
    setImagesAutorisees((indices) =>
      indices.has(index) ? indices : new Set([...indices, index]),
    )
    setImageActive(index)
    setEnPause(true)
  }

  return (
    <section className="hero hero-with-background" id="accueil">
      <div className="hero-background" aria-hidden="true">
        {HERO_IMAGES.map(
          (image, index) =>
            imagesAutorisees.has(index) && (
              <picture
                key={image.src}
                className={`hero-background-image ${
                  imageActive === index ? 'active' : ''
                }`}
                style={{ '--hero-position': image.position }}
              >
                <source media="(max-width: 900px)" srcSet={image.mobileSrc} />
                <img
                  src={image.src}
                  alt=""
                  loading={index === 0 ? 'eager' : 'lazy'}
                  fetchPriority={index === 0 ? 'high' : 'low'}
                  decoding="async"
                  onLoad={
                    index === 0 ? () => setPremiereChargee(true) : undefined
                  }
                  onError={
                    index === 0 ? () => setPremiereChargee(true) : undefined
                  }
                />
              </picture>
            ),
        )}
        <div className="hero-background-overlay" />
      </div>

      <div className="container">
        <div className="hero-content">
          <span className="hero-eyebrow">Kipé · Conakry · Guinée</span>
          <h1 tabIndex={-1}>
            {avant}
            <em>chaque fleur</em>
            {apres}
          </h1>
          <p className="hero-sub">
            Bouquets personnalisés, compositions florales, plantes et box
            cadeaux. Notre nouvelle boutique vous accueille à Kipé — et nous
            livrons partout à Conakry.
          </p>
          <div className="hero-actions">
            <a
              href={urlProduits('fleurs')}
              className="btn btn-primary"
              onClick={ouvrirFleurs}
            >
              Commander un bouquet
            </a>
            <a
              href={waLink(
                'Bonjour Lizzirene Déco ! Je souhaite recevoir votre catalogue.',
              )}
              target="_blank"
              rel="noreferrer"
              className="btn btn-outline"
            >
              Recevoir le catalogue
            </a>
          </div>
          <div className="hero-stats">
            <div>
              <strong>Dès 300 000</strong>
              <span>GNF · prix provisoire</span>
            </div>
            <div>
              <strong>7j/7</strong>
              <span>Livraison à Conakry</span>
            </div>
            <div>
              <strong>Fait main</strong>
              <span>Créations florales</span>
            </div>
          </div>

          <div className="hero-slider-controls" aria-label="Images du hero">
            <button
              type="button"
              className="hero-pause"
              aria-label={
                mouvementReduit
                  ? 'Rotation désactivée par vos préférences de mouvement'
                  : rotationEnPause
                    ? 'Relancer la rotation des images'
                    : 'Mettre en pause la rotation des images'
              }
              aria-pressed={rotationEnPause}
              disabled={mouvementReduit}
              onClick={() => setEnPause((etat) => !etat)}
            >
              <Icon name={rotationEnPause ? 'play' : 'pause'} size={16} />
            </button>
            <div className="hero-dots">
              {HERO_IMAGES.map((image, index) => (
                <button
                  key={image.src}
                  type="button"
                  className={imageActive === index ? 'active' : ''}
                  aria-label={`Afficher : ${image.label}`}
                  aria-pressed={imageActive === index}
                  onClick={() => choisirImage(index)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero
