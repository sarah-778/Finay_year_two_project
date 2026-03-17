import { create } from 'zustand';
import axios from 'axios';

export const useOrderStore = create((set, get) => ({
  orders: [],
  loading: false,

  // Fetch all orders for the Admin Panel
  fetchOrders: async () => {
    set({ loading: true });
    try {
      const token = localStorage.getItem('token'); // Get your auth token
      const response = await axios.get('http://localhost:8000/api/orders', {
        headers: { Authorization: `Bearer ${token}` }
      });
      set({ orders: response.data, loading: false });
    } catch (error) {
      console.error("Error fetching orders:", error);
      set({ loading: false });
    }
  },

  // Update order status (e.g., marking as Delivered)
  updateOrderStatus: async (orderId, status) => {
    try {
      const token = localStorage.getItem('token');
      await axios.patch(`http://localhost:8000/api/orders/${orderId}/status`, 
        { status }, 
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // Update local state so the UI changes instantly
      set({
        orders: get().orders.map(o => o.id === orderId ? { ...o, status } : o)
      });
    } catch (error) {
      alert("Failed to update status");
    }
  }
}));