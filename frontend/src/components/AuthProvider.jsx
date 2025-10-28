import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../store/authSlice";
import axios from "axios";
import { API_URL } from "../config/api";

const AuthProvider = ({ children }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    // Check if user is already authenticated on app load
    const checkAuth = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/auth/me`, {
          withCredentials: true,
        });
        dispatch(loginSuccess(response.data.user));
      } catch (error) {
        // User is not authenticated, which is fine
      }
    };

    checkAuth();
  }, [dispatch]);

  return children;
};

export default AuthProvider;
