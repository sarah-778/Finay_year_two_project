import { create } from 'zustand';
import api from '../api/axios';

export const useProductStore = create((set) => ({
  products: [],
  loading: false,

  fetchProducts: async () => {
    set({ loading: true });
    try {
      const { data } = await api.get('/products');
      // Ensure data is an array before setting
      set({ products: Array.isArray(data) ? data : [], loading: false });
    } catch (error) {
      set({ loading: false });
      console.error("Fetch failed:", error);
    }
  },

  addProduct: async (formData) => {
    try {
      // 1. We MUST set headers to multipart/form-data for images
      // 2. We use formData directly
      const { data } = await api.post('/products', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      // FIX: Your controller returns the product directly or as {product: ...}
      // This handles both cases to prevent the "undefined" error
      const newProduct = data.product ? data.product : data;

      set((state) => ({ 
        products: [newProduct, ...state.products] 
      }));
      
      return data;
    } catch (error) {
      console.error("Upload Error in Store:", error.response?.data || error.message);
      throw error; // Re-throw so the Dashboard can show the alert
    }
  },

  deleteProduct: async (id) => {
    try {
      await api.delete(`/products/${id}`);
      set((state) => ({ 
        products: state.products.filter(p => p.id !== id) 
      }));
    } catch (error) {
      console.error("Delete failed:", error);
      alert("Failed to delete asset. It might be linked to an order.");
    }
  }
}));