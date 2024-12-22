import React from 'react'
import Banner from '../components/Banner'
import Button from '../components/Button'
import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function LoginPage() {
    const [name, setName] = useState()
    const [password, setPassword] = useState()
    const navigate = useNavigate()

    const handleSubmit = (e) => {
        e.preventDefault()
        console.log({name, password})
        axios.post('http://localhost:3002/login', {name, password})
        .then(result => {
            console.log(result)
            if(result.data === "Success") {
                navigate('/gameroom')
            }
        })
        .catch(err=> console.log(err))
        
    }

    return (
        <div className='LoginPage bg-ek-bg text-ek-txt h-screen flex flex-col space-y-4 justify-center items-center'>
            <Banner />
            <form onSubmit={handleSubmit}>
            <div className='flex flex-col items-center space-y-2'>
                <div className='username'>
                    <div className='space-x-2'>
                        <label className='text-lg' for="uname">Username</label>
                        <input className='text-sm rounded p-1' type="text" placeholder="Enter Username" onChange={(e) => setName(e.target.value)} />
                    </div>
                    <a className='text-xs hover:underline' href='/'>Forgot username?</a>
                </div>

                <div className='password'>
                    <div className='space-x-2'>
                        <label className='text-lg' for="pwd">Password</label>
                        <input className='text-sm rounded p-1' type="password" placeholder="Enter Password" onChange={(e) => setPassword(e.target.value)} />
                    </div>
                    <a className='text-xs hover:underline' href='/'>Forgot password?</a>
                </div>

                <div className='login-buttons flex flex-col items-center space-y-2'>
                    <Button title='Login!' />
                    <div className='login-with flex flex-row space-x-4'>
                        <a id='x-login' href='/'>
                            <img className='object-cover w-full h-8 hover:brightness-90' alt='Login via Twitter/X'
                                src='https://freepnglogo.com/images/all_img/1725374683twitter-x-logo.png' />
                        </a>
                        <a id='google-login' href='/'>
                            <img className='object-cover w-full h-8 hover:brightness-90' alt='Login via Google'
                                src='https://www.incidentiq.com/wp-content/uploads/2022/09/GoogleSSO-logo.png' />
                        </a>
                        <a id='outlook-login' href='/'>
                            <img className='object-cover w-full h-8 hover:brightness-90' alt='Login via Microsoft'
                                src='https://static-00.iconduck.com/assets.00/microsoft-icon-2048x2048-xtoxrveo.png' />
                        </a>
                    </div>
                </div>
                
            </div>
            </form>
        </div>
    )
}

export default LoginPage