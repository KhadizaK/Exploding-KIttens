import React from 'react';

const Button = ({ title, link, onClick }) => {
    return link ? (
        // Render as a link if a 'link' prop is provided
        <a href={link}
            className='Button rounded-xl shadow-xl w-max px-4 py-1 hover:brightness-90'
            style={{ backgroundColor: '#4E4C4D', color: '#EC3631' }}>
            {title}
        </a>
    ) : (
        // Otherwise, render as a button with an onClick handler
        <button onClick={onClick}
            className='Button rounded-xl shadow-xl w-max px-4 py-1 hover:brightness-90'
            style={{ backgroundColor: '#4E4C4D', color: '#EC3631' }}>
            {title}
        </button>
    );
};

export default Button;