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

    const [selectedCard, setSelectedCard] = useState(null);
    const [selectedCardIndices, setSelectedCardIndices] = useState([]);
    const [showPlayerSelection, setShowPlayerSelection] = useState(false);
    const [showPlayerModal, setShowPlayerModal] = useState(false);
    const [selectedPlayerId, setSelectedPlayerId] = useState(null);
    const [futureCards, setFutureCards] = useState(null);
    const [showNopePrompt, setShowNopePrompt] = useState(false);

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
                currentTurn: roomData.turn || 0,
                discardPile: roomData.discardPile,
                turn: roomData.turn,
            }));
        });

        socket.on("giveCard", ({ from, to, card }) => {
            socket.emit('getRoomState', { roomID });
        });

        socket.on("getResponseForFavor", () => {
            let cardIndex = parseInt(prompt("Index:"))
            socket.emit('receiveResponseForFavor', {cardIndex})
        })

        socket.on("seeTheFuture", (data) => {
            if (data.playerID === localStorage.getItem('id')) {
                setFutureCards(data.future);
                // setTimeout(() => setFutureCards(null), 5000);
            }
        });

        socket.on("getResponseForNope", () => {
            console.log("Received nope request");
            // Check if player has a nope card (id 3)
            const hasNopeCard = gameState.yourHand.some(card => card.id === 3);

            if (hasNopeCard) {
                console.log("Player has nope card, showing prompt");
                setShowNopePrompt(true);
            } else {
                console.log("Player doesn't have nope card, sending automatic pass");
                socket.emit("receiveResponseForNope", {
                    response: 0
                });
            }
        });

        return () => {
            socket.off("updatePlayers");
            socket.off("giveCard");
            socket.off('getResponseForFavor')
            socket.off('getResponseForNope')
            socket.off('seeTheFuture')
        };
    }, [roomID, navigate]);

    const handleCardClick = (index) => {
        const isYourTurn = gameState.players[gameState.currentTurn]?.id === localStorage.getItem('id');
        if (!isYourTurn) {
            console.log("Not your turn");
            return;
        }

        const card = gameState.yourHand[index];
        if (!card) return;

        // Handle Cat Cards
        if (card.id === 8) {
            handleCatCard(index);
            return;
        }

        // Reset any selected cat cards
        setSelectedCardIndices([]);

        // Handle other cards
        switch (card.id) {
            case 5: // Favor
                let favoredPlayerID = selectPlayer()
                socket.emit("cardPlaced", {
                    roomID,
                    givingPlayerID: favoredPlayerID,
                    receivingPlayerID: localStorage.getItem('id'),
                    card,
                    index
                });
                break;
            case 2: // Attack
                let attackedPlayerID = selectPlayer()
                socket.emit("cardPlaced", {
                    roomID,
                    receivingPlayerID: attackedPlayerID,
                    givingPlayerID: localStorage.getItem('id'),
                    card,
                    index
                });
                break;
            case 4: // Skip
            case 6: // Shuffle
            case 7: // See the Future
                socket.emit("cardPlaced", {
                    roomID,
                    playerID: localStorage.getItem('id'),
                    card,
                    index
                });
                break;
            default:
                console.log("Unhandled card type:", card.type);
        }
    };

    const handleCatCard = (index) => {
        if (selectedCardIndices.includes(index)) {
            setSelectedCardIndices(prev => prev.filter(i => i !== index));
        } else {
            if (selectedCardIndices.length < 2) {
                const newSelection = [...selectedCardIndices, index];
                setSelectedCardIndices(newSelection);
                if (newSelection.length === 2) {
                    setShowPlayerSelection(true);
                }
            }
        }
    };

    const selectPlayer = () => {
        let name = prompt("Select a player:")
        return gameState.players.filter((player) => {return player.name === name})[0]["id"]
    }

    // const handlePlayerSelect = (targetPlayer) => {
    //     if (selectedCardIndices.length === 2) {
    //         // Playing two cat cards
    //         const cards = selectedCardIndices.map(index => gameState.yourHand[index]);
    //         socket.emit("cardPlaced", {
    //             roomID,
    //             playerID: localStorage.getItem('id'),
    //             givingPlayerID: localStorage.getItem('id'),
    //             receivingPlayerID: targetPlayer.id,
    //             cards: cards
    //         });
    //         setSelectedCardIndices([]);
    //     } else if (selectedCard !== null) {
    //         // Playing favor card
    //         socket.emit("cardPlaced", {
    //             roomID,
    //             playerID: localStorage.getItem('id'),
    //             givingPlayerID: localStorage.getItem('id'),
    //             receivingPlayerID: targetPlayer.id,
    //             card: gameState.yourHand[selectedCard]
    //         });
    //         setSelectedCard(null);
    //     }
    //     setShowPlayerSelection(false);
    // };
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

    const handleNopeResponse = (useNope) => {
        console.log("Sending nope response:", useNope);
        setShowNopePrompt(false);
        socket.emit("receiveResponseForNope", {
            response: useNope ? 1 : 0
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
            {[...Array(gameState.deckCount)].map((_, index) => (
                <div key={`drawing-deck-${index}`} onClick={handleDrawCard}>
                    <CardBack
                        player='drawing_deck'
                        position={index}
                    />
                </div>
            ))}

            {/* Discard Pile */}
            {[...Array(gameState.discardPile)].map((_, index) => (
                <CardFront playerCard={0}
                           deck={gameState.discardPile.map((card) => card.type.toLowerCase().replaceAll(" ", "_"))} totalCards={gameState.discardPile.length}
                           position={index} key={`your-card-${index}`}
                />
            ))
            }

            {/* Other Players */}
            {gameState.players
                .filter((player) => player.id !== localStorage.getItem('id'))
                .map((player, playerIndex) => (
                    <div
                        key={player.id}
                        className={`player-${player.id}`}
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

            {showPlayerModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white rounded-lg p-6 max-w-sm w-full">
                        <h2 className="text-xl font-bold mb-4">Select a Player</h2>
                        <div className="space-y-2">
                            {gameState.players
                                .filter(player => player.id !== localStorage.getItem('id'))
                                .map(player => (
                                    <button
                                        key={player.id}
                                        onClick={() => window.resolvePlayerSelection(player.id)}
                                        className="w-full p-3 text-left hover:bg-blue-50 rounded-lg transition-colors border border-gray-200"
                                    >
                                        {player.name}
                                    </button>
                                ))}
                        </div>
                    </div>
                </div>
            )}
            {futureCards && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 see-the-future-cards">
                        <h2 className="text-xl font-bold mb-4 text-center">Next 3 Cards</h2>
                        <div className="relative h-72 w-[400px]">  {/* Container for cards */}
                            {futureCards.map((card, index) => (
                                <CardFront
                                    key={index}
                                    playerCard="future"
                                    deck={futureCards.map((card) => {
                                        return card.type.toLowerCase().replaceAll(" ", "_")
                                    })}
                                    totalCards={futureCards.length}
                                    position={index}
                                />
                            ))}
                        </div>
                        <div className="text-center mt-4">
                            <button
                                onClick={() => setFutureCards(null)}
                                className="bg-blue-500 text-white py-2 px-8 rounded-lg hover:bg-blue-600 transition-colors"
                            >
                                OK
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {showNopePrompt && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white see-the-future-cards rounded-lg p-6 max-w-sm w-full">
                        <h2 className="text-xl font-bold mb-4">Another player played a card!</h2>
                        <p className="mb-4">Do you want to use your Nope card?</p>
                        <div className="flex gap-4">
                            <button
                                onClick={() => handleNopeResponse(true)}
                                className="flex-1 bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 transition-colors"
                            >
                                Use Nope
                            </button>
                            <button
                                onClick={() => handleNopeResponse(false)}
                                className="flex-1 bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600 transition-colors"
                            >
                                Don't Use
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {showNopePrompt && (
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-4 rounded z-50">
                    <h3>Would you like to play your Nope card?</h3>
                    <div className="flex gap-2">
                        <Button title="Play Nope" onClick={() => handleNopeResponse(true)} />
                        <Button title="Pass" onClick={() => handleNopeResponse(false)} />
                    </div>
                </div>
            )}
        </div>
    );
};

export default GameInSession;