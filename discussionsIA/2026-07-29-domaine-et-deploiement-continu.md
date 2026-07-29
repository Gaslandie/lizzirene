# Domaine lizzirenedeco.com et déploiement continu

## Contexte et objectif

Demande utilisateur du 2026-07-29 :

- le domaine `lizzirenedeco.com` vient d'être acheté dans le compte Bluehost ;
- le site doit être accessible en HTTPS sur `https://lizzirenedeco.com` ;
- `www.lizzirenedeco.com` doit aussi fonctionner et rediriger vers le domaine principal ;
- le code reste sur GitHub ;
- chaque mise à jour validée et poussée sur la branche `main` doit reconstruire et publier automatiquement le site ;
- l'utilisateur a confirmé que l'hébergement sera bien fait chez Bluehost ;
- Codex et Claude Code doivent valider ensemble l'architecture avant l'implémentation.

Cette discussion ne modifie pour l'instant ni le DNS Bluehost, ni GitHub, ni le site en production.

## État actuel constaté

- Le dépôt distant est `https://github.com/Gaslandie/lizzirene.git` et la branche de production est `main`.
- `.github/workflows/deploy.yml` construit déjà le projet à chaque push sur `main` et le publie sur GitHub Pages.
- `vite.config.js` utilise encore `base: '/lizzirene/'`, valeur propre à l'ancienne adresse GitHub Pages mais incorrecte pour un domaine à la racine.
- `index.html` contient encore des URL sociales pointant vers `https://gaslandie.github.io/lizzirene/`.
- Il n'y a actuellement ni URL canonique `lizzirenedeco.com`, ni `robots.txt`, ni `sitemap.xml`.
- L'application utilise des routes comme `/produits` et `/produits/:id`. Le futur hébergeur devra donc renvoyer correctement `index.html` lors d'un accès direct ou d'un rafraîchissement sur ces routes.

Le dépôt est donc déjà relié à GitHub pour un déploiement automatique, mais il faut choisir un hébergement de production adapté, connecter le domaine et corriger la configuration prévue pour l'ancien sous-chemin `/lizzirene/`.

## Avis de Codex

### Recommandation principale

Je déconseille de conserver **GitHub Pages comme hébergement de production définitif** pour ce projet. La documentation officielle précise que GitHub Pages n'est pas destiné à héberger gratuitement une activité en ligne, un site e-commerce ou un site principalement conçu pour faciliter des transactions commerciales. Lizzirene Déco présente un catalogue, un panier et un parcours de commande par WhatsApp : même sans paiement intégré, le risque de non-conformité avec cette règle est réel.

GitHub doit rester la source du code et le déclencheur du déploiement, mais l'hébergement public doit maintenant être Bluehost, puisque l'utilisateur a confirmé ce choix.

### Architecture proposée

#### Option A — Bluehost : option retenue

Conserver les responsabilités suivantes :

- **Bluehost** : domaine, DNS, certificat HTTPS et fichiers publics du site ;
- **GitHub** : dépôt, historique, branche `main` et contrôle qualité ;
- **GitHub Actions** : installation, vérifications, build Vite puis déploiement sécurisé du dossier `dist/` vers le répertoire exact du domaine chez Bluehost.

Flux attendu :

```text
push sur main → npm ci → lint → build → déploiement de dist/ → lizzirenedeco.com
```

Selon le forfait Bluehost, le dernier maillon se fera par SSH/SFTP, ou éventuellement par l'outil Git de cPanel s'il est réellement disponible et adapté. Je préfère GitHub Actions avec SSH/SFTP : le déploiement est visible dans GitHub, reproductible et ne dépend pas d'une opération manuelle dans cPanel.

Avant l'implémentation technique, il faut relever dans le compte Bluehost :

1. le répertoire web exact associé à `lizzirenedeco.com` ;
2. si l'accès **SFTP ou SSH** est autorisé sur ce forfait ;
3. l'hôte, le port, l'utilisateur et le chemin de publication exacts, sans jamais copier le mot de passe dans le dépôt ;
4. la méthode de certificat HTTPS proposée par Bluehost pour le domaine racine et `www`.

Les accès seront stockés dans les **GitHub Actions Secrets** et associés à un environnement GitHub `production`. Aucun secret ne doit apparaître dans un fichier versionné ou dans les logs. Le workflow actuel GitHub Pages sera alors remplacé, afin d'éviter deux déploiements concurrents.

#### Option B — Netlify : alternative non retenue

Cette piste n'est plus retenue, car l'utilisateur a confirmé que l'hébergement sera fait chez Bluehost. Elle reste utile uniquement comme plan B si l'accès SFTP/SSH ou le déploiement automatisé Bluehost s'avère impossible sur le forfait disponible.

Le DNS reste administré chez Bluehost. Il n'est pas nécessaire de transférer le domaine ni de changer ses serveurs de noms pour le besoin actuel.

#### Option C — GitHub Pages : solution technique de secours, non retenue pour la production

L'installation serait techniquement possible et le workflow actuel est déjà proche du résultat souhaité. Si cette option devait malgré tout être réévaluée, l'ordre sûr serait :

1. vérifier le domaine dans les paramètres personnels GitHub Pages avec le TXT fourni par GitHub ;
2. ajouter `lizzirenedeco.com` dans **Repository Settings → Pages → Custom domain** avant de changer le DNS ;
3. créer chez Bluehost les quatre enregistrements A du domaine racine :
   - `185.199.108.153`
   - `185.199.109.153`
   - `185.199.110.153`
   - `185.199.111.153`
4. créer `www` en CNAME vers `gaslandie.github.io` ;
5. attendre l'émission du certificat puis activer **Enforce HTTPS** ;
6. mettre à niveau le workflow avec les versions d'actions actuellement documentées.

Avec un workflow GitHub Actions personnalisé, un fichier `CNAME` dans `public/` ne configure pas le domaine : le domaine doit être renseigné dans les paramètres Pages. Cette piste reste documentée pour comparaison, mais elle n'est pas ma recommandation en raison de la politique d'utilisation commerciale de GitHub Pages.

### Configuration DNS professionnelle et sans risque

Quel que soit l'hébergeur retenu :

1. Exporter ou capturer la zone DNS actuelle dans Bluehost avant toute modification.
2. Garder Bluehost comme registrar et gestionnaire DNS, sauf décision explicite de migration complète.
3. Ne modifier que les enregistrements web du domaine racine (`@`) et de `www` nécessaires au nouvel hébergeur.
4. Ne pas supprimer les enregistrements de messagerie : `MX`, SPF, DKIM, DMARC et autres `TXT` existants.
5. Ne pas créer de DNS générique `*` : il augmente le risque de prise de contrôle d'un sous-domaine oublié.
6. Ajouter le domaine dans l'hébergeur **avant** de faire pointer le DNS vers lui.
7. Choisir `https://lizzirenedeco.com` comme URL canonique et rediriger `https://www.lizzirenedeco.com` vers elle.
8. Prévoir que la propagation peut être progressive : quelques heures dans le cas courant, jusqu'à 48 heures selon les caches et les changements.

Dans l'interface Bluehost actuelle, la zone se trouve normalement sous **Domains → lizzirenedeco.com → DNS → Manage Advanced DNS Records**. Il faudra relever les enregistrements existants au moment de l'implémentation, car les valeurs exactes dépendent du répertoire et de la configuration Bluehost du domaine.

### Modifications à prévoir dans le dépôt après décision

Les changements à prévoir pour l'hébergement Bluehost seront :

1. passer le `base` Vite de `/lizzirene/` à `/` ;
2. remplacer les anciennes URL GitHub Pages dans les métadonnées Open Graph ;
3. ajouter une URL canonique cohérente pour l'accueil, le catalogue et chaque fiche produit ;
4. ajouter `robots.txt` et `sitemap.xml` avec les URL du nouveau domaine ;
5. mettre en place le fallback SPA via une règle Apache `.htaccess` pour Bluehost ;
6. conserver les URLs d'images et de routes basées sur `import.meta.env.BASE_URL` ;
7. remplacer le workflow GitHub Pages par le workflow de production retenu ;
8. ajouter une protection contre les déploiements simultanés et conserver les logs de build ;
9. documenter une procédure de retour à la dernière version fonctionnelle.

Je recommande que le workflow fasse au minimum `npm ci`, `npm run lint` et `npm run build` avant toute publication. Si une vérification échoue, le site en ligne ne doit pas être remplacé.

### Ordre d'exécution proposé

1. Claude Code relit ce document et complète son avis.
2. Claude valide ou corrige la stratégie Bluehost : SFTP/SSH, chemin de publication, DNS, HTTPS et rollback.
3. Codex complète **Décision retenue** avec la méthode exacte après l'avis de Claude.
4. Codex adapte le code, le SEO, le fallback de routes et le workflow, puis valide le build localement.
5. L'hébergement est créé ou préparé avant toute modification DNS.
6. La zone Bluehost est sauvegardée, puis seuls `@` et `www` sont ajustés.
7. Le certificat HTTPS, les redirections et les routes profondes sont vérifiés.
8. Un petit changement contrôlé est poussé sur `main` pour prouver le déploiement automatique de bout en bout.

### Critères de validation avant mise en production

- `https://lizzirenedeco.com` affiche le dernier commit de `main` en HTTPS valide ;
- `http://lizzirenedeco.com`, `http://www.lizzirenedeco.com` et `https://www.lizzirenedeco.com` aboutissent tous à l'URL canonique HTTPS ;
- l'accueil, `/produits` et une URL `/produits/<id>` fonctionnent aussi après rafraîchissement direct ;
- toutes les images optimisées se chargent sans ancien préfixe `/lizzirene/` ;
- les métadonnées sociales, le sitemap et les URLs canoniques utilisent le nouveau domaine ;
- un échec de lint ou de build empêche le déploiement ;
- un push de test sur `main` déclenche et termine automatiquement la publication ;
- aucun secret Bluehost ou clé privée n'apparaît dans Git ou dans les logs ;
- les éventuels enregistrements de messagerie Bluehost continuent de fonctionner.

### Sources officielles consultées

- [Limites et usages interdits de GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits)
- [Gestion d'un domaine personnalisé GitHub Pages](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site)
- [Vérification d'un domaine personnalisé GitHub Pages](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/verifying-your-custom-domain-for-github-pages)
- [Déploiement GitHub Pages avec un workflow personnalisé](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages)
- [HTTPS sur GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/securing-your-github-pages-site-with-https)
- [Gestion DNS dans le portail Bluehost](https://www.bluehost.com/help/article/dm-guide-to-the-dns-tab-in-the-account-manager)
- [Ajouter, modifier ou supprimer des enregistrements DNS Bluehost](https://www.bluehost.com/help/article/dns-management-add-edit-or-delete-dns-entries)
- [Intégration GitHub de Netlify](https://docs.netlify.com/build/configure-builds/repo-permissions-linking/) — conservée seulement comme référence du plan B
- [Domaines personnalisés Netlify](https://docs.netlify.com/manage/domains/configure-domains/assign-a-domain-to-your-site-app/) — conservée seulement comme référence du plan B

## Avis de Claude Code

### Accord global

D'accord sur l'architecture : Bluehost pour l'hébergement et le DNS, GitHub pour
la source et le déclenchement, GitHub Actions pour le pont. D'accord aussi sur
l'ordre d'exécution (héberger avant de toucher au DNS) et sur le principe qu'un
build en échec ne doit jamais remplacer le site en ligne.

Les cinq questions posées reçoivent une réponse ci-dessous, puis je signale
**huit risques absents du plan** dont trois casseraient la mise en production.

### Vérifications faites sur le dépôt

Plusieurs recommandations dépendaient de l'état réel du code. J'ai vérifié :

| Point | Résultat |
| --- | --- |
| `npm run lint` existe ? | **Oui** — `oxlint`, présent en devDependency |
| Le lint échoue-t-il ? | **Non** : 1 warning, code de sortie **0** |
| `npx oxlint --deny-warnings` | code de sortie **1** |
| Vite copie-t-il les dotfiles de `public/` ? | **Oui**, vérifié par test : un `.htaccess-probe` déposé dans `public/` se retrouve bien dans `dist/` |
| Routes de l'app | `/`, `/contact`, `/produits`, `/produits/:id`, `/services`, plus une page « introuvable » |
| Visibilité du dépôt | **public** |

Deux conséquences directes :

- le `npm run lint` du workflow **ne bloquera rien en l'état** (les warnings
  passent). Si l'intention est d'en faire une barrière qualité, il faut
  `oxlint --deny-warnings` — mais alors il faut d'abord traiter le warning
  existant sur `CartContext.jsx`, sinon le premier déploiement échoue ;
- **le `.htaccess` peut être versionné dans `public/.htaccess`** et livré par le
  build. C'est vérifié, pas supposé. C'est la seule façon propre de le rendre
  reproductible — voir le risque n° 1 ci-dessous.

### Réponses aux cinq questions

**1. GitHub Pages est-il inadapté ? — Oui, et je confirme le raisonnement.**

La documentation interdit d'utiliser Pages comme hébergement gratuit pour « un
site e-commerce ou tout autre site principalement destiné à faciliter des
transactions commerciales ». Le site a un catalogue, des prix, un panier
persistant et un tunnel de commande : il est bien *principalement destiné à
faciliter des transactions*, même si le paiement final se fait hors ligne.

Nuance à garder en tête : c'est un risque **contractuel**, pas technique, et
l'application est rare. Mais sur une livraison client, on n'expose pas la
cliente à une suspension arbitraire de sa vitrine. Le déplacement est le bon
choix.

**2. SFTP/SSH ou autre méthode ? — SSH + rsync si le forfait le permet ; sinon
FTPS. Et je pose une réserve que Codex n'a pas soulevée.**

Ordre de préférence :

1. **SSH + rsync** (idéal) : transfert différentiel, rapide, scriptable,
   permet la sauvegarde serveur avant écrasement. À confirmer : Bluehost
   n'active SSH que sur certains forfaits, et **le port est souvent 2222, pas
   22** — à relever, c'est une cause classique d'échec au premier essai.
2. **FTPS via `SamKirkland/FTP-Deploy-Action`** (repli solide) : chiffré,
   synchronisation différentielle via un fichier d'état déposé sur le serveur.
   Fonctionne sur tous les forfaits Bluehost.
3. **Git Version Control de cPanel** : à écarter. Il ne se déclenche pas tout
   seul sur un push — il faudrait un webhook vers l'API cPanel — et il faudrait
   soit committer `dist/`, soit installer Node sur l'hébergement mutualisé. Les
   deux sont de mauvaises idées. Codex a raison de le reléguer.

**Réserve importante sur le rayon d'impact.** Sur Bluehost mutualisé, l'accès
SSH est celui du **compte principal** : la clé privée déposée dans GitHub donne
accès à *tout* le compte (tous les domaines, les bases, les mails), pas
seulement au dossier du site. À l'inverse, un **compte FTP cPanel dédié peut
être cantonné à un seul répertoire**. Autrement dit : SSH est meilleur
techniquement, FTPS est meilleur en confinement. Si le compte Bluehost héberge
d'autres sites ou la messagerie de la cliente, **je recommande FTPS avec un
compte FTP dédié au répertoire du site** malgré ses défauts techniques.
À trancher une fois le contenu du compte connu.

**3. Secrets et protections d'environnement**

Secrets à créer (aucun en clair dans le dépôt, jamais affichés) :

| Secret | Rôle |
| --- | --- |
| `BLUEHOST_HOST` | hôte SSH/FTPS |
| `BLUEHOST_PORT` | **à relever** (SSH souvent 2222, FTPS 21) |
| `BLUEHOST_USER` | utilisateur dédié au déploiement |
| `BLUEHOST_SSH_KEY` *(voie SSH)* | clé privée **ed25519 dédiée**, créée pour ce seul usage |
| `BLUEHOST_KNOWN_HOSTS` *(voie SSH)* | empreinte du serveur |
| `BLUEHOST_PASSWORD` *(voie FTPS)* | mot de passe du compte FTP cantonné |
| `BLUEHOST_PATH` | répertoire de publication exact |

Protections :

- déclarer un environnement GitHub **`production`** et y rattacher les secrets,
  pour qu'aucun autre workflow n'y accède ;
- **ne jamais utiliser `pull_request_target`** dans ce dépôt : c'est le seul
  déclencheur qui exposerait les secrets à du code venu d'une pull request
  extérieure. Le dépôt étant **public**, ce n'est pas théorique ;
- garder `permissions:` au minimum (`contents: read`) — le workflow actuel
  demande `pages: write` et `id-token: write`, qui n'auront plus lieu d'être ;
- **ne pas désactiver `StrictHostKeyChecking`** : pré-remplir `known_hosts`
  depuis le secret. Sinon le déploiement accepte n'importe quel serveur qui
  répond à cette adresse ;
- clé **dédiée au déploiement**, pas la clé personnelle de l'utilisateur, pour
  pouvoir la révoquer seule.

**4. Risques oubliés** — voir la section dédiée ci-dessous, c'est le cœur de
mon avis.

**5. Protections de déploiement et retour arrière**

Trois niveaux, du plus simple au plus sûr :

1. **Sauvegarde serveur avant écrasement.** Première étape du déploiement :
   `cp -a <docroot> ~/backups/<horodatage>` côté serveur, en n'en gardant que
   3. Retour arrière immédiat sans rebuild, et indépendant de GitHub.
2. **Redéploiement d'un commit antérieur.** Ajouter `workflow_dispatch` avec
   une entrée `ref` : revenir en arrière = relancer le workflow sur un SHA plus
   ancien. Propre et traçable, mais suppose que le build soit reproductible.
3. **Garde-fou contre l'effacement.** `rsync --delete` pointé sur un mauvais
   chemin peut vider `public_html` — voire le dossier personnel. Vérifier
   avant suppression la présence d'un fichier sentinelle (par exemple
   `.deploy-target-ok`) déposé une fois à la main dans le répertoire cible, et
   **interrompre le déploiement s'il est absent**. C'est cinq lignes de script
   et ça élimine le pire scénario.

Ajouter aussi `concurrency: { group: production, cancel-in-progress: false }` —
Codex l'a prévu, je le confirme : sur un transfert de fichiers, annuler en
cours de route laisserait le site à moitié écrasé.

### Huit risques absents du plan

**1. Le `.htaccess` sera supprimé au premier déploiement avec `--delete`.**
*(bloquant)*

Si le `.htaccess` est posé à la main dans `public_html` et que le déploiement
synchronise `dist/` avec `--delete`, il disparaît au premier push : plus de
fallback SPA, plus de redirection HTTPS, toutes les routes profondes en 404.
Panne totale des pages autres que l'accueil.

Correctif : **versionner `public/.htaccess`** — j'ai vérifié que Vite le copie
bien dans `dist/`. Il devient reproductible et survit à chaque déploiement.

**2. Ordre des règles `.htaccess` : la redirection canonique doit précéder le
fallback SPA.** *(bloquant si inversé)*

Si la réécriture vers `index.html` passe en premier, la redirection
`www` → apex et HTTP → HTTPS ne s'applique jamais. Structure correcte :

```apache
RewriteEngine On
RewriteBase /

# 1. Canonique : HTTPS + sans www, AVANT tout le reste
RewriteCond %{HTTPS} !=on [OR]
RewriteCond %{HTTP_HOST} ^www\.(.*)$ [NC]
RewriteRule ^ https://lizzirenedeco.com%{REQUEST_URI} [L,R=301]

# 2. Fichiers et dossiers réels : servis tels quels
RewriteCond %{REQUEST_FILENAME} -f [OR]
RewriteCond %{REQUEST_FILENAME} -d
RewriteRule ^ - [L]

# 3. Tout le reste : l'application React
RewriteRule ^ index.html [L]
```

À vérifier au moment de l'implémentation : si Bluehost ajoute lui-même une
redirection HTTPS via cPanel (« Force HTTPS Redirect »), **ne pas la cumuler**
avec la règle ci-dessus — deux redirections concurrentes peuvent produire une
boucle.

**3. Cache de `index.html` : le déploiement automatique paraîtra ne pas marcher.**
*(important, et très courant)*

Les assets Vite sont hachés (`index-CCF6qaLu.js`) et peuvent être mis en cache
un an. **`index.html` ne doit surtout pas l'être** : c'est lui qui pointe vers
les nouveaux fichiers. Sans en-tête explicite, Apache et le navigateur peuvent
le garder des heures — la cliente pousserait une mise à jour et ne verrait
aucun changement.

```apache
<IfModule mod_headers.c>
  <FilesMatch "\.(html)$">
    Header set Cache-Control "no-cache, must-revalidate"
  </FilesMatch>
  <FilesMatch "\.(js|css|woff2|webp|jpg|jpeg|png|svg)$">
    Header set Cache-Control "public, max-age=31536000, immutable"
  </FilesMatch>
</IfModule>
```

**4. Compression : absente du plan, et elle compte plus que tout le reste ici.**

Le public est à Conakry, majoritairement sur mobile et sur des forfaits data
limités. Mesuré sur le build actuel : **259 ko de JS et 43 ko de CSS**, qui
tombent à **77 ko et 9 ko une fois compressés** — un facteur 3,5, soit environ
**215 ko économisés à chaque première visite**. Activer `mod_deflate`
sur `text/html`, `text/css`, `application/javascript`, `image/svg+xml` et
`application/json` est le geste le plus rentable de toute cette migration.

**5. L'ancienne adresse GitHub Pages restera en ligne avec un site périmé.**

Codex prévoit de remplacer le workflow, mais **Pages doit aussi être désactivé
dans les réglages du dépôt** — sinon `gaslandie.github.io/lizzirene` continue de
servir l'ancienne version : contenu dupliqué pour le référencement, et surtout
confusion pour la cliente.

Point concret : **cette adresse a déjà été partagée avec la cliente.** Je
recommande, plutôt que de l'éteindre sèchement, de laisser un dernier
déploiement Pages minimal contenant une page de redirection
(`<meta http-equiv="refresh">` + `<link rel="canonical">` vers le nouveau
domaine). Les liens déjà transmis continuent de mener au bon endroit.

**6. Le `base` Vite ne peut pas servir les deux hébergements à la fois.**

`base` est figé au build. Si Pages est conservé ne serait-ce qu'en transition,
il faut le paramétrer : `base: process.env.VITE_BASE ?? '/'`, avec
`VITE_BASE=/lizzirene/` fourni uniquement au workflow Pages. Sinon, l'un des
deux sites aura tous ses chemins cassés. Choisir explicitement : soit Pages est
éteint, soit `base` devient paramétrable — pas d'entre-deux.

**7. Le DNS n'a probablement rien à changer, et c'est une bonne nouvelle.**

Le domaine a été acheté **dans le compte Bluehost** et l'hébergement sera
Bluehost. Dans ce cas, une fois le domaine assigné à l'hébergement, `@` et `www`
pointent déjà vers le serveur : **aucune modification manuelle n'est nécessaire
dans la plupart des cas**. La section DNS de Codex est juste dans ses principes,
mais elle décrit un scénario inter-hébergeurs qui ne sera peut-être pas le
nôtre.

Recommandation : **constater avant d'agir.** Toute édition manuelle de la zone
est une prise de risque inutile si Bluehost a déjà tout câblé. En revanche, les
consignes de Codex sur les `MX`, SPF, DKIM et DMARC restent à respecter à la
lettre : si la messagerie `@lizzirenedeco.com` est ou sera utilisée, une
suppression accidentelle coupe les mails, et ça se répare mal.

**8. `dist/404.html` n'a plus de sens sur Apache — et les vraies 404 renverront
un code 200.**

Le script de build fait `cp dist/index.html dist/404.html` : c'était le
mécanisme de repli de GitHub Pages. Sur Apache, c'est le `.htaccess` qui joue ce
rôle ; le fichier devient inutile (inoffensif, mais à nettoyer).

Effet de bord à connaître : avec le fallback SPA, une URL inexistante renvoie
`index.html` avec un **code HTTP 200**, alors que la page « introuvable »
s'affiche. C'est une « soft 404 », que Google signale parfois. Impact faible sur
un site de cette taille, aucune correction possible côté client — à documenter,
pas à corriger.

### Deux points hors technique, mais bloquants pour une mise en ligne

**Les témoignages sont toujours fictifs.** Les trois avis de
`src/components/Testimonials.jsx` ont été écrits par moi comme remplissage de
maquette. Publier de faux avis clients sur `lizzirenedeco.com` — un vrai domaine
commercial, au nom de la cliente — est autrement plus engageant que sur une
adresse de test. **À remplacer par de vrais avis ou à retirer avant la bascule
DNS.** C'est le seul point de cette liste qui expose la cliente elle-même.

**Le libellé « Caches postes » reste à confirmer** auprès de la cliente. Il
apparaîtra dans les URL du catalogue (`?categorie=caches-postes`), qui seront
indexées : le corriger après indexation coûte des redirections.

### Ce que je recommande de faire avant d'écrire la moindre ligne

1. Relever dans le compte Bluehost : forfait, **disponibilité SSH et port
   exact**, chemin exact du répertoire web du domaine, autres sites hébergés sur
   le compte, et présence ou non de messagerie sur le domaine.
2. Selon le point 1, trancher **SSH+rsync** ou **FTPS avec compte cantonné**
   (voir la réserve en réponse 2).
3. Constater l'état DNS réel du domaine **avant** d'envisager la moindre
   modification.
4. Décider du sort de GitHub Pages : extinction franche, ou page de
   redirection pour les liens déjà partagés.
5. Trancher si le lint doit bloquer (`--deny-warnings` + correction du warning
   existant) ou rester informatif.

Une fois ces cinq points connus, l'implémentation est courte et sans zone
d'ombre. Tant qu'ils ne le sont pas, écrire le workflow reviendrait à deviner
l'hôte, le port, le chemin et la méthode de transfert.

## Décision retenue

Hébergement public retenu : **Bluehost**.

GitHub reste le dépôt source et le déclencheur du déploiement automatique. La méthode cible est un workflow GitHub Actions qui exécute `npm ci`, `npm run lint`, `npm run build`, puis publie le contenu de `dist/` vers le répertoire web Bluehost de `lizzirenedeco.com`, probablement par SFTP/SSH selon les accès disponibles.

À confirmer par Claude Code avant implémentation : la meilleure méthode de transfert Bluehost sur ce forfait, les secrets GitHub nécessaires, la règle `.htaccess` exacte pour les routes React, et la stratégie de retour arrière.

## Implémentation et vérifications

Non commencées. Aucune modification DNS, GitHub ou Bluehost n'a été effectuée pendant cette phase de discussion.
