import React, { useEffect, useState } from "react";
import ScrollToBottom from "react-scroll-to-bottom"; 

import { 
    useNavigate,
  } from "react-router-dom";

/* ---------------------------------------------------------- */

function Chat({socket, username, room, setShowChat}) {
  const [currentMessage, setCurrentMessage] = useState("");
  const [messageList, setMessageList] = useState([]);
  const [clients, setClients] = useState([]);
  const [users, setUsers] = useState([]);

  let navigate = useNavigate();

  const leaveRoom = () => {
    socket.emit("leave_room", {username, room});
    setShowChat(false);
    navigate('/Rooms');
  };

  const sendMessage = async () => {
    if (currentMessage !== "") {
      const messageData = {
        room: room,
        author: username,
        message: currentMessage,
        time:
          new Date(Date.now()).getHours() +
          ":" +
          new Date(Date.now()).getMinutes(),
      };

      await socket.emit("send_message", messageData);
      setMessageList((list) => [...list, messageData]);
      setCurrentMessage("");
    }
  };

  const startGame = () => {
    socket.emit("host_started_game", {room});
    // navigates the host to the game
    navigate("/Play"); 
  }

  useEffect(() => {
    socket.on("start_game", () => {
      navigate("/Play");
    });
  }, [socket]);

  /* Chat updates every time a message is recieved */
  useEffect(() => {
    socket.on("receive_message", (data) => {
      setMessageList((list) => [...list, data]);
    });
  }, [socket]);

  useEffect(() => {
    socket.on("update_clients", ({y}) => {
      let comma_separated = y.join(", ");
      setClients(comma_separated);
      console.log(comma_separated);
    });
  }, [socket]);

  return (
    <div className="chat-window">
      <div className="chat-header">
        <p>Room {room}</p>
      </div>
      <div className="chat-body">
        <ScrollToBottom className="message-container">
          {messageList.map((messageContent) => {
            return (
              <div
                className="message"
                id={username === messageContent.author ? "you" : "other"}
              >
                <div>
                  <div className="message-content">
                    <p>{messageContent.message}</p>
                  </div>
                  <div className="message-meta">
                    <p id="time">{messageContent.time}</p>
                    <p id="author">{messageContent.author}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </ScrollToBottom>
      </div>
      <div className="chat-footer">
        <input
          type="text"
          value={currentMessage}
          placeholder="Hey..."
          onChange={(event) => {
            setCurrentMessage(event.target.value);
          }}
          onKeyPress={(event) => {
            event.key === "Enter" && sendMessage();
          }}
        />
        <button onClick={sendMessage}>&#9658;</button>
      </div>
      <br></br>
      <div>
        <button class="button-5" onClick={leaveRoom}> Leave Room </button>
        <button class="button-5" onClick={startGame}> Start Game </button>
        <h3>Users: {clients}</h3>
      </div>
    </div>
  );
}

export default Chat;
