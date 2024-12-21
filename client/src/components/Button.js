import React from 'react';
import useSound from 'use-sound';
import { motion } from "motion/react";
import buttonClickSound from '../assets/sounds/button_click.mp3'; // Make sure this path is correct

const Button = ({ title, link, onClick }) => {
    const [play] = useSound(buttonClickSound);

    const handleClick = () => {
        play(); // Play the click sound
        if (onClick) {
            onClick();
        }
    };

    return link ? (
        // Render as a link if a 'link' prop is provided
        <motion.div
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
            <a href={link}
                className='Button rounded-xl shadow-xl w-max px-4 py-1 hover:brightness-90'
                style={{ backgroundColor: '#4E4C4D', color: '#EC3631' }}>
                {title}
            </a>
        </motion.div>
    ) : (
        // Otherwise, render as a button with an onClick handler
        <motion.div
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
            <button onClick={handleClick}
                className='Button rounded-xl shadow-xl w-max px-4 py-1 hover:brightness-90'
                style={{ backgroundColor: '#4E4C4D', color: '#EC3631' }}>
                {title}
            </button>
        </motion.div>
    );
};

export default Button;
