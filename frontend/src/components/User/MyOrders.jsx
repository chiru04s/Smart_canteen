/* eslint-disable no-unused-vars */
import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../../AppContext";
import { Link } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const statusStyles = {
  pending:  "bg-yellow-100 text-yellow-800 border-yellow-300",
  accepted: "bg-green-100 text-green-800 border-green-300",
  rejected: "bg-red-100 text-red-800 border-red-300",
};

const statusIcons = {
  pending:  "⏳",
  accepted: "✅",
  rejected: "❌",
};

const MyOrders = () => {
  const { user } = useContext(AppContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) return;
    const fetchOrders = async () => {
      try {
        const res = await axios.get(`http://localhost:3000/orders/user/${user.id}`);
        setOrders(res.data.data || []);
      } catch (err) {
        toast.error("Could not load your orders.");
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [user]);

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleString("en-IN", {
      day: "2-digit", month: "short", year: "numeric",
      hour: "2-digit", minute: "2-digit"
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <ToastContainer />

      <nav className="flex justify-between items-center p-4 bg-white shadow">
        <img src="logo.png" alt="Logo" className="w-8 h-8" />
        <span className="font-semibold text-gray-700">My Orders</span>
        <Link to="/home" className="text-blue-600 text-sm">← Back to Menu</Link>
      </nav>

      <div className="max-w-2xl mx-auto mt-8 p-4">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          My Orders {user && <span className="text-gray-400 text-base font-normal">({user.name})</span>}
        </h1>

        {loading ? (
          <p className="text-center text-gray-400 py-12">Loading your orders...</p>
        ) : orders.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-400 text-lg mb-4">No orders placed yet.</p>
            <Link to="/home">
              <button className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700">
                Browse Menu
              </button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order._id} className="bg-white rounded-lg shadow p-4">

                {/* Order header */}
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <p className="text-xs text-gray-400">{formatDate(order.createdAt)}</p>
                    <p className="text-xs text-gray-400 font-mono">#{order._id.slice(-8).toUpperCase()}</p>
                  </div>
                  <span className={`text-xs font-bold px-3 py-1 rounded-full border ${statusStyles[order.status]}`}>
                    {statusIcons[order.status]} {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </span>
                </div>

                {/* Items */}
                <div className="space-y-1 mb-3">
                  {order.items.map((item, i) => (
                    <div key={i} className="flex justify-between text-sm text-gray-700">
                      <span>{item.name} × {item.quantity}</span>
                      <span>₹{item.price * item.quantity}</span>
                    </div>
                  ))}
                </div>

                {/* Total */}
                <div className="flex justify-between font-bold text-gray-800 border-t pt-2">
                  <span>Total</span>
                  <span className="text-green-600">₹{order.totalPrice}</span>
                </div>

                {/* Caterer info (accepted) */}
                {order.status === "accepted" && order.catererName && (
                  <div className="mt-2 bg-green-50 rounded p-2 text-sm text-green-700">
                    🍽️ Being prepared by: <strong>{order.catererName}</strong>
                  </div>
                )}

                {/* Rejection note */}
                {order.status === "rejected" && order.note && (
                  <div className="mt-2 bg-red-50 rounded p-2 text-sm text-red-700">
                    💬 Reason: {order.note}
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

export default MyOrders;
