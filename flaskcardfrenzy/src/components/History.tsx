'use client'
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';

// --- TYPE DEFINITIONS ---
interface Player {
  id: string;
  username: string;
  score: number;
}

interface Card {
  id: string;
  question: string;
  answer: string;
}

interface GameResult {
  id: string;
  roomId: string;
  winner: Player | null;
  players: Player[];
  deck: Card[];
}

// --- REUSABLE COMPONENTS ---
const PlayerList: React.FC<{ players: Player[] }> = ({ players }) => (
  <div className="w-full bg-gray-900/50 border border-purple-500/30 rounded-lg p-4 shadow-lg">
    <h2 className="text-xl font-bold text-cyan-400 mb-3 neon-text-cyan">Players</h2>
    <ul className="space-y-2">
      {players.map(player => (
        <li key={player.id} className="flex justify-between items-center p-2 rounded-md bg-gray-800/50">
          <span className="font-semibold text-white">{player.username}</span>
          <span className="text-xl font-bold text-cyan-300">{player.score}</span>
        </li>
      ))}
    </ul>
  </div>
);

const GameDetails: React.FC<{ game: GameResult, onBack: () => void }> = ({ game, onBack }) => (
  <div className="w-full max-w-4xl mx-auto flex flex-col space-y-6">
    <button onClick={onBack} className="self-start bg-gray-700 text-white font-bold py-2 px-4 rounded-lg hover:bg-gray-600 transition">
      &larr; Back to History
    </button>
    <div className="text-center">
      <h2 className="text-4xl font-bold text-white neon-text-purple">Game Details</h2>
      <p className="text-purple-300 font-mono mt-1">Room ID: {game.roomId}</p>
    </div>
    <div className="bg-gray-900/50 border border-purple-500/30 rounded-lg p-6 shadow-lg">
      <h3 className="text-2xl font-bold text-cyan-400 mb-4 neon-text-cyan">Final Results</h3>
      <p className="text-xl text-white mb-4">
        Winner: <span className="font-bold">{game.winner ? game.winner.username : 'Draw'}</span>
      </p>
      <PlayerList players={game.players} />
    </div>
    <div className="bg-gray-900/50 border border-cyan-500/30 rounded-lg p-6 shadow-lg">
      <h3 className="text-2xl font-bold text-cyan-400 mb-4 neon-text-cyan">Questions & Answers</h3>
      <ul className="space-y-3 max-h-96 overflow-y-auto pr-2">
        {game.deck.map(card => (
          <li key={card.id} className="bg-gray-800/50 p-3 rounded-md">
            <p className="font-semibold text-white">Q: {card.question}</p>
            <p className="text-cyan-300">A: {card.answer}</p>
          </li>
        ))}
      </ul>
    </div>
  </div>
);

// --- HISTORY LIST COMPONENT ---
const GameHistoryList: React.FC = () => {
  const { user } = useAuth();
  const [results, setResults] = useState<GameResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedGame, setSelectedGame] = useState<GameResult | null>(null);

  // Fetch user-specific history
  useEffect(() => {
    if (!user) return;

    const fetchHistory = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/history?userId=${user.id}`);
        if (!res.ok) throw new Error("Failed to fetch your game history");
        const data = await res.json(); // expects array of roomIds
        if (!data.history || data.history.length === 0) {
          setResults([]);
          return;
        }

        // Fetch full game data for each roomId
        const games: GameResult[] = [];
        for (const roomId of data.history) {
          const roomRes = await fetch(`${process.env.NEXT_PUBLIC_GAME_ENGINE}/api/results/${roomId}`);
          if (!roomRes.ok) continue;
          const gameData = await roomRes.json();
          games.push(gameData);
        }

        setResults(games);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [user]);

  if (loading) return <p className="text-2xl text-purple-300 animate-pulse">Loading History...</p>;
  if (error) return <p className="text-red-400 text-2xl">Error: {error}</p>;
  if (selectedGame) return <GameDetails game={selectedGame} onBack={() => setSelectedGame(null)} />;

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col items-center space-y-8">
      <h1 className="text-5xl font-bold text-white neon-text-purple">Game History</h1>
      <div className="w-full space-y-4">
        {results.length === 0 ? (
          <p className="text-center text-xl text-gray-400">No games played yet.</p>
        ) : (
          results.map(game => (
            <div key={game.id} onClick={() => setSelectedGame(game)}
              className="w-full  border border-purple-500/30 rounded-lg p-4 shadow-lg cursor-pointer hover:border-purple-400 transition">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-mono text-sm text-purple-300">{game.roomId}</p>
                  <p className="text-xl font-semibold text-white">
                    Winner: {game.winner ? game.winner.username : 'Draw'}
                  </p>
                </div>
                <span className="text-cyan-300 font-bold text-lg">
                  {game.players.length} Players
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

// --- MAIN PAGE COMPONENT ---
export default function HistoryPage() {
  return (
    <>
      <style jsx global>{`
      `}</style>
      <main className="w-full min-h-screen  text-white p-4 sm:p-8 flex items-center justify-center my-7 ">
        <GameHistoryList />
      </main>
    </>
  );
}
