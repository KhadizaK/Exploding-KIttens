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
        deckCount: 16,
        roomID: ''
    });

    const [selectedCard, setSelectedCard] = useState(null);
    const [selectedCardIndices, setSelectedCardIndices] = useState([]);
    const [showPlayerSelection, setShowPlayerSelection] = useState(false);
    const [showPlayerModal, setShowPlayerModal] = useState(false);
    const [selectedPlayerId, setSelectedPlayerId] = useState(null);
    const [futureCards, setFutureCards] = useState(null);
    const [favorCards, setFavorCards] = useState(null);
    const [showNopePrompt, setShowNopePrompt] = useState(false);
    const [currentAction, setCurrentAction] = useState(null);
    const [showFavorCardSelection, setShowFavorCardSelection] = useState(false);
    const [showExplodingKittenPrompt, setShowExplodingKittenPrompt] = useState(false);
    const [showWinScreen, setShowWinScreen] = useState(false);
    const [showLoseScreen, setShowLoseScreen] = useState(false);
    const [gameResults, setGameResults] = useState(null);
    const [showStealCardModal, setShowStealCardModal] = useState(false);
    const [stealableCards, setStealableCards] = useState([]);
    const [stealCardData, setStealCardData] = useState(null);

    useEffect(() => {
        if (!roomID) {
            navigate('/join-create-gameroom');
            return;
        }

        socket.emit('getRoomState', { roomID });
        socket.emit('rejoinGame', {roomID: roomID, playerID: localStorage.getItem('id')});

        socket.on("updatePlayers", (roomData) => {
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

        socket.on("getResponseForFavor", (data) => {
            setShowFavorCardSelection(true);
            setSelectedPlayerId(data.requestingPlayer); // Store who requested the favor
            setFavorCards(gameState.yourHand);
        });

        socket.on("seeTheFuture", (data) => {
            if (data.playerID === localStorage.getItem('id')) {
                setFutureCards(data.future);
            }
        });

        socket.on("getResponseForNope", () => {
            setShowNopePrompt(true);

        });

        socket.on("placeExplodingKitten", (data) => {
            if (data.playerID === localStorage.getItem('id')) {
                setShowExplodingKittenPrompt(true);
            }
        });

        socket.on("playerLost", (data) => {
            if (data.playerID === localStorage.getItem('id')) {
                setShowLoseScreen(true);
            }
        });

        socket.on("gameOver", (data) => {
            const isWinner = data.winner === localStorage.getItem('id');
            setGameResults(data);
            if (isWinner) {
                setShowWinScreen(true);
            }
        });

        socket.on('selectCardToSteal', (data) => {
            setStealableCards(data.hand);
            setStealCardData(data);
            setShowStealCardModal(true);
        });

        return () => {
            socket.off("updatePlayers");
            socket.off("giveCard");
            socket.off('getResponseForFavor');
            socket.off('getResponseForNope');
            socket.off('seeTheFuture');
            socket.off("placeExplodingKitten");
            socket.off("playerLost")
            socket.off("gameOver")
            socket.off('selectCardToSteal');
        };
    }, [roomID, navigate]);

    const handleReturnToLobby = () => {
        navigate('/join-create-gameroom');
    };

    const handleFavorCardSelection = (cardIndex) => {
        setShowFavorCardSelection(false);
        socket.emit('receiveResponseForFavor', {
            cardIndex,
            roomID: roomID,
            givingPlayerID: localStorage.getItem('id'),
            receivingPlayerID: currentAction === 'favor' ? selectedCard : selectedPlayerId
        });
        setSelectedCard(null);
        setSelectedPlayerId(null);
    };

    const handleCardClick = (index) => {
        const isYourTurn = gameState.players[gameState.currentTurn]?.id === localStorage.getItem('id');
        if (!isYourTurn) {
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
                setCurrentAction('favor');
                setShowPlayerModal(true);
                setSelectedCard(index);
                break;
            case 2: // Attack
                setCurrentAction('attack');
                setShowPlayerModal(true);
                setSelectedCard(index);
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
        }
    };

    const handleCatCard = (index) => {
        if (selectedCardIndices.includes(index)) {
            setSelectedCardIndices(prev => prev.filter(i => i !== index));
        } else {
            const selectedCard = gameState.yourHand[index];
            const currentSelected = [...selectedCardIndices];

            // Check if we're selecting cards of the same type
            if (currentSelected.length > 0) {
                const firstCard = gameState.yourHand[currentSelected[0]];
                if (firstCard.type !== selectedCard.type) {
                    return; // Don't allow selection of different cat card types
                }
            }

            if (currentSelected.length < 3) {
                const newSelection = [...currentSelected, index];
                setSelectedCardIndices(newSelection);
                if (newSelection.length >= 2) {
                    setCurrentAction('cats');
                    setShowPlayerModal(true);
                }
            }
        }
    };

    const handlePlayerSelection = (targetPlayerId) => {
        setShowPlayerModal(false);

        if (currentAction === 'cats') {
            // Playing multiple cat cards
            const cards = selectedCardIndices.map(index => gameState.yourHand[index]);
            socket.emit("cardPlaced", {
                roomID,
                playerID: localStorage.getItem('id'),
                givingPlayerID: localStorage.getItem('id'),
                receivingPlayerID: targetPlayerId,
                cards: cards,
                indices: selectedCardIndices
            });
            setSelectedCardIndices([]);
        } else if (currentAction === 'favor') {
            socket.emit("cardPlaced", {
                roomID,
                givingPlayerID: targetPlayerId,
                receivingPlayerID: localStorage.getItem('id'),
                card: gameState.yourHand[selectedCard],
                index: selectedCard
            });
            setSelectedCard(null);
        } else if (currentAction === 'attack') {
            socket.emit("cardPlaced", {
                roomID,
                receivingPlayerID: targetPlayerId,
                givingPlayerID: localStorage.getItem('id'),
                card: gameState.yourHand[selectedCard],
                index: selectedCard
            });
            setSelectedCard(null);
        }

        setCurrentAction(null);
    };

    const handleDrawCard = () => {
        const isYourTurn = gameState.players[gameState.currentTurn]?.id === localStorage.getItem('id');
        if (!isYourTurn) return;

        socket.emit("cardPickedUp", {
            roomID,
            playerID: localStorage.getItem('id')
        });
    };

    const handleNopeResponse = (useNope) => {
        setShowNopePrompt(false);
        socket.emit("receiveResponseForNope", {
            roomID: roomID,
            playerID: localStorage.getItem('id'),
            response: useNope ? 1 : 0
        });
    };

    const handleExplodingKittenPlacement = (position) => {
        setShowExplodingKittenPrompt(false);
        socket.emit("placeExplodingKittenResponse", {
            roomID,
            playerID: localStorage.getItem('id'),
            position: position
        });
    };

    const handleStealCardSelection = (cardIndex) => {
        setShowStealCardModal(false);
        socket.emit('cardToStealSelected', {
            roomID,
            cardIndex,
            receivingPlayerID: stealCardData.receivingPlayerID,
            givingPlayerID: stealCardData.givingPlayerID
        });
        setStealCardData(null);
        setStealableCards([]);
    };

    const getPosition = (turn) => {
        if(gameState.players[turn] === localStorage.getItem('id')){
            return 0
        }
        let playerIDs = gameState.players.map((player) => {return player.id})
        let playerIDsWithOutCurrentPlayer = playerIDs.filter((player) => {return player !== localStorage.getItem('id')})
        playerIDsWithOutCurrentPlayer.unshift(localStorage.getItem('id'))
        return playerIDsWithOutCurrentPlayer.indexOf(playerIDs[turn])

    }

    const openMenu = () => setVisible(true);
    const resumeGame = () => setVisible(false);

    return (
        <div className='GameInSession bg-gameroom h-screen flex items-center'>
            <div className="absolute top-4 right-4">
                <Button title='Pause' onClick={openMenu}/>
            </div>
            <GameMenu Visible={visible} Resume={resumeGame}/>

            <HighlightTurn pos={getPosition(gameState.currentTurn) + 1}/>

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
            {gameState.discardPile.length === 0 ? 0 : [...Array(gameState.discardPile)].map((_, index) => (
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
                                player={(playerIndex + 1).toString()}
                                position={cardIndex}
                                key={`player-${player.id}-card-${cardIndex}`}
                                totalPlayers={gameState.players.length}
                            />
                        ))}
                    </div>
                ))}

            {/* Player Selection Modal */}
            {
                showPlayerModal &&
                (
                <div className="select-player fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-sm w-full">
                        <h2 className="text-xl font-bold mb-4">
                            {currentAction === 'cats'
                                ? `Select a Player to Steal
                                   from (${selectedCardIndices.length} cat cards)`
                                : currentAction === 'favor'
                                    ? 'Select a Player to Ask for a Favor'
                                    : 'Select a Player to Attack'}
                        </h2>
                        <div className="space-y-2">
                            {gameState.players
                                .filter(player => player.id !== localStorage.getItem('id'))
                                .map(player => (
                                    <button
                                        key={player.id}
                                        onClick={() => handlePlayerSelection(player.id)}
                                        className="w-full p-3 text-left hover:bg-blue-50 rounded-lg transition-colors border border-gray-200"
                                    >
                                        {player.name} ({player.hand.length} cards)
                                    </button>
                                ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Future Cards Modal */}
            {
                futureCards &&
                (
                <div className="see-the-future-cards fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6">
                        <h2 className="text-xl font-bold mb-4 text-center">Next 3 Cards</h2>
                        <div className="relative h-72 w-[400px]">
                            {futureCards.map((card, index) => (
                                <CardFront
                                    key={index}
                                    playerCard="future"
                                    deck={futureCards.map((card) => card.type.toLowerCase().replaceAll(" ", "_"))}
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

            {/* Nope Card Modal */}
            {
                showNopePrompt &&
                (
                <div className="modal nope-modal fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-sm w-full">
                        <h2 className="text-xl font-bold mb-4">Card Action in Progress!</h2>
                        <p className="mb-6 text-gray-600">Another player has played a card. Would you like to counter it
                            with your Nope card?</p>
                        <div className="flex gap-4">
                            <button
                                onClick={() => handleNopeResponse(true)}
                                className="flex-1 bg-red-500 text-white py-3 px-4 rounded-lg hover:bg-red-600 transition-colors font-medium"
                            >
                                Play Nope
                            </button>
                            <button
                                onClick={() => handleNopeResponse(false)}
                                className="flex-1 bg-gray-500 text-white py-3 px-4 rounded-lg hover:bg-gray-600 transition-colors font-medium"
                            >
                                Let It Happen
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {
                showFavorCardSelection &&
                (
                    <div className="modal fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-lg p-6 max-w-4xl w-full">
                            <h2 className="text-xl font-bold mb-4">Select a Card to Give</h2>
                            <p className="mb-6 text-gray-600">A player has asked you for a favor. Select a card from your
                                hand to give them.</p>
                            <div className="relative h-72 w-[400px]">
                                {gameState.yourHand.map((card, index) => (
                                    <div key={`your-card-${index}`} onClick={() => handleFavorCardSelection(index)}>
                                        <CardFront
                                            key={index}
                                            playerCard="future"
                                            deck={gameState.yourHand.map((card) => card.type.toLowerCase().replaceAll(" ", "_"))}
                                            totalCards={gameState.yourHand.length}
                                            position={index}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            {
                showExplodingKittenPrompt &&
                (
                <div className="modal fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-sm w-full">
                        <h2 className="text-xl font-bold mb-4">You Drew an Exploding Kitten!</h2>
                        <p className="mb-6 text-gray-600">You defused it! Where would you like to place it in the deck?</p>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <span className="text-gray-700">Position in deck:</span>
                                <input
                                    type="number"
                                    min="0"
                                    max={gameState.deckCount}
                                    className="border rounded px-3 py-2 w-24"
                                    placeholder="0"
                                    onChange={(e) => {
                                        const value = Math.min(Math.max(0, parseInt(e.target.value) || 0), gameState.deckCount);
                                        e.target.value = value;
                                    }}
                                />
                            </div>
                            <button
                                onClick={() => {
                                    const input = document.querySelector('.modal input[type="number"]');
                                    handleExplodingKittenPlacement(parseInt(input.value) || 0);
                                }}
                                className="w-full bg-blue-500 text-white py-3 px-4 rounded-lg hover:bg-blue-600 transition-colors font-medium"
                            >
                                Place Card
                            </button>
                        </div>
                        <p className="mt-4 text-sm text-gray-500">
                            Position 0 is the top of the deck, {gameState.deckCount} is the bottom
                        </p>
                    </div>
                </div>
            )}
            {
                showLoseScreen &&
                (
                <div className="lose-modal modal fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-8 max-w-md w-full text-center">
                        <div className="mb-6">
                            <h2 className="text-4xl font-bold text-red-500 mb-2">💥 BOOM! 💥</h2>
                            <p className="text-xl text-gray-700">You've been eliminated!</p>
                            <p className="text-gray-500 mt-2">
                                The exploding kitten got you! Better luck next time.
                            </p>
                        </div>

                        <div className="mb-6">
                            <p className="text-lg">You can:</p>
                            <ul className="mt-2 space-y-2 text-gray-600">
                                <li>• Watch the rest of the game</li>
                                <li>• Return to lobby for a new game</li>
                            </ul>
                        </div>

                        <div className="space-x-4">
                            <button
                                onClick={() => setShowLoseScreen(false)}
                                className="bg-gray-500 text-white py-3 px-6 rounded-lg hover:bg-gray-600 transition-colors font-medium"
                            >
                                Watch Game
                            </button>
                            <button
                                onClick={handleReturnToLobby}
                                className="bg-blue-500 text-white py-3 px-6 rounded-lg hover:bg-blue-600 transition-colors font-medium"
                            >
                                Return to Lobby
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {
                showWinScreen &&
                (
                <div className="win-modal modal fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-8 max-w-md w-full text-center transform scale-110">
                        <div className="mb-6">
                            <h2 className="text-4xl font-bold text-yellow-500 mb-2">🎉 VICTORY! 🎉</h2>
                            <p className="text-xl text-gray-700">You've won the game!</p>
                        </div>

                        {gameResults && gameResults.ranking && (
                            <div className="mb-6">
                                <h3 className="text-lg font-semibold mb-2">Final Rankings</h3>
                                <div className="space-y-2">
                                    {gameResults.ranking.map((player, index) => (
                                        <div
                                            key={player.id}
                                            className={`p-2 rounded ${
                                                player.id === localStorage.getItem('id')
                                                    ? 'bg-yellow-100 font-bold'
                                                    : 'bg-gray-100'
                                            }`}
                                        >
                                            {index + 1}. {player.name}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        <button
                            onClick={handleReturnToLobby}
                            className="bg-blue-500 text-white py-3 px-8 rounded-lg hover:bg-blue-600 transition-colors font-medium"
                        >
                            Return to Lobby
                        </button>
                    </div>
                </div>
            )}
            {
                showStealCardModal &&
                (
                    <div className="modal fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-lg p-6 max-w-4xl w-full">
                            <h2 className="text-xl font-bold mb-4">Select a Card to Steal</h2>
                            <p className="mb-6 text-gray-600">Your cat cards let you steal one of these cards!</p>
                            <div>
                            <div className="relative h-72 w-[400px]">
                                {stealCardData.hand.map((card, index) => (
                                    <div key={`your-card-${index}`} onClick={() => handleStealCardSelection(index)}>
                                        <CardFront
                                            key={index}
                                            playerCard="future"
                                            deck={stealCardData.hand.map((card) => "card_back")}
                                            totalCards={stealCardData.hand.length}
                                            position={index}
                                        />
                                    </div>
                                ))}
                            </div>
                            </div>
                        </div>
                    </div>
                )}

        </div>
    );
};

export default GameInSession;