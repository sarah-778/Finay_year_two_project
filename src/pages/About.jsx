import { Link } from "react-router-dom";
import banner from "../assets/banner.jpg";

export default function About() {
  return (
    <div className="bg-slate-50 min-h-screen">

      {/* 🔵 Banner Section */}
      <div className="max-w-6xl mx-auto pt-10 px-6">
        <div className="relative h-[50vh] md:h-[60vh] w-full rounded-[2.5rem] overflow-hidden shadow-2xl">
          <img
            src={banner}
            alt="IT Arena Banner"
            className="w-full h-full object-cover"
          />

          <div className="absolute inset-0 bg-slate-900/70 flex flex-col justify-center items-center text-center px-4">
            <h1 className="text-5xl md:text-6xl font-black text-blue-500 mb-4 uppercase tracking-tighter">
              IT ARENA
            </h1>
            <p className="max-w-2xl text-lg text-gray-200 font-medium">
              Your trusted technology hub for hardware repairs and quality mobile devices.
            </p>

            <Link
              to="/contact"
              className="mt-6 bg-blue-600 hover:bg-blue-700 transition px-8 py-3 rounded-xl font-bold uppercase text-sm tracking-widest text-white"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </div>

      {/* 🔵 About Content */}
      <div className="max-w-6xl mx-auto py-16 px-6">

        {/* Who We Are */}
        <div className="mb-16 text-center">
          <h2 className="text-3xl font-black text-blue-600 mb-6 uppercase">
            Who We Are
          </h2>
          <p className="text-slate-600 leading-relaxed max-w-3xl mx-auto font-medium">
            IT Arena is a professional technology solutions company dedicated
            to delivering reliable hardware repair services and supplying
            high-quality mobile phones from trusted global brands.
          </p>
        </div>

        {/* Mission & Vision */}
        <div className="grid md:grid-cols-2 gap-10 mb-20">
          <div className="bg-white p-10 rounded-[2rem] shadow-sm border border-slate-200 hover:shadow-xl transition duration-300">
            <h3 className="text-2xl font-black text-blue-600 mb-4 uppercase">
              Our Mission
            </h3>
            <p className="text-slate-500 font-medium leading-relaxed">
              To provide fast, affordable, and high-quality technology services
              and genuine mobile devices that meet our customers’ everyday needs.
            </p>
          </div>

          <div className="bg-slate-900 p-10 rounded-[2rem] shadow-xl hover:scale-[1.02] transition duration-300">
            <h3 className="text-2xl font-black text-blue-400 mb-4 uppercase">
              Our Vision
            </h3>
            <p className="text-slate-300 font-medium leading-relaxed">
              To become the most trusted destination for phone sales and tech
              repair services, known for reliability and customer satisfaction.
            </p>
          </div>
        </div>

        {/* Services Section */}
        <div className="text-center">
          <h2 className="text-3xl font-black text-blue-600 mb-8 uppercase">
            What We Offer
          </h2>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">

            {/* Computer Repairs */}
            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm hover:border-blue-500 transition duration-300">
              <h4 className="font-black mb-3 text-slate-800 text-lg uppercase tracking-tight">
                Computer Repairs
              </h4>
              <p className="text-slate-500 text-sm font-medium">
                Laptop and desktop diagnostics, upgrades, hardware replacement,
                and maintenance services.
              </p>
            </div>

            {/* Phone Sales (REPLACED) */}
            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm hover:border-blue-500 transition duration-300">
              <h4 className="font-black mb-3 text-slate-800 text-lg uppercase tracking-tight">
                Phone Sales
              </h4>
              <p className="text-slate-500 text-sm font-medium">
                We sell genuine smartphones from top brands including Apple,
                Samsung, Tecno, Infinix, Xiaomi, and more.
              </p>
            </div>

            {/* Software Solutions */}
            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm hover:border-blue-500 transition duration-300">
              <h4 className="font-black mb-3 text-slate-800 text-lg uppercase tracking-tight">
                Software Solutions
              </h4>
              <p className="text-slate-500 text-sm font-medium">
                Custom systems, troubleshooting, system optimization,
                and digital transformation services.
              </p>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}