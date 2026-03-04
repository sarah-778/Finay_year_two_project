import { Link } from 'react-router-dom';

// --- IMPORT YOUR IMAGES HERE ---
import smartphoneImg from '../assets/smartphones.jpg'; 
import phoneSparesImg from '../assets/phone-spares.jpg';
import phoneChargersImg from '../assets/chargers.jpg';
import laptopImg from '../assets/laptops.jpg';
import desktopImg from '../assets/desktops.jpg';
import laptopChargerImg from '../assets/laptop-chargers.jpg';
import pcSparesImg from '../assets/pc-parts.jpg';

export default function AllProducts() {
  const categories = {
    mobile: [
      { name: "Smartphones", slug: "smartphones", count: "120+ Items", img: smartphoneImg },
      { name: "Phone Spare Parts", slug: "phone-spares", count: "500+ Items", img: phoneSparesImg },
      { name: "Phone Chargers", slug: "phone-chargers", count: "80+ Items", img: phoneChargersImg }
    ],
    computing: [
      { name: "Laptops", slug: "laptops", count: "45+ Items", img: laptopImg },
      { name: "Desktops", slug: "desktops", count: "20+ Items", img: desktopImg },
      { name: "Laptop Chargers", slug: "laptop-chargers", count: "60+ Items", img: laptopChargerImg },
      { name: "PC Spares", slug: "pc-spares", count: "300+ Items", img: pcSparesImg }
    ]
  };

  return (
    <div className="bg-white min-h-screen pb-20">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-black text-slate-900 mb-12 border-l-8 border-blue-600 pl-6 uppercase tracking-tight">
          Product Collections
        </h1>

        {/* SECTION 1: SMARTPHONES & ACCESSORIES */}
        <section className="mb-16">
          <h2 className="text-xl font-black text-blue-600 mb-8 flex items-center gap-3 uppercase tracking-wider">
            <span className="bg-blue-600 text-white px-2 py-1 rounded text-lg">📱</span>
            Smartphones & Mobile Solutions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {categories.mobile.map((cat, i) => (
              <Link to={`/category/${cat.slug}`} key={i} className="group relative h-64 rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all">
                {/* Background Image */}
                <img 
                  src={cat.img} 
                  alt={cat.name}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                />
                {/* Overlay Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent flex flex-col justify-end p-8">
                  <h3 className="text-2xl font-black text-white uppercase tracking-tight mb-1">{cat.name}</h3>
                  <p className="text-blue-400 font-bold text-sm uppercase tracking-widest mb-4">{cat.count}</p>
                  <span className="text-white text-xs font-bold uppercase border-b-2 border-blue-500 w-fit pb-1 group-hover:border-white transition-all">
                    Browse Collection →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* SECTION 2: COMPUTING & SPARE PARTS */}
        <section>
          <h2 className="text-xl font-black text-blue-600 mb-8 flex items-center gap-3 uppercase tracking-wider">
            <span className="bg-blue-600 text-white px-2 py-1 rounded text-lg">💻</span>
            Laptops, Desktops & Spares
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {categories.computing.map((cat, i) => (
              <Link to={`/category/${cat.slug}`} key={i} className="group relative h-72 rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all">
                {/* Background Image */}
                <img 
                  src={cat.img} 
                  alt={cat.name}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                />
                {/* Overlay Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-blue-950/90 via-slate-900/20 to-transparent flex flex-col justify-end p-6">
                  <h3 className="text-lg font-black text-white uppercase leading-tight mb-1">{cat.name}</h3>
                  <p className="text-blue-300 font-bold text-[10px] uppercase tracking-widest mb-3">{cat.count}</p>
                  <span className="text-white text-[10px] font-black uppercase opacity-0 group-hover:opacity-100 transition-opacity translate-y-2 group-hover:translate-y-0 duration-300">
                    View Details →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}