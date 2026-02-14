/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Sidebar from "./Sidebar";

const statusStyles = {
  pending:  "bg-yellow-100 text-yellow-800",
  accepted: "bg-green-100 text-green-800",
  rejected: "bg-red-100 text-red-800",
};

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [caterers, setCaterers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  // Track selected caterer per order
  const [selectedCaterer, setSelectedCaterer] = useState({});
  // Track rejection note per order
  const [rejectNote, setRejectNote] = useState({});
  // Track which order's reject input is open
  const [rejectOpen, setRejectOpen] = useState({});

  useEffect(() => {
    fetchOrders();
    fetchCaterers();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await axios.get("http://localhost:3000/orders/admin/all");
      setOrders(res.data.data || []);
    } catch (err) {
      toast.error("Failed to load orders.");
    } finally {
      setLoading(false);
    }
  };

  const fetchCaterers = async () => {
    try {
      const res = await axios.get("http://localhost:3000/admin/dashboard/catererList");
      setCaterers(res.data.data || []);
    } catch (err) {
      // no caterers yet is fine
    }
  };

  const handleAccept = async (orderId) => {
    const catererId = selectedCaterer[orderId];
    if (!catererId) {
      toast.error("Please select a caterer first!");
      return;
    }
    try {
      const res = await axios.patch(`http://localhost:3000/orders/${orderId}/accept`, { catererId });
      if (res.data.success) {
        toast.success("Order accepted & caterer assigned ✅");
        setOrders((prev) =>
          prev.map((o) => (o._id === orderId ? res.data.order : o))
        );
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to accept order.");
    }
  };

  const handleReject = async (orderId) => {
    const note = rejectNote[orderId] || "Order rejected by admin";
    try {
      const res = await axios.patch(`http://localhost:3000/orders/${orderId}/reject`, { note });
      if (res.data.success) {
        toast.success("Order rejected.");
        setOrders((prev) =>
          prev.map((o) => (o._id === orderId ? res.data.order : o))
        );
        setRejectOpen((prev) => ({ ...prev, [orderId]: false }));
      }
    } catch (err) {
      toast.error("Failed to reject order.");
    }
  };

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleString("en-IN", {
      day: "2-digit", month: "short", year: "numeric",
      hour: "2-digit", minute: "2-digit"
    });
  };

  const filtered = filter === "all" ? orders : orders.filter((o) => o.status === filter);

  const counts = {
    all: orders.length,
    pending: orders.filter((o) => o.status === "pending").length,
    accepted: orders.filter((o) => o.status === "accepted").length,
    rejected: orders.filter((o) => o.status === "rejected").length,
  };

  return (
    <div className="flex min-h-screen">
      <ToastContainer />
      <Sidebar />

      <div className="flex-1 bg-gray-50 p-6 overflow-y-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">📋 Manage Orders</h1>

        {/* Filter tabs */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {["all", "pending", "accepted", "rejected"].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-4 py-2 rounded-full text-sm font-semibold capitalize transition ${
                filter === tab
                  ? "bg-green-600 text-white"
                  : "bg-white border border-gray-300 text-gray-600 hover:bg-gray-100"
              }`}
            >
              {tab} ({counts[tab]})
            </button>
          ))}
        </div>

        {/* No caterers warning */}
        {caterers.length === 0 && (
          <div className="bg-orange-50 border border-orange-300 text-orange-700 rounded-lg p-3 mb-4 text-sm">
            ⚠️ No caterers added yet. Go to <strong>Caterer → Add Caterer</strong> to add one before accepting orders.
          </div>
        )}

        {loading ? (
          <p className="text-center text-gray-400 py-12">Loading orders...</p>
        ) : filtered.length === 0 ? (
          <p className="text-center text-gray-400 py-12">No {filter} orders found.</p>
        ) : (
          <div className="space-y-4">
            {filtered.map((order) => (
              <div key={order._id} className="bg-white rounded-xl shadow p-5">

                {/* Order header */}
                <div className="flex flex-wrap justify-between items-start gap-2 mb-3">
                  <div>
                    <p className="font-bold text-gray-800 text-lg">{order.userName}</p>
                    <p className="text-sm text-gray-500">ID: {order.userId}</p>
                    <p className="text-xs text-gray-400 font-mono">#{order._id.slice(-8).toUpperCase()}</p>
                    <p className="text-xs text-gray-400">{formatDate(order.createdAt)}</p>
                  </div>
                  <div className="text-right">
                    <span className={`text-xs font-bold px-3 py-1 rounded-full ${statusStyles[order.status]}`}>
                      {order.status.toUpperCase()}
                    </span>
                    <p className="text-xl font-extrabold text-green-600 mt-2">₹{order.totalPrice}</p>
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

                {/* Assigned caterer (accepted orders) */}
                {order.status === "accepted" && (
                  <div className="bg-green-50 rounded p-2 text-sm text-green-700 mb-3">
                    🍽️ Assigned to: <strong>{order.catererName}</strong>
                  </div>
                )}

                {/* Rejection note (rejected orders) */}
                {order.status === "rejected" && order.note && (
                  <div className="bg-red-50 rounded p-2 text-sm text-red-700 mb-3">
                    💬 Reason: {order.note}
                  </div>
                )}

                {/* Action area — only for pending orders */}
                {order.status === "pending" && (
                  <div className="border-t pt-3 mt-3">
                    {/* Caterer selector + Accept */}
                    <div className="flex flex-wrap gap-2 items-center mb-2">
                      <select
                        value={selectedCaterer[order._id] || ""}
                        onChange={(e) =>
                          setSelectedCaterer((prev) => ({ ...prev, [order._id]: e.target.value }))
                        }
                        className="border border-gray-300 rounded px-3 py-2 text-sm flex-1 min-w-[160px]"
                      >
                        <option value="">-- Select Caterer --</option>
                        {caterers.map((c) => (
                          <option key={c.caterer_id} value={c.caterer_id}>
                            {c.name} ({c.caterer_id})
                          </option>
                        ))}
                      </select>

                      <button
                        onClick={() => handleAccept(order._id)}
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded text-sm font-semibold"
                      >
                        ✅ Accept
                      </button>

                      <button
                        onClick={() =>
                          setRejectOpen((prev) => ({ ...prev, [order._id]: !prev[order._id] }))
                        }
                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded text-sm font-semibold"
                      >
                        ❌ Reject
                      </button>
                    </div>

                    {/* Rejection reason input */}
                    {rejectOpen[order._id] && (
                      <div className="flex gap-2 mt-2">
                        <input
                          type="text"
                          placeholder="Reason for rejection (optional)"
                          value={rejectNote[order._id] || ""}
                          onChange={(e) =>
                            setRejectNote((prev) => ({ ...prev, [order._id]: e.target.value }))
                          }
                          className="border border-red-300 rounded px-3 py-2 text-sm flex-1"
                        />
                        <button
                          onClick={() => handleReject(order._id)}
                          className="bg-red-600 text-white px-4 py-2 rounded text-sm font-semibold hover:bg-red-700"
                        >
                          Confirm Reject
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrdersPage;
