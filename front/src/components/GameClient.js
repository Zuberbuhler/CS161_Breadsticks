import React from "react";
import { render } from "react-dom";
import { Client } from "boardgame.io/react";
import { SocketIO } from 'boardgame.io/multiplayer';
import TicTacToe from "./Game";
import Board from "./Board";

const TicTacToeClient = Client({
    game: TicTacToe,
    board: Board,
    multiplayer: SocketIO({ server: 'localhost:8000' })
});

const GameDisplay = () => (
    <div>
    Player 0
    <TicTacToeClient playerID="0" />
    <br />
    Player 1
    <TicTacToeClient playerID="1" />
  </div>
);

export default GameDisplay;