import { useState } from 'react'
import Icon from './Icon.jsx'
import ProductCard from './ProductCard.jsx'
import Reveal from './Reveal.jsx'
import FlowerAvailability from './FlowerAvailability.jsx'
import {
  CATEGORIES,
  LIBELLES_CATEGORIES_PRODUITS,
  SOUS_CATEGORIES_FLEURS,
  normaliserCategorie,
} from '../data/products.js'
import { useProducts } from '../context/ProductsContext.jsx'
import { waLink } from '../config.js'

// Ordre d'affichage : produits photographiés d'abord — les visuels
// provisoires ne font jamais la première impression. Au sein des
// photographiés, les compositions de deuil passent après les autres :
// elles ont leur place au catalogue, pas en tête de gondole entre un
// bouquet cadeau et un bouquet de mariée.
const rang = (produit) =>
  (produit.src ? 0 : 2) + (produit.tag === 'Hommage' ? 1 : 0)

const photosDAbord = (produits) =>
  [...produits].sort((a, b) => rang(a) - rang(b))

// Le budget est le premier critère d'achat d'un cadeau : les prix vont de
// 250 000 à plus de 10 000 000 GNF. Bornes calées sur la distribution
// réelle du catalogue ; « Sur devis » regroupe les produits sans prix.
const BUDGETS = [
  { id: 'tous', label: 'Tous les budgets', test: () => true },
  {
    id: 'moins-500',
    label: 'Jusqu’à 500 000',
    test: (p) => p.price != null && p.price <= 500000,
  },
  {
    id: '500-1500',
    label: '500 000 – 1 500 000',
    test: (p) => p.price != null && p.price > 500000 && p.price <= 1500000,
  },
  {
    id: 'plus-1500',
    label: 'Plus de 1 500 000',
    test: (p) => p.price != null && p.price > 1500000,
  },
  { id: 'devis', label: 'Sur devis', test: (p) => p.price == null },
]

const TRIS = [
  { id: 'reco', label: 'Notre sélection' },
  { id: 'prix-asc', label: 'Prix croissant' },
  { id: 'prix-desc', label: 'Prix décroissant' },
]

// « Bouquet seoul » doit trouver « Bouquet Séoul » : accents ignorés,
// et « oeillet » trouve « œillet ».
const normaliser = (chaine) =>
  chaine
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/œ/g, 'oe')

function GrilleProduits({ produits, onProduit, headingLevel = 'h3' }) {
  return (
    <div className="boutique-grid">
      {produits.map((produit, index) => (
        <Reveal key={produit.id} variant="zoom" delay={(index % 4) * 90}>
          <ProductCard
            produit={produit}
            onProduit={onProduit}
            headingLevel={headingLevel}
          />
        </Reveal>
      ))}
    </div>
  )
}

function Boutique({ categorie = 'tous', onCategorie, onProduit }) {
  const { products, productsForCategory, source, error } = useProducts()
  const [recherche, setRecherche] = useState('')
  const [budget, setBudget] = useState('tous')
  const [tri, setTri] = useState('reco')

  const categorieActive = normaliserCategorie(categorie)
  const familleActive = CATEGORIES.find(({ id }) => id === categorieActive)
  const budgetActif = BUDGETS.find(({ id }) => id === budget) || BUDGETS[0]
  const filtresActifs = recherche.trim() !== '' || budget !== 'tous'

  const correspond = (produit) => {
    if (!budgetActif.test(produit)) return false
    const requete = normaliser(recherche.trim())
    if (!requete) return true
    const libelle = LIBELLES_CATEGORIES_PRODUITS[produit.category] || ''
    return normaliser(`${produit.name} ${produit.desc} ${libelle}`).includes(
      requete,
    )
  }

  // Le tri éditorial (photos d'abord, hommages après) reste le tri de base.
  // Les tris par prix s'appuient dessus : à prix égal, l'ordre éditorial
  // est conservé (le tri des tableaux est stable). Les « sur devis » vont
  // en fin de liste — un prix inconnu ne peut pas se classer.
  const trier = (produits) => {
    const base = photosDAbord(produits)
    if (tri === 'reco') return base
    const sens = tri === 'prix-asc' ? 1 : -1
    return [...base].sort((a, b) => {
      if (a.price == null && b.price == null) return 0
      if (a.price == null) return 1
      if (b.price == null) return -1
      return (a.price - b.price) * sens
    })
  }

  const preparer = (produits) => trier(produits.filter(correspond))

  const produitsVisibles = preparer(productsForCategory(categorieActive))
  const groupesFleurs = SOUS_CATEGORIES_FLEURS.map((groupe) => ({
    ...groupe,
    produits: preparer(
      products.filter((produit) => produit.category === groupe.id),
    ),
  }))

  const nombreVisible =
    categorieActive === 'fleurs'
      ? groupesFleurs.reduce((total, groupe) => total + groupe.produits.length, 0)
      : produitsVisibles.length

  const reinitialiser = () => {
    setRecherche('')
    setBudget('tous')
  }

  const aucunResultat = (
    <Reveal variant="fade">
      <div className="empty-products">
        <Icon name="recherche" size={32} />
        <h3>Aucun produit ne correspond</h3>
        <p>
          Essayez un autre mot-clé ou un autre budget — ou écrivez-nous, nous
          composons aussi sur mesure.
        </p>
        <button className="btn btn-outline" onClick={reinitialiser}>
          Effacer les filtres
        </button>
      </div>
    </Reveal>
  )

  return (
    <section className="boutique catalogue" id="catalogue" tabIndex={-1}>
      <div className="container">
        {source === 'static' && error && (
          <p className="catalogue-offline form-alert form-alert-warning" role="status">
            Le catalogue en direct est momentanément indisponible. Les produits
            restent visibles, mais prix et disponibilités seront confirmés sur WhatsApp.
          </p>
        )}
        {/* Filtres à gauche, compteur à droite : une barre d'outils,
            pas une section de plus. */}
        <div className="catalogue-barre">
          <div className="filters" aria-label="Filtrer les produits">
            {CATEGORIES.map((item) => (
              <button
                key={item.id}
                className={`filter ${
                  categorieActive === item.id ? 'active' : ''
                }`}
                aria-pressed={categorieActive === item.id}
                onClick={() => onCategorie?.(item.id)}
              >
                {item.label}
              </button>
            ))}
          </div>
          <p className="catalogue-compte" aria-live="polite">
            {nombreVisible} article{nombreVisible > 1 ? 's' : ''}
          </p>
        </div>

        {/* Deuxième rangée d'outils : chercher, borner le budget, trier.
            Tout se passe en mémoire sur le catalogue déjà chargé. */}
        <div className="catalogue-outils">
          <label className="catalogue-recherche">
            <Icon name="recherche" size={17} />
            <input
              type="search"
              value={recherche}
              onChange={(event) => setRecherche(event.target.value)}
              placeholder="Chercher un produit…"
              aria-label="Chercher un produit par nom ou description"
            />
          </label>
          <div
            className="catalogue-budgets"
            role="group"
            aria-label="Filtrer par budget"
          >
            {BUDGETS.map((item) => (
              <button
                key={item.id}
                className={`budget-filtre ${budget === item.id ? 'active' : ''}`}
                aria-pressed={budget === item.id}
                onClick={() => setBudget(item.id)}
              >
                {item.label}
              </button>
            ))}
          </div>
          <label className="catalogue-tri">
            <span>Trier</span>
            <select
              value={tri}
              onChange={(event) => setTri(event.target.value)}
              aria-label="Trier les produits"
            >
              {TRIS.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        {categorieActive === 'fleurs' ? (
          nombreVisible === 0 && filtresActifs ? (
            aucunResultat
          ) : (
            <div className="flower-groups">
              {groupesFleurs.map((groupe) => {
                // Filtre actif : un groupe vide disparaît plutôt que
                // d'annoncer un enrichissement qui n'a rien à voir.
                if (groupe.produits.length === 0 && filtresActifs) return null
                return (
                  <div className="product-group" key={groupe.id}>
                    <div className="product-group-head">
                      <h3>{groupe.label}</h3>
                      <span>
                        {groupe.produits.length} création
                        {groupe.produits.length > 1 ? 's' : ''}
                      </span>
                    </div>
                    {groupe.produits.length > 0 ? (
                      <GrilleProduits
                        produits={groupe.produits}
                        onProduit={onProduit}
                        headingLevel="h4"
                      />
                    ) : (
                      <p className="product-group-empty">
                        Cette sélection sera enrichie prochainement.
                      </p>
                    )}
                  </div>
                )
              })}
            </div>
          )
        ) : produitsVisibles.length > 0 ? (
          <GrilleProduits
            key={categorieActive}
            produits={produitsVisibles}
            onProduit={onProduit}
          />
        ) : filtresActifs ? (
          aucunResultat
        ) : (
          <Reveal variant="fade">
            <div className="empty-products">
              <Icon name="flower" size={32} />
              <h3>{familleActive?.label || 'Cette famille'} arrive bientôt</h3>
              <p>
                Cette famille sera enrichie prochainement. Écrivez-nous pour
                connaître les disponibilités ou demander une création sur
                mesure.
              </p>
              <a
                className="btn btn-whatsapp"
                href={waLink(
                  `Bonjour Lizzirene Déco ! Je souhaite connaître vos disponibilités pour : ${familleActive?.label || 'vos produits'}.`,
                )}
                target="_blank"
                rel="noreferrer"
              >
                <Icon name="whatsapp" size={18} />
                Demander conseil
              </a>
            </div>
          </Reveal>
        )}

        {/* Le référentiel des fleurs et coloris : la palette réelle qui sert
            aux bouquets sur mesure, sans rien promettre sur le stock. */}
        {categorieActive === 'fleurs' && (
          <Reveal variant="fade">
            <FlowerAvailability />
          </Reveal>
        )}

        <Reveal variant="fade">
          <p className="boutique-note">
            {categorieActive === 'fleurs' ? (
              <>
                Les bouquets démarrent à <strong>300 000 GNF</strong> et sont
                composés selon l’occasion, les couleurs et le volume souhaité.
              </>
            ) : categorieActive === 'box-cadeaux' ? (
              <>
                Les créations cadeaux démarrent à <strong>500 000 GNF</strong>.
                Leur contenu est adapté à l’occasion et à vos envies.
              </>
            ) : (
              <>
                Les prix et disponibilités des produits sont confirmés avec
                vous avant chaque commande.
              </>
            )}
            <a
              href={waLink(
                'Bonjour Lizzirene Déco ! J’aimerais être conseillé(e) pour choisir un produit.',
              )}
              target="_blank"
              rel="noreferrer"
            >
              Demander conseil sur WhatsApp
              <Icon name="arrow" size={17} />
            </a>
          </p>
        </Reveal>
      </div>
    </section>
  )
}

export default Boutique
