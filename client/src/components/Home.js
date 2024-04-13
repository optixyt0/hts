import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
    return (
        <div className="home">
            <h1>Welcome to Video Conference</h1>
            <Link to="/create">Create a Room</Link>
            <Link to="/join">Join a Room</Link>
        </div>
    );
}

export default Home;