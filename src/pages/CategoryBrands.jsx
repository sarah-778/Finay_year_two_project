import { useParams, Link } from 'react-router-dom';
import heroImg from '../assets/banner.jpg'; 

export default function CategoryBrands() {
  const { slug } = useParams();

  // Data mapping matching your Home.jsx logic
  // Data mapping matching your Home.jsx and Admin logic
  const categoryData = {
    "smartphones": {
      title: "Smartphone Brands",
      description: "Select a brand to view original phones and spare parts.",
      brands: ["Apple iPhone", "Samsung Galaxy", "Google Pixel", "Huawei", "Xiaomi", "Oppo", "Tecno & Infinix"]
    },
    "phone-spares": {
      title: "Phone Spare Parts",
      description: "Quality replacement screens, batteries, and charging ports.",
      brands: ["Original Screens", "Charging Ports", "Batteries", "Back Covers", "Camera Modules"]
    },
    "phone-chargers": {
      title: "Charging Solutions",
      description: "Fast chargers and original cables for all devices.",
      brands: ["Apple", "Samsung", "Oraimo", "Anker", "Baseus"]
    },
    "laptops": {
      title: "Laptop & Computing",
      description: "Professional machines and high-performance components.",
      brands: ["MacBook", "HP", "Dell", "Lenovo", "Asus", "Acer", "Microsoft Surface"]
    },
    "desktops": {
      title: "Desktop Computers",
      description: "All-in-ones, mini PCs, and powerful tower workstations.",
      brands: ["iMac", "HP Pavilion", "Dell OptiPlex", "Lenovo ThinkCentre", "Custom Build"]
    },
    "laptop-chargers": {
      title: "Laptop Power Adapters",
      description: "Replacement chargers for all major laptop brands.",
      brands: ["Universal", "Apple MagSafe", "HP Smart AC", "Dell Type-C", "Lenovo Slim Tip"]
    },
    "pc-spares": {
      title: "PC Replacement Parts",
      description: "Internal components, screens, and upgrade modules.",
      brands: ["Screens", "Keyboards", "Internal Batteries", "SSD Storage", "RAM"]
    }
  };

  const currentCat = categoryData[slug] || { title: "Category", brands: [] };

  // --- WHATSAPP LOGIC ---
  const phoneNumber = "256777122972"; // International format for Uganda
  const message = `Hello IT Arena, I am looking for a specific brand/part in the ${currentCat.title} section. Can you help me find it?`;
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

  return (
    <div className="bg-slate-50 min-h-screen pb-20">
      {/* Header Section */}
      <div className="bg-blue-600 py-16 text-center text-white">
        <h1 className="text-4xl font-black uppercase italic tracking-tighter mb-4">
          {currentCat.title}
        </h1>
        <p className="text-blue-100 max-w-xl mx-auto px-4">{currentCat.description}</p>
      </div>

      <div className="max-w-7xl mx-auto px-4 -mt-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {currentCat.brands.map((brand, index) => (
            <Link 
              key={index}
              to={`/shop?cat=${slug}&brand=${brand.replace(/\s+/g, '-').toLowerCase()}`}
              className="group"
            >
              <div className="bg-white border-2 border-transparent hover:border-blue-600 p-8 rounded-2xl shadow-lg transition-all text-center flex flex-col items-center h-full">
                <div className="w-16 h-16 bg-slate-100 rounded-full mb-4 flex items-center justify-center group-hover:bg-blue-50 transition-colors">
                  <span className="text-2xl font-bold text-blue-600">{brand[0]}</span>
                </div>
                
                <h3 className="font-bold text-slate-800 group-hover:text-blue-600 transition-colors">
                  {brand}
                </h3>
                
                <p className="text-[10px] text-slate-400 mt-2 uppercase font-black tracking-widest">
                  View {brand} Stock
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* --- ACTIVATED QUICK HELP SECTION --- */}
      <div className="max-w-3xl mx-auto mt-20 p-8 bg-white rounded-3xl border border-slate-200 text-center shadow-sm">
        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-green-600 text-xl">💬</span>
        </div>
        <h4 className="font-bold text-slate-800 mb-2">Can't find a specific brand?</h4>
        <p className="text-sm text-slate-500 mb-6">We stock more items in-store than what is currently listed online.</p>
        
        <a 
          href={whatsappUrl} 
          target="_blank" 
          rel="noopener noreferrer"
          className="inline-block"
        >
          <button className="bg-[#25D366] text-white px-10 py-4 rounded-full font-black uppercase tracking-wide hover:bg-[#128C7E] transition-all shadow-lg hover:shadow-green-200 active:scale-95">
            Chat with an Expert
          </button>
        </a>
      </div>
    </div>
  );
}