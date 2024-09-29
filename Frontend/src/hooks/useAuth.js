import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createApiEndpoint } from '../api';

const useAuth = () => {
    const navigate = useNavigate();
    const [isAuthenticated, setIsAuthenticated] = useState(false);  // Track authentication status
    const [isLoading, setIsLoading] = useState(true);  // Track loading state

    useEffect(() => {
        const verifyAuth = async () => {
            try {
                // Make the request to verify the token
                await createApiEndpoint('getAuth').getAuth();
                setIsAuthenticated(true);  // Set authenticated if request succeeds
            } catch (error) {
                // If unauthorized, redirect to login
                navigate('/login');
            } finally {
                setIsLoading(false);  // No longer loading after the auth check
            }
        };

        verifyAuth();
    }, [navigate]);

    return { isAuthenticated, isLoading };
};

export default useAuth;