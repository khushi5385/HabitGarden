import React from 'react';

function Navbar({ currentPage, setCurrentPage }) {
    const navItems = [
        { id: 'garden', icon: '🌿', label: 'Garden' },
        { id: 'habits', icon: '📋', label: 'Habits' },
        { id: 'topstreak', icon: '🏆', label: 'Top Streak' },
        { id: 'profile', icon: '👤', label: 'Profile' }
    ];

    return (
        <div className="bottom-nav">
            {navItems.map(item => (
                <button
                    key={item.id}
                    className={`nav-item ${currentPage === item.id ? 'active' : ''}`}
                    onClick={() => setCurrentPage(item.id)}
                >
                    <span className="nav-icon">{item.icon}</span>
                    <span className="nav-label">{item.label}</span>
                </button>
            ))}
        </div>
    );
}

export default Navbar;