import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useProductStore } from '../store/useProductStore'; // Import your real data store

export default function Shop() {
  const [searchParams] = useSearchParams();
  const { products, fetchProducts } = useProductStore(); // Use store instead of static array
  
  const category = searchParams.get('cat');
  const brand = searchParams.get('brand');
  const [cartStatus, setCartStatus] = useState({});

  // 1. Fetch products from Laravel on mount
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // 2. Dynamic Filtering Logic
  const filteredProducts = products.filter(p => {
    const matchCategory = !category || p.category?.toLowerCase() === category.toLowerCase();
    const matchBrand = !brand || p.brand?.toLowerCase() === brand.toLowerCase();
    return matchCategory && matchBrand;
  });

  const handleAddToCart = (id) => {
    setCartStatus(prev => ({ ...prev, [id]: true }));
    setTimeout(() => setCartStatus(prev => ({ ...prev, [id]: false })), 2000);
  };

  return (
    <div className="bg-white min-h-screen">
      {/* Header */}
      <div className="bg-slate-900 py-10">
        <div className="max-w-7xl mx-auto px-4">
          <p className="text-xs text-blue-400 uppercase font-bold tracking-widest mb-2">
            Home / {category || 'Shop'} / <span className="text-white">{brand?.replace('-', ' ')}</span>
          </p>
          <h1 className="text-4xl font-black text-white uppercase tracking-tight">
            {category ? category : "All Inventory"} 
            {brand && <span className="text-blue-500"> — {brand.replace('-', ' ')}</span>}
          </h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row gap-8 py-10">
        {/* Sidebar */}
        <aside className="w-full md:w-64 shrink-0">
          <div className="sticky top-24 space-y-6 bg-slate-50 p-6 rounded-2xl border border-slate-200">
            <div>
              <h4 className="font-black text-xs uppercase tracking-widest text-slate-900 border-b-2 border-blue-600 pb-2 mb-4">
                Price Range
              </h4>
              <ul className="space-y-3 text-sm font-bold text-slate-700">
                <li className="hover:text-blue-600 cursor-pointer flex justify-between items-center">
                  <span>Below 500k</span>
                </li>
                <li className="hover:text-blue-600 cursor-pointer flex justify-between items-center">
                  <span>Above 1.5M</span>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-black text-xs uppercase tracking-widest text-slate-900 border-b-2 border-blue-600 pb-2 mb-4">
                Availability
              </h4>
              <label className="flex items-center gap-3 text-sm font-bold text-slate-700 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 accent-blue-600" defaultChecked /> 
                In Stock Only
              </label>
            </div>
          </div>
        </aside>

        {/* Main Product Grid */}
        <main className="flex-1">
          <div className="flex justify-between items-center mb-6 bg-slate-50 p-4 rounded-xl border border-slate-200">
            <p className="text-sm text-slate-600 font-bold uppercase tracking-tighter">
              Showing {filteredProducts.length} items
            </p>
            <select className="bg-transparent text-xs font-black uppercase tracking-wider text-slate-900 outline-none">
              <option>Sort by: Newest</option>
              <option>Price: Low to High</option>
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.length > 0 ? filteredProducts.map((p) => (
              <div key={p.id} className="group border border-slate-200 rounded-2xl p-4 hover:shadow-2xl transition-all flex flex-col h-full bg-white border-b-4 hover:border-b-blue-600">
                <div className="relative h-52 mb-4 overflow-hidden rounded-xl bg-slate-50">
                  {/* Using dynamic image from database */}
                  <img 
                    src={p.image} 
                    className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-700" 
                    alt={p.name} 
                  />
                  <span className="absolute top-3 left-3 bg-blue-600 text-white text-[9px] font-black px-3 py-1 rounded-full uppercase shadow-lg">
                    {p.brand}
                  </span>
                </div>
                
                <h3 className="font-bold text-slate-900 text-xs mb-2 flex-grow uppercase leading-snug">
                  {p.name}
                </h3>
                
                <div className="mt-4">
                  <p className="text-slate-900 font-black text-xl mb-4 tracking-tighter">
                    Ush {Number(p.price).toLocaleString()}
                  </p>
                  <button 
                    onClick={() => handleAddToCart(p.id)}
                    className={`w-full py-3 rounded-xl font-black uppercase text-[10px] tracking-widest transition-all active:scale-95 ${
                      cartStatus[p.id] 
                      ? "bg-green-600 text-white" 
                      : "bg-slate-900 text-white hover:bg-blue-600 shadow-md hover:shadow-blue-200"
                    }`}
                  >
                    {cartStatus[p.id] ? "✓ Added to Cart" : "Add to Cart"}
                  </button>
                </div>
              </div>
            )) : (
              <div className="col-span-full py-32 text-center bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
                <p className="text-slate-400 font-bold uppercase tracking-widest italic">No products found in this category.</p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}