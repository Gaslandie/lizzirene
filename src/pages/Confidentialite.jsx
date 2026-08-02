import { CONTACT, waLink } from '../config.js'

function Confidentialite() {
  return (
    <section className="legal-page">
      <div className="legal-shell">
        <span className="eyebrow">Vos données</span>
        <h1 tabIndex={-1}>Politique de confidentialité</h1>
        <p className="legal-intro">
          Cette page explique simplement les informations utilisées par
          Lizzirene Déco lorsque vous créez un compte ou préparez une commande.
        </p>

        <article>
          <h2>Qui gère vos informations ?</h2>
          <p>
            Lizzirene Déco, boutique située à {CONTACT.address}, Conakry. Pour
            toute question, écrivez à <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>{' '}
            ou contactez la boutique sur{' '}
            <a href={waLink('Bonjour Lizzirene Déco ! J’ai une question concernant mes données personnelles.')} target="_blank" rel="noreferrer">WhatsApp</a>.
          </p>
        </article>

        <article>
          <h2>Informations utilisées</h2>
          <p>
            Selon votre parcours : nom, téléphone, e-mail facultatif, adresse
            et repères de livraison, destinataire, contenu et suivi des
            commandes. Le mot de passe est conservé uniquement sous une forme
            hachée irréversible. Des données techniques limitées servent à
            sécuriser les connexions et éviter les abus.
          </p>
        </article>

        <article>
          <h2>Pourquoi ?</h2>
          <p>
            Pour enregistrer la demande, préparer ou livrer la commande,
            permettre son suivi, mémoriser les coordonnées choisies, répondre
            au client et protéger les espaces client et administrateur. Les
            informations ne sont pas vendues.
          </p>
        </article>

        <article>
          <h2>WhatsApp et hébergement</h2>
          <p>
            La demande est enregistrée sur le site avant l’ouverture de
            WhatsApp. L’envoi du récapitulatif dans WhatsApp reste une action
            volontaire du client et relève aussi des règles de ce service. Le
            site et sa base sont hébergés chez Bluehost.
          </p>
        </article>

        <article>
          <h2>Durée et vos choix</h2>
          <p>
            Les données sont gardées pendant la durée utile au compte, au suivi
            des commandes, à la sécurité et aux obligations de la boutique.
            Vous pouvez demander une correction, une copie ou la fermeture de
            votre compte en contactant la boutique. Certaines informations de
            commande peuvent devoir être conservées lorsqu’une obligation le
            demande.
          </p>
        </article>

        <article>
          <h2>Stockage sur votre appareil</h2>
          <p>
            Le panier est mémorisé localement dans votre navigateur. Une session
            technique essentielle maintient la connexion et protège les
            formulaires. Après une commande invitée, un jeton temporaire peut
            aussi rester dans l’onglet le temps de rattacher la commande à un
            compte. Ces éléments ne sont pas utilisés à des fins publicitaires.
          </p>
        </article>

        <p className="legal-updated">Dernière mise à jour : 2 août 2026.</p>
      </div>
    </section>
  )
}

export default Confidentialite
