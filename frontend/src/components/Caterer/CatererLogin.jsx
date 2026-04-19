import React, { useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

export default function CatererLogin() {
  const [caterer_id, setCatererId] = useState("");
  const [password, setPassword]   = useState("");
  const [loading, setLoading]     = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!caterer_id || !password) { toast.error("Both fields required"); return; }
    setLoading(true);
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/caterer/login`, { caterer_id, password });
      if (res.data.success) {
        localStorage.setItem("catererToken", res.data.token);
        localStorage.setItem("catererInfo", JSON.stringify(res.data.caterer));
        toast.success("Welcome " + res.data.caterer.name + "!");
        setTimeout(() => navigate("/caterer/dashboard"), 1000);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 flex items-center justify-center p-4">
      <ToastContainer />
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">🍽️</div>
          <h1 className="text-2xl font-bold text-gray-800">Caterer Login</h1>
          <p className="text-gray-500 text-sm mt-1">SAC Canteen — Caterer Portal</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Caterer ID</label>
            <input
              type="text" value={caterer_id}
              onChange={(e) => setCatererId(e.target.value)}
              placeholder="e.g. CAT001"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password" value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Default: caterer123"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
          </div>
          <button
            type="submit" disabled={loading}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-lg transition disabled:opacity-60"
          >
            {loading ? "Logging in..." : "Login →"}
          </button>
        </form>

        <p className="text-center text-xs text-gray-400 mt-6">
          Default password is <strong>caterer123</strong> unless changed by admin
        </p>
      </div>
    </div>
  );
}
