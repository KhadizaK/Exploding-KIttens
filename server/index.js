const express = require("express");
const app = express();
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const { Socket } = require("dgram");
app.use(cors());

let rooms = {}

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log(`User Connected: ${socket.id}`);

  socket.on("send_message", (data) => {
    console.log(data);
    socket.broadcast.emit("receive_message", data);
  });
  socket.on('createGame', (data) => {
    const roomID = makeid(6);
    rooms[roomID] = {players: []};
    console.log(rooms);
    socket.join(roomID);
    socket.emit('gameCreated', rooms[roomID]);
  });
  socket.on('joinGame', (data) => {
    if (rooms[data.roomID]) {
      console.log(data);
      socket.join(data.roomID);
      rooms[data.roomID]["players"].push(socket.id);
      io.to(data.roomID).emit("updatePlayers", rooms[data.roomID])
    }
    else {
      socket.emit("errorDialogue", {text: "This room doesn't exist"})
    }
  })
  socket.on('startGame', (data) => {
    io.to(data.roomID).emit("startGameClient", data)
  })
});

server.listen(3001, () => {
  console.log("SERVER IS RUNNING  ");
});

function makeid(length) {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}