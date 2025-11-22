import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { apiClient } from '../config/api';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();

    async function handleSubmit(e) {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await apiClient.post('/api/auth/reset-password-request', { email });

            setSuccess(true);
            // Navigate to reset password page with email
            setTimeout(() => {
                navigate('/reset-password', { state: { email } });
            }, 1500);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to process request. Please try again.');
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
                        <h2 className="gaming-tagline">Reset Your Password</h2>
                        <p className="gaming-description">
                            Enter your email address and we'll help you reset your password.
                        </p>
                    </div>
                </div>

                <div className="auth-panel">
                    <div className="gaming-auth-header">
                        <h2>Forgot Password</h2>
                        <p className="gaming-auth-subtitle">Enter your email to continue</p>
                    </div>

                    {success && (
                        <div className="success-message elegant">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                                <polyline points="22,4 12,14.01 9,11.01" />
                            </svg>
                            Email verified! Redirecting to reset password...
                        </div>
                    )}

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
                            <input
                                name="email"
                                type="email"
                                className="gaming-input"
                                placeholder="Email Address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                aria-label="Email address"
                            />
                        </div>

                        <button type="submit" className="gaming-btn" disabled={loading || success}>
                            {loading ? 'VERIFYING...' : 'CONTINUE'}
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

export default ForgotPassword;
