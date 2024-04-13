import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { v4 as uuidV4 } from 'uuid';

function CreateRoom() {
    const [roomId] = useState(uuidV4());
    const history = useHistory();

    const handleStartMeeting = () => {
        history.push(`/room/${roomId}?creator=true`);
    };

    return (
        <div className="waiting-room">
            <h1>Waiting Room</h1>
            <p>Your meeting ID is: {roomId}</p>
            <button onClick={handleStartMeeting}>Start Meeting</button>
        </div>
    );
}

export default CreateRoom;
