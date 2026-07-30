import Hero from '../components/Hero.jsx'
import Ticker from '../components/Ticker.jsx'
import BoutiqueAccueil from '../components/BoutiqueAccueil.jsx'
import Services from '../components/Services.jsx'
import Quote from '../components/Quote.jsx'
import Events from '../components/Events.jsx'
import Gallery from '../components/Gallery.jsx'
import About from '../components/About.jsx'
import Partenaires from '../components/Partenaires.jsx'
import ContactCta from '../components/ContactCta.jsx'

function Accueil({ onCategorie, onTheme, onAller, onProduit }) {
  return (
    <>
      <Hero onCategorie={onCategorie} />
      <Ticker />
      <BoutiqueAccueil onCategorie={onCategorie} onProduit={onProduit} />
      <Services onTheme={onTheme} />
      <Quote />
      <Events />
      <Gallery />
      <About onAller={onAller} />
      <Partenaires />
      <ContactCta onAller={onAller} />
    </>
  )
}

export default Accueil
