import Media from '../components/Media.jsx'
import Reveal from '../components/Reveal.jsx'
import Icon from '../components/Icon.jsx'
import { CONTACT, PHOTOS, waLink } from '../config.js'
import {
  intercepterNavigation,
  urlContact,
  urlProduits,
  urlServices,
} from '../utils/navigation.js'

// Repères tirés de ce que la boutique communique déjà (page Facebook et
// site) — rien n'est inventé. Les dates précises restent à confirmer.
const ETAPES = [
  {
    icon: 'flower',
    titre: 'Une passion devenue métier',
    texte:
      "Tout commence par le goût du beau et l'envie de transformer une émotion en bouquet. Chaque création est montée à la main, fleur par fleur.",
  },
  {
    icon: 'maison',
    titre: 'La boutique ouvre à Kipé',
    texte:
      "Un espace chaleureux où l'on trouve bouquets, compositions élégantes, plantes et fleurs fraîches choisies avec soin pour toutes les occasions.",
  },
  {
    icon: 'truck',
    titre: 'Partout à Conakry',
    texte:
      'Livraison dans toutes les communes, 7j/7, avec paiement à la réception. Le catalogue complet se partage en un message WhatsApp.',
  },
]

const VALEURS = [
  {
    icon: 'bouquet',
    titre: 'Fait main, sans exception',
    texte:
      'Aucune composition industrielle : chaque bouquet est monté à la commande, selon vos couleurs et votre budget.',
  },
  {
    icon: 'leaf',
    titre: 'Des fleurs choisies',
    texte:
      'Fleurs fraîches sélectionnées une à une, complétées par des fleurs artificielles haut de gamme quand la durée compte.',
  },
  {
    icon: 'heart',
    titre: 'Le geste juste',
    texte:
      "Une naissance, un rétablissement, un adieu : nous adaptons le ton de la création à ce que vous avez à dire.",
  },
  {
    icon: 'cash',
    titre: 'La confiance d’abord',
    texte:
      'Paiement à la livraison, prix annoncés clairement, frais confirmés avant l’envoi. Aucune mauvaise surprise.',
  },
]

function APropos({ onAller, onCategorie, onTheme }) {
  const versContact = (event) => {
    if (!intercepterNavigation(event)) return
    onAller?.('contact')
  }

  return (
    <>
      <header className="page-hero">
        <div className="container">
          <span className="eyebrow">À propos</span>
          <h1 tabIndex={-1}>Lizzirene Déco, by {CONTACT.founder}</h1>
          <p>
            Une boutique de fleurs à Kipé, née d'une passion : créer des
            instants de beauté au quotidien, et donner à chaque émotion la
            fleur qui lui ressemble.
          </p>
        </div>
      </header>

      {/* ---- La fondatrice ---- */}
      <section className="fondatrice" id="fondatrice">
        <div className="container">
          <Reveal variant="left">
            <div className="fondatrice-visuel">
              <Media
                variant="soft"
                label={`${CONTACT.founder}, fondatrice`}
                icone="flower"
                labelMasque
              />
              <span className="fondatrice-badge">
                <Icon name="flower" size={22} />
                Fondatrice
              </span>
            </div>
          </Reveal>

          <Reveal variant="right" delay={120}>
            <div className="fondatrice-texte">
              <span className="eyebrow">La fondatrice</span>
              <h2>{CONTACT.founder}</h2>
              <p>
                C'est elle qui donne son nom et son goût à la maison :
                Lizzirene Déco, <em>by {CONTACT.founder}</em>. Des compositions
                pensées une à une, un accueil en boutique, et le souci du
                détail jusque dans l'emballage.
              </p>
              <blockquote className="fondatrice-citation">
                Venez découvrir notre univers floral et partager avec nous
                cette belle aventure. Votre confiance sera notre plus belle
                fleur.
              </blockquote>
              <ul className="fondatrice-points">
                <li>
                  <span className="check">
                    <Icon name="check" size={14} strokeWidth={2.4} />
                  </span>
                  Compositions montées à la main, à la commande
                </li>
                <li>
                  <span className="check">
                    <Icon name="check" size={14} strokeWidth={2.4} />
                  </span>
                  Conseil personnalisé en boutique et sur WhatsApp
                </li>
                <li>
                  <span className="check">
                    <Icon name="check" size={14} strokeWidth={2.4} />
                  </span>
                  Un interlocuteur unique, du devis à la livraison
                </li>
              </ul>
              <a
                href={waLink(
                  `Bonjour ${CONTACT.founder} ! J’aimerais échanger sur un projet floral.`,
                )}
                target="_blank"
                rel="noreferrer"
                className="btn btn-whatsapp"
              >
                <Icon name="whatsapp" size={19} />
                Échanger avec {CONTACT.founder}
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ---- Notre histoire ---- */}
      <section className="histoire">
        <div className="container">
          <Reveal>
            <div className="section-head">
              <span className="eyebrow">Notre histoire</span>
              <h2>D'une passion à une boutique</h2>
              <p>
                Lizzirene Déco est née de l'envie de rendre le quotidien plus
                beau — puis a poussé les portes de sa propre boutique.
              </p>
            </div>
          </Reveal>
          <ol className="histoire-etapes">
            {ETAPES.map((etape, i) => (
              <Reveal key={etape.titre} delay={i * 110}>
                <li className="histoire-etape">
                  <span className="histoire-icone">
                    <Icon name={etape.icon} size={26} />
                  </span>
                  <h3>{etape.titre}</h3>
                  <p>{etape.texte}</p>
                </li>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* ---- Nos valeurs ---- */}
      <section className="valeurs">
        <div className="container">
          <Reveal>
            <div className="section-head">
              <span className="eyebrow">Nos engagements</span>
              <h2>Ce sur quoi nous ne transigeons pas</h2>
            </div>
          </Reveal>
          <div className="valeurs-grille">
            {VALEURS.map((valeur, i) => (
              <Reveal key={valeur.titre} variant="zoom" delay={(i % 4) * 90}>
                <article className="valeur-carte">
                  <span className="valeur-icone">
                    <Icon name={valeur.icon} size={26} />
                  </span>
                  <h3>{valeur.titre}</h3>
                  <p>{valeur.texte}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---- La boutique ---- */}
      <section className="boutique-presentation">
        <div className="container">
          <Reveal variant="left">
            <div className="boutique-presentation-texte">
              <span className="eyebrow">La boutique</span>
              <h2>Passez nous voir à Kipé</h2>
              <p>
                Notre boutique vous accueille dans un espace chaleureux, où
                l'on choisit ensemble les fleurs, le contenant et l'emballage.
                Vous y trouverez aussi nos plantes, vases et objets décoratifs.
              </p>
              <ul className="contact-list">
                <li>
                  <span className="ico">
                    <Icon name="pin" size={21} />
                  </span>
                  <div>
                    <strong>{CONTACT.address}</strong>
                    <span>{CONTACT.addressDetail}</span>
                  </div>
                </li>
                <li>
                  <span className="ico">
                    <Icon name="clock" size={21} />
                  </span>
                  <div>
                    <strong>Horaires</strong>
                    <span className="hours-lines">
                      {CONTACT.hours.map((ligne) => (
                        <span key={ligne}>{ligne}</span>
                      ))}
                    </span>
                  </div>
                </li>
              </ul>
              <a
                href={urlContact()}
                className="btn btn-primary"
                onClick={versContact}
              >
                Nous contacter
                <Icon name="arrow" size={18} />
              </a>
            </div>
          </Reveal>
          <Reveal variant="right" delay={120}>
            <div className="boutique-presentation-visuel">
              <Media
                src={PHOTOS.vedette?.src}
                srcSet={PHOTOS.vedette?.srcSet}
                sizes={PHOTOS.vedette?.sizes}
                width={PHOTOS.vedette?.width}
                height={PHOTOS.vedette?.height}
                alt="Composition florale réalisée par Lizzirene Déco"
                variant="teal"
                label="Photo de la boutique"
              />
            </div>
          </Reveal>
        </div>
      </section>

      {/* ---- Suite du parcours ---- */}
      <section className="apropos-suite">
        <div className="container">
          <Reveal variant="fade">
            <div className="apropos-suite-box">
              <div>
                <h2>Découvrir nos créations</h2>
                <p>
                  Le catalogue, les prestations sur mesure et les devis : tout
                  est à un clic.
                </p>
              </div>
              <div className="apropos-suite-actions">
                <a
                  href={urlProduits()}
                  className="btn btn-primary"
                  onClick={(event) => {
                    if (!intercepterNavigation(event)) return
                    onCategorie?.('tous', { ajouterHistorique: true })
                  }}
                >
                  Nos produits
                </a>
                <a
                  href={urlServices()}
                  className="btn btn-outline"
                  onClick={(event) => {
                    if (!intercepterNavigation(event)) return
                    onTheme?.('tous', { ajouterHistorique: true })
                  }}
                >
                  Nos services
                </a>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  )
}

export default APropos
