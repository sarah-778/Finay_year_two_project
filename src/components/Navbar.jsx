import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { useCartStore } from '../store/useCartStore'; // Ensure this store exists

export default function Navbar() {
  const { isAuthenticated, logout } = useAuthStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [isDeptOpen, setIsDeptOpen] = useState(false);
  const navigate = useNavigate();
  
  // Get item count from the global store
  const itemCount = useCartStore((state) => state.getItemCount?.() || 0);

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

    if (query.includes("repair") || query.includes("fix")) {
      navigate("/repair-service");
    } else if (query.includes("about")) {
      navigate("/about");
    } else if (query.includes("contact")) {
      navigate("/contact-us");
    } else if (query.includes("all") || query.includes("product")) {
      navigate("/all-products");
    } else {
      navigate(`/shop?search=${encodeURIComponent(query)}`);
    }

    setSearchQuery("");
  };

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">

      {/* Top Header */}
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
          <button 
            type="submit" 
            className="bg-blue-600 text-white px-6 py-2 rounded-r-md font-bold uppercase hover:bg-blue-700 transition-colors"
          >
            Search
          </button>
        </form>

        <div className="flex items-center gap-6 text-sm">
          {isAuthenticated ? (
            <button 
              onClick={logout} 
              className="bg-slate-800 text-white px-4 py-2 rounded font-bold hover:bg-red-600"
            >
              Logout
            </button>
          ) : (
            <div className="flex items-center gap-4">
              <Link to="/login" className="hidden sm:block text-slate-600 hover:text-blue-600 font-bold">
                Login
              </Link>
              <Link to="/register" className="bg-blue-600 text-white px-5 py-2 rounded font-bold uppercase hover:bg-blue-700">
                Join Us
              </Link>
            </div>
          )}
          
          {/* UPDATED CART ICON */}
          <Link to="/cart" className="relative cursor-pointer text-2xl p-2 hover:bg-slate-100 rounded-full transition-all">
            🛒
            {itemCount > 0 && (
              <span className="absolute top-0 right-0 bg-blue-600 text-white text-[10px] font-black w-5 h-5 flex items-center justify-center rounded-full border-2 border-white animate-bounce">
                {itemCount}
              </span>
            )}
          </Link>
        </div>
      </div>

      {/* Sub Navigation */}
      <div className="bg-slate-50 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between py-1">
          
          <div className="flex gap-8 py-3 text-xs font-bold uppercase tracking-widest text-slate-600">
            <Link to="/" className="hover:text-blue-600">Home Page</Link>
            <Link to="/all-products" className="hover:text-blue-600">All Products</Link>
            <Link to="/repair-service" className="hover:text-blue-600">Repair Service</Link>
            <Link to="/about" className="hover:text-blue-600">About Us</Link>
            <Link to="/contact-us" className="hover:text-blue-600">Contact Us</Link>
          </div>

          {/* Departments Dropdown */}
          <div 
            className="relative"
            onMouseEnter={() => setIsDeptOpen(true)}
            onMouseLeave={() => setIsDeptOpen(false)}
          >
            <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-all">
              <span className="text-lg">☰</span>
              <span className="text-[10px] font-black uppercase tracking-tighter">
                Shop Departments
              </span>
            </button>

            {isDeptOpen && (
              <div className="absolute top-full right-0 w-64 bg-white border border-slate-200 shadow-2xl rounded-b-lg">
                <ul>
                  {categories.map((cat, index) => (
                    <li key={index} className="border-b border-slate-100 last:border-0">
                      <Link 
                        to={`/shop?cat=${cat.slug}`} 
                        className="block px-4 py-3 text-sm font-bold text-slate-900 hover:bg-blue-50 hover:text-blue-600"
                      >
                        {cat.title}
                      </Link>
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