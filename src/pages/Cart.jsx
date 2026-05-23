import React from 'react';
import { useCartStore } from '../store/useCartStore';
import { Link } from 'react-router-dom';

// 1. You successfully imported it here
import logo from '../assets/logo.jpeg'; 

export default function Cart() {
  const { cart, removeFromCart, updateQuantity, getTotalPrice, clearCart } = useCartStore();

  if (cart.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center bg-white p-10">
        {/* FIX 1: Changed src="/logo.jpeg" to src={logo} */}
        <img src={logo} alt="Logo" className="w-32 mb-6 opacity-20 grayscale" />
        <div className="text-4xl mb-6 text-slate-300 font-black uppercase italic tracking-tighter">Your bag is empty</div>
        <Link to="/all-products" className="bg-blue-600 text-white px-10 py-4 rounded-full font-black uppercase tracking-widest hover:bg-slate-900 transition-all shadow-xl">
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen py-16 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-6">
          <div>
            {/* FIX 2: Changed src="/logo.jpeg" to src={logo} */}
            <img src={logo} alt="IT Arena Logo" className="h-16 w-auto object-contain mb-2" />
            <div className="flex items-center gap-2">
               <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
               <h1 className="text-4xl font-black text-slate-900 uppercase tracking-tighter">Shopping Bag</h1>
            </div>
          </div>
          <button onClick={clearCart} className="text-red-500 font-bold text-xs uppercase hover:underline tracking-widest">Clear All Items</button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-4">
            {cart.map((item) => (
              <div key={item.id} className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 flex items-center gap-6 transition-all hover:border-blue-100">
                <div className="w-12 h-12 bg-slate-50 rounded-lg overflow-hidden flex-shrink-0 flex items-center justify-center border border-slate-100">
                  <img 
                    src={item.image?.startsWith('http') ? item.image : `http://localhost:8000/storage/${item.image}`} 
                    alt={item.name} 
                    className="w-full h-full p-1 object-contain" 
                    onError={(e) => { e.target.src = 'https://via.placeholder.com/50?text=NA'; }}
                  />
                </div>
                
                <div className="flex-1">
                  <h3 className="font-black text-slate-800 uppercase text-sm leading-tight mb-1 line-clamp-1">{item.name}</h3>
                  <p className="text-blue-500 font-bold text-[10px] uppercase tracking-wider">{item.brand}</p>
                  <p className="font-black text-slate-900 mt-2">UGX {Number(item.price).toLocaleString()}</p>
                </div>

                <div className="flex flex-col items-center gap-2">
                  <div className="flex items-center border-2 border-slate-100 rounded-xl overflow-hidden bg-slate-50">
                    <button onClick={() => updateQuantity(item.id, 'dec')} className="px-3 py-1 hover:bg-white transition-colors font-bold">-</button>
                    <span className="px-3 font-black text-sm">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, 'inc')} className="px-3 py-1 hover:bg-white transition-colors font-bold">+</button>
                  </div>
                  <button onClick={() => removeFromCart(item.id)} className="text-[10px] text-slate-400 font-bold hover:text-red-500 uppercase tracking-tighter transition-colors">Remove</button>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-slate-900 text-white p-8 rounded-[2.5rem] h-fit sticky top-24 shadow-2xl border border-slate-800">
            <h2 className="text-xl font-black uppercase mb-6 border-b border-slate-800 pb-4 tracking-tight">Order Summary</h2>
            <div className="space-y-4 mb-8">
              <div className="flex justify-between text-sm font-bold text-slate-400">
                <span>Subtotal</span>
                <span>UGX {getTotalPrice().toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm font-bold text-slate-400">
                <span>Shipping Fee</span>
                <span className="text-green-400 text-[10px] uppercase tracking-widest pt-1">Free Delivery</span>
              </div>
              <div className="flex justify-between text-xl font-black pt-4 border-t border-slate-800">
                <span>Total</span>
                <span className="text-blue-400">UGX {getTotalPrice().toLocaleString()}</span>
              </div>
            </div>
            <Link to="/checkout">
              <button className="w-full bg-blue-600 py-5 rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-white hover:text-blue-600 transition-all shadow-lg active:scale-95">
                Proceed to Checkout
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}