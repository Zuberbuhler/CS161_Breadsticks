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

io.on("connection", (socket) => {
  console.log(`User Connected: ${socket.id}`);

  socket.on("join_room", ({username, room}) => {
    socket.join(room);
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
    
    socket.to(room).emit("receive_message", messageData);
  });

  socket.on("disconnect", () => {
    console.log("User Disconnected", socket.id);
  });
});

server.listen(3001, () => {
  console.log("SERVER RUNNING");
});
