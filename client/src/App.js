import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginSignup from './pages/LoginSignup';
import LoginPage from './pages/LoginPage';

const App = () => {
  return (
    <div className='App bg-ek-bg h-screen flex justify-center items-center'>
      {/* <Button /> */}
      <Routes>
        <Route path="/" element={<LoginSignup />} />
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </div>
  )
}

export default App