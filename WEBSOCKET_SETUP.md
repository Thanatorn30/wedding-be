# WebSocket Setup Documentation

## Overview
This project includes WebSocket functionality using Socket.IO for real-time image upload notifications.

## Installation
WebSocket dependencies are already installed:
- `socket.io` - WebSocket library

## Configuration

### Server Setup
The WebSocket server is configured in `src/config/socket.js` and integrated into the main server in `src/server.js`.

### CORS Configuration
WebSocket CORS is configured to allow connections from:
- `http://localhost:3000`
- `http://localhost:3001`
- `https://prallypeet.vercel.app`
- `https://your-frontend-domain.vercel.app`

## WebSocket Events

### Client Events (Frontend → Backend)

#### Connection Management
- `join-wedding` - Join a wedding room
  ```javascript
  socket.emit('join-wedding', weddingId);
  ```

- `leave-wedding` - Leave a wedding room
  ```javascript
  socket.emit('leave-wedding', weddingId);
  ```

#### Image Management
- `image-uploaded` - Notify when an image is uploaded
  ```javascript
  socket.emit('image-uploaded', {
    weddingId: 1,
    image: imageData
  });
  ```

### Server Events (Backend → Frontend)

The server will emit the same events back to all clients in the same wedding room (except the sender).

## Frontend Integration

### Connect to WebSocket
```javascript
import { io } from 'socket.io-client';

const socket = io('http://localhost:3002', {
  transports: ['websocket', 'polling']
});

// Connection events
socket.on('connect', () => {
  console.log('Connected to WebSocket server');
});

socket.on('disconnect', () => {
  console.log('Disconnected from WebSocket server');
});
```

### Join Wedding Room
```javascript
socket.emit('join-wedding', 1); // Join wedding with ID 1
```

### Listen for Events
```javascript
// Image events
socket.on('image-uploaded', (data) => {
  console.log('Image uploaded:', data.image);
  // Update UI - show new image
  // Refresh image gallery
  // Show notification
});
```

## API Endpoints

### WebSocket Management
- `GET /api/socket/clients/count` - Get number of connected clients
- `GET /api/socket/clients/list` - Get list of connected socket IDs
- `POST /api/socket/broadcast` - Broadcast message to all clients
- `POST /api/socket/room/:roomId/message` - Send message to specific room

### Example Usage
```bash
# Get connected clients count
curl http://localhost:3002/api/socket/clients/count

# Broadcast message
curl -X POST http://localhost:3002/api/socket/broadcast \
  -H "Content-Type: application/json" \
  -d '{"event": "announcement", "data": {"message": "Welcome to the wedding!"}}'

# Send message to specific room
curl -X POST http://localhost:3002/api/socket/room/wedding-1/message \
  -H "Content-Type: application/json" \
  -d '{"event": "notification", "data": {"message": "New photos uploaded!"}}'
```

## Automatic Events

The following events are automatically emitted when corresponding API endpoints are called:

### Image Events
- `POST /api/image/create` → `image-uploaded`

## Use Cases

### Real-time Image Gallery Updates
When a user uploads an image:
1. Image is uploaded via `POST /api/image/create`
2. Server processes the upload and saves to database
3. WebSocket emits `image-uploaded` event to all clients in the same wedding room
4. All connected clients receive the event and update their image gallery
5. Users see new images immediately without refreshing the page

### Example Frontend Implementation
```javascript
// Listen for new image uploads
socket.on('image-uploaded', (data) => {
  const { image } = data;
  
  // Add new image to gallery
  const imageGallery = document.getElementById('image-gallery');
  const newImageElement = createImageElement(image);
  imageGallery.appendChild(newImageElement);
  
  // Show notification
  showNotification(`New image uploaded: ${image.title}`);
  
  // Update image count
  updateImageCount();
});

function createImageElement(image) {
  const img = document.createElement('img');
  img.src = image.url;
  img.alt = image.title;
  img.className = 'gallery-image';
  return img;
}
```

## Error Handling

WebSocket errors are logged to the console. The server will continue running even if WebSocket connections fail.

## Testing

You can test WebSocket functionality using:
1. Browser console
2. Socket.IO client tools
3. WebSocket testing tools like Postman

## Security Considerations

- CORS is configured to allow only specific origins
- WebSocket connections are not authenticated by default
- Consider adding authentication middleware for sensitive operations