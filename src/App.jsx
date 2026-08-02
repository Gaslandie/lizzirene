import { useEffect } from 'react'
import { useProducts } from './context/ProductsContext.jsx'
import Navbar from './components/Navbar.jsx'
import Footer from './components/Footer.jsx'
import WhatsAppFab from './components/WhatsAppFab.jsx'
import CartDrawer from './components/CartDrawer.jsx'
import Accueil from './pages/Accueil.jsx'
import PageContact from './pages/Contact.jsx'
import Confidentialite from './pages/Confidentialite.jsx'
import Produits from './pages/Produits.jsx'
import Services from './pages/Services.jsx'
import APropos from './pages/APropos.jsx'
import Produit from './pages/Produit.jsx'
import Introuvable from './pages/Introuvable.jsx'
import Connexion from './pages/Connexion.jsx'
import Inscription from './pages/Inscription.jsx'
import Compte from './pages/Compte.jsx'
import CommandeClient from './pages/CommandeClient.jsx'
import AdminLayout from './components/admin/AdminLayout.jsx'
import InstallationAdmin from './pages/admin/InstallationAdmin.jsx'
import TableauDeBord from './pages/admin/TableauDeBord.jsx'
import ProduitsAdmin from './pages/admin/ProduitsAdmin.jsx'
import ProduitAdminForm from './pages/admin/ProduitAdminForm.jsx'
import CommandesAdmin from './pages/admin/CommandesAdmin.jsx'
import CommandeAdmin from './pages/admin/CommandeAdmin.jsx'
import NouvelleCommandeAdmin from './pages/admin/NouvelleCommandeAdmin.jsx'
import { useRouter } from './hooks/useRouter.js'
import {
  appliquerDonneesStructurees,
  SITE,
} from './utils/donneesStructurees.js'
import {
  urlAccueil,
  urlAPropos,
  urlContact,
  urlProduit,
  urlProduits,
  urlServices,
} from './utils/navigation.js'

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
  confidentialite: {
    title: 'Politique de confidentialité — Lizzirene Déco',
    description: 'Utilisation et protection des données sur Lizzirene Déco.',
  },
  connexion: {
    title: 'Connexion — Lizzirene Déco',
    description: 'Connectez-vous à votre espace client Lizzirene Déco.',
  },
  inscription: {
    title: 'Créer mon compte — Lizzirene Déco',
    description: 'Créez votre espace client Lizzirene Déco.',
  },
  compte: {
    title: 'Mon espace — Lizzirene Déco',
    description: 'Consultez vos commandes et vos informations de livraison.',
  },
  'compte-commande': {
    title: 'Suivi de commande — Lizzirene Déco',
    description: 'Suivez votre commande Lizzirene Déco.',
  },
  admin: {
    title: 'Administration — Lizzirene Déco',
    description: 'Administration privée Lizzirene Déco.',
  },
  'admin-installation': {
    title: 'Installation de l’administration — Lizzirene Déco',
    description: 'Installation privée Lizzirene Déco.',
  },
  'admin-produits': {
    title: 'Produits — Administration Lizzirene Déco',
    description: 'Gestion privée du catalogue.',
  },
  'admin-produit': {
    title: 'Modifier un produit — Administration Lizzirene Déco',
    description: 'Gestion privée du catalogue.',
  },
  'admin-produit-nouveau': {
    title: 'Nouveau produit — Administration Lizzirene Déco',
    description: 'Gestion privée du catalogue.',
  },
  'admin-commandes': {
    title: 'Commandes — Administration Lizzirene Déco',
    description: 'Gestion privée des commandes.',
  },
  'admin-commande': {
    title: 'Détail commande — Administration Lizzirene Déco',
    description: 'Gestion privée des commandes.',
  },
  'admin-commande-nouvelle': {
    title: 'Nouvelle commande WhatsApp — Administration Lizzirene Déco',
    description: 'Enregistrement privé d’une commande reçue hors du panier.',
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
    commandeReference,
    adminProduitId,
    aller,
    choisirCategorie,
    choisirTheme,
    allerProduit,
  } = useRouter()
  const { products } = useProducts()

  useEffect(() => {
    const produit =
      page === 'produit'
        ? products.find((item) => item.id === produitId)
        : null
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

    const cheminsCanoniques = {
      accueil: urlAccueil(),
      produits: urlProduits(categorie),
      services: urlServices(theme),
      apropos: urlAPropos(),
      contact: urlContact(),
    }
    const cheminCanonique = produit
      ? urlProduit(produit.id)
      : cheminsCanoniques[page] || window.location.pathname
    const urlCanonique = new URL(cheminCanonique, SITE).href

    document
      .querySelector('link[rel="canonical"]')
      ?.setAttribute('href', urlCanonique)
    document
      .querySelector('meta[property="og:url"]')
      ?.setAttribute('content', urlCanonique)

    // Ce que les moteurs lisent en plus du texte : boutique, horaires, zone
    // desservie, questions fréquentes, fiche produit et fil d'Ariane.
    appliquerDonneesStructurees({ page, produit, categorie })
    document
      .querySelector('meta[name="robots"]')
      ?.setAttribute(
        'content',
        page.startsWith('admin') || ['connexion', 'inscription', 'compte', 'compte-commande'].includes(page)
          ? 'noindex, nofollow'
          : 'index, follow',
      )
  }, [page, produitId, categorie, theme, products])

  let contenu
  if (page === 'accueil') {
    contenu = (
      <Accueil
        onCategorie={choisirCategorie}
        onTheme={choisirTheme}
        onAller={aller}
        onProduit={allerProduit}
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
  } else if (page === 'confidentialite') {
    contenu = <Confidentialite />
  } else if (page === 'connexion') {
    contenu = <Connexion onAller={aller} />
  } else if (page === 'inscription') {
    contenu = <Inscription onAller={aller} />
  } else if (page === 'compte') {
    contenu = <Compte onAller={aller} />
  } else if (page === 'compte-commande') {
    contenu = (
      <CommandeClient reference={commandeReference} onAller={aller} />
    )
  } else if (page === 'admin') {
    contenu = <TableauDeBord onAller={aller} />
  } else if (page === 'admin-installation') {
    contenu = <InstallationAdmin onAller={aller} />
  } else if (page === 'admin-produits') {
    contenu = <ProduitsAdmin onAller={aller} />
  } else if (page === 'admin-produit-nouveau') {
    contenu = <ProduitAdminForm onAller={aller} />
  } else if (page === 'admin-produit') {
    contenu = (
      <ProduitAdminForm productId={adminProduitId} onAller={aller} />
    )
  } else if (page === 'admin-commandes') {
    contenu = <CommandesAdmin onAller={aller} />
  } else if (page === 'admin-commande-nouvelle') {
    contenu = <NouvelleCommandeAdmin onAller={aller} />
  } else if (page === 'admin-commande') {
    contenu = (
      <CommandeAdmin reference={commandeReference} onAller={aller} />
    )
  } else {
    contenu = <Introuvable onAller={aller} />
  }

  if (page.startsWith('admin')) {
    return (
      <AdminLayout
        page={page}
        onAller={aller}
        allowInstallation={page === 'admin-installation'}
      >
        {contenu}
      </AdminLayout>
    )
  }

  return (
    <>
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
      <CartDrawer onAller={aller} />
    </>
  )
}

export default App
