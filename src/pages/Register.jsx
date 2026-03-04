import { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { useAuthStore } from '../store/useAuthStore';

export default function Register() {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', password_confirmation: '' });
  const register = useAuthStore((state) => state.register);
  const navigate = useNavigate(); // Initialize navigate

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(formData);
      
      // Notify the user
      alert("Registration Successful! Please log in to your new account.");
      
      // Redirect to login page
      navigate('/login'); 
      
    } catch (err) {
      if (err.response && err.response.status === 422) {
        const errors = err.response.data.errors;
        alert(Object.values(errors).flat().join('\n'));
      } else {
        alert("Registration failed. Check your network connection.");
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center p-4">
      <form onSubmit={handleSubmit} className="bg-slate-800 p-8 rounded-2xl border border-slate-700 w-full max-w-md shadow-xl">
        {/* Bold, non-italic heading */}
        <h2 className="text-3xl font-black mb-6 text-blue-400 uppercase tracking-tight">
          Join IT Arena
        </h2>
        
        <div className="space-y-4">
          <input 
            type="text" 
            placeholder="Full Name" 
            required
            className="w-full p-4 rounded-xl bg-slate-700 border border-slate-600 focus:border-blue-500 outline-none transition-all" 
            onChange={(e) => setFormData({...formData, name: e.target.value})} 
          />
          
          <input 
            type="email" 
            placeholder="Email Address" 
            required
            className="w-full p-4 rounded-xl bg-slate-700 border border-slate-600 focus:border-blue-500 outline-none transition-all" 
            onChange={(e) => setFormData({...formData, email: e.target.value})} 
          />
          
          <input 
            type="password" 
            placeholder="Password" 
            required
            className="w-full p-4 rounded-xl bg-slate-700 border border-slate-600 focus:border-blue-500 outline-none transition-all" 
            onChange={(e) => setFormData({...formData, password: e.target.value})} 
          />
          
          <input 
            type="password" 
            placeholder="Confirm Password" 
            required
            className="w-full p-4 rounded-xl bg-slate-700 border border-slate-600 focus:border-blue-500 outline-none transition-all" 
            onChange={(e) => setFormData({...formData, password_confirmation: e.target.value})} 
          />
        </div>

        <button 
          type="submit" 
          className="w-full mt-8 bg-blue-600 hover:bg-blue-500 py-4 rounded-xl font-black uppercase tracking-widest transition-all shadow-lg shadow-blue-900/40 active:scale-95"
        >
          Create Account
        </button>

        <p className="text-center mt-6 text-slate-400 text-sm font-bold">
          Already have an account? {' '}
          <button 
            onClick={() => navigate('/login')} 
            className="text-blue-400 hover:underline"
          >
            Log In
          </button>
        </p>
      </form>
    </div>
  );
}