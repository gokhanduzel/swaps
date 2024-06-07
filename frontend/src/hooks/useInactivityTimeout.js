import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { logout } from '../features/auth/authSlice';

const useInactivityTimeout = (timeout = 3600000) => { // Default to 1 hour
  const dispatch = useDispatch();

  useEffect(() => {
    let timeoutId;

    const resetTimeout = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        dispatch(logout());
      }, timeout);
    };

    const handleActivity = () => {
      resetTimeout();
    };

    // Set initial timeout
    resetTimeout();

    // Add event listeners
    window.addEventListener('mousemove', handleActivity);
    window.addEventListener('keydown', handleActivity);
    window.addEventListener('scroll', handleActivity);

    // Cleanup event listeners and timeout on unmount
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('mousemove', handleActivity);
      window.removeEventListener('keydown', handleActivity);
      window.removeEventListener('scroll', handleActivity);
    };
  }, [dispatch, timeout]);
};

export default useInactivityTimeout;
