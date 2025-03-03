// import { Server } from 'socket.io';
// import { verifyToken } from '../../lib/auth';

// const SocketHandler = (req, res) => {
//   if (res.socket.server.io) {
//     console.log('Socket is already running');
//     res.end();
//     return;
//   }

//   const io = new Server(res.socket.server, {
//     path: '/api/socket',
//     addTrailingSlash: false,
//     cors: {
//       origin: '*',
//       methods: ['GET', 'POST'],
//     },
//   });

//   res.socket.server.io = io;

//   io.use((socket, next) => {
//     try {
//       const token = socket.handshake.auth.token;
//       const user = verifyToken(token);
//       if (user) {
//         socket.user = user;
//         next();
//       } else {
//         next(new Error('Authentication error'));
//       }
//     } catch (error) {
//       console.error('Socket authentication error:', error);
//       next(new Error('Authentication failed'));
//     }
//   });



// // updated

// io.on('connection', (socket) => {
//   if (!socket.user || !socket.user.username) {
//     console.log('User connected: undefined');
//     return;
//   }

//   console.log(`User connected: ${socket.user.username}`);

//   socket.join(socket.user.id);

//   socket.on('message', async (message) => {
//     try {
//       const formattedMessage = {
//         ...message,
//         sender: { _id: socket.user.id, username: socket.user.username },
//         timestamp: new Date(),
//       };

//       io.emit('message', formattedMessage);
//       console.log(`Message sent by ${socket.user.username}: ${message.content}`);
//     } catch (error) {
//       console.error('Error handling message:', error);
//       socket.emit('error', { message: 'Error sending message' });
//     }
//   });

//   socket.on('disconnect', () => {
//     console.log(`User disconnected: ${socket.user?.username || 'Unknown'}`);
//   });
// });









//   console.log('Socket is initialized');
//   res.end();
// };

// export const config = {
//   api: {
//     bodyParser: false,
//   },
// };

// export default SocketHandler;

import { Server } from 'socket.io';
import { verifyToken } from '../../lib/auth';

const SocketHandler = (req, res) => {
  if (res.socket.server.io) {
    console.log('Socket is already running');
    res.end();
    return;
  }

  const io = new Server(res.socket.server, {
    path: '/api/socket',
    addTrailingSlash: false,
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
    },
  });

  res.socket.server.io = io;

  io.use((socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      const user = verifyToken(token);

      if (user && user.username) {  // Ensure username exists in token
        socket.user = user;
        next();
      } else {
        next(new Error('Authentication error: Username missing'));
      }
    } catch (error) {
      console.error('Socket authentication error:', error);
      next(new Error('Authentication failed'));
    }
  });

  io.on('connection', (socket) => {
    console.log(`User connected: ${socket.user.username}`);

    socket.join(socket.user.id);

    socket.on('message', async (message) => {
      try {
        const formattedMessage = {
          ...message,
          sender: { _id: socket.user.id, username: socket.user.username },
          timestamp: new Date(),
        };

        io.emit('message', formattedMessage);
        console.log(`Message sent by ${socket.user.username}: ${message.content}`);
      } catch (error) {
        console.error('Error handling message:', error);
        socket.emit('error', { message: 'Error sending message' });
      }
    });

    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.user.username}`);
    });
  });

  console.log('Socket is initialized');
  res.end();
};

export const config = {
  api: {
    bodyParser: false,
  },
};

export default SocketHandler;
