const express = require("express");
const app = express();
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

function getActiveRooms(io) {
  // Convert map into 2D list:
  // ==> [['4ziBKG9XFS06NdtVAAAH', Set(1)], ['room1', Set(2)], ...]
  const arr = Array.from(io.sockets.adapter.rooms);
  // Filter rooms whose name exist in set:
  // ==> [['room1', Set(2)], ['room2', Set(2)]]
  const filtered = arr.filter(room => !room[1].has(room[0]))
  // Return only the room name: 
  // ==> ['room1', 'room2']
  const res = filtered.map(i => i[0]);
  return res;
}

function getClients(io, roomname) {
  // returns clients in a dictionary
  const clients = io.sockets.adapter.rooms.get(roomname)
  // console.log(y);
  if (clients == undefined) {
    return [];
  }
  const clients_array = Array.from(clients);
  for (var i = 0; i < clients_array.length; i++) { 
    clients_array[i] = dictionary[clients_array[i]];
  }
  return clients_array;
}

// key value pairs of current users
var dictionary = {};

io.on("connection", (socket) => {

  console.log(`User Connected: ${socket.id}`);

  socket.on("host_started_game", ({room}) => {
    console.log("room: ", room);
    socket.to(room).emit("start_game", {room: room});
  });

  socket.on("join_room", ({username, room}) => {
    socket.join(room);

    dictionary[socket.id] = username;
    console.log(dictionary);

    let y = getClients(io, room);
    socket.emit("update_clients", {y: y});
    socket.to(room).emit("update_clients", {y: y});

    console.log(`User with ID: ${socket.id} (username: ${username}) joined room: ${room}`);

    const welcomeMessageData = {
      room: room,
      author: "chatBot", 
      message: `Welcome, ${username}!`,
      time:
        new Date(Date.now()).getHours() +
        ":" +
        new Date(Date.now()).getMinutes(),
    };

    socket.emit("receive_message", welcomeMessageData);

    const messageData = {
      room: room,
      author: "chatBot", 
      message: `${username} has joined the room!`,
      time:
        new Date(Date.now()).getHours() +
        ":" +
        new Date(Date.now()).getMinutes(),
    };

    socket.to(room).emit("receive_message", messageData);
  });

  socket.on("send_message", (data) => {
    socket.to(data.room).emit("receive_message", data);
  });

  socket.on("leave_room", ({username, room}) => {
    console.log(`User with Socket ID: ${socket.id}(username: ${username}) left room: ${room}`);

    const messageData = {
      room: room,
      author: "chatBot",
      message: `${username} has left the room!`,
      time:
        new Date(Date.now()).getHours() +
        ":" +
        new Date(Date.now()).getMinutes(),
    };

    // remove user from key-value pair list
    delete dictionary[socket.id];
    console.log(dictionary);
    
    socket.to(room).emit("receive_message", messageData);
    //io.removeAllListeners("host_started_game");

    socket.leave(room);
    let y = getClients(io, room);
    socket.to(room).emit("update_clients", {y:y});

    // socket.emit("update_clients", {y: y});
    
  });

  socket.on("get_rooms", () => {
    let list = getActiveRooms(io);
    socket.emit("rooms_list", (list));
  });

  socket.on("disconnect", () => {
    console.log("User Disconnected", socket.id);
  });

});

server.listen(3001, () => {
  console.log("SERVER RUNNING");
});
