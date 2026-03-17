import React, { useEffect, useState } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { useProductStore } from '../store/useProductStore';
import { useRepairStore } from '../store/useRepairStore';
import { useOrderStore } from '../store/useOrderStore'; 

import { 
  HiOutlineCube,
  HiOutlineTruck,
  HiOutlineUserGroup,
  HiOutlineCog,
  HiOutlineTrash
} from "react-icons/hi";

const AdminDashboard = () => {
  const { products, fetchProducts, addProduct, deleteProduct } = useProductStore();
  const { orders, loading, fetchOrders, updateOrderStatus, deleteOrder } = useOrderStore();
  // --- REPAIR STORE ---
  const {
    repairSamples,
    fetchRepairSamples,
    addRepairSample,
    userRepairRequests,
    deleteRepairSample,
    updateRepairStatus,
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
    fetchOrders();
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

  const StatsOverview = () => {
    // Calculate stats from your existing store data
    const totalRevenue = orders
      .filter(o => o.status === 'delivered')
      .reduce((acc, curr) => acc + Number(curr.total), 0);
  
    const pendingRepairs = (userRepairRequests || []).filter(r => r.status !== 'completed').length;
    const lowStockItems = products.filter(p => p.stock < 5).length;
  
    const statCards = [
      { label: "Total Revenue", value: `UGX ${totalRevenue.toLocaleString()}`, color: "text-green-600", bg: "bg-green-50" },
      { label: "Active Repairs", value: pendingRepairs, color: "text-amber-600", bg: "bg-amber-50" },
      { label: "Low Stock Alerts", value: lowStockItems, color: "text-red-600", bg: "bg-red-50" },
      { label: "Total Community", value: allUsers.length, color: "text-blue-600", bg: "bg-blue-50" },
    ];
  
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {statCards.map((stat, i) => (
          <div key={i} className={`${stat.bg} p-6 rounded-[2rem] border border-white shadow-sm`}>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">{stat.label}</p>
            <p className={`text-2xl font-black ${stat.color} tracking-tighter`}>{stat.value}</p>
          </div>
        ))}
      </div>
    );
  };

  // --- Repair handlers ---
  const handleRepairImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setRepairForm({ ...repairForm, image: file });
      setRepairPreview(URL.createObjectURL(file));
    }
  };

  const getStatusStyles = (status) => {
    switch (status) {
      case 'delivered': return 'border-green-500 bg-green-50 text-green-600';
      case 'processing': return 'border-blue-500 bg-blue-50 text-blue-600';
      case 'cancelled': return 'border-red-500 bg-red-50 text-red-600';
      default: return 'border-slate-900 bg-slate-900 text-white'; // Pending
    }
  };

 // Inside AdminDashboard.jsx
// --- Updated Repair handlers with deeper error checking ---
const handleRepairSubmit = async (e) => {
  e.preventDefault();
  if (!repairForm.device || !repairForm.issue) return alert("Please fill in Device and Issue.");
  
  setIsSaving(true);
  const data = new FormData();
  data.append('device', repairForm.device);
  data.append('issue', repairForm.issue);
  data.append('type', 'sample'); 
  if (repairForm.image) data.append('image', repairForm.image);

  try {
    await addRepairSample(data); 
    setRepairForm({ device: '', issue: '', image: null });
    setRepairPreview(null);
    alert("✅ Portfolio sample added successfully!");
  } catch (error) {
    // This will tell you EXACTLY what Laravel is unhappy about
    const serverMessage = error.response?.data?.message || error.message;
    const validationErrors = error.response?.data?.errors 
      ? Object.values(error.response.data.errors).flat().join('\n') 
      : "";
    
    alert(`❌ Failed to add repair sample:\n${serverMessage}\n${validationErrors}`);
    console.error("Upload Error:", error.response?.data);
  } finally {
    setIsSaving(false);
  }
};

const handleStatusChange = async (id, newStatus) => {
  try {
    await updateRepairStatus(id, newStatus);
    // Optional: A small toast or notification instead of a loud alert
  } catch (error) {
    alert("Failed to update status. Check your internet or server logs.");
  }
};

// Helper to safely format image URLs
const getImageUrl = (path) => {
  if (!path) return null;
  if (path.startsWith('http')) return path;
  // Cleans up 'storage/' or '/storage' prefixes to avoid double-slashes
  const cleanPath = path.replace(/^\/?storage\//, "");
  return `http://localhost:8000/storage/${cleanPath}`;
};
  const handleDeleteSample = async (id) => {
    if (window.confirm("Are you sure you want to delete this portfolio sample?")) {
      await deleteRepairSample(id);
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
            {/* NEW STATS ROW */}
              <StatsOverview />
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
                      <td className={`p-6 text-center font-black text-sm ${p.stock < 5 ? 'text-red-500 animate-pulse' : 'text-slate-800'}`}>
          {p.stock}
        </td>
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

        {/* ORDERS MANAGEMENT */}
{currentView === 'orders' && (
  <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden flex flex-col h-full">
    <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
      <div>
        <h3 className="font-black text-slate-800 uppercase tracking-tight text-xl">Order Fulfillment</h3>
        <p className="text-[10px] font-bold text-blue-500 uppercase tracking-widest">Global Logistics Control</p>
      </div>
      <div className="flex gap-4">
        <span className="bg-slate-900 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase">
          {orders.length} Total Orders
        </span>
      </div>
    </div>

    <div className="flex-1 overflow-y-auto">
      <table className="w-full text-left border-collapse">
        <thead className="sticky top-0 bg-white z-10 border-b border-slate-100">
          <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
            <th className="p-6">Customer & ID</th>
            <th className="p-6">Ordered Items</th>
            <th className="p-6">Delivery Address</th>
            <th className="p-6 text-right">Total (UGX)</th>
            <th className="p-6 text-center">Status Control</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50">
          {orders
            .filter(o => o.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) || o.order_number.toLowerCase().includes(searchTerm.toLowerCase()))
            .map((order) => (
            <tr key={order.id} className="hover:bg-slate-50/50 transition-colors align-top">
              {/* Customer Info */}
              <td className="p-6">
                <p className="font-black text-blue-600 text-[10px] mb-1 tracking-widest uppercase">{order.order_number}</p>
                <p className="font-black text-sm text-slate-800 uppercase">{order.customer_name}</p>
                <p className="text-[10px] font-bold text-slate-400">{order.phone}</p>
              </td>

              {/* Items List */}
              <td className="p-6">
                <div className="space-y-2">
                  {order.items.map((item, i) => (
                    <div key={i} className="flex items-center gap-2 group">
                      <div className="w-6 h-6 rounded bg-slate-100 p-0.5 border border-slate-200">
                        <img src={item.image} className="w-full h-full object-contain" alt="" />
                      </div>
                      <p className="text-[10px] font-bold text-slate-600 uppercase">
                        {item.quantity}x <span className="font-black text-slate-800">{item.name}</span>
                      </p>
                    </div>
                  ))}
                </div>
              </td>

              {/* Delivery Info */}
              <td className="p-6">
                <p className="text-[10px] font-black text-slate-800 uppercase mb-1 underline decoration-blue-500 decoration-2">
                  {order.district}
                </p>
                <p className="text-[10px] font-bold text-slate-500 leading-tight max-w-[180px]">
                  {order.address}
                </p>
              </td>

              {/* Financials */}
              <td className="p-6 text-right">
                <p className="font-black text-sm text-slate-900">{Number(order.total).toLocaleString()}</p>
                <p className="text-[9px] font-bold text-green-600 uppercase">Fee: {Number(order.delivery_fee).toLocaleString()}</p>
              </td>

              {/* Status Management */}
              <td className="p-6">
                <div className="flex flex-col gap-2 items-center">
                <select 
  value={order.status}
  onChange={(e) => updateOrderStatus(order.id, e.target.value)}
  className={`w-full text-[9px] font-black uppercase px-3 py-2 rounded-xl outline-none cursor-pointer border-2 transition-all ${getStatusStyles(order.status)}`}
>
                    <option value="pending">Pending Receipt</option>
                    <option value="processing">Processing Order</option>
                    <option value="delivered">Completed/Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                  <button 
                    onClick={() => { if(window.confirm("Archive this order?")) deleteOrder(order.id) }}
                    className="text-[8px] font-bold text-slate-300 hover:text-red-500 uppercase tracking-tighter transition-colors"
                  >
                    Archive Order
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {orders.length === 0 && (
        <div className="py-32 text-center">
          <HiOutlineTruck className="mx-auto text-4xl text-slate-200 mb-4" />
          <p className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em]">No Active Logistics Found</p>
        </div>
      )}
    </div>
  </div>
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

         {/* REPAIR MANAGEMENT SECTION */}
{currentView === 'repair' && (
  <div className="grid lg:grid-cols-12 gap-8 h-[calc(100vh-160px)]">
    
    {/* LEFT COLUMN: User Repair Requests */}
<div className="lg:col-span-7 flex flex-col h-full">
  <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 flex flex-col h-full overflow-hidden">
    <div className="flex justify-between items-center mb-6">
      <div className="flex flex-col">
        <h2 className="text-xl font-black text-slate-800 uppercase tracking-tighter">
          Incoming Requests
        </h2>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Live Engineering Pipeline</p>
      </div>
      <span className="bg-amber-100 text-amber-600 px-3 py-1 rounded-full text-[10px] font-black uppercase">
        {(userRepairRequests || []).filter(r => r.type === 'user').length} Requests
      </span>
    </div>

    <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
      {(!userRepairRequests || userRepairRequests.filter(r => r.type === 'user').length === 0) ? (
        <div className="py-20 text-center text-slate-400 font-bold text-xs uppercase italic">No pending requests</div>
      ) : (
        userRepairRequests
          .filter(r => r.type === 'user')
          .map((r, idx) => (
          <div key={r.id || idx} className="bg-slate-50 border border-slate-100 p-5 rounded-[1.5rem] flex items-center justify-between group hover:border-blue-200 transition-all">
            <div className="flex items-center gap-4">
              <div className="h-14 w-14 rounded-xl bg-slate-200 overflow-hidden flex items-center justify-center border-2 border-white shadow-sm">
                {r.image ? (
                  <img 
                    src={`http://localhost:8000/storage/${r.image.replace(/^storage\//, "")}`} 
                    className="h-full w-full object-cover" 
                    alt="" 
                  />
                ) : (
                  <HiOutlineCog className="text-slate-400 animate-spin-slow" />
                )}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-black text-sm uppercase text-slate-800">{r.device}</p>
                  {/* NEW: TRACKING CODE BADGE */}
                  <span className="bg-blue-600 text-white px-2 py-0.5 rounded-md text-[9px] font-black tracking-widest shadow-sm">
                    {r.tracking_code || 'ITA-PENDING'}
                  </span>
                </div>
                <p className="text-[10px] font-bold text-slate-500 line-clamp-1">{r.issue}</p>
                <div className="mt-1 flex items-center gap-2">
                  <p className="text-[9px] font-black text-blue-500 uppercase tracking-tighter">
                    {r.name || 'Client'} • {r.phone || 'No Contact'}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col items-end gap-2">
              <select 
                value={r.status || 'pending'} 
                onChange={(e) => updateRepairStatus(r.id, e.target.value)}
                className={`text-[9px] font-black uppercase px-4 py-2.5 rounded-xl outline-none cursor-pointer border-none shadow-sm transition-all ${
                  r.status === 'completed' ? 'bg-green-500 text-white' : 'bg-slate-900 text-white'
                }`}
              >
                <option value="pending">Received</option>
                <option value="diagnosing">Diagnosis</option>
                <option value="repairing">Repairing</option>
                <option value="completed">Ready for Pickup</option>
              </select>
              <p className="text-[8px] font-bold text-slate-300 uppercase tracking-widest">Set Public Status</p>
            </div>
          </div>
        ))
      )}
    </div>
  </div>
</div>
    {/* RIGHT COLUMN: Repair Samples */}
    <div className="lg:col-span-5 flex flex-col gap-6 h-full overflow-hidden">
      
      {/* Form Area */}
      <div className="bg-slate-900 text-white p-8 rounded-[2.5rem] shadow-xl shrink-0">
        <h2 className="text-sm font-black uppercase tracking-widest mb-4 text-blue-400">Add Portfolio Piece</h2>
        <form onSubmit={handleRepairSubmit} className="space-y-3">
          <input 
            type="text" 
            placeholder="Device Name" 
            className="w-full bg-slate-800 border-none rounded-xl p-3 text-xs font-bold text-white outline-none" 
            value={repairForm.device} 
            onChange={(e) => setRepairForm({...repairForm, device: e.target.value})} 
          />
          <textarea 
            placeholder="The Solution" 
            className="w-full bg-slate-800 border-none rounded-xl p-3 text-xs font-bold text-white outline-none" 
            rows={2} 
            value={repairForm.issue} 
            onChange={(e) => setRepairForm({...repairForm, issue: e.target.value})} 
          />
          <div className="flex items-center gap-3">
            <input type="file" onChange={handleRepairImageChange} className="text-[10px] text-slate-400" />
            {repairPreview && <img src={repairPreview} className="h-10 w-10 rounded-lg object-cover" />}
          </div>
          <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-xl font-black uppercase text-[10px]">
            Upload Gallery
          </button>
        </form>
      </div>

      {/* Samples List */}
      <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 flex-1 overflow-hidden flex flex-col">
        <h2 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-4">Live Portfolio</h2>
        <div className="overflow-y-auto space-y-3 pr-2 custom-scrollbar">
          {/* Added Check for repairSamples existence */}
          {(repairSamples || [])
            .filter(sample => sample.type === 'sample')
            .map((sample) => (
            <div key={sample.id} className="flex items-center gap-3 p-2 rounded-2xl hover:bg-slate-50 transition-all group">
              <div className="h-12 w-12 rounded-xl bg-slate-100 overflow-hidden border border-slate-200">
                {sample.image && (
                  <img 
                    src={`http://localhost:8000/storage/${sample.image.replace(/^storage\//, "")}`} 
                    className="h-full w-full object-cover" 
                    alt="Portfolio"
                  />
                )}
              </div>
              <div className="flex-1">
                <p className="text-[11px] font-black text-slate-800 uppercase">{sample.device}</p>
                <p className="text-[9px] font-bold text-slate-400 line-clamp-1">{sample.issue}</p>
              </div>
              <button onClick={() => handleDeleteSample(sample.id)} className="text-slate-300 hover:text-red-500 p-2">
                <HiOutlineTrash size={14} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
)}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;