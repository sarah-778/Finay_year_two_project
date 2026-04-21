import { create } from 'zustand';
import api from '../api/axios';

export const useAuthStore = create((set) => ({
  user: null,
  allUsers: [],
  loading: false,
  isAuthenticated: !!localStorage.getItem('token'),

  // --- NEW: Check Auth & Get Profile ---
  checkAuth: async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      set({ user: null, isAuthenticated: false });
      return;
    }

    try {
      // This route should point to your backend's "me" or "profile" endpoint
      const { data } = await api.get('/user'); 
      set({ user: data, isAuthenticated: true });
    } catch (error) {
      console.error("Auth check failed:", error);
      localStorage.removeItem('token');
      set({ user: null, isAuthenticated: false });
    }
  },

  fetchAllUsers: async () => {
    set({ loading: true });
    try {
      const { data } = await api.get('/users');
      set({ allUsers: Array.isArray(data) ? data : [], loading: false });
    } catch (error) {
      set({ loading: false });
    }
  },

  register: async (formData) => {
    const { data } = await api.post('/register', formData);
    localStorage.setItem('token', data.token);
    set({ user: data.user, isAuthenticated: true });
  },

  login: async (credentials) => {
    const { data } = await api.post('/login', credentials);
    localStorage.setItem('token', data.token);
    set({ user: data.user, isAuthenticated: true });
  },

  logout: () => {
    localStorage.removeItem('token');
    set({ user: null, allUsers: [], isAuthenticated: false });
  },
  updateProfile: async (updatedData) => {
    try {
      // 1. Send the PUT request to Laravel
      const { data } = await api.put('/user/update', updatedData);
      
      // 2. Immediately update the global 'user' state so the UI refreshes
      set({ user: data.user }); 
      
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || "Failed to update" 
      };
    }
  },
}));