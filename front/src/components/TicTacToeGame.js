import React from "react";
import { render } from "react-dom";
import { Client } from "boardgame.io/react";
import TicTacToe from "./Game";
import Board from "./Board";

const TicTacToeGame = Client({
    game: TicTacToe,
    board: Board
});

export default TicTacToeGame;