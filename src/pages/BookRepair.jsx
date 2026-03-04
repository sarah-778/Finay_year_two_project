import { useState } from "react";

export default function BookRepair() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    device: "",
    issue: "",
    date: "",
  });

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // For now we just log the data; later you can connect to backend
    console.log("Repair Booking Submitted:", formData);
    alert("Thank you! Your repair request has been submitted.");
    setFormData({ name: "", phone: "", email: "", device: "", issue: "", date: "" });
  };

  return (
    <div className="bg-slate-50 min-h-screen py-12 px-6">
      <div className="max-w-3xl mx-auto bg-white p-10 rounded-3xl shadow-lg border border-slate-200">
        <h1 className="text-3xl font-black text-blue-600 mb-6 uppercase tracking-tight">
          Book A Repair
        </h1>
        <p className="text-slate-600 mb-8 font-medium">
          Fill out the form below and our team will contact you to schedule your repair.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name */}
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full border border-slate-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-600 outline-none"
              placeholder="John Doe"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Phone Number</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              className="w-full border border-slate-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-600 outline-none"
              placeholder="+256 7XX XXX XXX"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full border border-slate-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-600 outline-none"
              placeholder="you@example.com"
            />
          </div>

          {/* Device */}
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Device Type</label>
            <select
              name="device"
              value={formData.device}
              onChange={handleChange}
              required
              className="w-full border border-slate-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-600 outline-none"
            >
              <option value="">Select Device</option>
              <option value="iPhone">iPhone</option>
              <option value="Samsung Phone">Samsung Phone</option>
              <option value="Laptop">Laptop</option>
              <option value="Desktop PC">Desktop PC</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Issue */}
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Issue / Problem</label>
            <textarea
              name="issue"
              value={formData.issue}
              onChange={handleChange}
              required
              rows={4}
              className="w-full border border-slate-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-600 outline-none"
              placeholder="Describe the problem with your device..."
            />
          </div>

          {/* Preferred Date */}
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Preferred Date</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
              className="w-full border border-slate-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-600 outline-none"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-black py-3 rounded-xl uppercase hover:bg-blue-700 transition-colors"
          >
            Submit Booking
          </button>
        </form>
      </div>
    </div>
  );
}