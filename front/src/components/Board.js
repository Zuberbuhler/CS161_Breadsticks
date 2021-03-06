import React from 'react';
import './Board.css';
import {bfsMoveFinder} from  "./Queue"

var timeoutObj = null;

function Board({ ctx, G, moves }) {

  // handles when a player clicks a tile to move to
  const onClick = (id) => {
    if (bfsMoveFinder(G.tileEdges, G.playerPositions[ctx.currentPlayer], G.dieRoll).includes(id)) {
      moves.clickCell(id);
    }
    //else console.log("Can't go to " + id);
  };

  // handles when a player clicks the die to roll
  const onDiceClick = () => {
    moves.rollDie();
  }

  const onAnswerClick = (id) => {
    //console.log("Player Clicked Answer " + id);
    
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
    //console.log("Go back");
    moves.answer(5);
  };


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
    //border: '4px solid gold',
    width: '50px',
    height: '50px',
    position: 'absolute',
    background: 'none',
    pointerEvents: 'none',
    marginTop: '0px',
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

    let icons = [<img src="PlayerIconsBoard1.png" style={playerStyle} alt="P1" />,
    <img src="PlayerIconsBoard2.png" style={playerStyle} alt="P2"/>,
    <img src="PlayerIconsBoard3.png" style={playerStyle} alt="P3"/>,
    <img src="PlayerIconsBoard4.png" style={playerStyle} alt="P4"/>];

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
    position: 'relative',
  };

  let diceIcons = [<img src="Dice1.png" style={diceButton} onClick={() => onDiceClick()} alt="D1"/>,
  <img src="Dice2.png" style={diceButton} onClick={() => onDiceClick() } alt="D2"/>,
  <img src="Dice3.png" style={diceButton} onClick={() => onDiceClick() } alt="D3"/>,
  <img src="Dice4.png" style={diceButton} onClick={() => onDiceClick() } alt="D4"/>,
  <img src="Dice5.png" style={diceButton} onClick={() => onDiceClick() } alt="D5"/>,
  <img src="Dice6.png" style={diceButton} onClick={() => onDiceClick() } alt="D6"/>,] 

  let scoreAndOptions = [];
  scoreAndOptions.push(
    //<p>
        diceIcons[G.dieRoll - 1] );
    //</p>);
  //<button style={diceButton} onClick={() => onDiceClick()}>{"Dice:" + G.dieRoll}</button>


  const PlayerScoreStyle = {
    border: '3px solid #555',
    width: '60px',
    height: '60px',
    position: 'relative',
    background: 'white',
    pointerEvents: 'none',
  };

  const CurrentlyUpPlayerStyle = {
    border: '8px solid #555',
    width: '100px',
    height: '100px',
    position: 'relative',
    background: 'white',
    pointerEvents: 'none',
  };

  const answerButton = {
    border: '1px solid #555',
    width: '600px',
    height: '200px',
    lineHeight: '100px',
    textAlign: 'center',
    fontSize: '25px',
    cursor: 'pointer',
    background: '#lightblue',
  }

  const correctAnswerButton = {
    border: '1px solid #555',
    width: '600px',
    height: '200px',
    lineHeight: '100px',
    textAlign: 'center',
    fontSize: '25px',
    cursor: 'pointer',
    background: '#lightblue',
  }

  let bigIcons = [<img src="PlayerIcons1.png" style={CurrentlyUpPlayerStyle} alt="P1"/>,
  <img src="PlayerIcons2.png" style={CurrentlyUpPlayerStyle} alt="P2"/>,
  <img src="PlayerIcons3.png" style={CurrentlyUpPlayerStyle} alt="P3"/>,
  <img src="PlayerIcons4.png" style={CurrentlyUpPlayerStyle} alt="P4"/>];
  const helpButton = {
    border: '0px solid #555',
    width: '40px',
    height: '40px',
    lineHeight: '50px',
    background: 'none',
    position: 'flex',
    marginTop: '5px',
    marginLeft: '75px', 
  }

  let icons = [<img src="PlayerIcons1.png" style={PlayerScoreStyle} alt="P1"/>,
  <img src="PlayerIcons2.png" style={PlayerScoreStyle} alt="P2"/>,
  <img src="PlayerIcons3.png" style={PlayerScoreStyle} alt="P3"/>,
  <img src="PlayerIcons4.png" style={PlayerScoreStyle} alt="P4"/>];


  //Progress bar as timer of a question
  // https://www.codegrepper.com/code-examples/javascript/30+seconds+countdown+js
  /*
  var timeLeft = 20;
  var downloadTimer = setInterval(function(){
    if(document.getElementById("progressBar") !== null)
    {
      document.getElementById("progressBar").value = 20 - timeLeft;
      timeLeft -= 1;
      if(timeLeft < 0){
        //clearInterval(downloadTimer);
        timeLeft = 20;
        console.log("timer done");
        G.isInQuestion = false;
      }
    }
  }, 1000);
  */

  const ScoresTextStyle = {
    border: '3px solid #555',
    width: '180px',
    height: '30px',
    position: 'center',
    background: 'white',
    pointerEvents: 'none',
    margin: 'auto'
  };
  
  if (!G.isInQuestion) {
    return (
      <div>
        {ctx.gameover ?
          <div id="winner">
            <div>
              <div style={ScoresTextStyle}>{"GAME OVER"}</div>
            </div>
            {ctx.numPlayers > 0 ?
              <div id="wrapper">
                {icons[0]}<div style={ScoresTextStyle}>{"Score:" + G.scores[0]}</div>
              </div> : (null)}
            {ctx.numPlayers > 1 ?
              <div id="wrapper">
                {icons[1]}<div style={ScoresTextStyle}>{"Score:" + G.scores[1]}</div>
              </div> : (null)}
            {ctx.numPlayers > 2 ?
              <div id="wrapper">
                {icons[2]}<div style={ScoresTextStyle}>{"Score:" + G.scores[2]}</div>
              </div> : (null)}
            {ctx.numPlayers > 3 ?
              <div id="wrapper">
                {icons[3]}<div style={ScoresTextStyle}>{"Score:" + G.scores[3]}</div>
              </div> : (null)}
            <p style={ScoresTextStyle}>{"--WINNER--"}</p>
            {ctx.gameover.winners.indexOf(0) !== -1 ? bigIcons[0] : (null)}
            {ctx.gameover.winners.indexOf(1) !== -1 ? bigIcons[1] : (null)}
            {ctx.gameover.winners.indexOf(2) !== -1 ? bigIcons[2] : (null)}
            {ctx.gameover.winners.indexOf(3) !== -1 ? bigIcons[3] : (null)}
          </div> :
          <div>
            <p>{G.publicMessage}</p>
            <div id="parent">
              <table id="board">
                <tbody>{tbody}</tbody>
              </table>
              <div id="scores">
                <div>
                  <div style={ScoresTextStyle}>{"SCORES"}</div>
                </div>
                {ctx.numPlayers > 0 ?
                  <div id="wrapper">
                    {icons[0]}<div style={ScoresTextStyle}>{"Score:" + G.scores[0]}</div>
                  </div> : (null)}
                {ctx.numPlayers > 1 ?
                  <div id="wrapper">
                    {icons[1]}<div style={ScoresTextStyle}>{"Score:" + G.scores[1]}</div>
                  </div> : (null)}
                {ctx.numPlayers > 2 ?
                  <div id="wrapper">
                    {icons[2]}<div style={ScoresTextStyle}>{"Score:" + G.scores[2]}</div>
                  </div> : (null)}
                {ctx.numPlayers > 3 ?
                  <div id="wrapper">
                    {icons[3]}<div style={ScoresTextStyle}>{"Score:" + G.scores[3]}</div>
                  </div> : (null)}
                <div style={ScoresTextStyle}>{"Turn " + (Math.trunc((ctx.turn - 1) / ctx.numPlayers) + 1) + " Of " + G.gameTurns}</div>
                <p style={ScoresTextStyle}>{" Currently Up:" + Math.max(G.scores)}</p>
                {bigIcons[ctx.currentPlayer]}
                <div>
                  <p style={ScoresTextStyle}>{"Player " + (ctx.currentPlayer) + "'s Turn"}</p>
                  <p style={ScoresTextStyle}>{G.movements.length === 0 ? "Roll Dice" : "Select Move"}</p>
                  {diceIcons[G.dieRoll - 1]}
                </div>
              </div>
            </div>
          </div>
        }
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
            <body id="parentQuestion">
              <div id="question">
                <p>{G.question}</p>
                <div id="wrapper">
                  <button class="button-5" name={"Answer 1"} id='ans1' style={answerButton} onClick={() => onAnswerClick(1)}>{G.answer1}</button>
                  <button class="button-5" name={"Answer 2"} id='ans2' style={answerButton} onClick={() => onAnswerClick(2)}>{G.answer2}</button>
                </div>
                <div id="wrapper">
                  <button class="button-5" name={"Answer 3"} id='ans3' style={answerButton} onClick={() => onAnswerClick(3)}>{G.answer3}</button>
                  <button class="button-5" name={"Answer 4"} id={'correct'} style={correctAnswerButton} onClick={() => onAnswerClick(4)}>{G.answer4}</button>
                </div>
              </div>
            </body>
          );
        case 1:
          return (
            <body id="parentQuestion">
              <div id="question">
                <p>{G.question}</p>
                <div id="wrapper">
                <button class="button-5" name={"Answer 1"} id='ans1' style={answerButton} onClick={() => onAnswerClick(1)}>{G.answer1}</button>
                <button class="button-5" name={"Answer 2"} id='ans2' style={answerButton} onClick={() => onAnswerClick(2)}>{G.answer2}</button>
                </div>
                <div id="wrapper">
                <button class="button-5" name={"Answer 4"} id={'correct'} style={correctAnswerButton} onClick={() => onAnswerClick(4)}>{G.answer4}</button>
                <button class="button-5" name={"Answer 3"} id='ans3' style={answerButton} onClick={() => onAnswerClick(3)}>{G.answer3}</button>
                </div>
              </div>
            </body>
          );
        case 2:
          return (
            <body id="parentQuestion">
              <div id="question">
                <p>{G.question}</p>
                <div id="wrapper">
                <button class="button-5" name={"Answer 1"} id='ans1' style={answerButton} onClick={() => onAnswerClick(1)}>{G.answer1}</button>
                <button class="button-5" name={"Answer 4"} id={'correct'} style={correctAnswerButton} onClick={() => onAnswerClick(4)}>{G.answer4}</button>
                </div>
                <div id="wrapper">
                <button class="button-5" name={"Answer 2"} id='ans2' style={answerButton} onClick={() => onAnswerClick(2)}>{G.answer2}</button>
                <button class="button-5" name={"Answer 3"} id='ans3' style={answerButton} onClick={() => onAnswerClick(3)}>{G.answer3}</button>
                </div>
              </div>
            </body>
          );
        case 3:
          return (
            <body id="parentQuestion">
              <div id="question">
                <p>{G.question}</p>
                <div id="wrapper">
                <button class="button-5" name={"Answer 4"} id={'correct'} style={correctAnswerButton} onClick={() => onAnswerClick(4)}>{G.answer4}</button>
                <button class="button-5" name={"Answer 1"} id='ans1' style={answerButton} onClick={() => onAnswerClick(1)}>{G.answer1}</button>
                </div>
                <div id="wrapper">
                <button class="button-5" name={"Answer 2"} id='ans2' style={answerButton} onClick={() => onAnswerClick(2)}>{G.answer2}</button>
                <button class="button-5" name={"Answer 3"} id='ans3' style={answerButton} onClick={() => onAnswerClick(3)}>{G.answer3}</button>
                </div>
              </div>
            </body>
          );
      }
    }
  }
}
export default Board;