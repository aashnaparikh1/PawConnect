export const saveToken = (token) => {
  if (token) {
    localStorage.setItem('token', token);
  }
};

export const getToken = () => {
  return localStorage.getItem('token');
};

export const saveUser = (userData) => {
  if (userData) {
    // If the backend response wraps the user in a `user` property, use that.
    // Otherwise, store the userData directly.
    const userToSave = userData.user ? userData.user : userData;
    localStorage.setItem('user', JSON.stringify(userToSave));
  }
};

export const getUser = () => {
  const userStr = localStorage.getItem('user');
  if (!userStr) return null;
  try {
    return JSON.parse(userStr);
  } catch (error) {
    console.error('Error parsing user from localStorage:', error);
    return null;
  }
};

export const isAuthenticated = () => {
  const token = getToken();
  if (!token) return false;

  // Optional check for JWT expiration
  try {
    const parts = token.split('.');
    if (parts.length === 3) {
      const payload = JSON.parse(atob(parts[1]));
      if (payload.exp && Date.now() >= payload.exp * 1000) {
        logout();
        return false;
      }
    }
  } catch (error) {
    // In case token parsing fails, still assume authenticated if token is present
  }

  return true;
};

export const getAuthHeaders = () => {
  const token = getToken();
  return {
    'Content-Type': 'application/json',
    'Authorization': token ? `Bearer ${token}` : '',
  };
};

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};
