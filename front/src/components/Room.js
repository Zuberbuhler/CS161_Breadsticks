import React from 'react'
import {useState, useRef, useEffect} from 'react'
import TextField from '@material-ui/core/TextField'
import "./App.css"
import { 
  useNavigate,
} from "react-router-dom";
import Chat from "./Chat"
import io from "socket.io-client";
const socket = io.connect("http://localhost:3001");

socket.emit("join_room", "room");

const Room = () => {
  
  const [username, setUsername] = useState("");
  const [room, setRoom] = useState("");
  const [showChat, setShowChat] = useState(false);

  let navigate = useNavigate();

  const goBack = async () => {
    navigate('/Dashboard');
  }

  const joinRoom = () => {
    if (username !== "" && room !== "") {
      socket.emit("join_room", room);
      setShowChat(true);
    }
  };

    // setUsers([...users, {username: "User4"}])
  return (
    <div className='App'>
        {!showChat ? (
        <div className="joinChatContainer">
          <h2>Join A Chat</h2>
          <input
            type="text"
            placeholder="John..."
            onChange={(event) => {
              setUsername(event.target.value);
            }}
          />
          <input
            type="text"
            placeholder="Room ID..."
            onChange={(event) => {
              setRoom(event.target.value);
            }}
          />
          <button type='submit' onClick={joinRoom}>Join A Room</button>
        </div>
      ) : (
        <Chat socket={socket} username={username} room={room} />
      )}

    <button onClick={goBack}> Back to Dashboard </button>

    </div>
)}

export default Room