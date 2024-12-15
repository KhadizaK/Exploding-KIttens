## Socket.IO Example Calls

### createGame
#### Structure of `data`:
```
socket.emit("createGame")
```

### gameCreated
#### Structure of `data`: 
```json 
{ 
  roomID: string, 
  players: array, 
  deck: array, 
  turn: number, 
  ranking: array
}
```
```
socket.on("gameCreated", (data) => {
    // Function to handle when game has been created
})
```

### joinGame
####  Structure of `data`: 
```json 
{ 
  roomID: string, 
  playerName: string
}
```
```

socket.emit("joinGame", data)
```

### updatePlayers
#### Structure of `data`: 
```json 
{ 
  roomID: string, 
  players: array,
  deck: array,
  turn: number,
  ranking: array
}
```

```
socket.on("updatePlayers", (data) => {
    // Function to handle updatePlayers for players when another player leaves/joins
})
```

### startGame
#### Structure of `data`: 
```json
{ 
  roomID: string
}
```

```
socket.emit("startGame", data)
```
### startGameClient
#### Structure of `data`: 
```json
{ 
  roomID: string
}
```

```
socket.on("startGameClient", (data) => {
    // Function to handle what happens when game is started
})
```

### cardPlaced: Attack
#### Structure of `data`: 
```json
{ 
  roomID: string,
  playerID: string,
  card: 
    { 
      id: 2, 
      type: "Attack"
    }
}
```
```
socket.emit("cardPlaced", data)
```

### cardPlaced: Skip
#### Structure of `data`: 
```json 
{ 
  roomID: string,
  card: 
    { 
      id: 4, 
      type: "Skip"
    }
}
```
```
socket.emit("cardPlaced", data)
```

### cardPlaced: Favor
#### Structure of `data`: 
```json
{ 
  roomID: string,
  givingPlayerID: string, 
  receivingPlayerID: string, 
  card: 
    { 
      id: 5, 
      type: "Favor"
    }
}
```

```
socket.emit("cardPlaced", data)
```

### cardPlaced: Shuffle
#### Structure of `data`: 
```json
{
  roomID: string,
  card: 
    {
      id: 6,
      type: "Shuffle"
    }
}
```

```
socket.emit("cardPlaced", data)
```

### cardPlaced: See the Future
#### Structure of `data`: 
```json

{ 
  roomID: string,
  playerID: string,
  card: 
    { id: 7,
      type: "See the Future"
    }
}
```

```
socket.emit("cardPlaced", data)
```

### cardPickedUp
#### Structure of `data`: 
```json

{
  roomID: string, 
  playerID: string
}
```

```
socket.emit("cardPickedUp", data)
```

### giveCard 
#### Structure of `data`: 
```json
{ 
  from: string,
  to: string,
  card: 
    { 
      id: number,
      type: string
    }
}
```
```
socket.on("giveCard", (data) => {
    // Function to handle animation to give card from the "from" playerID to the "to" playerID. "from" could also be "deck", in which case the animation, would be from deck to player
})
```
### playerLost
#### Structure of `data`: 
```json
{
  playerID: string
}
```
``` 
socket.on("playerLost", (data) => {
    // Code to handle when a player has lost
})
```

### gameOver
#### Structure of `data`: 
```json
{ 
  winner: string
}
```

```
socket.on("gameOver", (data) => {
    // Function to handle gameOver animation
})
```

### nextTurn
```
socket.on("nextTurn", () => {
    // Function to handle turn incrementing
})
```