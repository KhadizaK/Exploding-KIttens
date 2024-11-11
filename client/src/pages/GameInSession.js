import React from 'react'
import Card from '../components/Card'
import './GameInSession.css'

const GameInSession = () => {
    return (
        <div className='GameInSession bg-gameroom h-screen
                    flex items-center'>

            <div id='left-table' className='h-fit flex flex-col space-y-20'>
                <div id='player-1-cards' className='flex -rotate-90'>
                    {/* Player 1 cards placeholder */}
                    {[...Array(8)].map((_, index) => (
                        <Card position={index} key={`player-1-card-${index}`} />
                    ))}
                </div>
                <div id='player-2-cards' className='flex rotate-90'>
                    {/* Player 2 cards placeholder */}
                    {[...Array(8)].map((_, index) => (
                        <Card position={index} key={`player-1-card-${index}`} />
                    ))}
                </div>
            </div>

            <div id='center-table' className='flex items-center space-x-2 absolute left-1/2 -translate-x-1/2 
                                                2xl:w-48 max-xl:w-44 lg:w-40 max-md:w-36 max-sm:w-24 max-sm:space-x-1'>
                <Card isPlayer={0} />
                <Card isPlayer={0} />
            </div>

            <div id='right-table' className='h-fit flex flex-col space-y-20'>
                <div id='player-3-cards' className='flex -rotate-90'>
                    {/* Player 3 cards placeholder */}
                    {[...Array(8)].map((_, index) => (
                        <Card position={index} key={`player-1-card-${index}`} />
                    ))}
                </div>
                <div id='player-4-cards' className='flex rotate-90'>
                    {/* Player 4 cards placeholder */}
                    {[...Array(8)].map((_, index) => (
                        <Card position={index} key={`player-1-card-${index}`} />
                    ))}
                </div>
            </div>

        </div>
    )
}

export default GameInSession