import React from 'react'

const Button = ({ title, link }) => {
    return (
        <a href={link} className='Button rounded drop-shadow-lg w-max px-4 py-2' 
        style={{ backgroundColor: '#4E4C4D', color: '#EC3631' }}>
            {title}
        </a>
    )
}

export default Button