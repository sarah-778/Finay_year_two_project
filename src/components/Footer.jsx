export default function Footer() {
  const phoneNumber = "256786315298"; // Format for WhatsApp link (no + or spaces)
  
  return (
    <footer className="bg-slate-900 text-white pt-16 pb-8 px-6 mt-12">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 border-b border-slate-700 pb-12">

        {/* Company Info */}
        <div className="space-y-6">
          <h2 className="text-3xl font-black text-blue-600 tracking-tighter">
            IT ARENA
          </h2>

          <div className="flex items-start gap-4">
            <span className="text-4xl text-slate-400">🎧</span>
            <div>
              <p className="text-slate-400 text-sm uppercase font-bold">Contact Us:</p>
              {/* Active WhatsApp Link */}
              <a 
                href={`https://wa.me/${phoneNumber}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="font-black text-blue-600 text-xl tracking-tight hover:text-blue-400 transition-colors block"
              >
                (+256) 786 315 298
              </a>
              <p className="text-[10px] text-slate-500 mt-1 uppercase font-black tracking-widest">
                Chat on WhatsApp
              </p>
            </div>
          </div>

          <div className="text-sm text-slate-400 space-y-2 uppercase font-medium">
            <p>Kampala, Uganda</p>
            <p>
              Email: <a href="mailto:info@itarena.ug" className="hover:text-blue-400 transition-colors">info@itarena.ug</a>
            </p>
          </div>
        </div>

        {/* What We Do */}
        <div>
          <h4 className="font-bold uppercase mb-6 tracking-widest text-sm text-slate-200">
            What We Do
          </h4>
          <ul className="text-slate-400 text-sm space-y-4">
            <li className="hover:text-blue-400 transition-colors cursor-pointer">Computer & Laptop Repairs</li>
            <li className="hover:text-blue-400 transition-colors cursor-pointer">Phone Repairs & Screen Replacement</li>
            <li className="hover:text-blue-400 transition-colors cursor-pointer">Software Installation & Troubleshooting</li>
            <li className="hover:text-blue-400 transition-colors cursor-pointer">System Upgrades & Maintenance</li>
          </ul>
        </div>

        {/* Products We Sell */}
        <div>
          <h4 className="font-bold uppercase mb-6 tracking-widest text-sm text-slate-200">
            Products We Sell
          </h4>
          <ul className="text-slate-400 text-sm space-y-4">
            <li className="hover:text-blue-400 transition-colors cursor-pointer">Smartphones (Multiple Brands)</li>
            <li className="hover:text-blue-400 transition-colors cursor-pointer">Laptops & Desktop Computers</li>
            <li className="hover:text-blue-400 transition-colors cursor-pointer">Chargers, Cables & Accessories</li>
            <li className="hover:text-blue-400 transition-colors cursor-pointer">Computer & Phone Spare Parts</li>
          </ul>
        </div>

        {/* Customer Support */}
        <div>
          <h4 className="font-bold uppercase mb-6 tracking-widest text-sm text-slate-200">
            Customer Support
          </h4>
          <ul className="text-slate-400 text-sm space-y-4">
            <li className="hover:text-blue-400 transition-colors cursor-pointer">About IT Arena</li>
            <li className="hover:text-blue-400 transition-colors cursor-pointer">Repair Warranty Information</li>
            <li className="hover:text-blue-400 transition-colors cursor-pointer">Delivery & Pickup Services</li>
            <li className="hover:text-blue-400 transition-colors cursor-pointer">Technical Support & Help Desk</li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="max-w-7xl mx-auto pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
        <p>© {new Date().getFullYear()} IT Arena Limited. All Rights Reserved.</p>
        <div className="flex gap-6">
          <span className="hover:text-white cursor-pointer transition-colors">Privacy Policy</span>
          <span className="hover:text-white cursor-pointer transition-colors">Terms of Service</span>
        </div>
      </div>
    </footer>
  );
}