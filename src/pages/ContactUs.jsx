import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore"; // Ensure path is correct
import { 
  HiOutlineLocationMarker, 
  HiOutlinePhone, 
  HiOutlineMail, 
  HiOutlineClock,
  HiOutlineLockClosed 
} from "react-icons/hi";

export default function ContactUs() {
  const navigate = useNavigate();
  // Change 'token' to 'isAuthenticated' to match your Zustand store
  const { isAuthenticated, user } = useAuthStore(); 

  const [formData, setFormData] = useState({
    name: user?.name || "", 
    email: user?.email || "", 
    phone: "",
    message: ""
  });

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: "", msg: "" });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: "", msg: "" });

    // Get the token directly from localStorage since it's not a state in your store
    const token = localStorage.getItem('token');

    try {
      const response = await axios.post(
        "http://localhost:8000/api/contact", 
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Proves you are logged in to Laravel
          }
        }
      );

      if (response.status === 201 || response.status === 200) {
        setStatus({ type: "success", msg: "Message sent! We'll get back to you soon." });
        setFormData({ ...formData, message: "", phone: "" });
      }
    } catch (error) {
      if (error.response?.status === 401) {
        setStatus({ type: "error", msg: "Session expired. Please log in again." });
      } else {
        setStatus({ 
          type: "error", 
          msg: error.response?.data?.message || "Failed to send message." 
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-black text-center mb-12 text-slate-900 uppercase">
          Contact <span className="text-blue-600">IT Arena</span>
        </h1>

        <div className="grid md:grid-cols-2 gap-10">
          {/* Left Side: Info */}
          <div className="bg-white p-10 rounded-[2rem] shadow-sm">
            <h2 className="text-xl font-bold mb-6">Contact Information</h2>
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-slate-600">
                <HiOutlineLocationMarker className="text-blue-600" />
                <span>Sanctity Plaza, Kampala Road</span>
              </div>
              <div className="flex items-center gap-3 text-slate-600">
                <HiOutlinePhone className="text-blue-600" />
                <span>+256 786315298</span>
              </div>
              <div className="flex items-center gap-3 text-slate-600">
                <HiOutlineMail className="text-blue-600" />
                <span>itarena@gmail.com</span>
              </div>
            </div>
          </div>

          {/* Right Side: THE FORM GATE */}
          <div className="bg-slate-900 p-10 rounded-[2rem] shadow-xl">
            {/* We now check for 'isAuthenticated' from your store */}
            {!isAuthenticated ? (
              <div className="text-center py-10">
                <HiOutlineLockClosed className="text-blue-500 text-5xl mx-auto mb-4" />
                <h3 className="text-white font-bold text-lg mb-2">Members Only</h3>
                <p className="text-slate-400 mb-6">Please log in to send us a message.</p>
                <button 
                  onClick={() => navigate('/login')}
                  className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold uppercase text-xs tracking-widest"
                >
                  Login Now
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <h2 className="text-white font-bold text-xl mb-4">Send a Message</h2>
                
                {status.msg && (
                  <div className={`p-4 rounded-xl text-xs font-bold ${
                    status.type === "success" ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"
                  }`}>
                    {status.msg}
                  </div>
                )}

                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Full Name"
                  className="w-full p-4 rounded-xl bg-slate-800 text-white border border-slate-700 outline-none focus:border-blue-500"
                  required
                />

                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Email"
                  className="w-full p-4 rounded-xl bg-slate-800 text-white border border-slate-700 outline-none focus:border-blue-500"
                  required
                />

                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="How can we help?"
                  rows="4"
                  className="w-full p-4 rounded-xl bg-slate-800 text-white border border-slate-700 outline-none focus:border-blue-500"
                  required
                ></textarea>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold uppercase tracking-widest hover:bg-blue-500 transition-all"
                >
                  {loading ? "Sending..." : "Send Message"}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}