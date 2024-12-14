import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CardBack from '../components/CardBack';
import './GameInSession.css';
import CardFront from '../components/CardFront';
import HighlightTurn from '../components/HighlightTurn';
import GameMenu from '../components/GameMenu';
import Button from '../components/Button';
import { socket } from '../socket';

const GameInSession = () => {
    const navigate = useNavigate();
    const roomID = localStorage.getItem('currentRoom');
    const [visible, setVisible] = useState(false);
    const [gameState, setGameState] = useState({
        players: [],
        currentTurn: 0,
        yourHand: [],
        discardPile: [],
        deckCount: 16
    });

    useEffect(() => {
        if (!roomID) {
            navigate('/join-create-gameroom');
            return;
        }

        socket.emit('getRoomState', { roomID });
        socket.emit('rejoinGame', {roomID: roomID, playerID: localStorage.getItem('id')})
        socket.on("updatePlayers", (roomData) => {
            console.log("Update received:", roomData);
            console.log("Current localStorage ID:", localStorage.getItem('id'));
            const currentPlayer = roomData.players.find(p => p.id === localStorage.getItem('id'));
            setGameState(prev => ({
                ...prev,
                players: roomData.players,
                yourHand: currentPlayer ? currentPlayer.hand : [],
                deckCount: roomData.deck ? roomData.deck.length : 16,
                currentTurn: roomData.turn || 0
            }));
        });

        socket.on("giveCard", ({ from, to, card }) => {
            socket.emit('getRoomState', { roomID });
        });

        socket.on("seeTheFuture", ({ playerID, future }) => {
            if (playerID === localStorage.getItem('id')) {
                setFutureCards(future);
                setTimeout(() => setFutureCards(null), 5000);
            }
        });

        return () => {
            socket.off("updatePlayers");
            socket.off("giveCard");
        };
    }, [roomID, navigate]);

    const handleCardClick = (index) => {
        return;
    }

    const handlePlayerSelect = (targetPlayer) => {
        return;
    }
    const handleDrawCard = () => {
        const isYourTurn = gameState.players[gameState.currentTurn]?.id === localStorage.getItem('id');

        if (!isYourTurn) {
            console.log("Not your turn");
            return;
        }

        socket.emit("cardPickedUp", {
            roomID,
            playerID: localStorage.getItem('id')
        });
    };

    const openMenu = () => setVisible(true);
    const resumeGame = () => setVisible(false);

    return (
        <div className='GameInSession bg-gameroom h-screen flex items-center'>
            <div className="absolute top-4 right-4">
                <Button title='Pause' onClick={openMenu} />
            </div>
            <GameMenu Visible={visible} Resume={resumeGame} />

            <HighlightTurn />

            {/* Your Hand */}
            <div className="player-hand">
                {[...Array(gameState.yourHand.length)].map((_, index) => (
                    <div key={`your-card-${index}`} onClick={() => handleCardClick(index)}>
                        <CardFront
                            playerCard={1}
                            deck={gameState.yourHand.map((card) => card.type.toLowerCase().replaceAll(" ", "_"))}
                            totalCards={gameState.yourHand.length}
                            position={index}
                        />
                    </div>
                ))}
            </div>

            {/* Drawing Deck */}
            <div className="drawing_deck">
                {[...Array(gameState.deckCount)].map((_, index) => (
                    <div key={`drawing-deck-${index}`} onClick={handleDrawCard}>
                        <CardBack
                            player='drawing_deck'
                            position={index}
                        />
                    </div>
                ))}
            </div>

            {/* Discard Pile */}
            <div className="discard-pile absolute top-1/2 left-1/2 transform translate-x-8 -translate-y-1/2">
                {gameState.discardPile.length > 0 && (
                    <CardFront
                        playerCard={0}
                        deck={[gameState.discardPile[gameState.discardPile.length - 1].type.toLowerCase().replaceAll(" ", "_")]}
                        totalCards={1}
                        position={0}
                    />
                )}
            </div>

            {/* Other Players */}
            {gameState.players
                .filter((player) => player.id !== localStorage.getItem('id'))
                .map((player, playerIndex) => (
                    <div
                        key={player.id}
                        className={`player-${player.id}`}
                        onClick={() => promptType === 'selectPlayer' && handlePlayerSelect(player)}
                    >
                        {[...Array(player.hand?.length || 0)].map((_, cardIndex) => (
                            <CardBack
                                player={(playerIndex + 1    ).toString()}
                                position={cardIndex}
                                key={`player-${player.id}-card-${cardIndex}`}
                                totalPlayers={gameState.players.length}
                            />
                        ))}
                        <div className="text-white text-center">{player.name}</div>
                    </div>
                ))}
        </div>
    );
};

export default GameInSession;