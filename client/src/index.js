import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import JoinCreateGameRoom from './pages/JoinCreateGameRoom';
import GameRoom from './pages/GameRoom';
import GameInSession from './pages/GameInSession';

const router = createBrowserRouter([
  { path:'/', element:<App /> },
  { path:'/login', element:<LoginPage /> },
  { path:'/register', element:<RegisterPage /> },
  { path:'/join-create-gameroom', element:<JoinCreateGameRoom /> },
  { path:'/gameroom', element:<GameRoom />},
  { path:'/room-011', element:<GameInSession />}, // 011 as placeholder for room ID
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
