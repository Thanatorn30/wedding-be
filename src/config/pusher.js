const Pusher = require('pusher');

// Initialize Pusher
const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID,
  key: process.env.PUSHER_KEY,
  secret: process.env.PUSHER_SECRET,
  cluster: process.env.PUSHER_CLUSTER,
  useTLS: true
});

// Pusher event handlers
const initializePusher = () => {
  console.log('🔌 Pusher initialized successfully');
  return pusher;
};

// Get Pusher instance
const getPusher = () => {
  if (!pusher) {
    throw new Error('Pusher not initialized!');
  }
  return pusher;
};

// Emit to specific channel
const emitToChannel = (channel, event, data) => {
  try {
    pusher.trigger(channel, event, data);
    console.log(`📡 Event '${event}' sent to channel '${channel}'`);
  } catch (error) {
    console.error('❌ Error emitting to channel:', error);
    throw error;
  }
};

// Emit to all clients
const emitToAll = (event, data) => {
  try {
    pusher.trigger('broadcast', event, data);
    console.log(`📡 Event '${event}' broadcasted to all clients`);
  } catch (error) {
    console.error('❌ Error broadcasting:', error);
    throw error;
  }
};

module.exports = {
  initializePusher,
  getPusher,
  emitToChannel,
  emitToAll
}; 