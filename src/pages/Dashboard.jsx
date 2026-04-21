import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { useOrderStore } from '../store/useOrderStore';
import { useRepairStore } from '../store/useRepairStore';
import { 
  HiOutlineShoppingBag, 
  HiOutlineClipboardCopy,
  HiOutlineRefresh, 
  HiOutlineStar, 
  HiOutlineUserCircle, 
  HiOutlineX, 
  HiOutlineChip,
  HiOutlineCheckCircle,
} from "react-icons/hi";

// --- SUB-COMPONENT: INDIVIDUAL REPAIR ITEM ---
const RepairItem = ({ repair }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = (code) => {
    if (!code) return;
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="group border border-slate-100 bg-slate-50/50 p-6 rounded-3xl hover:border-blue-200 hover:bg-white transition-all">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm text-slate-400 group-hover:text-blue-600 transition-colors">
            <HiOutlineChip size={24} />
          </div>
          <div>
            <h4 className="font-black text-slate-900 uppercase text-sm tracking-tight">{repair.device}</h4>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              Received: {new Date(repair.created_at).toLocaleDateString()}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 w-full md:w-auto">
          <div 
            onClick={() => handleCopy(repair.tracking_code)}
            className="bg-white border border-slate-200 px-4 py-2 rounded-xl text-center flex-1 md:flex-none cursor-pointer hover:border-blue-500 transition-all group/copy relative active:scale-95"
          >
            <p className="text-[9px] font-black text-slate-400 uppercase mb-0.5 group-hover/copy:text-blue-500 transition-colors">
              {copied ? 'Copied!' : 'Copy Code'}
            </p>
            <div className="flex items-center justify-center gap-2">
              <p className="text-sm font-black text-blue-600 tracking-widest font-mono">{repair.tracking_code || '---'}</p>
              {copied ? <HiOutlineCheckCircle className="text-green-500" size={16} /> : <HiOutlineClipboardCopy className="text-slate-300" size={16} />}
            </div>
          </div>
          
          <div className={`px-4 py-2 rounded-xl text-center min-w-[100px] flex-1 md:flex-none ${repair.status === 'completed' ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'}`}>
            <p className="text-[9px] font-black opacity-60 uppercase mb-0.5">Status</p>
            <p className="text-[10px] font-black uppercase">{repair.status}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- SUB-COMPONENT: INDIVIDUAL PURCHASE ITEM ---
const OrderItem = ({ order }) => (
  <div className="group border border-slate-100 bg-slate-50/50 p-6 rounded-3xl hover:border-blue-200 hover:bg-white transition-all">
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-start">
        <div>
          <h4 className="font-black text-blue-600 uppercase text-[10px] tracking-widest mb-1">{order.order_number || `#${order.id}`}</h4>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Date: {new Date(order.created_at).toLocaleDateString()}</p>
        </div>
        <div className={`px-3 py-1 rounded-full text-[9px] font-black uppercase ${order.status === 'delivered' ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'}`}>
          {order.status}
        </div>
      </div>
      <div className="space-y-2">
        {order.items?.map((item, i) => (
          <div key={i} className="flex justify-between items-center text-[11px] font-bold uppercase">
            <span className="text-slate-700">{item.quantity}x {item.product?.name || item.name}</span>
            <span className="text-slate-400">UGX {Number(item.price * item.quantity).toLocaleString()}</span>
          </div>
        ))}
      </div>
      <div className="pt-3 border-t border-slate-100 flex justify-between items-center font-black">
        <span className="text-[9px] text-slate-400 uppercase">Total Paid</span>
        <span className="text-sm text-slate-900 tracking-tighter">UGX {Number(order.total).toLocaleString()}</span>
      </div>
    </div>
  </div>
);

const Dashboard = () => {
  const { user, updateProfile } = useAuthStore();
  const { orders, fetchOrders } = useOrderStore();
  const { userRepairRequests, fetchUserRepairs, trackRepair } = useRepairStore();
  const navigate = useNavigate();

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isRepairModalOpen, setIsRepairModalOpen] = useState(false);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editForm, setEditForm] = useState({ name: user?.name || '', email: user?.email || '' });
  const [trackingId, setTrackingId] = useState("");
  const [trackedRepair, setTrackedRepair] = useState(null);
  const [searchError, setSearchError] = useState(false);

  useEffect(() => {
    fetchOrders();
    fetchUserRepairs();
  }, [fetchOrders, fetchUserRepairs]);

  // --- SEPARATION METHOD (LIKE ADMIN) ---
  const purchaseOrders = (orders || []).filter(order => order.order_number && order.items);
  const realUserRepairs = (userRepairRequests || []).filter(r => r.type === 'user');
  const activeRepairsList = realUserRepairs.filter(r => r.status !== 'completed');
  
  const totalStarPoints = (purchaseOrders.length + realUserRepairs.length) * 5;

  const stats = [
    { label: 'Total Purchases', value: purchaseOrders.length, icon: <HiOutlineShoppingBag />, color: 'bg-blue-50 text-blue-600', onClick: () => setIsOrderModalOpen(true) },
    { label: 'Active Repairs', value: activeRepairsList.length, icon: <HiOutlineRefresh />, color: 'bg-amber-50 text-amber-600', onClick: () => setIsRepairModalOpen(true) },
    { label: 'IT Stars', value: totalStarPoints, icon: <HiOutlineStar />, color: 'bg-purple-50 text-purple-600' },
  ];

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    const result = await updateProfile(editForm);
    if (result.success) setIsEditModalOpen(false);
    setIsSaving(false);
  };

  const handleTrack = async () => {
    if (!trackingId) return;
    const result = await trackRepair(trackingId);
    if (result) { setTrackedRepair(result); setSearchError(false); }
    else { setTrackedRepair(null); setSearchError(true); }
  };

  const steps = [
    { label: "Received", status: "pending" },
    { label: "Diagnosis", status: "diagnosing" },
    { label: "Repairing", status: "repairing" },
    { label: "Ready", status: "completed" }
  ];
  const getStepIndex = (status) => steps.findIndex(s => s.status === status);

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 font-sans">
      <div className="max-w-7xl mx-auto">
        
        <header className="mb-8 flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">Welcome back, {user?.name?.split(' ')[0] || 'Member'}</h1>
            <p className="text-slate-500 font-bold text-xs uppercase tracking-widest">Customer Portal • IT Arena</p>
          </div>
          <div className="h-12 w-12 rounded-2xl bg-white shadow-sm border border-slate-100 flex items-center justify-center text-slate-300">
             <HiOutlineUserCircle size={30} />
          </div>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {stats.map((stat) => (
            <div 
              key={stat.label} 
              onClick={() => stat.onClick && stat.onClick()}
              className="bg-white p-6 rounded-[2.5rem] border border-white shadow-sm transition-all cursor-pointer hover:scale-[1.02] active:scale-95"
            >
              <div className={`w-12 h-12 rounded-2xl ${stat.color} flex items-center justify-center text-2xl mb-4 shadow-sm`}>{stat.icon}</div>
              <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">{stat.label}</p>
              <p className="text-3xl font-black text-slate-900 tracking-tighter">{stat.value}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <section className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
              <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
                <h2 className="font-black text-slate-800 uppercase tracking-tight text-sm">Recent Purchase Orders</h2>
                <button onClick={() => setIsOrderModalOpen(true)} className="text-[10px] font-black text-blue-500 uppercase tracking-widest">View History</button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-slate-50/50">
                    <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      <th className="px-8 py-4">Order ID</th>
                      <th className="px-8 py-4">Products</th>
                      <th className="px-8 py-4">Status</th>
                      <th className="px-8 py-4 text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50 text-[10px] font-bold uppercase">
                    {purchaseOrders.length === 0 ? (
                      <tr><td colSpan="4" className="py-20 text-center text-slate-300 italic">No orders found</td></tr>
                    ) : (
                      purchaseOrders.slice(0, 5).map((order) => (
                        <tr key={order.id} className="hover:bg-slate-50/50">
                          <td className="px-8 py-5 text-blue-600 font-black tracking-widest">{order.order_number || `#${order.id}`}</td>
                          <td className="px-8 py-5">
                            {order.items?.map((item, i) => (
                              <div key={i}>{item.quantity}x {item.product?.name || item.name}</div>
                            ))}
                          </td>
                          <td className="px-8 py-5">
                            <span className={`px-2 py-1 rounded-full ${order.status === 'delivered' ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'}`}>{order.status}</span>
                          </td>
                          <td className="px-8 py-5 text-right font-black text-slate-900">UGX {Number(order.total).toLocaleString()}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </section>

            {/* Quick Lab Tracker */}
            <section className="bg-white border-2 border-slate-100 rounded-[2.5rem] overflow-hidden shadow-sm">
              <div className="bg-slate-900 p-6 text-white flex justify-between items-center">
                <h3 className="font-black uppercase tracking-widest text-[10px]">Quick Lab Tracker</h3>
              </div>
              <div className="p-8 flex flex-col lg:flex-row items-center gap-10">
                <div className="flex-1 w-full space-y-4">
                  <div className="flex gap-2">
                    <input 
                      type="text" placeholder="Enter ITA Code" value={trackingId}
                      onChange={(e) => setTrackingId(e.target.value.toUpperCase())}
                      className="flex-1 bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 font-bold outline-none" 
                    />
                    <button onClick={handleTrack} className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-black uppercase text-xs tracking-widest">Track</button>
                  </div>
                  {searchError && <p className="text-red-500 text-[10px] font-black uppercase tracking-widest">Code Not Found</p>}
                </div>
                <div className="flex-1 w-full grid grid-cols-4 gap-3">
                  {steps.map((step, i) => {
                    const activeRepair = trackedRepair || realUserRepairs[0];
                    const currentIndex = activeRepair ? getStepIndex(activeRepair.status) : -1;
                    const isDone = i <= currentIndex;
                    return (
                      <div key={i} className="text-center">
                        <div className={`h-2 rounded-full mb-3 ${isDone ? 'bg-blue-600' : 'bg-slate-100'}`}></div>
                        <p className={`text-[9px] font-black uppercase tracking-tighter ${isDone ? 'text-blue-600' : 'text-slate-300'}`}>{step.label}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </section>
          </div>

          <div className="space-y-6">
            <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
              <h3 className="font-black text-slate-400 uppercase tracking-widest text-[10px] mb-6">Account Control</h3>
              <div className="space-y-3">
                <button onClick={() => setIsEditModalOpen(true)} className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest">Edit Profile</button>
                <button onClick={() => setIsRepairModalOpen(true)} className="w-full bg-blue-50 text-blue-600 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest">View Repair Codes</button>
                <a href="https://wa.me/256777122972" className="block text-center w-full bg-green-500 text-white py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest">WhatsApp Expert</a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* --- PURCHASE RECORDS POPUP --- */}
      {isOrderModalOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md">
          <div className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl relative overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="bg-blue-600 p-8 text-white flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-black uppercase tracking-tighter">Order History</h2>
                <p className="text-blue-200 text-[10px] font-black uppercase tracking-widest">Your Inventory Records</p>
              </div>
              <button onClick={() => setIsOrderModalOpen(false)} className="bg-white/10 hover:bg-red-500 w-10 h-10 rounded-full flex items-center justify-center transition-colors">
                <HiOutlineX size={20} />
              </button>
            </div>
            <div className="p-8 max-h-[60vh] overflow-y-auto custom-scrollbar">
              {purchaseOrders.length > 0 ? (
                <div className="space-y-4">
                  {purchaseOrders.map((order) => (
                    <OrderItem key={order.id} order={order} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-20 text-slate-400 font-bold uppercase text-xs italic">No orders found in your history.</div>
              )}
            </div>
            <div className="p-8 bg-slate-50 border-t border-slate-100 flex justify-end">
              <button onClick={() => setIsOrderModalOpen(false)} className="text-slate-900 font-black uppercase tracking-widest text-[10px] hover:text-blue-600">Close History</button>
            </div>
          </div>
        </div>
      )}

      {/* --- REPAIR RECORDS POPUP --- */}
      {isRepairModalOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md">
          <div className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl relative overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="bg-slate-900 p-8 text-white flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-black uppercase tracking-tighter">Repair Records</h2>
                <p className="text-blue-400 text-[10px] font-black uppercase tracking-widest">Service History</p>
              </div>
              <button onClick={() => setIsRepairModalOpen(false)} className="bg-white/10 hover:bg-red-500 w-10 h-10 rounded-full flex items-center justify-center transition-colors">
                <HiOutlineX size={20} />
              </button>
            </div>
            <div className="p-8 max-h-[60vh] overflow-y-auto custom-scrollbar">
              {realUserRepairs.length > 0 ? (
                <div className="space-y-4">
                  {realUserRepairs.map((repair) => (
                    <RepairItem key={repair.id} repair={repair} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-10 text-slate-400 font-bold uppercase text-xs italic">No repair records found.</div>
              )}
            </div>
            <div className="p-8 bg-slate-50 border-t border-slate-100 flex justify-between items-center text-[10px] font-bold uppercase">
              <p>Support: +256 777122972</p>
              <button onClick={() => setIsRepairModalOpen(false)} className="text-slate-900 font-black uppercase tracking-widest">Close</button>
            </div>
          </div>
        </div>
      )}

      {/* --- EDIT PROFILE MODAL --- */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
          <div className="bg-white w-full max-w-md rounded-[2.5rem] p-10 relative animate-in zoom-in-95">
            <button onClick={() => setIsEditModalOpen(false)} className="absolute top-8 right-8 text-slate-300 hover:text-red-500"><HiOutlineX size={24} /></button>
            <h2 className="text-2xl font-black uppercase tracking-tighter mb-6">Update Profile</h2>
            <form onSubmit={handleEditSubmit} className="space-y-6">
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Full Name</label>
                <input type="text" required className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 font-bold outline-none" value={editForm.name} onChange={(e) => setEditForm({...editForm, name: e.target.value})} />
              </div>
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Email Address</label>
                <input type="email" required className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 font-bold outline-none" value={editForm.email} onChange={(e) => setEditForm({...editForm, email: e.target.value})} />
              </div>
              <button disabled={isSaving} className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black uppercase text-xs tracking-widest">{isSaving ? "Saving..." : "Save Changes"}</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;