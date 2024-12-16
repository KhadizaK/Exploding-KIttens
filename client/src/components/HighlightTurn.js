import React from 'react';

const HighlightTurn = ({ pos }) => {
  const screenWidth = window.innerWidth;

  const center = 'right-0 left-0 m-auto';
  const you_player_1 = 'right-0 left-0 bottom-0 m-auto';

  const player_3 = 'translate-y-16 top-0';
  const player_2 = '-translate-y-20 bottom-0';
  const player_4 = 'translate-y-16 top-0 right-0';
  const player_5 = '-translate-y-20 bottom-0 right-0';

  // determine the class based on the position prop
  const position = {
    player_2,
    player_3,
    player_4,
    player_5,
  }["player_" + pos] || you_player_1; // default to you_player_1

  return (
    <div
      className={`HighlightTurn fixed w-64 h-64 rounded-full ${position}`}
      style={{
        background: 'radial-gradient(circle, rgba(0,0,0,0.8) 25%, rgba(255,255,255,1.0) 100%)',
        boxShadow: '0 0 20px rgba(0, 0, 0, 0.2)',
      }}
    ></div>
  );
};

export default HighlightTurn;
