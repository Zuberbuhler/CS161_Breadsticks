import { bfsMoveFinder } from "./Queue";

function IsVictory(G, ctx) {
  return false;
  //return G.gameTurns * ctx.numPlayers === ctx.turn;
}

export function numToType(num) {
  switch (num) {
    case 0:
    default:
      return "Start";
    case 1:
      return "PointsGain";
    case 2:
      return "PointsLose";
    case 3:
      return "PointsSuperGain";
    case 4:
      return "PointsSuperLose";
    case 5:
      return "QuestionBasic";
    case 6:
      return "QuestionHighOrLow";
    case 7:
      return "QuestionVersus";
    case 8: 
      return "QuestionImage";
  }
}

function clickCell(G, ctx, id) {
  // id is the cell clicked
  G.playerPositions[ctx.currentPlayer] = id; // moves player to cell clicked
  switch (G.tiles[G.playerPositions[ctx.currentPlayer]]) {
    case 5: // versus question
      console.log("VERSUS QUESTION TIME");
      G.questionType = "versus";
      G.isInQuestion = true;
      ctx.events.setActivePlayers({ all: 'answerQuestion', maxMoves: 1, revert: true });
      /*var timeLeft = G.questionTime;
      var downloadTimer = setTimeout(function () {
        console.log("we got a timer" + timeLeft);
        timeLeft -= 1;
        if (timeLeft < 0) {
          clearInterval(downloadTimer);
          timeLeft = G.questionTime;
          console.log("timer done");
          ctx.events.endTurn();
          G.isInQuestion = false;
        }
      }, 1000);*/
      break;
    case 6: // highlow question
      console.log("BASIC QUESTION TIME");
      G.questionType = "basic";
      G.isInQuestion = true;
      ctx.events.setActivePlayers({ all: 'answerQuestion', maxMoves: 1, revert: true });
      
      /*var timeLeft = G.questionTime;
      var downloadTimer = setTimeout(function () {
        console.log("we got a timer" + timeLeft);
        timeLeft -= 1;
        if (timeLeft < 0) {
          clearInterval(downloadTimer);
          timeLeft = G.questionTime;
          console.log("timer done");
          ctx.events.endTurn();
          G.isInQuestion = false;
        }
      }, 1000);*/
      break;
    case 1: // point gain
      G.scores[ctx.currentPlayer] += 3;
      //ctx.events.endStage();
      ctx.events.endTurn();//skip question stage
      break;
    case 2: // point loss
      G.scores[ctx.currentPlayer] -= 3;
      //ctx.events.endStage();
      ctx.events.endTurn();//skip question stage
      ctx.numMoves--;
      break;
    case 3: // super gain
      G.scores[ctx.currentPlayer] += 15;
      //ctx.events.endStage();
      ctx.events.endTurn();//skip question stage
      break;
    case 4: // super loss
      G.scores[ctx.currentPlayer] -= 15;
      //ctx.events.endStage();
      ctx.events.endTurn();//skip question stage
      break;
    case 0:
      console.log("You came back to start!");
      //ctx.events.endStage();
      ctx.events.endTurn();//skip question stage
      break;
    default:
      console.log("ERROR: some other effect");
      break;
  }
  G.movements = Array(0);
  G.dieRoll = 0;
  //ctx.events.endStage();
}


function rollDie(G, ctx) {
  //if (id === 26) {
  G.dieRoll = ctx.random.D6();
  G.movements = bfsMoveFinder(G.tileEdges, G.playerPositions[ctx.currentPlayer], G.dieRoll);
  //}
  ctx.events.endStage();
}

function answer(G, ctx, ans)
{
  //Record Answer
  G.playerAnswers[0] = ans;

  //Transition out of question
  G.isInQuestion = false;
  ctx.events.endTurn();
}

export const BreadsticksGame = {
  name: "Breadsticks-Game",

  setup: (ctx) => ({
    //Game board is a directed graph, but
    //Its stored as an array for the vertices
    //and an array of arrays for edges, rather than a Graph object
    //It has 7 * 7 = 49 for for 49 tiles, and 50 is used for the dice roll button
    
    tiles: Array(49).fill(0).map(() => Math.round(Math.random() * 5 + 1)),
    tileEdges: [[1], [2], [3], [4,10], [5], [6], [13],
                [0], [15], [8], [9,11,17], [4,12], [13], [20],
                [7,21], [14], [15], [16], [17], [18], [19],
                [28], [21], [22], [17,23,25], [18,26], [27,33], [20],
                [35], [22], [29], [24], [25], [32,34], [27,41],
                [42], [29], [30,43], [31], [40], [33,41], [49],
                [43], [44], [37,45], [38], [39,45], [47], [48]], // linear graph
    playerPositions: Array(ctx.numPlayers).fill(0),
    starIndex: -1,
    scores: Array(ctx.numPlayers).fill(0),
    dieRoll: 0,
    movements: Array(0), // the current movement options available to whoever is the player
    gameTurns: 10,
    //THIS IS VISUAL ONLY, the actual path is in tileEdges,
    //There are the 7 main rows,which have 6 left or right arrows, and then the 6 inbetween rows, which have up and down arrows, and empty tiles
    //Ignoring the middle empty tiles in a square of 4 actual placements,
    //This means that there are 13 rows of 6 or 7, in this case its initialized with all rows as 7
    pathTiles: [[1,1,1,1,1,1],
                [2,0,0,4,2,0,4],
                [1,3,3,1,1,1],
                [2,4,2,4,2,0,4],
                [3,3,3,3,3,3],
                [4,0,0,2,2,4,2],
                [3,3,3,1,1,1],
                [4,2,0,2,2,4,2],
                [0,3,0,0,3,1],
                [4,2,2,2,0,2,4],
                [0,3,0,0,1,1],
                [4,0,2,2,2,0,4],
                [1,1,1,3,3,3]], // 1: right, 2 :up 3: left, 4: down; 0 is no arrow value
    isInQuestion: false, // determines if the players see questions or the board
    questionType: "basic", // other types include "versus", " "highlow", "image"
    questionScores: Array(ctx.numPlayers).fill(0), // the score each player got from the last question
    playerAnswers: Array(ctx.numPlayers).fill(0), // the answer number of each player
    questionTime: 20,
    questionTimeLeft: 20,

    
  }),

  turn: {
    activePlayers: {
      currentPlayer: "rollDice"
    },
    stages: {
      rollDice: {
        start: true,
        moves: { rollDie },
        next: "movePlayer"
      },
      movePlayer: {
        moves: { clickCell },
        next: "answerQuestion"
      },
      answerQuestion: {
        moves: { answer },
        next: "rollDice"
      },
    },
  },

  // The minimum and maximum number of players supported
  // (This is only enforced when using the Lobby server component.)
  minPlayers: 1,
  maxPlayers: 4,

  endIf: (G, ctx) => {
    if (IsVictory(G, ctx)) {
      return { winner: ctx.currentPlayer };
    }
  },
};

export default BreadsticksGame;