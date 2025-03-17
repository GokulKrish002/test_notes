'use client';

import { create } from 'zustand';
import { authApi } from '../lib/authApi';

const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: typeof window !== 'undefined' && !!localStorage.getItem('auth-token'),
  isLoading: false,
  error: null,
  
  signIn: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await authApi.signIn(email, password);
      set({ 
        isAuthenticated: true, 
        isLoading: false 
      });
      return response;
    } catch (error) {
      set({ 
        error: error.response?.data?.detail || 'Failed to sign in', 
        isLoading: false 
      });
      throw error;
    }
  },
  
  signUp: async (username, email, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await authApi.signUp(username, email, password);
      set({ isLoading: false });
      return response;
    } catch (error) {
      set({ 
        error: error.response?.data?.detail || 'Failed to sign up', 
        isLoading: false 
      });
      throw error;
    }
  },
  
  signOut: async () => {
    set({ isLoading: true });
    try {
      await authApi.signOut();
    } finally {
      set({ 
        user: null, 
        isAuthenticated: false, 
        isLoading: false 
      });
    }
  },
  
  checkAuth: async () => {
    if (typeof window === 'undefined') return false;
    
    const token = localStorage.getItem('auth-token');
    if (!token) {
      set({ isAuthenticated: false });
      return false;
    }
    
    try {
      const user = await authApi.getUser();
      if (user) {
        set({ user, isAuthenticated: true });
        return true;
      } else {
        set({ isAuthenticated: false });
        return false;
      }
    } catch (error) {
      localStorage.removeItem('auth-token');
      set({ isAuthenticated: false });
      return false;
    }
  },
  
  clearError: () => set({ error: null })
}));

export default useAuthStore;