import { useEffect } from 'react'
import { CartProvider } from './context/CartContext.jsx'
import Navbar from './components/Navbar.jsx'
import Footer from './components/Footer.jsx'
import WhatsAppFab from './components/WhatsAppFab.jsx'
import CartDrawer from './components/CartDrawer.jsx'
import Accueil from './pages/Accueil.jsx'
import PageContact from './pages/Contact.jsx'
import Produits from './pages/Produits.jsx'
import Services from './pages/Services.jsx'
import APropos from './pages/APropos.jsx'
import Produit from './pages/Produit.jsx'
import Introuvable from './pages/Introuvable.jsx'
import { useRouter } from './hooks/useRouter.js'
import { trouverProduit } from './data/products.js'

const METADONNEES = {
  accueil: {
    title: 'Lizzirene Déco — Fleuriste & décoration à Kipé, Conakry',
    description:
      'Bouquets, fleurs, plantes, cadeaux et décoration à Kipé, Conakry. Livraison 7j/7 et paiement à la livraison.',
  },
  produits: {
    title: 'Nos produits — Lizzirene Déco · Conakry',
    description:
      'Découvrez les fleurs naturelles et artificielles, plantes, vases, cadeaux et objets décoratifs de Lizzirene Déco.',
  },
  services: {
    title: 'Nos services — Lizzirene Déco · Conakry',
    description:
      "Décoration, bouquets sur mesure, ateliers de création et conseil en aménagement floral pour particuliers et professionnels à Conakry.",
  },
  apropos: {
    title: 'À propos — Lizzirene Déco · Kipé, Conakry',
    description:
      "L'histoire de Lizzirene Déco, sa fondatrice Sandouno Irene Mayer, ses engagements et sa boutique de fleurs à Kipé, Conakry.",
  },
  contact: {
    title: 'Contact — Lizzirene Déco · Kipé, Conakry',
    description:
      'Contactez Lizzirene Déco à Kipé pour une commande, une livraison à Conakry ou un projet de décoration.',
  },
  introuvable: {
    title: 'Page introuvable — Lizzirene Déco',
    description: "Cette page n'existe pas ou n'est plus disponible.",
  },
}

function App() {
  const {
    page,
    categorie,
    theme,
    produitId,
    aller,
    choisirCategorie,
    choisirTheme,
    allerProduit,
  } = useRouter()

  useEffect(() => {
    const produit = page === 'produit' ? trouverProduit(produitId) : null
    const meta = produit
      ? {
          title: `${produit.name} — Lizzirene Déco`,
          description: produit.desc,
        }
      : METADONNEES[page] || METADONNEES.introuvable

    document.title = meta.title
    document
      .querySelector('meta[name="description"]')
      ?.setAttribute('content', meta.description)
    document
      .querySelector('meta[property="og:title"]')
      ?.setAttribute('content', meta.title)
    document
      .querySelector('meta[property="og:description"]')
      ?.setAttribute('content', meta.description)
  }, [page, produitId])

  let contenu
  if (page === 'accueil') {
    contenu = (
      <Accueil
        onCategorie={choisirCategorie}
        onTheme={choisirTheme}
        onAller={aller}
      />
    )
  } else if (page === 'produits') {
    contenu = (
      <Produits
        categorie={categorie}
        onCategorie={choisirCategorie}
        onProduit={allerProduit}
      />
    )
  } else if (page === 'produit') {
    contenu = (
      <Produit
        produitId={produitId}
        onAller={aller}
        onCategorie={choisirCategorie}
        onProduit={allerProduit}
      />
    )
  } else if (page === 'services') {
    contenu = <Services theme={theme} onTheme={choisirTheme} />
  } else if (page === 'apropos') {
    contenu = (
      <APropos
        onAller={aller}
        onCategorie={choisirCategorie}
        onTheme={choisirTheme}
      />
    )
  } else if (page === 'contact') {
    contenu = <PageContact />
  } else {
    contenu = <Introuvable onAller={aller} />
  }

  return (
    <CartProvider>
      <Navbar
        page={page}
        categorie={categorie}
        theme={theme}
        onAller={aller}
        onCategorie={choisirCategorie}
        onTheme={choisirTheme}
      />
      <main>{contenu}</main>
      <Footer
        onAller={aller}
        onCategorie={choisirCategorie}
        onTheme={choisirTheme}
      />
      <WhatsAppFab />
      <CartDrawer />
    </CartProvider>
  )
}

export default App
