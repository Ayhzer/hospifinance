# ✅ Vérification du Déploiement - Checklist

Utilisez cette checklist pour vérifier que tout est correctement configuré.

---

## 🗄️ MongoDB Atlas

### Configuration
- [ ] Compte MongoDB Atlas créé
- [ ] Cluster M0 (gratuit) créé
- [ ] Région : Europe (Frankfurt ou Paris)
- [ ] Utilisateur de base de données créé
- [ ] Username : `hospifinance_admin`
- [ ] Mot de passe : généré et sauvegardé
- [ ] Database Access : Utilisateur avec privilèges "Atlas admin"
- [ ] Network Access : IP 0.0.0.0/0 autorisée
- [ ] Base de données : `hospifinance` (sera créée automatiquement)

### Chaîne de connexion
- [ ] URI récupérée et complète :
  ```
  mongodb+srv://hospifinance_admin:PASSWORD@cluster0.xxxxx.mongodb.net/hospifinance?retryWrites=true&w=majority
  ```
- [ ] Username remplacé
- [ ] Password remplacé
- [ ] `/hospifinance` ajouté avant le `?`
- [ ] URI testée localement (optionnel)

### Test
```bash
# Test de connexion avec curl (nécessite MongoDB installé)
# Ou testez depuis le backend local
cd backend
npm install
# Créez .env avec votre MONGODB_URI
npm start
# Devrait afficher "✅ MongoDB connecté"
```

---

## 🚀 Render.com

### Configuration
- [ ] Compte Render.com créé
- [ ] Dépôt GitHub connecté
- [ ] Web Service créé
- [ ] Service Name : `hospifinance-api` (ou votre nom)
- [ ] Région : Frankfurt (EU Central)
- [ ] Branch : `main`
- [ ] Root Directory : `backend`
- [ ] Build Command : `npm install`
- [ ] Start Command : `npm start`
- [ ] Plan : Free

### Variables d'environnement
- [ ] `NODE_ENV` = `production`
- [ ] `PORT` = `10000`
- [ ] `MONGODB_URI` = URI MongoDB complète
- [ ] `MONGODB_DB_NAME` = `hospifinance`
- [ ] `JWT_SECRET` = Secret généré (64+ caractères)
- [ ] `JWT_EXPIRES_IN` = `7d`
- [ ] `CORS_ORIGIN` = `https://ayhzer.github.io`

### Déploiement
- [ ] Service déployé avec succès
- [ ] Logs affichent "✅ MongoDB connecté"
- [ ] Logs affichent "🚀 Serveur API démarré"
- [ ] Service status : "Live" (vert)
- [ ] URL récupérée : `https://votre-service.onrender.com`

### Tests
```bash
# 1. Test Health Check
curl https://votre-service.onrender.com/health
# Attendu : {"status":"ok","timestamp":"..."}

# 2. Test Login
curl -X POST https://votre-service.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
# Attendu : {"token":"...", "user":{...}}
```

- [ ] Health check répond `{"status":"ok"}`
- [ ] Login répond avec un token JWT
- [ ] Pas d'erreurs dans les logs Render

---

## 🎨 GitHub Pages

### Secret GitHub
- [ ] Dépôt GitHub : `Ayhzer/hospifinance`
- [ ] Settings → Secrets and variables → Actions
- [ ] Secret `VITE_API_URL` créé
- [ ] Valeur : `https://votre-service.onrender.com/api` (avec `/api` à la fin)

### GitHub Pages activé
- [ ] Settings → Pages
- [ ] Source : "Deploy from a branch"
- [ ] Branch : `gh-pages` / `/ (root)`
- [ ] Saved

### Déploiement
- [ ] Branche `main` mise à jour (ou PR mergée)
- [ ] GitHub Actions : Workflow "Deploy to GitHub Pages" lancé
- [ ] Workflow complété avec succès (✓ vert)
- [ ] Branche `gh-pages` créée et mise à jour
- [ ] Site visible : `https://ayhzer.github.io/hospifinance`

### Tests Frontend
```bash
# Ouvrez dans votre navigateur
https://ayhzer.github.io/hospifinance
```

- [ ] Page se charge sans erreur 404
- [ ] Logo et formulaire de connexion visibles
- [ ] Pas d'erreur dans la console (F12)
- [ ] Pas d'erreur CORS
- [ ] Connexion fonctionne (admin / admin123)
- [ ] Dashboard s'affiche après connexion
- [ ] Menus fonctionnent (OPEX, CAPEX, Paramètres)

---

## 🔗 Intégration Frontend ↔ Backend

### Tests de bout en bout

1. **Connexion**
   - [ ] Login avec `admin` / `admin123` fonctionne
   - [ ] Token JWT stocké dans localStorage
   - [ ] Redirection vers le dashboard

2. **OPEX**
   - [ ] Liste des fournisseurs se charge
   - [ ] Création d'un nouveau fournisseur fonctionne
   - [ ] Modification d'un fournisseur fonctionne
   - [ ] Suppression d'un fournisseur fonctionne

3. **CAPEX**
   - [ ] Liste des projets se charge
   - [ ] Création d'un nouveau projet fonctionne
   - [ ] Modification d'un projet fonctionne
   - [ ] Suppression d'un projet fonctionne

4. **Utilisateurs** (en tant qu'admin)
   - [ ] Liste des utilisateurs se charge
   - [ ] Création d'un utilisateur fonctionne
   - [ ] Modification d'un utilisateur fonctionne
   - [ ] Suppression d'un utilisateur fonctionne
   - [ ] Changement de mot de passe fonctionne

5. **Paramètres**
   - [ ] Paramètres globaux se chargent
   - [ ] Modification du budget OPEX fonctionne
   - [ ] Modification du budget CAPEX fonctionne
   - [ ] Ajout de colonnes personnalisées fonctionne

6. **Export/Import**
   - [ ] Export JSON fonctionne
   - [ ] Import JSON fonctionne
   - [ ] Export Excel fonctionne (si implémenté)

---

## 🔐 Sécurité

### Checklist sécurité
- [ ] Mot de passe admin changé (pas `admin123` en production !)
- [ ] `JWT_SECRET` fort et unique (64+ caractères)
- [ ] CORS configuré sur le backend (`https://ayhzer.github.io` uniquement)
- [ ] MongoDB : Mot de passe fort pour l'utilisateur
- [ ] MongoDB : Authentification activée
- [ ] Render : 2FA activé (recommandé)
- [ ] GitHub : 2FA activé (recommandé)
- [ ] MongoDB Atlas : 2FA activé (recommandé)
- [ ] Fichiers `.env` dans `.gitignore` (jamais committés)
- [ ] Secrets GitHub non visibles publiquement

### Fichiers sensibles à ne JAMAIS committer
- [ ] `.env`
- [ ] `.env.production`
- [ ] `backend/.env`
- [ ] Fichiers contenant mots de passe ou tokens

---

## 📊 Monitoring

### Render.com
- [ ] Dashboard accessible : https://dashboard.render.com
- [ ] Service visible dans le dashboard
- [ ] Logs accessibles et sans erreur
- [ ] Metrics visibles (CPU, RAM)
- [ ] Notifications email configurées (optionnel)

### MongoDB Atlas
- [ ] Dashboard accessible : https://cloud.mongodb.com
- [ ] Cluster visible et "Active"
- [ ] Metrics visibles (stockage, connexions)
- [ ] Collections créées automatiquement après premier usage

### GitHub Pages
- [ ] GitHub Actions : https://github.com/Ayhzer/hospifinance/actions
- [ ] Derniers workflows : succès (✓)
- [ ] Branche `gh-pages` mise à jour récemment

### UptimeRobot (optionnel mais recommandé)
- [ ] Compte UptimeRobot créé : https://uptimerobot.com
- [ ] Monitor créé pour `https://votre-service.onrender.com/health`
- [ ] Interval : 5 minutes
- [ ] Alertes email configurées

---

## 📝 Sauvegardes

### MongoDB
- [ ] Export manuel effectué (recommandé mensuellement)
- [ ] Lieu de sauvegarde : [Indiquez votre emplacement]
- [ ] Dernière sauvegarde : [Date]

### Code
- [ ] Code sur GitHub (sauvegarde automatique)
- [ ] Branches protégées (optionnel)
- [ ] Tags de version (optionnel)

---

## 📚 Documentation

### Fichiers créés
- [ ] `DEPLOY_GUIDE.md` - Guide complet
- [ ] `DEPLOIEMENT_OPTION2.md` - Quick start
- [ ] `SETUP_MONGODB_ATLAS.md` - Guide MongoDB
- [ ] `SETUP_RENDER.md` - Guide Render
- [ ] `SETUP_GITHUB_PAGES.md` - Guide GitHub Pages
- [ ] `backend/README_DEPLOY.md` - Guide backend
- [ ] `backend/render.yaml` - Config Render
- [ ] `backend/.env.production.example` - Template backend
- [ ] `.env.production.example` - Template frontend

### Informations sauvegardées
- [ ] URL du backend Render
- [ ] URL du frontend GitHub Pages
- [ ] MongoDB URI (en sécurité)
- [ ] JWT_SECRET (en sécurité)
- [ ] Identifiants MongoDB (en sécurité)

---

## 🎯 Résumé Final

Si toutes les cases sont cochées :

✅ **MongoDB Atlas** : Configuré et fonctionnel
✅ **Render.com** : Backend déployé et accessible
✅ **GitHub Pages** : Frontend déployé et accessible
✅ **Intégration** : Frontend ↔ Backend fonctionne
✅ **Sécurité** : Bonnes pratiques appliquées
✅ **Monitoring** : Outils en place
✅ **Documentation** : Guides disponibles

🎉 **Votre application Hospifinance est en production et opérationnelle !**

---

## 🆘 En cas de problème

Si une case n'est pas cochée, consultez :

1. **MongoDB** → [SETUP_MONGODB_ATLAS.md](./SETUP_MONGODB_ATLAS.md)
2. **Render** → [SETUP_RENDER.md](./SETUP_RENDER.md)
3. **GitHub Pages** → [SETUP_GITHUB_PAGES.md](./SETUP_GITHUB_PAGES.md)
4. **Guide complet** → [DEPLOY_GUIDE.md](./DEPLOY_GUIDE.md)

Chaque guide contient une section **"Dépannage"** détaillée.

---

## 📞 Support

- **Issues GitHub** : https://github.com/Ayhzer/hospifinance/issues
- **Documentation Render** : https://render.com/docs
- **Documentation MongoDB** : https://www.mongodb.com/docs/atlas/

---

**Date de vérification** : _______________
**Vérifié par** : _______________
**Statut** : [ ] ✅ Tout fonctionne | [ ] ⚠️ Problèmes à résoudre
