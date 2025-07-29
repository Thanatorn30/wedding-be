const express = require('express');
const router = express.Router();
const { getIO } = require('../config/socket');

// Get connected clients count
router.get('/clients/count', (req, res) => {
  try {
    const io = getIO();
    const count = io.engine.clientsCount;
    res.json({ 
      success: true, 
      connectedClients: count 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
});

// Get all connected socket IDs
router.get('/clients/list', (req, res) => {
  try {
    const io = getIO();
    const sockets = Array.from(io.sockets.sockets.keys());
    res.json({ 
      success: true, 
      connectedSockets: sockets 
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
    const io = getIO();
    
    if (!event) {
      return res.status(400).json({ 
        success: false, 
        message: 'Event name is required' 
      });
    }
    
    io.emit(event, data);
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
    const io = getIO();
    
    if (!event) {
      return res.status(400).json({ 
        success: false, 
        message: 'Event name is required' 
      });
    }
    
    io.to(roomId).emit(event, data);
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