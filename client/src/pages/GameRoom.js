import React, { useState, useEffect } from 'react';
import Banner from '../components/Banner';
import Button from '../components/Button';
import PlayerList from './PlayerList';
import { socket } from '../socket';
import { useNavigate } from 'react-router-dom';

const GameRoom = () => {
    const navigate = useNavigate();
    const roomID = localStorage.getItem('currentRoom');

    const [players, setPlayers] = useState([]);
    const [gameStart, setGameStart] = useState(false);
    const [isHost, setIsHost] = useState(false);

    useEffect(() => {
        if (!roomID) {
            navigate('/join-create-gameroom');
            return;
        }

        socket.emit('getRoomState', { roomID });

        socket.on("updatePlayers", (roomData) => {
            console.log("Player update received in GameRoom:", roomData);
            if (roomData && roomData.players) {
                const updatedPlayers = roomData.players.map(player => ({
                    name: player.name,
                    status: 1,
                }));
                setPlayers(updatedPlayers);
                setIsHost(roomData.hostId === socket.id);
            }
        });

        socket.on("startGameClient", (data) => {
            setGameStart(true);
            window.location.href = `/room/${roomID}`;
        });

        return () => {
            socket.off("updatePlayers");
            socket.off("startGameClient");
        };
    }, [roomID, navigate]);

    const startGame = () => {
        if (isHost) {
            socket.emit('startGame', { roomID });
        }
    };

    const statusNow = (playerStatus) => {
        if (playerStatus === 0) {
            return "Not Ready";
        } else if (playerStatus === 1) {
            return "Ready";
        }
    }

    return (
        <div className="game_room bg-ek-bg text-ek-txt h-screen flex flex-col justify-center items-center">
            <Banner />
            <div>Game Room Code:
                <span> {roomID}</span>
            </div>

            <PlayerList players={players} statusNow={statusNow} />

            <div className="game_control">
                {!gameStart && (
                    isHost ? (
                        <Button
                            title={players.length < 2 ? 'Waiting for players...' : 'Start Game!'}
                            onClick={startGame}
                            disabled={players.length < 2}
                        />
                    ) : (
                        <Button title='Waiting for host to start game...' disabled={true} />
                    )
                )}
            </div>
        </div>
    );
}

export default GameRoom;