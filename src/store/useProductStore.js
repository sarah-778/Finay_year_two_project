import { create } from 'zustand';
import api from '../api/axios';

export const useProductStore = create((set) => ({
  products: [],
  loading: false,

  fetchProducts: async () => {
    set({ loading: true });
    try {
      const { data } = await api.get('/products');
      set({ products: data, loading: false });
    } catch (error) { set({ loading: false }); }
  },

  addProduct: async (productData) => {
    try {
      const { data } = await api.post('/products', productData);
      set((state) => ({ products: [data.product, ...state.products] }));
      return data;
    } catch (error) {
      // This allows the AdminDashboard's 'catch' block to see the error
      throw error;
    }
  },

  deleteProduct: async (id) => {
    await api.delete(`/products/${id}`);
    set((state) => ({ products: state.products.filter(p => p.id !== id) }));
  }
}));