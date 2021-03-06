import { bfsMoveFinder } from "./Queue";
const axios = require("axios");

function IsGameOver(G, ctx) {
  //return true;
  return G.gameTurns === Math.trunc((ctx.turn - 1) / ctx.numPlayers);
}

// Return the question here
let URL = "http://localhost:3001/random"
// Populate question into data
const question_data = {};  

function populateData(data) {
  question_data['question'] = data[0].question
  question_data['option1'] = data[0].option1
  question_data['option2'] = data[0].option2
  question_data['option3'] = data[0].option3
  question_data['option4'] = data[0].option4
  question_data['support'] = data[0].support

}

function API_call(populateData) {
  axios.get(URL)
 .then(function(response){
         populateData(response.data);
  })
  .catch(function(error){
         console.log(error);
   });
}   
// Populate question into data [END]

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

function spriteName(id) {
  switch (id) {
    case "0":
      return "Red";
    case "1":
      return "Yellow";
    case "2":
      return "Blue";
    case "3":
      return "Green";
    default:
      return "errorname";
  }
}

function clickCell(G, ctx, id) {
  // id is the cell clicked
  G.playerPositions[ctx.currentPlayer] = id; // moves player to cell clicked
  switch (G.tiles[G.playerPositions[ctx.currentPlayer]]) {
    case 5: // versus question
      //console.log("VERSUS QUESTION TIME");

      G.questionType = "basic";

      // get question
      API_call(populateData)
      //console.log(question_data.question)
      G.questionType = "versus";
      
      if (question_data['question']) {
        G.question = question_data['question'];
        G.answer1 = question_data['option1'];
        G.answer2 = question_data['option2'];
        G.answer3 = question_data['option3'];
        G.answer4 = question_data['option4'];
        G.support = question_data['support'];
      }
      
      //G.questionData = question_data;

      G.isInQuestion = true;
      ctx.events.setActivePlayers({ all: 'answerQuestion',  minMoves: 1, maxMoves: 1});
      
      break;
    case 6: // basic question NOT USED IN FINAL VERSION
      console.log("ERROR: BASIC QUESTION TIME");
      API_call(populateData)
      //console.log(question_data.question)
      //G.questionType = "basic";
      //G.isInQuestion = true;
      //ctx.events.setActivePlayers({ all: 'answerQuestion',  minMoves: 1, maxMoves: 1});
      break;
    case 1: // point gain
      G.scores[ctx.currentPlayer] += 5;
      G.publicMessage =  spriteName(ctx.playerID) + " just gained 5 points! "
      //ctx.events.endStage();
      ctx.events.endTurn();//skip question stage
      break;
    case 2: // point loss
      G.scores[ctx.currentPlayer] -= 5;
      G.publicMessage =  spriteName(ctx.playerID) + " just lost 5 points! "
      //ctx.events.endStage();
      ctx.events.endTurn();//skip question stage
      ctx.numMoves--;
      break;
    case 3: // super gain
      G.scores[ctx.currentPlayer] += 10;
      G.publicMessage =  spriteName(ctx.playerID) + " just gained 10 points! "
      //ctx.events.endStage();
      ctx.events.endTurn();//skip question stage
      break;
    case 4: // super loss
      G.scores[ctx.currentPlayer] -= 10;
      G.publicMessage =  spriteName(ctx.playerID) + " just lost 10 points! "
      //ctx.events.endStage();
      ctx.events.endTurn();//skip question stage
      break;
    case 0:
      //console.log("You came back to start!");
      //ctx.events.endStage();
      ctx.events.endTurn();//skip question stage
      break;
    default:
      //console.log("ERROR: some other effect");
      break;
  }
  G.movements = Array(0);
  //G.dieRoll = 0;
  if(G.scores[ctx.currentPlayer] < 0)
    G.scores[ctx.currentPlayer] = 0;
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
  //console.log("selected:", ans);
  // Transition out of question state
  G.isInQuestion = true;

  // count how many players remain
  let numPlayers = 0;
  for (const x in ctx.activePlayers) {
    numPlayers += 1;
  }

  let points = 20;
  let pointsToLose = 20;
  // this means nobody has answered yet, so reset the message
  if (numPlayers === ctx.numPlayers) {
    G.publicMessage = "";
  }
  switch (ctx.numPlayers - numPlayers) {
    case 0:
      points = 20;
      pointsToLose = 3;
      break;
    case 1: 
      points = 10;
      pointsToLose = 5;
      break;
    case 2: 
      points = 5;
      pointsToLose = 10;
    case 3:
      points = 3;
      pointsToLose = 20;
  }
  
  if (ans === 4) {
    G.scores[ctx.playerID] += points;
    G.publicMessage += spriteName(ctx.playerID) + " just gained " + points + " points! "
    //console.log(ctx.playerID, " just gained 20 points!");

  } 
  else {
    G.scores[ctx.playerID] -= pointsToLose;
    G.publicMessage += spriteName(ctx.playerID) + " just lost " + pointsToLose + " points! "
    //console.log(ctx.playerID, " just lost 10 points!");
  }

  //console.log(ctx.playerID);

  // end turn if every player has gone
  // the value to check for is 1 because "active players"
  // doesn't update until after the function returns
  
  if (numPlayers === 1) {
    G.questionOrder = Math.floor(Math.random() * 4);
    G.isInQuestion = false;
    ctx.events.endTurn();
  }
}

export const BreadsticksGame = {
  name: "Breadsticks-Game",

  setup: (ctx) => ({
    //Game board is a directed graph, but
    //Its stored as an array for the vertices
    //and an array of arrays for edges, rather than a Graph object
    //It has 7 * 7 = 49 for for 49 tiles, and 50 is used for the dice roll button
    
    tiles: Array(49).fill(0).map(() => Math.floor(Math.random() * 5 + 1)),
    //tiles: Array(49).fill(0).map(() => 5),
    tileEdges: [[1], [2], [3], [4,10], [5], [6], [13],
                [0,8], [15], [8], [9,11,17], [4,12], [13], [20],
                [7,21], [14], [15], [16], [11,17], [18,26], [19],
                [28], [21], [22], [17,23,25], [18,26], [27,33], [20],
                [35], [22], [29], [24], [25], [32,34], [27,41],
                [42], [29], [30,43], [31], [40], [33,41], [48],
                [43], [44], [37,45], [38], [39,45], [46], [47]], // linear graph
    playerPositions: Array(ctx.numPlayers).fill(0),
    starIndex: -1,
    scores: Array(ctx.numPlayers).fill(0),
    dieRoll: 3,
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
    question: "Welcome to your first question! Answer correctly quickly for more points. Answer wrong and lose points, the slower the more points you lose. What is your favorite class?",
    answer1: "wrong answer",
    answer2: "wrong answer",
    answer3: "wrong answer",
    answer4: "CS 161",
    support: "support",
    order: 0,
    questionTime: 20,
    questionTimeLeft: 20,
    activePlayersDuplicate: Array(ctx.numPlayers).fill(-1),
    publicMessage: "",
    questionOrder: Math.floor(Math.random() * 4),
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
    if (IsGameOver(G, ctx)) {
      const max = Math.max(...G.scores);
      const indexes = [];

      for (let index = 0; index < G.scores.length; index++) {
        if (G.scores[index] === max) {
          indexes.push(index);
        }
      }
      return { winners: indexes };
    }
  },
};

export default BreadsticksGame;