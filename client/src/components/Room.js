import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import io from 'socket.io-client';
import Peer from 'simple-peer';

const Room = () => {
  const { id: roomId } = useParams();
  const socketRef = useRef();
  const userVideo = useRef();
  const peersRef = useRef([]);
  const [peers, setPeers] = useState([]);

  useEffect(() => {
    socketRef.current = io.connect("/");
    navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then(stream => {
      userVideo.current.srcObject = stream;

      socketRef.current.emit("join-room", roomId, socketRef.current.id);

      socketRef.current.on("user-connected", userId => {
        const peer = createPeer(userId, socketRef.current.id, stream);
        peersRef.current.push({
          peerID: userId,
          peer,
        });
        setPeers(users => [...users, peer]);
      });

      socketRef.current.on("user-disconnected", userId => {
        const peerObj = peersRef.current.find(p => p.peerID === userId);
        if (peerObj) {
          peerObj.peer.destroy();
        }
        peersRef.current = peersRef.current.filter(p => p.peerID !== userId);
        setPeers(users => users.filter(p => p.peerID !== userId));
      });

      socketRef.current.on("signal", (fromId, signal) => {
        const peerObj = peersRef.current.find(p => p.peerID === fromId);
        if (peerObj) {
          peerObj.peer.signal(signal);
        }
      });
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, [roomId]);

  function createPeer(userId, callerID, stream) {
    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream,
    });

    peer.on("signal", signal => {
      socketRef.current.emit("signal", userId, signal);
    });

    return peer;
  }

  return (
    <div>
      <h1>Room ID: {roomId}</h1>
      <video playsInline muted ref={userVideo} autoPlay style={{ width: "300px" }} />
      {peers.map((peer, index) => {
        return <Video key={index} peer={peer} />;
      })}
    </div>
  );
};

const Video = ({ peer }) => {
  const ref = useRef();

  useEffect(() => {
    peer.on("stream", stream => {
      ref.current.srcObject = stream;
    });
  }, []);

  return <video playsInline autoPlay ref={ref} style={{ width: "300px" }} />;
};

export default Room;
