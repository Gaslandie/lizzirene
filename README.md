# Lizzirene Déco

Site marchand de Lizzirene Déco à Kipé, Conakry : catalogue, panier, commande
assistée par WhatsApp, comptes clients facultatifs et administration privée.

Le parcours est volontairement simple : le client peut commander sans compte.
Le site enregistre d’abord sa demande et lui donne une référence, puis ouvre
WhatsApp avec le récapitulatif. La commande reste « à confirmer » jusqu’à ce que
la boutique confirme la disponibilité, le prix final et la livraison.

## Fonctionnalités

- catalogue administrable, brouillons, produits indisponibles et archivage ;
- panier conservé sur l’appareil, livraison à Conakry ou retrait à Kipé ;
- commande invitée sans inscription, puis confirmation sur WhatsApp ;
- compte client facultatif avec adresse, historique et suivi des statuts ;
- rattachement d’une commande invitée à un nouveau compte ou à un compte existant ;
- tableau de bord administrateur, suivi, correction des coordonnées et ajustement du prix ;
- saisie manuelle d’une commande reçue directement sur WhatsApp ou par téléphone ;
- ajout de photos JPEG, PNG ou WebP, réencodées et redimensionnées côté serveur ;
- paiement à la livraison ou au retrait. Aucun paiement Orange Money n’est intégré.

## Stack

| Partie | Technologie |
| --- | --- |
| Interface | React 19, Vite, CSS natif |
| API | PHP 8.1+ sans framework |
| Données | MySQL / MariaDB, PDO et migrations SQL |
| Hébergement | Bluehost, Apache, HTTPS |
| Livraison | GitHub Actions vers Bluehost par FTPS explicite |

L’API et l’interface sont servies sur le même domaine. L’authentification utilise
des sessions PHP sécurisées et un jeton CSRF ; aucun jeton de connexion n’est
stocké dans `localStorage`.

## Développement

```bash
npm ci
npm run dev
npm run lint
npm run build
```

Le build exécute aussi :

- l’optimisation des images ;
- la génération du catalogue SQL initial à partir des produits versionnés ;
- la génération du sitemap statique de secours.

Sans configuration MySQL locale, le front utilise le catalogue statique et la
commande peut toujours partir directement sur WhatsApp. La production utilise
le catalogue de l’API dès que Bluehost est configuré.

## Structure utile

```text
public/api/                    API PHP et migration initiale
public/uploads/                règles Apache des photos administrateur
src/context/                   authentification, catalogue et panier
src/pages/admin/               administration produits et commandes
src/pages/Compte.jsx           espace client
src/components/CartDrawer.jsx  tunnel panier → référence → WhatsApp
src/config.js                  coordonnées publiques de la boutique
src/data/products.js           catalogue initial et secours
scripts/                       images, seed API et sitemap
```

## Production

Chaque push fusionné dans `main` déclenche le lint JavaScript, le lint de tous
les fichiers PHP, les tests MySQL, les migrations protégées, le build, les
contrôles de l’artefact, le transfert FTPS et des tests publics. Les photos ajoutées depuis l’administration et la
configuration privée sont explicitement exclues des suppressions de déploiement.

L’activation MySQL et la première administratrice sont détaillées dans
[DEPLOIEMENT.md](DEPLOIEMENT.md). Le fonctionnement quotidien est décrit dans
[ADMINISTRATION.md](ADMINISTRATION.md).

Ne jamais versionner un mot de passe, un jeton d’installation, une clé privée ou
le fichier `config.php` de production.
