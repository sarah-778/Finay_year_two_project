import { create } from 'zustand';
import api from '../api/axios';

export const useAuthStore = create((set) => ({
  user: null,
  allUsers: [], // New state to hold all registered users
  loading: false,
  isAuthenticated: !!localStorage.getItem('token'),

  // --- ADMIN ACTIONS ---
  
  // This fetches everyone from your \App\Models\User::all() route
  fetchAllUsers: async () => {
    set({ loading: true });
    try {
      const { data } = await api.get('/users');
      // Ensure data is an array before setting state
      set({ allUsers: Array.isArray(data) ? data : [], loading: false });
    } catch (error) {
      console.error("Failed to fetch users:", error);
      set({ loading: false });
    }
  },

  // --- AUTH ACTIONS ---

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
    // Clear users and auth status on logout
    set({ user: null, allUsers: [], isAuthenticated: false });
  }
}));