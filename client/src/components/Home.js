import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <h1 className="text-4xl font-bold text-blue-600 mb-6">Welcome to Video Conference</h1>
            <div className="space-x-4">
                <Link to="/create" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                    Create a Room
                </Link>
                <Link to="/join" className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
                    Join a Room
                </Link>
            </div>
        </div>
    );
}

export default Home;
