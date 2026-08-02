import { useState } from 'react'
import Icon from '../components/Icon.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { useCart } from '../context/CartContext.jsx'
import { CONTACT, waLink } from '../config.js'
import {
  effacerClaimToken,
  intercepterNavigation,
  lireClaimReference,
  lireClaimToken,
  urlInscription,
} from '../utils/navigation.js'

function Connexion({ onAller }) {
  const { user, login, available, serviceError, refresh, claimOrder } = useAuth()
  const { clear, setOpen: openCart } = useCart()
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const parameters = new URLSearchParams(window.location.search)
  const claimToken = lireClaimToken()
  const claimReference = lireClaimReference()
  const returnTo = parameters.get('retour')

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
    setSubmitting(true)
    const data = Object.fromEntries(new FormData(event.currentTarget))
    try {
      const connected = await login({
        identifier: data.identifier,
        password: data.password,
      })
      if (claimToken && connected.role === 'customer') {
        await claimOrder(claimToken)
        finishClaim()
        return
      }
      if (connected.role === 'admin') onAller?.('admin')
      else finish()
    } catch (requestError) {
      setError(requestError.message)
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
        if (user.role === 'admin') onAller?.('admin')
        else finish()
      } catch (requestError) {
        setError(requestError.message)
      }
    }
    const continueWithoutClaim = () => {
      effacerClaimToken()
      setError('')
      onAller?.(user.role === 'admin' ? 'admin' : 'compte')
    }
    return (
      <section className="account-page auth-page">
        <div className="account-shell auth-shell">
          <div className="auth-card auth-card-centered">
            <Icon name="check" size={36} />
            <h1>Vous êtes déjà connecté(e)</h1>
            {error && <p className="form-alert" role="alert">{error}</p>}
            <button
              className="btn btn-primary"
              onClick={openSpace}
            >
              Ouvrir mon espace
            </button>
            {error && claimToken && user.role === 'customer' && (
              <button
                type="button"
                className="admin-text-button"
                onClick={continueWithoutClaim}
              >
                Continuer sans rattacher cette commande
              </button>
            )}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="account-page auth-page">
      <div className="account-shell auth-shell">
        <div className="auth-intro">
          <span className="eyebrow">Espace client</span>
          <h1 tabIndex={-1}>Heureux de vous revoir</h1>
          <p>
            Retrouvez vos commandes, vos coordonnées de livraison et commandez
            plus rapidement la prochaine fois.
          </p>
          <ul className="auth-benefits">
            <li><Icon name="check" size={17} /> Suivi de vos commandes</li>
            <li><Icon name="check" size={17} /> Adresse mémorisée après une commande</li>
            <li><Icon name="check" size={17} /> Historique toujours accessible</li>
          </ul>
        </div>

        <form className="auth-card" onSubmit={submit}>
          <h2>Se connecter</h2>
          {!available && !serviceError && (
            <p className="form-alert form-alert-warning">
              L’espace client est en cours d’activation. Vous pouvez toujours
              commander sur WhatsApp.
            </p>
          )}
          {serviceError && (
            <div className="form-alert form-alert-warning">
              <span>Le serveur ne répond pas pour le moment.</span>
              <button type="button" className="admin-text-button" onClick={refresh}>Réessayer</button>
            </div>
          )}
          {error && <p className="form-alert" role="alert">{error}</p>}
          <label>
            Téléphone ou e-mail
            <input
              name="identifier"
              autoComplete="username"
              required
              placeholder="6XX XX XX XX ou votre e-mail"
            />
          </label>
          <label>
            Mot de passe
            <input
              name="password"
              type="password"
              autoComplete="current-password"
              required
            />
          </label>
          <button className="btn btn-primary" disabled={submitting || !available}>
            {submitting ? 'Connexion…' : 'Me connecter'}
          </button>
          <a
            className="auth-help"
            href={waLink(
              `Bonjour Lizzirene Déco ! J’ai besoin d’aide pour accéder à mon compte. Mon téléphone : `,
            )}
            target="_blank"
            rel="noreferrer"
          >
            Mot de passe oublié ? Écrivez-nous sur WhatsApp
          </a>
          <p className="auth-switch">
            Première commande ?{' '}
            <a
              href={urlInscription({ returnTo })}
              onClick={(event) => {
                if (!intercepterNavigation(event)) return
                onAller?.('inscription', { claimToken, returnTo })
              }}
            >
              Créer mon compte
            </a>
          </p>
          <small>
            Besoin d’aide ? {CONTACT.phoneDisplay}
          </small>
        </form>
      </div>
    </section>
  )
}

export default Connexion
