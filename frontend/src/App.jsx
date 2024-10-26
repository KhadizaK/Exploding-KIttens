import React, {useState} from 'react';
import './App.css'
import banner from './images/banner.png'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Temp from './components/GameBoard';

const App = () => {
    return ( 
        <Router>
            <Routes>
                <Route path="/" element={<Temp />} />
            </Routes>
        </Router>
    /*
    <div id='app'>
        <div className='top'>
            <img className="banner-img" src={banner} alt="Exploding Kittens banner" />
        </div>
        <div className='center'>

        </div>
        <div className='bottom'>
            
        </div>
    </div>
    */

  );
};

export default App;
