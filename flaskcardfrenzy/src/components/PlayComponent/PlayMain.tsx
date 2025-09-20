"use client";

import React, { useState, useEffect } from "react";
import { io, Socket } from "socket.io-client";
import { useAuth } from "@/context/AuthContext";

// Import types
import { GameState, Player, AnswerResult } from "./Play.types";

// Import component modules
import Lobby from "./Lobby";
import GameBoard from "./GameBoard";
import GameOver from "./GameOver";

export default function PlayPage() {
  const { user } = useAuth();

  const [socket, setSocket] = useState<Socket | null>(null);
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [localPlayerId, setLocalPlayerId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [gameOverData, setGameOverData] = useState<{
    finalState: GameState;
    winner: Player | null;
  } | null>(null);
  const [answerResult, setAnswerResult] = useState<AnswerResult | null>(null);
  const [isJoined, setIsJoined] = useState(false);

  // Fetched username from backend
  const [username, setUsername] = useState<string>("");

  // --- Fetch username from server ---
  useEffect(() => {
    const fetchUsername = async () => {
      if (!user?.id) return;
      try {
        const res = await fetch(`/api/user?userId=${user.id}`);
        if (res.ok) {
          const data = await res.json();
          setUsername(data.username || user.email || "Guest");
        } else {
          setUsername(user.email || "Guest");
        }
      } catch (err) {
        console.error("Error fetching username:", err);
        setUsername(user.email || "Guest");
      }
    };
    fetchUsername();
  }, [user]);

  // --- HANDLERS ---
  const handleCreate = () => {
    if (!username) return;
    socket?.emit("create-room", { username });
    setIsJoined(true);
  };

  const handleJoin = (roomId: string) => {
    if (!username) return;
    socket?.emit("join-room", { roomId, username });
    setIsJoined(true);
  };

  const handleStartGame = () => {
    if (gameState?.roomId) {
      socket?.emit("start-game", { roomId: gameState.roomId });
    }
  };

  const handleSubmitAnswer = (answer: string) => {
    if (gameState?.roomId) {
      socket?.emit("submit-answer", { roomId: gameState.roomId, answer });
    }
  };

  // --- EFFECT FOR SOCKET CONNECTION ---
  useEffect(() => {
    if (typeof window === "undefined") return;

    const newSocket = io(
      process.env.NEXT_PUBLIC_GAME_ENGINE || "http://localhost:8000"
    );
    setSocket(newSocket);

    newSocket.on("connect", () => {
      console.log("Connected to server with ID:", newSocket.id);
      if (newSocket.id) setLocalPlayerId(newSocket.id);
    });

    newSocket.on("update-game-state", (state: GameState) => {
      setGameState(state);
      setError(null);
    });

    newSocket.on("room-created", (roomId: string) => {
      console.log(`Room created: ${roomId}`);
    });

    newSocket.on("answer-result", (result: AnswerResult) => {
      setAnswerResult(result);
      setTimeout(() => setAnswerResult(null), 3000);
    });

    newSocket.on(
      "game-over",
      async (data: { finalState: GameState; winner: Player | null }) => {
        setGameOverData(data);

        // ✅ Append roomId into history via API route
        if (user && data.finalState.roomId) {
          try {
            await fetch("/api/history", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                userId: user.id,
                roomId: data.finalState.roomId,
              }),
            });
          } catch (err) {
            console.error("Error calling /api/history:", err);
          }
        }
      }
    );

    newSocket.on("error", (errorMessage: string) => {
      setError(errorMessage);
      setIsJoined(false);
    });

    return () => {
      newSocket.disconnect();
    };
  }, [user, username]);

  // --- RENDER LOGIC ---
const renderContent = () => {
  if (!isJoined) {
    return (
      <div className="flex flex-col gap-6 text-center p-8 rounded-xl border border-gray-700">
        
        {/* Title styled with a bold purple color */}
        <h2 className="text-2xl font-bold text-purple-400">
          Welcome, {username || "Guest"}
        </h2>
        
        {/* Outlined button that fills with blue on hover */}
        <button
          onClick={handleCreate}
          className="px-6 py-2 rounded-lg font-semibold text-blue-400 bg-transparent border-2 border-blue-400
                     hover:bg-blue-400 hover:text-gray-900 
                     transition-colors duration-300"
        >
          Create Room
        </button>
        
        <div>
          {/* Input field with a purple border that brightens on focus */}
          <input
            type="text"
            id="roomId"
            placeholder="Enter Room ID"
            className="bg-gray-900/50 text-purple-300 placeholder:text-purple-700 px-4 py-2 rounded-md 
                       border-2 border-purple-500 focus:outline-none focus:border-purple-400 
                       transition-colors duration-300"
          />
          
          {/* A second blue button for consistency */}
          <button
            onClick={() => {
              const roomId = (
                document.getElementById("roomId") as HTMLInputElement
              ).value;
              if (roomId) handleJoin(roomId);
            }}
            className="px-6 py-2 ml-2 rounded-lg font-semibold text-blue-400 bg-transparent border-2 border-blue-400
                       hover:bg-blue-400 hover:text-gray-900
                       transition-colors duration-300"
          >
            Join Room
          </button>
        </div>
      </div>
    );
  }
  
  // ... rest of your component logic
    if (error) {
      return <p className="text-red-400 text-2xl">Error: {error}</p>;
    }
    if (gameOverData) {
      return (
        <GameOver
          finalState={gameOverData.finalState}
          winner={gameOverData.winner}
          localPlayerId={localPlayerId}
        />
      );
    }
    if (gameState) {
      if (!gameState.gameStarted) {
        return (
          <Lobby
            roomId={gameState.roomId}
            players={gameState.players}
            localPlayerId={localPlayerId}
            onStartGame={handleStartGame}
          />
        );
      }
      return (
        <GameBoard
          gameState={gameState}
          localPlayerId={localPlayerId}
          onSubmitAnswer={handleSubmitAnswer}
          answerResult={answerResult}
        />
      );
    }
    return (
      <p className="text-2xl text-purple-300 animate-pulse">
        Connecting to server...
      </p>
    );
  };

  return (
    <main className="w-full min-h-screen  text-white p-4 sm:p-8 flex items-center justify-center">
      {renderContent()}
    </main>
  );
}
