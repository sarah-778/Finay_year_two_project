import React, { useEffect, useState } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { useProductStore } from '../store/useProductStore';
import { useRepairStore } from '../store/useRepairStore';
import { 
  HiOutlineCube,
  HiOutlineTruck,
  HiOutlineUserGroup,
  HiOutlineCog
} from "react-icons/hi";

const AdminDashboard = () => {
  const { products, fetchProducts, addProduct, deleteProduct } = useProductStore();

  // --- REPAIR STORE ---
  const {
    repairSamples,
    fetchRepairSamples,
    addRepairSample,
    userRepairRequests,
    fetchUserRepairs,
    
  } = useRepairStore();

  const [showModal, setShowModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentView, setCurrentView] = useState('inventory');
   //users
   const { allUsers, fetchAllUsers, loading: usersLoading } = useAuthStore();

  // Asset form
  const [formData, setFormData] = useState({ name: '', category: '', brand: '', price: '', stock: '', description: '', image: null });
  const [imagePreview, setImagePreview] = useState(null);

  // Repair form
  const [repairForm, setRepairForm] = useState({ device: '', issue: '', image: null });
  const [repairPreview, setRepairPreview] = useState(null);

// Inside AdminDashboard.jsx
const categoryData = {
  "smartphones": ["Apple iPhone", "Samsung Galaxy", "Google Pixel", "Huawei", "Xiaomi", "Oppo", "Tecno & Infinix"],
  "phone-spares": ["Original Screens", "Charging Ports", "Batteries", "Back Covers", "Camera Modules"],
  "phone-chargers": ["Apple", "Samsung", "Oraimo", "Anker", "Baseus"],
  "laptops": ["MacBook", "HP", "Dell", "Lenovo", "Asus", "Acer", "Microsoft Surface"],
  "desktops": ["iMac", "HP Pavilion", "Dell OptiPlex", "Lenovo ThinkCentre", "Custom Build", "Workstations"], // ADDED
  "laptop-chargers": ["Universal", "Apple MagSafe", "HP Smart AC", "Dell Type-C"],
  "pc-spares": ["Screens", "Keyboards", "Internal Batteries", "SSD Storage", "RAM"]
};

  // --- INITIAL DATA FETCH ---
  useEffect(() => {
    fetchProducts();
    fetchRepairSamples();
    fetchUserRepairs();
    fetchAllUsers();
  }, []);

  // --- Asset handlers ---
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, image: file });
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    const data = new FormData();
    data.append('name', formData.name);
    data.append('category', formData.category);
    data.append('brand', formData.brand);
    data.append('price', formData.price);
    data.append('stock', formData.stock);
    if (formData.image) data.append('image', formData.image);

    try {
      await addProduct(data);
      setShowModal(false);
      setImagePreview(null);
      setFormData({ name: '', category: '', brand: '', price: '', stock: '', image: null });
      alert("Asset successfully synchronized!");
    } catch (error) {
      const errorMsg = error.response?.data?.messages 
        ? Object.values(error.response.data.messages).flat().join(', ')
        : "Check your server connection.";
      alert("Error: " + errorMsg);
    } finally {
      setIsSaving(false);
    }
  };

  // --- Repair handlers ---
  const handleRepairImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setRepairForm({ ...repairForm, image: file });
      setRepairPreview(URL.createObjectURL(file));
    }
  };

  const handleRepairSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append('device', repairForm.device);
    data.append('issue', repairForm.issue);
    if (repairForm.image) data.append('image', repairForm.image);

    try {
      await addRepairSample(data); // Add to backend store
      setRepairForm({ device: '', issue: '', image: null });
      setRepairPreview(null);
    } catch (error) {
      alert("Failed to add repair sample.");
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 font-sans text-slate-900 overflow-hidden">
      {/* MODAL: Asset */}
      {showModal && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-slate-900/40 backdrop-blur-md p-6">
          <div className="bg-white w-full max-w-4xl rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col md:flex-row h-[600px] animate-in slide-in-from-bottom-4 duration-300">
            {/* Left Column */}
            <div className="w-full md:w-5/12 bg-slate-100 p-8 flex flex-col items-center justify-center border-r border-slate-200">
              <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-6">Asset Preview</h3>
              <div className="relative w-full aspect-square bg-white rounded-[2rem] shadow-inner flex items-center justify-center overflow-hidden border-2 border-dashed border-slate-300 group transition-all hover:border-blue-400">
                {imagePreview ? (
                  <img src={imagePreview} className="h-full w-full object-contain p-4 transition-transform group-hover:scale-105" alt="Preview" />
                ) : (
                  <div className="text-center p-6 text-slate-400 font-bold uppercase tracking-tighter text-[10px]">
                    Click to select product image
                  </div>
                )}
                <input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleImageChange} />
              </div>
              <p className="mt-4 text-[9px] text-slate-400 text-center uppercase font-bold tracking-tighter">Supported formats: PNG, JPG (Max 5MB)</p>
            </div>

            {/* Right Column */}
            <div className="w-full md:w-7/12 p-10 flex flex-col">
              <div className="flex justify-between items-start mb-8">
                <div>
                  <h2 className="text-2xl font-black text-slate-800 tracking-tighter">NEW ASSET ENTRY</h2>
                  <p className="text-xs font-bold text-blue-500 uppercase tracking-widest">General Inventory Management</p>
                </div>
                <button onClick={() => setShowModal(false)} className="text-slate-300 hover:text-red-500 transition-colors text-xl font-bold">✕</button>
              </div>

              <form onSubmit={handleSubmit} className="flex-1 flex flex-col space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Asset Name</label>
                    <input type="text" required className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm font-bold focus:ring-2 focus:ring-blue-500 outline-none transition" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Category</label>
                    <select required className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm font-bold outline-none" value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value, brand: ''})}>
                      <option value="">Select Category</option>
                      {Object.keys(categoryData).map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Brand</label>
                    <select required className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm font-bold outline-none disabled:opacity-50" value={formData.brand} onChange={(e) => setFormData({...formData, brand: e.target.value})} disabled={!formData.category}>
                      <option value="">Select Brand</option>
                      {formData.category && categoryData[formData.category].map(b => <option key={b} value={b}>{b}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Unit Price (UGX)</label>
                    <input type="number" required className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm font-bold outline-none" value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} />
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Initial Stock</label>
                    <input type="number" required className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm font-bold outline-none" value={formData.stock} onChange={(e) => setFormData({...formData, stock: e.target.value})} />
                  </div>
                </div>
                <div className="mt-auto pt-6">
                  <button 
                    type="submit" 
                    disabled={isSaving}
                    className={`w-full py-4 rounded-2xl font-black uppercase tracking-widest text-sm transition-all shadow-lg ${isSaving ? 'bg-slate-200 text-slate-400' : 'bg-slate-900 text-white hover:bg-blue-600 hover:-translate-y-1 active:scale-95 shadow-slate-200'}`}
                  >
                    {isSaving ? 'Processing Entry...' : 'Authorize & Add Asset'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* SIDEBAR */}
      <aside className="w-72 bg-slate-950 text-white p-8 flex flex-col border-r border-slate-800">
        <div className="mb-12">
          <h1 className="text-2xl font-black text-blue-500 italic tracking-tighter">IT ARENA</h1>
          <p className="text-[8px] font-bold text-slate-500 uppercase tracking-[0.3em]">Central Management</p>
        </div>
        <nav className="space-y-2 flex-1">
          {['inventory', 'orders', 'users', 'repair'].map((view) => (
            <button 
              key={view} 
              onClick={() => setCurrentView(view)} 
              className={`w-full flex items-center gap-4 text-left font-bold text-xs p-4 rounded-2xl transition-all capitalize ${currentView === view ? 'bg-blue-600 text-white' : 'text-slate-500 hover:bg-slate-900'}`}
            >
              {view === 'inventory' ? <HiOutlineCube /> 
               : view === 'orders' ? <HiOutlineTruck /> 
               : view === 'users' ? <HiOutlineUserGroup /> 
               : <HiOutlineCog />} {view === 'repair' ? 'Repair Management' : view.charAt(0).toUpperCase() + view.slice(1)}
            </button>
          ))}
        </nav>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="px-10 py-6 bg-white border-b border-slate-100 flex justify-between items-center shadow-sm">
          <div className="flex items-center gap-10">
            <h2 className="text-2xl font-black text-slate-800 capitalize tracking-tighter">{currentView === 'repair' ? 'Repair Management' : currentView} Dashboard</h2>
            <input type="text" placeholder="Search Assets..." className="bg-slate-100 border-none rounded-xl py-2 px-6 w-64 text-xs font-bold focus:ring-2 focus:ring-blue-500 outline-none" onChange={(e) => setSearchTerm(e.target.value)} />
          </div>
          {currentView !== 'repair' && (
            <button onClick={() => setShowModal(true)} className="bg-blue-600 text-white px-8 py-3 rounded-xl text-[10px] font-black tracking-widest hover:bg-blue-700 transition-all shadow-lg shadow-blue-100">
              + REGISTER NEW ASSET
            </button>
          )}
        </header>

        <div className="flex-1 overflow-y-auto p-10">
          {/* INVENTORY */}
          {currentView === 'inventory' && (
            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-slate-50 border-b border-slate-100">
                  <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    <th className="p-6">Asset Info</th>
                    <th className="p-6 text-center">Stock</th>
                    <th className="p-6 text-right">Price</th>
                    <th className="p-6 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {products.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase())).map((p) => (
                    <tr key={p.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="p-6 flex items-center gap-4">
                        <div className="h-12 w-12 rounded-xl bg-slate-100 p-1 border border-slate-200">
                          <img src={p.image} className="h-full w-full object-contain" />
                        </div>
                        <div>
                          <p className="font-black text-sm text-slate-800">{p.name}</p>
                          <p className="text-[10px] font-bold text-blue-500 uppercase">{p.brand}</p>
                        </div>
                      </td>
                      <td className="p-6 text-center font-black text-sm">{p.stock}</td>
                      <td className="p-6 text-right font-bold text-sm">UGX {Number(p.price).toLocaleString()}</td>
                      <td className="p-6 text-center">
                        <button onClick={() => deleteProduct(p.id)} className="text-red-500 text-[10px] font-black uppercase hover:bg-red-50 px-3 py-1 rounded-lg transition-all">Remove</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* ORDERS */}
          {currentView === 'orders' && (
            <div className="text-center font-bold text-slate-500">Orders section coming soon...</div>
          )}

          {/* USERS */}
         {currentView === 'users' && (
            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
              <div className="p-8 border-b border-slate-50 flex justify-between items-center">
                 <h3 className="font-black text-slate-800 uppercase tracking-tight">Registered Community</h3>
                 <span className="bg-blue-50 text-blue-600 px-4 py-1 rounded-full text-[10px] font-black uppercase">
                    {allUsers.length} Users Total
                 </span>
              </div>
              <table className="w-full text-left">
                <thead className="bg-slate-50 border-b border-slate-100">
                  <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    <th className="p-6">User Details</th>
                    <th className="p-6">Email Address</th>
                    <th className="p-6">Joined Date</th>
                    <th className="p-6 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {allUsers
                    .filter(u => u.name.toLowerCase().includes(searchTerm.toLowerCase()) || u.email.toLowerCase().includes(searchTerm.toLowerCase()))
                    .map((u) => (
                    <tr key={u.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="p-6">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center text-white font-black text-xs">
                                {u.name.charAt(0).toUpperCase()}
                            </div>
                            <span className="font-black text-sm text-slate-800">{u.name}</span>
                        </div>
                      </td>
                      <td className="p-6 font-bold text-sm text-slate-500">{u.email}</td>
                      <td className="p-6 text-xs font-bold text-slate-400">
                        {new Date(u.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </td>
                      <td className="p-6 text-center">
                        <span className="bg-green-100 text-green-600 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-tighter">
                            Verified
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {allUsers.length === 0 && !usersLoading && (
                <div className="py-20 text-center text-slate-400 font-bold uppercase text-xs tracking-widest italic">
                    Database is currently empty
                </div>
              )}
            </div>
          )}

          {/* REPAIR */}
          {currentView === 'repair' && (
            <div className="grid md:grid-cols-2 gap-10">
              {/* Left: User-submitted repair requests */}
              <div className="bg-white p-8 rounded-3xl shadow-lg overflow-y-auto max-h-[calc(100vh-160px)]">
                <h2 className="text-xl font-black text-slate-800 mb-6">User Repair Requests</h2>
                {userRepairRequests.length === 0 ? (
                  <p className="text-slate-500 text-sm">No repair requests yet.</p>
                ) : (
                  <div className="space-y-4">
                    {userRepairRequests.map((r, idx) => (
                      <div key={idx} className="flex items-center gap-4 border p-3 rounded-xl shadow-sm">
                        {r.image && <img src={r.image} alt="repair" className="h-16 w-16 object-cover rounded-lg" />}
                        <div>
                          <p className="font-bold text-sm">{r.device}</p>
                          <p className="text-xs text-slate-500">{r.issue}</p>
                          {r.name && <p className="text-[10px] text-slate-400">{r.name} | {r.phone} | {r.email}</p>}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Right: Add Repair Sample */}
              <div className="bg-white p-8 rounded-3xl shadow-lg">
                <h2 className="text-xl font-black text-slate-800 mb-6">Add Repair Sample</h2>
                <form onSubmit={handleRepairSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">Device</label>
                    <input type="text" name="device" value={repairForm.device} onChange={(e) => setRepairForm({...repairForm, device: e.target.value})} required className="w-full border border-slate-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">Issue</label>
                    <textarea name="issue" value={repairForm.issue} onChange={(e) => setRepairForm({...repairForm, issue: e.target.value})} required rows={3} className="w-full border border-slate-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">Upload Image</label>
                    <input type="file" accept="image/*" onChange={handleRepairImageChange} className="w-full" />
                    {repairPreview && <img src={repairPreview} className="mt-2 h-24 w-24 object-cover rounded-lg" />}
                  </div>
                  <button type="submit" className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold uppercase tracking-widest hover:bg-blue-700 transition-all">Add Sample</button>
                </form>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;