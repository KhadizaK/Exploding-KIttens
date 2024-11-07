# Exploding-Kittens

Welcome to the **Exploding Kittens Online** project! Our goal is to make an interactive, online version of the popular card game **Exploding Kittens**, designed for multiple players to enjoy the game together.

## Overview

Exploding Kittens is a strategic, family-friendly card game where players draw cards from a deck and try to avoid drawing an exploding kitten card. Our goal is to recreate this fun experience online, allowing players to connect, strategize, and compete with friends or others around the world.

## How to Play
1. Each player starts with a hand of cards.
2. On your turn, draw a card from the deck.
3. Try to avoid drawing an Exploding Kitten card.
4. Use action cards to skip turns, shuffle the deck, peek at the top cards, or defuse an exploding kitten.
5. The last player remaining wins the game.

## Project Structure
- `client/`: Contains React app with Socket.IO integration.
- `server/`: Contains Express server setup.

## Setup Instructions

### Client Setup
1. Navigate to the `client` folder:
   ```bash
   cd client
2. Install client dependencies:
   ```bash
   yarn install
3. Start the client:
   ```bash
   yarn start

### Server Setup
1. Navigate to the `server` folder:
   ```bash
   cd server
2. Install client dependencies:
   ```bash
   yarn install
3. Start the client:
   ```bash
   yarn start

## Development Workflow

1. Ensure both client and server are running for full-stack functionality.
2. Before commiting code use `yarn lint` and `yarn format` in each folder (client or server) to check for code style issues. (Currently, lint and format does not work for client).

## Linting & Formatting

1. ESLint and Prettier are configured to enforce consistent coding style.
2. Run the following command to auto-format code:
   ```bash
   yarn format

   

<!---## Features

- **Multiplayer Gameplay**: Play with friends or random users online in real-time.
- **Interactive User Interface**: Enjoy a sleek and intuitive user interface designed for easy card selection and gameplay.
- **Game Mechanics**: All the classic Exploding Kittens rules implemented, including actions like drawing, skipping, shuffling, defusing, and exploding!
- **Cross-platform Support**: Play across different devices seamlessly.


## Getting Started

### Prerequisites

To get started with the project, you’ll need the following tools installed:

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/Exploding-Kittens.git
-->
