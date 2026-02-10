# 🎨 Configuration GitHub Pages - Guide Pas-à-Pas

Ce guide vous accompagne dans le déploiement du frontend Hospifinance sur GitHub Pages.

---

## ⏱️ Temps estimé : 5-10 minutes

## 📋 Prérequis

✅ Backend déployé sur Render.com (voir [SETUP_RENDER.md](./SETUP_RENDER.md))
✅ URL du backend Render disponible (ex: `https://hospifinance-api.onrender.com`)
✅ Compte GitHub avec le dépôt `Ayhzer/hospifinance`

---

## 🔐 Étape 1 : Ajouter le secret GitHub (3 min)

Le secret `VITE_API_URL` permet à GitHub Actions de builder le frontend avec la bonne URL du backend.

### Instructions détaillées :

1. **Ouvrez votre dépôt GitHub** :
   ```
   https://github.com/Ayhzer/hospifinance
   ```

2. **Cliquez sur "Settings"** (onglet en haut)

3. **Menu de gauche** → Descendez jusqu'à **"Secrets and variables"**

4. **Cliquez sur "Actions"**

5. **Cliquez sur "New repository secret"** (bouton vert en haut à droite)

6. **Remplissez le formulaire** :

   **Name** (exactement) :
   ```
   VITE_API_URL
   ```

   **Secret** (remplacez par votre URL Render réelle) :
   ```
   https://hospifinance-api.onrender.com/api
   ```

   ⚠️ **ATTENTION** :
   - Remplacez `hospifinance-api` par le nom de votre service Render
   - Ne mettez PAS de `/` à la fin
   - Ajoutez bien `/api` à la fin

   **Exemples corrects** :
   ```
   https://hospifinance-api.onrender.com/api ✅
   https://hospifinance-backend.onrender.com/api ✅
   https://mon-service.onrender.com/api ✅
   ```

   **Exemples incorrects** :
   ```
   https://hospifinance-api.onrender.com/api/ ❌ (slash à la fin)
   https://hospifinance-api.onrender.com ❌ (manque /api)
   http://hospifinance-api.onrender.com/api ❌ (http au lieu de https)
   ```

7. **Cliquez sur "Add secret"**

8. **Vérifiez** : Vous devriez voir `VITE_API_URL` dans la liste des secrets

---

## 🚀 Étape 2 : Déployer sur GitHub Pages (2 min)

Vous avez **deux options** pour déployer :

### Option A : Déploiement automatique via GitHub Actions (Recommandé)

Le déploiement se fait automatiquement à chaque push sur `main`.

1. **Fusionnez votre branche** dans `main` :

   **Si vous êtes sur une branche** (ex: `claude/setup-render-backend-cSAJK`) :
   ```bash
   git checkout main
   git pull origin main
   git merge claude/setup-render-backend-cSAJK
   git push origin main
   ```

   **Ou créez une Pull Request** sur GitHub :
   - Allez sur https://github.com/Ayhzer/hospifinance
   - Cliquez sur **"Compare & pull request"**
   - Mergez la PR

2. **Vérifiez le déploiement** :
   - Allez sur https://github.com/Ayhzer/hospifinance/actions
   - Vous verrez un workflow **"Deploy to GitHub Pages"** en cours
   - Cliquez dessus pour voir les logs en temps réel

3. **Attendez** (environ 2-3 minutes) :
   - ✅ Build : Compile le frontend avec Vite
   - ✅ Deploy : Pousse vers la branche `gh-pages`

4. **Vérifiez que le workflow est vert** (✓) → Déploiement réussi !

### Option B : Déploiement manuel (Alternative)

Si vous préférez déployer manuellement depuis votre machine :

1. **Créez un fichier `.env.production`** dans le répertoire racine :
   ```bash
   cp .env.production.example .env.production
   ```

2. **Éditez `.env.production`** et remplacez l'URL :
   ```env
   VITE_API_URL=https://hospifinance-api.onrender.com/api
   ```
   (Remplacez par votre URL Render réelle)

3. **Installez les dépendances** (si ce n'est pas déjà fait) :
   ```bash
   npm install
   ```

4. **Déployez** :
   ```bash
   npm run deploy
   ```

5. **Attendez** le message :
   ```
   Published
   ```

⏳ Le déploiement prend environ 1-2 minutes.

---

## 🔧 Étape 3 : Activer GitHub Pages (2 min)

Activez GitHub Pages pour votre dépôt :

1. **Retournez sur** : https://github.com/Ayhzer/hospifinance

2. **Cliquez sur "Settings"** (onglet en haut)

3. **Menu de gauche** → Cliquez sur **"Pages"**

4. **Section "Build and deployment"** :

   - **Source** : Sélectionnez **"Deploy from a branch"**
   - **Branch** : Sélectionnez **"gh-pages"** et **"/ (root)"**
   - **Cliquez sur "Save"**

5. **Attendez** environ 30 secondes à 1 minute

6. **Rafraîchissez la page** (F5)

7. **Vous verrez un bandeau vert** en haut :
   ```
   Your site is live at https://ayhzer.github.io/hospifinance/
   ```

   🎉 **Félicitations ! Votre site est en ligne !**

---

## ✅ Étape 4 : Tester l'application (3 min)

### 1. Ouvrez votre application

```
https://ayhzer.github.io/hospifinance/
```

### 2. Vérifiez que la page charge

Vous devriez voir :
- ✅ Le logo Hospifinance
- ✅ Le formulaire de connexion
- ✅ Pas d'erreur dans la console du navigateur

### 3. Ouvrez la console du navigateur

Appuyez sur **F12** puis onglet **"Console"** :

- ✅ Aucune erreur rouge de type "CORS" ou "404"
- ✅ Aucune erreur "Failed to fetch"

Si vous voyez des erreurs, consultez la section **Dépannage** ci-dessous.

### 4. Testez la connexion

Connectez-vous avec les identifiants par défaut :

- **Username** : `admin`
- **Password** : `admin123`

**Si la connexion fonctionne** :
- ✅ Vous êtes redirigé vers le dashboard
- ✅ Les menus s'affichent (Dashboard, OPEX, CAPEX, etc.)

**🎉 Tout fonctionne ! Votre application est déployée avec succès !**

### 5. Testez les fonctionnalités

- Créez un fournisseur OPEX
- Créez un projet CAPEX
- Modifiez votre mot de passe dans les paramètres
- Exportez/Importez des données

---

## 🔄 Mises à jour futures

### Automatique (via GitHub Actions)

Chaque fois que vous pushez sur `main`, le site se met à jour automatiquement :

```bash
# Faites vos modifications dans src/
git add .
git commit -m "Update frontend"
git push origin main
```

GitHub Actions déploiera automatiquement en 2-3 minutes.

### Manuel

Si vous avez déployé manuellement, répétez :

```bash
npm run build
npm run deploy
```

---

## 🆘 Dépannage

### Problème : "404 - Page not found" sur GitHub Pages

**Causes possibles** :
- GitHub Pages pas encore activé
- Branche `gh-pages` pas encore créée
- URL incorrecte

**Solutions** :
1. Vérifiez Settings → Pages → Branch = `gh-pages`
2. Vérifiez que la branche `gh-pages` existe (onglet Branches)
3. Attendez 1-2 minutes (propagation DNS)
4. Vérifiez l'URL : `https://ayhzer.github.io/hospifinance` (pas de `/` à la fin pour la première visite)

### Problème : Page charge mais "Failed to fetch" / Erreur de connexion

**Causes possibles** :
- Backend Render en veille
- URL de l'API incorrecte
- Secret `VITE_API_URL` incorrect

**Solutions** :
1. Ouvrez l'URL du backend dans un navigateur pour le réveiller :
   ```
   https://hospifinance-api.onrender.com/health
   ```
2. Attendez 30-60 secondes puis retestez le frontend
3. Vérifiez le secret GitHub :
   - Settings → Secrets → Actions → `VITE_API_URL`
   - Doit être : `https://votre-service.onrender.com/api`
4. Si modifié, redéclenchez le workflow :
   - Actions → Deploy to GitHub Pages → Re-run jobs

### Problème : Erreur CORS dans la console

**Symptôme** :
```
Access to fetch at 'https://...' from origin 'https://ayhzer.github.io' has been blocked by CORS policy
```

**Solutions** :
1. Vérifiez Render.com → Votre service → Environment
2. Variable `CORS_ORIGIN` doit être : `https://ayhzer.github.io` (sans `/` à la fin)
3. Si modifié, Render redémarrera automatiquement
4. Attendez 1-2 minutes puis testez

### Problème : Site charge mais pas de données / Dashboard vide

**Causes possibles** :
- Backend non démarré
- Authentification échouée
- MongoDB non configuré

**Solutions** :
1. Testez le backend directement :
   ```
   curl https://votre-api.onrender.com/health
   ```
2. Testez le login :
   ```bash
   curl -X POST https://votre-api.onrender.com/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{"username":"admin","password":"admin123"}'
   ```
3. Vérifiez les logs Render pour les erreurs
4. Vérifiez MongoDB Atlas → Cluster est actif

### Problème : CSS/Images ne se chargent pas

**Causes possibles** :
- `base` dans `vite.config.js` incorrect

**Solutions** :
1. Vérifiez `vite.config.js` :
   ```javascript
   base: process.env.NODE_ENV === 'production' ? '/hospifinance/' : '/'
   ```
2. Redéployez :
   ```bash
   npm run deploy
   ```

### Problème : GitHub Actions workflow échoue

**Causes possibles** :
- Secret `VITE_API_URL` manquant
- Erreur de build

**Solutions** :
1. Actions → Cliquez sur le workflow rouge → Lisez les logs
2. Vérifiez que le secret `VITE_API_URL` existe
3. Vérifiez que `gh-pages` est installé :
   ```bash
   npm install --save-dev gh-pages
   ```
4. Poussez une correction et le workflow relancera automatiquement

---

## 📊 Surveiller le site

### GitHub Pages Analytics

GitHub Pages ne fournit pas d'analytics par défaut.

**Options gratuites** :
1. **Google Analytics** : https://analytics.google.com
2. **Plausible** : https://plausible.io (open-source)
3. **Umami** : https://umami.is (self-hosted)

### Limites GitHub Pages

- **1 GB** d'espace de stockage (site compilé)
- **100 GB/mois** de bande passante
- **10 builds/heure** (largement suffisant)
- Site **public** uniquement (dépôt public)

### Vérifier les déploiements

1. **GitHub Actions** : https://github.com/Ayhzer/hospifinance/actions
   - Historique de tous les déploiements
   - Logs détaillés

2. **Branche gh-pages** : https://github.com/Ayhzer/hospifinance/tree/gh-pages
   - Contenu du site déployé
   - Fichiers HTML/CSS/JS compilés

---

## 🔐 Sécurité

### Checklist

- ✅ Site accessible uniquement en HTTPS (forcé par GitHub Pages)
- ✅ Secret `VITE_API_URL` stocké dans GitHub Secrets (non visible publiquement)
- ✅ Pas de secrets ou tokens dans le code frontend
- ✅ CORS configuré sur le backend pour autoriser uniquement `https://ayhzer.github.io`

### Notes importantes

- ⚠️ Le code frontend est **public** (accessible via les DevTools du navigateur)
- ⚠️ Ne mettez JAMAIS de clés API, mots de passe ou secrets dans le frontend
- ✅ L'authentification se fait via JWT côté backend
- ✅ Les données sensibles restent côté backend

---

## 🎯 Récapitulatif

Vous avez maintenant :

✅ **Backend** déployé sur Render.com : `https://hospifinance-api.onrender.com`
✅ **Frontend** déployé sur GitHub Pages : `https://ayhzer.github.io/hospifinance`
✅ **Base de données** sur MongoDB Atlas (512 MB gratuits)
✅ **Déploiement automatique** via GitHub Actions
✅ **Application complète** accessible en production !

---

## 🔄 Prochaines étapes

1. ✅ **Changez le mot de passe admin** dans les paramètres
2. ✅ **Configurez UptimeRobot** pour éviter la mise en veille du backend
3. ✅ **Faites une sauvegarde** des données MongoDB (export manuel)
4. ✅ **Testez toutes les fonctionnalités** (OPEX, CAPEX, utilisateurs, export/import)
5. ✅ **Partagez l'URL** avec vos utilisateurs : https://ayhzer.github.io/hospifinance

---

## 📞 Support

- **GitHub Pages** : https://docs.github.com/pages
- **GitHub Actions** : https://github.com/Ayhzer/hospifinance/actions
- **Documentation complète** : [DEPLOY_GUIDE.md](./DEPLOY_GUIDE.md)

---

**Temps total : 5-10 minutes**
**Coût : GRATUIT**
**URL du site : https://ayhzer.github.io/hospifinance**

🎉 **Félicitations ! Votre application est maintenant en production !**
