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

  socket.on('createGame', () => {
    const roomID = makeid(3);
    rooms[roomID] = {
      roomID: roomID,
      players: [],
      deck: generateDeck(),
      discardPile: [],
      turn: 0,
      ranking: [],
      hostId: socket.id
    };
    socket.join(roomID);
    io.to(roomID).emit('gameCreated', rooms[roomID]);
  });

  socket.on('joinGame', (data) => {
    if (rooms[data.roomID]) {
      socket.join(data.roomID);
      socket.join(data.id)
      rooms[data.roomID]["players"].push({
        id: data.id,
        name: data.playerName,
        hand: generateHand(data.roomID, 8),
      });
      io.to(data.roomID).emit("updatePlayers", rooms[data.roomID])
    } else {
      socket.emit("errorDialogue", {text: "This room doesn't exist"})
    }
  });

  socket.on('rejoinGame', (data) => {
    if (rooms[data.roomID]) {
      const playerIDs = rooms[data.roomID]["players"].map((player) => player.id);
      if (playerIDs.includes(data.playerID)) {
        socket.join(data.roomID);
        socket.join(data.playerID);
      }
    }
  });

  socket.on('getRoomState', (data) => {
    if (rooms[data.roomID]) {
      io.to(data.roomID).emit("updatePlayers", rooms[data.roomID]);
    }
  });

  socket.on('startGame', (data) => {
    io.to(data.roomID).emit("startGameClient", data);
  });

  socket.on('cardPlaced', (data) => {
    if (data.cards) {
      initiateNopeCheck(socket, data.roomID, data.givingPlayerID, null, () => {
        const length = data.cards.length;
        if (length === 2) {
          const cards = data.cards;
          const indices = data.indices;
          // Remove cards from giving player's hand
          const givingPlayerIndex = getPlayerIndex(data.roomID, data.givingPlayerID);
          indices.sort((a, b) => b - a).forEach(index => {
            rooms[data.roomID]["players"][givingPlayerIndex]["hand"].splice(index, 1);
          });

          // Add a random card from receiving player's hand
          const receivingPlayerIndex = getPlayerIndex(data.roomID, data.receivingPlayerID);
          const receivingPlayer = rooms[data.roomID]["players"][receivingPlayerIndex];
          const randomCardIndex = Math.floor(Math.random() * receivingPlayer.hand.length);
          const stolenCard = receivingPlayer.hand.splice(randomCardIndex, 1)[0];

          rooms[data.roomID]["players"][givingPlayerIndex]["hand"].push(stolenCard);
          rooms[data.roomID].discardPile.unshift(...cards);

          io.to(data.roomID).emit('giveCard', {
            from: data.receivingPlayerID,
            to: data.givingPlayerID,
            card: stolenCard
          });
        } else if (length === 3) {
          const cards = data.cards;
          const indices = data.indices;
          // Remove cards from giving player's hand
          const givingPlayerIndex = getPlayerIndex(data.roomID, data.givingPlayerID);
          indices.sort((a, b) => b - a).forEach(index => {
            rooms[data.roomID]["players"][givingPlayerIndex]["hand"].splice(index, 1);
          });

          // Take named card from receiving player
          const receivingPlayerIndex = getPlayerIndex(data.roomID, data.receivingPlayerID);
          const cardTypeWanted = data.cardTypeWanted;
          const cardIndex = rooms[data.roomID]["players"][receivingPlayerIndex]["hand"]
              .findIndex(card => card.type === cardTypeWanted);

          if (cardIndex !== -1) {
            const stolenCard = rooms[data.roomID]["players"][receivingPlayerIndex]["hand"].splice(cardIndex, 1)[0];
            rooms[data.roomID]["players"][givingPlayerIndex]["hand"].push(stolenCard);
            rooms[data.roomID].discardPile.unshift(...cards);

            io.to(data.roomID).emit('giveCard', {
              from: data.receivingPlayerID,
              to: data.givingPlayerID,
              card: stolenCard
            });
          }
        }
        io.to(data.roomID).emit("updatePlayers", rooms[data.roomID]);
      });
      return;
    }

    let card = data.card;
    rooms[data.roomID]["players"][getPlayerIndex(data.roomID, data.playerID || data.givingPlayerID)]["hand"].splice(data.index, 1);
    rooms[data.roomID].discardPile.unshift(card);
    io.to(data.roomID).emit('giveCard', {
      from: data.playerID || data.givingPlayerID,
      to: 'pile',
      card: card
    });

    switch (card.id) {
      case 2: // Attack
        initiateNopeCheck(socket, data.roomID, data.givingPlayerID, data.receivingPlayerID, () => {
          let cards = attackCard(data.roomID, data.receivingPlayerID).slice(-2);
          io.to(data.roomID).emit('giveCards', {
            from: "deck",
            to: data.playerID,
            cards: cards
          });
        });
        break;

      case 4: // Skip
        initiateNopeCheck(socket, data.roomID, data.playerID, null, () => {
          skipCard(data.roomID);
          io.to(data.roomID).emit("updatePlayers", rooms[data.roomID]);
        });
        break;

      case 5: // Favor
        initiateNopeCheck(socket, data.roomID, data.receivingPlayerID, data.givingPlayerID, () => {
          initiateFavorRequest(socket, data.roomID, data.receivingPlayerID, data.givingPlayerID);
        });
        break;

      case 6: // Shuffle
        initiateNopeCheck(socket, data.roomID, data.playerID, null, () => {
          shuffleCard(data.roomID);
          io.to(data.roomID).emit("updatePlayers", rooms[data.roomID]);
        });
        break;

      case 7: // See the Future
        initiateNopeCheck(socket, data.roomID, data.playerID, null, () => {
          let future = seeTheFutureCard(data.roomID);
          io.to(data.roomID).emit('seeTheFuture', {
            playerID: data.playerID,
            future: future
          });
        });
        break;
    }
  });

  socket.on('cardPickedUp', (data) => {
    let playerIndex = getPlayerIndex(data.roomID, data.playerID);
    let card = getNewCard(data.roomID);
    if (card.id === 0) {
      let response = explodingKittenCard(data.roomID, data.playerID);
      if (response === 1) {
        io.to(data.roomID).emit('placeExplodingKitten', {
          roomID: data.roomID,
          playerID: data.playerID
        });
      } else {
        io.to(data.roomID).emit('playerLost', { playerID: data.playerID });
      }
    } else {
      rooms[data.roomID]["players"][playerIndex]["hand"].push(card);
      nextTurn(data.roomID);
      io.to(data.roomID).emit('giveCard', {
        from: 'deck',
        to: data.playerID,
        card: card
      });
    }
  });

  socket.on('receiveResponseForFavor', (data) => {
    const roomID = data.roomID
    console.log(JSON.stringify(data))
    const receivingPlayerIndex = getPlayerIndex(roomID, data.receivingPlayerID);
    const givingPlayerIndex = getPlayerIndex(roomID, data.givingPlayerID);

    if (data.cardIndex >= rooms[roomID]["players"][givingPlayerIndex]["hand"].length) {
      return;
    }

    const card = rooms[roomID]["players"][givingPlayerIndex]["hand"].splice(data.cardIndex, 1)[0];
    rooms[roomID]["players"][receivingPlayerIndex]["hand"].push(card);

    io.to(roomID).emit('giveCard', {
      from: data.givingPlayerID,
      to: data.receivingPlayerID,
      card: card
    });

    io.to(roomID).emit("updatePlayers", rooms[roomID]);
  });

  socket.on('receiveResponseForNope', (data) => {
    const roomID = data.roomID
    if (data.response === 1) {
      const playerIndex = getPlayerIndex(roomID, data.playerID);
      const nopeCardIndex = getCardIndex(roomID, data.playerID, 3);

      if (nopeCardIndex !== -1) {
        rooms[roomID]["players"][playerIndex]["hand"].splice(nopeCardIndex, 1);
        rooms[roomID].discardPile.unshift({"id": 3, "type": "Nope"});
        io.to(roomID).emit("updatePlayers", rooms[roomID]);
      }
    }
  });

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

function attackCard(roomID, playerID) {
  let playerIndex = getPlayerIndex(roomID, playerID)
  rooms[roomID]["players"][playerIndex]["hand"].push(getNewCard(roomID))
  rooms[roomID]["players"][playerIndex]["hand"].push(getNewCard(roomID))
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

function initiateNopeCheck(socket, roomID, cardPlacedPlayerID, playerID, onComplete) {
  let players = rooms[roomID]["players"].filter((player) => player.id !== cardPlacedPlayerID);
  if (playerID) {
    const targetPlayerIndex = getPlayerIndex(roomID, playerID);
    players = targetPlayerIndex !== -1 ? [players[targetPlayerIndex]] : [];
  }

  let playersWithNopes = players.filter((player) => {
    if(player) {
      return getCardIndex(roomID, player.id, 3) > -1;
    }
  });

  if (playersWithNopes.length === 0) {
    onComplete();
    return;
  }

  let currentPlayerIndex = 0;
  let nopeUsed = false;

  function checkNextPlayer() {
    if (currentPlayerIndex >= playersWithNopes.length || nopeUsed) {
      if (!nopeUsed) onComplete();
      return;
    }

    let currentPlayer = playersWithNopes[currentPlayerIndex];
    io.to(currentPlayer.id).emit('getResponseForNope');
  }

  checkNextPlayer();
}

function initiateFavorRequest(socket, roomID, receivingPlayerID, givingPlayerID) {
  const givingPlayerHand = rooms[roomID]["players"][getPlayerIndex(roomID, givingPlayerID)]["hand"];
  io.to(givingPlayerID).emit('getResponseForFavor', {
    requestingPlayer: receivingPlayerID
  });
}