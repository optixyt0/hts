const express = require('express');
const http = require('http');
const mongoose = require('mongoose');
const socketIo = require('socket.io');
const { v4: uuidV4 } = require('uuid');
const path = require('path');
require('dotenv').config();
const fs = require('fs');
const { execSync } = require('child_process');
var RateLimit = require('express-rate-limit');
var limiter = RateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // max 100 requests per windowMs
});

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(limiter);
const proxyPort =  'http://localhost:' + process.env.BACKEND_PORT;
const packageJsonPath = './client/package.json';
const packageJson = require(packageJsonPath);
packageJson.proxy = proxyPort;
fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));

// Set the path to the client directory
const clientPath = path.join(__dirname, 'client');

try {
    // Run the command in the client directory
    execSync('npm run start:network', { stdio: 'inherit', cwd: clientPath });
} catch (error) {
    console.error('Failed to start the React app:', error);
}

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'client/build')));

mongoose.connect(process.env.DB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.log(err));

// API Routes
app.get('/api/create', (req, res) => {
  const roomId = uuidV4();
  res.json({ roomId: roomId });
});

app.post('/api/join', (req, res) => {
  const roomId = req.body.roomId;
  res.redirect(`/room/${roomId}`);
});

// Handles any requests that don't match the ones above
app.get('*', (req, res) =>{
  res.sendFile(path.join(__dirname+'/client/build/index.html'));
});

io.on('connection', socket => {
  socket.on('join-room', (roomId, userId) => {
    socket.join(roomId);
    socket.broadcast.to(roomId).emit('user-connected', userId);

    socket.on('signal', (userId, signal) => {
      socket.to(userId).emit('received-signal', signal);
    });

    socket.on('disconnect', () => {
      socket.broadcast.to(roomId).emit('user-disconnected', userId);
    });
  });
});

const PORT = process.env.BACKEND_PORT || 2000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
