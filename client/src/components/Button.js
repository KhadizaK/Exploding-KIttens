import React from 'react';
import { motion } from "motion/react";

const Button = ({ title, link, onClick }) => {
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
            <button onClick={onClick}
                className='Button rounded-xl shadow-xl w-max px-4 py-1 hover:brightness-90'
                style={{ backgroundColor: '#4E4C4D', color: '#EC3631' }}>
                {title}
            </button>
        </motion.div>
    );
};

export default Button;