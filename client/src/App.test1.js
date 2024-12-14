import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from './App';
import LoginSignup from './pages/LoginSignup';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import JoinCreateGameRoom from './pages/JoinCreateGameRoom';

describe('App Component Routing', () => {
  test('renders LoginSignup component on default route', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByText(/login/i)).toBeInTheDocument();
  });

  test('renders LoginPage component on /login route', () => {
    render(
      <MemoryRouter initialEntries={['/login']}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByText(/login page/i)).toBeInTheDocument();
  });

  test('renders RegisterPage component on /register route', () => {
    render(
      <MemoryRouter initialEntries={['/register']}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByText(/register/i)).toBeInTheDocument();
  });

  test('renders JoinCreateGameRoom component on /join-create-game-room route', () => {
    render(
      <MemoryRouter initialEntries={['/join-create-game-room']}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByText(/join or create a game room/i)).toBeInTheDocument();
  });
});
