import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
dotenv.config()

// Créer une instance de l'application Express
const app = express();

// Middleware pour définir un en-tête Content-Type
app.use(express.json());

// Route de test
app.get('/', (req: Request, res: Response) => {
  res.send('Hello World from Express with TypeScript!');
});

// Démarrer le serveur sur le port 3000
app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});