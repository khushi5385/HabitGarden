import React, { useState } from 'react';

function PlantCard({ habit, onComplete, onDelete, onUpdate }) {
    const [isEditing, setIsEditing] = useState(false);
    const [editName, setEditName] = useState(habit.name);
    const [editReminder, setEditReminder] = useState(habit.reminderTime || '09:00');
    const [editDuration, setEditDuration] = useState(habit.duration || '30');

    const getEmoji = (stage, completed) => {
        if (completed) return '🌻';
        const emojis = ['🌱', '🌿', '🌻', '🌸'];
        return emojis[stage] || '🌱';
    };

    const getStageName = (stage) => {
        const names = ['Seedling', 'Sprout', 'Blooming', 'Full Flower'];
        return names[stage] || 'Seedling';
    };

    const handleSave = () => {
        onUpdate(habit.id, editName, editReminder, editDuration);
        setIsEditing(false);
    };

    if (isEditing) {
        return (
            <div className={`plant-card stage-${habit.stage}`}>
                <div className="edit-mode">
                    <input value={editName} onChange={(e) => setEditName(e.target.value)} className="edit-input" placeholder="Habit name" />
                    <div className="edit-row">
                        <label>⏰ Reminder:</label>
                        <input type="time" value={editReminder} onChange={(e) => setEditReminder(e.target.value)} className="edit-time" />
                    </div>
                    <div className="edit-row">
                        <label>⏱️ Duration:</label>
                        <input type="number" value={editDuration} onChange={(e) => setEditDuration(e.target.value)} className="edit-duration" min="5" max="180" />
                        <span>minutes</span>
                    </div>
                    <div className="edit-buttons">
                        <button className="save-btn" onClick={handleSave}>Save</button>
                        <button className="cancel-btn" onClick={() => setIsEditing(false)}>Cancel</button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={`plant-card stage-${habit.stage}`}>
            <div className="card-icons">
                <button className="icon-btn edit" onClick={() => setIsEditing(true)}>✏️</button>
                <button className="icon-btn delete" onClick={() => onDelete(habit.id)}>🗑️</button>
            </div>
            <div className="plant-emoji">{getEmoji(habit.stage, habit.completed)}</div>
            <h3 className="plant-name" title={habit.name}>{habit.name.length > 20 ? habit.name.substring(0, 18) + '...' : habit.name}</h3>
            <div className="stage-name">{getStageName(habit.stage)}</div>
            <div className="habit-details">
                <span className="detail-reminder">🔔 {habit.reminderTime || 'No reminder'}</span>
                <span className="detail-duration">⏱️ {habit.duration || '30'} min</span>
            </div>
            <div className="card-stats">
                <span className="badge-streak">🔥 {habit.streak}</span>
                <span className="badge-level">⭐ {habit.level}</span>
                <span className="badge-xp">✨ {habit.xp}</span>
            </div>
            <div className="progress-bar"><div className="progress-fill" style={{ width: `${habit.xp % 100}%` }}></div></div>
            <div className="goal-text">🎯 {habit.total}/30</div>
            {habit.completed ?
                <div className="completed-badge">✅ Done Today</div> :
                <button className="water-btn" onClick={() => onComplete(habit.id)}>💧 Water</button>
            }
        </div>
    );
}

export default PlantCard;