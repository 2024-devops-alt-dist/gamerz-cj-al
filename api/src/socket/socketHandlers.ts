import { log } from 'console';
import { Server, Socket } from 'socket.io';
import Message from '../models/Message';
import logger from '../utils/logger';

export const socketHandler = (io: Server, socket: Socket) => {
  socket.on('join_room', (roomId: string) => {
    socket.join(roomId);
    io.to(roomId).emit('userJoined', socket.id);
  });

  socket.on('send_message', async (data) => {    
    const { roomId, sendedMessage } = data;
    try {
      const newMessage = new Message({
        content: sendedMessage.content,
        user: sendedMessage.user,
        room: sendedMessage.room
      });
      const savedMessage = await newMessage.save();
      const populatedMessage = await savedMessage.populate([
        { path: 'user', select: 'username' },
        { path: 'room', select: 'name' }
      ]);
      io.to(roomId).emit('receive_message', populatedMessage);
    } catch (error) {
      logger.error('Failed to save the message');
    }
    
  });

  // Déconnexion
  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
  });
};
