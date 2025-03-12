import mongoose from 'mongoose';
import logger from '../utils/logger';
import config from '../config';

const dbConnect = async () => {
  try {
    const uri = config.uri;
    if(!uri) {
      throw new Error('Database url not found');
    }
    await mongoose.connect(uri);
    logger.info('Database connexion succeed');
  } catch (error) {
    logger.error('Database connexion failed :', error);
  }
};

export default dbConnect;