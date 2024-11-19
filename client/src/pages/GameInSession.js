import React from 'react'
import CardBack from '../components/CardBack'
import './GameInSession.css'
import CardFront from '../components/CardFront'
import HighlightTurn from '../components/HighlightTurn'

const GameInSession = () => {
  return (
    <div className='GameInSession bg-gameroom h-screen
                    flex items-center'>

      <HighlightTurn />

      {/* You-Player's deck */}
      {[...Array(8)].map((_, index) => (
        <CardFront totalCards={8} card_type={'Defuse'}
          position={index} key={`your-card-${index}`}
        />
      ))}

      {/* other players' decks */}
      <div id='left-side' className='fixed left-8'>
        <div id='player-1-CardBacks' className='sticky top-8 object-cover h-max w-24'>
          {/* Player 1 CardBacks placeholder */}
          {[...Array(8)].map((_, index) => (
            <CardBack player='1' position={index} key={`player-1-CardBack-${index}`} />
          ))}
        </div>
        <div id='player-2-CardBacks' className='sticky object-cover h-max w-24'>
          {/* Player 2 CardBacks placeholder */}
          {[...Array(8)].map((_, index) => (
            <CardBack player='2' position={index} key={`player-1-CardBack-${index}`} />
          ))}
        </div>
      </div>

      <div id='center-table' className='flex items-center space-x-2 absolute left-1/2 -translate-x-1/2
                                        2xl:w-60 max-xl:w-44 lg:w-40 max-sm:w-32'>
        <CardBack player='no' />
        <CardBack player='no' />
      </div>

      <div id='right-side' className='fixed right-8'>
        <div id='player-3-CardBacks' className='sticky top-8 object-cover h-max w-24'>
          {/* Player 3 CardBacks placeholder */}
          {[...Array(8)].map((_, index) => (
            <CardBack player='3' position={index} key={`player-1-CardBack-${index}`} />
          ))}
        </div>
        <div id='player-4-CardBacks' className='sticky  object-cover h-max w-24'>
          {/* Player 4 CardBacks placeholder */}
          {[...Array(8)].map((_, index) => (
            <CardBack player='4' position={index} key={`player-1-CardBack-${index}`} />
          ))}
        </div>
      </div>

    </div>
  )
}

export default GameInSession