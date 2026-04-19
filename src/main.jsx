import React, { useState, useEffect } from 'react';
import Login from './components/Login';
import Register from './components/Register';
import Navbar from './components/Navbar';
import HabitModal from './components/HabitModal';
import Garden from './pages/Garden';
import Habits from './pages/Habits';
import TopStreak from './pages/TopStreak';
import Profile from './pages/Profile';
import { getCurrentUser, saveCurrentUser, removeCurrentUser, getUsers, saveUsers } from './utils/storage';

function App() {
  const [user, setUser] = useState(null);
  const [habits, setHabits] = useState([]);
  const [currentPage, setCurrentPage] = useState('garden');
  const [showModal, setShowModal] = useState(false);
  const [authPage, setAuthPage] = useState('login');
  const [loading, setLoading] = useState(true);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMsg, setNotificationMsg] = useState('');

  useEffect(() => {
    const savedUser = getCurrentUser();
    if (savedUser) {
      setUser(savedUser);
      setHabits(savedUser.habits || []);
    }
    setLoading(false);
  }, []);

  const showToast = (message) => {
    setNotificationMsg(message);
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 3000);
  };

  const saveUserHabits = (newHabits) => {
    setHabits(newHabits);
    const users = getUsers();
    const updatedUsers = users.map(u =>
      u.id === user.id ? { ...u, habits: newHabits, totalXP: newHabits.reduce((s, h) => s + h.xp, 0) } : u
    );
    saveUsers(updatedUsers);
    const updatedUser = { ...user, habits: newHabits, totalXP: newHabits.reduce((s, h) => s + h.xp, 0) };
    saveCurrentUser(updatedUser);
    setUser(updatedUser);
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

  const handleLogin = (userData) => {
    setUser(userData);
    setHabits(userData.habits || []);
    saveCurrentUser(userData);
    showToast('🎉 Welcome back!');
  };

  const handleRegister = (userData) => {
    setUser(userData);
    setHabits(userData.habits || []);
    saveCurrentUser(userData);
    showToast('🌸 Welcome to Habit Garden!');
  };

  const handleLogout = () => {
    setUser(null);
    setHabits([]);
    removeCurrentUser();
    showToast('👋 See you soon!');
  };

  if (loading) {
    return <div className="loading"><div className="loader"></div><p>🌸 Loading...</p></div>;
  }

  if (!user) {
    if (authPage === 'login') {
      return <Login onLogin={handleLogin} onSwitch={setAuthPage} />;
    } else {
      return <Register onRegister={handleRegister} onSwitch={setAuthPage} />;
    }
  }

  return (
    <div className="app">
      {showNotification && <div className="toast-notification">{notificationMsg}</div>}

      <div className="header">
        <div className="header-top">
          <h1 className="logo">🌸 Habit Garden 🌿</h1>
          <button className="add-icon" onClick={() => setShowModal(true)}>+</button>
        </div>
      </div>

      <div className="page-container">
        {currentPage === 'garden' && <GardenPage habits={habits} onComplete={completeHabit} onDelete={deleteHabit} onUpdate={updateHabit} />}
        {currentPage === 'habits' && <Habits habits={habits} onComplete={completeHabit} />}
        {currentPage === 'topstreak' && <TopStreak habits={habits} />}
        {currentPage === 'profile' && <Profile user={user} habits={habits} onLogout={handleLogout} />}
      </div>

      <Navbar currentPage={currentPage} setCurrentPage={setCurrentPage} />
      <HabitModal isOpen={showModal} onClose={() => setShowModal(false)} onAdd={addHabit} />
    </div>
  );
}

export default App;