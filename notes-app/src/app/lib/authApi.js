import axiosInstance from './axios';

export const authApi = {
  signUp: async (username, email, password) => {
    const response = await axiosInstance.post('/auth/signup', {
      user_name: username,
      user_email: email,
      password
    });
    return response.data;
  },
  
  signIn: async (email, password) => {
    const response = await axiosInstance.post('/auth/signin', {
      username: email, // FastAPI OAuth2PasswordRequestForm expects 'username'
      password: password,
    }, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });
    
    // Store the token
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth-token', response.data.access_token);
    }
    
    return response.data;
  },
  
  signOut: async () => {
    try {
      await axiosInstance.post('/auth/signout');
    } finally {
      // Always clear the token, even if the API call fails
      if (typeof window !== 'undefined') {
        localStorage.removeItem('auth-token');
      }
    }
  },
  
  getUser: async () => {
    const token = localStorage.getItem('auth-token');
    if (!token) return null;
    
    try {
      const response = await axiosInstance.get('/auth/me');
      return response.data;
    } catch (error) {
      return null;
    }
  }
};