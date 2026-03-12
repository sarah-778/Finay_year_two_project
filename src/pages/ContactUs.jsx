import { useState } from "react";
import { HiOutlineLocationMarker, HiOutlinePhone, HiOutlineMail, HiOutlineClock } from "react-icons/hi";

export default function ContactUs() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: ""
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Message sent successfully!");
    setFormData({
      name: "",
      email: "",
      phone: "",
      message: ""
    });
  };

  return (
    <div className="min-h-screen bg-slate-100 py-12 px-4">
      <div className="max-w-6xl mx-auto">

        {/* Page Title */}
        <h1 className="text-4xl font-bold text-center mb-6 text-blue-600">
          Contact IT Arena
        </h1>

        <p className="text-center text-slate-700 mb-12">
          We are located at Sanctity Plaza, Kampala Road. Reach out to us for product inquiries, repairs, or general support.
        </p>

        <div className="grid md:grid-cols-2 gap-10">

          {/* Contact Information */}
          <div className="bg-white p-8 rounded-lg shadow-lg border border-slate-200">
            <h2 className="text-2xl font-semibold mb-6 text-blue-600">
              Contact Information
            </h2>

            <div className="space-y-4 text-slate-700">
              <p className="flex items-center gap-2">
                <HiOutlineLocationMarker className="text-blue-600 text-xl" />
                <span>Sanctity Plaza, Kampala Road</span>
              </p>
              <p className="flex items-center gap-2">
                <HiOutlinePhone className="text-blue-600 text-xl" />
                <span>+256 700 000000</span>
              </p>
              <p className="flex items-center gap-2">
                <HiOutlineMail className="text-blue-600 text-xl" />
                <span>itarena@gmail.com</span>
              </p>
              <p className="flex items-center gap-2">
                <HiOutlineClock className="text-blue-600 text-xl" />
                <span>Mon - Sat (8:00 AM - 7:00 PM)</span>
              </p>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-slate-800 p-8 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold mb-6 text-blue-400">
              Send Us a Message
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">

              <input
                type="text"
                name="name"
                placeholder="Your Name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded bg-slate-700 text-white outline-none focus:ring-2 focus:ring-blue-500"
              />

              <input
                type="email"
                name="email"
                placeholder="Your Email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded bg-slate-700 text-white outline-none focus:ring-2 focus:ring-blue-500"
              />

              <input
                type="text"
                name="phone"
                placeholder="Your Phone Number"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded bg-slate-700 text-white outline-none focus:ring-2 focus:ring-blue-500"
              />

              <textarea
                name="message"
                placeholder="Your Message"
                rows="4"
                value={formData.message}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded bg-slate-700 text-white outline-none focus:ring-2 focus:ring-blue-500"
              ></textarea>

              <button
                type="submit"
                className="w-full bg-blue-600 py-3 rounded font-bold hover:bg-blue-700 transition"
              >
                Send Message
              </button>

            </form>
          </div>

        </div>
      </div>
    </div>
  );
}