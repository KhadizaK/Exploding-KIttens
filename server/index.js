// Dependencies
const express = require("express");
const app = express();
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const { Socket } = require("dgram");
const Database = require('better-sqlite3');
const fs = require('fs');

// Run server
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

// Database
const dbFileName = 'kittens.db';
if (!fs.existsSync(dbFileName)) {
  console.log('Database does not exist. Creating a new one...');
  
  const db = new Database(dbFileName);
  db.exec('PRAGMA foreign_keys = ON;');

  // Create a tables
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      playerID INTEGER PRIMARY KEY,
      username VARCHAR(64),
      password VARCHAR(64),
      screenname VARCHAR(64)
    )
  `);

  db.exec(`
  CREATE TABLE IF NOT EXISTS history (
    gameID INTEGER PRIMARY KEY,
    time DATETIME,
    player1 INTEGER,
    player2 INTEGER,
    player3 INTEGER,
    player4 INTEGER,
    player5 INTEGER,
    winner INTEGER,
    FOREIGN KEY (player1) REFERENCES users(playerID),
    FOREIGN KEY (player2) REFERENCES users(playerID),
    FOREIGN KEY (player3) REFERENCES users(playerID),
    FOREIGN KEY (player4) REFERENCES users(playerID),
    FOREIGN KEY (player5) REFERENCES users(playerID),
    FOREIGN KEY (winner) REFERENCES users(playerID)
    )
  `);

  console.log('Database created and tables initialized.');
} else {
  console.log('Database already exists.');
}

// Server Functions
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

// Database Functions

function addUser(username, password, screenname) {
  // Generate a new playerID
  const getMaxIDStmt = db.prepare('SELECT MAX(playerID) AS maxID FROM users');
  const maxIDRow = getMaxIDStmt.get();
  const newPlayerID = (maxIDRow?.maxID || 0) + 1; // Start from 1 if table is empty

  // Insert the new user
  const stmt = db.prepare(`
    INSERT INTO users (playerID, username, password, screenname)
    VALUES (?, ?, ?, ?)
  `);
  try {
    const result = stmt.run(newPlayerID, username, password, screenname);
    console.log('User added with playerID:', newPlayerID);
    return newPlayerID;
  } catch (error) {
    console.error('Error adding user:', error.message);
    throw error;
  }
}

function getUserByUsername(username) {
  const stmt = db.prepare('SELECT * FROM users WHERE username = ?');
  return stmt.get(username);
}

function getUsers() {
  const stmt = db.prepare('SELECT * FROM users');
  return stmt.all();
}

function logGame(time, players, winner) {
  const stmt = db.prepare(`
    INSERT INTO history (time, player1, player2, player3, player4, player5, winner)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);
  try {
    const result = stmt.run(
      time,
      players[0] || null,
      players[1] || null,
      players[2] || null,
      players[3] || null,
      players[4] || null,
      winner
    );
    console.log('Game logged:', result.lastInsertRowid);
    return result.lastInsertRowid;
  } catch (error) {
    console.error('Error logging game:', error.message);
    throw error;
  }
}

function getGameHistory() {
  const stmt = db.prepare(`
    SELECT h.gameID, h.time, 
           u1.screenname AS player1,
           u2.screenname AS player2,
           u3.screenname AS player3,
           u4.screenname AS player4,
           u5.screenname AS player5,
           uw.screenname AS winner
    FROM history h
    LEFT JOIN users u1 ON h.player1 = u1.playerID
    LEFT JOIN users u2 ON h.player2 = u2.playerID
    LEFT JOIN users u3 ON h.player3 = u3.playerID
    LEFT JOIN users u4 ON h.player4 = u4.playerID
    LEFT JOIN users u5 ON h.player5 = u5.playerID
    LEFT JOIN users uw ON h.winner = uw.playerID
    ORDER BY h.time DESC
  `);
  return stmt.all();
}