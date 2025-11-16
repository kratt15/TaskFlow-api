# Guide de Configuration - Express.js avec TypeScript

## 📋 Table des matières
1. [Procédures de création](#procédures-de-création)
2. [Packages installés](#packages-installés)
3. [Organisation des fichiers](#organisation-des-fichiers)
4. [Éléments de base](#éléments-de-base)

---

## 🚀 Procédures de création

### 1. Initialisation du projet

```bash
# Créer le répertoire du projet
mkdir taskflow-api
cd taskflow-api

# Initialiser un projet Node.js
npm init -y
```

### 2. Installation des dépendances

#### Dépendances de production
```bash
npm install express dotenv
```

#### Dépendances de développement
```bash
npm install --save-dev typescript @types/express @types/dotenv tsx
```

**Note** : Ce projet utilise `tsx` au lieu de `ts-node` pour une meilleure compatibilité avec ESM.

### 3. Configuration de TypeScript

#### Générer le fichier de configuration
```bash
npx tsc --init
```

#### Configuration recommandée (`tsconfig.json`)
- `module: "nodenext"` - Pour la compatibilité ESM
- `target: "esnext"` - Utilise les dernières fonctionnalités JavaScript
- `outDir: "./dist"` - Répertoire de sortie des fichiers compilés
- `strict: true` - Active toutes les vérifications strictes
- `verbatimModuleSyntax: true` - Exige des imports de type explicites
- `isolatedModules: true` - Assure la compatibilité avec les bundlers

### 4. Configuration du package.json

#### Ajouter `"type": "module"` pour ESM
```json
{
  "type": "module"
}
```

#### Scripts npm
```json
{
  "scripts": {
    "start": "tsx server.ts",
    "dev": "tsx watch server.ts",
    "build": "tsc"
  }
}
```

### 5. Création de la structure de fichiers

```bash
mkdir src
mkdir src/routes
mkdir config
```

---

## 📦 Packages installés

### Dépendances de production

| Package | Version | Description |
|---------|---------|-------------|
| `express` | ^5.1.0 | Framework web pour Node.js |
| `dotenv` | ^17.2.3 | Gestion des variables d'environnement |

### Dépendances de développement

| Package | Version | Description |
|---------|---------|-------------|
| `typescript` | ^5.9.3 | Compilateur TypeScript |
| `@types/express` | ^5.0.5 | Définitions de types pour Express |
| `@types/dotenv` | ^6.1.1 | Définitions de types pour dotenv |
| `tsx` | ^4.20.6 | Exécute TypeScript directement (alternative à ts-node pour ESM) |

### Commandes d'installation complète

```bash
# Installation en une seule commande
npm install express dotenv
npm install --save-dev typescript @types/express @types/dotenv tsx
```

---

## 📁 Organisation des fichiers

### Structure du projet

```
taskflow-api/
├── src/                    # Code source TypeScript
│   ├── app.ts             # Configuration de l'application Express
│   └── routes/            # Définitions des routes
│       └── index.ts       # Routes principales
├── config/                # Fichiers de configuration
│   └── index.ts          # Configuration générale
├── dist/                  # Fichiers compilés (générés automatiquement)
│   ├── server.js
│   ├── server.d.ts
│   └── ...
├── node_modules/          # Dépendances npm
├── server.ts              # Point d'entrée principal
├── package.json           # Configuration npm
├── package-lock.json      # Verrouillage des versions
├── tsconfig.json          # Configuration TypeScript
├── .env                   # Variables d'environnement (à créer)
└── .gitignore            # Fichiers à ignorer par Git
```

### Description des répertoires

- **`src/`** : Contient tout le code source TypeScript de l'application
  - `app.ts` : Configuration Express (middlewares, routes principales)
  - `routes/` : Définition des routes API organisées par ressource

- **`config/`** : Fichiers de configuration de l'application
  - Variables d'environnement, connexions DB, etc.

- **`dist/`** : Fichiers JavaScript compilés (générés par `tsc`)
  - Ne pas modifier manuellement, régénéré à chaque compilation

- **`server.ts`** : Point d'entrée de l'application
  - Initialise dotenv, importe l'app et démarre le serveur

---

## 🔧 Éléments de base

### 1. Point d'entrée (`server.ts`)

```typescript
import express, { type Request, type Response } from "express";
import dotenv from "dotenv";
import app from "./src/app.js";

// Configuration des variables d'environnement
dotenv.config();

const PORT = process.env.PORT ? Number(process.env.PORT) : 3500;

// Démarrage du serveur
app.listen(PORT, () => { 
  console.log("Server running at PORT: ", PORT); 
}).on("error", (error) => {
  throw new Error(error.message);
});
```

**Points importants :**
- Import avec extension `.js` (requis pour ESM avec `module: "nodenext"`)
- Types importés avec `type` (requis avec `verbatimModuleSyntax: true`)
- Gestion d'erreur pour le démarrage du serveur

### 2. Configuration Express (`src/app.ts`)

```typescript
import express from "express";
import routes from "./routes/index.js";

const app = express();

// Middleware pour parser le JSON
app.use(express.json());

// Montage des routes
app.use("/api/v1", routes);

export default app;
```

**Points importants :**
- `express.json()` : Parse les requêtes JSON
- Routes montées sous `/api/v1`
- Export par défaut pour l'import dans `server.ts`

### 3. Routes (`src/routes/index.ts`)

```typescript
import { Router } from "express";
import { type Request, type Response } from "express";

const router = Router();

router.get("/", (request: Request, response: Response) => {
  response.json({ message: "Hello World" });
});

export default router;
```

**Points importants :**
- Utilisation de `Router()` pour créer un routeur Express
- Types `Request` et `Response` importés avec `type`
- Export par défaut pour l'import dans `app.ts`

### 4. Variables d'environnement (`.env`)

Créer un fichier `.env` à la racine :

```env
PORT=3500
NODE_ENV=development
```

**Note** : Ajouter `.env` dans `.gitignore` pour ne pas commiter les secrets.

### 5. Configuration TypeScript (`tsconfig.json`)

Options clés :
- **`module: "nodenext"`** : Compatible avec ESM de Node.js
- **`verbatimModuleSyntax: true`** : Exige des imports de type explicites
- **`isolatedModules: true`** : Compatible avec les bundlers modernes
- **`strict: true`** : Active toutes les vérifications strictes
- **`noUncheckedIndexedAccess: true`** : `process.env.PORT` peut être `undefined`

### 6. Scripts npm

```json
{
  "scripts": {
    "start": "tsx server.ts",        // Production
    "dev": "tsx watch server.ts",    // Développement avec rechargement auto
    "build": "tsc"                   // Compilation TypeScript
  }
}
```

**Utilisation :**
- `npm run dev` : Démarre en mode développement avec rechargement automatique
- `npm run build` : Compile le TypeScript en JavaScript dans `dist/`
- `npm start` : Démarre l'application (utilise le code source directement avec tsx)

---

## ⚠️ Points importants à retenir

### 1. Imports avec extensions `.js`
Avec `module: "nodenext"` et ESM, **toujours utiliser `.js`** dans les imports relatifs :
```typescript
import app from "./src/app.js";  // ✅ Correct
import app from "./src/app";     // ❌ Erreur
```

### 2. Imports de types
Avec `verbatimModuleSyntax: true`, **toujours utiliser `type`** pour les imports de types :
```typescript
import { type Request, type Response } from "express";  // ✅ Correct
import { Request, Response } from "express";            // ❌ Erreur
```

### 3. Paramètres des route handlers
Les handlers Express reçoivent **toujours** `(request, response, next)` :
```typescript
app.get("/", (request: Request, response: Response) => {  // ✅ Correct
  response.json({ message: "Hello" });
});

app.get("/", (response: Response) => {  // ❌ Erreur : request manquant
  response.json({ message: "Hello" });
});
```

### 4. Variables d'environnement
Avec `noUncheckedIndexedAccess: true`, `process.env.PORT` peut être `undefined` :
```typescript
const PORT = process.env.PORT ? Number(process.env.PORT) : 3500;  // ✅ Correct
const PORT = process.env.PORT;  // ❌ Peut être undefined
```

---

## 🎯 Commandes utiles

```bash
# Développement avec rechargement automatique
npm run dev

# Compilation TypeScript
npm run build

# Démarrage en production
npm start

# Vérification des types (sans compilation)
npx tsc --noEmit
```

---

## 📚 Ressources

- [Guide Kinsta - Express TypeScript](https://kinsta.com/blog/express-typescript/)
- [Documentation Express](https://expressjs.com/)
- [Documentation TypeScript](https://www.typescriptlang.org/)
- [Documentation tsx](https://github.com/esbuild-kit/tsx)

