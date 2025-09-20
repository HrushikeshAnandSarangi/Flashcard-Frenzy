// --- TYPE DEFINITIONS (to match the backend) ---

export interface Player {
  id: string;
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

export interface AnswerResult {
  playerId: string;
  username: string;
  answer: string;
  isCorrect: boolean;
  correctAnswer: string;
}
