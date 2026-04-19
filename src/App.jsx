import React, { useState, useEffect, useRef } from 'react';
import './App.css';

// Login Component
function Login({ onLogin, onSwitch }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const users = JSON.parse(localStorage.getItem('gardenUsers') || '[]');
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

// Register Component
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

    const users = JSON.parse(localStorage.getItem('gardenUsers') || '[]');

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
    localStorage.setItem('gardenUsers', JSON.stringify(users));
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

// Plant Card Component
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

// Navbar Component
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

// Habit Modal Component
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

// Main Garden App Component
function GardenApp({ user, onLogout }) {
  const [habits, setHabits] = useState([]);
  const [currentPage, setCurrentPage] = useState('garden');
  const [showModal, setShowModal] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMsg, setNotificationMsg] = useState('');
  const scrollRef = useRef(null);
  let isDragging = false;
  let startX, scrollLeft;

  useEffect(() => {
    setHabits(user.habits || []);
  }, [user]);

  const showToast = (message) => {
    setNotificationMsg(message);
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 3000);
  };

  const saveUserHabits = (newHabits) => {
    setHabits(newHabits);
    const users = JSON.parse(localStorage.getItem('gardenUsers') || '[]');
    const updatedUsers = users.map(u =>
      u.id === user.id ? { ...u, habits: newHabits, totalXP: newHabits.reduce((s, h) => s + h.xp, 0) } : u
    );
    localStorage.setItem('gardenUsers', JSON.stringify(updatedUsers));
  };

  const addHabit = (name, goal, time, reminder, duration) => {
    const todayStr = new Date().toISOString().split('T')[0];
    const newHabit = {
      id: Date.now(),
      name,
      streak: 0,
      level: 1,
      xp: 0,
      stage: 0,
      completed: false,
      total: 0,
      goal,
      time,
      reminderTime: reminder,
      duration,
      dates: { [todayStr]: false }
    };
    saveUserHabits([newHabit, ...habits]);
    showToast(`🌱 New habit planted!`);
  };

  const completeHabit = (id) => {
    const todayStr = new Date().toISOString().split('T')[0];
    const updatedHabits = habits.map(h =>
      h.id === id && !h.completed
        ? {
          ...h,
          completed: true,
          streak: h.streak + 1,
          xp: h.xp + 10,
          total: h.total + 1,
          level: Math.floor((h.xp + 10) / 100) + 1,
          stage: h.total + 1 >= 30 ? 3 : h.total + 1 >= 15 ? 2 : h.total + 1 >= 5 ? 1 : 0,
          dates: { ...h.dates, [todayStr]: true }
        }
        : h
    );
    saveUserHabits(updatedHabits);
    showToast('💧 Plant watered! +10 XP');
  };

  const deleteHabit = (id) => {
    if (window.confirm('Delete this habit?')) {
      saveUserHabits(habits.filter(h => h.id !== id));
      showToast('🗑️ Habit removed');
    }
  };

  const updateHabit = (id, newName, newReminder, newDuration) => {
    const updatedHabits = habits.map(h => h.id === id ? { ...h, name: newName, reminderTime: newReminder, duration: newDuration } : h);
    saveUserHabits(updatedHabits);
    showToast('✏️ Habit updated!');
  };

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

  const getEmoji = (stage) => {
    const emojis = ['🌱', '🌿', '🌻', '🌸'];
    return emojis[stage] || '🌱';
  };

  const totalXP = habits.reduce((s, h) => s + h.xp, 0);
  const totalStreak = habits.reduce((s, h) => s + h.streak, 0);
  const completedToday = habits.filter(h => h.completed).length;
  const topHabit = habits.reduce((max, h) => h.streak > max.streak ? h : max, habits[0] || { name: 'None', streak: 0 });

  // Garden Page
  const GardenPage = () => (
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
          <PlantCard key={habit.id} habit={habit} onComplete={completeHabit} onDelete={deleteHabit} onUpdate={updateHabit} />
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

  // Habits Page
  const HabitsPage = () => (
    <div className="full-page">
      <div className="page-header"><h2>📋 All My Habits</h2><p>🌸 {habits.length} beautiful habits growing</p></div>
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
            <div className="habit-full-status">{habit.completed ? <span className="status-done">✅ Done</span> : <button className="status-water" onClick={() => completeHabit(habit.id)}>💧 Water</button>}</div>
          </div>
        ))}
      </div>
    </div>
  );

  // Top Streak Page
  const TopStreakPage = () => (
    <div className="full-page">
      <div className="page-header"><h2>🏆 Streak Champion</h2><p>Who's growing the strongest?</p></div>
      <div className="top-streak-full"><div className="champion-card"><div className="champion-trophy">🏆👑🏆</div><div className="champion-name">{topHabit.name}</div><div className="champion-streak">🔥 {topHabit.streak} day streak!</div><div className="champion-flower">{getEmoji(topHabit.stage)}</div></div>
        <div className="streak-full-list"><h3>📊 Leaderboard</h3>{habits.sort((a, b) => b.streak - a.streak).map((habit, index) => (<div key={habit.id} className="streak-full-item"><div className="streak-rank">{index + 1}</div><div className="streak-flower">{getEmoji(habit.stage)}</div><div className="streak-name" title={habit.name}>{habit.name.length > 20 ? habit.name.substring(0, 18) + '...' : habit.name}</div><div className="streak-count">🔥 {habit.streak}</div><div className="streak-xp">✨ {habit.xp}</div></div>))}</div></div>
    </div>
  );

  // Profile Page
  const ProfilePage = () => (
    <div className="full-page">
      <div className="page-header"><h2>👤 {user.fullName}'s Profile</h2><p>Your gardening journey</p></div>
      <div className="profile-full"><div className="profile-avatar-large"></div>
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
        <div className="profile-badges"><h3>🏅 Achievements</h3><div className="badges-grid">
          {totalStreak >= 7 && <div className="badge">🔥 7 Day Streak</div>}
          {habits.length >= 5 && <div className="badge">🌿 5 Plants</div>}
          {totalXP >= 500 && <div className="badge">⭐ 500 XP</div>}
          {completedToday === habits.length && habits.length > 0 && <div className="badge">✅ Perfect Day</div>}
        </div></div>
        <button className="logout-btn" onClick={onLogout}>🚪 Logout</button>
      </div>
    </div>
  );

  return (
    <div className="app">
      {showNotification && <div className="toast-notification">{notificationMsg}</div>}
      <div className="header"><div className="header-top"><h1 className="logo">🌸 Habit Garden 🌿</h1><button className="add-icon" onClick={() => setShowModal(true)}>+</button></div></div>
      <div className="page-container">
        {currentPage === 'garden' && <GardenPage />}
        {currentPage === 'habits' && <HabitsPage />}
        {currentPage === 'topstreak' && <TopStreakPage />}
        {currentPage === 'profile' && <ProfilePage />}
      </div>
      <Navbar currentPage={currentPage} setCurrentPage={setCurrentPage} />
      <HabitModal isOpen={showModal} onClose={() => setShowModal(false)} onAdd={addHabit} />
    </div>
  );
}

// Main App Component
function App() {
  const [user, setUser] = useState(null);
  const [authPage, setAuthPage] = useState('login');

  useEffect(() => {
    const savedUser = localStorage.getItem('currentGardenUser');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem('currentGardenUser', JSON.stringify(userData));
  };

  const handleRegister = (userData) => {
    setUser(userData);
    localStorage.setItem('currentGardenUser', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('currentGardenUser');
  };

  if (!user) {
    if (authPage === 'login') {
      return <Login onLogin={handleLogin} onSwitch={setAuthPage} />;
    } else {
      return <Register onRegister={handleRegister} onSwitch={setAuthPage} />;
    }
  }

  return <GardenApp user={user} onLogout={handleLogout} />;
}

export default App;