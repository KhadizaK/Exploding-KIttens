import React, { useState } from 'react';
import Button from '../components/Button';
import Banner from '../components/Banner';

const JoinCreateGameRoom = () => {
  // State to control the current view
  const [isJoiningGame, setIsJoiningGame] = useState(false);

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
            className='rounded p-1' />
          <Button title='Submit' link='/' />
        </div>
      ) : (
        // Default view with buttons
        <div className='join-create-gameroom-buttons flex flex-col items-center space-y-2'>
          <Button title='Join Game Room' onClick={() => setIsJoiningGame(true)} />
          <Button title='Create Game Room' link='/' />
        </div>
      )}
    </div>
  );
};

export default JoinCreateGameRoom;
