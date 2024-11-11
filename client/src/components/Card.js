import React from 'react'
import back from '../assets/ek-back-card.png'

const Card = ({ player, position }) => {
    let translateXValue = -104 * position
    const width = window.innerWidth;

    if (width <= 768) {
        translateXValue = -96 * position
    }
    else if (width <= 1280) {
        translateXValue = -116 * position
    }

    let rotationClass = ''
    let translateHover = ''

    if (player === '1' || player === '2') {
        rotationClass = 'rotate-90'
        translateHover = 'hover:translate-x-4'
    }
    else if (player === '3' || player === '4') {
        rotationClass = '-rotate-90'
        translateHover = 'hover:-translate-x-4'
    }

    return (
        <div
            className={`Card inline-flex rounded-lg drop-shadow-lg`}
            style={{ transform: `translateY(${translateXValue}px)` }}>

            <img className={`rounded object-cover w-full h-full ease-out duration-300 
                            max-sm:w-20 hover:brightness-200 hover:cursor-pointer
                            ${player !== 'no' ? rotationClass : ''}
                            ${player !== 'no' ? translateHover : 'hover:-translate-y-4'}`}
                src={back}
                alt="Back Card"
            />
        </div>
    );
};

export default Card;
