import React, { useEffect, useState, useMemo } from 'react';
import { useProductStore } from '../store/useProductStore';
import api from '../api/axios'; // Assuming your axios instance is here

const AdminDashboard = () => {
  const { products, fetchProducts, addProduct, deleteProduct } = useProductStore();
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  // NEW STATES FOR NAVIGATION & DATA
  const [currentView, setCurrentView] = useState('inventory'); // inventory, users, orders
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([
    { id: "ORD-101", customer: "Musa Chen", item: "iPhone Screen", status: "Processing" },
    { id: "ORD-102", customer: "Sarah K.", item: "HP Battery", status: "Shipped" }
  ]);

  const categoryData = {
    "Phones": ["Apple", "Samsung", "Google", "Infinix", "Tecno"],
    "Laptops": ["MacBook", "Dell", "HP", "Lenovo", "ASUS"],
    "Desktops": ["iMac", "Dell OptiPlex", "HP Pavilion", "Custom Build"],
    "Chargers": ["Type-C 65W", "MagSafe", "Micro-USB", "Laptop Bricks"],
    "Spare Parts": ["OLED Screens", "Batteries", "Charging Ports", "Keyboards"]
  };

  const [formData, setFormData] = useState({
    name: '', category: '', brand: '', price: '', stock: '', isOEM: true, description: '', image: null
  });

  // FETCH PRODUCTS AND USERS
  useEffect(() => { 
    fetchProducts();
    fetchUsers(); 
  }, []);

  const fetchUsers = async () => {
    try {
      // This now matches the Route::get('/users') we just added
      const { data } = await api.get('/users'); 
      setUsers(data);
    } catch (error) {
      console.error("Error fetching users:", error.response?.data || error.message);
    }
  };

  const updateTracking = (id, newStatus) => {
    setOrders(orders.map(o => o.id === id ? { ...o, status: newStatus } : o));
  };

  const analytics = useMemo(() => {
    const totalValue = products.reduce((acc, p) => acc + (Number(p.price) * Number(p.stock)), 0);
    const totalUnits = products.reduce((acc, p) => acc + Number(p.stock), 0);
    const outOfStock = products.filter(p => Number(p.stock) === 0).length;
    const lowStock = products.filter(p => Number(p.stock) > 0 && Number(p.stock) <= 5).length;
    const catTotals = products.reduce((acc, p) => {
      acc[p.category] = (acc[p.category] || 0) + (Number(p.price) * Number(p.stock));
      return acc;
    }, {});
    const topCategory = Object.entries(catTotals).sort((a, b) => b[1] - a[1])[0]?.[0] || "N/A";
    return { totalValue, totalUnits, outOfStock, lowStock, topCategory };
  }, [products]);

  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            p.brand.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCat = activeCategory === "All" || p.category === activeCategory;
      return matchesSearch && matchesCat;
    });
  }, [products, searchTerm, activeCategory]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addProduct(formData);
      setShowModal(false);
      setFormData({ name: '', category: '', brand: '', price: '', stock: '', isOEM: true, description: '', image: null });
    } catch (error) { console.error(error); }
  };

  return (
    <div className="flex h-screen bg-[#f1f5f9] font-sans text-slate-900 overflow-hidden">
      
      {/* SIDEBAR */}
      <aside className="w-64 bg-slate-950 text-white p-6 flex flex-col border-r border-slate-800">
        <div className="mb-10 px-2">
          <h1 className="text-xl font-black text-blue-500 italic tracking-tighter">IT ARENA SYSTEMS</h1>
          <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest mt-1">Real-time Analytics On</p>
        </div>
        
        <nav className="space-y-1 flex-1">
          <button 
            onClick={() => setCurrentView('inventory')}
            className={`w-full flex items-center gap-3 text-left font-bold text-sm p-3 rounded-xl transition ${currentView === 'inventory' ? 'bg-blue-600/10 text-blue-500' : 'text-slate-500 hover:bg-slate-900'}`}
          >
            Inventory Control
          </button>
          <button 
            onClick={() => setCurrentView('orders')}
            className={`w-full flex items-center gap-3 text-left font-bold text-sm p-3 rounded-xl transition ${currentView === 'orders' ? 'bg-blue-600/10 text-blue-500' : 'text-slate-500 hover:bg-slate-900'}`}
          >
            Orders & Tracking
          </button>
          <button 
            onClick={() => setCurrentView('users')}
            className={`w-full flex items-center gap-3 text-left font-bold text-sm p-3 rounded-xl transition ${currentView === 'users' ? 'bg-blue-600/10 text-blue-500' : 'text-slate-500 hover:bg-slate-900'}`}
          >
            User Management
          </button>
        </nav>

        <div className="mt-auto p-4 bg-slate-900 rounded-2xl border border-slate-800">
            <p className="text-[10px] text-slate-500 font-bold uppercase mb-1">Top Asset Class</p>
            <p className="text-sm font-black text-white">{analytics.topCategory}</p>
        </div>
      </aside>

      <main className="flex-1 flex flex-col overflow-hidden">
        
        <header className="px-8 py-5 bg-white border-b flex justify-between items-center z-20">
          <div className="flex items-center gap-6">
            <h2 className="text-xl font-black text-slate-800 capitalize">{currentView} Hub</h2>
            <input 
              type="text" 
              placeholder="Search..." 
              className="bg-slate-100 border-none rounded-xl py-2 px-5 w-64 text-xs font-medium focus:ring-2 focus:ring-blue-500 transition"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          {currentView === 'inventory' && (
            <button onClick={() => setShowModal(true)} className="bg-blue-600 text-white px-6 py-2.5 rounded-xl text-xs font-black shadow-lg shadow-blue-100 hover:bg-blue-700 transition">
              + REGISTER ASSET
            </button>
          )}
        </header>

        <div className="flex-1 overflow-y-auto p-8 pt-4">
          
          {/* --- INVENTORY VIEW --- */}
          {currentView === 'inventory' && (
            <>
              <div className="grid grid-cols-4 gap-4 mb-8">
                <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm">
                  <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Portfolio Equity</p>
                  <h3 className="text-xl font-black">UGX {analytics.totalValue.toLocaleString()}</h3>
                </div>
                <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm">
                  <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Total Units</p>
                  <h3 className="text-xl font-black">{analytics.totalUnits.toLocaleString()}</h3>
                </div>
                <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm">
                  <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Stock Alerts</p>
                  <h3 className={`text-xl font-black ${analytics.lowStock > 0 ? 'text-orange-500' : 'text-slate-900'}`}>{analytics.lowStock}</h3>
                </div>
                <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm border-l-4 border-l-red-500">
                  <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Dead Inventory</p>
                  <h3 className="text-xl font-black text-red-600">{analytics.outOfStock}</h3>
                </div>
              </div>

              <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 border-b border-slate-100">
                    <tr>
                      <th className="p-4 text-[10px] font-black text-slate-400 uppercase">Product Image & Name</th>
                      <th className="p-4 text-[10px] font-black text-slate-400 uppercase text-center">In Stock</th>
                      <th className="p-4 text-[10px] font-black text-slate-400 uppercase text-right">Unit Price</th>
                      <th className="p-4 text-[10px] font-black text-slate-400 uppercase text-right">Total Worth</th>
                      <th className="p-4 text-[10px] font-black text-slate-400 uppercase text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredProducts.map((p) => (
                      <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                        <td className="p-4 flex items-center gap-3">
                          <img src={p.image} className="w-10 h-10 rounded-lg object-contain bg-slate-50 p-1 border border-slate-100" />
                          <div>
                            <p className="font-bold text-xs text-slate-800">{p.name}</p>
                            <p className="text-[9px] font-black text-blue-500 uppercase">{p.brand}</p>
                          </div>
                        </td>
                        <td className="p-4 text-center font-black text-xs">{p.stock}</td>
                        <td className="p-4 text-right text-xs">UGX {Number(p.price).toLocaleString()}</td>
                        <td className="p-4 text-right text-xs font-black">UGX {(Number(p.price) * Number(p.stock)).toLocaleString()}</td>
                        <td className="p-4 text-center">
                          <button onClick={() => deleteProduct(p.id)} className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition">
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}

          {/* --- ORDERS VIEW --- */}
          {currentView === 'orders' && (
            <div className="bg-white rounded-[2rem] border border-slate-200 p-6">
              <h3 className="font-black mb-4">Order Tracking System</h3>
              <table className="w-full text-left">
                <thead className="bg-slate-50">
                  <tr className="text-[10px] font-black text-slate-400 uppercase">
                    <th className="p-4">ID</th>
                    <th className="p-4">Customer</th>
                    <th className="p-4">Current Status</th>
                    <th className="p-4">Update Tracking</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map(o => (
                    <tr key={o.id} className="border-t border-slate-100">
                      <td className="p-4 text-xs font-bold">{o.id}</td>
                      <td className="p-4 text-xs">{o.customer}</td>
                      <td className="p-4 text-[10px] font-black uppercase text-blue-500">{o.status}</td>
                      <td className="p-4">
                        <select 
                          onChange={(e) => updateTracking(o.id, e.target.value)}
                          className="text-[10px] font-black bg-slate-100 border-none rounded-lg p-2"
                        >
                          <option value="Processing">Processing</option>
                          <option value="Shipped">Shipped</option>
                          <option value="Delivered">Delivered</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* --- USERS VIEW (LIST MODE) --- */}
{currentView === 'users' && (
  <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-2">
    <table className="w-full text-left border-collapse">
      <thead className="bg-slate-50 border-b border-slate-100">
        <tr>
          <th className="p-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">User</th>
          <th className="p-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Email Address</th>
          <th className="p-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Status</th>
          <th className="p-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-slate-50">
        {users.length > 0 ? users.map((u) => (
          <tr key={u.id} className="hover:bg-slate-50/80 transition-colors group">
            <td className="p-4">
              <div className="flex items-center gap-3">
                {/* Compact Circular Avatar */}
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-[10px] font-black text-white shadow-sm">
                  {u.name?.charAt(0).toUpperCase()}
                </div>
                <span className="font-bold text-xs text-slate-800">{u.name}</span>
              </div>
            </td>
            
            <td className="p-4 text-xs font-medium text-slate-500">
              {u.email}
            </td>

            <td className="p-4 text-center">
              <span className="bg-green-100 text-green-600 px-3 py-1 rounded-md text-[9px] font-black uppercase tracking-tighter">
                Active
              </span>
            </td>

            <td className="p-4 text-right">
              <button className="text-[10px] font-black text-slate-400 hover:text-blue-600 transition uppercase tracking-tighter px-3 py-1">
                Edit Role
              </button>
              <button className="text-[10px] font-black text-slate-400 hover:text-red-600 transition uppercase tracking-tighter px-3 py-1">
                Revoke
              </button>
            </td>
          </tr>
        )) : (
          <tr>
            <td colSpan="4" className="p-20 text-center text-slate-400 italic text-sm">
              No staff members found in the database.
            </td>
          </tr>
        )}
      </tbody>
    </table>
  </div>
)}

        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;