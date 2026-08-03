import { useEffect, useState } from 'react'
import Icon from '../components/Icon.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { apiRequest } from '../services/api.js'
import { formatPrice } from '../config.js'
import {
  ORDER_STATUS_LABELS,
  ORDER_STATUS_TONES,
  formatOrderDate,
} from '../utils/orderStatus.js'
import {
  intercepterNavigation,
  urlAccueil,
  urlCompteCommande,
  urlConnexion,
} from '../utils/navigation.js'

function Compte({ onAller }) {
  const { user, loading, logout, updateProfile, updatePassword } = useAuth()
  const [orders, setOrders] = useState([])
  const [ordersLoading, setOrdersLoading] = useState(true)
  const [ordersError, setOrdersError] = useState('')
  const [ordersReload, setOrdersReload] = useState(0)
  const [notice, setNotice] = useState('')
  const [error, setError] = useState('')
  const [passwordNotice, setPasswordNotice] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [profileSaving, setProfileSaving] = useState(false)
  const [passwordSaving, setPasswordSaving] = useState(false)

  useEffect(() => {
    if (!user || user.role !== 'customer') {
      setOrdersLoading(false)
      return
    }
    let active = true
    setOrdersLoading(true)
    setOrdersError('')
    apiRequest('/me/orders')
      .then((data) => { if (active) setOrders(data) })
      .catch((requestError) => { if (active) setOrdersError(requestError.message) })
      .finally(() => { if (active) setOrdersLoading(false) })
    return () => { active = false }
  }, [ordersReload, user])

  if (loading) {
    return <div className="page-state">Chargement de votre espace…</div>
  }

  if (!user) {
    return (
      <section className="account-page">
        <div className="account-shell">
          <div className="auth-card auth-card-centered">
            <Icon name="bag" size={36} />
            <h1>Connectez-vous pour voir vos commandes</h1>
            <p>Vous pouvez toujours commander sans compte depuis le panier.</p>
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
        </div>
      </section>
    )
  }

  const isAdmin = user.role === 'admin'

  const saveProfile = async (event) => {
    event.preventDefault()
    const form = event.currentTarget
    setError('')
    setNotice('')
    const data = Object.fromEntries(new FormData(event.currentTarget))
    setProfileSaving(true)
    try {
      await updateProfile({
        name: data.name,
        phone: data.phone,
        email: data.email || null,
        commune: data.commune || null,
        quartier: data.quartier || null,
        addressLandmark: data.addressLandmark || null,
        currentPassword: data.currentPassword || null,
      })
      form.elements.currentPassword.value = ''
      setNotice('Vos informations ont été enregistrées.')
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setProfileSaving(false)
    }
  }

  const savePassword = async (event) => {
    event.preventDefault()
    const form = event.currentTarget
    const data = Object.fromEntries(new FormData(form))
    setPasswordError('')
    setPasswordNotice('')
    if (data.newPassword !== data.passwordConfirmation) {
      setPasswordError('Les deux nouveaux mots de passe sont différents.')
      return
    }
    setPasswordSaving(true)
    try {
      await updatePassword({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      })
      form.reset()
      setPasswordNotice('Votre mot de passe a été modifié.')
    } catch (requestError) {
      setPasswordError(requestError.message)
    } finally {
      setPasswordSaving(false)
    }
  }

  return (
    <section className="account-page">
      <div className="account-shell">
        <header className="account-heading">
          <div>
            <span className="eyebrow">{isAdmin ? 'Profil administratrice' : 'Espace client'}</span>
            <h1 tabIndex={-1}>Bonjour {user.name.split(' ')[0]}</h1>
            <p>{isAdmin ? 'Gardez vos accès et vos coordonnées à jour.' : 'Suivez vos demandes et gardez vos informations à jour.'}</p>
          </div>
          <button
            className="btn btn-outline"
            onClick={async () => {
              await logout()
              window.location.assign(urlAccueil())
            }}
          >
            Se déconnecter
          </button>
        </header>

        {error && <p className="form-alert" role="alert">{error}</p>}
        {notice && <p className="form-alert form-alert-success">{notice}</p>}

        <div className={`account-grid ${isAdmin ? 'account-grid-single' : ''}`}>
          {!isAdmin && <div className="account-panel account-orders">
            <div className="panel-heading">
              <div>
                <span className="eyebrow">Historique</span>
                <h2>Mes commandes</h2>
              </div>
              <span className="panel-count">{orders.length}</span>
            </div>
            {ordersLoading ? (
              <p>Chargement des commandes…</p>
            ) : ordersError ? (
              <div className="form-alert" role="alert">
                <span>{ordersError}</span>
                <button className="admin-text-button" onClick={() => setOrdersReload((value) => value + 1)}>
                  Réessayer
                </button>
              </div>
            ) : orders.length === 0 ? (
              <div className="account-empty">
                <Icon name="bag" size={28} />
                <p>Votre première commande apparaîtra ici.</p>
                <button className="btn btn-primary" onClick={() => onAller?.('produits')}>
                  Découvrir les produits
                </button>
              </div>
            ) : (
              <div className="order-list">
                {orders.map((order) => (
                  <a
                    key={order.reference}
                    className="order-row"
                    href={urlCompteCommande(order.reference)}
                    onClick={(event) => {
                      if (!intercepterNavigation(event)) return
                      onAller?.('compte-commande', { reference: order.reference })
                    }}
                  >
                    <div>
                      <strong>{order.reference}</strong>
                      <small>{formatOrderDate(order.createdAt)}</small>
                    </div>
                    <div className="order-row-end">
                      <span className={`status-badge status-${ORDER_STATUS_TONES[order.status]}`}>
                        {ORDER_STATUS_LABELS[order.status] || order.status}
                      </span>
                      <strong>{formatPrice(order.total)}</strong>
                    </div>
                  </a>
                ))}
              </div>
            )}
          </div>}

          <form className="account-panel account-profile" onSubmit={saveProfile}>
            <div className="panel-heading">
              <div>
                <span className="eyebrow">{isAdmin ? 'Compte' : 'Livraison'}</span>
                <h2>Mes coordonnées</h2>
              </div>
            </div>
            <label>Nom complet<input name="name" defaultValue={user.name} required /></label>
            <label>Téléphone<input name="phone" type="tel" defaultValue={user.phone} required /></label>
            <label>E-mail <small>(facultatif)</small><input name="email" type="email" defaultValue={user.email || ''} /></label>
            <label>Mot de passe actuel <small>(seulement pour changer téléphone ou e-mail)</small><input name="currentPassword" type="password" autoComplete="current-password" /></label>
            {!isAdmin && <>
              <label>Commune<input name="commune" defaultValue={user.commune || ''} /></label>
              <label>Quartier<input name="quartier" defaultValue={user.quartier || ''} /></label>
              <label>Adresse / point de repère<textarea name="addressLandmark" rows="3" defaultValue={user.addressLandmark || ''} /></label>
            </>}
            <button className="btn btn-primary" disabled={profileSaving}>{profileSaving ? 'Enregistrement…' : 'Enregistrer'}</button>
          </form>
        </div>

        <form className="account-panel account-password" onSubmit={savePassword}>
          <div>
            <span className="eyebrow">Sécurité</span>
            <h2>Changer mon mot de passe</h2>
            <p>Utilisez au moins 10 caractères et évitez un mot de passe déjà utilisé ailleurs.</p>
          </div>
          {passwordError && <p className="form-alert" role="alert">{passwordError}</p>}
          {passwordNotice && <p className="form-alert form-alert-success" role="status">{passwordNotice}</p>}
          <label>Mot de passe actuel<input name="currentPassword" type="password" autoComplete="current-password" required /></label>
          <label>Nouveau mot de passe<input name="newPassword" type="password" autoComplete="new-password" minLength="10" required /></label>
          <label>Confirmer<input name="passwordConfirmation" type="password" autoComplete="new-password" minLength="10" required /></label>
          <button className="btn btn-outline" disabled={passwordSaving}>{passwordSaving ? 'Modification…' : 'Modifier le mot de passe'}</button>
        </form>
      </div>
    </section>
  )
}

export default Compte
