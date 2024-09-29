import axios from 'axios';
import { useEffect } from 'react';

const useTokenRefresh = () => {
    useEffect(() => {
        const refreshToken = async () => {
            try {
                const token = localStorage.getItem('token');
                if (token) {
                    const response = await axios.post('https://localhost:7160/LearningAPI/refreshToken', {}, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });
                    localStorage.setItem('token', response.data.token); // Store the new token
                }
            } catch (error) {
                console.error('Failed to refresh token', error);
            }
        };

        const refreshInterval = setInterval(refreshToken, 60 * 60 * 1000); // Refresh every 1 hour

        // Cleanup interval on component unmount
        return () => clearInterval(refreshInterval);
    }, []);
};

export default useTokenRefresh;
