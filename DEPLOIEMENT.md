# Déployer Lizzirene Déco sur Bluehost depuis GitHub

## Architecture retenue

- **Bluehost** sert `lizzirenedeco.com`, gère le DNS et le certificat HTTPS.
- **GitHub** reste la source du code et de l'historique.
- **GitHub Actions** vérifie et construit le site, puis synchronise `dist/`
  par **FTPS explicite** à chaque push sur `main`.
- Le compte FTP de déploiement est dédié à ce site et son répertoire d'accueil
  est directement le Document Root de `lizzirenedeco.com`.

GitHub Pages ne sert plus la production : le catalogue, le panier et la
commande WhatsApp font du site une vitrine commerciale.

## 1. Préparer une fois Bluehost

1. Dans **Hosting → Lizzirene Déco → Domains**, vérifier que
   `lizzirenedeco.com` est bien le domaine principal de ce site.
2. Dans **Files & Access → File Manager**, ouvrir le Document Root exact. Avant
   la première synchronisation, sauvegarder tout fichier métier éventuellement
   présent. Le compte FTP dédié doit ouvrir directement ce dossier, jamais la
   racine d'un compte qui contient d'autres sites.
3. Conserver les dossiers techniques `.well-known/` et `cgi-bin/`. Le workflow
   les exclut explicitement de ses suppressions, ainsi que `.ftpquota`.
4. Dans ce Document Root, créer un fichier caché nommé exactement
   `.deploy-target-ok`, puis y écrire une seule ligne :

   ```text
   lizzirenedeco.com
   ```

   Le workflow télécharge et vérifie ce marqueur **avant** toute synchronisation
   avec suppression. S'il manque ou ne correspond pas, la publication s'arrête.
5. Garder le compte FTP dédié actif et cantonné à ce Document Root. Il ne faut
   pas activer SSH ni partager un accès global au compte Bluehost.

Le navigateur peut traduire automatiquement des noms techniques dans le
portail Bluehost. Pour les identifiants, chemins et noms de dossiers, désactiver
la traduction de la page et recopier la valeur originale.

## 2. Configurer l'environnement GitHub

Dans `Gaslandie/lizzirene`, ouvrir **Settings → Environments**, créer
`production`, puis limiter ses branches de déploiement à `main`.

Dans **Environment variables**, ajouter :

| Variable | Valeur |
| --- | --- |
| `BLUEHOST_FTP_IP` | adresse IPv4 affichée par Bluehost pour ce compte FTP |
| `BLUEHOST_FTP_USER` | nom d'utilisateur complet du compte FTP dédié |

Dans **Environment secrets**, ajouter :

| Secret | Valeur |
| --- | --- |
| `BLUEHOST_FTP_PASSWORD` | mot de passe du compte FTP dédié |

Le mot de passe doit être collé directement dans GitHub : ne pas l'envoyer dans
une conversation, le mettre dans un fichier ou le versionner. Le workflow le
fournit à `lftp` par variable d'environnement ; il n'apparaît pas dans la ligne
de commande.

Le transfert utilise le port `21` avec TLS obligatoire sur le contrôle et les
données. Le certificat est vérifié sous le nom `ftp.bluehost.com`, que le runner
GitHub dirige vers l'IP précise du serveur. La vérification du certificat et du
nom d'hôte reste activée.

## 3. Premier déploiement et domaine

1. Dans Bluehost, vérifier le certificat SSL gratuit pour
   **`lizzirenedeco.com` et `www.lizzirenedeco.com`**. Les deux noms doivent être
   couverts avant d'imposer HTTPS ; relancer AutoSSL si nécessaire.
2. Pousser les changements sur `main`. Le workflow
   **Actions → Déploiement Bluehost** démarre automatiquement.
3. Vérifier que les jobs `build` puis `deploy` réussissent.
4. Tester l'accueil, `/produits`, une fiche produit et `/contact` après un
   rafraîchissement direct.
5. Vérifier les quatre entrées suivantes :
   - `http://lizzirenedeco.com` ;
   - `https://lizzirenedeco.com` ;
   - `http://www.lizzirenedeco.com` ;
   - `https://www.lizzirenedeco.com`.

Les trois variantes non canoniques doivent rediriger vers
`https://lizzirenedeco.com`. Le fichier `public/.htaccess` gère HTTPS, la
redirection sans `www` et les routes React.

Le workflow contrôle après transfert `index.html`, `.htaccess` et le marqueur,
puis teste l'accueil public, une route profonde et les trois redirections. Une
erreur DNS, SSL ou Apache laisse donc le déploiement rouge même si les fichiers
ont déjà été envoyés.

Comme le domaine et l'hébergement sont chez Bluehost, leur connexion peut
ajuster automatiquement les enregistrements web. Ne modifier manuellement que
`@` et `www` si Bluehost l'exige ; ne jamais supprimer les enregistrements
MX/TXT d'une future messagerie.

## 4. Déploiements suivants et retour arrière

Après la première mise en ligne, le flux normal est automatique :

```text
push sur main → lint → build → synchronisation FTPS → lizzirenedeco.com
```

Un lint ou un build en échec arrête le processus avant Bluehost. Les
déploiements sont séquentiels et le fichier HTML n'est pas mis en cache, afin
que la nouvelle version apparaisse immédiatement.

Pour revenir à une version déjà fusionnée dans `main`, relancer manuellement le
workflow et saisir son SHA dans le champ `ref`. Le workflow refuse une version
qui ne fait pas partie de l'historique de `main`.

Ce retour arrière reconstruit le code Git ; il ne restaure pas une ancienne
configuration DNS/SSL et ne remplace pas une sauvegarde serveur initiale.

Une fois la production confirmée, désactiver l'ancien site GitHub Pages dans
**Settings → Pages** pour éviter de conserver une copie périmée à l'ancienne
adresse `gaslandie.github.io/lizzirene/`.
