import React from 'react'
import banner from '../assets/banner.png'

const Banner = () => {
    return (
        <a className='Banner' href='/'>
            <img className='drop-shadow-lg rounded-md object-cover w-full h-24 hover:brightness-90' 
            src={banner} alt='Exploding Kittens banner' />
        </a>
    )
}

export default Banner