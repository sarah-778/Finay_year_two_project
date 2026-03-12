import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useProductStore } from '../store/useProductStore'; 
import { useCartStore } from '../store/useCartStore';

export default function Shop() {
  const [searchParams] = useSearchParams();
  const { products, fetchProducts } = useProductStore(); 
  
  const category = searchParams.get('cat');
  const brand = searchParams.get('brand');
  
  // --- DYNAMIC STATES ---
  const [searchTerm, setSearchTerm] = useState("");
  const [priceFilter, setPriceFilter] = useState("all");
  const [onlyInStock, setOnlyInStock] = useState(true);
  
  const addToCart = useCartStore((state) => state.addToCart);
  const [cartStatus, setCartStatus] = useState({});

  const handleAddToCart = (product) => {
    addToCart(product); // Add to global store
    
    // UI Feedback
    setCartStatus(prev => ({ ...prev, [product.id]: true }));
    setTimeout(() => setCartStatus(prev => ({ ...prev, [product.id]: false })), 2000);
  };

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // --- IMPROVED DYNAMIC FILTERING LOGIC ---
 // --- IMPROVED DYNAMIC FILTERING LOGIC ---
const filteredProducts = useMemo(() => {
  return products.filter(p => {
    // 1. URL Category Normalization
    // Converts "pc-spares" from URL and "pc-spares" from DB to "pc spares" for matching
    const currentCatSlug = category?.toLowerCase().replace(/-/g, ' ');
    const productCat = p.category?.toLowerCase().replace(/-/g, ' ');
    const matchCategory = !category || productCat === currentCatSlug;
    
    // 2. Brand Normalization
    // This allows "SSD Storage" to match a slug like "ssd-storage"
    const brandSlug = brand?.toLowerCase().replace(/-/g, ' ');
    const productBrand = p.brand?.toLowerCase().replace(/-/g, ' ');
    const matchBrand = !brand || productBrand?.includes(brandSlug) || brandSlug?.includes(productBrand);

    // 3. Search Bar Filter
    const matchSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        p.brand.toLowerCase().includes(searchTerm.toLowerCase());

    // 4. Price Filter Logic
    let matchPrice = true;
    const price = Number(p.price);
    if (priceFilter === "low") matchPrice = price < 500000;
    if (priceFilter === "high") matchPrice = price >= 1500000;

    // 5. Availability Filter
    const matchStock = !onlyInStock || Number(p.stock) > 0;

    return matchCategory && matchBrand && matchSearch && matchPrice && matchStock;
  });
}, [products, category, brand, searchTerm, priceFilter, onlyInStock]);
  

  return (
    <div className="bg-white min-h-screen">
      {/* Header with Search Bar */}
      <div className="bg-slate-900 py-10">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-end gap-6">
          <div>
            <p className="text-xs text-blue-400 uppercase font-bold tracking-widest mb-2">
              Home / {category || 'Shop'} / <span className="text-white">{brand?.replace('-', ' ')}</span>
            </p>
            <h1 className="text-4xl font-black text-white uppercase tracking-tight">
              {category ? category.replace('-', ' ') : "All Inventory"} 
              {brand && <span className="text-blue-500"> — {brand.replace('-', ' ')}</span>}
            </h1>
          </div>

          {/* DYNAMIC SEARCH BAR */}
          <div className="w-full md:w-80 relative">
             <input 
                type="text" 
                placeholder="Search models..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-800 border-none text-white rounded-xl py-3 px-5 text-sm font-bold focus:ring-2 focus:ring-blue-500 outline-none transition-all"
             />
             <span className="absolute right-4 top-3 opacity-40">🔍</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row gap-8 py-10">
        {/* Sidebar with working filters */}
        <aside className="w-full md:w-64 shrink-0">
          <div className="sticky top-24 space-y-6 bg-slate-50 p-6 rounded-2xl border border-slate-200">
            <div>
              <h4 className="font-black text-[10px] uppercase tracking-widest text-slate-400 mb-4 flex justify-between">
                Price Range {priceFilter !== 'all' && <button onClick={() => setPriceFilter('all')} className="text-blue-600 lowercase">reset</button>}
              </h4>
              <ul className="space-y-3 text-sm font-bold text-slate-700">
                <li 
                  onClick={() => setPriceFilter('low')}
                  className={`cursor-pointer transition-colors ${priceFilter === 'low' ? 'text-blue-600' : 'hover:text-blue-600'}`}
                >
                  <span className={priceFilter === 'low' ? 'underline underline-offset-4' : ''}>Below 500k</span>
                </li>
                <li 
                  onClick={() => setPriceFilter('high')}
                  className={`cursor-pointer transition-colors ${priceFilter === 'high' ? 'text-blue-600' : 'hover:text-blue-600'}`}
                >
                  <span className={priceFilter === 'high' ? 'underline underline-offset-4' : ''}>Above 1.5M</span>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-black text-[10px] uppercase tracking-widest text-slate-400 mb-4">
                Availability
              </h4>
              <label className="flex items-center gap-3 text-sm font-bold text-slate-700 cursor-pointer group">
                <input 
                  type="checkbox" 
                  checked={onlyInStock}
                  onChange={(e) => setOnlyInStock(e.target.checked)}
                  className="w-4 h-4 accent-blue-600" 
                /> 
                <span className="group-hover:text-blue-600 transition-colors">In Stock Only</span>
              </label>
            </div>
          </div>
        </aside>

        {/* Main Product Grid */}
        <main className="flex-1">
          <div className="flex justify-between items-center mb-6 bg-slate-50 p-4 rounded-xl border border-slate-200">
            <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">
              Found {filteredProducts.length} Results
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.length > 0 ? filteredProducts.map((p) => (
              <div key={p.id} className="group border border-slate-200 rounded-2xl p-4 hover:shadow-2xl transition-all flex flex-col h-full bg-white border-b-4 hover:border-b-blue-600">
                <div className="relative h-52 mb-4 overflow-hidden rounded-xl bg-slate-50">
                  <img 
                    src={p.image?.startsWith('http') ? p.image : `http://127.0.0.1:8000/storage/${p.image}`} 
                    className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-700 p-2" 
                    alt={p.name} 
                  />
                  <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-slate-900 text-[9px] font-black px-3 py-1 rounded-full uppercase shadow-sm border border-slate-100">
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
      onClick={() => handleAddToCart(p)} // 4. Pass the whole product 'p' here
      className={`w-full py-3 rounded-xl font-black uppercase text-[10px] tracking-widest transition-all active:scale-95 ${
        cartStatus[p.id] 
        ? "bg-green-600 text-white" 
        : "bg-slate-900 text-white hover:bg-blue-600 shadow-md hover:shadow-blue-200"
      }`}
    >
      {cartStatus[p.id] ? "✓ Added" : "Add to Cart"}
    </button>
                </div>
              </div>
            )) : (
              <div className="col-span-full py-32 text-center bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
                <p className="text-slate-400 font-bold uppercase tracking-widest italic">No products match these filters.</p>
                <button 
                    onClick={() => {setSearchTerm(""); setPriceFilter("all"); setOnlyInStock(false);}}
                    className="mt-4 text-blue-600 font-bold text-xs uppercase underline"
                >
                    Clear all filters
                </button>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}