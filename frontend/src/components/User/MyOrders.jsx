/* eslint-disable no-unused-vars */
import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../../AppContext";
import { Link } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const STATUS_STEPS = ["pending","accepted","preparing","ready","delivered"];

const STATUS_STYLE = {
  pending:   "bg-yellow-100 text-yellow-800 border-yellow-300",
  accepted:  "bg-blue-100   text-blue-800   border-blue-300",
  preparing: "bg-orange-100 text-orange-800 border-orange-300",
  ready:     "bg-green-100  text-green-800  border-green-300",
  delivered: "bg-gray-100   text-gray-600   border-gray-300",
  rejected:  "bg-red-100    text-red-700    border-red-300",
};

const STATUS_EMOJI = { pending:"⏳", accepted:"✅", preparing:"🔥", ready:"🎉", delivered:"📦", rejected:"❌" };
const PAYMENT_ICON = { cash:"💵", upi:"📱", wallet:"👛" };

export default function MyOrders() {
  const { user, t } = useContext(AppContext);
  const [orders,  setOrders]  = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter,  setFilter]  = useState("all");

  useEffect(() => {
    if (!user?.id) return;
    axios.get(`${import.meta.env.VITE_API_URL}/orders/user/${user.id}`)
      .then(r => setOrders(r.data.data || []))
      .catch(() => toast.error("Could not load orders."))
      .finally(() => setLoading(false));
  }, [user]);

  const formatDate = (d) => new Date(d).toLocaleString("en-IN", {
    day:"2-digit", month:"short", year:"numeric", hour:"2-digit", minute:"2-digit"
  });

  const filtered = filter === "all" ? orders : orders.filter(o => o.status === filter);

  const ProgressBar = ({ status }) => {
    if (status === "rejected") return (
      <div className="flex items-center gap-1 mt-3">
        <div className="h-1 flex-1 bg-red-400 rounded" />
        <span className="text-xs text-red-500 font-semibold">Rejected</span>
      </div>
    );
    const idx = STATUS_STEPS.indexOf(status);
    return (
      <div className="flex items-center mt-3 gap-1">
        {STATUS_STEPS.map((step, i) => (
          <React.Fragment key={step}>
            <div className={`w-5 h-5 rounded-full flex items-center justify-center text-xs transition ${
              i <= idx ? "bg-green-500 text-white" : "bg-gray-200 text-gray-400"
            }`}>
              {i <= idx ? "✓" : i + 1}
            </div>
            {i < STATUS_STEPS.length - 1 && (
              <div className={`flex-1 h-1 rounded ${i < idx ? "bg-green-400" : "bg-gray-200"}`} />
            )}
          </React.Fragment>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <ToastContainer />
      <nav className="flex justify-between items-center p-4 bg-white shadow">
        <img src="assets/logo.png" alt="Logo" className="w-8 h-8" />
        <span className="font-semibold text-gray-700">{t("myOrdersTitle")}</span>
        <Link to="/home" className="text-blue-600 text-sm">← {t("menu")}</Link>
      </nav>

      <div className="max-w-2xl mx-auto mt-6 p-4">
        <h1 className="text-xl font-bold text-gray-800 mb-4">
          {t("myOrdersTitle")}
          {user && <span className="text-gray-400 text-sm font-normal ml-2">({user.name})</span>}
        </h1>

        {/* Filter tabs */}
        <div className="flex gap-2 flex-wrap mb-5">
          {["all","pending","accepted","preparing","ready","delivered","rejected"].map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-3 py-1 rounded-full text-xs font-semibold capitalize transition ${
                filter === f ? "bg-orange-500 text-white" : "bg-white border border-gray-300 text-gray-600 hover:bg-gray-50"
              }`}>
              {STATUS_EMOJI[f] || "📋"} {t(f) || f}
            </button>
          ))}
        </div>

        {loading ? (
          <p className="text-center text-gray-400 py-12">{t("loading")}</p>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-400 text-lg mb-4">{t("noOrdersYet")}</p>
            <Link to="/home">
              <button className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700">
                {t("browseMenu")}
              </button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map(order => (
              <div key={order._id} className="bg-white rounded-xl shadow p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <p className="text-xs text-gray-400">{formatDate(order.createdAt)}</p>
                    <p className="text-xs font-mono text-gray-400">#{order._id.slice(-8).toUpperCase()}</p>
                    <p className="text-sm mt-1">{PAYMENT_ICON[order.paymentMode]} {order.paymentMode?.toUpperCase()}</p>
                  </div>
                  <span className={`text-xs font-bold px-2 py-1 rounded-full border ${STATUS_STYLE[order.status]}`}>
                    {STATUS_EMOJI[order.status]} {t(order.status)}
                  </span>
                </div>

                {/* Progress bar */}
                <ProgressBar status={order.status} />

                {/* Items */}
                <div className="mt-3 space-y-1">
                  {order.items.map((item, i) => (
                    <div key={i} className="flex justify-between text-sm text-gray-700">
                      <span>{item.name} × {item.quantity}</span>
                      <span>₹{item.price * item.quantity}</span>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between font-bold text-gray-800 border-t pt-2 mt-2">
                  <span>{t("total")}</span>
                  <span className="text-green-600">₹{order.totalPrice}</span>
                </div>

                {order.status === "accepted" && order.catererName && (
                  <div className="mt-2 bg-blue-50 rounded p-2 text-sm text-blue-700">
                    🔥 {t("preparingBy")}: <strong>{order.catererName}</strong>
                  </div>
                )}
                {["preparing","ready"].includes(order.status) && order.catererName && (
                  <div className="mt-2 bg-orange-50 rounded p-2 text-sm text-orange-700">
                    {STATUS_EMOJI[order.status]} {t(order.status)} — {t("preparingBy")}: <strong>{order.catererName}</strong>
                  </div>
                )}
                {order.status === "rejected" && order.note && (
                  <div className="mt-2 bg-red-50 rounded p-2 text-sm text-red-700">
                    💬 {t("rejectedReason")}: {order.note}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
