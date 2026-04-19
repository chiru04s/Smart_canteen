/* eslint-disable no-unused-vars */

import React, { useContext, useState } from "react";
import { AppContext } from "../../AppContext";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const PAYMENT_OPTIONS = [
  { value: "cash", icon: "💵", labelKey: "cash"   },
  { value: "upi",  icon: "📱", labelKey: "upi"    },
  { value: "wallet",icon:"👛", labelKey: "wallet" },
];

export default function CheckoutPage() {
  const { cart, setCart, user, t } = useContext(AppContext);
  const navigate = useNavigate();
  const [paymentMode, setPaymentMode] = useState("cash");
  const [placing,     setPlacing]     = useState(false);

  const totalPrice = cart.reduce((s, i) => s + Number(i.price) * Number(i.quantity), 0);

  const handlePlaceOrder = async () => {
    if (cart.length === 0) { toast.error("Cart is empty!"); return; }
    if (!user)             { toast.error("Please login first."); navigate("/login"); return; }
    setPlacing(true);
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/orders`, {
        userId: user.id, userName: user.name, totalPrice, paymentMode,
        items: cart.map(i => ({
          foodItemId: i._id || i.id, name: i.name,
          price: i.price, quantity: i.quantity, image_path: i.image_path || null
        }))
      });
      if (res.data.success) {
        setCart([]);
        toast.success("Order placed! Waiting for admin approval ✅");
        setTimeout(() => navigate("/my-orders"), 1600);
      }
    } catch (err) {
      toast.error("Failed to place order. Is the backend running?");
    } finally {
      setPlacing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <ToastContainer />
      <nav className="flex justify-between items-center p-4 bg-white shadow">
        <img src="logo.png" alt="Logo" className="w-8 h-8" />
        <span className="font-semibold text-gray-700">{t("checkout")}</span>
        <Link to="/cart" className="text-blue-600 text-sm">← {t("editCart")}</Link>
      </nav>

      <div className="max-w-2xl mx-auto mt-6 p-4 space-y-4">

        {/* User info */}
        {user && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <p className="text-xs text-gray-500">{t("orderingAs")}</p>
            <p className="font-bold text-blue-700 text-lg">{user.name}</p>
            <p className="text-gray-400 text-xs">ID: {user.id}</p>
          </div>
        )}

        {/* Order summary */}
        <div className="bg-white rounded-xl shadow p-4">
          <h2 className="text-lg font-bold text-gray-800 mb-3">{t("orderSummary")}</h2>
          {cart.length === 0 ? (
            <p className="text-gray-400 text-center py-6">{t("empty")}</p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-gray-500 text-left">
                  <th className="py-2">Item</th>
                  <th className="py-2 text-center">Qty</th>
                  <th className="py-2 text-right">Price</th>
                  <th className="py-2 text-right">Total</th>
                </tr>
              </thead>
              <tbody>
                {cart.map((item) => (
                  <tr key={item._id || item.id} className="border-b last:border-0">
                    <td className="py-3 flex items-center gap-2">
                      {item.image_path && (
                        <img src={`${import.meta.env.VITE_API_URL}/uploads/${item.image_path}`}
                          alt={item.name} className="w-9 h-9 object-cover rounded"
                          onError={(e) => (e.target.style.display = "none")} />
                      )}
                      <span className="font-medium">{item.name}</span>
                    </td>
                    <td className="py-3 text-center text-gray-600">{item.quantity}</td>
                    <td className="py-3 text-right text-gray-600">₹{item.price}</td>
                    <td className="py-3 text-right font-semibold">₹{item.price * item.quantity}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          <div className="flex justify-between items-center mt-4 pt-3 border-t">
            <span className="font-bold text-gray-700">{t("total")}</span>
            <span className="text-2xl font-extrabold text-green-600">₹{totalPrice}</span>
          </div>
        </div>

        {/* Payment mode */}
        <div className="bg-white rounded-xl shadow p-4">
          <h2 className="text-lg font-bold text-gray-800 mb-3">{t("paymentMode")}</h2>
          <div className="grid grid-cols-3 gap-3">
            {PAYMENT_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setPaymentMode(opt.value)}
                className={`flex flex-col items-center justify-center p-3 rounded-xl border-2 transition font-semibold text-sm ${
                  paymentMode === opt.value
                    ? "border-green-500 bg-green-50 text-green-700"
                    : "border-gray-200 text-gray-600 hover:border-gray-300"
                }`}
              >
                <span className="text-2xl mb-1">{opt.icon}</span>
                {t(opt.labelKey)}
              </button>
            ))}
          </div>
          {paymentMode === "upi" && (
            <div className="mt-3 bg-blue-50 border border-blue-200 rounded-lg p-3 text-center">
              <p className="text-xs text-blue-600 mb-2">Scan QR at the counter</p>
              <div className="w-24 h-24 bg-blue-100 mx-auto rounded flex items-center justify-center text-blue-300 text-xs border border-blue-200">
                QR Code
              </div>
              <p className="text-xs text-blue-500 mt-2">UPI ID: canteen@sac</p>
            </div>
          )}
        </div>

        {/* Note */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-3 text-sm text-yellow-800">
          ⏳ {t("orderNote")}
        </div>

        {/* Buttons */}
        <div className="flex gap-3 pb-6">
          <Link to="/cart" className="flex-1">
            <button className="w-full border border-gray-300 text-gray-700 py-3 rounded-xl hover:bg-gray-50 font-semibold">
              ← {t("editCart")}
            </button>
          </Link>
          <button
            onClick={handlePlaceOrder}
            disabled={placing || cart.length === 0}
            className={`flex-1 py-3 rounded-xl font-bold text-white transition ${
              placing || cart.length === 0 ? "bg-gray-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"
            }`}
          >
            {placing ? t("placingOrder") : "✅ " + t("placeOrder")}
          </button>
        </div>
      </div>
    </div>
  );
}



