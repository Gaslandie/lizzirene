import { useEffect, useRef, useState } from 'react'
import Icon from './Icon.jsx'
import { intercepterNavigation } from '../utils/navigation.js'

// Motif « disclosure » : un bouton qui déplie un panneau de liens.
// Pas de role="menu" — ce sont des liens de navigation, Tab doit y circuler
// normalement. Le survol n'est qu'une amélioration sur les appareils à souris ;
// le clic marche partout, Échap et le clic extérieur referment.
const hoverDisponible = () =>
  window.matchMedia('(hover: hover) and (pointer: fine)').matches

function MenuDeroulant({
  id,
  libelle,
  actif = false,
  entrees,
  valeurActive,
  onChoisir,
  onNaviguer,
}) {
  const [ouvert, setOuvert] = useState(false)
  const zoneRef = useRef(null)
  const boutonRef = useRef(null)
  const fermetureRef = useRef()

  useEffect(() => {
    if (!ouvert) return undefined

    const fermerHorsZone = (event) => {
      if (!zoneRef.current?.contains(event.target)) setOuvert(false)
    }

    const fermerEchap = (event) => {
      if (event.key !== 'Escape') return
      setOuvert(false)
      boutonRef.current?.focus()
    }

    document.addEventListener('pointerdown', fermerHorsZone)
    document.addEventListener('keydown', fermerEchap)

    return () => {
      document.removeEventListener('pointerdown', fermerHorsZone)
      document.removeEventListener('keydown', fermerEchap)
    }
  }, [ouvert])

  useEffect(() => () => clearTimeout(fermetureRef.current), [])

  const ouvrirAuSurvol = () => {
    if (!hoverDisponible()) return
    clearTimeout(fermetureRef.current)
    setOuvert(true)
  }

  const fermerAuSurvol = () => {
    if (!hoverDisponible()) return
    // Court délai : la souris doit pouvoir traverser l'espace entre le
    // bouton et le panneau sans que celui-ci clignote.
    fermetureRef.current = setTimeout(() => setOuvert(false), 160)
  }

  const fermerAuDepartDuFocus = (event) => {
    if (!zoneRef.current?.contains(event.relatedTarget)) setOuvert(false)
  }

  const choisir = (event, valeur) => {
    if (!intercepterNavigation(event)) return
    onChoisir?.(valeur)
    setOuvert(false)
    onNaviguer?.()
  }

  return (
    <div
      className="nav-produits"
      ref={zoneRef}
      onMouseEnter={ouvrirAuSurvol}
      onMouseLeave={fermerAuSurvol}
      onBlur={fermerAuDepartDuFocus}
    >
      <button
        ref={boutonRef}
        type="button"
        className={`nav-produits-btn ${actif ? 'active-page' : ''}`}
        aria-expanded={ouvert}
        aria-controls={id}
        onClick={() => setOuvert((etat) => !etat)}
      >
        {libelle}
        <Icon name="chevron" size={16} className={ouvert ? 'pivote' : ''} />
      </button>

      <ul id={id} className={`sous-menu ${ouvert ? 'ouvert' : ''}`}>
        {entrees.map((entree) => (
          <li key={entree.valeur}>
            <a
              href={entree.href}
              aria-current={
                actif && valeurActive === entree.valeur ? 'page' : undefined
              }
              onClick={(event) => choisir(event, entree.valeur)}
            >
              {entree.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default MenuDeroulant
