import React, { useState } from 'react';
import { createApiEndpoint } from '../../api/index';
import './Register.css';
import { FaUser } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { RiLockPasswordFill } from "react-icons/ri";
import { FaBirthdayCake } from "react-icons/fa";
import { useNavigate, Redirect, Route } from 'react-router-dom';
import NavBar from '../NavBar';



function Register() {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confPass: '',
        emailConfirmed: false,
        birthday: '',
    });

    const [passwordValidity, setPasswordValidity] = useState({
        length: false,
        uppercase: false,
        lowercase: false,
        number: false,
        specialChar: false,
    });
    let navigate = useNavigate();
    const createEndpoint = createApiEndpoint('register');

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value
        }));

        if (name === 'password') {
            setPasswordValidity({
                length: value.length >= 8,
                uppercase: /[A-Z]/.test(value),
                lowercase: /[a-z]/.test(value),
                number: /[0-9]/.test(value),
                specialChar: /[!@#$%^&*(),.?":{}|<>]/.test(value),
            });
        }
    }

    const handleSubmit = async (event) => {
        event.preventDefault();

        const { confPass, ...formDataWithoutConfPass } = formData;

        if (formData.password !== formData.confPass) {
            alert("Passwords don't match!");
        } else {
            try {
                const response = await createEndpoint.register(formDataWithoutConfPass);
                navigate('/emailConfirmation');
            } catch (error) {
                alert('Registration failed: ' + (error.response?.data?.message || error.message));
            }
        }
    }

    const getUnmetRequirements = () => {
        const unmetRequirements = [];
        if (!passwordValidity.length) unmetRequirements.push("At least 8 characters");
        if (!passwordValidity.uppercase) unmetRequirements.push("At least one uppercase letter");
        if (!passwordValidity.lowercase) unmetRequirements.push("At least one lowercase letter");
        if (!passwordValidity.number) unmetRequirements.push("At least one number");
        if (!passwordValidity.specialChar) unmetRequirements.push("At least one special character");
        return unmetRequirements.join(' | ');
    };
    const isPasswordValid = () => {
        return passwordValidity.length &&
            passwordValidity.uppercase &&
            passwordValidity.lowercase &&
            passwordValidity.number &&
            passwordValidity.specialChar;
    };


    return (
        <div>
            <NavBar />
            <div className='register-container'>
                <div className='circle1reg'></div>
                <div className='circle2reg'></div>
                <div className='circle3reg'></div>
                <div className='circle4reg'></div>
                <div className='circle5reg'></div>

                <div className="registration-form">
                    <h2>Register</h2>
                    <form onSubmit={handleSubmit}>
                        <div className='input-box'>
                            <input type="text"
                                name="firstName"
                                placeholder='First name'
                                value={formData.firstName}
                                onChange={handleChange}
                                required
                            />
                            <FaUser className='icon' />
                        </div>
                        <div className='input-box'>
                            <input type="text"
                                name="lastName"
                                placeholder='Last name'
                                value={formData.lastName}
                                onChange={handleChange}
                                required
                            />
                            <FaUser className='icon' />
                        </div>
                        <div className='input-box'>
                            <input type="email"
                                name="email"
                                placeholder='Email'
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                            <MdEmail className='icon' />
                        </div>
                        <div className='input-box'>
                            <input type="password"
                                name="password"
                                placeholder='Password'
                                value={formData.password}
                                onChange={handleChange}
                                required
                            />
                            <RiLockPasswordFill className='icon' />
                        </div>
                        <div className='password-requirements'>
                            {getUnmetRequirements() && (
                                <p>Password must contain: {getUnmetRequirements()}</p>
                            )}
                        </div>
                        <div className='input-box'>
                            <input type="password"
                                name="confPass"
                                placeholder='Confirm password'
                                value={formData.confPass}
                                onChange={handleChange}
                                required
                            />
                            <RiLockPasswordFill className='icon' />
                        </div>
                        <div className='input-box'>
                            <input type="date"
                                name="birthday"
                                placeholder='Birthday'
                                value={formData.birthday}
                                onChange={handleChange}
                                required
                            />
                            <FaBirthdayCake className='icon' />
                        </div>
                        <button type="submit" disabled={!isPasswordValid()}>Register</button>
                        <div className='login-link'>
                            <p>Already have an account? <a href="/login">Login</a></p>
                        </div>
                    </form>
                </div>

            </div>
        </div>
    )
}

export default Register
