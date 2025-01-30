import { Server } from 'socket.io';
import { verifyToken } from '../../lib/auth';

export default function SocketHandler(req, res) {
  if (res.socket.server.io) {
    console.log('Socket is already running');
    res.end();
    return;
  }

  const io = new Server(res.socket.server);
  res.socket.server.io = io;

  io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    const user = verifyToken(token);
    if (user) {
      socket.user = user;
      next();
    } else {
      next(new Error('Authentication error'));
    }
  });

  io.on('connection', (socket) => {
    console.log(`User connected: ${socket.user.id}`);

    socket.on('message', (message) => {
      io.emit('message', { ...message, sender: { _id: socket.user.id, username: socket.user.username } });
    });

    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.user.id}`);
    });
  });

  console.log('Socket is initialized');
  res.end();
}