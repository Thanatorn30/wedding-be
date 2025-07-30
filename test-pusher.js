// Simple test to verify Pusher configuration
require('dotenv').config();
const { initializePusher, emitToChannel, emitToAll } = require('./src/config/pusher');

console.log('🧪 Testing Pusher configuration...');

// Check if environment variables are set
const requiredEnvVars = ['PUSHER_APP_ID', 'PUSHER_KEY', 'PUSHER_SECRET', 'PUSHER_CLUSTER'];
const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingVars.length > 0) {
  console.error('❌ Missing required environment variables:', missingVars);
  console.log('Please add these to your .env file:');
  missingVars.forEach(varName => {
    console.log(`${varName}=your_${varName.toLowerCase()}`);
  });
  process.exit(1);
}

console.log('✅ All required environment variables are set');

try {
  // Initialize Pusher
  const pusher = initializePusher();
  console.log('✅ Pusher initialized successfully');
  
  // Test emit to channel
  console.log('📡 Testing emit to channel...');
  emitToChannel('test-channel', 'test-event', { message: 'Hello from Pusher!' });
  
  // Test emit to all
  console.log('📡 Testing broadcast...');
  emitToAll('test-broadcast', { message: 'Broadcast test from Pusher!' });
  
  console.log('✅ All tests passed! Pusher is configured correctly.');
  
} catch (error) {
  console.error('❌ Pusher test failed:', error.message);
  process.exit(1);
} 