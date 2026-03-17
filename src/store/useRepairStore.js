import { create } from 'zustand';
import api from '../api/axios';

export const useRepairStore = create((set) => ({

  // ------------------ ADMIN REPAIR SAMPLES ------------------
  repairSamples: [],
  loadingSamples: false,

  fetchRepairSamples: async () => {
    set({ loadingSamples: true });
    try {
      const { data } = await api.get('/repairs?type=sample');
      set({
        repairSamples: Array.isArray(data) ? data : [],
        loadingSamples: false
      });
    } catch (error) {
      set({ loadingSamples: false });
      console.error("Fetch repair samples failed:", error);
    }
  },

  addRepairSample: async (formData) => {
    try {
      // ✅ IMPORTANT: append type correctly
      formData.append("type", "sample");

      const response = await api.post('/repairs', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      set((state) => ({
        repairSamples: [response.data.repair || response.data, ...state.repairSamples]
      }));

      return response.data;

    } catch (error) {
      console.error("Add repair sample failed:", error.response?.data || error.message);
      throw error;
    }
  },

  deleteRepairSample: async (id) => {
    try {
      await api.delete(`/repairs/${id}`);
      set((state) => ({
        repairSamples: state.repairSamples.filter(s => s.id !== id)
      }));
    } catch (error) {
      console.error("Delete repair sample failed:", error);
    }
  },

  // ------------------ USER REPAIR REQUESTS ------------------
  userRepairRequests: [],
  loadingRequests: false,

  fetchUserRepairs: async () => {
    set({ loadingRequests: true });
    try {
      const { data } = await api.get('/repairs?type=user');
      set({
        userRepairRequests: Array.isArray(data) ? data : [],
        loadingRequests: false
      });
    } catch (error) {
      set({ loadingRequests: false });
      console.error("Fetch user repairs failed:", error);
    }
  },

  addUserRepair: async (formData) => {
    try {
      // ✅ append type properly
      formData.append("type", "user");

      const response = await api.post('/repairs', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      set((state) => ({
        userRepairRequests: [response.data.repair || response.data, ...state.userRepairRequests]
      }));

      return response.data;

    } catch (error) {
      console.error("Add user repair failed:", error.response?.data || error.message);
      throw error;
    }
  },

  deleteUserRepair: async (id) => {
    try {
      await api.delete(`/repairs/${id}`);
      set((state) => ({
        userRepairRequests: state.userRepairRequests.filter(r => r.id !== id)
      }));
    } catch (error) {
      console.error("Delete user repair failed:", error);
    }
  },
// ... existing code in useRepairStore.js
trackRepair: async (trackingCode) => {
  set({ loadingRequests: true });
  try {
    const { data } = await api.get(`/repairs/track/${trackingCode}`);
    set({ loadingRequests: false });
    return data; 
  } catch (error) {
    set({ loadingRequests: false });
    return null;
  }
},

// ADD THIS: To update the status from the Admin Dashboard
// Inside useRepairStore.js

updateRepairStatus: async (id, status) => {
  try {
    // 1. Ensure the URL matches the Laravel route: /repairs/{id}/status
    // 2. We use .patch because we are only updating one field
    const { data } = await api.patch(`/repairs/${id}/status`, { status });

    set((state) => ({
      userRepairRequests: state.userRepairRequests.map((r) =>
        // 3. Laravel returns { message: "...", repair: {...} }
        // We check for data.repair.status to update the UI
        r.id === id ? { ...r, status: data.repair.status } : r
      ),
    }));
  } catch (error) {
    console.error("Failed to update status:", error.response?.data || error.message);
    alert("Database update failed. Check your Laravel routes.");
  }
},

}));