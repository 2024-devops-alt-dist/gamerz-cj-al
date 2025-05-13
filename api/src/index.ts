import express, { Application } from 'express';
import config from './config';
import logger from './utils/logger';
import dbConnect from './db/db';
import swaggerUi from 'swagger-ui-express';
import swaggerDocs from './swaggerConfig';
import userRoutes from './routes/userRoutes';
import authRoutes from './routes/authRoutes';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import roomRoutes from './routes/roomRoutes';
import messageRoutes from './routes/messageRoutes';
import { Server } from 'socket.io';
import { createServer } from 'http';
import { socketSetup } from './socket/socketSetup';
import path from 'path';

const app: Application = express();
const port = config.port;
const httpServer = createServer(app);
const io = new Server(httpServer, {
	cors: {
		origin: process.env.FRONT_URL,
		credentials: true, 
	}
});

app.use(cors({
  origin: process.env.FRONT_URL,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'], 
  credentials: true, 
}));

app.use(express.json());
app.use(cookieParser())

dbConnect();

app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
app.use('/api', authRoutes);
app.use('/api', userRoutes);
app.use('/api', roomRoutes);
app.use('/api', messageRoutes);
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

socketSetup(io);

httpServer.listen(port, () => {
  logger.info(`Server is running on port ${port}`);
});