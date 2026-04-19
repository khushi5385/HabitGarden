import React, { useState } from 'react';
import { getUsers, saveUsers } from '../utils/storage';

function Register({ onRegister, onSwitch }) {
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        fullName: '',
        email: '',
        age: '',
        phone: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const users = getUsers();

        if (users.find(u => u.username === formData.username)) {
            setError('Username already exists');
            setLoading(false);
            return;
        }

        if (!formData.fullName || !formData.email || !formData.age || !formData.phone) {
            setError('Please fill all fields');
            setLoading(false);
            return;
        }

        const defaultHabits = [
            {
                id: Date.now(),
                name: 'Morning Meditation',
                streak: 0,
                level: 1,
                xp: 0,
                stage: 0,
                completed: false,
                total: 0,
                goal: 'daily',
                time: 'morning',
                reminderTime: '07:00',
                duration: '20',
                dates: {}
            },
            {
                id: Date.now() + 1,
                name: 'Daily Reading',
                streak: 0,
                level: 1,
                xp: 0,
                stage: 0,
                completed: false,
                total: 0,
                goal: 'daily',
                time: 'evening',
                reminderTime: '20:00',
                duration: '30',
                dates: {}
            }
        ];

        const newUser = {
            id: Date.now(),
            username: formData.username,
            password: formData.password,
            fullName: formData.fullName,
            email: formData.email,
            age: formData.age,
            phone: formData.phone,
            habits: defaultHabits,
            totalXP: 0,
            joinDate: new Date().toLocaleDateString()
        };

        users.push(newUser);
        saveUsers(users);
        onRegister(newUser);
        setLoading(false);
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <div className="auth-icon">🌸🌱🌸</div>
                <h1>Create Account</h1>
                <p>Start growing your habits! 🌿</p>

                <form onSubmit={handleSubmit}>
                    <input type="text" name="username" placeholder="Username" value={formData.username} onChange={handleChange} required className="auth-input" />
                    <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} required className="auth-input" />
                    <input type="text" name="fullName" placeholder="Full Name" value={formData.fullName} onChange={handleChange} required className="auth-input" />
                    <input type="email" name="email" placeholder="Email Address" value={formData.email} onChange={handleChange} required className="auth-input" />
                    <input type="number" name="age" placeholder="Age" value={formData.age} onChange={handleChange} required className="auth-input" />
                    <input type="tel" name="phone" placeholder="Phone Number" value={formData.phone} onChange={handleChange} required className="auth-input" />
                    {error && <div className="auth-error">{error}</div>}
                    <button type="submit" className="auth-btn" disabled={loading}>
                        {loading ? '⏳ Registering...' : '🌱 Register 🌻'}
                    </button>
                </form>

                <p className="auth-switch">
                    Already have an account?{' '}
                    <button onClick={() => onSwitch('login')} className="switch-btn">
                        Login
                    </button>
                </p>
            </div>
        </div>
    );
}

export default Register;