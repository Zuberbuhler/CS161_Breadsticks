import React, { useEffect, useState } from "react";
import PropTypes from 'prop-types'
import Chat from './Chat'
import { 
  useNavigate,
} from "react-router-dom";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  getAuth,
  signOut,
} from "firebase/auth";
import io from "socket.io-client";

/* ---------------------------------------------------------- */

const socket = io.connect("http://localhost:3001");

const Rooms = () => {

  const auth = getAuth();
  let navigate = useNavigate();

  const [user, setUser] = useState({});
  const [username, setUsername] = useState("");
  const [room, setRoom] = useState("");
  const [rooms, setRooms] = useState([]);
  const [showChat, setShowChat] = useState(false);

  onAuthStateChanged(auth, (currentUser) => {
    if (currentUser) {
        setUser(currentUser)
        const email = user?.email || '';
        let name = email.substring(0, email.indexOf('@'));
        setUsername(name);
    }
    else {
      navigate('/');
    }
  });

  const back = async () => {
    navigate('/Dashboard');
  }

  const joinRoom = () => {
    if (username !== "" && room !== "") {
      socket.emit("join_room", {username, room});
      setShowChat(true);
    }
  };

  useEffect(() => {
    socket.on("rooms_list", (list) => {
      if (list.length == 0) {
        setRooms(["no rooms!"])
      }
      else {
        setRooms(list);
        console.log(list);
      }
    });
  }, [socket]);

  const getActiveRooms = () => {
    socket.emit("get_rooms");
  };

  return (
    <div>
      {!showChat ? (
        <div className="joinChatContainer">
          <h3>Join A Room, {username}</h3>
          <input
            type="text"
            placeholder="Room ID..."
            onChange={(event) => {
              setRoom(event.target.value);
            }}
          />
          <button type='submit' onClick={joinRoom}>Join</button>
          <button onClick={getActiveRooms}>Refresh Active Rooms</button>
          <h1>{rooms}</h1>
          <button onClick={back}> Back to Dashboard </button> 
        </div>
        
      ) : (
        <div>
          <Chat socket={socket} username={username} room={room} setShowChat={setShowChat} />
        </div>
        
      )}
    </div>
  )
}

Rooms.defaultProps = {
  userName: 'User123',
}

export default Rooms