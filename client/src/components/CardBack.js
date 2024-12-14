import React from 'react';
import back from '../assets/cards/ek-back-card.png';

const CardBack = ({ player, position, onClick }) => {
  let translateXValue = -24 * position;
  const width = window.innerWidth;

  if (width <= 640) {
    translateXValue = -16 * position;
  } else if (width <= 768) {
    translateXValue = -20 * position;
  }

  let rotationAngle = 0;
  let orient = '';

  if (player === '1' || player === '2') {
    rotationAngle = 90;
    if (player === '2') {
      orient = 'left-8 bottom-16';
    } else {
      orient = 'left-8 top-48';
    }
  } else if (player === '3' || player === '4') {
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
      className={`Card absolute drop-shadow-lg border-white rounded-full
                  h-fit
                  ${player !== 'drawing_deck' ? orient : 'flex justify-center items-center'}
                  ${player !== 'drawing_deck' ? 'w-24 max-sm:w-8' : 'w-20 max-sm:w-16'}
                  `}
      style={{
        transform: `translateY(${translateXValue}px) rotate(${rotationAngle}deg)`,
        ...(player === 'drawing_deck' && {
          top: '50%',
          left: '50%',
          transform: `translate(-120%, -80%)`,
        }),
      }}
      onClick={onClick}
    >
      <img
        className={`rounded object-cover ease-in-out duration-200 
                    hover:brightness-90 hover:cursor-pointer hover:-translate-y-4
                   `}
        src={back}
        alt="Back Card"
      />
    </div>
  );
};

export default CardBack;
