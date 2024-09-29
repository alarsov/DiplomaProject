import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './UserInfo.css'; // Optional, for any additional custom styles
import { createApiEndpoint } from '../../../../api/index';
import NavBar from '../DashboardNavBar';
import useAuth from '../../../../hooks/useAuth';

function UserInfo() {
    useAuth();
    const [showPasswordForm, setShowPasswordForm] = useState(false);
    const navigate = useNavigate();
    const getUserInfo = createApiEndpoint('getUserInfo');
    const saveProfileEdit = createApiEndpoint('saveProfileEdit');
    const savePswChange = createApiEndpoint('savePasswordEdit');
    const [userInfo, setUserInfo] = useState({
        firstName: '',
        lastName: '',
        email: '',
        birthday: '',
    });

    const [passwordInfo, setPasswordInfo] = useState({
        password: '',
        confirmPassword: '',
    });

    const [passwordValidity, setPasswordValidity] = useState({
        length: false,
        uppercase: false,
        lowercase: false,
        number: false,
        specialChar: false,
    });

    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const response = await getUserInfo.getUserInfo();
                const userData = response.data.value;

                setUserInfo({
                    firstName: userData[0].firstName || '',
                    lastName: userData[0].lastName || '',
                    email: userData[0].email || '',
                    birthday: userData[0].birthday ? userData[0].birthday.split('T')[0] : '',
                });
            } catch (error) {
                console.error('Error fetching user info:', error);
            }
        };

        fetchUserInfo();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUserInfo({
            ...userInfo,
            [name]: value,
        });
    };

    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        setPasswordInfo({
            ...passwordInfo,
            [name]: value,
        });

        if (name === 'password') {
            setPasswordValidity({
                length: value.length >= 8,
                uppercase: /[A-Z]/.test(value),
                lowercase: /[a-z]/.test(value),
                number: /[0-9]/.test(value),
                specialChar: /[!@#$%^&*(),.?":{}|<>]/.test(value),
            });
        }
    };

    const handleSaveProfile = async () => {
        try {
            await saveProfileEdit.saveProfileEdit(userInfo);
            alert("Profile updated successfully!");
        } catch (error) {
            console.error('Error saving profile:', error);
        }
    };
    const handleLogout = () => {
        localStorage.removeItem('token'); // Remove the token
        navigate('/login'); // Redirect to the login page
    };

    const handleChangePassword = async () => {
        if (passwordInfo.password !== passwordInfo.confirmPassword) {
            alert('Passwords do not match!');
            return;
        }
        try {
            await savePswChange.savePasswordEdit({ password: passwordInfo.password });
            alert("Password changed successfully!");
        } catch (error) {
            console.error("Error changing password:", error);
        }
    };

    const getUnmetRequirements = () => {
        const unmetRequirements = [];
        if (!passwordValidity.length) unmetRequirements.push("At least 8 characters");
        if (!passwordValidity.uppercase) unmetRequirements.push("At least one uppercase letter");
        if (!passwordValidity.lowercase) unmetRequirements.push("At least one lowercase letter");
        if (!passwordValidity.number) unmetRequirements.push("At least one number");
        if (!passwordValidity.specialChar) unmetRequirements.push("At least one special character");
        return unmetRequirements;
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
            <div className="container rounded bg-white mt-5 mb-5">
                <div className="row">
                    <div className="col-md-3 border-right">
                        <div className="d-flex flex-column align-items-center text-center p-3 py-5">
                            <img
                                className="rounded-circle mt-5"
                                width="150px"
                                src="https://st3.depositphotos.com/15648834/17930/v/600/depositphotos_179308454-stock-illustration-unknown-person-silhouette-glasses-profile.jpg"
                                alt="Profile"
                            />
                            <span className="font-weight-bold">{userInfo.firstName} {userInfo.lastName}</span>
                            <span className="text-black-50">{userInfo.email}</span>
                            <button className="btn btn-danger mt-3" onClick={handleLogout}>Logout</button>
                        </div>
                    </div>
                    <div className="col-md-9">
                        <div className="p-3 py-5">
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <h4 className="text-right">
                                    {showPasswordForm ? 'Change Password' : 'Profile Settings'}
                                </h4>
                            </div>
                            {!showPasswordForm ? (
                                <>
                                    <div className="row mt-2">
                                        <div className="col-md-6">
                                            <label className="labels">First Name</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                placeholder="first name"
                                                name="firstName"
                                                value={userInfo.firstName}
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                        <div className="col-md-6">
                                            <label className="labels">Last Name</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                placeholder="last name"
                                                name="lastName"
                                                value={userInfo.lastName}
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                    </div>
                                    <div className="row mt-3">
                                        <div className="col-md-12">
                                            <label className="labels">Email</label>
                                            <input
                                                type="email"
                                                className="form-control"
                                                placeholder="email"
                                                name="email"
                                                value={userInfo.email}
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                        <div className="col-md-12">
                                            <label className="labels">Birthday</label>
                                            <input
                                                type="date"
                                                className="form-control"
                                                placeholder="birthday"
                                                name="birthday"
                                                value={userInfo.birthday}
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                    </div>
                                    <div className="mt-5 text-center">
                                        <button
                                            className="btn btn-primary profile-button"
                                            type="button"
                                            onClick={handleSaveProfile}
                                        >
                                            Save Profile
                                        </button>
                                        <button
                                            className="btn btn-secondary profile-button"
                                            type="button"
                                            style={{ marginLeft: '10px' }}
                                            onClick={() => setShowPasswordForm(true)}
                                        >
                                            Change Password
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className="row mt-3">
                                        <div className="col-md-12">
                                            <label className="labels">New Password</label>
                                            <input
                                                type="password"
                                                className="form-control"
                                                placeholder="New Password"
                                                name="password"
                                                value={passwordInfo.password}
                                                onChange={handlePasswordChange}
                                            />
                                        </div>
                                        <div className="password-requirements">
                                            {getUnmetRequirements().length > 0 && (
                                                <ul>
                                                    {getUnmetRequirements().map((requirement, index) => (
                                                        <li key={index}>{requirement}</li>
                                                    ))}
                                                </ul>
                                            )}
                                        </div>
                                        <div className="col-md-12 mt-3">
                                            <label className="labels">Confirm Password</label>
                                            <input
                                                type="password"
                                                className="form-control"
                                                placeholder="Confirm Password"
                                                name="confirmPassword"
                                                value={passwordInfo.confirmPassword}
                                                onChange={handlePasswordChange}
                                            />
                                        </div>
                                    </div>
                                    <div className="mt-5 text-center">
                                        <button
                                            className="btn btn-primary profile-button"
                                            type="button"
                                            onClick={handleChangePassword}
                                            disabled={!isPasswordValid()}
                                        >
                                            Save Password
                                        </button>
                                        <button
                                            className="btn btn-secondary profile-button"
                                            type="button"
                                            style={{ marginLeft: '10px' }}
                                            onClick={() => setShowPasswordForm(false)}
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default UserInfo;
