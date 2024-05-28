import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { refresh } from "../features/auth/authSlice";

const TokenRefresher = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    if (!user) return;

    const interval = setInterval(() => {
      dispatch(refresh());
    }, 840000); // 14 minutes

    return () => clearInterval(interval); // Cleanup interval on unmount
  }, [dispatch, user]);

  return null; // This component doesn't render anything
};

export default TokenRefresher;
