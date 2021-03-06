import React from "react";
import { render } from "react-dom";
import { Client } from "boardgame.io/react";
import { SocketIO } from 'boardgame.io/multiplayer';
import BreadsticksGame from "./Game";
import Board from "./Board";
import { useLocation } from "react-router-dom";

const Play = () => {

  const {state} = useLocation();
  const { room, id, size} = state; // Read values passed on state 

  const BreadsticksClient = Client({
    game: BreadsticksGame,
    board: Board,
    multiplayer: SocketIO({ server: 'localhost:8000' }),
    numPlayers: size,
    debug: {
      collapseOnLoad: true,
      hideToggleButton: true
    }
  });

  return (
    <div>
      <BreadsticksClient matchID={room} playerID={id.toString()} />
    </div>
  )
};

export default Play;