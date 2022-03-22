import React from 'react';
import PropTypes from 'prop-types';
import './Board.css';
import BreadsticksGame from "./Game";

function Board({ ctx, G, moves }) {
  const onClick = (id) => 
  {
    if(!G.playerPositions.includes(id))
    moves.clickCell(id) 
  };
  const onDiceClick = (id) =>
  {
    moves.rollDie(id)
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

  const cellStyle = {
    border: '1px solid #555',
    width: '100px',
    height: '100px',
    lineHeight: '100px',
    textAlign: 'center',
  };

  let tbody = [];
  for (let i = 0; i < 3; i++) {
    let cells = [];
    for (let j = 0; j < 3; j++) {
      const id = 3 * i + j;
      cells.push(
        <td key={id}>
          {
            <button style={cellStyle} onClick={() => onClick(id)}>
              {
                G.playerPositions.indexOf(id) !== -1 ? "Tile:" + G.cells[id] + " Player:" + G.playerPositions.indexOf(id) : "Tile:" + G.cells[id]
              }
            </button>
          }
        </td>
      );
    }
    tbody.push(<tr key={i}>{cells}</tr>);
  }

  tbody.push(<td key={10}>
    {
      <button style={cellStyle} onClick={() => onDiceClick(10) }>{ "Dice:" +  G.dieRoll }</button>
    }
  </td>);

  return (
    <div>
      <table id="board">
        <tbody>{tbody}</tbody>
      </table>
      {winner}
    </div>
  );
}
export default Board;