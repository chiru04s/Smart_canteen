/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useContext } from "react";
import { FaSignOutAlt, FaUser, FaShoppingCart } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AppContext } from "../../AppContext";

const LANGS = [{ code:"en", label:"EN" }, { code:"ta", label:"தமிழ்" }, { code:"hi", label:"हिंदी" }];

export default function HomePage() {
  const navigate = useNavigate();
  const { user, setUser, addToCart, cart, t, lang, changeLang } = useContext(AppContext);
  const backendURL = `${import.meta.env.VITE_API_URL}`;
  const [foodItems, setFoodItems] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`${backendURL}/homepage`)
      .then(r => setFoodItems(r.data.data || []))
      .catch(() => toast.error("Could not load food items. Is backend running?"))
      .finally(() => setLoading(false));
  }, []);

  const handleAddToCart = (item) => {
    const key = item._id || item.id;
    const qty = parseInt(quantities[key]) || 1;
    addToCart(item, qty);
    toast.success(`${qty} × ${item.name} ${t("addToCart")} ✅`);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    setUser(null);
    navigate("/login");
  };

  const totalQty = cart.reduce((s, i) => s + i.quantity, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <ToastContainer />

      <nav className="flex justify-between items-center px-4 py-3 bg-white shadow sticky top-0 z-10">
        <img src="assets/logo.png" alt="Logo" className="w-8 h-8" />

        <div className="flex items-center gap-3 text-sm">
          {/* Language switcher */}
          <div className="flex gap-1 bg-gray-100 rounded-full p-1">
            {LANGS.map(l => (
              <button key={l.code} onClick={() => changeLang(l.code)}
                className={`px-2 py-0.5 rounded-full text-xs font-semibold transition ${
                  lang === l.code ? "bg-green-500 text-white" : "text-gray-600 hover:text-gray-800"
                }`}>
                {l.label}
              </button>
            ))}
          </div>

          <Link to="/my-orders" className="text-gray-600 hover:text-green-700 font-medium hidden sm:block">
            {t("myOrders")}
          </Link>

          <div className="flex items-center gap-1 text-gray-700">
            <FaUser className="text-xs" />
            <span className="hidden sm:block">{user?.name}</span>
          </div>

          <Link to="/cart" className="relative">
            <FaShoppingCart className="text-green-600 text-xl" />
            {totalQty > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs font-bold">
                {totalQty}
              </span>
            )}
          </Link>

          <button onClick={handleLogout} className="text-gray-500 hover:text-red-500" title={t("logout")}>
            <FaSignOutAlt />
          </button>
        </div>
      </nav>

      <div className="container mx-auto p-4 mt-4">
        {loading ? (
          <p className="text-center text-gray-400 py-16">{t("loading")}</p>
        ) : foodItems.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-500 text-lg mb-2">{t("noItems")}</p>
            <p className="text-gray-400 text-sm">{t("noItemsHint")}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {foodItems.map((item) => {
              const key = item._id || item.id;
              return (
                <div key={key} className="bg-white rounded-xl shadow hover:shadow-md transition overflow-hidden">
                  {item.image_path ? (
                    <img src={`${backendURL}/uploads/${item.image_path}`} alt={item.name}
                      className="w-full h-44 object-cover"
                      onError={(e) => { e.target.style.display = "none"; }} />
                  ) : (
                    <div className="w-full h-44 bg-gray-100 flex items-center justify-center text-gray-400 text-4xl">🍽️</div>
                  )}
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-3">
                      <h5 className="text-lg font-bold text-gray-800">{item.name}</h5>
                      <span className="text-green-600 font-extrabold">₹{item.price}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <label className="text-xs text-gray-500">{t("quantity")}</label>
                        <input type="number" min="1" value={quantities[key] || 1}
                          onChange={(e) => setQuantities(p => ({ ...p, [key]: e.target.value }))}
                          className="border rounded px-2 py-1 w-14 text-sm text-center" />
                      </div>
                      <button onClick={() => handleAddToCart(item)}
                        className="bg-green-600 hover:bg-green-700 text-white text-sm px-4 py-2 rounded-lg font-semibold transition">
                        + {t("addToCart")}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
