import { useState } from 'react'
import Icon from '../components/Icon.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { useCart } from '../context/CartContext.jsx'
import {
  intercepterNavigation,
  effacerClaimToken,
  lireClaimReference,
  lireClaimToken,
  urlConfidentialite,
  urlConnexion,
} from '../utils/navigation.js'

function Inscription({ onAller }) {
  const { user, register, available, serviceError, refresh, claimOrder } = useAuth()
  const { clear, setOpen: openCart } = useCart()
  const [error, setError] = useState('')
  const [fields, setFields] = useState({})
  const [notice, setNotice] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const claimToken = lireClaimToken()
  const claimReference = lireClaimReference()
  const returnTo = new URLSearchParams(window.location.search).get('retour')

  const finish = () => {
    if (returnTo === 'commande') {
      onAller?.('produits')
      window.setTimeout(() => openCart(true), 0)
    } else {
      onAller?.('compte')
    }
  }

  const finishClaim = () => {
    clear()
    effacerClaimToken()
    if (claimReference) {
      onAller?.('compte-commande', { reference: claimReference })
    } else {
      onAller?.('compte')
    }
  }

  const submit = async (event) => {
    event.preventDefault()
    setError('')
    setNotice('')
    setFields({})
    const data = Object.fromEntries(new FormData(event.currentTarget))
    if (data.password !== data.passwordConfirmation) {
      setFields({ passwordConfirmation: 'Les deux mots de passe sont différents.' })
      return
    }

    setSubmitting(true)
    try {
      const result = await register({
        name: data.name,
        phone: data.phone,
        email: data.email || null,
        password: data.password,
        claimToken: claimToken || null,
        consent: data.consent === 'on',
      })
      if (result.claimWarning) {
        effacerClaimToken()
        setNotice(result.claimWarning)
      } else if (claimToken) {
        finishClaim()
      } else {
        finish()
      }
    } catch (requestError) {
      setError(requestError.message)
      setFields(requestError.fields || {})
    } finally {
      setSubmitting(false)
    }
  }

  if (user) {
    const openSpace = async () => {
      setError('')
      try {
        if (claimToken && user.role === 'customer') {
          await claimOrder(claimToken)
          finishClaim()
          return
        }
        onAller?.(user.role === 'admin' ? 'admin' : 'compte')
      } catch (requestError) {
        setError(requestError.message)
      }
    }
    return (
      <section className="account-page auth-page">
        <div className="account-shell auth-shell">
          <div className="auth-card auth-card-centered">
            <Icon name="check" size={36} />
            <h1>Votre compte est prêt</h1>
            {error && <p className="form-alert" role="alert">{error}</p>}
            {notice && <p className="form-alert form-alert-warning" role="status">{notice}</p>}
            <button className="btn btn-primary" onClick={openSpace}>
              Ouvrir mon espace
            </button>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="account-page auth-page">
      <div className="account-shell auth-shell">
        <div className="auth-intro">
          <span className="eyebrow">Compte facultatif</span>
          <h1 tabIndex={-1}>Votre espace Lizzirene</h1>
          <p>
            Le compte n’est jamais obligatoire pour commander. Il vous fait
            simplement gagner du temps et permet de suivre vos demandes.
          </p>
          <ul className="auth-benefits">
            <li><Icon name="check" size={17} /> Suivre chaque étape</li>
            <li><Icon name="check" size={17} /> Adresse mémorisée après une commande</li>
            <li><Icon name="check" size={17} /> Retrouver vos commandes</li>
          </ul>
        </div>

        <form className="auth-card" onSubmit={submit}>
          <h2>Créer mon compte</h2>
          {claimToken && (
            <p className="form-alert form-alert-success">
              Votre commande sera automatiquement rattachée à ce compte.
            </p>
          )}
          {!available && !serviceError && (
            <p className="form-alert form-alert-warning">
              L’espace client est en cours d’activation.
            </p>
          )}
          {serviceError && (
            <div className="form-alert form-alert-warning">
              <span>Le serveur ne répond pas pour le moment.</span>
              <button type="button" className="admin-text-button" onClick={refresh}>Réessayer</button>
            </div>
          )}
          {error && <p className="form-alert" role="alert">{error}</p>}
          {notice && <p className="form-alert form-alert-warning" role="status">{notice}</p>}
          <label>
            Nom complet
            <input name="name" autoComplete="name" required />
            {fields.name && <small className="field-error">{fields.name}</small>}
          </label>
          <label>
            Téléphone
            <input
              name="phone"
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              required
              placeholder="6XX XX XX XX"
            />
            {fields.phone && <small className="field-error">{fields.phone}</small>}
          </label>
          <label>
            E-mail <small>(facultatif)</small>
            <input name="email" type="email" autoComplete="email" />
            {fields.email && <small className="field-error">{fields.email}</small>}
          </label>
          <label>
            Mot de passe
            <input
              name="password"
              type="password"
              autoComplete="new-password"
              minLength="10"
              required
            />
            <small>Au moins 10 caractères.</small>
          </label>
          <label>
            Confirmer le mot de passe
            <input
              name="passwordConfirmation"
              type="password"
              autoComplete="new-password"
              minLength="10"
              required
            />
            {fields.passwordConfirmation && (
              <small className="field-error">{fields.passwordConfirmation}</small>
            )}
          </label>
          <label className="auth-consent">
            <input name="consent" type="checkbox" required />
            <span>
              J’accepte que mes coordonnées soient utilisées pour gérer mon
              compte et mes commandes, conformément à la{' '}
              <a
                href={urlConfidentialite()}
                target="_blank"
                rel="noreferrer"
              >
                politique de confidentialité
              </a>.
            </span>
          </label>
          <button className="btn btn-primary" disabled={submitting || !available}>
            {submitting ? 'Création…' : 'Créer mon compte'}
          </button>
          <p className="auth-switch">
            Vous avez déjà un compte ?{' '}
            <a
              href={urlConnexion({ claimToken, returnTo })}
              onClick={(event) => {
                if (!intercepterNavigation(event)) return
                onAller?.('connexion', { claimToken, returnTo })
              }}
            >
              Se connecter
            </a>
          </p>
        </form>
      </div>
    </section>
  )
}

export default Inscription
