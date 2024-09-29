import React, { useState } from 'react';
import './Login.css';
import { MdEmail } from "react-icons/md";
import { RiLockPasswordFill } from "react-icons/ri";
import { createApiEndpoint } from '../../api/index';
import NavBar from '../NavBar';
import { useNavigate } from 'react-router-dom';
import Alert from '@mui/material/Alert';  // Import MUI Alert component
import Stack from '@mui/material/Stack';  // Import MUI Stack component for layout

function Login() {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState(null);  // State for error message
    let navigate = useNavigate();

    const createEndpoint = createApiEndpoint('login');

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError(null);  // Clear previous errors

        try {
            const response = await createEndpoint.login(formData);
            if (response.data.token) {
                localStorage.setItem('token', response.data.token);
                navigate('/dashboard');
            }
        } catch (error) {
            setError(error.response?.data?.message || 'Login failed. Please try again.');
        }
    };

    return (
        <div>
            <NavBar />
            <div className='login-container'>
                <div className='circle1reg'></div>
                <div className='circle2reg'></div>
                <div className='circle3reg'></div>
                <div className='circle4reg'></div>
                <div className='circle5reg'></div>
                <div className='login-form'>
                    <h2>Login</h2>
                    <form onSubmit={handleSubmit}>
                        <div className='input-box'>
                            <input
                                type="email"
                                name="email"
                                placeholder='Email'
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                            <MdEmail className='icon' />
                        </div>
                        <div className='input-box'>
                            <input
                                type="password"
                                name="password"
                                placeholder='Password'
                                value={formData.password}
                                onChange={handleChange}
                                required
                            />
                            <RiLockPasswordFill className='icon' />
                        </div>
                        <button type="submit">Login</button>
                        <div className='register-link'>
                            <p>Don't have an account? <a href="/register">Register</a></p>
                            <p>Forgot password? <a href="/resetPassword">Reset password</a></p>
                        </div>
                    </form>

                    {/* Error message displayed below the form */}
                    {error && (
                        <Stack sx={{ width: '100%', marginTop: '20px' }} spacing={2}>
                            <Alert severity="error" onClose={() => setError(null)}>{error}</Alert>
                        </Stack>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Login;
