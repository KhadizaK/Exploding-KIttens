import React, { useState } from 'react';
import Button from '../components/Button';
import Banner from '../components/Banner';
import { useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';

const JoinCreateGameRoom = () => {
  //State to control the current view
  const [isJoiningGame, setIsJoiningGame] = useState(false);
  const [roomID, setRoomID] = useState("");

  //Location used to retrieve state info from browser
  const location = useLocation();
  const playerName = location.state.playerName;
  
  //Save info to pass to next page
  const routeState = {playerName, roomID};

  //TODO: use this function to actually make a room other can connect to
  function generateRoomID() {
    return Math.floor(100 + Math.random() * 900);
  }

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

          {/* TODO: make this generate a roomID and actually create a room that others can connect to */}
          <Link to="game-room" state={routeState}>
            <Button title='Create Game Room' />
          </Link>
        </div>
        
      )}
    </div>
  );
};

export default JoinCreateGameRoom;
