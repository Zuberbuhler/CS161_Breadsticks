import React from "react";
import { render } from "react-dom";
import { Client } from "boardgame.io/react";
import { SocketIO } from 'boardgame.io/multiplayer';
import BreadsticksGame from "./Game";
import Board from "./Board";

const BreadsticksClient = Client({
    game: BreadsticksGame,
    board: Board,
    multiplayer: SocketIO({ server: 'localhost:8000' }),
    numPlayers: 4,
});

const GameDisplay = () => (
    <div>
    Player 0
    <BreadsticksClient playerID="0" />
    <br />
    Player 1
    <BreadsticksClient playerID="1" />
    <br />
    Player 2
    <BreadsticksClient playerID="2" />
    <br />
    Player 3
    <BreadsticksClient playerID="3" />
  </div>
);

export default GameDisplay;