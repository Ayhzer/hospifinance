# Guide de Déploiement - Hospifinance

## 🚀 Installation et Lancement en Local

### Prérequis
- **Node.js** >= 16.x (recommandé: 18.x ou 20.x)
- **npm** >= 8.x ou **yarn** >= 1.22.x

### Étape 1: Installation des dépendances

```bash
cd Hospifinance
npm install
```

### Étape 2: Lancement en mode développement

```bash
npm run dev
```

L'application sera accessible sur **http://localhost:5173**

Le serveur de développement Vite offre:
- ⚡ Hot Module Replacement (HMR) ultra-rapide
- 🔄 Rechargement instantané des modifications
- 🐛 Messages d'erreur détaillés dans le navigateur

### Étape 3: Test de l'application

1. Naviguez vers http://localhost:5173
2. Vérifiez les 3 onglets: Vue d'ensemble, OPEX, CAPEX
3. Testez l'ajout d'un fournisseur OPEX
4. Testez l'ajout d'un projet CAPEX
5. Vérifiez que les données persistent au rafraîchissement (LocalStorage)
6. Testez les exports CSV/JSON

## 📦 Build pour la Production

### Créer un build optimisé

```bash
npm run build
```

Cette commande génère:
- Un dossier `dist/` avec les fichiers optimisés
- Code minifié et compressé
- Assets optimisés (images, fonts, etc.)
- Source maps pour le debugging

### Prévisualiser le build de production

```bash
npm run preview
```

Accessible sur **http://localhost:4173**

## 🌐 Déploiement en Ligne

### Option 1: Netlify (Recommandé - Simple et Gratuit)

1. **Compte et Configuration**
   ```bash
   # Installer Netlify CLI (optionnel)
   npm install -g netlify-cli
   ```

2. **Méthode A: Drag & Drop**
   - Aller sur https://app.netlify.com/drop
   - Glisser-déposer le dossier `dist/` après build
   - Site en ligne instantanément

3. **Méthode B: Git Integration**
   - Connecter votre dépôt GitHub à Netlify
   - Build settings:
     - Build command: `npm run build`
     - Publish directory: `dist`
   - Déploiement automatique à chaque push

4. **Configuration Netlify (netlify.toml)**
   ```toml
   [build]
     command = "npm run build"
     publish = "dist"

   [[redirects]]
     from = "/*"
     to = "/index.html"
     status = 200
   ```

### Option 2: Vercel

1. **Installation**
   ```bash
   npm install -g vercel
   ```

2. **Déploiement**
   ```bash
   cd Hospifinance
   vercel
   ```

3. **Configuration**
   - Framework Preset: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`

### Option 3: GitHub Pages

1. **Installer gh-pages**
   ```bash
   npm install --save-dev gh-pages
   ```

2. **Modifier vite.config.js**
   ```javascript
   export default defineConfig({
     plugins: [react()],
     base: '/hospifinance/', // Nom de votre repo
   });
   ```

3. **Ajouter scripts dans package.json**
   ```json
   "scripts": {
     "predeploy": "npm run build",
     "deploy": "gh-pages -d dist"
   }
   ```

4. **Déployer**
   ```bash
   npm run deploy
   ```

### Option 4: Serveur Personnel (Apache/Nginx)

1. **Build**
   ```bash
   npm run build
   ```

2. **Copier le contenu de `dist/`** vers votre serveur web

3. **Configuration Apache (.htaccess)**
   ```apache
   <IfModule mod_rewrite.c>
     RewriteEngine On
     RewriteBase /
     RewriteRule ^index\.html$ - [L]
     RewriteCond %{REQUEST_FILENAME} !-f
     RewriteCond %{REQUEST_FILENAME} !-d
     RewriteRule . /index.html [L]
   </IfModule>
   ```

4. **Configuration Nginx**
   ```nginx
   location / {
     try_files $uri $uri/ /index.html;
   }
   ```

## 🔧 Variables d'Environnement

Pour une configuration avancée, créer un fichier `.env` à la racine:

```env
# API Configuration (pour future intégration backend)
VITE_API_URL=https://api.example.com
VITE_API_KEY=your_api_key

# Analytics (optionnel)
VITE_ANALYTICS_ID=your_analytics_id
```

Accès dans le code:
```javascript
const apiUrl = import.meta.env.VITE_API_URL;
```

## 📊 Monitoring et Analytics

### Google Analytics (optionnel)

1. Installer le package:
   ```bash
   npm install react-ga4
   ```

2. Initialiser dans `main.jsx`:
   ```javascript
   import ReactGA from 'react-ga4';
   ReactGA.initialize('G-XXXXXXXXXX');
   ```

## 🔒 Sécurité

### Headers de Sécurité (Netlify)

Créer `_headers` dans le dossier `public/`:
```
/*
  X-Frame-Options: DENY
  X-Content-Type-Options: nosniff
  X-XSS-Protection: 1; mode=block
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: geolocation=(), microphone=(), camera=()
```

## 🐛 Debugging en Production

### Source Maps

Les source maps sont générées automatiquement. Pour les désactiver en production:

```javascript
// vite.config.js
export default defineConfig({
  build: {
    sourcemap: false
  }
});
```

### Logs et Erreurs

Intégrer un service de monitoring:
- **Sentry** (tracking d'erreurs)
- **LogRocket** (session replay)
- **Datadog** (monitoring complet)

## 📱 Progressive Web App (PWA) - Future

Pour transformer l'app en PWA:

```bash
npm install vite-plugin-pwa
```

## 🔄 Mises à Jour

### Mettre à jour l'application en production

1. Faire les modifications localement
2. Tester avec `npm run dev`
3. Build: `npm run build`
4. Preview: `npm run preview`
5. Déployer selon la méthode choisie

## ✅ Checklist de Déploiement

- [ ] Tests locaux complets
- [ ] Build de production réussi
- [ ] Preview du build testé
- [ ] Variables d'environnement configurées
- [ ] Analytics configuré (si souhaité)
- [ ] Domain name configuré (si applicable)
- [ ] HTTPS activé
- [ ] Headers de sécurité configurés
- [ ] Documentation à jour

## 🆘 Dépannage

### Problème: Build échoue

```bash
# Nettoyer et réinstaller
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Problème: Assets ne se chargent pas

Vérifier le `base` dans `vite.config.js`:
```javascript
base: '/' // ou base: '/nom-du-dossier/'
```

### Problème: LocalStorage ne fonctionne pas

Vérifier que le site utilise HTTPS en production (requis pour certains navigateurs).

## 📞 Support

Pour toute question:
- Consulter la documentation Vite: https://vitejs.dev
- Issues GitHub du projet
- Email: [votre-email]

---

**Version:** 2.0.0 (Optimisée)
**Dernière mise à jour:** Février 2026
