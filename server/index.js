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
    rooms[roomID] = {
      roomID: roomID,
      players: [],
      deck: generateDeck(),
      turn: 0,
      ranking: []
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
        hand: generateHand(data.roomID, 6),
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
    let nopeResponse;
    // Check if two/three 'Cat Cards' were placed
    if (data.cards) {
      nopeResponse = nopeCard(socket, data.roomID, data.givingPlayerID)
      if (nopeResponse.response === 1) {
        return;
      }
      let length = data.cards.length
      if (length == 2) {
        let card = twoCatCards(data.roomID, data.receivingPlayerID, data.givingPlayerID, data.cardIndex).at(-1)
        io.to(data.roomID).emit('giveCard', {
          from: data.givingPlayerID,
          to: data.receivingPlayerID,
          card: card
        })
      }
      else {
        let card = threeCatCards(data.roomID, data.receivingPlayerID, data.givingPlayerID, data.cardID).at(-1)
        io.to(data.roomID).emit('giveCard', {
          from: data.givingPlayerID,
          to: data.receivingPlayerID, card: card
        })
      }
      return;
    }
    let card = data.card
    switch (card.id) {
      case 2: // Attack
        nopeResponse = nopeCard(socket, data.roomID, data.playerID)
        if (nopeResponse.response === 1) {
          break;
        }
        let cards = attackCard(data.roomID, data.playerID).slice(-2)
        io.to(data.roomID).emit('giveCards', {
          from: data.givingPlayerID,
          to: data.receivingPlayerID,
          cards: cards
        })
        break;
      case 4: // Skip
        nopeResponse = nopeCard(socket, data.roomID)
        if (nopeResponse.response === 1) {
          break;
        }
        skipCard(data.roomID)
        break;
      case 5: // Favor
        nopeResponse = nopeCard(socket, data.roomID, data.givingPlayerID)
        if (nopeResponse.response === 1) {
          break;
        }
        let card = favorCard(data.roomID, data.receivingPlayerID, data.givingPlayerID).at(-1)
        io.to(data.roomID).emit('giveCard', {
          from: data.givingPlayerID,
          to: data.receivingPlayerID,
          card: card
        })
        break;
      case 6: // Shuffle
        nopeResponse = nopeCard(socket, data.roomID)
        if (nopeResponse.response === 1) {
          break;
        }
        shuffleCard(data.roomID)
        break;
      case 7: // See the Future
        nopeResponse = nopeCard(socket, data.roomID)
        if (nopeResponse.response === 1) {
          break;
        }
        let future = seeTheFutureCard(data.roomID)
        io.to(data.roomID).emit('seeTheFuture', {
          playerID: data.playerID,
          future: future
        })
        break;
    }
  })
  socket.on('cardPickedUp', (data) => {
    let playerIndex = getPlayerIndex(data.roomID, data.playerID)
    let card = getNewCard(data.roomID)
    if (card.id === 0) {
      let response = explodingKittenCard(data.roomID, data.playerID)
      if (response === 1){
        io.to(data.roomID).emit('placeExplodingKitten', {roomID: data.roomID, playerID: data.playerID})
      }
      else {
        io.to(data.roomID).emit('playerLost', {playerID: data.playerID})
      }
    }
    else {
      rooms[data.roomID]["players"][playerIndex]["hand"].push(card)
      nextTurn(data.roomID)
      io.to(data.roomID).emit('giveCard', {
        from: 'deck',
        to: data.playerID,
        card: card
      })
    }
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

function shuffleDeck(deck) {
  for (let i = deck.length - 1; i > 0; i--) {
    const randomIndex = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[randomIndex]] = [deck[randomIndex], deck[i]];
  }
  return deck;
}

function getCardIndex(roomID, playerID, cardID){
  let playerIndex = getPlayerIndex(roomID, playerID)
  return rooms[roomID]["players"][playerIndex]["hand"].map((card) => {return card.id}).indexOf(cardID)
}

function getPlayerIndex(roomID, playerID){
  return rooms[roomID]["players"].map((player) => {return player.id}).indexOf(playerID)
}

function nextTurn(roomID){
  let numberOfPlayers = rooms[roomID]["players"].length
  rooms[roomID]["turn"] = (rooms[roomID]["turn"] + 1) % numberOfPlayers
  io.to(roomID).emit('nextTurn')
  return rooms[roomID]["turn"]
}

function getNewCard(roomID) {
  let deck = rooms[roomID]["deck"]
  const chosenCard = deck[0]
  rooms[roomID]["deck"].splice(0, 1)
  return chosenCard
}

function playerLoses(roomID, playerID) {
  let playerIndex = getPlayerIndex(roomID, playerID)
  let player = rooms[roomID]["players"].splice(playerIndex, 1)[0]
  delete player.hand;
  rooms[roomID]["ranking"].unshift(player)
  checkGameOver(roomID)
}

function checkGameOver(roomID) {
  let numberOfPlayers = rooms[roomID]["players"].length
  if (numberOfPlayers === 1) {
    let winner = rooms[roomID]["players"][0]["id"]
    io.to(roomID).emit('gameOver', {winner: winner})
  }
}

function generateDeck() {
  const cards = [
    { type: "Exploding Kitten", count: 4, id: 0},
    { type: "Defuse", count: 6, id: 1},
    { type: "Attack", count: 4, id: 2},
    { type: "Nope", count: 4, id: 3},
    { type: "Skip", count: 4, id: 4},
    { type: "Favor", count: 4, id: 5},
    { type: "Shuffle", count: 4, id: 6},
    { type: "See the Future", count: 5, id: 7},
    { type: "Cat Card", count: 20, id: 8}
  ];

  const deck = [];
  cards.forEach(card => {
    for (let i = 0; i < card.count; i++) {
      deck.push({id: card.id, type: card.type});
    }
  });
  return shuffleDeck(deck)
}

function placeCardInDeck(roomID, card, index){
  rooms[roomID]["deck"].splice(index, 0, card)
}

function generateHand(roomID, size) {
  function handContainsExpKit(hand) {
    return hand.filter((card) => {
      return card.id == 0
    }).length > 0
  }

  function replaceAllExpKit(hand) {
    return hand.map((card) => {
      if (card.id === 0) {
        randomIndex = Math.floor(Math.random() * (rooms[roomID]["deck"].length + 1))
        placeCardInDeck(roomID, card, randomIndex)
        return getNewCard(roomID)
      } else {
        return card
      }
    })
  }

  let hand = rooms[roomID]["deck"].splice(0, size)
  while (handContainsExpKit(hand)) {
    hand = replaceAllExpKit(hand)
  }
  return hand
}

function shuffleCard(roomID){
  let deck = rooms[roomID]["deck"]
  rooms[roomID]["deck"] = shuffleDeck(deck)
  return rooms[roomID]["deck"]
}

function seeTheFutureCard(roomID){
  let deck = rooms[roomID]["deck"]
  end = Math.min(3, deck.length)
  return deck.slice(0, end)
}

function favorCard(socket, roomID, receivingPlayerID, givingPlayerID) {
  function getCardIndexFromPlayer(socket, roomID, playerID) {
    return new Promise((resolve, reject) => {
      io.to(playerID).emit('getResponseForFavor')

      socket.once('receiveResponseForFavor', (data) => {
        if (data) {
          resolve(data.cardIndex);
        } else {
          reject(new Error('No response from client'));
        }
      });
    });
  }

  let receivingPlayerIndex = getPlayerIndex(roomID, receivingPlayerID)
  let givingPlayerIndex = getPlayerIndex(roomID, givingPlayerID)
  let cardIndex = await getCardIndexFromPlayer(socket, roomID, givingPlayerID)
  if (cardIndex >= rooms[roomID]["players"][givingPlayerIndex]["hand"].length){
    return {error: 'Card not in hand'}
  }
  let card = rooms[roomID]["players"][givingPlayerIndex]["hand"].splice(cardIndex, 1)[0]
  rooms[roomID]["players"][receivingPlayerIndex]["hand"].push(card)
  return rooms[roomID]["players"][receivingPlayerIndex]["hand"]
}

function attackCard(roomID, playerID) {
  let playerIndex = getPlayerIndex(roomID, playerID)
  rooms[roomID]["players"][playerIndex]["hand"].push(getNewCard(roomID), getNewCard(roomID))
  return rooms[roomID]["players"][playerIndex]["hand"]
}

function twoCatCards(roomID, receivingPlayerID, givingPlayerID, cardIndex){
  return favorCard(roomID, receivingPlayerID, givingPlayerID, cardIndex)
}

function threeCatCards(roomID, receivingPlayerID, givingPlayerID, cardID){
  let receivingPlayerIndex = getPlayerIndex(roomID, receivingPlayerID)
  let givingPlayerIndex = getPlayerIndex(roomID, givingPlayerID)
  let cardIndex = getCardIndex(roomID, givingPlayerID, cardID)
  if (cardIndex == -1){
    return {error: 'Card not in hand'}
  }
  let card = rooms[roomID]["players"][givingPlayerIndex]["hand"].splice(cardIndex, 1)[0]
  rooms[roomID]["players"][receivingPlayerIndex]["hand"].push(card)
  return rooms[roomID]["players"][receivingPlayerIndex]["hand"]
}

function skipCard(roomID){
  return nextTurn(roomID)
}

function explodingKittenCard(roomID, playerID) {
  let playerIndex = getPlayerIndex(roomID, playerID)
  let defuseIndex = getCardIndex(roomID, playerID, 1)
  if (defuseIndex > -1) {
    rooms[roomID]["players"][playerIndex]["hand"].splice(defuseIndex, 1)
    return 1
  }
  else {
    playerLoses(roomID, rooms[roomID]["players"][playerIndex]["id"])
    return 2
  }
}

async function nopeCard(socket, roomID, playerID) {
  function getResponseForNope(socket, playerID) {
    return new Promise((resolve, reject) => {
      io.to(playerID).emit('getResponseForNope')

      socket.once('receiveResponseForNope', (data) => {
        if (data) {
          resolve(data.response);
        } else {
          reject(new Error('No response from client'));
        }
      });
      setTimeout(() => {
        resolve(0);
      }, 10000);
    });
  }

  let players = rooms[roomID]["players"]
  if (playerID) {
    players = [players[getPlayerIndex(roomID, playerID)]]
  }
  let playersWithNopes = players.filter((player) => {
    return getCardIndex(roomID, player.id, 3) > -1
  })
  let response = 0
  for (let player of playersWithNopes) {
    response = await getResponseForNope(socket, player.id)
    if (response === 1) {
      return {playerID: player.id, response: response}
    }
  }
  return {response: response}
}