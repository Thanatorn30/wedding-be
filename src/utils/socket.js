const { getIO } = require('../config/socket');

// Emit image events
const emitImageUploaded = (weddingId, imageData) => {
  const io = getIO();
  io.to(`wedding-${weddingId}`).emit('image-uploaded', {
    weddingId,
    image: imageData
  });
};

// Broadcast to all connected clients
const broadcastToAll = (event, data) => {
  const io = getIO();
  io.emit(event, data);
};

// Get connected clients count
const getConnectedClientsCount = () => {
  const io = getIO();
  return io.engine.clientsCount;
};

module.exports = {
  emitImageUploaded,
  broadcastToAll,
  getConnectedClientsCount
};