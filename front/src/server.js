const { Server, Origins } = require('boardgame.io/server');
import TicTacToe from './components/Game';
+console.log("My game object is", TicTacToe);

const server = Server({
  games: [TicTacToe],
  origins: [Origins.LOCALHOST],
});

server.run(8000);