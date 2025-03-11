import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import db from './config/db';
dotenv.config();

const app = express();

app.use(express.json());

app.get('/', (req: Request, res: Response) => {
  res.send('Hello World from Express with TypeScript!');
});

app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});

db();