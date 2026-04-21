import { useState, useEffect } from 'react'; // Added useEffect
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { useCartStore } from '../store/useCartStore';
import { 
  HiOutlineChevronDown, 
  HiOutlineLogout, 
  HiOutlineViewGrid, 
  HiOutlineUser 
} from "react-icons/hi"; 

export default function Navbar() {
  const { isAuthenticated, logout, user, checkAuth } = useAuthStore(); 
  const [searchQuery, setSearchQuery] = useState("");
  const [isDeptOpen, setIsDeptOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false); 
  const navigate = useNavigate();
  
  const itemCount = useCartStore((state) => state.getItemCount?.() || 0);

  // FETCH USER DATA ON LOAD
  useEffect(() => {
    if (isAuthenticated && !user) {
      checkAuth();
    }
  }, [isAuthenticated, user, checkAuth]);

  const categories = [
    { title: "Smartphones", slug: "smartphones" },
    { title: "Chargers", slug: "phone-chargers" },
    { title: "Laptops", slug: "laptops" },
    { title: "Spare Parts", slug: "pc-spares" }
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
            className="w-full border-2 border-blue-600 px-4 py-2 rounded-l-md outline-none text-slate-900 font-medium bg-white"
          />
          <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-r-md font-bold uppercase hover:bg-blue-700 transition-colors">
            Search
          </button>
        </form>

        <div className="flex items-center gap-6 text-sm">
          {isAuthenticated ? (
            /* USER DROPDOWN SECTION */
            <div 
              className="relative"
              onMouseEnter={() => setIsUserMenuOpen(true)}
              onMouseLeave={() => setIsUserMenuOpen(false)}
            >
              <button className="flex items-center gap-2 py-1 px-2 hover:bg-slate-50 rounded-xl transition-all border border-transparent hover:border-slate-100">
                <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center text-white font-black text-xs shadow-md uppercase">
                  {(user?.name || user?.username || 'U').charAt(0)}
                </div>
                <div className="text-left hidden sm:block">
                  <p className="text-[9px] font-black text-slate-400 uppercase leading-none mb-0.5">Welcome Back!</p>
                  <p className="text-xs font-black text-slate-800 uppercase flex items-center gap-1">
                    {user?.name?.split(' ')[0] || user?.username || 'Member'} <HiOutlineChevronDown className="text-blue-600" />
                  </p>
                </div>
              </button>

              {isUserMenuOpen && (
                <div className="absolute top-full right-0 w-52 bg-white border border-slate-100 shadow-2xl rounded-2xl py-2 mt-1 overflow-hidden animate-in fade-in slide-in-from-top-2 z-50">
                   <div className="px-4 py-2 border-b border-slate-50 mb-1">
                    <p className="text-[10px] font-bold text-slate-400 uppercase truncate">
                      {user?.email || 'Logged In'}
                    </p>
                  </div>
                  <Link 
                    to="/dashboard" 
                    className="flex items-center gap-3 px-4 py-3 text-xs font-black text-slate-600 hover:bg-blue-50 hover:text-blue-600 transition-colors uppercase"
                  >
                    <HiOutlineViewGrid size={16} className="text-blue-500" /> Dashboard
                  </Link>
                  <button 
                    onClick={logout}
                    className="w-full flex items-center gap-3 px-4 py-3 text-xs font-black text-red-500 hover:bg-red-50 transition-colors uppercase border-t border-slate-50"
                  >
                    <HiOutlineLogout size={16} /> Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <Link to="/login" className="hidden sm:block text-slate-600 hover:text-blue-600 font-black uppercase text-xs tracking-widest">
                Login
              </Link>
              <Link to="/register" className="bg-blue-600 text-white px-5 py-2.5 rounded-xl font-black uppercase text-xs tracking-widest hover:bg-blue-700 shadow-lg shadow-blue-200">
                Join Us
              </Link>
            </div>
          )}
          
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

          <div 
            className="relative"
            onMouseEnter={() => setIsDeptOpen(true)}
            onMouseLeave={() => setIsDeptOpen(false)}
          >
            <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-all">
              <span className="text-lg">☰</span>
              <span className="text-[10px] font-black uppercase tracking-tighter">Shop Departments</span>
            </button>
            {isDeptOpen && (
              <div className="absolute top-full right-0 w-64 bg-white border border-slate-200 shadow-2xl rounded-b-lg overflow-hidden">
                <ul>
                  {categories.map((cat, index) => (
                    <li key={index} className="border-b border-slate-100 last:border-0">
                      <Link to={`/shop?cat=${cat.slug}`} className="block px-4 py-3 text-sm font-bold text-slate-900 hover:bg-blue-50 hover:text-blue-600 transition-colors uppercase">
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