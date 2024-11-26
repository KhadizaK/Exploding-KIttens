import React, { useState } from "react";
import CardBack from '../components/CardBack'
import './GameInSession.css'
import CardFront from '../components/CardFront'
import HighlightTurn from '../components/HighlightTurn'
import GameMenu from '../components/GameMenu'
import Button from '../components/Button';

const GameInSession = () => {
  const [Visible, setVisible] = useState(false);
  const openMenu = () => {
    setVisible(true);
  };
  const resumeGame= () => {
    setVisible(false);
  };

  var player_1_deck = ['defuse', 'attack', 'nope', 'mercat',
    'knight_cat', 'reveal_the_future', 'shuffle', 'troll_cat']
  var player_1_card_count = player_1_deck.length

  return (
    <div className='GameInSession bg-gameroom h-screen
                    flex items-center'>
      <div className="absolute top-4 right-4">
        <Button title='Pause' onClick={openMenu} />
      </div>
      <GameMenu Visible={Visible} Resume={resumeGame} />

      <HighlightTurn />

      {/* You-Player-1's deck */}
      {[...Array(player_1_card_count)].map((_, index) => (
        <CardFront playerCard={1}
          deck={player_1_deck} totalCards={player_1_card_count}
          position={index} key={`your-card-${index}`}
        />
      ))}

      {/* Discarded Deck*/}
      {[...Array(2)].map((_, index) => (
        <CardFront playerCard={0}
          deck={['attack', 'defuse']} totalCards={[].length}
          position={index} key={`your-card-${index}`}
        />
      ))}

      {/* Drawing Deck*/}
      {[...Array(16)].map((_, index) => (
        <CardBack player='drawing_deck' position={index} key={`drawing-deck-CardBack-${index}`} />
      ))}

      {/* OTHER PLAYERS' DECKS */}

      {/* Player 2 CardBacks placeholder */}
      {[...Array(8)].map((_, index) => (
        <CardBack player='3' position={index} key={`player-2-CardBack-${index}`} />
      ))}

      {/* Player 3 CardBacks placeholder */}
      {[...Array(8)].map((_, index) => (
        <CardBack player='2' position={index} key={`player-3-CardBack-${index}`} />
      ))}

      {/* Player 4 CardBacks placeholder */}
      {[...Array(8)].map((_, index) => (
        <CardBack player='4' position={index} key={`player-4-CardBack-${index}`} />
      ))}

      {/* Player 5 CardBacks placeholder */}
      {[...Array(8)].map((_, index) => (
        <CardBack player='5' position={index} key={`player-5-CardBack-${index}`} />
      ))}

    </div>
  )
}

export default GameInSession