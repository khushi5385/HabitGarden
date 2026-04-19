import React from 'react';

function ProfilePage({ user, habits, onLogout }) {
    const totalXP = habits.reduce((s, h) => s + h.xp, 0);
    const totalStreak = habits.reduce((s, h) => s + h.streak, 0);
    const completedToday = habits.filter(h => h.completed).length;

    return (
        <div className="full-page">
            <div className="page-header">
                <h2>👤 {user.fullName}'s Profile</h2>
                <p>Your gardening journey</p>
            </div>
            <div className="profile-full">
                <div className="profile-avatar-large"><div className="avatar-flower">🌸🌿🌻</div></div>
                <div className="profile-info-card">
                    <div className="profile-info-item"><span className="profile-info-label">👤 Username:</span><span className="profile-info-value">{user.username}</span></div>
                    <div className="profile-info-item"><span className="profile-info-label">📛 Full Name:</span><span className="profile-info-value">{user.fullName}</span></div>
                    <div className="profile-info-item"><span className="profile-info-label">📧 Email:</span><span className="profile-info-value">{user.email}</span></div>
                    <div className="profile-info-item"><span className="profile-info-label">🎂 Age:</span><span className="profile-info-value">{user.age} years</span></div>
                    <div className="profile-info-item"><span className="profile-info-label">📱 Phone:</span><span className="profile-info-value">{user.phone}</span></div>
                    <div className="profile-info-item"><span className="profile-info-label">📅 Joined:</span><span className="profile-info-value">{user.joinDate}</span></div>
                </div>
                <div className="profile-stats-grid">
                    <div className="profile-stat-card"><div className="profile-stat-icon">🏆</div><div className="profile-stat-value">{totalXP}</div><div className="profile-stat-label">Total XP</div></div>
                    <div className="profile-stat-card"><div className="profile-stat-icon">🔥</div><div className="profile-stat-value">{totalStreak}</div><div className="profile-stat-label">Total Streak</div></div>
                    <div className="profile-stat-card"><div className="profile-stat-icon">🌱</div><div className="profile-stat-value">{habits.length}</div><div className="profile-stat-label">Plants</div></div>
                    <div className="profile-stat-card"><div className="profile-stat-icon">⭐</div><div className="profile-stat-value">{Math.floor(totalXP / 100) + 1}</div><div className="profile-stat-label">Level</div></div>
                </div>
                <div className="profile-badges">
                    <h3>🏅 Achievements</h3>
                    <div className="badges-grid">
                        {totalStreak >= 7 && <div className="badge">🔥 7 Day Streak</div>}
                        {habits.length >= 5 && <div className="badge">🌿 5 Plants</div>}
                        {totalXP >= 500 && <div className="badge">⭐ 500 XP</div>}
                        {completedToday === habits.length && habits.length > 0 && <div className="badge">✅ Perfect Day</div>}
                    </div>
                </div>
                <button className="logout-btn" onClick={onLogout}>🚪 Logout</button>
            </div>
        </div>
    );
}

export default ProfilePage;