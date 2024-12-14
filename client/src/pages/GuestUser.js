import React from 'react';
import Button from '../components/Button';
import Banner from '../components/Banner';
import { useState } from "react";
import { Link } from 'react-router-dom';

const GuestUser = () => {

    const [playerName, setPlayerName] = useState("");
    const routeState = {playerName};
    
    return (
        <div className='JoinCreateGameRoom bg-ek-bg text-ek-txt h-screen flex flex-col justify-center items-center space-y-4'>
            <Banner />

            <div className='flex flex-col items-center space-y-2'>
                <div className='enter-game-code flex flex-col items-center space-y-2'>
                    <label className=''>Enter Display Name:</label>
                    <input 
                        type='text' 
                        placeholder='Screen name here...' 
                        className='rounded p-1'
                        onChange={(event) => {
                           setPlayerName(event.target.value)}}
                    />
                    <Link to="/join-create-gameroom" state={routeState}> <Button title='Submit' /> </Link>
                </div>
            </div>
        </div>
    )
}

export default GuestUser