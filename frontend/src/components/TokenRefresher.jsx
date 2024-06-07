import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { refresh } from '../features/auth/authSlice';

const TokenRefresher = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        // Set up the interval
        const interval = setInterval(() => {
            dispatch(refresh());
        }, 900000); // Refresh every 15 minutes

        // Clear the interval on component unmount
        return () => clearInterval(interval);
    }, [dispatch]);

    return null; // This component does not render anything
};

export default TokenRefresher;
