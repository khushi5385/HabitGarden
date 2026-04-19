import React, { useRef } from 'react';
import PlantCard from '../components/PlantCard';

function GardenPage({ habits, onComplete, onDelete, onUpdate }) {
    const scrollRef = useRef(null);
    let isDragging = false;
    let startX, scrollLeft;

    const getEmoji = (stage) => {
        const emojis = ['🌱', '🌿', '🌻', '🌸'];
        return emojis[stage] || '🌱';
    };

    const totalXP = habits.reduce((s, h) => s + h.xp, 0);
    const totalStreak = habits.reduce((s, h) => s + h.streak, 0);
    const completedToday = habits.filter(h => h.completed).length;

    // Drag handlers
    const handleMouseDown = (e) => {
        if (e.target.closest('.icon-btn') || e.target.closest('.water-btn') || e.target.closest('.completed-badge')) return;
        isDragging = true;
        startX = e.pageX - scrollRef.current.offsetLeft;
        scrollLeft = scrollRef.current.scrollLeft;
        scrollRef.current.style.cursor = 'grabbing';
    };
    const handleMouseUp = () => {
        isDragging = false;
        if (scrollRef.current) scrollRef.current.style.cursor = 'grab';
    };
    const handleMouseMove = (e) => {
        if (!isDragging) return;
        e.preventDefault();
        const x = e.pageX - scrollRef.current.offsetLeft;
        const walk = (x - startX) * 1.5;
        scrollRef.current.scrollLeft = scrollLeft - walk;
    };
    const handleTouchStart = (e) => {
        if (e.target.closest('.icon-btn') || e.target.closest('.water-btn') || e.target.closest('.completed-badge')) return;
        isDragging = true;
        startX = e.touches[0].pageX - scrollRef.current.offsetLeft;
        scrollLeft = scrollRef.current.scrollLeft;
    };
    const handleTouchMove = (e) => {
        if (!isDragging) return;
        const x = e.touches[0].pageX - scrollRef.current.offsetLeft;
        const walk = (x - startX) * 1.5;
        scrollRef.current.scrollLeft = scrollLeft - walk;
    };
    const handleTouchEnd = () => {
        isDragging = false;
    };

    return (
        <>
            <div className="stats-row">
                <div className="stat-block"><span className="stat-emoji">🏆</span><span className="stat-number">{totalXP}</span><span className="stat-label">Total XP</span></div>
                <div className="stat-block"><span className="stat-emoji">🔥</span><span className="stat-number">{totalStreak}</span><span className="stat-label">Total Streak</span></div>
                <div className="stat-block"><span className="stat-emoji">✅</span><span className="stat-number">{completedToday}/{habits.length}</span><span className="stat-label">Today</span></div>
            </div>

            <div className="section-title"><span>🌱 My Garden</span><span className="card-count">{habits.length} plants</span></div>

            <div className="horizontal-scroll hide-scrollbar" ref={scrollRef}
                onMouseDown={handleMouseDown} onMouseUp={handleMouseUp} onMouseMove={handleMouseMove}
                onTouchStart={handleTouchStart} onTouchMove={handleTouchMove} onTouchEnd={handleTouchEnd}>
                {habits.map(habit => (
                    <PlantCard key={habit.id} habit={habit} onComplete={onComplete} onDelete={onDelete} onUpdate={onUpdate} />
                ))}
            </div>

            <div className="section-title"><span>📋 Recent Activity</span><span>Latest</span></div>
            <div className="recent-list">
                {habits.slice(0, 5).map(h => (
                    <div key={h.id} className="recent-item">
                        <span className="recent-emoji">{getEmoji(h.stage)}</span>
                        <span className="recent-name" title={h.name}>{h.name.length > 25 ? h.name.substring(0, 23) + '...' : h.name}</span>
                        <span className="recent-streak">🔥 {h.streak}</span>
                        <span className="recent-time">🔔 {h.reminderTime || 'No reminder'}</span>
                    </div>
                ))}
            </div>
        </>
    );
}

export default GardenPage;