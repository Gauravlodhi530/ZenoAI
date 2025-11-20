import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../config/api';

const ResetPassword = () => {
    const [form, setForm] = useState({ newPassword: '', confirmPassword: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const email = location.state?.email;

    useEffect(() => {
        if (!email) {
            navigate('/forgot-password');
        }
    }, [email, navigate]);

    const isPasswordValid = form.newPassword.length >= 6;
    const isPasswordMatching = form.newPassword === form.confirmPassword && form.confirmPassword.length > 0;
    const showPasswordError = form.confirmPassword.length > 0 && form.newPassword !== form.confirmPassword;

    function handleChange(e) {
        const { name, value } = e.target;
        setForm(f => ({ ...f, [name]: value }));
        setError('');
    }

    async function handleSubmit(e) {
        e.preventDefault();
        
        if (form.newPassword.length < 6) {
            return;
        }
        if (form.newPassword !== form.confirmPassword) {
            return;
        }

        setLoading(true);
        setError('');

        try {
            await axios.post(
                `${API_URL}/api/auth/reset-password`,
                {
                    email,
                    newPassword: form.newPassword,
                    confirmPassword: form.confirmPassword
                },
                { withCredentials: true }
            );

            navigate('/login', {
                state: { message: 'Password reset successful! Please log in with your new password.' }
            });
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to reset password. Please try again.');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="auth-container">
            <div className="gaming-auth-card">
                <div className="gaming-panel">
                    <div className="gaming-content">
                        <h1 className="gaming-logo">ZenoAi</h1>
                        <h2 className="gaming-tagline">Create New Password</h2>
                        <p className="gaming-description">
                            Enter your new password below. Make sure it's at least 6 characters long.
                        </p>
                    </div>
                </div>

                <div className="auth-panel">
                    <div className="gaming-auth-header">
                        <h2>Reset Password</h2>
                        <p className="gaming-auth-subtitle">Enter your new password</p>
                    </div>

                    {error && (
                        <div className="error-message elegant">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <circle cx="12" cy="12" r="10" />
                                <line x1="15" y1="9" x2="9" y2="15" />
                                <line x1="9" y1="9" x2="15" y2="15" />
                            </svg>
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} noValidate>
                        <div className="gaming-form-group">
                            <div className="input-with-icon">
                                <input
                                    name="newPassword"
                                    className={`gaming-input ${form.newPassword.length > 0 ? (isPasswordValid ? 'input-valid' : 'input-invalid') : ''}`}
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="New Password (min 6 characters)"
                                    value={form.newPassword}
                                    onChange={handleChange}
                                    required
                                    minLength={6}
                                    aria-label="New password"
                                />
                                {form.newPassword.length > 0 && (
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
                            {form.newPassword.length > 0 && !isPasswordValid && (
                                <div className="field-error-message">Password must be at least 6 characters</div>
                            )}
                        </div>

                        <div className="gaming-form-group">
                            <div className="input-with-icon">
                                <input
                                    name="confirmPassword"
                                    className={`gaming-input ${form.confirmPassword.length > 0 ? (isPasswordMatching ? 'input-valid' : 'input-invalid') : ''}`}
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="Confirm New Password"
                                    value={form.confirmPassword}
                                    onChange={handleChange}
                                    required
                                    aria-label="Confirm new password"
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

                        <div className="gaming-form-group">
                            <label className="checkbox-label">
                                <input
                                    type="checkbox"
                                    checked={showPassword}
                                    onChange={(e) => setShowPassword(e.target.checked)}
                                />
                                <span>Show password</span>
                            </label>
                        </div>

                        <button type="submit" className="gaming-btn" disabled={loading}>
                            {loading ? 'RESETTING...' : 'RESET PASSWORD'}
                        </button>
                    </form>

                    <div className="gaming-footer">
                        <p>
                            Remember your password? <Link to="/login">Sign In</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResetPassword;
