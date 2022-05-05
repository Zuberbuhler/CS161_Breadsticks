import React from 'react';
import PropTypes from 'prop-types';
import './Board.css';
import BreadsticksGame from "./Game";
import { Queue, bfsMoveFinder } from "./Queue";
import { numToType } from "./Game";

function Board({ ctx, G, moves }) {
  
  // handles when a player clicks a tile to move to
  const onClick = (id) => {
    if (bfsMoveFinder(G.tileEdges, G.playerPositions[ctx.currentPlayer], G.dieRoll).includes(id)) {
      moves.clickCell(id);
    }
    else console.log("Can't go to " + id);
  };

  // handles when a player clicks the die to roll
  const onDiceClick = () => {
    moves.rollDie();
  }
  
  // Handles game over
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
    height: '50px',
    lineHeight: '50px',
    background: 'none',
  };

  const highlightedTile = {
    border: '8px solid yellow',
  };
  
  const playerStyle = {
    border: '4px solid gold',
    width: '45px',
    height: '45px',
    position: 'absolute',
    background: 'none',
    pointerEvents: 'none',
  };

  // returns a DIV of stacked icons on the current tile
  function Icons(props) {
    let playersPresent = props.players; //[1]

    let icons = [<img src="PlayerIcons1.png" style={playerStyle}/>, 
            <img src="PlayerIcons2.png" style={playerStyle}/>,
            <img src="PlayerIcons3.png" style={playerStyle}/>,
            <img src="PlayerIcons4.png" style={playerStyle}/>];

    return (
      <div>
        {playersPresent[0]
          ? icons[0]
          : (null)
        }
        {playersPresent[1]
          ? icons[1]
          : (null)
        }
        {playersPresent[2]
          ? icons[2]
          : (null)
        }
        {playersPresent[3]
          ? icons[3]
          : (null)
        }
      </div>
    );
  }

  // helper method for Tile()
  function TileButton(props) {
    let id = props.id;
    let highlight = props.highlight;
    if (highlight) {
      console.log("id: ",id);
      return <button name={id} style={{...tileStyle, ...highlightedTile}} onClick={() => onClick(id)}></button>
    }
    else {
      return <button name={id} style={tileStyle} onClick={() => onClick(id)}></button>
    }
  }

  // returns the HTML for a Tile
  function Tile(props) {
    let type = props.type;
    let players = props.players; // one hot encoding[1]
    let id = props.id; // 1 through 168
    let highlight = props.highlight;

    switch (type) {
      case 0: return <basictile key={id} id={id} class = "start">
        <Icons players={players}/> 
        <TileButton id={id} highlight={highlight} />
        </basictile>;
      case 1: 
        return <pointgaintile key={id} id={id} class = "pointgain">
          <Icons players={players}/>    
          <TileButton id={id} highlight={highlight} />
        </pointgaintile>;
      case 2: return <pointlosstile key={id} id={id} class = "pointloss">
        <Icons players={players}/>
        <TileButton id={id} highlight={highlight}/>
        </pointlosstile>;
      case 3: return <supergaintile key={id} id={id} class = "pointgain">
        <Icons players={players}/>   
        <TileButton id={id} highlight={highlight}/>
        </supergaintile>;
      case 4: return <superlosstile key={id} id={id} class = "pointgain">
        <Icons players={players}/>   
        <TileButton id={id} highlight={highlight}/>
        </superlosstile>;
      case 5: return <versustile key={id} id={id} class = "versus">
        <Icons players={players}/>   
        <TileButton id={id} highlight={highlight}/>
        </versustile>;
      default: return <basictile key={id} id={id} class = "basic">
        <Icons players={players}/>   
        <TileButton id={id} highlight={highlight}/>
        </basictile>;
    }
  }

  // helper method for building the board
  function OneHotEncodingCurrentPlayersOnTile(id) {
    let onehot = [false, false, false, false];
    for (let i = 0; i < G.playerPositions.length; i++) {
      if (id === G.playerPositions[0]) {
        onehot[0] = true;
      }
      if (id === G.playerPositions[1]) {
        onehot[1] = true;
      }
      if (id === G.playerPositions[2]) {
        onehot[2] = true;
      }
      if (id === G.playerPositions[3]) {
        onehot[3] = true;
      }
    }
    return onehot;
  }

  // BUILD THE BOARD
  let tbody = [];
  for (let i = 0; i < 13; i++) {
    let cells = [];
    for (let j = 0; j < 13; j++) {
      const id = 13 * i + j; // current cell
      let highlight = false;
      if (G.movements.includes(id)) {
        console.log("movement: ", G.movements);
        highlight = true;
      }
      let onehot = OneHotEncodingCurrentPlayersOnTile(id);
      cells.push(<Tile type={G.tiles[id]} id={id} players={onehot} highlight={highlight}/>);
    }
    tbody.push(<tr key={i}>{cells}</tr>);
  }

  const diceButton = {
    border: '1px solid #555',
    width: '100px',
    height: '100px',
    lineHeight: '100px',
    textAlign: 'center',
    cursor: 'pointer',
    background: '#eeffe9',
  };

  let scoreAndOptions = [];
  scoreAndOptions.push(
  <tile>
    {
    <button style={diceButton} onClick={() => onDiceClick()}>{"Dice:" + G.dieRoll}</button>
    }
  </tile>);

  const PlayerScoreStyle = {
    border: '3px solid #555',
    width: '60px',
    height: '60px',
    position: 'relative',
    background: 'white',
    pointerEvents: 'none',
    marginLeft: '30px',
    marginRight: '20px',
  };

  const CurrentlyUpPlayerStyle = {
    border: '8px solid #555',
    width: '100px',
    height: '100px',
    position: 'relative',
    background: 'white',
    pointerEvents: 'none',
    marginLeft: '20px',
  };

  let bigIcons = [<img src="PlayerIcons1.png" style={CurrentlyUpPlayerStyle}/>, 
  <img src="PlayerIcons2.png" style={CurrentlyUpPlayerStyle}/>,
  <img src="PlayerIcons3.png" style={CurrentlyUpPlayerStyle}/>,
  <img src="PlayerIcons4.png" style={CurrentlyUpPlayerStyle}/>];

  let icons = [<img src="PlayerIcons1.png" style={PlayerScoreStyle}/>, 
  <img src="PlayerIcons2.png" style={PlayerScoreStyle}/>,
  <img src="PlayerIcons3.png" style={PlayerScoreStyle}/>,
  <img src="PlayerIcons4.png" style={PlayerScoreStyle}/>];
  
  return (
    <div id="parent">
      <table id="board">
        <tbody>{tbody}</tbody>
      </table>

      {winner}

      <div id="scores">
        <p>
          {ctx.numPlayers > 0 ? icons[0] : (null)}
          {G.scores[0]}
        </p>
        <p>
          {ctx.numPlayers > 1 ? icons[1] : (null)}
          {G.scores[1]} 
        </p>
        <p>
          {ctx.numPlayers > 2 ? icons[2] : (null)}
          {G.scores[2]} 
        </p>
        <p>
          {ctx.numPlayers > 3 ? icons[3] : (null)}
          {G.scores[3]} 
        </p>
        <p>Currently Up:</p>
        {bigIcons[ctx.currentPlayer]}
        <p>{"Player " + (ctx.currentPlayer) + "'s Turn"}</p>
        <div>{scoreAndOptions}</div>
      </div>
    </div>
  );
}
export default Board;