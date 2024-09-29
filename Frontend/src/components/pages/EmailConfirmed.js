import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom';
import './EmailConfirmation.css';
import { createApiEndpoint } from '../../api/index';
import NavBar from '../NavBar';

function EmailConfirmed() {
    const { id } = useParams();
    const userId = parseInt(id);
    const createEndpoint = createApiEndpoint('confirmEmail');

    useEffect(() => {
        const confirmEmail = async () => {
            try {
                await createEndpoint.confirmEmail(userId);
                console.log("Email confirmed");
            } catch (error) {
                console.log(error.message);
            }
        }
        confirmEmail();
    }, [userId])
    return (
        <div>
            <NavBar />
            <div className='emailconf-container'>
                <div className='emailconf-form'>
                    <h2>Email Confirmed</h2>
                    <p>Your email has been confirmed successfully!</p>
                </div>
            </div>
        </div>
    )
}

export default EmailConfirmed
