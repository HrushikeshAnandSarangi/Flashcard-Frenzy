export interface Player {
  id: string; // socket.id
  username: string;
  score: number;
}

export interface Card {
  id: string;
  question: string;
  answer: string;
}

export interface GameState {
  roomId: string;
  players: Player[];
  deck: Card[];
  currentCardIndex: number;
  gameStarted: boolean;
  gameOver: boolean;
}

export interface GameResult {
  id: string; // Corresponds to MongoDB's _id
  roomId: string;
  winner: Player | null;
  players: Player[];
  deck: Card[];
}