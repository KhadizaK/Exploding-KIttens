import React from 'react';
import back from '../assets/ek-back-card.png';

const Card = ({ position }) => {
    // Apply translation only if position is greater than 0
    let translateXValue = position > 0 ? -80 * position : 0 // No translation for the first card

    const screenWidth = window.innerWidth

    // for smaller screens
    if (screenWidth <= 768) {
        translateXValue = translateXValue / 2;
    }

    return (
        <div 
            className="Card inline-flex rounded-lg drop-shadow-lg 
                        hover:cursor-pointer" 
            style={{
                transform: `translateX(${translateXValue}px)`,
                transition: 'transform 0.3s ease', 
            }}
        >
            <img className='rounded object-cover w-max ease-out duration-300
                            hover:brightness-200  hover:-translate-y-4'
                            src={back} alt="Card" />
        </div>
    );
};

export default Card;
