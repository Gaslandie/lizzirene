import Reveal from './Reveal.jsx'
import Icon from './Icon.jsx'
import { waLink } from '../config.js'
import { EMPLACEMENTS_VIDES, PARTENAIRES } from '../data/partenaires.js'

const BASE = import.meta.env.BASE_URL

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

// Deux rendus possibles : le logo quand il est fourni, sinon le nom en
// toutes lettres. La bascule se fait sans toucher au composant — il suffit
// d'ajouter `logo` à l'entrée dans src/data/partenaires.js.
function Partenaire({ partenaire }) {
  const contenu = partenaire.logo ? (
    <>
      <img
        src={`${BASE}${partenaire.logo}`}
        alt={partenaire.nom}
        loading="lazy"
        decoding="async"
      />
      {partenaire.type && <span>{partenaire.type}</span>}
    </>
  ) : (
    <span className="partenaire-nom">{partenaire.nom}</span>
  )

  return (
    <li className={`partenaire ${partenaire.logo ? '' : 'partenaire-texte'}`}>
      {partenaire.url ? (
        <a href={partenaire.url} target="_blank" rel="noreferrer">
          {contenu}
        </a>
      ) : (
        contenu
      )}
    </li>
  )
}

function Partenaires() {
  const vide = PARTENAIRES.length === 0
  const emplacements = Array.from({ length: EMPLACEMENTS_VIDES })

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
          <ul className="partenaires-grille">
            {vide
              ? emplacements.map((_, i) => <Emplacement key={i} />)
              : PARTENAIRES.map((p) => (
                  <Partenaire key={p.id} partenaire={p} />
                ))}
          </ul>
        </Reveal>

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
