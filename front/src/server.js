const { Server, Origins } = require('boardgame.io/server');
import BreadsticksGame from './components/Game';
+console.log("My game object is", BreadsticksGame);

const server = Server({
  games: [BreadsticksGame],
  origins: [Origins.LOCALHOST],
});

server.run(8000);