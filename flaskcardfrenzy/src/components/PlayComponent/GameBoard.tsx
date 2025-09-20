import React, { useState } from 'react';
import { GameState, AnswerResult } from './Play.types';
import PlayerList from './PlayerList';
import CardDisplay from './CardDisplay';

// The main game board
const GameBoard: React.FC<{ gameState: GameState; localPlayerId: string | null; onSubmitAnswer: (answer: string) => void; answerResult: AnswerResult | null }> = ({ gameState, localPlayerId, onSubmitAnswer, answerResult }) => {
  const [answer, setAnswer] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (answer.trim()) {
      onSubmitAnswer(answer.trim());
      setAnswer('');
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
      <div className="md:col-span-1">
        <PlayerList players={gameState.players} localPlayerId={localPlayerId} />
      </div>
      <div className="md:col-span-2 flex flex-col space-y-6">
        <CardDisplay card={gameState.deck[gameState.currentCardIndex]} cardIndex={gameState.currentCardIndex} totalCards={gameState.deck.length} />
        {answerResult && (
           <div className={`p-3 rounded-lg text-center font-semibold text-lg ${answerResult.isCorrect ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'}`}>
               {answerResult.username} answered "{answerResult.answer}". 
               {answerResult.isCorrect ? " Correct!" : ` Incorrect! The answer was "${answerResult.correctAnswer}".`}
           </div>
        )}
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Type your answer..."
            className="flex-grow bg-gray-800 border-2 border-purple-500 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
            disabled={!!answerResult}
          />
          <button
            type="submit"
            className="bg-purple-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-purple-500 transition-all duration-300 disabled:bg-gray-700 disabled:cursor-not-allowed neon-shadow-purple"
            disabled={!!answerResult}
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default GameBoard;

