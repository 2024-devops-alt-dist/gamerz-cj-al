import { Request, Response } from "express";
import User from "../models/User";

export const getUsers = async (req: Request, res: Response): Promise<void> => {
    try {
      const users = await User.find();
      res.status(200).json(users);
    } catch (error) {
      res.status(400).json({ message: 'Erreur lors de la récupération des utilisateurs' });
    }
  };