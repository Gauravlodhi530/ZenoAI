import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { loginSuccess, logout, restoreAuth } from "../store/authSlice";
import { apiClient } from "../config/api";

const AuthProvider = ({ children }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    // Check if user is already authenticated on app load
    const checkAuth = async () => {
      try {
        // First, try to get user from backend (validates session/cookie)
        const response = await apiClient.get('/api/auth/me');
        dispatch(loginSuccess(response.data.user));
      } catch (error) {
        // If backend auth fails, check localStorage as fallback
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          try {
            const user = JSON.parse(storedUser);
            // Restore from localStorage but verify with backend
            dispatch(restoreAuth(user));
            
            // Try to revalidate in background
            apiClient.get('/api/auth/me')
              .then(res => dispatch(loginSuccess(res.data.user)))
              .catch(() => {
                // If revalidation fails, clear everything
                dispatch(logout());
                localStorage.clear();
              });
          } catch (parseError) {
            // Invalid stored data, clear it
            localStorage.removeItem('user');
            dispatch(logout());
          }
        } else {
          // No stored user, ensure logged out state
          dispatch(logout());
        }
      }
    };

    checkAuth();
  }, [dispatch]);

  return children;
};

export default AuthProvider;
