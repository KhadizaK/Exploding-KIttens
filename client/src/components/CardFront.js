import React from 'react';
import defuse from '../assets/cards/DEFUSE.png';
import attack from '../assets/cards/ATTACK.png';
import nope from '../assets/cards/NOPE.png';
import exploding_kitten from '../assets/cards/EXPLODING_KITTEN.png';
import favor from '../assets/cards/FAVOR.png';
import feral_cat from '../assets/cards/FERAL_CAT.png';
import horse_cat from '../assets/cards/HORSE_CAT.png';
import knight_cat from '../assets/cards/KNIGHT_CAT.png';
import mercat from '../assets/cards/MERCAT.png';
import reveal_the_future from '../assets/cards/REVEAL_THE_FUTURE.png';
import shuffle from '../assets/cards/SHUFFLE.png';
import troll_cat from '../assets/cards/TROLL_CAT.png';

const CardFront = ({ playerCard, deck = [], totalCards = 0, position }) => {
  const cardWidth = 64;
  const screenWidth = window.innerWidth;

  const cardSpacing = screenWidth < 768 ? 20 : screenWidth <= 1280 ? 32 : cardWidth;
  const totalWidth = (totalCards - 1) * cardSpacing;

  const isCenterCard = playerCard === 0;
  const translateXValue = isCenterCard
    ? 0
    : position * cardSpacing - totalWidth / 2;

  // get card type based on position
  const card_type = deck[position] || null;

  // map card types to images
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
    reveal_the_future,
    shuffle,
    troll_cat,
  };
  // TODO: assign card type action/effect

  const cardImage = cardImages[card_type] || null;

  return (
    <div
      className={`Card absolute  m-auto inline-flex rounded-full drop-shadow-lg 
                w-fit
              ${isCenterCard ? 'h-32 max-sm:h-24 -translate-y-24 max-sm:-translate-y-12 top-1/2 left-1/2 transform'
          : 'h-48 max-sm:h-32 bottom-4 right-0 left-0'}
                `}
      style={{
        transform: isCenterCard
          ? ``
          : `translateX(${translateXValue}px)`,
      }}
    >
      <img
        className={`rounded-lg object-cover drop-shadow-lg
                    hover:brightness-90
                    hover:cursor-pointer
                    ${isCenterCard ? 'hover:-translate-y-4' : 'hover:-translate-y-12'}
                    ease-out duration-300 
                  `}
        src={cardImage}
        alt={card_type ? card_type.charAt(0).toUpperCase() + card_type.slice(1) : 'Card'}
      />
    </div>

  );
};

export default CardFront;
