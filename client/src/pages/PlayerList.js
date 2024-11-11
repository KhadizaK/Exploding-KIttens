import React from 'react';
import './PlayerList.css';

const PlayerList = ({ players, statusNow }) => {
    return (
        <div className="player_list">
            <h2>Players: </h2>
            <ul>
                {players.map((player, index) => (
                    <li key={index}>
                        {player.name} ({statusNow(player.status)})
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default PlayerList;