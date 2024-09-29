import React, { useState } from 'react';
import './ResetPassword.css';
import { createApiEndpoint } from '../../api/index';
import NavBar from '../NavBar';

function ResetPassword() {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const sendResetEmail = createApiEndpoint('sendResetEmail');

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            await sendResetEmail.sendResetEmail(email);
            setMessage('If an account with that email exists, a password reset link has been sent.');
        } catch (error) {
            setMessage('There was an error processing your request. Please try again later.');
            console.error(error);
        }
    }

    return (
        <div>
            <NavBar />
            <div className='password-reset-container'>
                <div className='password-reset-form'>
                    <h2>Reset Password</h2>
                    <p>Please enter your email address to receive a password reset link.</p>
                    <form onSubmit={handleSubmit}>
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        <button type="submit">Send Reset Link</button>
                    </form>
                    {message && <p>{message}</p>}
                </div>
            </div>
        </div>
    );
}

export default ResetPassword;
