import React, { useState } from 'react';
import Banner from '../components/Banner';
import Button from '../components/Button';
import PlayerList from './PlayerList';

const GameRoom = () => {
    //place holder for the players' status for backend
    const [players, setPlayers] = useState([
        { name: 'Player 1', status: 0 },
        { name: 'Player 2', status: 0 },
        { name: 'Player 3', status: 0 },
      ]);
    //place holder for room number
    const roomNumber = '011';
    const [GameStart, setGameStart] = useState(false);
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
            <h1>Gameroom: {roomNumber}</h1>
            {!GameStart ? (
                //this is the playerlist, see PlayerList.js
                <PlayerList players={players} statusNow={statusNow} />
            ) : (
            <>
            <div className="turn">
                <h2>{players[currentTurn].name}'s Turn</h2>
            </div>
            </>
            )}
            <div className="game_control">
                {!GameStart ? (
                <Button title='Start Game' onClick={startGame}/>
                ) : (
                <>
                <Button title='Draw Card' onClick={drawCard}/>
                <div className="your_cards">
                    <h2>Your Cards</h2>
                </div>
                </>
                )}
            </div>
        </div>
    )
}

export default GameRoom;