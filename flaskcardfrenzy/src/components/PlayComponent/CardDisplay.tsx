import React from 'react';
import { Card } from './Play.types';

// Displays the current flashcard question
const CardDisplay: React.FC<{ card: Card | null, cardIndex: number, totalCards: number }> = ({ card, cardIndex, totalCards }) => (
  <div className="relative w-full h-64 flex flex-col items-center justify-center bg-gray-900 border-2 border-cyan-400 rounded-xl p-6 text-center shadow-2xl neon-shadow-cyan">
     <div className="absolute top-2 right-2 text-cyan-400 text-sm font-mono">
        {cardIndex + 1} / {totalCards}
    </div>
    <p className="text-2xl lg:text-3xl font-semibold text-white">
      {card ? card.question : 'Waiting for card...'}
    </p>
  </div>
);

export default CardDisplay;
