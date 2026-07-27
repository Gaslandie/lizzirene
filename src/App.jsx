import { CartProvider } from './context/CartContext.jsx'
import Navbar from './components/Navbar.jsx'
import Hero from './components/Hero.jsx'
import Ticker from './components/Ticker.jsx'
import Services from './components/Services.jsx'
import Boutique from './components/Boutique.jsx'
import Quote from './components/Quote.jsx'
import Events from './components/Events.jsx'
import Gallery from './components/Gallery.jsx'
import About from './components/About.jsx'
import Testimonials from './components/Testimonials.jsx'
import Contact from './components/Contact.jsx'
import Footer from './components/Footer.jsx'
import WhatsAppFab from './components/WhatsAppFab.jsx'
import CartDrawer from './components/CartDrawer.jsx'

function App() {
  return (
    <CartProvider>
      <Navbar />
      <main>
        <Hero />
        <Ticker />
        <Services />
        <Boutique />
        <Quote />
        <Events />
        <Gallery />
        <About />
        <Testimonials />
        <Contact />
      </main>
      <Footer />
      <WhatsAppFab />
      <CartDrawer />
    </CartProvider>
  )
}

export default App
