# 🗄️ Configuration MongoDB Atlas M0 - Guide Pas-à-Pas

Ce guide vous accompagne dans la création et configuration de MongoDB Atlas (plan gratuit M0).

---

## ⏱️ Temps estimé : 5-10 minutes

---

## 📋 Étape 1 : Création du compte (2 min)

1. **Ouvrez ce lien dans votre navigateur** :
   ```
   https://www.mongodb.com/cloud/atlas/register
   ```

2. **Créez votre compte** :
   - Option A : Sign up with Google (recommandé, plus rapide)
   - Option B : Email + Mot de passe

3. **Complétez votre profil** :
   - Organization Name : `Hospifinance` (ou votre nom)
   - Project Name : `hospifinance-prod`

4. **Choisissez votre plan** :
   - ✅ Sélectionnez **M0 Sandbox** (FREE FOREVER)
   - Cliquez sur **Create**

---

## 📍 Étape 2 : Configuration du Cluster (1 min)

1. **Cloud Provider & Region** :
   - Provider : **AWS** (recommandé) ou **Google Cloud**
   - Region : **Frankfurt (eu-central-1)** ou **Paris (eu-west-3)**

   💡 Choisissez la région la plus proche géographiquement

2. **Cluster Tier** :
   - ✅ Vérifiez que **M0 Sandbox** est sélectionné
   - Storage : 512 MB (inclus gratuitement)

3. **Cluster Name** :
   - Nom : `hospifinance-cluster` (ou laissez par défaut `Cluster0`)

4. **Cliquez sur** : `Create Deployment`

   ⏳ Le cluster prend environ 1-3 minutes à se créer.

---

## 🔐 Étape 3 : Créer un utilisateur de base de données (1 min)

Pendant que le cluster se crée, une popup s'affichera pour créer un utilisateur :

### Option A : Via la popup automatique

1. **Username** : `hospifinance_admin`
2. **Password** : Cliquez sur **"Autogenerate Secure Password"**
3. **📋 COPIEZ le mot de passe généré** et sauvegardez-le dans un fichier texte temporaire
4. Cliquez sur **"Create Database User"**

### Option B : Manuellement

Si vous avez fermé la popup :

1. Menu gauche → **Database Access**
2. Cliquez sur **"+ ADD NEW DATABASE USER"**
3. **Authentication Method** : Password
4. **Username** : `hospifinance_admin`
5. **Password** : Cliquez sur **"Autogenerate Secure Password"** ou créez-en un fort
6. **📋 COPIEZ et SAUVEGARDEZ le mot de passe**
7. **Database User Privileges** :
   - Built-in Role : **"Atlas admin"**
   - OU **"Read and write to any database"**
8. Cliquez sur **"Add User"**

---

## 🌐 Étape 4 : Configurer l'accès réseau (1 min)

### Option A : Via la popup automatique

1. Cliquez sur **"Add My Current IP Address"**
2. Puis cliquez sur **"Add IP Address"** en bas
3. Dans la liste, ajoutez une nouvelle entrée :
   - Cliquez sur **"+ ADD IP ADDRESS"**
   - Sélectionnez **"ALLOW ACCESS FROM ANYWHERE"**
   - IP : `0.0.0.0/0` (déjà pré-rempli)
   - Description : `Allow Render.com and development`
4. Cliquez sur **"Confirm"**

### Option B : Manuellement

Si vous avez fermé la popup :

1. Menu gauche → **Network Access**
2. Cliquez sur **"+ ADD IP ADDRESS"**
3. Cliquez sur **"ALLOW ACCESS FROM ANYWHERE"**
4. Vérifiez que l'IP est : `0.0.0.0/0`
5. Description : `Allow Render.com and development`
6. Cliquez sur **"Confirm"**

⚠️ **Note sécurité** : En production avancée, vous pourriez limiter aux IPs spécifiques de Render, mais pour débuter, `0.0.0.0/0` est acceptable avec une authentification forte.

---

## 🔗 Étape 5 : Récupérer la chaîne de connexion (2 min)

1. Menu gauche → **Database** (ou **Clusters**)

2. Attendez que le cluster soit **"Active"** (statut vert)

3. Cliquez sur le bouton **"Connect"** de votre cluster

4. Sélectionnez **"Connect your application"** (ou "Drivers")

5. **Configuration** :
   - Driver : **Node.js**
   - Version : **6.3 or later** (ou la plus récente)

6. **Copiez la chaîne de connexion** affichée :
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```

7. **Modifiez la chaîne de connexion** :

   **Avant** :
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```

   **Après** (remplacez les valeurs) :
   ```
   mongodb+srv://hospifinance_admin:VOTRE_MOT_DE_PASSE@cluster0.xxxxx.mongodb.net/hospifinance?retryWrites=true&w=majority
   ```

   **Changements à faire** :
   - Remplacez `<username>` par : `hospifinance_admin`
   - Remplacez `<password>` par : votre mot de passe copié à l'étape 3
   - Ajoutez `/hospifinance` juste après `.mongodb.net` et avant le `?`

   **Exemple complet** :
   ```
   mongodb+srv://hospifinance_admin:Xy9mK2pQw7Lz@cluster0.ab1cd.mongodb.net/hospifinance?retryWrites=true&w=majority
   ```

8. **📋 Sauvegardez cette chaîne complète** dans un fichier texte sécurisé

---

## ✅ Étape 6 : Initialiser la base de données (optionnel)

Vous pouvez créer manuellement la base de données via l'interface web :

1. Menu gauche → **Database**
2. Cliquez sur **"Browse Collections"** sur votre cluster
3. Cliquez sur **"+ Create Database"**
4. **Database name** : `hospifinance`
5. **Collection name** : `users`
6. Cliquez sur **"Create"**

💡 Cette étape est optionnelle car le backend créera automatiquement les collections au premier démarrage.

---

## 🎯 Récapitulatif des informations à conserver

Créez un fichier texte temporaire `mongodb-credentials.txt` avec :

```
=== MongoDB Atlas Configuration ===

Cluster Name: hospifinance-cluster (ou Cluster0)
Database Name: hospifinance

Username: hospifinance_admin
Password: [VOTRE_MOT_DE_PASSE_ICI]

Connection String (URI complète):
mongodb+srv://hospifinance_admin:VOTRE_MOT_DE_PASSE@cluster0.xxxxx.mongodb.net/hospifinance?retryWrites=true&w=majority

Region: [Votre région choisie, ex: Frankfurt]

=== Pour Render.com ===
Copiez l'URI complète ci-dessus dans la variable MONGODB_URI de Render.com
```

⚠️ **IMPORTANT** : Ne commitez JAMAIS ce fichier dans Git ! Ajoutez-le à `.gitignore`.

---

## 🧪 Tester la connexion (optionnel)

Si vous avez Node.js installé localement, testez la connexion :

1. Créez un fichier `backend/.env` :
   ```bash
   cd backend
   cp .env.example .env
   ```

2. Éditez `backend/.env` et remplacez `MONGODB_URI` par votre URI complète

3. Testez :
   ```bash
   npm install
   npm start
   ```

4. Si vous voyez :
   ```
   ✅ MongoDB connecté
   🚀 Serveur API démarré sur http://localhost:3001
   ```

   **🎉 Félicitations ! MongoDB Atlas est correctement configuré !**

---

## 📊 Surveiller votre utilisation

1. Dashboard MongoDB Atlas : https://cloud.mongodb.com
2. Menu **"Metrics"** : Voir stockage, requêtes, connexions
3. **Limites du plan gratuit M0** :
   - 512 MB de stockage
   - 100 connexions simultanées max
   - Pas de sauvegarde automatique (exportez manuellement)

---

## 🆘 Dépannage

### Problème : "Authentication failed"

**Solutions** :
1. Vérifiez que le username est exact : `hospifinance_admin`
2. Vérifiez que le mot de passe est correct (sans espaces)
3. Si le mot de passe contient des caractères spéciaux (`@`, `:`, `/`), encodez-les en URL :
   - `@` → `%40`
   - `:` → `%3A`
   - `/` → `%2F`

### Problème : "Connection timeout"

**Solutions** :
1. Vérifiez Network Access → 0.0.0.0/0 est bien autorisé
2. Attendez 1-2 minutes (propagation des règles)
3. Vérifiez que le cluster est "Active" (pas en pause)

### Problème : "Database not found"

**Solution** :
- Pas grave ! La base sera créée automatiquement au premier démarrage du backend

---

## 🔄 Prochaine étape

Une fois MongoDB Atlas configuré, passez à :
👉 **[SETUP_RENDER.md](./SETUP_RENDER.md)** pour déployer le backend

---

**Temps total : 5-10 minutes**
**Coût : GRATUIT (512 MB)**
