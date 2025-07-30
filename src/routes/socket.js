const express = require('express');
const router = express.Router();
const { getPusher, emitToChannel, emitToAll } = require('../config/pusher');

// Get connected clients count (Pusher doesn't provide this directly)
router.get('/clients/count', (req, res) => {
  try {
    // Pusher doesn't provide real-time client count through the server SDK
    // This would need to be implemented differently if required
    res.json({ 
      success: true, 
      connectedClients: 0,
      message: 'Client count not available with Pusher server SDK'
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
});

// Get all connected socket IDs (Pusher doesn't provide this directly)
router.get('/clients/list', (req, res) => {
  try {
    // Pusher doesn't provide socket IDs through the server SDK
    res.json({ 
      success: true, 
      connectedSockets: [],
      message: 'Socket IDs not available with Pusher server SDK'
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
});

// Broadcast message to all connected clients
router.post('/broadcast', (req, res) => {
  try {
    const { event, data } = req.body;
    
    if (!event) {
      return res.status(400).json({ 
        success: false, 
        message: 'Event name is required' 
      });
    }
    
    emitToAll(event, data);
    res.json({ 
      success: true, 
      message: `Event '${event}' broadcasted to all clients` 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
});

// Send message to specific room
router.post('/room/:roomId/message', (req, res) => {
  try {
    const { roomId } = req.params;
    const { event, data } = req.body;
    
    if (!event) {
      return res.status(400).json({ 
        success: false, 
        message: 'Event name is required' 
      });
    }
    
    emitToChannel(roomId, event, data);
    res.json({ 
      success: true, 
      message: `Event '${event}' sent to room '${roomId}'` 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
});

module.exports = router;