import React, { useState } from 'react';
import './ChangePassword.css';
import { useParams, useNavigate } from 'react-router-dom';
import { createApiEndpoint } from '../../api/index';
import NavBar from '../NavBar';

function ChangePassword() {
    const { id } = useParams();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();
    const resetPsw = createApiEndpoint('savePasswordEdit')

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (password !== confirmPassword) {
            setMessage("Passwords don't match!");
            return;
        }

        try {
            await resetPsw.savePasswordEdit({ userId: id, password: password });
            setMessage('Your password has been successfully reset. You can now log in with your new password.');
            // Optionally, redirect to the login page after a short delay
            setTimeout(() => navigate('/login'), 3000);
        } catch (error) {
            setMessage('There was an error processing your request. Please try again later.');
            console.error(error);
        }
    }

    return (
        <div>
            <NavBar />
            <div className='change-password-container'>
                <div className='change-password-form'>
                    <h2>Change Password</h2>
                    <p>Please enter your new password below.</p>
                    <form onSubmit={handleSubmit}>
                        <input
                            type="password"
                            placeholder="New Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <input
                            type="password"
                            placeholder="Confirm New Password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                        <button type="submit">Change Password</button>
                    </form>
                    {message && <p>{message}</p>}
                </div>
            </div>
        </div>
    );
}

export default ChangePassword;
