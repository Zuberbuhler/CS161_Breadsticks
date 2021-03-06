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

  // gives random guest account
  if (username === "") {
    setUsername("guest" + Math.floor((Math.random() * 100000) + 1));
  }

  /* 
  checks if the user is logged in. If they aren't, they
  are sent back to the landing page
  
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
  */

  // navigation function
  const back = async () => {
    navigate('/Dashboard');
  }

  // when a user joins a room
  const joinRoom = () => {
    if (username !== "" && room !== "") {
      socket.emit("join_room", {username, room});
      setShowChat(true);
    }
    else {
      alert("Please enter a room ID");
    }
  };

  /* 
  The client requests the list of rooms and the server
  responds. The latter is what this function listens for.
  */
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

  // sends a request to the server for a list of active rooms
  const getActiveRooms = () => {
    socket.emit("get_rooms");
  };

  return (
    <body>
      {!showChat ? (
        <div className="joinChatContainer">
          <h3>{username}</h3>
          <input
            type="text"
            placeholder="Room ID..."
            onChange={(event) => {
              setRoom(event.target.value);
            }}
          />
          <button class="button-5" type='submit' onClick={joinRoom}>Join</button>
          <button class="button-5" onClick={getActiveRooms}>Refresh Active Rooms</button>
          <h1>{rooms}</h1>
          <button class="button-5" onClick={back}> Back to Dashboard </button>
        </div>
        
      ) : (
        <body>
          <Chat socket={socket} username={username} room={room} setShowChat={setShowChat} />
        </body>
        
      )}
    </body>
  )
}

Rooms.defaultProps = {
  userName: 'User123',
}

export default Rooms