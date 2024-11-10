import React from 'react'
import Banner from '../components/Banner'
import Button from '../components/Button'

const RegisterPage = () => {
    return (
        <div className='RegisterPage bg-ek-bg h-screen flex flex-col space-y-4 justify-center items-center'>
            <Banner />

            <div className='flex flex-col items-center space-y-4'>
                
                <div className='register-fields flex flex-col justify-between space-y-2'>
                    <div className='username space-x-2 flex'>
                        <label className='text-lg flex flex-grow justify-end' for="uname">Username</label>
                        <input className='text-sm rounded p-1' type="text" placeholder="Enter Username" name="uname" required />
                    </div>

                    <div className='email space-x-2 flex'>
                        <label className='text-lg flex flex-grow justify-end' for="email">Email</label>
                        <input className='text-sm rounded p-1' type="text" placeholder="Enter Email" name="email" required />
                    </div>
                    <div className='password space-x-2 flex'>
                        <label className='text-lg flex flex-grow justify-end' for="pwd">Password</label>
                        <input className='text-sm rounded p-1' type="password" placeholder="Enter Password" name="pwd" required />
                    </div>
                </div>

                <div className='register-buttons flex flex-col items-center space-y-2'>
                    <Button title='Create Account!' link='/' />
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
            </div>
        </div>
    )
}

export default RegisterPage