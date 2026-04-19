import React from 'react';

function HabitsPage({ habits, onComplete }) {
    const getEmoji = (stage) => {
        const emojis = ['🌱', '🌿', '🌻', '🌸'];
        return emojis[stage] || '🌱';
    };

    return (
        <div className="full-page">
            <div className="page-header">
                <h2>📋 All My Habits</h2>
                <p>🌸 {habits.length} beautiful habits growing</p>
            </div>
            <div className="habits-full-list">
                {habits.map(habit => (
                    <div key={habit.id} className="habit-full-card">
                        <div className="habit-full-emoji">{getEmoji(habit.stage)}</div>
                        <div className="habit-full-info">
                            <div className="habit-full-name" title={habit.name}>{habit.name}</div>
                            <div className="habit-full-details">
                                <span className="detail-streak">🔥 {habit.streak}</span>
                                <span className="detail-level">⭐ {habit.level}</span>
                                <span className="detail-xp">✨ {habit.xp}</span>
                                <span className="detail-reminder">🔔 {habit.reminderTime || 'No reminder'}</span>
                                <span className="detail-duration">⏱️ {habit.duration || '30'} min</span>
                            </div>
                            <div className="habit-full-goal">🎯 {habit.total}/30</div>
                        </div>
                        <div className="habit-full-status">
                            {habit.completed ? <span className="status-done">✅ Done</span> : <button className="status-water" onClick={() => onComplete(habit.id)}>💧 Water</button>}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default HabitsPage;