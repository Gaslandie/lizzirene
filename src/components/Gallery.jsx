import Media from './Media.jsx'
import Reveal from './Reveal.jsx'
import { PHOTOS } from '../config.js'

const ITEMS = [
  {
    src: PHOTOS.vedette,
    label: 'Composition en pot',
    alt: 'Composition florale en pot noir avec ruban jaune',
    tall: true,
  },
  { variant: 'sun', label: 'Bouquet anniversaire' },
  { variant: 'slate', label: 'Salon décoré' },
  {
    src: PHOTOS.bouquet,
    label: 'Bouquet de roses',
    alt: 'Bouquet de roses rouges et gerbera blanc emballé de blanc et or',
    tall: true,
  },
  { variant: 'slate', label: 'Table de mariage' },
  { variant: 'teal', label: 'Vitrine boutique' },
]

function Gallery() {
  return (
    <section className="gallery" id="galerie">
      <div className="container">
        <Reveal>
          <div className="section-head">
            <span className="eyebrow">Galerie</span>
            <h2>Nos réalisations en images</h2>
            <p>
              Un aperçu de nos créations — les visuels restants seront
              remplacés par les photos de la boutique.
            </p>
          </div>
        </Reveal>
        <div className="gallery-grid">
          {ITEMS.map((it, i) => (
            <Reveal
              key={it.label}
              variant="zoom"
              delay={i * 90}
              className={it.tall ? 'tall' : ''}
            >
              <Media
                src={it.src}
                alt={it.alt}
                variant={it.variant}
                label={it.label}
              />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Gallery
