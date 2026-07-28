import Boutique from '../components/Boutique.jsx'

function Produits({ categorie, onCategorie, onProduit }) {
  return (
    <>
      <header className="page-hero products-hero">
        <div className="container">
          <span className="eyebrow">Catalogue Lizzirene Déco</span>
          <h1 tabIndex={-1}>Nos produits</h1>
          <p>
            Découvrez nos fleurs naturelles et artificielles, plantes, vases,
            cadeaux et sélections décoratives, disponibles à Kipé ou en
            livraison à Conakry.
          </p>
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
