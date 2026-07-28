import Media from '../components/Media.jsx'
import Reveal from '../components/Reveal.jsx'
import Icon from '../components/Icon.jsx'
import { SERVICES, THEMES, normaliserTheme } from '../data/services.js'
import { waLink } from '../config.js'
import { urlServices, intercepterNavigation } from '../utils/navigation.js'

function Services({ theme = 'tous', onTheme }) {
  const themeActif = normaliserTheme(theme)
  const visibles =
    themeActif === 'tous'
      ? SERVICES
      : SERVICES.filter((service) => service.theme === themeActif)

  const descriptionTheme = THEMES.find((t) => t.id === themeActif)?.intro

  const choisir = (event, id) => {
    if (!intercepterNavigation(event)) return
    onTheme?.(id)
  }

  return (
    <>
      <header className="page-hero services-hero">
        <div className="container">
          <span className="eyebrow">Nos prestations</span>
          <h1 tabIndex={-1}>Nos services</h1>
          <p>
            De la décoration d'intérieur aux grands moments de la vie, nous
            créons, installons et livrons — à Kipé et partout à Conakry.
          </p>
        </div>
      </header>

      <section className="services-page" id="services-liste" tabIndex={-1}>
        <div className="container">
          <div className="filters" role="group" aria-label="Filtrer par thème">
            {THEMES.map((t) => (
              <a
                key={t.id}
                href={urlServices(t.id)}
                className={`filter ${themeActif === t.id ? 'active' : ''}`}
                aria-current={themeActif === t.id ? 'page' : undefined}
                onClick={(event) => choisir(event, t.id)}
              >
                {t.label}
              </a>
            ))}
          </div>

          {descriptionTheme && (
            <Reveal variant="fade">
              <p className="theme-intro">{descriptionTheme}</p>
            </Reveal>
          )}

          <div className="services-page-grid">
            {visibles.map((service, i) => (
              <Reveal key={service.id} variant="zoom" delay={(i % 3) * 90}>
                <article className="service-tile">
                  <div className="service-tile-media">
                    <Media
                      src={service.photo?.src}
                      srcSet={service.photo?.srcSet}
                      sizes={service.photo?.sizes}
                      width={service.photo?.width}
                      height={service.photo?.height}
                      alt={
                        service.photo?.alt ||
                        `${service.name} — Lizzirene Déco`
                      }
                      variant="teal"
                      label={service.name}
                      icone={service.icon}
                      labelMasque
                    />
                    <span className="service-tile-icon">
                      <Icon name={service.icon} size={26} />
                    </span>
                  </div>
                  <div className="service-tile-body">
                    <h2>{service.name}</h2>
                    <p>{service.desc}</p>
                    <a
                      className="btn btn-whatsapp add-btn"
                      href={waLink(
                        `Bonjour Lizzirene Déco ! Je souhaite un devis pour : ${service.name}.`,
                      )}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <Icon name="whatsapp" size={17} />
                      Demander un devis
                    </a>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>

          <Reveal variant="fade">
            <p className="boutique-note">
              Une occasion qui n'est pas dans la liste ? Nous nous adaptons.
              <a
                href={waLink(
                  'Bonjour Lizzirene Déco ! J’ai un projet particulier à vous soumettre.',
                )}
                target="_blank"
                rel="noreferrer"
              >
                Parlons-en sur WhatsApp
                <Icon name="arrow" size={17} />
              </a>
            </p>
          </Reveal>
        </div>
      </section>
    </>
  )
}

export default Services
