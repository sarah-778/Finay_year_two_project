import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useProductStore } from '../store/useProductStore';
import { useCartStore } from '../store/useCartStore';
import { useRepairStore } from '../store/useRepairStore';

// Image Imports
import smartphoneImg from '../assets/smartphones.jpg'; 
import phoneSparesImg from '../assets/samsang ultra24.jpeg';
import phoneChargersImg from '../assets/chargers.jpg';
import laptopImg from '../assets/laptops.jpg';
import desktopImg from '../assets/desktops.jpg';
import laptopChargerImg from '../assets/laptop-chargers.jpg';
import EliteBookImg from '../assets/elite keyboard.jpeg';
import heroImg from '../assets/banner.jpg'; 
import iphoneImg from '../assets/iphone 15 pro.jpeg';


export default function Home() {
  // --- BACKEND DATA INTEGRATION ---
  const { products, fetchProducts } = useProductStore();
  
  // 2. Initialize the addToCart action from your store
  const addToCart = useCartStore((state) => state.addToCart);
  
  const [cartStatus, setCartStatus] = useState({});

  // 3. Update this function to accept the whole product object
  const handleAddToCart = (product) => {
    // This actually adds it to the cart
    addToCart(product); 
    
    // This provides the UI feedback (checkmark)
    setCartStatus(prev => ({ ...prev, [product.id]: true }));
    setTimeout(() => setCartStatus(prev => ({ ...prev, [product.id]: false })), 2000);
  };
  const { trackRepair } = useRepairStore();
const [trackingId, setTrackingId] = useState("");
const [trackedRepair, setTrackedRepair] = useState(null);
const [searchError, setSearchError] = useState(false);

  // Banner Slide Data

  const slides = [

    {
      img: smartphoneImg,
      tag: "PREMIUM MOBILE",
      title: "LATEST SMARTPHONES",
      desc: "Genuine iPhone, Samsung, and Xiaomi devices with local warranty and support."
    },
    {
      img: laptopImg,
      tag: "COMPUTING POWER",
      title: "HIGH-END LAPTOPS",
      desc: "Business and gaming solutions from Dell, HP, and Lenovo. Engineering-led choices."
    },
    {
      img: phoneSparesImg,
      tag: "EXPERT REPAIRS",
      title: "GENUINE SPARE PARTS",
      desc: "Original screens, batteries, and internal components for all major phone brands."
    },
    {
      img: laptopChargerImg,
      tag: "POWER SOLUTIONS",
      title: "ORIGINAL CHARGERS",
      desc: "Protect your battery life with our range of original laptop and phone adapters."
    }
  ];

  const [currentSlide, setCurrentSlide] = useState(0);

  // Fetch products and handle auto-slide
  useEffect(() => {
    fetchProducts();
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length, fetchProducts]);

  // Logic to get exactly the 10 most recent items from your database
  const recentArrivals = useMemo(() => {
    return [...products].reverse().slice(0, 10);
  }, [products]);
  
  const handleTrack = async () => {
    if (!trackingId) return;
    const result = await trackRepair(trackingId);
    if (result) {
      setTrackedRepair(result);
      setSearchError(false);
    } else {
      setTrackedRepair(null);
      setSearchError(true);
    }
  };
  
  // Map backend status to your 4-step UI
  const steps = [
    { label: "Received", status: "pending" },
    { label: "Diagnosis", status: "diagnosing" },
    { label: "Repairing", status: "repairing" },
    { label: "Ready", status: "completed" }
  ];
  
  // Determine if a step is "done" based on the current repair status
  const getStepIndex = (status) => steps.findIndex(s => s.status === status);

  return (
    <div className="bg-white text-slate-800">
      <div className="max-w-7xl mx-auto px-4 pt-8">
        
        {/* --- MAIN HERO SECTION --- */}
        <main className="w-full">
          <div className="w-full h-[450px] md:h-[550px] bg-slate-200 rounded-2xl overflow-hidden relative group shadow-lg">
              {slides.map((slide, index) => (
                <div 
                  key={index}
                  className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentSlide ? "opacity-100" : "opacity-0"}`}
                >
                  <img src={slide.img} className="w-full h-full object-cover" alt={slide.title} />
                  <div className="absolute inset-0 bg-black/40 flex flex-col justify-center items-center text-center px-6">
                    <span className="bg-blue-600 text-white w-fit px-4 py-1.5 rounded text-xs font-bold mb-4 tracking-widest uppercase">
                      {slide.tag}
                    </span>
                    <h2 className="text-4xl md:text-7xl font-black text-white mb-4 tracking-tighter uppercase leading-none">
                      {slide.title}
                    </h2>
                    <p className="text-white text-base md:text-xl mb-8 max-w-2xl font-medium">
                      {slide.desc}
                    </p>
                    <Link to="/shop">
                      <button className="bg-white text-blue-600 w-fit px-12 py-4 rounded-full font-black uppercase hover:shadow-xl transition-all hover:-translate-y-1 active:scale-95">
                          Shop Collections
                      </button>
                    </Link>
                  </div>
                </div>
              ))}
              
              <div className="absolute bottom-6 w-full flex justify-center gap-2">
                {slides.map((_, i) => (
                  <div key={i} className={`h-1.5 rounded-full transition-all duration-500 ${i === currentSlide ? "w-8 bg-white" : "w-2 bg-white/40"}`} />
                ))}
              </div>
          </div>

          {/* --- TRUST BAR --- */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-10 border border-slate-200 p-8 rounded-2xl bg-white shadow-sm">
            <div className="flex items-center gap-4 md:border-r border-slate-100">
              <span className="text-3xl">🛡️</span>
              <div>
                <p className="font-bold text-sm uppercase">Secure Service</p>
                <p className="text-xs text-slate-500">Data privacy guaranteed</p>
              </div>
            </div>
            <div className="flex items-center gap-4 md:border-r border-slate-100 md:pl-4">
              <span className="text-3xl">⚡</span>
              <div>
                <p className="font-bold text-sm uppercase">Quick Fix</p>
                <p className="text-xs text-slate-500">Same day for screen repairs</p>
              </div>
            </div>
            <div className="flex items-center gap-4 md:pl-4">
              <span className="text-3xl">📞</span>
              <div>
                <p className="font-bold text-sm uppercase">Free Support</p>
                <p className="text-xs text-slate-500">Online tech consultation</p>
              </div>
            </div>
          </div>

          {/* --- NEW ARRIVALS (DYNAMIC FROM BACKEND) --- */}
          <section className="mb-20">
             <div className="flex justify-between items-end border-b-2 border-slate-100 mb-8">
                <h3 className="text-2xl font-black uppercase border-b-4 border-blue-600 pb-2 mb-[-2px]">Recent Arrivals</h3>
                <Link to="/shop" className="text-blue-600 font-bold pb-2 hover:underline uppercase text-sm tracking-wide">See All &rarr;</Link>
             </div>
             <div className="grid grid-cols-2 lg:grid-cols-5 gap-6">
                {recentArrivals.length > 0 ? recentArrivals.map((p) => (
                  <div key={p.id} className="border border-slate-100 rounded-xl p-4 group hover:shadow-2xl transition-all bg-white flex flex-col h-full">
                    <div className="h-44 mb-4 overflow-hidden rounded-lg bg-slate-50">
                      <img src={p.image} className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500" alt={p.name} />
                    </div>
                    <div className="flex flex-col flex-1">
                      <span className="text-[9px] font-black text-blue-500 uppercase mb-1">{p.brand}</span>
                      <h4 className="text-xs font-bold h-10 line-clamp-2 mb-2 group-hover:text-blue-600 uppercase leading-tight">{p.name}</h4>
                      <p className="text-slate-900 font-black text-base mb-4">Ush {Number(p.price).toLocaleString()}</p>
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
                  <div className="col-span-full py-10 text-center text-slate-400 font-bold italic animate-pulse">
                    Syncing with IT Arena Inventory...
                  </div>
                )}
             </div>
          </section>

          {/* --- SHOP BY COLLECTIONS --- */}
          <section className="mb-20">
            <h3 className="text-2xl font-black uppercase border-b-4 border-blue-600 pb-2 mb-8 w-fit">Our Collections</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Link to="/shop?cat=smartphones" className="relative h-72 rounded-3xl overflow-hidden group cursor-pointer shadow-lg block">
                <img src={smartphoneImg} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="Phones" />
                <div className="absolute inset-0 bg-blue-900/40 flex flex-col justify-center p-10">
                  <h4 className="text-4xl font-black text-white uppercase tracking-tight">Smartphones</h4>
                  <p className="text-white/80 mb-4">Original Spares & Latest Models</p>
                  <span className="text-white font-bold border-b-2 border-white w-fit uppercase text-sm">Shop Now</span>
                </div>
              </Link>
              <Link to="/shop?cat=laptops" className="relative h-72 rounded-3xl overflow-hidden group cursor-pointer shadow-lg block">
                <img src={laptopImg} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="Laptops" />
                <div className="absolute inset-0 bg-slate-900/40 flex flex-col justify-center p-10">
                  <h4 className="text-4xl font-black text-white uppercase tracking-tight">Laptops & PC</h4>
                  <p className="text-white/80 mb-4">Business & Gaming Solutions</p>
                  <span className="text-white font-bold border-b-2 border-white w-fit uppercase text-sm">Shop Now</span>
                </div>
              </Link>
            </div>
          </section>

          {/* --- BRAND STRIP --- */}
          <section className="mb-20 py-12 border-y border-slate-100">
            <p className="text-center text-slate-400 font-bold uppercase tracking-widest text-xs mb-8">Official Hardware Partners</p>
            <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-40 grayscale hover:grayscale-0 transition-all duration-500">
              <span className="text-2xl font-black text-slate-800 tracking-tighter">APPLE</span>
              <span className="text-2xl font-black text-slate-800 tracking-tighter">SAMSUNG</span>
              <span className="text-2xl font-black text-slate-800 tracking-tighter">DELL</span>
              <span className="text-2xl font-black text-slate-800 tracking-tighter">HP</span>
              <span className="text-2xl font-black text-slate-800 tracking-tighter">LENOVO</span>
              <span className="text-2xl font-black text-slate-800 tracking-tighter">XIAOMI</span>
            </div>
          </section>

          {/* --- WHY CHOOSE US --- */}
          <section className="mb-20 bg-slate-50 rounded-[2rem] p-8 md:p-16 flex flex-col md:flex-row items-center gap-12">
            <div className="flex-1">
              <h3 className="text-blue-600 font-black uppercase tracking-widest text-sm mb-4">The IT Arena Standard</h3>
              <h2 className="text-4xl font-black text-slate-900 mb-6 leading-tight uppercase">Premium Tech Services In Kampala</h2>
              <p className="text-slate-600 leading-relaxed mb-8">
                With over 10 years of experience, IT Arena has become the primary destination for 
                Uganda's tech enthusiasts. We don't just sell parts; we provide engineering-led 
                solutions for your most valuable devices.
              </p>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h4 className="font-bold text-slate-900 uppercase text-sm">100% Original</h4>
                  <p className="text-sm text-slate-500">Only genuine OEM parts used.</p>
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 uppercase text-sm">Warranty</h4>
                  <p className="text-sm text-slate-500">Up to 6 months on all repairs.</p>
                </div>
              </div>
            </div>
            <div className="flex-1 w-full">
              <img src={heroImg} className="rounded-2xl shadow-2xl transition-transform duration-500 hover:scale-[1.02]" alt="Service" />
            </div>
          </section>

          {/* --- FLASH DEALS --- */}
          <section className="mb-20 bg-blue-600 rounded-[2rem] p-8 md:p-12 text-white flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl shadow-blue-900/30">
            <div className="space-y-4 text-center md:text-left">
              <span className="bg-white text-blue-600 px-4 py-1 rounded-full text-xs font-black uppercase tracking-tighter">Limited Time Offer</span>
              <h2 className="text-4xl font-black uppercase leading-tight">Weekend Screen <br/> Replacement Sale</h2>
              <p className="text-blue-100 max-w-sm">Get up to 20% off on all original iPhone and Samsung screen replacements this weekend only.</p>
            </div>
            <div className="flex gap-4 text-center">
              {[
                { val: "02", label: "Days" },
                { val: "14", label: "Hrs" },
                { val: "35", label: "Mins" }
              ].map((time, idx) => (
                <div key={idx} className="bg-blue-800/50 backdrop-blur-sm p-4 rounded-xl min-w-[80px] border border-blue-400/30">
                  <p className="text-3xl font-black">{time.val}</p>
                  <p className="text-[10px] uppercase font-bold text-blue-200">{time.label}</p>
                </div>
              ))}
            </div>
            <Link to="/shop">
              <button className="bg-white text-blue-600 px-10 py-4 rounded-full font-black uppercase hover:scale-105 transition-transform shadow-lg active:scale-95">
                Claim Discount
              </button>
            </Link>
          </section>

          {/* --- REPLACEMENT LIVE REPAIR TRACKER SECTION --- */}
<section className="mb-20">
  <div className="bg-white border-2 border-slate-100 rounded-[2rem] overflow-hidden shadow-sm">
    <div className="bg-slate-900 p-6 text-white flex justify-between items-center">
      <h3 className="font-black uppercase tracking-widest text-sm">Live Repair Status</h3>
      <span className="text-xs text-blue-400 animate-pulse font-bold uppercase underline">System Online</span>
    </div>
    <div className="p-10 flex flex-col md:flex-row items-center gap-12">
      <div className="flex-1 space-y-6">
        <h2 className="text-3xl font-black text-slate-800 uppercase">Track Your Device</h2>
        <p className="text-slate-500">Enter your Tracking Code to see your device's progress.</p>
        <div className="flex gap-2">
          <input 
            type="text" 
            placeholder="e.g. ITA-9921" 
            value={trackingId}
            onChange={(e) => setTrackingId(e.target.value)}
            className="flex-1 bg-slate-100 border-none rounded-xl px-5 py-4 outline-none focus:ring-2 focus:ring-blue-600 font-bold" 
          />
          <button 
            onClick={handleTrack}
            className="bg-blue-600 text-white px-8 py-4 rounded-xl font-bold hover:bg-blue-700 transition-all uppercase"
          >
            Track
          </button>
        </div>
        {searchError && <p className="text-red-500 text-xs font-bold uppercase">Device not found. Please check your code.</p>}
        {trackedRepair && (
          <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
            <p className="text-sm font-black text-blue-900 uppercase">{trackedRepair.device}</p>
            <p className="text-[10px] font-bold text-blue-600">Current Status: {trackedRepair.status}</p>
          </div>
        )}
      </div>
      
      <div className="flex-1 w-full grid grid-cols-4 gap-4">
        {steps.map((step, i) => {
          const currentIndex = trackedRepair ? getStepIndex(trackedRepair.status) : -1;
          const isDone = i <= currentIndex;
          
          return (
            <div key={i} className="text-center">
              <div className={`h-2.5 rounded-full mb-3 transition-colors duration-500 ${isDone ? 'bg-blue-600' : 'bg-slate-200'}`}></div>
              <p className={`text-[10px] font-black uppercase ${isDone ? 'text-blue-600' : 'text-slate-300'}`}>{step.label}</p>
            </div>
          );
        })}
      </div>
    </div>
  </div>
</section>
        </main>
      </div>
    </div>
  );
}