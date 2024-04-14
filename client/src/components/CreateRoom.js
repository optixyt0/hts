import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidV4 } from 'uuid';

function CreateRoom() {
    const navigate = useNavigate();
    const handleStartMeeting = () => {
        navigate(`/${uuidV4()}?creator=true`);
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <h1 className="text-3xl font-semibold mb-4">Create a Meeting Room</h1>
            <button onClick={handleStartMeeting} className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded">
                Start Meeting
            </button>
        </div>
    );
}

export default CreateRoom;
