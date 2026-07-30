import Reveal from './Reveal.jsx'
import Icon from './Icon.jsx'
import Media from './Media.jsx'
import { PHOTOS, waLink } from '../config.js'
import {
  EMPLACEMENTS_VIDES,
  PARTENAIRES,
  REFERENCE_VEDETTE,
} from '../data/partenaires.js'

// Tant que la liste réelle est vide, on affiche des emplacements neutres :
// la section garde sa place dans la maquette sans annoncer de faux
// partenariat. Voir src/data/partenaires.js.
function Emplacement() {
  return (
    <li className="partenaire partenaire-vide" aria-hidden="true">
      <Icon name="flower" size={28} strokeWidth={1.3} />
      <span>Logo à venir</span>
    </li>
  )
}

// Choix éditorial : les références sont écrites, pas affichées en logos.
// Un mur typographique traite chaque nom avec la même dignité, évite le
// patchwork de logos hétérogènes — et ne pose aucune question de droit
// d'usage des emblèmes officiels, là où afficher un blason d'ambassade
// exigerait une autorisation écrite. Les logos restent déclarés dans les
// données si ce choix devait être réévalué.

function Partenaires() {
  const vide = PARTENAIRES.length === 0
  const emplacements = Array.from({ length: EMPLACEMENTS_VIDES })
  const vedette = PARTENAIRES.find(
    (p) => p.id === REFERENCE_VEDETTE.partenaireId,
  )

  return (
    <section className="partenaires" id="partenaires">
      <div className="container">
        <Reveal>
          <div className="section-head">
            <span className="eyebrow">Nos partenaires</span>
            {/* Tant qu'aucun logo n'est renseigné, le titre reste une
                invitation : rien n'affirme un partenariat inexistant. */}
            <h2>
              {vide
                ? 'Travaillons ensemble'
                : 'Ils nous font confiance'}
            </h2>
            <p>
              {vide
                ? "Hôtels, agences événementielles, restaurants, entreprises : nous fleurissons vos espaces et vos événements tout au long de l'année, avec un interlocuteur dédié."
                : 'Institutions, entreprises et événements : ils nous ont fait confiance pour leurs fleurs et leur décoration.'}
            </p>
          </div>
        </Reveal>

        <Reveal variant="fade">
          {vide ? (
            <ul className="partenaires-grille">
              {emplacements.map((_, i) => (
                <Emplacement key={i} />
              ))}
            </ul>
          ) : (
            <ul className="partenaires-mur">
              {PARTENAIRES.map((p) => (
                <li key={p.id}>{p.nom}</li>
              ))}
            </ul>
          )}
        </Reveal>

        {/* Une photo du travail réel en dit plus qu'un logo : elle sort donc
            de la grille pour occuper toute la largeur qu'elle mérite. */}
        {!vide && vedette && (
          <Reveal variant="zoom">
            <figure className="reference-vedette">
              <Media
                src={PHOTOS.comiteMissGuinee.src}
                srcSet={PHOTOS.comiteMissGuinee.srcSet}
                sizes={PHOTOS.comiteMissGuinee.sizes}
                width={PHOTOS.comiteMissGuinee.width}
                height={PHOTOS.comiteMissGuinee.height}
                alt={PHOTOS.comiteMissGuinee.alt}
              />
              <figcaption>
                <span className="reference-vedette-nom">{vedette.nom}</span>
                <strong>{REFERENCE_VEDETTE.titre}</strong>
                <span>{REFERENCE_VEDETTE.texte}</span>
              </figcaption>
            </figure>
          </Reveal>
        )}

        <Reveal variant="fade">
          <div className="partenaires-cta">
            <p>
              Vous êtes un professionnel et souhaitez fleurir vos espaces toute
              l'année ?
            </p>
            <a
              href={waLink(
                'Bonjour Lizzirene Déco ! Je représente une entreprise et je souhaite discuter d’un partenariat.',
              )}
              target="_blank"
              rel="noreferrer"
            >
              Devenir partenaire
              <Icon name="arrow" size={17} />
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

export default Partenaires
