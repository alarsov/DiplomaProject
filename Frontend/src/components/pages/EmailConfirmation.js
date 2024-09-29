import React from 'react'
import './EmailConfirmation.css';
import NavBar from '../NavBar';

function EmailConfirmation() {
    return (
        <div>
            <NavBar />
            <div className='emailconf-container'>
                <div className='emailconf-form'>
                    <h2>Confirm email</h2>
                    <p>Congratulations on successfully registering with our platform!</p>
                    <p>Before you can log in, please confirm your email address. We've sent you an email with a confirmation link. Please check your inbox and follow the instructions to confirm your email.</p>
                    <p>Once your email is confirmed, you'll be able to log in to your account and access all the features of our platform.</p>

                    <p>Thank you for choosing our platform!</p>
                </div>
                <img src='/images/emConf.png' alt="Email Confirmation" className="emailconf-image" />
            </div>
        </div>
    )
}

export default EmailConfirmation
