import React, { useState } from 'react';
import defuse from '../assets/cards/DEFUSE.png';
import attack from '../assets/cards/ATTACK.png';
import nope from '../assets/cards/NOPE.png';
import exploding_kitten from '../assets/cards/EXPLODING_KITTEN.png';
import favor from '../assets/cards/FAVOR.png';
import skip from '../assets/cards/SKIP.png';
import feral_cat from '../assets/cards/FERAL_CAT.png';
import horse_cat from '../assets/cards/HORSE_CAT.png';
import knight_cat from '../assets/cards/KNIGHT_CAT.png';
import mercat from '../assets/cards/MERCAT.png';
import see_the_future from '../assets/cards/SEE_THE_FUTURE.png';
import shuffle from '../assets/cards/SHUFFLE.png';
import cat_card from '../assets/cards/CAT_CARD.png';
import card_back from '../assets/cards/ek-back-card.png';

const CardFront = ({ playerCard, deck = [], totalCards = 0, position, onClick }) => {
  const [hoveredCard, setHoveredCard] = useState(null);
  const cardWidth = 64;
  const screenWidth = window.innerWidth;
  const cardSpacing = screenWidth < 768 ? 20 : screenWidth <= 1280 ? 32 : cardWidth;

  let transform = '';
  if (playerCard === 'future') {
    const futureCardSpacing = 160;
    const totalFutureWidth = (totalCards - 1) * futureCardSpacing;
    const translateX = 135 + position * futureCardSpacing - totalFutureWidth / 2;
    transform = `translateX(${translateX}px)`;
  } else {
    const totalWidth = (totalCards - 1) * cardSpacing;
    const isCenterCard = playerCard === 0;
    const translateXValue = isCenterCard ? 0 : position * cardSpacing - totalWidth / 2;
    transform = isCenterCard ? '' : `translateX(${translateXValue}px)`;
  }

  const card_type = deck[position] || null;

  const cardImages = {
    defuse,
    attack,
    nope,
    exploding_kitten,
    favor,
    feral_cat,
    horse_cat,
    knight_cat,
    mercat,
    see_the_future,
    shuffle,
    cat_card,
    skip,
    card_back
  };

  const cardImage = cardImages[card_type] || null;

  return (
    <div
      className={`Card absolute m-auto inline-flex rounded-full drop-shadow-lg 
                w-fit
                ${playerCard === 'future'
          ? 'h-48'
          : playerCard === 0
            ? 'h-32 max-sm:h-24 -translate-y-24 max-sm:-translate-y-12 top-1/2 left-1/2 transform'
            : 'h-48 max-sm:h-32 bottom-4 right-0 left-0'}`}
      style={{
        transform: transform,
        zIndex: hoveredCard === position ? 10 : 1 // Set a higher z-index for the hovered card
      }}
      onMouseEnter={() => setHoveredCard(position)} // Track hovered card
      onMouseLeave={() => setHoveredCard(null)}    // Reset on hover out
      onClick={onClick}
    >
      <img
        className={`rounded-lg object-cover drop-shadow-lg
                    hover:brightness-90
                    hover:cursor-pointer
                    ${playerCard === 0 ? 'hover:-translate-y-4' : 'hover:-translate-y-12'}
                    ease-out duration-300`}
        src={cardImage}
        alt={card_type ? card_type.charAt(0).toUpperCase() + card_type.slice(1) : 'Card'}
      />
    </div>
  );
};

export default CardFront;
