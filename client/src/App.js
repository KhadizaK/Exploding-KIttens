import React from 'react'
import { Routes, Route } from 'react-router-dom';
import LoginSignup from './pages/LoginSignup';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import GuestUser from './pages/GuestUser';
import JoinCreateGameRoom from './pages/JoinCreateGameRoom';
import GameRoom from './pages/GameRoom';
import GameInSession from './pages/GameInSession';
import GameRoomList from './pages/GameRoomList';
import "./App.css";


const App = () => {
  return (
    <div className='App bg-ek-bg h-screen flex justify-center items-center'>
      {/* <Button /> */}
      <Routes>
        <Route path="/" element={<LoginSignup />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/guest-user" element={<GuestUser />} />
        <Route path="/join-create-game-room" element={<JoinCreateGameRoom />} />
        <Route path="/game-room" element={<GameRoom />} />
        <Route path="/room-011" element={<GameInSession />} />  {/* 011 as placeholder for room ID */}
        <Route path="/game-room-list" element={<GameRoomList />} />
      </Routes>
    </div>
  )
}


export default App