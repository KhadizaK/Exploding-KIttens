import React, { useEffect } from 'react'
import Button from '../components/Button'
import Banner from '../components/Banner'

const LoginSignup = () => {

    useEffect(() => {
        document.title = "Exploding Kittens - Login";
      }, []);

    return (
        <div className='LoginSignup space-y-4'>
            <Banner />

            <div className='flex flex-col items-center space-y-2'>
                <Button title='Login' link='/login' />
                <Button title='Sign Up' link='/register' />
                <Button title='Continue as Guest' link='/join-create-gameroom' />
            </div>
        </div>
    )
}

export default LoginSignup