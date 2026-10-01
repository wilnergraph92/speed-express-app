# Speed Express Shipping — application mobile

Application client pour iPhone et Android. Même base de données que le site
et le tableau de bord : un colis enregistré par l'équipe apparaît ici sans
aucune synchronisation à écrire.

## Ce qu'elle fait

- **Suivi des colis** — liste, recherche, détail, frise du parcours en
  quatre étapes, avec la date et le lieu de chaque passage.
- **Factures** — ce qui reste à payer en haut, puis le détail de chaque
  facture : total colis, frais de service, payé, balance.
- **Profil** — identifiant client, coordonnées, langue, notifications,
  contact WhatsApp et téléphone.
- **Mise à jour en direct** — l'écran se rafraîchit tout seul quand l'équipe
  change un statut dans le tableau de bord.
- **Quatre langues** — français, anglais, espagnol, créole haïtien. Au
  premier lancement, l'application prend la langue du téléphone.

## Essayer sur votre téléphone, aujourd'hui, sans rien payer

1. Installez **Expo Go** depuis l'App Store ou le Play Store.
2. Sur ce Mac :

```bash
cd ~/Desktop/App_SES && npx expo start
```

3. Scannez le QR code affiché dans le terminal avec l'appareil photo
   (iPhone) ou depuis Expo Go (Android).

Tout fonctionne de cette façon **sauf les notifications push** : depuis la
version 53 d'Expo, Expo Go ne les reçoit plus. Il faut pour cela une version
de développement (voir plus bas).

## Avant que les notifications fonctionnent

Deux choses, dans cet ordre.

**1. Passer la migration de base.** Ouvrez Supabase > SQL Editor, vérifiez
que le projet ouvert est bien `speed-express-site`, puis collez tout le
contenu de `base/supabase-maj-notifications.sql`. Elle crée la table des
appareils et le déclencheur qui envoie le message à chaque changement de
statut, dans la langue du client.

**2. Fabriquer une version de développement.** Gratuite sur Android :

```bash
npm install -g eas-cli
eas login            # compte Expo gratuit
eas build --profile development --platform android
```

Sur iPhone, la même chose demande un compte Apple Developer (99 $ par an).

## Publier sur les boutiques

Rien n'est bloqué côté code — il manque les comptes :

| | Coût | Ce qu'il permet |
|---|---|---|
| Apple Developer | 99 $ par an | App Store, et les versions de test sur iPhone |
| Google Play | 25 $ une seule fois | Play Store |

Une fois les comptes ouverts :

```bash
eas build --platform all --profile production
eas submit --platform all
```

Les identifiants sont déjà posés dans `app.json` :
`com.speedexpressshipping.app` pour les deux boutiques.

## Comment c'est construit

```
src/
  app/              les écrans (un fichier = une adresse)
  api/              base de données, session, notifications
  design/           couleurs, polices, composants partagés
  i18n/             les quatre langues
base/               la migration Supabase à passer
```

Conventions reprises du site : tout est commenté en français, les noms de
variables aussi. Le thème sombre est la référence ; le thème clair suit le
réglage du téléphone.

**La clé Supabase dans `src/api/supabase.ts` est la clé publique**, la même
que celle du site. Elle n'ouvre rien que les règles de sécurité de la base
n'autorisent déjà : un client ne peut lire que ses propres colis, et c'est
le serveur qui le vérifie, pas l'application. La clé secrète n'a rien à
faire ici.
