import React, { useState } from 'react';
import { getUsers } from '../utils/storage';

function Login({ onLogin, onSwitch }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const users = getUsers();
        const user = users.find(u => u.username === username && u.password === password);

        if (user) {
            onLogin(user);
        } else {
            setError('Invalid username or password');
        }
        setLoading(false);
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <div className="auth-icon">🌸🌿🌸</div>
                <h1>Habit Garden</h1>
                <p>Welcome back! 👋</p>

                <form onSubmit={handleSubmit}>
                    <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} required className="auth-input" />
                    <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required className="auth-input" />
                    {error && <div className="auth-error">{error}</div>}
                    <button type="submit" className="auth-btn" disabled={loading}>
                        {loading ? '⏳ Logging in...' : '🌿 Login 🌸'}
                    </button>
                </form>

                <p className="auth-switch">
                    Don't have an account?{' '}
                    <button onClick={() => onSwitch('register')} className="switch-btn">
                        Register
                    </button>
                </p>
            </div>
        </div>
    );
}

export default Login;