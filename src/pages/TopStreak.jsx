import React from 'react';

function TopStreakPage({ habits }) {
    const getEmoji = (stage) => {
        const emojis = ['🌱', '🌿', '🌻', '🌸'];
        return emojis[stage] || '🌱';
    };

    const topHabit = habits.reduce((max, h) => h.streak > max.streak ? h : max, habits[0] || { name: 'None', streak: 0 });

    return (
        <div className="full-page">
            <div className="page-header">
                <h2>🏆 Streak Champion</h2>
                <p>Who's growing the strongest?</p>
            </div>
            <div className="top-streak-full">
                <div className="champion-card">
                    <div className="champion-trophy">🏆👑🏆</div>
                    <div className="champion-name">{topHabit.name}</div>
                    <div className="champion-streak">🔥 {topHabit.streak} day streak!</div>
                    <div className="champion-flower">{getEmoji(topHabit.stage)}</div>
                </div>
                <div className="streak-full-list">
                    <h3>📊 Leaderboard</h3>
                    {habits.sort((a, b) => b.streak - a.streak).map((habit, index) => (
                        <div key={habit.id} className="streak-full-item">
                            <div className="streak-rank">{index + 1}</div>
                            <div className="streak-flower">{getEmoji(habit.stage)}</div>
                            <div className="streak-name" title={habit.name}>{habit.name.length > 20 ? habit.name.substring(0, 18) + '...' : habit.name}</div>
                            <div className="streak-count">🔥 {habit.streak}</div>
                            <div className="streak-xp">✨ {habit.xp}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default TopStreakPage;