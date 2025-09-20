import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectToDatabase } from './config/database';
import { initializeSocket } from './modules/game/game.socket';
import { apiRouter } from './modules/api/api';

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // For development, restrict in production
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api', apiRouter);

const PORT = process.env.PORT || 8000;

connectToDatabase().then(() => {
  // Initialize WebSocket handlers
  initializeSocket(io);

  server.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
  });
}).catch(error => {
  console.error("Failed to connect to the database", error);
  process.exit(1);
});