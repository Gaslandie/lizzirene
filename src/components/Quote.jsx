import Reveal from './Reveal.jsx'

// Citation signature de la boutique (reprise de leur page Facebook).
function Quote() {
  return (
    <section className="quote">
      <div className="container">
        <Reveal variant="blur">
          <span className="quote-mark">❝</span>
          <blockquote>
            Aimer, c'est beau. Mais les gestes d'amour, c'est encore mieux.
          </blockquote>
          <span className="quote-sign">Lizzirene Déco</span>
        </Reveal>
      </div>
    </section>
  )
}

export default Quote
