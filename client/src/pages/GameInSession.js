import React from 'react'
import Card from '../components/Card'
import './GameInSession.css'

const GameInSession = () => {
    return (
        <div className='GameInSession bg-gameroom h-screen
                    flex items-center'>

            <div id='left-side' className='fixed left-8'>
                <div id='player-1-cards' className='sticky top-8 object-cover h-max w-24'>
                    {/* Player 1 cards placeholder */}
                    {[...Array(8)].map((_, index) => (
                        <Card player='1' position={index} key={`player-1-card-${index}`} />
                    ))}
                </div>
                <div id='player-2-cards' className='sticky object-cover h-max w-24'>
                    {/* Player 2 cards placeholder */}
                    {[...Array(8)].map((_, index) => (
                        <Card player='2' position={index} key={`player-1-card-${index}`} />
                    ))}
                </div>
            </div>

            <div id='center-table' className='flex items-center space-x-2 absolute left-1/2 -translate-x-1/2
                                                    2xl:w-60 max-xl:w-44 lg:w-40 max-sm:w-32'>
                <Card player='no' />
                <Card player='no' />
            </div>

            <div id='right-side' className='fixed right-8'>
                <div id='player-3-cards' className='sticky top-8 object-cover h-max w-24'>
                    {/* Player 3 cards placeholder */}
                    {[...Array(8)].map((_, index) => (
                        <Card player='3' position={index} key={`player-1-card-${index}`} />
                    ))}
                </div>
                <div id='player-4-cards' className='sticky  object-cover h-max w-24'>
                    {/* Player 4 cards placeholder */}
                    {[...Array(8)].map((_, index) => (
                        <Card player='4' position={index} key={`player-1-card-${index}`} />
                    ))}
                </div>
            </div>

        </div>
    )
}

export default GameInSession