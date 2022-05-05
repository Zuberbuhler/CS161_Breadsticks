//Represents a single tile of the board game
//Tiles know their types,
// what is on the tiles
// and what other tiles they border?
// and have a way to navigate the tile structure?

//https://www.javascripttutorial.net/javascript-queue/
export class Queue {
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