import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loginStart, loginFailure, clearError } from '../store/authSlice';
import axios from 'axios';

const Register = () => {
    const [ form, setForm ] = useState({ email: '', firstname: '', lastname: '', password: '', confirmPassword: '' });
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading, error } = useSelector(state => state.auth);

    // Validation states
    const isPasswordValid = form.password.length >= 6;
    const isPasswordMatching = form.password === form.confirmPassword && form.confirmPassword.length > 0;
    const showPasswordError = form.confirmPassword.length > 0 && form.password !== form.confirmPassword;

    function handleChange(e) {
        const { name, value } = e.target;
        setForm(f => ({ ...f, [ name ]: value }));
        
        // Clear errors when user starts typing
        if (error) {
            dispatch(clearError());
        }
    }

    async function handleSubmit(e) {
        e.preventDefault();
        
        // Clear any previous errors
        dispatch(loginStart());
        dispatch(clearError());

        // Final validation before submit
        if (form.password.length < 6) {
            return; // Don't submit if invalid - visual feedback already shown
        }
        if (form.password !== form.confirmPassword) {
            return; // Don't submit if passwords don't match - visual feedback already shown
        }

        try {
            const response = await axios.post("http://localhost:4000/api/auth/register", {
                email: form.email,
                fullName: {
                    firstName: form.firstname,
                    lastName: form.lastname
                },
                password: form.password
            }, {
                withCredentials: true
            });

            console.log('Registration successful:', response.data);
            // Navigate to login page after successful registration
            navigate("/login", { 
                state: { 
                    message: "Registration successful! Please log in with your credentials." 
                }
            });
        } catch (err) {
            console.error('Registration failed:', err);
            const errorMessage = err.response?.data?.message || 'Registration failed. Please try again.';
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
                        <h2 className="gaming-tagline">Chat. Remember. Repeat.</h2>
                        <p className="gaming-description">
                           Register now and experience intelligent AI conversations that stay with you. <br /> ZenoAI remembers everything important — so you don’t have to.
                        </p>
                        
                        
                    </div>
                    
                </div>

                {/* Right Auth Panel */}
                <div className="auth-panel">
                    <div className="gaming-auth-header">
                        <h2>Create Account</h2>
                        <p className="gaming-auth-subtitle">Join the gaming community</p>
                    </div>
                    
                    {/* Only show server errors (not validation errors) */}
                    {error && !error.includes('must be') && !error.includes('match') && (
                        <div className="error-message elegant">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <circle cx="12" cy="12" r="10"/>
                                <line x1="15" y1="9" x2="9" y2="15"/>
                                <line x1="9" y1="9" x2="15" y2="15"/>
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
                                placeholder="Email Address" 
                                value={form.email} 
                                onChange={handleChange} 
                                required 
                                aria-label="Email address"
                            />
                        </div>
                        
                        <div className="gaming-form-group">
                            <input 
                                name="firstname" 
                                className="gaming-input"
                                placeholder="First Name" 
                                value={form.firstname} 
                                onChange={handleChange} 
                                required 
                            />
                        </div>

                        <div className="gaming-form-group">
                            <input 
                                name="lastname" 
                                className="gaming-input"
                                placeholder="Last Name" 
                                value={form.lastname} 
                                onChange={handleChange} 
                                required 
                            />
                        </div>
                        
                        <div className="gaming-form-group">
                            <div className="input-with-icon">
                                <input 
                                    name="password" 
                                    className={`gaming-input ${form.password.length > 0 ? (isPasswordValid ? 'input-valid' : 'input-invalid') : ''}`}
                                    type="password"
                                    autoComplete="new-password" 
                                    placeholder="Password (min 6 characters)" 
                                    value={form.password} 
                                    onChange={handleChange} 
                                    required 
                                    minLength={6} 
                                    aria-label="Password"
                                />
                                {form.password.length > 0 && (
                                    isPasswordValid ? (
                                        <svg className="input-icon-right input-valid-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                            <circle cx="12" cy="12" r="10"/>
                                            <polyline points="9 12 11 14 15 10"/>
                                        </svg>
                                    ) : (
                                        <svg className="input-icon-right input-invalid-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                            <circle cx="12" cy="12" r="10"/>
                                            <line x1="12" y1="8" x2="12" y2="12"/>
                                            <line x1="12" y1="16" x2="12.01" y2="16"/>
                                        </svg>
                                    )
                                )}
                            </div>
                            {form.password.length > 0 && !isPasswordValid && (
                                <div className="field-error-message">Password must be at least 6 characters</div>
                            )}
                        </div>

                        <div className="gaming-form-group">
                            <div className="input-with-icon">
                                <input
                                    name="confirmPassword"
                                    className={`gaming-input ${form.confirmPassword.length > 0 ? (isPasswordMatching ? 'input-valid' : 'input-invalid') : ''}`}
                                    type="password"
                                    placeholder="Confirm Password"
                                    value={form.confirmPassword}
                                    onChange={handleChange}
                                    required
                                    aria-label="Confirm password"
                                />
                                {form.confirmPassword.length > 0 && (
                                    isPasswordMatching ? (
                                        <svg className="input-icon-right input-valid-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                            <circle cx="12" cy="12" r="10"/>
                                            <polyline points="9 12 11 14 15 10"/>
                                        </svg>
                                    ) : (
                                        <svg className="input-icon-right input-invalid-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                            <circle cx="12" cy="12" r="10"/>
                                            <line x1="12" y1="8" x2="12" y2="12"/>
                                            <line x1="12" y1="16" x2="12.01" y2="16"/>
                                        </svg>
                                    )
                                )}
                            </div>
                            {showPasswordError && (
                                <div className="field-error-message">Passwords do not match</div>
                            )}
                        </div>
                        
                        <button type="submit" className="gaming-btn" disabled={loading}>
                            {loading ? 'CREATING ACCOUNT...' : 'CREATE ACCOUNT'}
                        </button>
                    </form>
                    
                    <div className="gaming-footer">
                        <p>Already have an account? <Link to="/login">Sign In</Link></p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;

