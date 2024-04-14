import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function JoinRoom() {
    const [roomId, setRoomId] = useState('');
    const navigate = useNavigate();

    const handleJoinRoom = () => {
        if (roomId.trim() !== '') {
            navigate(`/${roomId}`);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <h1 className="text-3xl font-semibold mb-4">Join a Meeting Room</h1>
            <div className="mb-4">
                <input
                    type="text"
                    value={roomId}
                    onChange={(e) => setRoomId(e.target.value)}
                    placeholder="Enter Room ID"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
            </div>
            <button
                onClick={handleJoinRoom}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
                Join Room
            </button>
        </div>
    );
}

export default JoinRoom;
