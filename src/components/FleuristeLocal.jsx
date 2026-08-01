import Reveal from './Reveal.jsx'
import Icon from './Icon.jsx'
import Faq from './Faq.jsx'
import { QUESTIONS_ACCUEIL } from '../data/faq.js'
import { CONTACT, waLink } from '../config.js'
import { intercepterNavigation, urlContact } from '../utils/navigation.js'

// Les six promesses ne disent que ce que le site tient déjà ailleurs
// (panier, fiches produits, page contact). Rien n'y est ajouté sans que la
// boutique puisse le tenir.
const PROMESSES = [
  {
    icon: 'scissors',
    texte: 'Compositions montées à la main à la boutique de Kipé',
  },
  { icon: 'truck', texte: 'Livraison dans toutes les communes de Conakry, 7j/7' },
  { icon: 'cash', texte: 'Paiement en espèces à la réception, jamais en ligne' },
  { icon: 'chat', texte: 'Conseil sur WhatsApp avant de valider la commande' },
  { icon: 'flower', texte: 'Bouquets sur mesure selon l’occasion et le budget' },
  { icon: 'gem', texte: 'Décoration d’événements prise en charge de A à Z' },
]

// Dernier bloc avant le contact : il lève les doutes qui restent (qui êtes-vous,
// livrez-vous chez moi, comment je paie) et donne au passage aux moteurs le
// vocabulaire du métier et de la ville. Le texte long est replié : présent
// dans la page pour l'indexation, discret pour le lecteur pressé.
function FleuristeLocal({ onAller }) {
  return (
    <section className="fleuriste-local" id="fleuriste-conakry">
      <div className="container">
        <Reveal>
          <div className="section-head">
            <span className="eyebrow">Fleuriste à Conakry</span>
            <h2>Votre fleuriste à Kipé, livré partout à Conakry</h2>
          </div>
        </Reveal>

        <div className="fleuriste-local-corps">
          <Reveal variant="left">
            <div className="fleuriste-local-texte">
              <p className="fleuriste-local-chapeau">
                Lizzirène Déco est une boutique de fleurs et de décoration
                installée à {CONTACT.address}. Bouquets de roses, plantes
                d’intérieur, coffrets cadeaux, vases et décors d’événements y
                sont préparés sur place, puis livrés dans toute la ville.
              </p>
              <details className="lire-la-suite">
                <summary>
                  <span className="lire-plus">Lire la suite</span>
                  <span className="lire-moins">Réduire</span>
                  <Icon name="chevron" size={18} />
                </summary>
                <p>
                  Depuis 2023, la boutique compose des bouquets de roses, de lys,
                  d’hortensias et de chrysanthèmes, en fleurs naturelles comme en
                  fleurs artificielles. À côté des fleurs, le catalogue réunit
                  des plantes vertes d’intérieur, des cache-pots, des vases, des
                  peluches, des coffrets cadeaux et des luminaires — de quoi
                  meubler un salon, un bureau ou une vitrine autant qu’offrir.
                </p>
                <p>
                  Les livraisons couvrent Kaloum, Dixinn, Matam, Ratoma et
                  Matoto, sept jours sur sept. Vous composez votre panier en
                  ligne, vous indiquez votre commune et votre point de repère,
                  puis le récapitulatif part sur WhatsApp : nous confirmons la
                  disponibilité, les frais de livraison et l’heure de passage
                  avant toute préparation. Le règlement se fait en espèces, à la
                  réception, jamais en ligne.
                </p>
                <p>
                  Pour un mariage, un anniversaire, une naissance, une remise de
                  diplôme ou un hommage, la boutique se déplace, imagine le décor
                  et l’installe. Le devis est gratuit et se demande directement
                  sur WhatsApp.
                </p>
              </details>
            </div>
          </Reveal>

          <Reveal variant="right" delay={80}>
            <ul className="promesses-liste">
              {PROMESSES.map((promesse) => (
                <li key={promesse.texte}>
                  <span className="promesse-icone">
                    <Icon name={promesse.icon} size={18} />
                  </span>
                  {promesse.texte}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>

        <div className="fleuriste-local-faq">
          <Reveal>
            <h3>Questions fréquentes</h3>
          </Reveal>
          <Faq questions={QUESTIONS_ACCUEIL} />
          <Reveal variant="fade">
            <p className="fleuriste-local-suite">
              <a
                href={urlContact()}
                onClick={(event) => {
                  if (!intercepterNavigation(event)) return
                  onAller?.('contact')
                }}
              >
                Voir toutes les questions
                <Icon name="arrow" size={16} />
              </a>
              <a
                href={waLink(
                  'Bonjour Lizzirene Déco ! J’ai une question avant de commander.',
                )}
                target="_blank"
                rel="noreferrer"
              >
                <Icon name="whatsapp" size={16} />
                Poser une autre question
              </a>
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

export default FleuristeLocal
