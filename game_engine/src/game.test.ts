import http from 'http';
import { Server } from 'socket.io';
import { io as Client, Socket as ClientSocket } from 'socket.io-client';
import express from 'express';
import { initializeSocket } from './modules/game/game.socket';
import { apiRouter } from '../src/modules/api/api';
import { connectToDatabase } from './config/database';
import request from 'supertest';
import { GameState } from './models/game.models';

describe('Flashcard Game Engine', () => {
  let httpServer: http.Server;
  let io: Server;
  let clientSocket1: ClientSocket;
  let clientSocket2: ClientSocket;
  let app: express.Express;
  let port: number;
  
  // Setup: Start the server and connect to DB before tests
  beforeAll(async () => {
    app = express();
    httpServer = http.createServer(app);
    io = new Server(httpServer);
    
    app.use(express.json());
    app.use('/api', apiRouter);
    initializeSocket(io);

    await connectToDatabase();

    await new Promise<void>((resolve) => {
      httpServer.listen(() => {
        const address = httpServer.address();
        port = typeof address === 'string' ? 0 : address!.port;
        console.log(`Test server running on port ${port}`);
        resolve();
      });
    });
  });

  // Teardown: Close all connections after tests are done
  afterAll(() => {
    io.close();
    httpServer.close();
  });

  // Disconnect clients after each test to ensure a clean slate
  afterEach(() => {
    clientSocket1?.disconnect();
    clientSocket2?.disconnect();
  });

  test('should handle a full two-player game flow and save the result', (done) => {
    let roomId: string;

    // --- Player Flags & Start Game Logic ---
    let player1Ready = false;
    let player2Ready = false;
    const checkStartGame = () => {
        if (player1Ready && player2Ready) {
            console.log("Both players ready. Starting game...");
            clientSocket1.emit('start-game', { roomId });
        }
    };

    // --- Player 1 Setup ---
    clientSocket1 = Client(`http://localhost:${port}`);

    clientSocket1.on('connect', () => {
      console.log('Client 1 connected');
      clientSocket1.emit('create-room', { username: 'Alice' });
    });

    clientSocket1.on('room-created', (_roomId) => {
      roomId = _roomId;
      console.log(`Room created: ${roomId}`);
      
      // --- Player 2 Setup (inside callback, after room exists) ---
      clientSocket2 = Client(`http://localhost:${port}`);
      
      clientSocket2.on('connect', () => {
        console.log('Client 2 connected');
        clientSocket2.emit('join-room', { roomId, username: 'Bob' });
      });

      // Attach client 2's listener here, where it's guaranteed to exist
      clientSocket2.on('update-game-state', (state: GameState) => {
        if (state.players.length === 2 && !player2Ready) {
          console.log("Client 2 is ready.");
          player2Ready = true;
          checkStartGame();
        }
      });
    });

    // --- Client 1's Main Game Logic Handler ---
    clientSocket1.on('update-game-state', (state: GameState) => {
      // Check if both players have joined from player 1's perspective
      if (state.players.length === 2 && !player1Ready) {
        console.log("Client 1 is ready.");
        player1Ready = true;
        checkStartGame();
      }

      // Logic for submitting answers
      if (state.gameStarted && !state.gameOver) {
        const currentCard = state.deck[state.currentCardIndex];
        console.log(`Client 1 sees Card ${state.currentCardIndex + 1}. Answering...`);
        
        setTimeout(() => {
          clientSocket1.emit('submit-answer', { roomId, answer: currentCard.answer });
        }, 500); // Small delay to simulate thinking
      }
    });

    // --- Game Over Logic ---
    clientSocket1.on('game-over', async ({ finalState }) => {
      console.log('Game over event received by Client 1. Winner:', finalState.winner?.username);
      
      // Verify final score
      const winner = finalState.players.find((p: any) => p.id === clientSocket1.id);
      expect(winner.score).toBe(60); // 6 cards * 10 points

      // --- API Test ---
      const response = await request(app).get(`/api/results/${roomId}`);
      
      expect(response.status).toBe(200);
      expect(response.body.roomId).toBe(roomId);
      expect(response.body.winner.username).toBe('Alice');
      expect(response.body.players.length).toBe(2);

      done(); // End the test
    });
  });
});

