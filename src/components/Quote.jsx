import Reveal from './Reveal.jsx'
import Media from './Media.jsx'
import { PHOTOS } from '../config.js'

// Citation signature de la boutique (reprise de leur page Facebook),
// illustrée par la réaction d'une cliente à la réception de sa commande —
// c'est exactement le « geste d'amour » dont parle la phrase.
function Quote() {
  return (
    <section className="quote">
      <div className="container">
        <Reveal variant="left">
          <div className="quote-visuel">
            <Media
              src={PHOTOS.clienteComblee.src}
              srcSet={PHOTOS.clienteComblee.srcSet}
              sizes={PHOTOS.clienteComblee.sizes}
              width={PHOTOS.clienteComblee.width}
              height={PHOTOS.clienteComblee.height}
              alt={PHOTOS.clienteComblee.alt}
            />
          </div>
        </Reveal>
        <Reveal variant="right" delay={120}>
          <div className="quote-texte">
            <span className="quote-mark">❝</span>
            <blockquote>
              Aimer, c'est beau. Mais les gestes d'amour, c'est encore mieux.
            </blockquote>
            <span className="quote-sign">Lizzirene Déco</span>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

export default Quote
