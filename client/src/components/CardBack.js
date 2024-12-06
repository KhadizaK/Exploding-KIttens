import React from 'react';
import back from '../assets/cards/ek-back-card.png';

const CardBack = ({ player, position }) => {
  let translateXValue = -24 * position;
  const width = window.innerWidth;

  if (width <= 768) {
    translateXValue = -32 * position;
  } else if (width <= 1280) {
    translateXValue = -48 * position;
  }

  let rotationAngle = 0;
  let orient = '';

  if (player === '2' || player === '3') {
    rotationAngle = 90;
    if (player === '2') {
      orient = 'left-8 bottom-16';
    } else {
      orient = 'left-8 top-48';
    }
  } else if (player === '4' || player === '5') {
    rotationAngle = -90;
    if (player === '4') {
      orient = 'right-8 bottom-16';
    } else {
      orient = 'right-8 top-48';
    }
  }

  return (
    <div
      id="card-back"
      className={`Card absolute rounded-lg drop-shadow-lg
                  ${player !== 'drawing_deck' || 'discarded_deck' ? orient : 'flex justify-center items-center'}`}
      style={{
        transform: `translateY(${translateXValue}px) rotate(${rotationAngle}deg)`,
        ...(player === 'drawing_deck' && {
          top: '50%',
          left: '50%',
          transform: `translate(-120%, -80%)`,
        }),
      }}
    >
      <img
        className={`rounded object-cover w-28 h-max ease-in-out duration-200 
                    max-sm:w-20 hover:brightness-200 hover:cursor-pointer hover:-translate-y-4
                   `}
        src={back}
        alt="Back Card"
      />
    </div>
  );
};

export default CardBack;
