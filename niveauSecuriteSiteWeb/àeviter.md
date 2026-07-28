Parfait, tu veux une **checklist inverse** : les 15 choses à **ne pas faire** pour que ton site soit sécurisé. C'est parti.

---

**1. Ne pas exiger le HTTPS partout**
Laisser ton site accessible en HTTP, même juste pour certaines pages ou assets. Le HTTPS doit être obligatoire et forcé. Un simple certificat SSL installé ne suffit pas si tu n'as pas de redirection permanente 301 de HTTP vers HTTPS et l'en-tête `Strict-Transport-Security`.

**2. Ne jamais valider ni échapper les entrées utilisateur**
Faire confiance à `$_GET`, `$_POST`, aux headers, aux cookies, aux fichiers uploadés. Tout ce qui vient de l'extérieur doit être traité comme hostile. Valider le type, la longueur, le format côté serveur (jamais côté client uniquement), et échapper les sorties selon le contexte (HTML, JavaScript, SQL).

**3. Écrire des requêtes SQL en concaténant des variables**
La faille la plus bête et la plus dévastatrice. `"SELECT * FROM users WHERE id = " . $_GET['id']`, c'est une injection SQL garantie. Toujours utiliser des requêtes préparées avec des paramètres liés, sans exception.

**4. Stocker les mots de passe autrement qu'avec un hash robuste**
Pas de MD5, pas de SHA1, pas de chiffrement réversible, et surtout jamais en clair. Utilise `bcrypt`, `Argon2id` ou `scrypt` avec un coût élevé. Si tu peux lire le mot de passe d'un utilisateur, ton système est cassé.

**5. Laisser des fichiers sensibles accessibles publiquement**
Fichiers de configuration contenant des identifiants de base de données, sauvegardes SQL, fichiers `.env`, `.git` exposé. Toujours placer ces fichiers hors de la racine publique du serveur, ou les bloquer explicitement dans la configuration du serveur web.

**6. Utiliser des mots de passe ou clés par défaut**
Identifiants admin/admin, clés API de test, tokens intégrés dans le code source. Changer systématiquement tous les secrets par défaut avant la mise en production. Un secret dans le code source est un secret compromis.

**7. Afficher les erreurs détaillées en production**
Les messages d'erreur PHP, les traces de pile, les détails de connexion à la base de données. Un attaquant adore ça : ça lui donne la structure de ton code et tes chemins. En production : `display_errors = Off`, loguer les erreurs dans un fichier privé, montrer une page d'erreur générique à l'utilisateur.

**8. Omettre la protection CSRF sur les actions modifiantes**
Tout formulaire qui crée, modifie ou supprime des données doit inclure un jeton CSRF unique, imprévisible, lié à la session. Sans cela, un site malveillant peut faire exécuter une action à un utilisateur authentifié à son insu.

**9. Permettre l'upload de fichiers sans restrictions strictes**
Accepter n'importe quel type de fichier, ne pas vérifier le type MIME réel, stocker les fichiers dans un répertoire accessible publiquement avec des noms prévisibles. C'est la porte ouverte à l'exécution de code malveillant sur ton serveur.

**10. Ne pas configurer de Content Security Policy (CSP)**
L'en-tête CSP est ta meilleure défense contre les attaques XSS. Sans lui, si du JavaScript malveillant s'injecte, il s'exécute librement. Une politique stricte empêche le chargement de scripts, styles ou ressources depuis des sources non autorisées.

**11. Gérer manuellement les sessions de façon hasardeuse**
Régénérer l'ID de session uniquement après connexion, ne pas régénérer lors des changements de privilèges, utiliser des identifiants de session faibles. Toujours utiliser les mécanismes natifs de ton langage, forcer le flag `HttpOnly`, `Secure`, et `SameSite` sur les cookies de session.

**12. Limiter la protection contre la force brute à un simple délai**
Pas de limitation du nombre de tentatives de connexion, pas de CAPTCHA après plusieurs échecs, pas de verrouillage temporaire. Un attaquant peut tester des milliers de mots de passe sans obstacle. Implémente un throttling par IP et par compte.

**13. Négliger les headers de sécurité HTTP de base**
`X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy`, `Permissions-Policy`. Ces en-têtes sont simples à configurer et bloquent des attaques comme le clickjacking ou le MIME sniffing. Les oublier, c'est offrir des vulnérabilités gratuites.

**14. Ne jamais mettre à jour tes dépendances**
Bibliothèques JavaScript, packages PHP, modules Python, composants front-end. Chaque jour, des failles sont découvertes dans des dépendances populaires. Sans surveillance et mise à jour régulière, ton site devient vulnérable à des attaques documentées et automatisées.

**15. Coder sans jamais auditer ni tester la sécurité**
Faire confiance à son code en se disant "ça devrait aller". Jamais de tests d'intrusion même basiques, jamais d'analyse de vulnérabilités, jamais de revue de code orientée sécurité. Les failles ne se voient pas à l'œil nu. Un regard extérieur, des outils comme OWASP ZAP ou un audit manuel sont indispensables avant toute mise en production.

---

Pour t'en souvenir facilement : **tout ce qui vient de l'extérieur est hostile, tout ce qui est sensible est protégé, tout ce qui est en production est vérifié**. La sécurité n'est pas une fonctionnalité qu'on ajoute à la fin, c'est une discipline qu'on applique à chaque ligne de code.