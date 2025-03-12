import express, { Application } from 'express';
import config from './config';
import logger from './utils/logger';
import dbConnect from './db/db';
import userRoutes from './routes/userRoutes';

const app: Application = express();
const port = config.port;

app.use(express.json());

app.use('/api', userRoutes);

dbConnect();

app.listen(port, () => {
  logger.info(`Server is running on port ${port}`);
});