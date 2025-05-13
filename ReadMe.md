# Gamerz - Conception d'une Plateforme Privée de Discussion pour joueurs

## Context 
L’objectif est de mettre en place une plateforme privée où des joueurs peuvent échanger en temps réel autour de leurs jeux favoris et trouver facilement des coéquipiers. Pour garantir un environnement sain et motivant, chaque joueur devra soumettre une candidature et être validé par un administrateur avant de pouvoir accéder aux salons de discussion.

## Objectifs
- Développer une application web en React JS + TypeScript interagissant avec un back-end Express.js
- Implémenter une authentification sécurisée avec JWT et cookies httpOnly + Formulaire d’inscription (Stockage sécurisé du mot de passe)
- Mettre en place une communication en temps réel avec Socket.io.
- Stocker les messages de chaque salon en base de données.
- Gestion des users, des salons et des accès en fonction du role
- Gestion des formulaires avec React Hook Form et validation avec Zod.

## Techniques et outils 
- **Front-end** : React JS + TypeScript, React Hook Form, Zod, React Router
- **Back-end** : Express.js, JWT, bcrypt, cookies httpOnly, Socket.io
- **Base de données** : MongoDB
- **Gestion de projet** : GitHub Projects

## Installation
### 1. Clonez le dépôt
`https://github.com/2024-devops-alt-dist/gamerz-cj-al.git`

### Installation des dépendances
Pour le front-end :
```
cd client
npm install
```

Pour le back-end :
```
cd api
npm install
```

### Configuration des variables d’environnement
Dans le dossier api, créez un fichier .env :
```
DB_USER=********
DB_PASSWORD=********
DB_NAME=********
DB_HOST=********
DB_CLUSTER=********
JWT_ACCESS_SECRET=********
JWT_REFRESH_SECRET=********
API_PORT=********
```

### Lancement du projet
Lancer le back-end : 
```
cd api
npm run dev
```

Lancer le front-end : 
```
cd client
npm run dev
```

L'application sera accessible à l'adresse : http://localhost:5173/

L'application est accessible en ligne à l'adresse suivante : https://gamerz-cj-al-front.onrender.com/