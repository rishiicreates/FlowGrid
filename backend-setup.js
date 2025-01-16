const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(cors());
app.use(express.json());

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname))
  }
});
const upload = multer({ storage: storage });

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/saas-prototype', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// User Schema
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);

// Message Schema
const messageSchema = new mongoose.Schema({
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  content: String,
  timestamp: { type: Date, default: Date.now }
});

const Message = mongoose.model('Message', messageSchema);

// Auth Routes
app.post('/signup', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = new User({ email, password }); // Note: Add password hashing in production
    await user.save();
    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || user.password !== password) { // Add proper password comparison in production
      throw new Error('Invalid credentials');
    }
    res.json({ userId: user._id });
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
});

// File Upload Route
app.post('/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }
  res.json({ 
    message: 'File uploaded successfully',
    filename: req.file.filename
  });
});

// Socket.IO connection handling
const activeUsers = new Set();

io.on('connection', (socket) => {
  console.log('New client connected');

  socket.on('user_connected', (userId) => {
    activeUsers.add(userId);
    io.emit('active_users', Array.from(activeUsers));
  });

  socket.on('send_message', async (data) => {
    try {
      const message = new Message({
        sender: data.userId,
        content: data.content
      });
      await message.save();
      io.emit('new_message', {
        sender: data.userId,
        content: data.content,
        timestamp: message.timestamp
      });
    } catch (error) {
      console.error('Error saving message:', error);
    }
  });

  socket.on('disconnect', () => {
    activeUsers.delete(socket.userId);
    io.emit('active_users', Array.from(activeUsers));
    console.log('Client disconnected');
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});