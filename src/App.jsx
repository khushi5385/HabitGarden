import React, { useState, useEffect } from 'react';
import './App.css';
import Login from './components/Login';
import Register from './components/Register';
import Navbar from './components/Navbar';
import HabitModal from './components/HabitModal';
import Garden from './pages/Garden';
import Habits from './pages/Habits';
import TopStreak from './pages/TopStreak';
import Profile from './pages/Profile';

// Simple storage functions
const getUsers = () => {
  const users = localStorage.getItem('gardenUsers');
  console.log('📖 getUsers from localStorage:', users);
  return users ? JSON.parse(users) : [];
};

const saveUsers = (users) => {
  console.log('💾 saveUsers to localStorage:', users);
  localStorage.setItem('gardenUsers', JSON.stringify(users));
};

const getCurrentUser = () => {
  const user = localStorage.getItem('currentGardenUser');
  console.log('👤 getCurrentUser:', user);
  return user ? JSON.parse(user) : null;
};

const saveCurrentUser = (user) => {
  console.log('💾 saveCurrentUser:', user);
  localStorage.setItem('currentGardenUser', JSON.stringify(user));
};

const removeCurrentUser = () => {
  localStorage.removeItem('currentGardenUser');
};

function App() {
  const [user, setUser] = useState(null);
  const [habits, setHabits] = useState([]);
  const [currentPage, setCurrentPage] = useState('garden');
  const [showModal, setShowModal] = useState(false);
  const [authPage, setAuthPage] = useState('login');
  const [loading, setLoading] = useState(true);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMsg, setNotificationMsg] = useState('');

  // Load user data on app start
  useEffect(() => {
    console.log('🔄 App loading...');
    const savedUser = getCurrentUser();
    console.log('📌 Saved user from storage:', savedUser);

    if (savedUser) {
      const users = getUsers();
      const freshUser = users.find(u => u.id === savedUser.id);

      if (freshUser) {
        console.log('✅ Found fresh user:', freshUser);
        console.log('📋 User habits:', freshUser.habits);
        setUser(freshUser);
        setHabits(freshUser.habits || []);
      } else {
        console.log('⚠️ User not found in users array, using saved user');
        setUser(savedUser);
        setHabits(savedUser.habits || []);
      }
    } else {
      console.log('❌ No saved user found');
    }
    setLoading(false);
  }, []);

  const showToast = (message) => {
    setNotificationMsg(message);
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 3000);
  };

  // Save habits to localStorage
  const saveUserHabits = (newHabits) => {
    console.log('💾 Saving habits:', newHabits);
    setHabits(newHabits);

    // Update in users array
    const users = getUsers();
    console.log('📋 Current users:', users);

    const updatedUsers = users.map(u =>
      u.id === user.id ? { ...u, habits: newHabits, totalXP: newHabits.reduce((s, h) => s + h.xp, 0) } : u
    );
    saveUsers(updatedUsers);

    // Update current user
    const updatedUser = { ...user, habits: newHabits, totalXP: newHabits.reduce((s, h) => s + h.xp, 0) };
    saveCurrentUser(updatedUser);
    setUser(updatedUser);

    console.log('✅ Habits saved successfully!');
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
    console.log('➕ Adding new habit:', newHabit);
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
    console.log('🔑 Login user:', userData);
    setUser(userData);
    setHabits(userData.habits || []);
    saveCurrentUser(userData);
    showToast('🎉 Welcome back!');
  };

  const handleRegister = (userData) => {
    console.log('📝 Register user:', userData);
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
    return (
      <div className="loading">
        <div className="loader"></div>
        <p>🌸 Loading your garden...</p>
      </div>
    );
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
      {showNotification && (
        <div className="toast-notification">
          {notificationMsg}
        </div>
      )}

      <div className="header">
        <div className="header-top">
          <h1 className="logo">🌸 Habit Garden 🌿</h1>
          <button className="add-icon" onClick={() => setShowModal(true)}>+</button>
        </div>
      </div>

      <div className="page-container">
        {currentPage === 'garden' && (
          <Garden
            habits={habits}
            onComplete={completeHabit}
            onDelete={deleteHabit}
            onUpdate={updateHabit}
          />
        )}
        {currentPage === 'habits' && (
          <Habits habits={habits} onComplete={completeHabit} />
        )}
        {currentPage === 'topstreak' && (
          <TopStreak habits={habits} />
        )}
        {currentPage === 'profile' && (
          <Profile user={user} habits={habits} onLogout={handleLogout} />
        )}
      </div>

      <Navbar currentPage={currentPage} setCurrentPage={setCurrentPage} />

      <HabitModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onAdd={addHabit}
      />
    </div>
  );
}

export default App;