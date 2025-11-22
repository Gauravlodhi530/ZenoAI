import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  loginStart,
  loginSuccess,
  loginFailure,
  clearError,
  resetLoading,
} from "../store/authSlice";
import { apiClient } from "../config/api";

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { loading, error } = useSelector((state) => state.auth);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    if (location.state?.message) {
      setSuccessMessage(location.state.message);
    }
    dispatch(clearError());
    dispatch(resetLoading());
  }, [location.state, dispatch]);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    dispatch(loginStart());
    dispatch(clearError());
    setSuccessMessage("");

    try {
      const response = await apiClient.post('/api/auth/login', {
        email: form.email,
        password: form.password,
      });

      console.log("Login successful:", response.data);
      
      // Save user data to Redux (which will also save to localStorage via authSlice)
      dispatch(loginSuccess(response.data.user));
      
      // Navigate to home
      navigate("/");
    } catch (err) {
      console.error("Login failed:", err);
      const errorMessage =
        err.response?.data?.message ||
        "Login failed. Please check your credentials.";
      dispatch(loginFailure(errorMessage));
    }
  }

  return (
    <div className="auth-container">
      <div className="gaming-auth-card">
        {/* Left Gaming Panel */}
        <div className="gaming-panel">
          <div className="gaming-content">
            <h1 className="gaming-logo">ZenoAi</h1>
            <h2 className="gaming-tagline">Good to See You Again!</h2>
            <p className="gaming-description">
              Log in to reconnect with ZenoAI and pick up your ideas right where
              you paused. <br />
              Continue your smart conversations seamlessly — your thoughts,
              prompts, and creativity are always safe with us.
            </p>
          </div>
        </div>

        {/* Right Auth Panel */}
        <div className="auth-panel">
          <div className="gaming-auth-header">
            <h2> Login To Your Account</h2>
          </div>

          {successMessage && (
            <div className="success-message elegant">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22,4 12,14.01 9,11.01" />
              </svg>
              {successMessage}
            </div>
          )}

          {error && (
            <div className="error-message elegant">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="15" y1="9" x2="9" y2="15" />
                <line x1="9" y1="9" x2="15" y2="15" />
              </svg>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            <div className="gaming-form-group">
              <input
                name="email"
                type="email"
                className="gaming-input"
                autoComplete="email"
                placeholder="Username"
                value={form.email}
                onChange={handleChange}
                required
                aria-label="Email address"
              />
            </div>

            <div className="gaming-form-group password-input-wrapper">
              <input
                name="password"
                className="gaming-input"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
                required
                aria-label="Password"
              />
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="password-toggle-btn"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
            <p className="forgot-link">
              Forgot your password? {" "}
              <Link to="/forgot-password" className="forgot-link">
                Reset it here
              </Link>
            </p>

            <button type="submit" className="gaming-btn" disabled={loading}>
              {loading ? "SIGNING IN..." : "LOGIN"}
            </button>
          </form>

          <div className="gaming-footer">
            <p>
              Don't have an account? <Link to="/register">Create Account</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
