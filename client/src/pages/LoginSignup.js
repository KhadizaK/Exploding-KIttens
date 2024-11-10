import React from 'react'
import Button from '../components/Button'
import Banner from '../components/Banner'

const LoginSignup = () => {
    return (
        <div className='LoginSignup space-y-4'>
            <Banner />

            <div className='flex flex-col items-center space-y-2'>
                <Button title='Login' link='/' />
                <Button title='Sign Up' link='/' />
                <Button title='Continue as Guest' link='/' />
            </div>
        </div>
    )
}

export default LoginSignup