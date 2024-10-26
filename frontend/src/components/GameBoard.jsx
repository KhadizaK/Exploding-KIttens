import React, {useState} from "react";
import './GameBoard.css';
import PlayerView from "./PlayerView";

const GameBoard = () => {
    return (
        <div className="gameboard">
            <h2>Main Game Room</h2>
            <button>Draw a card</button>
            <PlayerView/>
        </div>
    )
}
export default GameBoard;