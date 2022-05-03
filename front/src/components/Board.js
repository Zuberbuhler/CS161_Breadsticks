import React from 'react';
import PropTypes from 'prop-types';
import './Board.css';
import BreadsticksGame from "./Game";
import { bfsMoveFinder } from "./Game";
import { numToType } from "./Game";

function Board({ ctx, G, moves }) {
  const onClick = (id) => {
    if (bfsMoveFinder(G.tileEdges, G.playerPositions[ctx.currentPlayer], G.dieRoll).includes(id)) {
      moves.clickCell(id);
      document.getElementById(id).style.backgroundSize = "0 0";
    }
    else console.log("Cant go there " + id);
  };
  const onDiceClick = () => {
    moves.rollDie();
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
    border: '0px solid #555',
    width: '50px',
    height: '45px',
    background: 'none',
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

  var nathanTestImage = new Image();
  nathanTestImage.src = "url(\"../graphics/nathan.jpg\")";

  for (let i = 0; i < 13; i++) {
    let cells = [];
    for (let j = 0; j < 13; j++) {
      const id = 13 * i + j;
      switch (G.tiles[id]) {
        case 0: 
        default:  //start tiles and undefined tiles
          cells.push(
            <basictile key={id} id={id} class = "start">
              <button name={id} style={tileStyle} onClick={() => onClick(id)}></button>
            </basictile>
          );
          break;
        case 1: // normal point gain tile
          cells.push(
            <pointgaintile key={id} id={id} class = "pointgain">
              <button name={id} style={tileStyle} onClick={() => onClick(id)}></button>
            </pointgaintile>
          );
          break;
        case 2: //normal point loss tile
          cells.push(
            <pointlosstile key={id} id={id} class = "pointloss">
              <button name={id} style={tileStyle} onClick={() => onClick(id)}></button>
            </pointlosstile>
          );
          break;
        case 3: //super point gain tile
          cells.push(
            <supergaintile key={id} id={id} class = "supergain">
              <button name={id}  style={tileStyle} onClick={() => onClick(id)}></button>
            </supergaintile>
          );
          break;
        case 4: //super point loss tile
          cells.push(
            <superlosstile key={id} id={id} class = "superloss">
              <button name={id}  style={tileStyle} onClick={() => onClick(id)}></button>
            </superlosstile>
          );
          break;
        case 5: //basic question tile
          cells.push(
            <basictile key={id} id={id} class = "basic">
              <button name={id}  style={tileStyle} onClick={() => onClick(id)}></button>
            </basictile>
          );
          break;
        case 6: //high or low question tile
          cells.push(
            <highlowtile key={id} id={id} class = "highlow">
                <button name={id}  style={tileStyle} onClick={() => onClick(id)}></button>
            </highlowtile>
          );
          break;
        case 7: // versus question tile
          cells.push(
            <versustile key={id} id={id} class = "versus">
              <button name={id}  style={tileStyle} onClick={() => onClick(id)}></button>
            </versustile>
          );
          break;
        case 8: // image/video question tile
          cells.push(
            <questionimagetile key={id} id={id} class = "imageQuestion">
              <button name={id}  style={tileStyle} onClick={() => onClick(id)}></button>
            </questionimagetile>
          );
          break;
      }
    }
    tbody.push(<tr key={i}>{cells}</tr>);
  }

  for(var ind = 0; (G.dieRoll !== 0) && ind < G.movements.length; ind++)
  {
    if(document.getElementById(ind) !== null)
    {
      console.log(document.getElementById(G.movements[ind]));
      document.getElementById(G.movements[ind]).style.backgroundSize = "0 0";
      console.log("found movement: " + G.movements[ind]);
    }
    else if(document.getElementById(ind) !== null){
      //document.getElementById(ind).style.backgroundSize = "1 1";
    }
  }
  let scoreAndOptions = [];
  scoreAndOptions.push(<tile>
    {
      <button style={diceButton} onClick={() => onDiceClick()}>{"Dice:" + G.dieRoll}</button>
    }
  </tile>);



  return (
    <div id="parent">
      <table id="board">
        <tbody>{tbody}</tbody>
      </table>
      {winner}
      <div id="scores">
        <p>{"Player 0:" + G.scores[0]} </p>
        <p>{"Player 1:" + G.scores[1]} </p>
        <p>{"Player 2:" + G.scores[2]} </p>
        <p>{"Player 3:" + G.scores[3]} </p>
        <p>{"Player " + (ctx.currentPlayer) + " Turn"}</p>
        <tbody>{scoreAndOptions}</tbody></div>
    </div>
  );
}
export default Board;