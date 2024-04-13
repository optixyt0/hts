import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

function JoinRoom() {
    const [roomId, setRoomId] = useState('');
    const history = useHistory();

    const handleJoin = (e) => {
        e.preventDefault();
        history.push(`/room/${roomId}`);
    };

    return (
        <div className="join-room">
            <h1>Join a Room</h1>
            <form onSubmit={handleJoin}>
                <input type="text" value={roomId} onChange={e => setRoomId(e.target.value)} placeholder="Enter Room ID" />
                <button type="submit">Join Room</button>
            </form>
        </div>
    );
}

export default JoinRoom;