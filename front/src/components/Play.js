import React from "react";
import { render } from "react-dom";
import { Client } from "boardgame.io/react";
import { SocketIO } from 'boardgame.io/multiplayer';
import BreadsticksGame from "./Game";
import Board from "./Board";
import { useLocation } from "react-router-dom";

const BreadsticksClient = Client({
    game: BreadsticksGame,
    board: Board,
    multiplayer: SocketIO({ server: 'localhost:8000' }),
    numPlayers: 2,
});

const Play = () => {

  const {state} = useLocation();
  const { room, id,} = state; // Read values passed on state 

  return (
    <div>
      <p>room number: {room} </p>
      <p>MY PLAYER NUMBER IS {id.toString()}</p>
      <BreadsticksClient matchID={room} playerID={id.toString()} />
    </div>
  )
};

export default Play;