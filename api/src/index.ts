import express, { Application } from 'express';
import config from './config';
import logger from './utils/logger';
import dbConnect from './db/db';
import swaggerUi from 'swagger-ui-express';
import swaggerDocs from './swaggerConfig';
import userRoutes from './routes/userRoutes';
import authRoutes from './routes/authRoutes';
import cors from 'cors';

const app: Application = express();
const port = config.port;

app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE'], 
  credentials: true, 
}));

app.use(express.json());

dbConnect();

app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
app.use('/api', authRoutes);
app.use('/api', userRoutes);

app.listen(port, () => {
  logger.info(`Server is running on port ${port}`);
});