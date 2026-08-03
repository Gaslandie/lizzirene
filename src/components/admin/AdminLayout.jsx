import { useAuth } from '../../context/AuthContext.jsx'
import {
  intercepterNavigation,
  urlAdmin,
  urlAdminCommandes,
  urlAdminInstallation,
  urlAdminProduits,
  urlAccueil,
  urlConnexion,
} from '../../utils/navigation.js'

const LINKS = [
  { page: 'admin', label: 'Vue d’ensemble', href: urlAdmin() },
  { page: 'admin-commandes', label: 'Commandes', href: urlAdminCommandes() },
  { page: 'admin-produits', label: 'Produits', href: urlAdminProduits() },
]

function AdminLayout({ page, onAller, children, allowInstallation = false }) {
  const { user, loading, installed, serviceError, refresh, logout } = useAuth()

  if (loading) return <div className="page-state">Vérification de l’accès…</div>

  if (serviceError) {
    return (
      <div className="page-state">
        <h1>Administration momentanément inaccessible</h1>
        <p>La connexion au serveur a échoué. Vérifiez le réseau puis réessayez.</p>
        <button className="btn btn-primary" onClick={refresh}>Réessayer</button>
      </div>
    )
  }

  if (allowInstallation && !installed) return children

  if (!installed) {
    return (
      <div className="page-state">
        <h1>Administration à initialiser</h1>
        <p>La base Bluehost doit être configurée une seule fois.</p>
        <a
          className="btn btn-primary"
          href={urlAdminInstallation()}
          onClick={(event) => {
            if (!intercepterNavigation(event)) return
            onAller?.('admin-installation')
          }}
        >
          Lancer l’installation
        </a>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="page-state">
        <h1>Connexion administratrice</h1>
        <p>Connectez-vous avec le compte créé lors de l’installation.</p>
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
        <a className="btn btn-outline" href={urlAccueil()}>
          Retour à l’accueil
        </a>
      </div>
    )
  }

  if (user.role !== 'admin') {
    return (
      <div className="page-state">
        <h1>Accès réservé</h1>
        <p>Ce compte ne possède pas les droits d’administration.</p>
        <button className="btn btn-outline" onClick={() => onAller?.('compte')}>
          Retour à mon compte
        </button>
      </div>
    )
  }

  return (
    <section className="admin-page">
      <header className="admin-topbar">
        <div>
          <span className="admin-brand">Lizzirene Déco</span>
          <strong>Administration</strong>
        </div>
        <div className="admin-user">
          <span>{user.name}</span>
          <button
            className="admin-text-button"
            onClick={() => onAller?.('compte')}
          >
            Mon profil
          </button>
          <button
            className="admin-text-button"
            onClick={async () => {
              await logout()
              window.location.assign(urlAccueil())
            }}
          >
            Déconnexion
          </button>
        </div>
      </header>
      <div className="admin-layout">
        <nav className="admin-nav" aria-label="Administration">
          {LINKS.map((link) => {
            const active =
              page === link.page ||
              (link.page === 'admin-commandes' && page.startsWith('admin-commande')) ||
              (link.page === 'admin-produits' && page.startsWith('admin-produit'))
            return (
              <a
              key={link.page}
              href={link.href}
              className={active ? 'active' : ''}
              aria-current={active ? 'page' : undefined}
              onClick={(event) => {
                if (!intercepterNavigation(event)) return
                onAller?.(link.page)
              }}
            >
              {link.label}
              </a>
            )
          })}
          <a href="/" onClick={(event) => {
            if (!intercepterNavigation(event)) return
            onAller?.('accueil')
          }}>
            Voir le site
          </a>
        </nav>
        <main className="admin-content">{children}</main>
      </div>
    </section>
  )
}

export default AdminLayout
