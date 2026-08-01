import Hero from '../components/Hero.jsx'
import Ticker from '../components/Ticker.jsx'
import Occasions from '../components/Occasions.jsx'
import BoutiqueAccueil from '../components/BoutiqueAccueil.jsx'
import Services from '../components/Services.jsx'
import Quote from '../components/Quote.jsx'
import Events from '../components/Events.jsx'
import Gallery from '../components/Gallery.jsx'
import About from '../components/About.jsx'
import Partenaires from '../components/Partenaires.jsx'
import FleuristeLocal from '../components/FleuristeLocal.jsx'
import ContactCta from '../components/ContactCta.jsx'

// Ordre de lecture : on séduit (hero, occasions, produits), on explique
// (services, événements), on rassure (galerie, fondatrice, partenaires,
// questions fréquentes), puis on invite à écrire.
function Accueil({ onCategorie, onTheme, onAller, onProduit }) {
  return (
    <>
      <Hero onCategorie={onCategorie} />
      <Ticker />
      <Occasions onCategorie={onCategorie} onTheme={onTheme} />
      <BoutiqueAccueil onCategorie={onCategorie} onProduit={onProduit} />
      <Services onTheme={onTheme} />
      <Quote />
      <Events />
      <Gallery />
      <About onAller={onAller} />
      <Partenaires />
      <FleuristeLocal onAller={onAller} />
      <ContactCta onAller={onAller} />
    </>
  )
}

export default Accueil
