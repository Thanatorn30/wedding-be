const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const http = require('http');
require('dotenv').config();



const routes = require('./routes');
const { sequelize } = require('./config/database');
const { initializePusher } = require('./config/pusher');
const Image = require('./models/Image');

// Import all models to establish relationships
require('./models/index');

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 3000;

// Initialize Pusher
initializePusher();

// Middleware
app.use(helmet());
app.use(compression());
app.use(morgan('combined'));
// CORS configuration
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    const allowedOrigins = [
      'http://localhost:3000',
      'http://localhost:3001',
      'https://prallypeet.vercel.app',
      'https://your-frontend-domain.vercel.app'
    ];
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Routes
app.use('/api', routes);



// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  
  // Handle CORS errors
  if (err.message === 'Not allowed by CORS') {
    return res.status(403).json({ 
      error: 'CORS Error',
      message: 'Origin not allowed'
    });
  }
  
  res.status(500).json({ 
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Server start
async function startServer() {
  try {
    // Sync database to create tables
    // Sync all table
    // await sequelize.sync({ force: true });
    // Drop all table
    // sequelize.drop()
    // await sequelize.sync()
    // await Image.sync({ alter: true })
    
    // Initialize Google Auth and log token
    // try {
    //   const accessToken = await googleAuthService.getAccessToken();
    //   console.log('✅ Google Auth initialized successfully');
    // } catch (authError) {
    //   console.error('⚠️ Google Auth initialization failed:', authError.message);
    // }
    
    server.listen(PORT, () => {
      console.log(`\n🚀 Server running on port ${PORT}`);
      console.log(`🔌 Pusher server ready`);
      // console.log(`📊 Environment: ${process.env.NODE_ENV}`);
      // console.log(`🔗 API docs: http://localhost:${PORT}/api`);
    });
  } catch (error) {
    console.error('❌ Unable to start server:', error);
    process.exit(1);
  }
}

startServer();

module.exports = app; 