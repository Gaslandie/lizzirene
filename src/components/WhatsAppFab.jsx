import Icon from './Icon.jsx'
import { waLink } from '../config.js'

function WhatsAppFab() {
  return (
    <a
      className="wa-fab"
      href={waLink('Bonjour Lizzirene Déco ! Je souhaite passer une commande.')}
      target="_blank"
      rel="noreferrer"
      aria-label="Discuter sur WhatsApp"
    >
      <Icon name="whatsapp" size={30} />
    </a>
  )
}

export default WhatsAppFab
