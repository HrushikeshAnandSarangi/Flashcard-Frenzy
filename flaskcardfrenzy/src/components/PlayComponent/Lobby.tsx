import React from 'react';
import { Player } from './Play.types';
import PlayerList from './PlayerList';

// The lobby shown before the game starts
const Lobby: React.FC<{ roomId: string; players: Player[]; localPlayerId: string | null; onStartGame: () => void; }> = ({ roomId, players, localPlayerId, onStartGame }) => {
  const isHost = players.length > 0 && players[0].id === localPlayerId;
  const canStart = isHost && players.length === 2;

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col items-center space-y-8">
      <div className="text-center">
        <h1 className="text-5xl font-bold text-white neon-text-purple">Game Lobby</h1>
        <p className="text-purple-300 mt-2">Share the Room ID with a friend to join</p>
      </div>
      <div className="bg-gray-900/50 border border-purple-500/50 p-4 rounded-lg">
        <p className="text-2xl font-mono text-cyan-300 tracking-widest">{roomId}</p>
      </div>
      <div className="w-full">
         <PlayerList players={players} localPlayerId={localPlayerId} />
      </div>
      {isHost && (
        <button
          onClick={onStartGame}
          disabled={!canStart}
          className={`w-full py-4 text-2xl font-bold rounded-lg transition-all duration-300 shadow-lg
            ${canStart
              ? 'bg-cyan-500 text-gray-900 hover:bg-cyan-400 neon-shadow-cyan cursor-pointer'
              : 'bg-gray-700 text-gray-500 cursor-not-allowed'
            }`}
        >
          {players.length < 2 ? 'Waiting for another player...' : 'Start Game'}
        </button>
      )}
      {!isHost && <p className="text-lg text-purple-300">Waiting for the host to start the game...</p>}
    </div>
  );
};

export default Lobby;
