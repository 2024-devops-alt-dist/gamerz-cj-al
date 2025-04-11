import { Server, Socket } from 'socket.io';
import { socketHandler } from './socketHandlers';

export const socketSetup = (io: Server) => {
  io.on('connection', (socket: Socket) => {

    console.log(`User connected: ${socket.id}`);
    socketHandler(io, socket);
  });
};