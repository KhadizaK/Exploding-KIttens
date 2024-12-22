import React from 'react';
import Banner from '../components/Banner';
import Button from '../components/Button';
import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function RegisterPage() {
    const [name, setName] = useState()
    const [email, setEmail] = useState()
    const [password, setPassword] = useState()
    const navigate = useNavigate()

    const handleSubmit = (e) => {
        e.preventDefault()
        console.log({name, email, password})
        axios.post('http://localhost:3002/register', {name, email, password})
        .then(result => console.log(result))
        .catch(err=> console.log(err))
        navigate('/login')
    }

    return (
        <div className='RegisterPage bg-ek-bg text-ek-txt h-screen flex flex-col space-y-4 justify-center items-center'>
            <Banner />

            <div className='flex flex-col items-center space-y-4'>
                <form onSubmit={handleSubmit}>
                <div className='register-fields flex flex-col justify-between space-y-2'>
                    <div className='username space-x-2 flex'>
                        <label className='text-lg flex flex-grow justify-end' for="uname">Username</label>
                        <input 
                        className='text-sm rounded p-1' 
                        type="text" 
                        placeholder="Enter Username" 
                        
                        onChange={(e) => setName(e.target.value)}
                        />
                    </div>

                    <div className='email space-x-2 flex'>
                        <label className='text-lg flex flex-grow justify-end' for="email">Email</label>
                        <input 
                        className='text-sm rounded p-1' 
                        type="text" 
                        placeholder="Enter Email" 

                        onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div className='password space-x-2 flex'>
                        <label className='text-lg flex flex-grow justify-end' for="pwd">Password</label>
                        <input 
                        className='text-sm rounded p-1' 
                        type="password" 
                        placeholder="Enter Password" 

                        onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                </div>
                
                <div className='register-buttons flex flex-col items-center space-y-2'>
                    <Button type="submit" title='Create Account!' />
                    <div className='register-with flex flex-row space-x-4'>
                        <a id='x-register' href='/'>
                            <img className='object-cover w-full h-8 hover:brightness-90' alt='Register via Twitter/X'
                                src='https://freepnglogo.com/images/all_img/1725374683twitter-x-logo.png' />
                        </a>
                        <a id='google-register' href='/'>
                            <img className='object-cover w-full h-8 hover:brightness-90' alt='Register via Google'
                                src='https://www.incidentiq.com/wp-content/uploads/2022/09/GoogleSSO-logo.png' />
                        </a>
                        <a id='outlook-register' href='/'>
                            <img className='object-cover w-full h-8 hover:brightness-90' alt='Register via Microsoft'
                                src='https://static-00.iconduck.com/assets.00/microsoft-icon-2048x2048-xtoxrveo.png' />
                        </a>
                    </div>
                </div>
                </form>
            </div>
        </div>
    )
}

export default RegisterPage