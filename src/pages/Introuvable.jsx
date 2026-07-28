import Icon from '../components/Icon.jsx'
import { intercepterNavigation, urlAccueil, urlProduits } from '../utils/navigation.js'

function Introuvable({ produit = false, onAller }) {
  const retour = (event, page) => {
    if (!intercepterNavigation(event)) return
    onAller?.(page)
  }

  return (
    <section className="not-found">
      <div className="container">
        <span className="not-found-icon">
          <Icon name="flower" size={42} strokeWidth={1.4} />
        </span>
        <span className="eyebrow">Erreur 404</span>
        <h1 tabIndex={-1}>
          {produit ? 'Ce produit est introuvable' : 'Cette page est introuvable'}
        </h1>
        <p>
          {produit
            ? "Il a peut-être changé d'adresse ou n'est plus dans le catalogue actuel."
            : "Le lien utilisé n'existe plus ou contient peut-être une erreur."}
        </p>
        <div className="not-found-actions">
          <a
            href={urlProduits()}
            className="btn btn-primary"
            onClick={(event) => retour(event, 'produits')}
          >
            Voir nos produits
            <Icon name="arrow" size={18} />
          </a>
          <a
            href={urlAccueil()}
            className="btn btn-outline"
            onClick={(event) => retour(event, 'accueil')}
          >
            Retour à l'accueil
          </a>
        </div>
      </div>
    </section>
  )
}

export default Introuvable
