import { useState, useEffect } from "react";
import { useRepairStore } from "../store/useRepairStore";

export default function RepairServices() {
  const { repairSamples, fetchRepairSamples, addUserRepair } = useRepairStore();

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    device: "",
    issue: "",
    date: "",
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchRepairSamples();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
  
    try {
      const form = new FormData();
  
      form.append("name", formData.name);
      form.append("phone", formData.phone);
      form.append("email", formData.email);
      form.append("device", formData.device);
      form.append("issue", formData.issue);
      form.append("date", formData.date);
      form.append("type", "user"); // VERY IMPORTANT
  
      await addUserRepair(form);
  
      alert("Repair request submitted successfully!");
  
      setFormData({
        name: "",
        phone: "",
        email: "",
        device: "",
        issue: "",
        date: "",
      });
  
    } catch (err) {
      console.error(err);
      alert("Failed to submit repair request:\n" + err.message);
    } finally {
      setLoading(false);
    }
  };
  // Filter only sample type
  const sampleRepairs = repairSamples.filter(
    (r) => r.type === "sample"
  );

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-slate-50 p-6 gap-10">

      {/* LEFT PANEL */}
      {/* LEFT PANEL */}
<div className="md:w-1/2 bg-white p-8 rounded-3xl shadow-lg overflow-y-auto max-h-[calc(100vh-48px)]">
  <h2 className="text-2xl font-black text-slate-800 mb-6">
    Repair Samples
  </h2>

  {sampleRepairs.length === 0 ? (
    <p className="text-slate-500">
      No repair samples available.
    </p>
  ) : (
    <div className="space-y-6">
      {sampleRepairs.map((r) => {
        console.log("FULL SAMPLE OBJECT:", r);

        return (
          <div
            key={r.id}
            className="flex gap-4 border p-4 rounded-xl shadow-sm"
          >
            {/* IMAGE */}
            {r.image && (
              <img
                src={`http://localhost:8000/storage/${r.image.replace(/^storage\//, "")}`}
                alt="repair sample"
                className="h-24 w-24 object-cover rounded-lg border"
              />
            )}

            {/* TEXT SECTION */}
            <div className="flex flex-col justify-center">
              <p className="text-lg font-bold text-slate-800">
                {r.device}
              </p>

              <p className="text-sm text-slate-600 mt-1">
                {r.issue}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  )}
</div>

      {/* RIGHT PANEL */}
      <div className="md:w-1/2 bg-white p-8 rounded-3xl shadow-lg">
        <h2 className="text-2xl font-black text-slate-800 mb-6">
          Book a Repair
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">
              Full Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-600 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">
              Phone
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-600 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-600 text-slate-700 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">
              Device
            </label>
            <input
              type="text"
              name="device"
              value={formData.device}
              onChange={handleChange}
              required
              className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-600 text-slate-700 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">
              Issue
            </label>
            <textarea
              name="issue"
              value={formData.issue}
              onChange={handleChange}
              required
              rows={4}
              className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-600 text-slate-700 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">
              Preferred Date
            </label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
              className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-600 text-slate-700 outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-blue-600 text-white font-black py-3 rounded-xl uppercase hover:bg-blue-700 transition-colors ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Submitting..." : "Submit Repair Request"}
          </button>

        </form>
      </div>
    </div>
  );
}