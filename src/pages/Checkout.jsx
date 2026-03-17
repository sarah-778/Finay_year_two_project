import React, { useState } from 'react';
import { useCartStore } from '../store/useCartStore';
import { useNavigate } from 'react-router-dom'; // For redirection
import axios from 'axios';
import { HiOutlineChevronLeft, HiOutlineCheckCircle } from "react-icons/hi";

const districts = [
  "Kampala", "Entebbe", "Mukono", "Wakiso", "Jinja", "Mbarara", "Gulu"
];

export default function Checkout() {
  const navigate = useNavigate();
  const { cart, getTotalPrice, clearCart } = useCartStore();
  const [formData, setFormData] = useState({
    name: '', phone: '', email: '', district: 'Kampala', address: ''
  });
  const [loading, setLoading] = useState(false);

  const deliveryFee = formData.district === "Kampala" ? 10000 : 20000;
  const subtotal = getTotalPrice();
  const total = subtotal + deliveryFee;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (cart.length === 0) return alert("Your cart is empty!");
    
    setLoading(true);
    const orderData = {
      customer_name: formData.name,
      phone: formData.phone,
      email: formData.email,
      district: formData.district,
      address: formData.address,
      items: cart,
      subtotal: subtotal,
    };

    try {
      const res = await axios.post('http://localhost:8000/api/orders', orderData);
      clearCart();
      // Redirect to a thank you page or home
      alert(`Success! Order ${res.data.order.order_number} has been received.`);
      navigate('/'); 
    } catch (err) {
      console.error(err.response?.data);
      alert("Something went wrong. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen py-16 px-4 font-sans">
      <div className="max-w-5xl mx-auto">
        {/* Header Area */}
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-400 font-bold text-xs uppercase mb-8 hover:text-blue-600 transition-colors">
          <HiOutlineChevronLeft /> Back to Shopping
        </button>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
          
          {/* FORM - Now with a border and shadow to pop against the white background */}
          <form onSubmit={handleSubmit} className="md:col-span-7 bg-white p-10 rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 space-y-5">
            <div className="mb-6">
               <h2 className="text-3xl font-black uppercase tracking-tighter text-slate-900">Delivery Details</h2>
               <p className="text-xs font-bold text-blue-500 uppercase tracking-widest">Where should we send your tech?</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Receiver Name</label>
                <input type="text" required className="w-full p-4 bg-slate-50 rounded-2xl border-2 border-transparent focus:border-blue-500 focus:bg-white outline-none font-bold transition-all" 
                  onChange={(e) => setFormData({...formData, name: e.target.value})} />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Phone Number</label>
                  <input type="text" required className="w-full p-4 bg-slate-50 rounded-2xl border-2 border-transparent focus:border-blue-500 focus:bg-white outline-none font-bold transition-all" 
                    onChange={(e) => setFormData({...formData, phone: e.target.value})} />
                </div>
                <div>
  <label className="text-[10px] font-black text-slate-400 uppercase ml-2">District</label>
  <select 
    className="w-full p-4 bg-slate-50 rounded-2xl border-2 border-transparent focus:border-blue-500 focus:bg-white outline-none font-bold text-slate-900 transition-all appearance-none cursor-pointer"
    value={formData.district} 
    onChange={(e) => setFormData({...formData, district: e.target.value})}
  >
    {districts.map(d => (
      <option key={d} value={d} className="text-slate-900 bg-white">
        {d}
      </option>
    ))}
  </select>
</div>
              </div>

              <div>
  <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Full Delivery Address</label>
  <textarea 
    placeholder="e.g. Plot 4, Kampala Road, Room 202" 
    required 
    className="w-full p-4 bg-slate-50 rounded-2xl border-2 border-transparent focus:border-blue-500 focus:bg-white outline-none font-bold text-slate-900 placeholder:text-slate-300 transition-all resize-none" 
    rows="3"
    value={formData.address}
    onChange={(e) => setFormData({...formData, address: e.target.value})} 
  />
</div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className={`w-full py-5 rounded-2xl font-black uppercase tracking-widest transition-all shadow-lg ${loading ? 'bg-slate-200 text-slate-400 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-slate-900 hover:-translate-y-1'}`}
            >
              {loading ? 'Processing Order...' : 'Confirm & Place Order'}
            </button>
          </form>

          {/* SUMMARY - Kept the Dark Theme for contrast */}
          <div className="md:col-span-5 space-y-6">
            <div className="bg-slate-900 text-white p-10 rounded-[2.5rem] shadow-2xl shadow-blue-900/20 relative overflow-hidden">
              <div className="relative z-10">
                <h2 className="text-xl font-black uppercase mb-8 flex items-center gap-2">
                  Final Summary <HiOutlineCheckCircle className="text-blue-400" />
                </h2>
                
                <div className="space-y-4 text-sm font-bold">
                  <div className="flex justify-between text-slate-400">
                    <span>Items Total</span>
                    <span>UGX {subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Delivery ({formData.district})</span>
                    <span className="text-blue-400">+ UGX {deliveryFee.toLocaleString()}</span>
                  </div>
                  
                  <div className="pt-6 border-t border-slate-800 mt-6">
                    <div className="flex justify-between items-end">
                      <span className="text-xs text-slate-500 uppercase">Total Payable</span>
                      <span className="text-3xl text-green-400 font-black tracking-tighter">
                        UGX {total.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Decorative Glow */}
              <div className="absolute -top-24 -right-24 w-48 h-48 bg-blue-600/20 blur-[100px] rounded-full"></div>
            </div>

            {/* Small Trust Badge */}
            <div className="bg-blue-50 p-6 rounded-3xl border border-blue-100 flex items-center gap-4">
               <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm">
                  <span className="text-blue-600 text-lg">🛡️</span>
               </div>
               <p className="text-[10px] font-black text-blue-900 uppercase leading-tight">
                 IT Arena Secure Checkout<br/>
                 <span className="text-blue-400 font-bold">Pay on Delivery Available</span>
               </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}