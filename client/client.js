const socket = io();
const createGame = document.querySelector("#create-game")

createGame.addEventListener("click", () =>{
    socket.emit("createGame")
})

const roomID = new URLSearchParams(window.location.search).get('room')

if (roomID) {
    playerName = prompt("What's your name?")
    socket.emit("joinGame", data = {roomID: roomID, playerName: playerName})
}

socket.on("updatePlayers", (data) => {
    const playersList = document.querySelector("#players-list")
    playersList.innerText = data["players"].join("\n")
});

socket.on("gameCreated", (data) => {
    window.location.href = "?room=" + data["roomID"]
})