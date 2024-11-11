import React, { useState } from 'react';
import Banner from '../components/Banner';
import Button from '../components/Button';
import PlayerList from './PlayerList';

const GameRoom = () => {
    //place holder for the players' status for backend
    const [players, setPlayers] = useState([
        { name: 'Player 1', status: 0 },
        { name: 'Player 2', status: 1 },
        { name: 'Player 3', status: 1 },
        { name: 'Player 4', status: 0 },
        { name: 'Player 5', status: 1 },
    ]);
    //place holder for room number
    const roomNumber = '011';
    const [GameStart, setGameStart] = useState(true);
    const [currentTurn, setCurrentTurn] = useState(0);

    const startGame = () => {
        setGameStart(true);
    };
    const nextTurn = () => {
        setCurrentTurn((prevTurn) => (prevTurn + 1));
    };

    //place holder from draw card function
    const drawCard = () => {
        alert('Card drawn!');
    };

    //check for status and show it in player's list
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
                <span> {roomNumber}</span>
            </div>

            <PlayerList players={players} statusNow={statusNow} />

            <div className="game_control">
                {!GameStart ? ( // when everyone is ready, redirect to generated private game room
                    <Button title='Waiting for everyone to get ready...' />
                ) : (
                    <Button title='Start Game!' link='/room-011' /> // 011 as placeholder for room ID
                )}
            </div>
        </div>
    )
}

export default GameRoom;