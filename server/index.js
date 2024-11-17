const express = require('express');
const app = express();
const http = require('http').createServer(app);
const cors = require('cors');
const io = require('socket.io')(http, {
  cors: {
    origin: ["http://localhost:3000", "https://your-ngrok-url.ngrok.io"],
    methods: ["GET", "POST"]
  }
});

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    const allowedOrigins = [
      'http://localhost:3000',
      'https://your-ngrok-url.ngrok.io'
    ];
    
    if (allowedOrigins.indexOf(origin) === -1) {
      return callback(new Error('CORS policy violation'), false);
    }
    return callback(null, true);
  },
  credentials: true
}));

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('A user connected');

  // Handle room creation
  socket.on('createRoom', (roomName) => {
    socket.join(roomName);
    io.to(roomName).emit('roomCreated', roomName);
    console.log(`Room created: ${roomName}`);
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

const PORT = process.env.PORT || 9000;
http.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});