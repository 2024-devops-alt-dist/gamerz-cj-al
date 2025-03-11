import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const db = async () => {
  try {
    const uri = process.env.DATABASE_URI;
    if(!uri) {
      throw new Error('L\'URL de MongoDB est manquante.');
    }
    await mongoose.connect(uri);
    console.log('MongoDB connecté avec succès');
  } catch (error) {
    console.error('Erreur de connexion à MongoDB :', error);
  }
};

export default db;