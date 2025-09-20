import React from 'react';
import { GameState, Player } from './Play.types';
import PlayerList from './PlayerList';

// The game over screen
const GameOver: React.FC<{ finalState: GameState; winner: Player | null; localPlayerId: string | null; }> = ({ finalState, winner, localPlayerId }) => {
  let message = '';
  if (!winner) {
    message = "It's a Draw!";
  } else if (winner.id === localPlayerId) {
    message = 'You Win!';
  } else {
    message = `${winner.username} Wins!`;
  }

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col items-center space-y-8">
      <h1 className="text-7xl font-bold text-cyan-400 neon-text-cyan">{message}</h1>
      <p className="text-2xl text-white">Final Scores</p>
      <div className="w-full">
        <PlayerList players={finalState.players} localPlayerId={localPlayerId} />
      </div>
      <button onClick={() => window.location.reload()} className="w-full py-3 text-xl font-bold rounded-lg transition-all duration-300 shadow-lg bg-purple-600 text-white hover:bg-purple-500 neon-shadow-purple">
        Play Again
      </button>
    </div>
  );
};

export default GameOver;
