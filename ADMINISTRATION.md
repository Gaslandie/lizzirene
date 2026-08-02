# Guide d’administration Lizzirene Déco

L’administration se trouve à `https://lizzirenedeco.com/admin`. Elle est privée
et n’apparaît pas dans les moteurs de recherche. Après 30 minutes d’inactivité,
une nouvelle connexion peut être demandée.

Le lien **Mon profil** en haut permet de modifier les coordonnées et le mot de
passe administratrice.

## Commandes du site

Une commande passée depuis le panier apparaît d’abord avec le statut
**À confirmer sur WhatsApp**. La référence existe déjà, mais ce n’est pas encore
une promesse de disponibilité ou de livraison.

Après l’échange WhatsApp :

1. ouvrir la commande ;
2. utiliser **Modifier le client ou la livraison** si le téléphone, l’adresse,
   le destinataire ou la date a changé ;
3. corriger si nécessaire l’ajustement du prix et sa raison ;
4. saisir les frais de livraison ;
5. choisir **Confirmée** ;
6. enregistrer un message visible par la cliente si utile.

Le cycle normal est :

```text
À confirmer → Confirmée → En préparation → Prête → En livraison → Livrée
```

Une commande retirée à Kipé peut passer directement de **Prête** à **Livrée**.
Une demande sans confirmation expire après 72 heures lors de la prochaine
ouverture de l’administration ; elle peut être réactivée si la cliente revient.

Le paiement reste manuel : **Non payé**, **Payé**, ou **Remboursé** pour une
commande annulée. Aucun bouton Orange Money n’est proposé au client.

## Commande reçue directement sur WhatsApp

Dans **Commandes**, cliquer sur **Enregistrer une commande WhatsApp**. Cette
fonction sert quand la cliente n’est pas passée par le panier : appel, message
direct ou commande en boutique. Renseigner les articles convenus, le montant,
le mode de remise et le paiement. La commande est créée comme confirmée et se
rattache automatiquement à un compte client existant si le téléphone correspond.
Si la cliente crée son compte plus tard, rouvrir la commande puis cliquer sur
**Rattacher à son compte client**. Le numéro de la commande et celui du compte
doivent correspondre ; la boutique garde ainsi le contrôle du rattachement.

## Produits

Pour ajouter un produit :

1. ouvrir **Produits → Ajouter un produit** ;
2. renseigner le nom, la catégorie, la description et le prix ;
3. choisir **Brouillon** tant que la fiche n’est pas vérifiée ;
4. envoyer une photo JPEG, PNG ou WebP de moins de 8 Mo ;
5. ajouter un texte alternatif décrivant la photo ;
6. passer à **Publié** quand tout est prêt.

Les photos de téléphone sont automatiquement réorientées, nettoyées et
redimensionnées. **Indisponible** conserve la fiche mais bloque l’ajout au panier.
**Sur commande** la laisse achetable avec confirmation. **Archiver** retire le
produit du site sans casser les anciennes commandes ; il vaut mieux archiver que
supprimer.

Les trois types de prix sont :

- **Prix fixe** : montant normal ;
- **À partir de** : minimum, finalisé avec la cliente ;
- **Sur devis** : pas d’ajout au panier, contact WhatsApp direct.

## Comptes clients

Le compte est facultatif. Il permet de conserver l’adresse, retrouver les
commandes et suivre leur progression. L’adresse d’une livraison connectée est
mémorisée automatiquement. Une cliente invitée peut créer son compte juste
après la commande ; le rattachement exige le même numéro de téléphone et un
jeton temporaire propre à cette commande.

Pour protéger un changement de téléphone ou d’e-mail, le mot de passe actuel est
demandé. Le changement de mot de passe déconnecte les autres appareils.

Si une cliente oublie son mot de passe, elle contacte la boutique sur WhatsApp.
Avant de demander une intervention technique, vérifier son identité avec des
informations déjà connues de la commande. Ne jamais demander son ancien mot de
passe par message.

## Bonnes pratiques

- ne jamais partager le mot de passe administratrice ;
- se déconnecter sur un téléphone ou ordinateur partagé ;
- ne pas confirmer une commande avant l’échange WhatsApp ;
- utiliser les notes privées pour l’équipe et les messages visibles pour la cliente ;
- sauvegarder la base et les photos, puis tester une restauration ;
- conserver `config.php`, les mots de passe et les jetons hors de GitHub.
