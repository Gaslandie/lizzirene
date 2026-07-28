import { CONTACT } from '../config.js'

const ITEMS = [
  CONTACT.tagline,
  'Bouquets personnalisés',
  'Fleurs fraîches de qualité',
  'Box cadeaux',
  'Vases & caches postes',
  'Luminaires professionnels',
  'Décoration florale d’événements',
  'Livraison à Conakry',
]

// Bandeau défilant façon vitrine — le contenu est doublé pour une boucle fluide.
function Ticker() {
  const line = (key) => (
    <span key={key} aria-hidden={key === 'b'}>
      {ITEMS.map((it) => (
        <span key={it}>
          {it} <span className="sep">✿</span>
        </span>
      ))}
    </span>
  )

  return (
    <div className="ticker">
      <div className="ticker-track">{[line('a'), line('b')]}</div>
    </div>
  )
}

export default Ticker
