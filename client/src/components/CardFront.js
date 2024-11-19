import React from 'react';
import defuse from '../assets/DEFUSE.png';

const CardFront = ({ position, card_type, totalCards }) => {
  const cardWidth = 64; 
  const screenWidth = window.innerWidth;

  let cardSpacing = cardWidth;
  if (screenWidth <= 768) {
    cardSpacing = 32;
  } else if (screenWidth <= 1280) {
    cardSpacing = 48;
  }

  const totalWidth = (totalCards - 1) * cardSpacing; 
  const translateXValue = (position * cardSpacing) - totalWidth / 2; 

  return (
    <div
      className="Card inline-flex rounded-lg drop-shadow-lg w-fit h-44
                  absolute bottom-4 right-0 left-0 m-auto"
      style={{ transform: `translateX(${translateXValue}px)` }}
    >
      <img
        className="rounded-lg object-cover drop-shadow-lg
                   hover:brightness-90 hover:cursor-pointer
                   hover:-translate-y-12 ease-out duration-300 
                   max-sm:w-20"
        src={defuse}
        alt={card_type}
      />
    </div>
  );
};

export default CardFront;
