# Pusher Setup Guide

This project has been migrated from WebSocket (Socket.io) to Pusher for real-time communication.

## Setup Instructions

### 1. Create a Pusher Account
1. Go to [Pusher](https://pusher.com/) and create an account
2. Create a new Channels app
3. Note down your app credentials

### 2. Environment Variables
Add the following environment variables to your `.env` file:

```env
# Pusher Configuration
PUSHER_APP_ID=your_pusher_app_id
PUSHER_KEY=your_pusher_key
PUSHER_SECRET=your_pusher_secret
PUSHER_CLUSTER=your_pusher_cluster
```

### 3. Frontend Integration
In your frontend application, you'll need to:

1. Install Pusher client library:
```bash
npm install pusher-js
```

2. Initialize Pusher client:
```javascript
import Pusher from 'pusher-js';

const pusher = new Pusher('your_pusher_key', {
  cluster: 'your_pusher_cluster'
});

// Subscribe to channels
const channel = pusher.subscribe('wedding-123');

// Listen for events
channel.bind('image-uploaded', function(data) {
  console.log('Image uploaded:', data);
});

// Listen to broadcast channel
const broadcastChannel = pusher.subscribe('broadcast');
broadcastChannel.bind('your-event', function(data) {
  console.log('Broadcast event:', data);
});
```

## API Endpoints

The following endpoints are available for server-side event emission:

- `POST /api/socket/broadcast` - Broadcast to all clients
- `POST /api/socket/room/:roomId/message` - Send message to specific room
- `GET /api/socket/clients/count` - Get connected clients count (not available with Pusher)
- `GET /api/socket/clients/list` - Get connected socket IDs (not available with Pusher)

## Migration Notes

### What Changed
- Replaced Socket.io with Pusher
- Removed WebSocket server initialization
- Updated event emission methods
- Simplified client connection management

### Limitations
- Client count and socket ID tracking are not available through Pusher server SDK
- Real-time connection status requires additional implementation
- Channel presence features require Pusher Presence channels

### Benefits
- No need to manage WebSocket server
- Automatic scaling and reliability
- Built-in authentication and security
- Cross-platform compatibility
- Better for production deployments 