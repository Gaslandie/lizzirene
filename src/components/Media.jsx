import Icon from './Icon.jsx'

// Affiche une vraie photo si `src` est fourni, sinon un visuel provisoire
// aux couleurs de la marque. Ajouter une photo = passer `src` à l'appel.
const GRADIENTS = {
  teal: 'linear-gradient(150deg, #36c0c0, #2a585c)',
  slate: 'linear-gradient(150deg, #2a585c, #1d3f42)',
  sun: 'linear-gradient(150deg, #fbdd13, #36c0c0)',
  soft: 'linear-gradient(150deg, #8fd9d9, #36c0c0)',
}

function Media({ src, alt, variant = 'teal', label, className = '', style }) {
  if (src) {
    return (
      <div className={`media ${className}`} style={style}>
        <img src={src} alt={alt || label || ''} loading="lazy" />
      </div>
    )
  }

  return (
    <div
      className={`placeholder ${className}`}
      style={{ background: GRADIENTS[variant] || GRADIENTS.teal, ...style }}
      role="img"
      aria-label={label || 'Photo à venir'}
    >
      <Icon name="flower" size={56} strokeWidth={1.2} />
      {label && <span className="ph-label">{label}</span>}
    </div>
  )
}

export default Media
