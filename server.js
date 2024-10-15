const express = require('express');
const app = express();
const http = require('http');
const path = require('path');
const server = http.createServer(app);
const { Server } = require('socket.io');
const io = new Server(server);
const rooms = {}; // Store room information

app.use(express.static(path.join(__dirname)));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/client/index.html'));
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

io.on('connection', (socket) => {
    console.log('a user has connected');
    socket.on('createGame', () => {
        const roomID = makeid(6)
        rooms[roomID] = {players: []}
        socket.join(roomID);
        socket.emit("gameCreated", {roomID: roomID})
    })
    socket.on('joinGame', (data) => {
        if (rooms[data.roomID]) {
            socket.join(data.roomID);
            rooms[data.roomID]["players"].push(data["playerName"]);
            io.to(data.roomID).emit('updatePlayers', rooms[data.roomID]);
        }
        else {
            console.log("This room doesn't exist")
        }
    });
})

server.listen(3000, () => {
    console.log('listening on *:3000');
})