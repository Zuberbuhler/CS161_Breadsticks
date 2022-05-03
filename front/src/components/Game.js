function IsVictory(G, ctx) {
  return false;
  //return G.gameTurns === ctx.turn * ctx.numPlayers;
}

//Represents a single tile of the board game
//Tiles know their types,
// what is on the tiles
// and what other tiles they border?
// and have a way to navigate the tile structure?

//https://www.javascripttutorial.net/javascript-queue/
class Queue {
  constructor() {
    this.elements = {};
    this.head = 0;
    this.tail = 0;
  }
  enqueue(element) {
    this.elements[this.tail] = element;
    this.tail++;
  }
  dequeue() {
    const item = this.elements[this.head];
    delete this.elements[this.head];
    this.head++;
    return item;
  }
  peek() {
    return this.elements[this.head];
  }
  get length() {
    return this.tail - this.head;
  }
  get isEmpty() {
    return this.length === 0;
  }
}

// function to performs BFS
//https://www.geeksforgeeks.org/implementation-graph-javascript/
export function bfsMoveFinder(tileEdges, startingTileID, depthNum) {

  // create a visited object
  var visited = {};

  // Create an object for queue
  var q = new Queue();
  // Create another object to divide BFS into distinct layers we can stop on
  var childQ = new Queue();

  // add the starting node to the queue
  visited[startingTileID] = true;
  q.enqueue(startingTileID);

  var currentDepth = 0;
  // loop until current queue is empty
  //console.log(depthNum);
  while (!q.isEmpty && currentDepth !== depthNum) {
    do {
      // get the element from the queue
      var getQueueElement = q.dequeue();

      // passing the current vertex to callback function
      //console.log(getQueueElement);

      // get the adjacent list for current vertex
      var get_List = tileEdges[getQueueElement];

      // loop through the list and add the element to the
      // queue if it is not processed yet
      for (var i in get_List) {
        var neigh = get_List[i];

        //if (!visited[neigh]) {
        //  visited[neigh] = true;
        childQ.enqueue(neigh);
        //}
      }
    }
    while (!q.isEmpty);
    //now ChildQueue holds all of the next row, we can set q to hold that Row
    while (!childQ.isEmpty) {
      q.enqueue(childQ.dequeue());
    }
    currentDepth++;
  }
  //Now q holds all of the desired depth row, we can place the results into an array
  //This allows avoiding json serializing objects
  var depthArray = [];
  while (!q.isEmpty) {
    depthArray.push(q.dequeue());
  }
  console.log("bfs " + depthArray.toString());
  return depthArray;
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
  G.playerPositions[ctx.currentPlayer] = id;
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

const BreadsticksGame = {
  name: "Breadsticks-Game",

  setup: (ctx) => ({
    //Game board is a directed graph, but
    //Its stored as an array for the vertices
    //and an array of arrays for edges, rather than a Graph object
    //It has 7 * 7 = 49 for for 49 tiles, and 50 is used for the dice roll button
    tiles:Array(168).fill().map((_, i) => i).map((x) => x === 0 ? 0 : Math.round(Math.random() * 7 + 1)),
    tileEdges: [[1, 2], [2], [3], [4], [5], [6], [7], [8], [9], [10], [11], [12], [13], [14], [15], [16], [17], [18], [19], [20], [21], [22], [23], [24],
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

  ai: {
    enumerate: G => {
      let moves = [];
      for (let i = 0; i < 9; i++) {
        if (G.tiles[i].playerOn === null) {
          moves.push({ move: "clickCell", args: [i] });
        }
      }
      return moves;
    }
  }
};

export default BreadsticksGame;