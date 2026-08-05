import { Fragment, useEffect, useState } from 'react'
import Icon from '../../components/Icon.jsx'
import { apiRequest } from '../../services/api.js'
import { formatOrderDate } from '../../utils/orderStatus.js'

function ClientesAdmin() {
  const [customers, setCustomers] = useState([])
  const [search, setSearch] = useState('')
  const [emailFilter, setEmailFilter] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [sendingId, setSendingId] = useState(null)
  const [reload, setReload] = useState(0)

  useEffect(() => {
    let active = true
    const parameters = new URLSearchParams()
    if (search.trim()) parameters.set('search', search.trim())
    if (emailFilter) parameters.set('email', emailFilter)
    setLoading(true)
    setError('')
    const timer = window.setTimeout(() => {
      apiRequest(`/admin/customers${parameters.size ? `?${parameters}` : ''}`)
        .then((data) => {
          if (active) setCustomers(data)
        })
        .catch((requestError) => {
          if (active) setError(requestError.message)
        })
        .finally(() => {
          if (active) setLoading(false)
        })
    }, search ? 250 : 0)

    return () => {
      active = false
      window.clearTimeout(timer)
    }
  }, [emailFilter, reload, search])

  const sendReset = async (customer, body = {}) => {
    setSendingId(customer.id)
    setError('')
    setNotice('')
    try {
      const result = await apiRequest(
        `/admin/customers/${encodeURIComponent(customer.id)}/password-reset`,
        { method: 'POST', body },
      )
      setNotice(`Lien envoyé à ${result.email}.`)
      setEditingId(null)
      setReload((value) => value + 1)
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setSendingId(null)
    }
  }

  const saveEmailAndSend = (event, customer) => {
    event.preventDefault()
    const data = Object.fromEntries(new FormData(event.currentTarget))
    sendReset(customer, {
      email: data.email,
      emailVerified: data.emailVerified === 'on',
    })
  }

  return (
    <>
      <header className="admin-heading">
        <div>
          <span className="eyebrow">Comptes</span>
          <h1>Clientes</h1>
          <p>{customers.length} résultat{customers.length > 1 ? 's' : ''}</p>
        </div>
      </header>
      <div className="admin-toolbar">
        <input
          aria-label="Rechercher une cliente"
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Nom, téléphone ou e-mail…"
        />
        <select
          aria-label="Filtrer les clientes par e-mail"
          value={emailFilter}
          onChange={(event) => setEmailFilter(event.target.value)}
        >
          <option value="">Toutes les clientes</option>
          <option value="with">Avec e-mail</option>
          <option value="without">Sans e-mail</option>
        </select>
      </div>
      {notice && <p className="form-alert form-alert-success" role="status">{notice}</p>}
      {error && <p className="form-alert" role="alert">{error}</p>}
      <section className="admin-panel">
        {loading ? <p>Chargement…</p> : (
          <div className="admin-table-wrap">
            <table className="admin-table customers-admin-table">
              <thead>
                <tr>
                  <th scope="col">Cliente</th>
                  <th scope="col">E-mail</th>
                  <th scope="col">Commandes</th>
                  <th scope="col">Dernière connexion</th>
                  <th scope="col"><span className="sr-only">Actions</span></th>
                </tr>
              </thead>
              <tbody>
                {customers.map((customer) => (
                  <Fragment key={customer.id}>
                    <tr>
                      <td>
                        <strong>{customer.name}</strong>
                        <small>{customer.phone}</small>
                      </td>
                      <td>
                        {customer.email || <span className="status-badge status-warning">À ajouter</span>}
                        {customer.lastResetAt && <small>Lien actif depuis le {formatOrderDate(customer.lastResetAt)}</small>}
                      </td>
                      <td>{customer.orderCount}</td>
                      <td>{customer.lastLoginAt ? formatOrderDate(customer.lastLoginAt) : 'Jamais'}</td>
                      <td>
                        <div className="admin-customer-actions">
                          {customer.email && (
                            <button
                              type="button"
                              className="btn btn-primary btn-compact"
                              disabled={sendingId === customer.id}
                              onClick={() => sendReset(customer)}
                            >
                              <Icon name="mail" size={17} />
                              {sendingId === customer.id ? 'Envoi…' : 'Envoyer le lien'}
                            </button>
                          )}
                          <button
                            type="button"
                            className="admin-text-button"
                            onClick={() => setEditingId(editingId === customer.id ? null : customer.id)}
                          >
                            {customer.email ? 'Modifier l’e-mail' : 'Ajouter un e-mail'}
                          </button>
                        </div>
                      </td>
                    </tr>
                    {editingId === customer.id && (
                      <tr className="admin-inline-row">
                        <td colSpan="5">
                          <form
                            className="admin-inline-editor"
                            onSubmit={(event) => saveEmailAndSend(event, customer)}
                          >
                            <label>
                              Adresse e-mail de la cliente
                              <input
                                name="email"
                                type="email"
                                defaultValue={customer.email || ''}
                                autoComplete="off"
                                required
                                autoFocus
                              />
                            </label>
                            <label className="admin-checkbox admin-email-confirmation">
                              <input name="emailVerified" type="checkbox" required />
                              <span>J’ai vérifié cette adresse avec la cliente.</span>
                            </label>
                            <div className="admin-inline-actions">
                              <button
                                className="btn btn-primary"
                                disabled={sendingId === customer.id}
                              >
                                <Icon name="mail" size={18} />
                                {sendingId === customer.id ? 'Envoi…' : 'Enregistrer et envoyer'}
                              </button>
                              <button
                                type="button"
                                className="btn btn-outline"
                                onClick={() => setEditingId(null)}
                              >
                                Annuler
                              </button>
                            </div>
                          </form>
                        </td>
                      </tr>
                    )}
                  </Fragment>
                ))}
                {customers.length === 0 && (
                  <tr><td colSpan="5">Aucune cliente ne correspond à ces filtres.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </>
  )
}

export default ClientesAdmin
