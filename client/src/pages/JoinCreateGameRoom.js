import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import Banner from '../components/Banner';
import { useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { socket } from '../socket';

/*
const JoinCreateGameRoom = () => {
  //State to control the current view
  const [isJoiningGame, setIsJoiningGame] = useState(false);
  const [roomID, setRoomID] = useState("");

  //Location used to retrieve state info from browser
  const location = useLocation();
  const playerName = location.state.playerName;
  
  //Save info to pass to next page
  const routeState = {playerName, roomID};

  return (
    <div className='JoinCreateGameRoom bg-ek-bg text-ek-txt h-screen flex flex-col justify-center items-center space-y-4'>
      <Banner />
      
      {isJoiningGame ? (
        // If "Join Game Room" is clicked, show input field
        <div className='enter-game-code flex flex-col items-center space-y-2'>
          <label className=''>Enter Game Room Code:</label>
          <input 
            type='text' 
            placeholder='Enter code...' 
            className='rounded p-1'
            onChange={(event) => {
              setRoomID(event.target.value)
            }}
          />
          <Link to="/game-room" state={routeState}>
            <Button title='Submit'/>
          </Link>
        </div>
      ) : (
        // Default view with buttons
        <div className='join-create-gameroom-buttons flex flex-col items-center space-y-2'>
          <h1> Welcome, {playerName} </h1>
          <Button title='Join Game Room' onClick={() => setIsJoiningGame(true)} />
          <Link to="/game-room" state={routeState}>
            <Button title='Create Game Room' />
          </Link>
        </div>
      )}
    </div>
  );
*/

const JoinCreateGameRoom = () => {
    const navigate = useNavigate();
    const [isJoiningGame, setIsJoiningGame] = useState(false);
    const [roomCode, setRoomCode] = useState('');
    const [playerName, setPlayerName] = useState(localStorage.getItem('playerName') || '');
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        socket.on("gameCreated", (roomData) => {
            console.log("Room created:", roomData);
            socket.emit('joinGame', {
                roomID: roomData.roomID,
                playerName: playerName
            });
        });

        socket.on("updatePlayers", (roomData) => {
            console.log("Update players received:", roomData);
            localStorage.setItem('currentRoom', roomData.roomID);
            navigate('/gameroom');
        });

        socket.on("errorDialogue", (data) => {
            setErrorMessage(data.text);
            setTimeout(() => setErrorMessage(''), 3000);
        });

        return () => {
            socket.off("gameCreated");
            socket.off("updatePlayers");
            socket.off("errorDialogue");
        };
    }, [navigate, playerName]);

    const handleCreateGame = () => {
        if (!validatePlayerName()) return;
        localStorage.setItem('playerName', playerName);
        socket.emit('createGame');
    };

    const handleJoinGame = (e) => {
        e.preventDefault();
        if (!validatePlayerName()) return;
        if (!validateRoomCode()) return;

        localStorage.setItem('playerName', playerName);
        socket.emit('joinGame', {
            roomID: roomCode,
            playerName: playerName
        });
    };

    const validatePlayerName = () => {
        if (!playerName.trim()) {
            setErrorMessage('Please enter your name');
            return false;
        }
        if (playerName.length > 20) {
            setErrorMessage('Name must be 20 characters or less');
            return false;
        }
        return true;
    };

    const validateRoomCode = () => {
        if (!roomCode.trim()) {
            setErrorMessage('Please enter a room code');
            return false;
        }
        return true;
    };

    return (
        <div className='JoinCreateGameRoom bg-ek-bg text-ek-txt h-screen flex flex-col justify-center items-center space-y-4'>
            <Banner />

            {errorMessage && (
                <div className="bg-red-500 text-white px-4 py-2 rounded-md">
                    {errorMessage}
                </div>
            )}

            <div className="mb-4">
                <label className="block text-center mb-2">Enter Your Name:</label>
                <input
                    type="text"
                    placeholder="Your name..."
                    className="rounded p-1"
                    value={playerName}
                    onChange={(e) => setPlayerName(e.target.value)}
                    maxLength={20}
                />
            </div>

            {isJoiningGame ? (
                <div className='enter-game-code flex flex-col items-center space-y-2'>
                    <label>Enter Game Room Code:</label>
                    <input
                        type='text'
                        placeholder='Enter code...'
                        className='rounded p-1'
                        value={roomCode}
                        onChange={(e) => setRoomCode(e.target.value)}
                    />
                    <div className="space-x-2">
                        <Button
                            title='Join Game'
                            onClick={handleJoinGame}
                        />
                        <Button
                            title='Back'
                            onClick={() => setIsJoiningGame(false)}
                        />
                    </div>
                </div>
            ) : (
                <div className='join-create-gameroom-buttons flex flex-col items-center space-y-2'>
                    <Button
                        title='Join Game Room'
                        onClick={() => setIsJoiningGame(true)}
                    />
                    <Button
                        title='Create Game Room'
                        onClick={handleCreateGame}
                    />
                </div>
            )}
        </div>
    );
};

export default JoinCreateGameRoom;