import Boutique from '../components/Boutique.jsx'
import Icon from '../components/Icon.jsx'

// Réassurance en une ligne fine — les quatre cartes à pastilles sont
// remplacées : moins de décor, plus vite aux produits.
const REPERES = [
  { icon: 'cash', texte: 'Paiement à la livraison' },
  { icon: 'truck', texte: 'Livraison 7j/7 à Conakry' },
  { icon: 'whatsapp', texte: 'Commande rapide sur WhatsApp' },
]

function Produits({ categorie, onCategorie, onProduit }) {
  return (
    <>
      <header className="page-hero page-hero--catalogue">
        <div className="container">
          <div className="catalogue-entete">
            <div>
              <span className="eyebrow">Catalogue Lizzirene Déco</span>
              <h1 tabIndex={-1}>Nos produits</h1>
              <p>
                Fleurs naturelles et artificielles, plantes, vases, cadeaux et
                décoration — à Kipé ou en livraison à Conakry.
              </p>
            </div>
            <ul className="reassurance-ligne">
              {REPERES.map((repere) => (
                <li key={repere.texte}>
                  <Icon name={repere.icon} size={17} />
                  {repere.texte}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </header>
      <Boutique
        categorie={categorie}
        onCategorie={onCategorie}
        onProduit={onProduit}
      />
    </>
  )
}

export default Produits
