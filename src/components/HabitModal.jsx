import React, { useState } from 'react';

function HabitModal({ isOpen, onClose, onAdd }) {
    const [habitName, setHabitName] = useState('');
    const [goal, setGoal] = useState('daily');
    const [time, setTime] = useState('morning');
    const [reminder, setReminder] = useState('09:00');
    const [duration, setDuration] = useState('30');

    if (!isOpen) return null;

    const handleSubmit = () => {
        if (!habitName.trim()) return;
        onAdd(habitName, goal, time, reminder, duration);
        setHabitName('');
        setGoal('daily');
        setTime('morning');
        setReminder('09:00');
        setDuration('30');
        onClose();
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="add-modal" onClick={e => e.stopPropagation()}>
                <div className="modal-icon">🌸🌱🌸</div>
                <h2>Plant New Habit</h2>
                <input type="text" value={habitName} onChange={e => setHabitName(e.target.value)} placeholder="Enter habit name..." className="modal-input" autoFocus />

                <div className="option-group"><label>📅 How often?</label><div className="options">
                    <button className={`option ${goal === 'daily' ? 'active' : ''}`} onClick={() => setGoal('daily')}>Daily</button>
                    <button className={`option ${goal === 'weekly' ? 'active' : ''}`} onClick={() => setGoal('weekly')}>Weekly</button>
                    <button className={`option ${goal === 'monthly' ? 'active' : ''}`} onClick={() => setGoal('monthly')}>Monthly</button>
                </div></div>

                <div className="option-group"><label>⏰ Best time?</label><div className="options">
                    <button className={`option ${time === 'morning' ? 'active' : ''}`} onClick={() => setTime('morning')}>🌅 Morning</button>
                    <button className={`option ${time === 'afternoon' ? 'active' : ''}`} onClick={() => setTime('afternoon')}>☀️ Afternoon</button>
                    <button className={`option ${time === 'evening' ? 'active' : ''}`} onClick={() => setTime('evening')}>🌙 Evening</button>
                </div></div>

                <div className="option-group"><label>🔔 Reminder Time</label>
                    <input type="time" value={reminder} onChange={e => setReminder(e.target.value)} className="modal-time-input" />
                    <p className="field-note">Get notified at this time</p>
                </div>

                <div className="option-group"><label>⏱️ Duration (minutes)</label>
                    <div className="duration-input-group">
                        <input type="range" min="5" max="180" step="5" value={duration} onChange={e => setDuration(e.target.value)} className="duration-slider" />
                        <input type="number" value={duration} onChange={e => setDuration(e.target.value)} className="duration-number" min="5" max="180" />
                        <span>minutes</span>
                    </div>
                    <p className="field-note">How many minutes you want to spend</p>
                </div>

                <div className="modal-buttons">
                    <button className="cancel-modal" onClick={onClose}>Cancel</button>
                    <button className="confirm-modal" onClick={handleSubmit}>🌿 Plant Habit 🌸</button>
                </div>
            </div>
        </div>
    );
}

export default HabitModal;