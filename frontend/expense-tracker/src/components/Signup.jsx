import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import expensifyLogo from '../assets/expensify_logo.png';

export default function Signup() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        password_confirmation: ''
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});

        if (formData.password !== formData.password_confirmation) {
            setErrors({ password_confirmation: ['Passwords do not match.'] });
            return;
        }

        setLoading(true);

        try {
            const response = await api.post('/register', formData);
            if (response.data && response.data.data && response.data.data.access_token) {
                localStorage.setItem('auth_token', response.data.data.access_token);
            }
            navigate('/loading');
        } catch (error) {
            if (error.response && error.response.data.errors) {
                setErrors(error.response.data.errors);
            } else {
                setErrors({ general: ['An unexpected error occurred. Please try again.'] });
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ display: 'flex', minHeight: '100vh', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--bg-color)' }}>
            <div className="white-card" style={{ width: '100%', maxWidth: '400px', padding: '2.5rem 2rem' }}>
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <div style={{ width: '100px', height: '100px', borderRadius: '50%', overflow: 'hidden', margin: '0 auto 1rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <img src={expensifyLogo} alt="Logo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                    <h1 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Create an Account</h1>
                    <p className="subtitle" style={{ fontSize: '0.9rem' }}>Join Expensify to track your spending</p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label" htmlFor="name">
                            Full Name <span style={{ color: 'var(--error)' }}>*</span>
                        </label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            className="form-input"
                            style={{ width: '100%' }}
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                        {errors.name && <div className="error-text">{errors.name[0]}</div>}
                    </div>

                    <div className="form-group">
                        <label className="form-label" htmlFor="email">
                            Email Address <span style={{ color: 'var(--error)' }}>*</span>
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            className="form-input"
                            style={{ width: '100%' }}
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                        {errors.email && <div className="error-text">{errors.email[0]}</div>}
                    </div>

                    <div className="form-group">
                        <label className="form-label" htmlFor="password">
                            Password <span style={{ color: 'var(--error)' }}>*</span>
                        </label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            className="form-input"
                            style={{ width: '100%' }}
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                        {errors.password && <div className="error-text">{errors.password[0]}</div>}
                    </div>

                    <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                        <label className="form-label" htmlFor="password_confirmation">
                            Confirm Password <span style={{ color: 'var(--error)' }}>*</span>
                        </label>
                        <input
                            type="password"
                            id="password_confirmation"
                            name="password_confirmation"
                            className="form-input"
                            style={{ width: '100%' }}
                            value={formData.password_confirmation}
                            onChange={handleChange}
                            required
                        />
                        {errors.password_confirmation && <div className="error-text">{errors.password_confirmation[0]}</div>}
                    </div>

                    {errors.general && <div className="error-text" style={{ marginBottom: '1rem' }}>{errors.general[0]}</div>}

                    <button
                        type="submit"
                        className="btn-primary"
                        style={{ width: '100%', justifyContent: 'center' }}
                        disabled={loading}
                    >
                        {loading ? 'Creating Account...' : 'Sign Up'}
                    </button>

                    <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                        Already have an account? <Link to="/signin" style={{ color: 'var(--primary-green)', textDecoration: 'none', fontWeight: 500 }}>Sign in</Link>
                    </div>
                </form>
            </div>
        </div>
    );
}
