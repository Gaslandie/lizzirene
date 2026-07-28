import Hero from '../components/Hero.jsx'
import Ticker from '../components/Ticker.jsx'
import Services from '../components/Services.jsx'
import Quote from '../components/Quote.jsx'
import Events from '../components/Events.jsx'
import Gallery from '../components/Gallery.jsx'
import About from '../components/About.jsx'
import Testimonials from '../components/Testimonials.jsx'
import ContactCta from '../components/ContactCta.jsx'

function Accueil({ onCategorie, onAller }) {
  return (
    <>
      <Hero onCategorie={onCategorie} />
      <Ticker />
      <Services />
      <Quote />
      <Events />
      <Gallery />
      <About />
      <Testimonials />
      <ContactCta onAller={onAller} />
    </>
  )
}

export default Accueil
