import { useState } from 'react'
import Icon from '../components/Icon.jsx'
import { apiRequest } from '../services/api.js'
import {
  intercepterNavigation,
  urlConnexion,
} from '../utils/navigation.js'

function MotDePasseOublie({ onAller }) {
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')

  const submit = async (event) => {
    event.preventDefault()
    setError('')
    setSubmitting(true)
    const data = Object.fromEntries(new FormData(event.currentTarget))
    try {
      const result = await apiRequest('/auth/password-reset/request', {
        method: 'POST',
        body: { identifier: data.identifier },
      })
      setNotice(result.message)
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section className="account-page auth-page">
      <div className="account-shell auth-shell auth-shell-single">
        <form className="auth-card" onSubmit={submit}>
          <Icon name="mail" size={34} />
          <div>
            <span className="eyebrow">Accès au compte</span>
            <h1 tabIndex={-1}>Mot de passe oublié</h1>
          </div>
          <p>
            Saisissez le téléphone ou l’e-mail associé au compte. Le lien sera
            envoyé à l’adresse e-mail enregistrée.
          </p>
          {notice && <p className="form-alert form-alert-success" role="status">{notice}</p>}
          {error && <p className="form-alert" role="alert">{error}</p>}
          {!notice && (
            <>
              <label>
                Téléphone ou e-mail
                <input
                  name="identifier"
                  autoComplete="username"
                  required
                  autoFocus
                  placeholder="6XX XX XX XX ou votre e-mail"
                />
              </label>
              <button className="btn btn-primary" disabled={submitting}>
                <Icon name="mail" size={18} />
                {submitting ? 'Envoi…' : 'Envoyer le lien'}
              </button>
            </>
          )}
          <a
            className="auth-help"
            href={urlConnexion()}
            onClick={(event) => {
              if (!intercepterNavigation(event)) return
              onAller?.('connexion')
            }}
          >
            Retour à la connexion
          </a>
        </form>
      </div>
    </section>
  )
}

export default MotDePasseOublie
