import React from 'react';
import PropTypes from 'prop-types';
import './Board.css';
import BreadsticksGame from "./Game";
import { bfsMoveFinder } from "./Game";
import { numToType } from "./Game";

function Board({ ctx, G, moves }) {
  const onClick = (id) => 
  {
    if (bfsMoveFinder(G.tileEdges, G.playerPositions[ctx.currentPlayer], G.dieRoll).includes(id)) {
      moves.clickCell(id) 
    }
    else console.log("Cant go there " + id);
  };
  const onDiceClick = () =>
  {
    moves.rollDie()
  }

  let winner = '';
  if (ctx.gameover) {
    winner =
      ctx.gameover.winner !== undefined ? (
        <div id="winner">Game Over! Winner: {ctx.gameover.winner}</div>
      ) : (
        <div id="winner">Draw!</div>
      );
  }

  const tileStyle = {
    border: '1px solid #555',
    width: '50px',
    height: '50px',
    lineHeight: '50px',
    textAlign: 'center',
    background: '#fff',
  };

  const diceButton = {
    border: '1px solid #555',
    width: '100px',
    height: '100px',
    lineHeight: '100px',
    textAlign: 'center',
    cursor: 'pointer',
    background: '#eeffe9',
  };

  let tbody = [];
  for (let i = 0; i < 7; i++) {
    let cells = [];
    for (let j = 0; j < 7; j++) {
      const id = 7 * i + j;
      cells.push(
        <tile key={id}>
          {
            //<img name="jsbutton" src = "../graphics/GameTiles1.png" width="50" height="50" border="0" alt="Game Tile" onClick={() => onClick(id)}></img>
            <button class="tile" style={tileStyle} onClick={() => onClick(id)}>
              {
                "N:" + id + "T:" + G.tiles[id]
                //G.playerPositions.includes(id)  ? "Tile:" + G.cells[id] + " Players:" + G.playerPositions.filter(x => id === x).toString() : "Tile:" + G.cells[id]
              }
            </button>
          }
        </tile>
      );
      
    }
    tbody.push(<tr key={i}>{cells}</tr>);
  }

  let scoreAndOptions = [];
  scoreAndOptions.push(<tile>
    {
      <button style={diceButton} onClick={() => onDiceClick() }>{ "Dice:" +  G.dieRoll }</button>
    }
  </tile>);

  return (
    <div id = "parent">
        <table id="board">
          <tbody>{tbody}</tbody>
        </table>
      {winner}
      <div id="scores">
        <p>{"Player 0:" + G.scores[0]} </p>
        <p>{"Player 1:" + G.scores[1]} </p>
        <p>{"Player 2:" + G.scores[2]} </p>
        <p>{"Player 3:" + G.scores[3]} </p>
        <p>{ "Player " + (ctx.currentPlayer) + "Turn"}</p>
        <tbody>{scoreAndOptions}</tbody></div>
    </div>
  );
}
export default Board;