import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

const STATUS_FLOW = {
  accepted:  { next: "preparing", label: "Start Preparing 🔥",   color: "bg-blue-600"  },
  preparing: { next: "ready",     label: "Mark as Ready ✅",      color: "bg-green-600" },
  ready:     { next: "delivered", label: "Mark Delivered 🎉",     color: "bg-purple-600"},
  delivered: { next: null,        label: "Delivered",             color: "bg-gray-400"  },
};

const STATUS_BADGE = {
  accepted:  "bg-yellow-100 text-yellow-800",
  preparing: "bg-blue-100   text-blue-800",
  ready:     "bg-green-100  text-green-800",
  delivered: "bg-gray-100   text-gray-600",
};

const PAYMENT_ICON = { cash: "💵", upi: "📱", wallet: "👛" };

export default function CatererDashboard() {
  const navigate  = useNavigate();
  const catererRaw = localStorage.getItem("catererInfo");
  const caterer   = catererRaw ? JSON.parse(catererRaw) : null;

  const [orders,       setOrders]       = useState([]);
  const [earnings,     setEarnings]     = useState(null);
  const [isAvailable,  setIsAvailable]  = useState(true);
  const [activeTab,    setActiveTab]    = useState("active");
  const [loading,      setLoading]      = useState(true);
  const [updatingId,   setUpdatingId]   = useState(null);

  // redirect if not logged in
  useEffect(() => {
    if (!caterer) navigate("/caterer/login");
  }, []);

  const fetchData = useCallback(async () => {
    if (!caterer) return;
    try {
      const [ordersRes, earningsRes] = await Promise.all([
        axios.get(`http://localhost:3000/caterer/${caterer.caterer_id}/orders`),
        axios.get(`http://localhost:3000/caterer/${caterer.caterer_id}/earnings`),
      ]);
      setOrders(ordersRes.data.data || []);
      setEarnings(earningsRes.data.data);
    } catch (err) {
      toast.error("Could not load data.");
    } finally {
      setLoading(false);
    }
  }, [caterer]);

  useEffect(() => { fetchData(); }, [fetchData]);

  // Auto-refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, [fetchData]);

  const handleStatusUpdate = async (orderId, nextStatus) => {
    setUpdatingId(orderId);
    try {
      const res = await axios.patch(
        `http://localhost:3000/caterer/orders/${orderId}/status`,
        { status: nextStatus }
      );
      if (res.data.success) {
        toast.success(`Order marked as "${nextStatus}" ✅`);
        fetchData();
      }
    } catch (err) {
      toast.error("Failed to update order status.");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleToggleAvailability = async () => {
    try {
      const res = await axios.patch(
        `http://localhost:3000/caterer/${caterer.caterer_id}/availability`
      );
      setIsAvailable(res.data.isAvailable);
      toast.success(res.data.isAvailable ? "You are now Available ✅" : "You are now Unavailable ❌");
    } catch (err) {
      toast.error("Could not update availability.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("catererToken");
    localStorage.removeItem("catererInfo");
    navigate("/caterer/login");
  };

  const formatDate = (d) => new Date(d).toLocaleString("en-IN", {
    day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit"
  });

  const active    = orders.filter(o => ["accepted","preparing","ready"].includes(o.status));
  const completed = orders.filter(o => o.status === "delivered");
  const shown     = activeTab === "active" ? active : completed;

  if (!caterer) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <ToastContainer />

      {/* ── Top Nav ─────────────────────────────────────────────────────── */}
      <nav className="bg-orange-500 text-white px-4 py-3 flex justify-between items-center shadow">
        <div className="flex items-center gap-3">
          <span className="text-2xl">🍽️</span>
          <div>
            <p className="font-bold text-lg leading-none">{caterer.name}</p>
            <p className="text-xs text-orange-100">ID: {caterer.caterer_id}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {/* Availability toggle */}
          <button
            onClick={handleToggleAvailability}
            className={`text-xs font-bold px-3 py-1 rounded-full border-2 border-white transition ${
              isAvailable ? "bg-white text-orange-600" : "bg-orange-600 text-white"
            }`}
          >
            {isAvailable ? "🟢 Available" : "🔴 Busy"}
          </button>
          <button onClick={handleLogout} className="text-xs bg-orange-700 px-3 py-1 rounded-full hover:bg-orange-800">
            Logout
          </button>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto p-4">

        {/* ── Earnings Cards ──────────────────────────────────────────────── */}
        {earnings && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6 mt-4">
            {[
              { label: "Today's Earnings", value: `₹${earnings.todayEarnings}`,  color: "bg-green-500"  },
              { label: "Today's Orders",   value: earnings.todayOrders,           color: "bg-blue-500"   },
              { label: "Total Earnings",   value: `₹${earnings.totalEarnings}`,  color: "bg-purple-500" },
              { label: "Total Delivered",  value: earnings.totalOrders,           color: "bg-orange-500" },
            ].map((card) => (
              <div key={card.label} className={`${card.color} text-white rounded-xl p-4 text-center shadow`}>
                <p className="text-2xl font-extrabold">{card.value}</p>
                <p className="text-xs mt-1 text-white/80">{card.label}</p>
              </div>
            ))}
          </div>
        )}

        {/* ── Commission note ──────────────────────────────────────────── */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4 text-xs text-yellow-700">
          💡 You earn <strong>10% commission</strong> on each delivered order.
        </div>

        {/* ── Tabs ────────────────────────────────────────────────────────── */}
        <div className="flex gap-2 mb-4">
          {[
            { key: "active",    label: `Active Orders (${active.length})`    },
            { key: "completed", label: `Completed (${completed.length})`     },
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex-1 py-2 rounded-lg text-sm font-semibold transition ${
                activeTab === tab.key ? "bg-orange-500 text-white" : "bg-white border border-gray-300 text-gray-600"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* ── Order Cards ──────────────────────────────────────────────────── */}
        {loading ? (
          <p className="text-center text-gray-400 py-12">Loading orders...</p>
        ) : shown.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <p className="text-4xl mb-3">{activeTab === "active" ? "🎉" : "📭"}</p>
            <p>{activeTab === "active" ? "No active orders right now." : "No completed orders yet."}</p>
          </div>
        ) : (
          <div className="space-y-4">
            {shown.map((order) => {
              const flow = STATUS_FLOW[order.status];
              const commission = Math.round(order.totalPrice * 0.10);
              return (
                <div key={order._id} className="bg-white rounded-xl shadow p-4">
                  {/* Header */}
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <p className="font-bold text-gray-800">{order.userName}</p>
                      <p className="text-xs text-gray-400">#{order._id.slice(-8).toUpperCase()}</p>
                      <p className="text-xs text-gray-400">{formatDate(order.createdAt)}</p>
                    </div>
                    <div className="text-right">
                      <span className={`text-xs font-bold px-2 py-1 rounded-full ${STATUS_BADGE[order.status]}`}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                      <p className="text-sm mt-1">
                        {PAYMENT_ICON[order.paymentMode]} {order.paymentMode?.toUpperCase()}
                      </p>
                    </div>
                  </div>

                  {/* Items */}
                  <div className="bg-gray-50 rounded-lg p-3 mb-3 space-y-1">
                    {order.items.map((item, i) => (
                      <div key={i} className="flex justify-between text-sm text-gray-700">
                        <span>{item.name} × {item.quantity}</span>
                        <span>₹{item.price * item.quantity}</span>
                      </div>
                    ))}
                  </div>

                  {/* Footer */}
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-bold text-gray-800">₹{order.totalPrice}</p>
                      {order.status === "delivered" && (
                        <p className="text-xs text-green-600 font-semibold">+₹{commission} earned</p>
                      )}
                    </div>
                    {flow && flow.next && (
                      <button
                        onClick={() => handleStatusUpdate(order._id, flow.next)}
                        disabled={updatingId === order._id}
                        className={`${flow.color} text-white text-sm font-bold px-4 py-2 rounded-lg hover:opacity-90 disabled:opacity-60 transition`}
                      >
                        {updatingId === order._id ? "Updating..." : flow.label}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Refresh button */}
        <div className="text-center mt-6">
          <button onClick={fetchData} className="text-orange-500 text-sm hover:underline">
            🔄 Refresh Orders
          </button>
        </div>
      </div>
    </div>
  );
}
