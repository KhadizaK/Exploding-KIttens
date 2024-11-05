import './App.css';
import { useState } from 'react';
import PreGameLayout from './components/PreGameLayout';
import LoginSignup from './pages/LoginSignup';
import JoinGame from './pages/JoinGame';
import EnterGameCode from './pages/EnterGameCode';

const App = () => {
    // State to manage which component to display
    const [currentPage, setCurrentPage] = useState('login');

    // Function to change the page
    const changePage = (page) => {
        setCurrentPage(page);
    };

    return (
        <PreGameLayout>
            {currentPage === 'login' && <LoginSignup changePage={changePage} />}
            {currentPage === 'game-selection' && <JoinGame changePage={changePage} />}
            {currentPage === 'enter-code' && <EnterGameCode changePage={changePage} />}
        </PreGameLayout>
    );
};

export default App;
