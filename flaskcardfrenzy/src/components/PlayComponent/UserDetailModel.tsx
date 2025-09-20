import React, { useState } from 'react';

const UserDetailsModal: React.FC<{ onJoin: (username: string, roomId: string) => void, onCreate: (username: string) => void }> = ({ onJoin, onCreate }) => {
    const [username, setUsername] = useState('');
    const [roomId, setRoomId] = useState('');

    return (
        <div className="fixed inset-0 bg-gray-900/80 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="w-full max-w-md bg-gray-900 border border-purple-500/50 rounded-xl p-8 space-y-6 neon-shadow-purple">
                <h2 className="text-3xl font-bold text-center text-white">Flashcard Frenzy</h2>
                <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter your username"
                    className="w-full bg-gray-800 border-2 border-purple-500 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
                />
                <div className="space-y-4">
                     <h3 className="text-center text-purple-300">Join a Game</h3>
                     <div className="flex gap-2">
                         <input
                            type="text"
                            value={roomId}
                            onChange={(e) => setRoomId(e.target.value)}
                            placeholder="Enter Room ID"
                            className="flex-grow bg-gray-800 border-2 border-gray-600 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 transition"
                         />
                         <button onClick={() => onJoin(username, roomId)} disabled={!username || !roomId} className="bg-cyan-500 text-gray-900 font-bold py-3 px-6 rounded-lg hover:bg-cyan-400 transition disabled:bg-gray-700 disabled:cursor-not-allowed">
                            Join
                         </button>
                     </div>
                </div>
                <div className="relative flex py-2 items-center">
                    <div className="flex-grow border-t border-gray-600"></div>
                    <span className="flex-shrink mx-4 text-gray-400">OR</span>
                    <div className="flex-grow border-t border-gray-600"></div>
                </div>
                 <button onClick={() => onCreate(username)} disabled={!username} className="w-full bg-purple-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-purple-500 transition disabled:bg-gray-700 disabled:cursor-not-allowed">
                   Create New Game
                </button>
            </div>
        </div>
    );
}

export default UserDetailsModal;
