import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';

export default function Navbar() {
  const { isAuthenticated, logout } = useAuthStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [isDeptOpen, setIsDeptOpen] = useState(false);
  const navigate = useNavigate();

  const categories = [
    {
      title: "Smartphones",
      slug: "smartphones",
      brands: ["Apple iPhone", "Samsung Galaxy", "Google Pixel", "Huawei", "Xiaomi", "Oppo", "Tecno & Infinix"]
    },
    {
      title: "Chargers",
      slug: "phone-chargers",
      brands: ["Fast Chargers", "USB-C Cables", "Wireless Pads", "Apple MagSafe", "Samsung Adapters"]
    },
    {
      title: "Laptops",
      slug: "laptops",
      brands: ["MacBook", "HP", "Dell", "Lenovo", "Asus", "Acer", "Microsoft Surface"]
    },
    {
      title: "Spare Parts",
      slug: "pc-spares",
      brands: ["Laptop Screens", "Batteries", "Keyboards", "Internal SSDs", "RAM Modules"]
    }
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    const query = searchQuery.toLowerCase().trim();
    if (!query) return;
    if (query.includes("repair") || query.includes("fix")) navigate("/repair");
    else if (query.includes("about") || query.includes("contact")) navigate("/about");
    else if (query.includes("all") || query.includes("product")) navigate("/all-products");
    else navigate(`/shop?search=${encodeURIComponent(query)}`);
    setSearchQuery("");
  };

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
      {/* --- Main Top Header --- */}
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between gap-8">
        <Link to="/" className="text-3xl font-black text-blue-600 tracking-tighter shrink-0">
          IT ARENA
        </Link>
        
        <form onSubmit={handleSearch} className="flex-1 max-w-2xl hidden md:flex">
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search products or services..." 
            className="w-full border-2 border-blue-600 px-4 py-2 rounded-l-md outline-none text-slate-900 font-medium placeholder:text-slate-400 bg-white"
          />
          <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-r-md font-bold uppercase hover:bg-blue-700 transition-colors">
            Search
          </button>
        </form>

        <div className="flex items-center gap-6 text-sm">
          {isAuthenticated ? (
            <button onClick={logout} className="bg-slate-800 text-white px-4 py-2 rounded font-bold hover:bg-red-600">Logout</button>
          ) : (
            <div className="flex items-center gap-4">
               <Link to="/login" className="hidden sm:block text-slate-600 hover:text-blue-600 font-bold">Login</Link>
               <Link to="/register" className="bg-blue-600 text-white px-5 py-2 rounded font-bold uppercase hover:bg-blue-700">Join Us</Link>
            </div>
          )}
          <div className="relative cursor-pointer text-2xl">🛒</div>
        </div>
      </div>

      {/* --- Sub-Nav --- */}
      <div className="bg-slate-50 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between py-1">
          
          <div className="flex gap-8 py-3 text-xs font-bold uppercase tracking-widest text-slate-600">
            <Link to="/" className="hover:text-blue-600">Home Page</Link>
            <Link to="/all-products" className="hover:text-blue-600">All Products</Link>
            <Link to="/Book-Repair" className="hover:text-blue-600">Book Repair</Link>
            <Link to="/about" className="hover:text-blue-600">About Us</Link>
          </div>

          {/* Right Side: Hamburger Departments */}
          <div 
            className="relative"
            onMouseEnter={() => setIsDeptOpen(true)}
            onMouseLeave={() => setIsDeptOpen(false)}
          >
            <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-all">
              <span className="text-lg">☰</span>
              <span className="text-[10px] font-black uppercase tracking-tighter">Shop Departments</span>
            </button>

            {/* Dropdown Logic */}
            {isDeptOpen && (
              <div className="absolute top-full right-0 w-64 bg-white border border-slate-200 shadow-2xl z-[100] rounded-b-lg">
                <ul className="flex flex-col">
                  {categories.map((cat, index) => (
                    <li key={index} className="group relative border-b border-slate-100 last:border-0">
                      <div className="px-4 py-3 hover:bg-blue-50 cursor-pointer flex justify-between items-center transition-colors">
                        {/* Main Category Link - Force Text Slate 900 */}
                        <Link 
                          to={`/shop?cat=${cat.slug}`} 
                          className="text-slate-900 text-sm font-bold block w-full hover:text-blue-600"
                        >
                          {cat.title}
                        </Link>
                        <span className="text-slate-400 group-hover:text-blue-600">‹</span>
                      </div>

                      {/* Brand Fly-out (Opens to the Left) */}
                      <div className="invisible group-hover:visible opacity-0 group-hover:opacity-100 absolute right-full top-0 w-56 bg-white border border-slate-200 shadow-xl transition-all mr-0.5 rounded-l-lg overflow-hidden z-[110]">
                        <p className="bg-slate-50 px-4 py-2 text-[10px] font-black text-blue-600 uppercase tracking-widest border-b border-slate-100">
                          Popular Brands
                        </p>
                        <ul className="flex flex-col py-1">
                          {cat.brands.map((brand, bIndex) => (
                            <li key={bIndex}>
                              <Link 
                                to={`/shop?cat=${cat.slug}&brand=${brand.replace(/\s+/g, '-').toLowerCase()}`}
                                className="px-4 py-2 text-xs text-slate-700 font-medium hover:bg-blue-600 hover:text-white block transition-colors"
                              >
                                {brand}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

        </div>
      </div>
    </nav>
  );
}