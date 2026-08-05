import { useState } from 'react'
import Icon from '../components/Icon.jsx'
import { apiRequest } from '../services/api.js'
import {
  intercepterNavigation,
  urlConnexion,
  urlMotDePasseOublie,
} from '../utils/navigation.js'

function ReinitialisationMotDePasse({ onAller }) {
  const token = new URLSearchParams(window.location.search).get('token') || ''
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [completed, setCompleted] = useState(false)

  const submit = async (event) => {
    event.preventDefault()
    setError('')
    const data = Object.fromEntries(new FormData(event.currentTarget))
    if (data.newPassword !== data.passwordConfirmation) {
      setError('Les deux mots de passe ne correspondent pas.')
      return
    }

    setSubmitting(true)
    try {
      await apiRequest('/auth/password-reset/complete', {
        method: 'POST',
        body: {
          token,
          newPassword: data.newPassword,
          passwordConfirmation: data.passwordConfirmation,
        },
      })
      window.history.replaceState({}, '', window.location.pathname)
      setCompleted(true)
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setSubmitting(false)
    }
  }

  if (!token) {
    return (
      <section className="account-page auth-page">
        <div className="account-shell auth-shell auth-shell-single">
          <div className="auth-card auth-card-centered">
            <h1>Lien incomplet</h1>
            <p>Demandez un nouveau lien de réinitialisation.</p>
            <a className="btn btn-primary" href={urlMotDePasseOublie()}>
              Demander un lien
            </a>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="account-page auth-page">
      <div className="account-shell auth-shell auth-shell-single">
        {completed ? (
          <div className="auth-card auth-card-centered">
            <Icon name="check" size={36} />
            <h1>Mot de passe modifié</h1>
            <p>Vous pouvez maintenant vous connecter avec votre nouveau mot de passe.</p>
            <a
              className="btn btn-primary"
              href={urlConnexion()}
              onClick={(event) => {
                if (!intercepterNavigation(event)) return
                onAller?.('connexion')
              }}
            >
              Se connecter
            </a>
          </div>
        ) : (
          <form className="auth-card" onSubmit={submit}>
            <div>
              <span className="eyebrow">Compte sécurisé</span>
              <h1 tabIndex={-1}>Nouveau mot de passe</h1>
            </div>
            <p>Choisissez au moins 10 caractères et ne réutilisez pas un ancien mot de passe.</p>
            {error && <p className="form-alert" role="alert">{error}</p>}
            <label>
              Nouveau mot de passe
              <input
                name="newPassword"
                type="password"
                autoComplete="new-password"
                minLength="10"
                required
                autoFocus
              />
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
            </label>
            <button className="btn btn-primary" disabled={submitting}>
              {submitting ? 'Modification…' : 'Choisir ce mot de passe'}
            </button>
          </form>
        )}
      </div>
    </section>
  )
}

export default ReinitialisationMotDePasse
