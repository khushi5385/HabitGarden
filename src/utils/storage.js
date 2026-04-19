// Get all users
export const getUsers = () => {
    const users = localStorage.getItem('gardenUsers');
    return users ? JSON.parse(users) : [];
};

// Save users
export const saveUsers = (users) => {
    localStorage.setItem('gardenUsers', JSON.stringify(users));
};

// Get current user
export const getCurrentUser = () => {
    const user = localStorage.getItem('currentGardenUser');
    return user ? JSON.parse(user) : null;
};

// Save current user
export const saveCurrentUser = (user) => {
    localStorage.setItem('currentGardenUser', JSON.stringify(user));
};

// Remove current user
export const removeCurrentUser = () => {
    localStorage.removeItem('currentGardenUser');
};

// Get user by id
export const getUserById = (id) => {
    const users = getUsers();
    return users.find(u => u.id === id) || null;
};