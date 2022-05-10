import React from 'react';
import PropTypes from 'prop-types';
import './Board.css';
import BreadsticksGame from "./Game";
import {bfsMoveFinder} from  "./Queue"

var timeoutObj = null;

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

  const onAnswerClick = (id) => {
    console.log("Player Clicked Answer " + id);
    //G.playerAnswers[c] = id;
    document.getElementById('ans1').style.background = 'red'; 
    document.getElementById('ans2').style.background = 'red'; 
    document.getElementById('ans3').style.background = 'red'; 
    document.getElementById('correct').style.background = 'green';
  
    //console.log(ctx.activePlayers);

    let numPlayers = 0;
    for (const x in ctx.activePlayers) {
      numPlayers += 1;
    }
    if (numPlayers === 1) {
      setTimeout(() => { moves.answer(id); }, 1500);
    }
    else {
      moves.answer(id);
    }
  };

  const returnToGame = () => {
    console.log("Go back");
    moves.answer(5);
  };

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
    border: '8px solid black',
    cursor: "pointer"
  };

  const playerStyle = {
    border: '4px solid gold',
    width: '45px',
    height: '45px',
    position: 'absolute',
    background: 'none',
    pointerEvents: 'none',
  };

  const arrowStyle =
  {
    border: '0px solid gold',
    width: '50px',
    height: '50px',
    lineHeight: '50px',
  }

  function spriteName(id) {
    switch (id) {
      case "0":
        return "Racoon";
      case "1":
        return "Macaw";
      case "2":
        return "Chicken";
      case "3":
        return "Charmeleon";
    }
  }

  // returns a DIV of stacked icons on the current tile
  function Icons(props) {
    let playersPresent = props.players; //[1]

    let icons = [<img src="PlayerIcons1.png" style={playerStyle} />,
    <img src="PlayerIcons2.png" style={playerStyle} />,
    <img src="PlayerIcons3.png" style={playerStyle} />,
    <img src="PlayerIcons4.png" style={playerStyle} />];

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
      //console.log("id: ",id);
      return <button name={id} style={{ ...tileStyle, ...highlightedTile }} onClick={() => onClick(id)}></button>
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
      case 0: return <basictile key={id} id={id} class="start">
        <Icons players={players} />
        <TileButton id={id} highlight={highlight} />
      </basictile>;
      case 1:
        return <pointgaintile key={id} id={id} class="pointgain">
          <Icons players={players} />
          <TileButton id={id} highlight={highlight} />
        </pointgaintile>;
      case 2: return <pointlosstile key={id} id={id} class="pointloss">
        <Icons players={players} />
        <TileButton id={id} highlight={highlight} />
      </pointlosstile>;
      case 3: return <supergaintile key={id} id={id} class="supergain">
        <Icons players={players} />
        <TileButton id={id} highlight={highlight} />
      </supergaintile>;
      case 4: return <superlosstile key={id} id={id} class="superloss">
        <Icons players={players} />
        <TileButton id={id} highlight={highlight} />
      </superlosstile>;
      case 5: return <versustile key={id} id={id} class="versus">
        <Icons players={players} />
        <TileButton id={id} highlight={highlight} />
      </versustile>;
      case 6:
      default: return <versustile key={id} id={id} class="versus">
      <Icons players={players} />
      <TileButton id={id} highlight={highlight} />
      </versustile>;
    }
  }

  function PathArrow(props) {
    let type = props.type;
    switch (type) {
      case 1: return <arrowrighttile class="right" style={arrowStyle} />
      case 2: return <arrowuptile class="up" style={arrowStyle} />
      case 3: return <arrowlefttile class="left" style={arrowStyle} />
      case 4: return <arrowdowntile class="down" style={arrowStyle} />
      default: return <emptytile class="empty" style={arrowStyle} />
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
  var squareSize = Math.sqrt(G.tiles.length); // the length of the actual tiles, not the visual board
  for (let i = 0; i < squareSize * 2 - 1; i++) {
    let cells = [];
    for (let j = 0; j < squareSize; j++) {
      const id = squareSize * (i / 2) + j; // current cell
      let highlight = false;
      if (G.movements.includes(id)) {
        //console.log("movement: ", G.movements);
        highlight = true;
      }
      let onehot = OneHotEncodingCurrentPlayersOnTile(id);
      cells.push(<Tile type={G.tiles[id]} id={id} players={onehot} highlight={highlight} />);
      if (j + 1 < squareSize) {
        cells.push(<PathArrow type={G.pathTiles[i][j]} />);
      }
    }
    tbody.push(<tr key={i}>{cells}</tr>);

    // places arrows on the board
    let cells2 = [];
    i++;
    if (i < squareSize * 2 - 1) {
      for (let j = 0; j < squareSize; j++) {
        cells2.push(<PathArrow type={G.pathTiles[i][j]} />);
        if (j + 1 < squareSize)
          cells2.push(<PathArrow type={0} />);
      }
      tbody.push(<tr key={i}>{cells2}</tr>);
    }
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

  const answerButton = {
    border: '1px solid #555',
    width: '600px',
    height: '200px',
    lineHeight: '100px',
    textAlign: 'center',
    fontSize: '25px',
    cursor: 'pointer',
    background: '#eeffe9',
  }

  const correctAnswerButton = {
    border: '1px solid #555',
    width: '600px',
    height: '200px',
    lineHeight: '100px',
    textAlign: 'center',
    fontSize: '25px',
    cursor: 'pointer',
    background: '#eeffe9',
  }

  let bigIcons = [<img src="PlayerIcons1.png" style={CurrentlyUpPlayerStyle} />,
  <img src="PlayerIcons2.png" style={CurrentlyUpPlayerStyle} />,
  <img src="PlayerIcons3.png" style={CurrentlyUpPlayerStyle} />,
  <img src="PlayerIcons4.png" style={CurrentlyUpPlayerStyle} />];

  let icons = [<img src="PlayerIcons1.png" style={PlayerScoreStyle} />,
  <img src="PlayerIcons2.png" style={PlayerScoreStyle} />,
  <img src="PlayerIcons3.png" style={PlayerScoreStyle} />,
  <img src="PlayerIcons4.png" style={PlayerScoreStyle} />];

  if (!G.isInQuestion) {
    return (
      <div>
        <p>{G.publicMessage}</p>
      <div id="parent">
        <table id="board">
          <tbody>{tbody}</tbody>
        </table>

        {winner}
        <div id="scores">
          <p>
            {ctx.numPlayers > 0 ? icons[0] : (null)}
            {ctx.numPlayers > 0 ? "Score:" + G.scores[0] : (null)}
          </p>
          <p>
            {ctx.numPlayers > 1 ? icons[1] : (null)}
            {ctx.numPlayers > 1 ? "Score:" + G.scores[1] : (null)}
          </p>
          <p>
            {ctx.numPlayers > 2 ? icons[2] : (null)}
            {ctx.numPlayers > 2 ? "Score:" + G.scores[2] : (null)}
          </p>
          <p>
            {ctx.numPlayers > 3 ? icons[3] : (null)}
            {ctx.numPlayers > 3 ? "Score:" + G.scores[3] : (null)}
          </p>
          <p>Currently Up:</p>
          {bigIcons[ctx.currentPlayer]}
          <p>{(spriteName(ctx.currentPlayer)) + "'s Turn"}</p>
          <div>{scoreAndOptions}</div>
        </div>
      </div>
      </div>
    );
  }
  else {
    //timeoutObj = setTimeout(returnToGame, 3000, 'yay');
    if (G.question === "") {
      return (<div>
      <p>You landed on a versus tile! Answer the question</p>
      <button name={"Dont Use"} style={answerButton} onClick={() => returnToGame()}>{"yay"}</button></div>);
    }
    else {
      switch (G.questionOrder) {
        case 0:
          return (
            <div id="parentQuestion">
              <div id="question">
                <p>{G.question}</p>
                <button name={"Answer 1"} id='ans1' style={answerButton} onClick={() => onAnswerClick(1)}>{G.answer1}</button>
                <button name={"Answer 2"} id='ans2' style={answerButton} onClick={() => onAnswerClick(2)}>{G.answer2}</button>
                <button name={"Answer 3"} id='ans3' style={answerButton} onClick={() => onAnswerClick(3)}>{G.answer3}</button>
                <button name={"Answer 4"} id={'correct'} style={correctAnswerButton} onClick={() => onAnswerClick(4)}>{G.answer4}</button>
              </div>
            </div>
          );
        case 1:
          return (
            <div id="parentQuestion">
              <div id="question">
                <p>{G.question}</p>
                <button name={"Answer 1"} id='ans1' style={answerButton} onClick={() => onAnswerClick(1)}>{G.answer1}</button>
                <button name={"Answer 2"} id='ans2' style={answerButton} onClick={() => onAnswerClick(2)}>{G.answer2}</button>
                <button name={"Answer 4"} id={'correct'} style={correctAnswerButton} onClick={() => onAnswerClick(4)}>{G.answer4}</button>
                <button name={"Answer 3"} id='ans3' style={answerButton} onClick={() => onAnswerClick(3)}>{G.answer3}</button>
              </div>
            </div>
          );
        case 2:
          return (
            <div id="parentQuestion">
              <div id="question">
                <p>{G.question}</p>
                <button name={"Answer 1"} id='ans1' style={answerButton} onClick={() => onAnswerClick(1)}>{G.answer1}</button>
                <button name={"Answer 4"} id={'correct'} style={correctAnswerButton} onClick={() => onAnswerClick(4)}>{G.answer4}</button>
                <button name={"Answer 2"} id='ans2' style={answerButton} onClick={() => onAnswerClick(2)}>{G.answer2}</button>
                <button name={"Answer 3"} id='ans3' style={answerButton} onClick={() => onAnswerClick(3)}>{G.answer3}</button>
              </div>
            </div>
          );
        case 3:
          return (
            <div id="parentQuestion">
              <div id="question">
                <p>{G.question}</p>
                <button name={"Answer 4"} id={'correct'} style={correctAnswerButton} onClick={() => onAnswerClick(4)}>{G.answer4}</button>
                <button name={"Answer 1"} id='ans1' style={answerButton} onClick={() => onAnswerClick(1)}>{G.answer1}</button>
                <button name={"Answer 2"} id='ans2' style={answerButton} onClick={() => onAnswerClick(2)}>{G.answer2}</button>
                <button name={"Answer 3"} id='ans3' style={answerButton} onClick={() => onAnswerClick(3)}>{G.answer3}</button>
              </div>
            </div>
          );
      }
    }
  }
}
export default Board;