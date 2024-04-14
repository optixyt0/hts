import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import io from 'socket.io-client';
import Peer from 'simple-peer';
import './Room.css';  // Assuming styles are defined in Room.css

const Room = () => {
    const { id: roomId } = useParams();
    const [peers, setPeers] = useState([]);
    const socketRef = useRef();
    const userVideo = useRef();
    const peersRef = useRef([]);

    useEffect(() => {
        socketRef.current = io.connect("/");
        navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then(stream => {
            userVideo.current.srcObject = stream;
            socketRef.current.emit("join-room", roomId, socketRef.current.id);

            socketRef.current.on("all-users", users => {
                const peers = [];
                users.forEach(userID => {
                    const peer = createPeer(userID, socketRef.current.id, stream);
                    peersRef.current.push({
                        peerID: userID,
                        peer,
                    });
                    peers.push(peer);
                });
                setPeers(peers);
            });

            socketRef.current.on("user-joined", payload => {
                const peer = addPeer(payload.signal, payload.callerID, stream);
                peersRef.current.push({
                    peerID: payload.callerID,
                    peer,
                });

                setPeers(users => [...users, peer]);
            });

            socketRef.current.on("receiving-returned-signal", payload => {
                const item = peersRef.current.find(p => p.peerID === payload.callerID);
                item.peer.signal(payload.signal);
            });
        });

        return () => {
            socketRef.current.disconnect();
        };
    }, [roomId]);

    function createPeer(userToSignal, callerID, stream) {
        const peer = new Peer({
            initiator: true,
            trickle: false,
            stream,
        });

        peer.on("signal", signal => {
            socketRef.current.emit("sending-signal", { userToSignal, callerID, signal });
        });

        return peer;
    }

    function addPeer(incomingSignal, callerID, stream) {
        const peer = new Peer({
            initiator: false,
            trickle: false,
            stream,
        });

        peer.on("signal", signal => {
            socketRef.current.emit("returning-signal", { callerID, signal });
        });

        peer.signal(incomingSignal);

        return peer;
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <h1 className="text-3xl font-semibold mb-4">Room: {roomId}</h1>
            <div className="flex flex-wrap justify-center">
                <div className="video-container">
                    <video playsInline muted ref={userVideo} autoPlay className="video" />
                </div>
                {peers.map((peer, index) => (
                    <Video key={index} peer={peer} />
                ))}
            </div>
        </div>
    );
};

const Video = ({ peer }) => {
    const ref = useRef();

    useEffect(() => {
        peer.on("stream", stream => {
            ref.current.srcObject = stream;
        });
    }, [peer]);

    return (
        <div className="video-container">
            <video playsInline autoPlay ref={ref} className="video" />
        </div>
    );
};

export default Room;
