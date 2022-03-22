function IsVictory(G, ctx) {
  return G.gameTurns === ctx.turn * ctx.numPlayers;
}

//Represents a single tile of the board game
//Tiles know their types,
// what is on the tiles
// and what other tiles they border?
// and have a way to navigate the tile structure?

// Season enums can be grouped as static members of a class
// https://www.sohamkamani.com/javascript/enums/
class GameTile {
  // Create new instances of the same class as static attributes
  static Start = new GameTile("Start")
  static PointsGain = new GameTile("PointsGain")
  static PointsLose = new GameTile("PointsLose")
  static PointsSuperGain = new GameTile("PointsSuperGain")
  static PointsSuperLose = new GameTile("PointsSuperLose")
  static QuestionBasic = new GameTile("QuestionBasic")
  static QuestionHighOrLow = new GameTile("QuestionHighOrLow")
  static QuestionVersus = new GameTile("QuestionVersus")

  constructor(name) {
    this.name = name
  }
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
  }
}

function clickCell(G, ctx, id) {
  if (G.playerPositions.indexOf(id) === -1) {
    G.playerPositions[ctx.currentPlayer] = id;
  }
}
function rollDie(G,ctx,id)
{
  if (id === 10) {
    G.dieRoll = ctx.random.D6();
  }
}

const BreadsticksGame = {
  name: "Breadsticks-Game",

  setup: (ctx) => ({
    cells: Array(10).fill(0),
    playerPositions: Array(ctx.numPlayers).fill(-1),
    starIndex: -1,
    scores: Array(ctx.numPlayers).fill(0),
    dieRoll: 0,
    gameTurns: 10,
  }),

  moves: { rollDie, clickCell},

  turn: {
    moveLimit : 2
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

  ai: {
    enumerate: G => {
      let moves = [];
      for (let i = 0; i < 9; i++) {
        if (G.cells[i].playerOn === null) {
          moves.push({ move: "clickCell", args: [i] });
        }
      }
      return moves;
    }
  }
};

export default BreadsticksGame;