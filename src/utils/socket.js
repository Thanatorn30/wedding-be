const { emitToChannel, emitToAll } = require('../config/pusher');

// Emit image events
const emitImageUploaded = (weddingId, imageData) => {
  emitToChannel(`wedding-${weddingId}`, 'image-uploaded', {
    weddingId,
    image: imageData
  });
};

// Broadcast to all connected clients
const broadcastToAll = (event, data) => {
  emitToAll(event, data);
};

// Get connected clients count (Pusher doesn't provide this directly)
const getConnectedClientsCount = () => {
  // Pusher doesn't provide real-time client count through the server SDK
  // This would need to be implemented differently if required
  console.log('⚠️ Client count not available with Pusher server SDK');
  return 0;
};

module.exports = {
  emitImageUploaded,
  broadcastToAll,
  getConnectedClientsCount
};