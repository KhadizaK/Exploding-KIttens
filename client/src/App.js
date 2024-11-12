import React from 'react'
import { Routes, Route } from 'react-router-dom';
import LoginSignup from './pages/LoginSignup';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import JoinCreateGameRoom from './pages/JoinCreateGameRoom';
import GameRoom from './pages/GameRoom';
import GameInSession from './pages/GameInSession';
import GameRoomList from './pages/GameRoomList';

const App = () => {
  return (
    <div className='App bg-ek-bg h-screen flex justify-center items-center'>
      {/* <Button /> */}
      <Routes>
        <Route path="/" element={<LoginSignup />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/join-create-gameroom" element={<JoinCreateGameRoom />} />
        <Route path="/gameroom" element={<GameRoom />} />
        <Route path="/room-011" element={<GameInSession />} />  {/* 011 as placeholder for room ID */}
        <Route path="/gameroomlist" element={<GameRoomList />} />
      </Routes>
    </div>
  )
}

export default App