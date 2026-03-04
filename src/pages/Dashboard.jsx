import React from 'react';
import { useAuthStore } from '../store/useAuthStore'; // Your Zustand store

const Dashboard = () => {
  const { user } = useAuthStore();

  const stats = [
    { label: 'Total Orders', value: '12', icon: '📦' },
    { label: 'Active Repairs', value: '1', icon: '🔧' },
    { label: 'IT Points', value: '450', icon: '⭐' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Welcome back, {user?.name || 'Customer'}</h1>
          <p className="text-gray-600">Manage your orders, repairs, and account settings.</p>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {stats.map((stat) => (
            <div key={stat.label} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="text-2xl mb-2">{stat.icon}</div>
              <div className="text-gray-500 text-sm font-medium uppercase">{stat.label}</div>
              <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content: Recent Orders */}
          <div className="lg:col-span-2 space-y-8">
            <section className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                <h2 className="font-bold text-gray-800">Recent Orders</h2>
                <button className="text-blue-600 text-sm font-semibold hover:underline">View All</button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
                    <tr>
                      <th className="px-6 py-3">Order ID</th>
                      <th className="px-6 py-3">Date</th>
                      <th className="px-6 py-3">Status</th>
                      <th className="px-6 py-3">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    <tr>
                      <td className="px-6 py-4 font-medium">#ITA-8821</td>
                      <td className="px-6 py-4 text-gray-600">Oct 24, 2023</td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">Delivered</span>
                      </td>
                      <td className="px-6 py-4 font-bold">UGX 450,000</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            {/* Unique Section: Repair Tracking */}
            <section className="bg-blue-900 text-white rounded-xl p-6 shadow-lg">
              <h2 className="font-bold text-xl mb-2 text-white">Repair Tracking</h2>
              <p className="text-blue-100 mb-4">Live status for your device repair (ID: ITA-9921)</p>
              <div className="flex items-center space-x-4">
                <div className="flex-1 bg-blue-800 h-2 rounded-full overflow-hidden">
                  <div className="bg-blue-400 h-full w-2/3"></div>
                </div>
                <span className="text-sm font-bold text-white">65% Complete</span>
              </div>
              <p className="mt-4 text-xs text-blue-200 uppercase tracking-widest font-bold">Stage: OEM Part Installation</p>
            </section>
          </div>

          {/* Sidebar: Quick Actions */}
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h3 className="font-bold text-gray-800 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button className="w-full bg-gray-900 text-white py-2 rounded-lg font-medium hover:bg-gray-800 transition">Edit Profile</button>
                <button className="w-full border border-gray-200 text-gray-700 py-2 rounded-lg font-medium hover:bg-gray-50 transition">Track Warranty</button>
                <a 
                  href="https://wa.me/256777122972" 
                  className="block text-center w-full bg-green-500 text-white py-2 rounded-lg font-medium hover:bg-green-600 transition"
                >
                  Chat with an Expert
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;