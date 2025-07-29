const { Server } = require('socket.io');

let io;

const initializeSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: [
        'http://localhost:3000',
        'http://localhost:3001',
        'https://prallypeet.vercel.app',
        'https://wedding-be-h0g6.onrender.com'
      ],
      methods: ['GET', 'POST'],
      credentials: true
    }
  });

  // Socket connection handler
  io.on('connection', (socket) => {
    console.log(`🔌 Client connected: ${socket.id}`);
    // Image upload

    socket.on('image-uploaded', (data) => {
      socket.to(`wedding-${data.weddingId}`).emit('image-uploaded', data);
      console.log(`📸 Image uploaded: ${data.imageId}`);
    });

    // Disconnect handler
    socket.on('disconnect', () => {
      console.log(`🔌 Client disconnected: ${socket.id}`);
    });
  });

  return io;
};

const getIO = () => {
  if (!io) {
    throw new Error('Socket.io not initialized!');
  }
  return io;
};

module.exports = {
  initializeSocket,
  getIO
};