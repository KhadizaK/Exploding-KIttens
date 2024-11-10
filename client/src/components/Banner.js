import React from 'react'
import banner from '../assets/banner.png'

const Banner = () => {
    return (
        <a className='Banner' href='/'>
            <img className='drop-shadow-lg rounded-md object-cover w-full h-3/6 h-24' src={banner} alt='Exploding Kittens banner' />
        </a>
    )
}

export default Banner