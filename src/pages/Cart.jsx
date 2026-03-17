import React from 'react';
import { useCartStore } from '../store/useCartStore';
import { Link } from 'react-router-dom';

export default function Cart() {
  const { cart, removeFromCart, updateQuantity, getTotalPrice, clearCart } = useCartStore();

  if (cart.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center bg-white p-10">
        <div className="text-6xl mb-4 text-slate-200 font-black">YOUR CART IS EMPTY</div>
        <Link to="/all-products" className="bg-blue-600 text-white px-10 py-4 rounded-full font-black uppercase tracking-widest hover:bg-slate-900 transition-all shadow-xl">
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen py-16 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-end mb-10">
          <div>
            <h1 className="text-4xl font-black text-slate-900 uppercase tracking-tighter">Shopping Bag</h1>
            <p className="text-blue-600 font-bold uppercase text-xs tracking-widest">Secure Checkout — IT Arena</p>
          </div>
          <button onClick={clearCart} className="text-red-500 font-bold text-xs uppercase hover:underline">Clear All</button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Item List */}
          <div className="lg:col-span-2 space-y-4">
            {cart.map((item) => (
              <div key={item.id} className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 flex items-center gap-6">
                <div className="w-24 h-24 bg-slate-50 rounded-2xl overflow-hidden p-2">
                  <img src={item.image} alt={item.name} className="w-full h-full object-contain" />
                </div>
                
                <div className="flex-1">
                  <h3 className="font-black text-slate-800 uppercase text-sm leading-tight mb-1">{item.name}</h3>
                  <p className="text-blue-500 font-bold text-[10px] uppercase">{item.brand}</p>
                  <p className="font-black text-slate-900 mt-2">UGX {Number(item.price).toLocaleString()}</p>
                </div>

                <div className="flex flex-col items-center gap-2">
                  <div className="flex items-center border-2 border-slate-100 rounded-xl overflow-hidden">
                    <button onClick={() => updateQuantity(item.id, 'dec')} className="px-3 py-1 hover:bg-slate-50 font-bold">-</button>
                    <span className="px-3 font-black text-sm">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, 'inc')} className="px-3 py-1 hover:bg-slate-50 font-bold">+</button>
                  </div>
                  <button onClick={() => removeFromCart(item.id)} className="text-[10px] text-slate-400 font-bold hover:text-red-500 uppercase tracking-tighter">Remove</button>
                </div>
              </div>
            ))}
          </div>

          {/* Summary Box */}
          <div className="bg-slate-900 text-white p-8 rounded-[2.5rem] h-fit sticky top-24 shadow-2xl">
            <h2 className="text-xl font-black uppercase mb-6 border-b border-slate-800 pb-4">Order Summary</h2>
            <div className="space-y-4 mb-8">
              <div className="flex justify-between text-sm font-bold text-slate-400">
                <span>Subtotal</span>
                <span>UGX {getTotalPrice().toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm font-bold text-slate-400">
                <span>Shipping</span>
                <span className="text-green-400">Calculated at next step</span>
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