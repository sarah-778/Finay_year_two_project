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
  }

}));