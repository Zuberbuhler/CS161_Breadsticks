import { useState } from "react";
import PropTypes from 'prop-types'
import Chat from './Chat'
import { 
  useNavigate,
} from "react-router-dom";

import io from "socket.io-client";

/* ---------------------------------------------------------- */

const socket = io.connect("http://localhost:3001");

const Rooms = () => {

  const [username, setUsername] = useState("xd");
  const [room, setRoom] = useState("");
  const [showChat, setShowChat] = useState(false);

  let navigate = useNavigate();

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