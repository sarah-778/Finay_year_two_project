import { create } from 'zustand';
import axios from '../api/axios';

export const useMessageStore = create((set) => ({
  messages: [],
  loading: false,

  // 1. Action to send a message (Used by Clients)
  sendMessage: async (formData) => {
    try {
      // Get the token from localStorage
      const token = localStorage.getItem('token');
      
      const { data } = await axios.post('/contact', formData, {
        headers: {
          // This allows the request to pass through the auth:sanctum middleware
          Authorization: `Bearer ${token}`,
        }
      });
      return data;
    } catch (error) {
      console.error("Message send failed:", error.response?.data || error.message);
      throw error;
    }
  },

  // 2. Action to fetch messages (Used by Admin Dashboard)
  fetchMessages: async () => {
    set({ loading: true });
    try {
      const token = localStorage.getItem('token');
      
      const { data } = await axios.get('/messages', {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });

      // Laravel often returns the list inside a 'data' property if using resources
      const messageList = Array.isArray(data) ? data : data.data || [];
      
      set({ messages: messageList, loading: false });
    } catch (error) {
      set({ loading: false });
      console.error("Failed to fetch messages:", error);
    }
  }
}));