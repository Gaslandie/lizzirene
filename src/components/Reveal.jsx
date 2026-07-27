import { useEffect, useRef } from 'react'

// Fait apparaître son contenu quand il entre dans l'écran.
// variant : up | left | right | zoom | blur | fade
function Reveal({ children, variant = 'up', delay = 0, className = '' }) {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    // Déjà visible au chargement (haut de page) : on affiche sans attendre.
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('visible')
          obs.disconnect()
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -60px 0px' },
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      className={`reveal reveal-${variant} ${className}`}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </div>
  )
}

export default Reveal
