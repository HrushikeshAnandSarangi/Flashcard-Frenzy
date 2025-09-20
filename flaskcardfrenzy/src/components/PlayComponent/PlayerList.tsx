import React from 'react';
import { Player } from './Play.types';

// Displays a list of players and their scores
const PlayerList: React.FC<{ players: Player[]; localPlayerId: string | null }> = ({ players, localPlayerId }) => (
  <div className="w-full bg-gray-900/50 border border-purple-500/30 rounded-lg p-4 shadow-lg">
    <h2 className="text-xl font-bold text-cyan-400 mb-3 neon-text-cyan">Players</h2>
    <ul className="space-y-2">
      {players.map((player) => (
        <li
          key={player.id}
          className={`flex justify-between items-center p-2 rounded-md transition-all duration-300 ${
            player.id === localPlayerId ? 'bg-purple-600/50' : 'bg-gray-800/50'
          }`}
        >
          <span className="font-semibold text-white">
            {player.username} {player.id === localPlayerId && '(You)'}
          </span>
          <span className="text-xl font-bold text-cyan-300">{player.score}</span>
        </li>
      ))}
    </ul>
  </div>
);

export default PlayerList;
