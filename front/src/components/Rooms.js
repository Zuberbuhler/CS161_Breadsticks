import { useState } from "react";
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
  const [username, setUsername] = useState("");
  const [room, setRoom] = useState("");
  const [showChat, setShowChat] = useState(false);
  const [user, setUser] = useState({});

  let navigate = useNavigate();

  onAuthStateChanged(auth, (currentUser) => {
    if (currentUser) {
        setUser(currentUser)
        var str = user?.email;
        str = str.substring(0, str.indexOf('@'));
        setUsername(str)
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
          <button onClick={back}> Back to Dashboard </button> 
        </div>
        
      ) : (
        <Chat socket={socket} username={username} room={room} setShowChat={setShowChat} />
      )}
    </div>
  )
}

Rooms.defaultProps = {
  userName: 'User123',
}

export default Rooms