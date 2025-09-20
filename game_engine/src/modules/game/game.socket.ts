import { Server, Socket } from 'socket.io';
import { GameManager } from './game.manager';

export const initializeSocket = (io: Server) => {
  const gameManager = new GameManager(io);

  io.on('connection', (socket: Socket) => {
    console.log(`New connection: ${socket.id}`);

    socket.on('create-room', ({ username }: { username: string }) => {
      const [roomId, newGame] = gameManager.createRoom(socket.id, username);
      socket.join(roomId);
      socket.emit('room-created', roomId);
      socket.emit('update-game-state', newGame);
    });

    socket.on('join-room', ({ roomId, username }: { roomId: string, username: string }) => {
      const room = gameManager.joinRoom(roomId, socket.id, username);
      if (room) {
        socket.join(roomId);
        io.to(roomId).emit('update-game-state', room);
      } else {
        socket.emit('error', 'Room is full or does not exist.');
      }
    });

    socket.on('start-game', ({ roomId }: { roomId: string }) => {
      gameManager.startGame(roomId, socket.id);
    });

    socket.on('submit-answer', ({ roomId, answer }: { roomId: string, answer: string }) => {
      gameManager.submitAnswer(roomId, socket.id, answer);
    });

    socket.on('disconnect', () => {
      console.log(`Connection dropped: ${socket.id}`);
      gameManager.removePlayer(socket.id);
    });
  });
};