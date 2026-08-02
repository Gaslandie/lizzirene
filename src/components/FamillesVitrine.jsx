import Reveal from './Reveal.jsx'
import Icon from './Icon.jsx'
import Media from './Media.jsx'
import { useProducts } from '../context/ProductsContext.jsx'
import { intercepterNavigation, urlProduits } from '../utils/navigation.js'

// Une phrase par famille : la tuile doit dire ce qu'on y trouve, pas
// seulement le nom du rayon.
const PROMESSES = {
  fleurs: 'Bouquets, roses et compositions fraîches, composés à la main.',
  plantes: 'Plantes vertes d’intérieur pour la maison et le bureau.',
  vases: 'Vases en verre coloré ou transparent, à assortir à vos fleurs.',
  peluches: 'Ours et peluches à glisser avec un bouquet.',
  'box-cadeaux': 'Coffrets et paniers garnis, adaptés à l’occasion.',
  tableaux: 'Pièces murales pour habiller un intérieur ou une vitrine.',
  luminaire: 'Suspensions, lustres et plafonniers pour vos espaces.',
  'cache-pots': 'Cache-pots en céramique, du plus sobre au plus texturé.',
}

// Nombre d'articles réellement au catalogue : la tuile ne promet pas un rayon
// vide, et le compteur se met à jour tout seul quand le catalogue grandit.
const compter = (products, famille) =>
  products.filter((produit) => famille.categories.includes(produit.category))
    .length

// Photo de la tuile : le premier article photographié de la famille. Une
// famille sans photo garde le visuel provisoire de `Media` plutôt qu'un trou.
const photoDe = (products, famille) =>
  products.find(
    (produit) => famille.categories.includes(produit.category) && produit.src,
  )

function FamillesVitrine({ familles, titre, chapeau, onCategorie }) {
  const { products } = useProducts()
  const ouvrir = (event, id) => {
    if (!intercepterNavigation(event)) return
    onCategorie?.(id, { ajouterHistorique: true })
  }

  const visibles = familles.filter((famille) => compter(products, famille) > 0)
  if (visibles.length === 0) return null

  return (
    <div className="familles-vitrine">
      {(titre || chapeau) && (
        <Reveal>
          <div className="section-head">
            {titre && <h2>{titre}</h2>}
            {chapeau && <p>{chapeau}</p>}
          </div>
        </Reveal>
      )}
      <div className="familles-grid">
        {visibles.map((famille, i) => {
          const photo = photoDe(products, famille)
          const nombre = compter(products, famille)
          return (
            <Reveal key={famille.id} variant="zoom" delay={(i % 3) * 80}>
              <a
                className="famille-card"
                href={urlProduits(famille.id)}
                onClick={(event) => ouvrir(event, famille.id)}
              >
                <span className="famille-media">
                  <Media
                    src={photo?.src}
                    srcSet={photo?.srcSet}
                    sizes="(max-width: 720px) calc(50vw - 30px), (max-width: 980px) 30vw, 22vw"
                    alt=""
                    width={photo?.width}
                    height={photo?.height}
                    label={famille.label}
                    labelMasque
                  />
                </span>
                <span className="famille-body">
                  <strong>{famille.label}</strong>
                  <span className="famille-promesse">
                    {PROMESSES[famille.id]}
                  </span>
                  <span className="famille-lien">
                    {nombre > 1 ? `Voir les ${nombre} articles` : 'Voir l’article'}
                    <Icon name="arrow" size={16} />
                  </span>
                </span>
              </a>
            </Reveal>
          )
        })}
      </div>
    </div>
  )
}

export default FamillesVitrine
