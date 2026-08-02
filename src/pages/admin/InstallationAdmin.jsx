import { useState } from 'react'
import { useAuth } from '../../context/AuthContext.jsx'
import { apiRequest } from '../../services/api.js'

function InstallationAdmin({ onAller }) {
  const { available, installed, refresh } = useAuth()
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  if (installed) {
    return (
      <div className="admin-setup-card">
        <h1>L’administration est déjà installée</h1>
        <button className="btn btn-primary" onClick={() => onAller?.('admin')}>
          Ouvrir l’administration
        </button>
      </div>
    )
  }

  const submit = async (event) => {
    event.preventDefault()
    setError('')
    const data = Object.fromEntries(new FormData(event.currentTarget))
    if (data.password !== data.passwordConfirmation) {
      setError('Les deux mots de passe sont différents.')
      return
    }
    setSubmitting(true)
    try {
      await apiRequest('/setup/initialize', {
        method: 'POST',
        headers: { 'X-Setup-Token': data.setupToken },
        body: {
          name: data.name,
          phone: data.phone,
          email: data.email,
          password: data.password,
        },
      })
      await refresh()
      onAller?.('admin')
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="admin-setup-card">
      <span className="eyebrow">Installation unique</span>
      <h1>Créer l’espace administratrice</h1>
      <p>
        Cette étape crée les tables MySQL, importe les 84 produits actuels et
        crée le premier compte administrateur. Elle se bloque automatiquement
        une fois terminée.
      </p>
      {!available && (
        <p className="form-alert form-alert-warning">
          Le fichier de configuration privé Bluehost n’est pas encore détecté.
        </p>
      )}
      {error && <p className="form-alert" role="alert">{error}</p>}
      <form onSubmit={submit}>
        <label>
          Jeton d’installation privé
          <input name="setupToken" type="password" required minLength="64" autoComplete="off" />
        </label>
        <label>Nom complet<input name="name" required /></label>
        <label>Téléphone<input name="phone" type="tel" required /></label>
        <label>E-mail administratrice<input name="email" type="email" required /></label>
        <label>Mot de passe administratrice<input name="password" type="password" minLength="12" required /></label>
        <label>Confirmer le mot de passe<input name="passwordConfirmation" type="password" minLength="12" required /></label>
        <button className="btn btn-primary" disabled={submitting || !available}>
          {submitting ? 'Installation…' : 'Installer en sécurité'}
        </button>
      </form>
    </div>
  )
}

export default InstallationAdmin
