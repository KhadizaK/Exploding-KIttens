import React, { useState } from 'react';
import './GameRoomList.css';
import Button from '../components/Button';
import Banner from '../components/Banner';

const GameRoomList = () => {

    const [gameRooms, setGameRooms] = useState([
        { roomNumber: '011', players: 5, gameStarted: false },
        { roomNumber: '012', players: 4, gameStarted: true },
        { roomNumber: '013', players: 2, gameStarted: false },
        { roomNumber: '014', players: 5, gameStarted: true },
        { roomNumber: '024', players: 5, gameStarted: true },
        { roomNumber: '034', players: 5, gameStarted: true },
        { roomNumber: '045', players: 5, gameStarted: true },
    ]);

    const [searchQuery, setSearchQuery] = useState('');
    const filteredRooms = gameRooms.filter(room =>
        room.roomNumber.includes(searchQuery)
    );

    return (
        <div className="game_room_list bg-ek-bg text-ek-txt h-screen flex flex-col justify-center items-center space-y-4">
            <Banner />
            <h1>Enter Room Number Code:</h1>
            <input
                type="text"
                placeholder="Enter code..."
                className="search_bar"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
            />
            <h1>Available Game Rooms:</h1>
            <div className="room_list">
                {filteredRooms.map((room, index) => (
                    <div
                        key={index}
                        className="rooms"
                    >
                        <div>
                            <h2>Room Number: {room.roomNumber}</h2>
                            <p>Players: {room.players}</p>
                            <p>Status: {room.gameStarted ? 'In Progress' : 'Not Started'}</p>
                        </div>
                        <Button title='Join' link='/room-011' />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default GameRoomList;
