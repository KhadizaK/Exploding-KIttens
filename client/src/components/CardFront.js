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

const CardFront = ({ playerCard, deck=[], totalCards=0, position }) => {
  const cardWidth = 64;
  const screenWidth = window.innerWidth;

  const cardSpacing = screenWidth <= 768 ? 32 : screenWidth <= 1280 ? 48 : cardWidth;
  const totalWidth = (totalCards - 1) * cardSpacing;

  const isCenterCard = playerCard === 0;
  const translateXValue = isCenterCard
    ? 0
    : position * cardSpacing - totalWidth / 2;

  // get card type based on the position
  const card_type = deck[position] || null;

  // TODO: assign card type action/effect
  // assign image card types
  let cardImage;
  switch (card_type) {
    case 'defuse':
      cardImage = defuse;
      break;
    case 'attack':
      cardImage = attack;
      break;
    case 'nope':
      cardImage = nope;
      break;
    case 'exploding_kitten':
      cardImage = exploding_kitten;
      break;
    case 'favor':
      cardImage = favor;
      break;
    case 'feral_cat':
      cardImage = feral_cat;
      break;
    case 'horse_cat':
      cardImage = horse_cat;
      break;
    case 'knight_cat':
      cardImage = knight_cat;
      break;
    case 'mercat':
      cardImage = mercat;
      break;
    case 'reveal_the_future':
      cardImage = reveal_the_future;
      break;
    case 'shuffle':
      cardImage = shuffle;
      break;
    case 'troll_cat':
      cardImage = troll_cat;
      break;
    default:
      cardImage = null;
  }

  return (
    <div
      className={`Card inline-flex rounded-lg drop-shadow-lg w-fit h-44
                  absolute m-auto 
                  ${isCenterCard ? 'top-1/2 left-1/2 transform -translate-x-0 -translate-y-28 w-28 h-fit'
          : 'bottom-4 right-0 left-0'}`}
      style={{ transform: !isCenterCard ? `translateX(${translateXValue}px)` : undefined }}
    >
      <img
        className={`rounded-lg object-cover drop-shadow-lg
                   hover:brightness-90 hover:cursor-pointer
                   ${isCenterCard ? 'hover:-translate-y-4' : 'hover:-translate-y-12'}
                   ease-out duration-300 
                   max-sm:w-20`}
        src={cardImage}
        alt={card_type ? card_type.charAt(0).toUpperCase() + card_type.slice(1) : 'Card'}
      />
    </div>
  );
};

export default CardFront;
