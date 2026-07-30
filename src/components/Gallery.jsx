import Media from './Media.jsx'
import Reveal from './Reveal.jsx'
import { PHOTOS } from '../config.js'

const ITEMS = [
  {
    ...PHOTOS.vedette,
    label: 'Composition en pot',
    alt: 'Composition florale en pot noir avec ruban jaune',
    tall: true,
  },
  {
    ...PHOTOS.fleursFraiches,
    label: 'Fleurs fraîches',
  },
  {
    ...PHOTOS.decoFlorale,
    label: 'Décoration florale',
  },
  {
    ...PHOTOS.bouquet,
    label: 'Bouquet de roses',
    alt: 'Bouquet de roses rouges et gerbera blanc emballé de blanc et or',
    tall: true,
  },
  {
    ...PHOTOS.paquetEmballe,
    label: 'Coffret cadeau',
  },
  {
    ...PHOTOS.inspirationFlorale,
    label: 'Inspiration florale',
  },
]

function Gallery() {
  return (
    <section className="gallery" id="galerie">
      <div className="container">
        <Reveal>
          <div className="section-head">
            <span className="eyebrow">En images</span>
            <h2>Inspirations florales & cadeaux</h2>
            <p>
              Des fleurs, des compositions et des attentions qui reflètent
              l'univers Lizzirene Déco.
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
                srcSet={it.srcSet}
                sizes="(max-width: 980px) 50vw, 25vw"
                alt={it.alt}
                width={it.width}
                height={it.height}
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
