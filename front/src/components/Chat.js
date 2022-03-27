import React, { useEffect, useState } from "react";
import ScrollToBottom from "react-scroll-to-bottom"; 
import { Client } from "boardgame.io/react";
import { SocketIO } from 'boardgame.io/multiplayer';
import BreadsticksGame from "./Game";
import Board from "./Board";
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

  // which player: 1,2,3, or 4, is ths current player?
  const my_player_number = () => {
    console.log(users);
    let player_number = -1;
    for (var i = 0; i < users.length; i++) { 
      if (users[i] === username) {
        player_number = i;
        break;
      }
    }
    return player_number;
  };

  /* signals to the server that the game is starting,
    navigates the host to the room (the serve handles 
    navigating the others) */
  const startGame = () => {
    // create a game object here

    const BreadsticksClient = Client({
      game: BreadsticksGame,
      matchID: room,
      board: Board,
      multiplayer: SocketIO({ server: 'localhost:8000' }),
      numPlayers: users.length,
    }); 
    
    socket.emit("host_started_game", {room});
    console.log("navigating host");

    navigate("/Play", { state: { room: room, id: my_player_number()}});
  };

  const printUsers = () => {
    console.log(users);
    console.log("My current number is: ", my_player_number());
  };

  socket.once("start_game", ({room}) => {
    console.log("navigating NOT host");
    console.log(my_player_number());
    navigate("/Play", { state: { room: room, id: my_player_number()} });
  });

  /* navigates players to the game if they AREN'T the host 
  useEffect(() => {
    socket.on("start_game", () => {
      console.log("navigating NOT host");
    });
  }, [socket]); */
  

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
      setUsers(y);
      //console.log(comma_separated);
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
        <button class="button-5" onClick={printUsers}> Console Log Users </button>
        <h3>Users: {clients}</h3>
      </div>
    </div>
  );
}

export default Chat;
