import React, { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "./Sidebar";

export default function Sales() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL}/orders/admin/stats`)
      .then(r => setStats(r.data.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const cards = stats ? [
    { label: "Total Revenue",    value: `₹${stats.totalRevenue}`,    color: "bg-green-500",  icon: "💰" },
    { label: "Today's Revenue",  value: `₹${stats.todayRevenue}`,    color: "bg-blue-500",   icon: "📅" },
    { label: "Total Orders",     value: stats.totalOrders,           color: "bg-purple-500", icon: "📋" },
    { label: "Delivered Today",  value: stats.todayOrders,           color: "bg-orange-500", icon: "📦" },
    { label: "Pending Orders",   value: stats.pendingOrders,         color: "bg-yellow-500", icon: "⏳" },
    { label: "Total Caterers",   value: stats.totalCaterers,         color: "bg-red-500",    icon: "👨‍🍳" },
  ] : [];

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 bg-gray-50 p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">📊 Sales Dashboard</h1>

        {loading ? (
          <p className="text-gray-400">Loading stats...</p>
        ) : !stats ? (
          <p className="text-gray-400">No data available yet. Place and deliver some orders first.</p>
        ) : (
          <>
            {/* Stat Cards */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
              {cards.map(c => (
                <div key={c.label} className={`${c.color} text-white rounded-xl p-5 shadow`}>
                  <div className="text-3xl mb-1">{c.icon}</div>
                  <p className="text-2xl font-extrabold">{c.value}</p>
                  <p className="text-sm text-white/80">{c.label}</p>
                </div>
              ))}
            </div>

            {/* Payment breakdown */}
            <div className="bg-white rounded-xl shadow p-5 mb-6">
              <h2 className="text-lg font-bold text-gray-700 mb-4">💳 Revenue by Payment Mode</h2>
              <div className="space-y-3">
                {[
                  { key:"cash",   label:"Cash",   icon:"💵", color:"bg-green-400"  },
                  { key:"upi",    label:"UPI",    icon:"📱", color:"bg-blue-400"   },
                  { key:"wallet", label:"Wallet", icon:"👛", color:"bg-purple-400" },
                ].map(p => {
                  const amt   = stats.byPayment[p.key] || 0;
                  const pct   = stats.totalRevenue > 0 ? Math.round((amt/stats.totalRevenue)*100) : 0;
                  return (
                    <div key={p.key}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="font-medium text-gray-700">{p.icon} {p.label}</span>
                        <span className="font-bold text-gray-800">₹{amt} ({pct}%)</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className={`${p.color} h-2 rounded-full transition-all`} style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Delivered vs Total */}
            <div className="bg-white rounded-xl shadow p-5">
              <h2 className="text-lg font-bold text-gray-700 mb-3">📈 Fulfillment Rate</h2>
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Delivered / Total</span>
                    <span className="font-bold">{stats.deliveredOrders} / {stats.totalOrders}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div className="bg-green-500 h-3 rounded-full"
                      style={{ width: stats.totalOrders > 0 ? `${Math.round((stats.deliveredOrders/stats.totalOrders)*100)}%` : "0%" }} />
                  </div>
                </div>
                <span className="text-2xl font-extrabold text-green-600">
                  {stats.totalOrders > 0 ? Math.round((stats.deliveredOrders/stats.totalOrders)*100) : 0}%
                </span>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
