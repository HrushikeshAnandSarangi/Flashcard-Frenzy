"use client"

import React, { useState, useEffect } from 'react';
import { io, Socket } from 'socket.io-client';

// Import types
import { GameState, Player, AnswerResult } from './Play.types';

// Import component modules
import UserDetailsModal from './UserDetailModel';
import Lobby from './Lobby';
import GameBoard from './GameBoard';
import GameOver from './GameOver';


export default function PlayPage() {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [localPlayerId, setLocalPlayerId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [gameOverData, setGameOverData] = useState<{ finalState: GameState, winner: Player | null } | null>(null);
  const [answerResult, setAnswerResult] = useState<AnswerResult | null>(null);
  const [isJoined, setIsJoined] = useState(false);

  // --- HANDLERS ---
  const handleCreate = (username: string) => {
    socket?.emit('create-room', { username });
    setIsJoined(true);
  };

  const handleJoin = (username: string, roomId: string) => {
    socket?.emit('join-room', { roomId, username });
    setIsJoined(true);
  };

  const handleStartGame = () => {
    if (gameState?.roomId) {
      socket?.emit('start-game', { roomId: gameState.roomId });
    }
  };
  
  const handleSubmitAnswer = (answer: string) => {
    if (gameState?.roomId) {
      socket?.emit('submit-answer', { roomId: gameState.roomId, answer });
    }
  };

  // --- EFFECT FOR SOCKET CONNECTION ---
  useEffect(() => {
    // Ensure this runs only on the client side
    if (typeof window === 'undefined') return;

    // Connect to the backend server. Replace with your server's URL.
    const newSocket = io(process.env.NEXT_PUBLIC_GAME_ENGINE || 'http://localhost:8000');
    setSocket(newSocket);
    
    newSocket.on('connect', () => {
      console.log('Connected to server with ID:', newSocket.id);
      if (newSocket.id) {
        setLocalPlayerId(newSocket.id);
      }
    });

    newSocket.on('update-game-state', (state: GameState) => {
      setGameState(state);
      setError(null);
    });
    
    newSocket.on('room-created', (roomId: string) => {
      // You could update the URL here if using Next.js router
      console.log(`Room created: ${roomId}. URL should be /play/${roomId}`);
    });

    newSocket.on('answer-result', (result: AnswerResult) => {
        setAnswerResult(result);
        setTimeout(() => setAnswerResult(null), 3000); // Show result for 3 seconds
    });

    newSocket.on('game-over', (data: { finalState: GameState; winner: Player | null }) => {
      setGameOverData(data);
    });
    
    newSocket.on('error', (errorMessage: string) => {
        setError(errorMessage);
        // If an error occurs (e.g., room full), we should let the user try again.
        setIsJoined(false); 
    });

    return () => {
      newSocket.disconnect();
    };
  }, []);

  // --- RENDER LOGIC ---
  const renderContent = () => {
    if (!isJoined) {
        return <UserDetailsModal onCreate={handleCreate} onJoin={handleJoin} />;
    }
    if (error) {
        return <p className="text-red-400 text-2xl">Error: {error}</p>;
    }
    if (gameOverData) {
      return <GameOver finalState={gameOverData.finalState} winner={gameOverData.winner} localPlayerId={localPlayerId} />;
    }
    if (gameState) {
      if (!gameState.gameStarted) {
        return <Lobby roomId={gameState.roomId} players={gameState.players} localPlayerId={localPlayerId} onStartGame={handleStartGame} />;
      }
      return <GameBoard gameState={gameState} localPlayerId={localPlayerId} onSubmitAnswer={handleSubmitAnswer} answerResult={answerResult} />;
    }
    return <p className="text-2xl text-purple-300 animate-pulse">Connecting to server...</p>;
  };

  return (
      <main className="w-full min-h-screen bg-gray-900 text-white p-4 sm:p-8 flex items-center justify-center">
        {renderContent()}
      </main>
  );
}

