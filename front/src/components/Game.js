import { Queue, bfsMoveFinder } from "./Queue";

function IsVictory(G, ctx) {
  return false;
  //return G.gameTurns === ctx.turn * ctx.numPlayers;
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

export function TypeToNum(type) {
  switch (type) {
    case "Start":
    default:
      return 0;
    case "PointsGain":
      return 1;
    case "PointsLose":
      return 2;
    case "PointsSuperGain":
      return 3;
    case "PointsSuperLose":
      return 4;
    case "QuestionBasic":
      return 5;
    case "QuestionHighOrLow":
      return 6;
    case "QuestionVersus":
      return 7;
    case "QuestionImage":
      return 8;
  }
}

function clickCell(G, ctx, id) {
  // id is the cell clicked
  G.playerPositions[ctx.currentPlayer] = id; // moves player to cell clicked
  switch (G.tiles[G.playerPositions[ctx.currentPlayer]]) {
    case 5:
    case 6:
    case 7:
    case 8:
      console.log("QUESTION TIME");
      break;
    case 1:
      G.scores[ctx.currentPlayer] += 3;
      break;
    case 2:
      G.scores[ctx.currentPlayer] -= 3;
      break;
    case 3:
      G.scores[ctx.currentPlayer] += 15;
      break;
    case 4:
      G.scores[ctx.currentPlayer] -= 15;
      break;
    case 0:
      console.log("You came back to start!");
      break;
    default:
      console.log("ERROR: some other effect");
      break;
  }
  G.movements = Array(0);
  G.dieRoll = 0;
  ctx.events.endStage();
}

function rollDie(G, ctx) {
  //if (id === 26) {
  G.dieRoll = ctx.random.D6();
  G.movements = bfsMoveFinder(G.tileEdges, G.playerPositions[ctx.currentPlayer], G.dieRoll);
  //}
  ctx.events.endStage();
}

export const BreadsticksGame = {
  name: "Breadsticks-Game",

  setup: (ctx) => ({
    //Game board is a directed graph, but
    //Its stored as an array for the vertices
    //and an array of arrays for edges, rather than a Graph object
    //It has 7 * 7 = 49 for for 49 tiles, and 50 is used for the dice roll button
    
    tiles: Array(169).fill().map((_, i) => i).map((x) => x === 0 ? 0 : Math.round(Math.random() * 5 + 1)),
    //tiles: Array(168).fill(1),
    tileEdges: [[1], [2], [3], [4], [5], [6], [7], [8], [9], [10], [11], [12], [13], [14], [15], [16], [17], [18], [19], [20], [21], [22], [23], [24],
    [25], [26], [27], [28], [29], [30], [31], [32], [33], [34], [35], [36], [37], [38], [39], [40], [41], [42], [43], [44], [45], [46], [47], [48], [0]], // simple linear graph
    playerPositions: Array(ctx.numPlayers).fill(0),
    starIndex: -1,
    scores: Array(ctx.numPlayers).fill(0),
    dieRoll: 0,
    movements: Array(0), // the current movement options available to whoever is the player
    gameTurns: 10,
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
        next: "rollDice"
      },
    },
    moveLimit: 2
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