import { Server } from 'socket.io';
import { Card, GameState, Player } from '../../models/game.models';
import { saveGameResult } from '../../config/database';

// Predefined Card Deck
const flashcardDeck: Card[] = [
    { id: '1', question: 'What is 2 + 2?', answer: '4' },
    { id: '2', question: 'What is the capital of France?', answer: 'Paris' },
    { id: '3', question: 'What element does "O" represent?', answer: 'Oxygen' },
    { id: '4', question: 'Who wrote "Hamlet"?', answer: 'William Shakespeare' },
    { id: '5', question: 'What is the largest planet in our solar system?', answer: 'Jupiter' },
    { id: '6', question: 'What year did the Titanic sink?', answer: '1912' },
];

export class GameManager {
  private gameRooms = new Map<string, GameState>();

  constructor(private io: Server) {}

  private generateRoomId = (length = 6) => Math.random().toString(36).substring(2, 2 + length);
  private delay = (ms: number) => new Promise(res => setTimeout(res, ms));

  public createRoom(clientId: string, username: string): [string, GameState] {
    const roomId = this.generateRoomId();
    const shuffledDeck = [...flashcardDeck].sort(() => Math.random() - 0.5);

    const newGame: GameState = {
      roomId,
      players: [{ id: clientId, username, score: 0 }],
      deck: shuffledDeck,
      currentCardIndex: 0,
      gameStarted: false,
      gameOver: false,
    };

    this.gameRooms.set(roomId, newGame);
    return [roomId, newGame];
  }

  public joinRoom(roomId: string, clientId: string, username: string): GameState | null {
    const room = this.gameRooms.get(roomId);
    if (room && room.players.length < 2) {
      room.players.push({ id: clientId, username, score: 0 });
      return room;
    }
    return null;
  }

  public startGame(roomId: string, clientId: string) {
    const room = this.gameRooms.get(roomId);
    if (room && room.players[0].id === clientId && room.players.length === 2) {
      room.gameStarted = true;
      this.io.to(roomId).emit('game-started');
      this.io.to(roomId).emit('update-game-state', room);
    }
  }
  
  public async submitAnswer(roomId: string, clientId: string, answer: string) {
    const room = this.gameRooms.get(roomId);
    if (!room || !room.gameStarted || room.gameOver) return;

    const player = room.players.find(p => p.id === clientId);
    const card = room.deck[room.currentCardIndex];

    if (player && card) {
      const isCorrect = card.answer.toLowerCase() === answer.toLowerCase();
      if (isCorrect) player.score += 10;
      
      this.io.to(roomId).emit('answer-result', {
        playerId: clientId, answer, isCorrect, correctAnswer: card.answer,
      });

      await this.advanceGame(roomId);
    }
  }

  private async advanceGame(roomId: string) {
    await this.delay(3000);
    const room = this.gameRooms.get(roomId);
    if (!room) return;

    if (room.currentCardIndex < room.deck.length - 1) {
      room.currentCardIndex++;
      this.io.to(roomId).emit('update-game-state', room);
    } else {
      room.gameOver = true;
      const winner = await this.handleGameOver(room);
      this.io.to(roomId).emit('game-over', {
        roomId: room.roomId,
        winner,
        finalState: room
      });
      // Clean up the room after the game is over
      this.gameRooms.delete(roomId);
    }
  }

  private async handleGameOver(room: GameState): Promise<Player | null> {
    let winner: Player | null = null;
    if (room.players.length > 0) {
      const sortedPlayers = [...room.players].sort((a, b) => b.score - a.score);
      if (sortedPlayers.length > 1 && sortedPlayers[0].score === sortedPlayers[1].score) {
        winner = null; // It's a draw
      } else {
        winner = sortedPlayers[0];
      }
    }
    
    await saveGameResult({
      roomId: room.roomId,
      winner,
      players: room.players,
      deck: room.deck,
    });
    console.log(`Game ${room.roomId} finished and results were saved.`);
    return winner;
  }

  public removePlayer(clientId: string) {
    for (const [roomId, room] of this.gameRooms.entries()) {
      const playerIndex = room.players.findIndex(p => p.id === clientId);
      if (playerIndex > -1) {
        room.players.splice(playerIndex, 1);
        if (room.players.length === 0) {
          this.gameRooms.delete(roomId);
        } else {
          this.io.to(roomId).emit('player-left');
          this.io.to(roomId).emit('update-game-state', room);
        }
        break;
      }
    }
  }
}