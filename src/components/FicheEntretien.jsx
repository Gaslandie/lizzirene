import Icon from './Icon.jsx'

// « L'entretien en un clin d'œil » : trois repères lisibles en dix secondes
// — lumière, arrosage, difficulté — plus une précaution quand la plante en
// mérite une (sève irritante…). Rendu uniquement si le produit porte un
// champ `entretien` ; conseils rédigés pour le climat de Conakry et soumis
// à la relecture de la fondatrice avant tout ajout.
const LIGNES = [
  { cle: 'lumiere', icone: 'soleil', titre: 'Lumière' },
  { cle: 'arrosage', icone: 'goutte', titre: 'Arrosage' },
  { cle: 'difficulte', icone: 'leaf', titre: 'Difficulté' },
]

function FicheEntretien({ entretien }) {
  if (!entretien) return null

  return (
    <div className="fiche-entretien">
      <h2>L’entretien en un clin d’œil</h2>
      <ul>
        {LIGNES.map(({ cle, icone, titre }) =>
          entretien[cle] ? (
            <li key={cle}>
              <span className="entretien-icone">
                <Icon name={icone} size={18} />
              </span>
              <span>
                <strong>{titre}</strong>
                <span className="entretien-texte">{entretien[cle]}</span>
              </span>
            </li>
          ) : null,
        )}
      </ul>
      {entretien.remarque && (
        <p className="entretien-remarque">
          <Icon name="info" size={16} />
          {entretien.remarque}
        </p>
      )}
    </div>
  )
}

export default FicheEntretien
