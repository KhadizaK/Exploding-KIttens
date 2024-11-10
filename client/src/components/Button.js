import React from 'react'

const Button = ({ title, link }) => {
    return (
        <a href={link} className='Button rounded-xl shadow-xl w-max px-4 py-1 hover:brightness-90' 
        style={{ backgroundColor: '#4E4C4D', color: '#EC3631' }}>
            {title}
        </a>
    )
}

export default Button