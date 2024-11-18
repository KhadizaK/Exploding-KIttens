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
    const roomID = makeid(3);
    rooms[roomID] = {players: [],
      deck: generateDeck()
    };
    console.log(rooms);
    socket.join(roomID);
    socket.emit('gameCreated', rooms[roomID]);
  });
  socket.on('joinGame', (data) => {
    if (rooms[data.roomID]) {
      console.log(data);
      socket.join(data.roomID);
      rooms[data.roomID]["players"].push({
        id: socket.id,
        name: data.playerName,
        hand: [],
      });
      io.to(data.roomID).emit("updatePlayers", rooms[data.roomID])
    }
    else {
      socket.emit("errorDialogue", {text: "This room doesn't exist"})
    }
  })
  socket.on('startGame', (data) => {
    io.to(data.roomID).emit("startGameClient", data)
  })
  socket.on('cardPlaced', (data) => {
    let cardType = data.card
    io.to(data.roomID).emit("updateGameBoard", rooms[data.roomID])
  })
  socket.on('cardPickedUp', (data) => {
    let playerIndex = rooms[data.roomID]["players"].map((room) => {return room.id}).indexOf(data.playerID)
    rooms[data.roomID]["players"][playerIndex]["hand"].push(getNewCard(data.roomID))
    io.to(data.roomID).emit("updateGameBoard", rooms[data.roomID])
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

function getNewCard(roomID) {
  let deck = rooms[roomID]["deck"]
  const chosenCard = deck[0]
  rooms[roomID]["deck"].splice(0, 1)
  return chosenCard
}

function generateDeck() {
  const cards = [
    { type: "Exploding Kitten", count: 4, id: 0},
    { type: "Defuse", count: 6, id: 1},
    { type: "Attack", count: 4, id: 2},
    { type: "Skip", count: 4, id: 3},
    { type: "Favor", count: 4, id: 4},
    { type: "Shuffle", count: 4, id: 5},
    { type: "See the Future", count: 5, id: 6},
    { type: "Cat Card", count: 20, id: 6}
  ];

  const deck = [];
  cards.forEach(card => {
    for (let i = 0; i < card.count; i++) {
      deck.push({id: card.id, type: card.type});
    }
  });
  return shuffleDeck(deck)
}

function shuffleDeck(deck) {
  for (let i = deck.length - 1; i > 0; i--) {
    const randomIndex = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[randomIndex]] = [deck[randomIndex], deck[i]];
  }
  return deck;
}