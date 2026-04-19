/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import Sidebar from "./Sidebar";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

export default function AddCaterer() {
  const [catererName, setCatererName] = useState("");
  const [catererId,   setCatererId]   = useState("");
  const [password,    setPassword]    = useState("");
  const [phone,       setPhone]       = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!catererName || !catererId) { toast.error("Name and ID are required"); return; }
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/admin/dashboard/addCaterer`, {
        catererName, catererId,
        password: password || "caterer123",
        phone
      });
      toast.success(res.data.message);
      setCatererName(""); setCatererId(""); setPassword(""); setPhone("");
    } catch (err) {
      toast.error(err.response?.data?.message || "Error adding caterer");
    }
  };

  return (
    <div className="flex min-h-screen">
      <ToastContainer />
      <Sidebar />
      <div className="flex-1 bg-gray-50 flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">👨‍🍳 Add New Caterer</h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            {[
              { label:"Caterer Name *",  value:catererName, set:setCatererName, placeholder:"e.g. Ravi Kumar",    type:"text"     },
              { label:"Caterer ID *",    value:catererId,   set:setCatererId,   placeholder:"e.g. CAT001",        type:"text"     },
              { label:"Password",        value:password,    set:setPassword,    placeholder:"Default: caterer123", type:"password" },
              { label:"Phone (optional)",value:phone,       set:setPhone,       placeholder:"+91 99999 99999",     type:"tel"      },
            ].map(field => (
              <div key={field.label}>
                <label className="block text-sm font-medium text-gray-700 mb-1">{field.label}</label>
                <input type={field.type} value={field.value}
                  onChange={(e) => field.set(e.target.value)}
                  placeholder={field.placeholder}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
                />
              </div>
            ))}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-xs text-blue-700">
              💡 If no password is set, the caterer can log in with <strong>caterer123</strong>
            </div>
            <button type="submit"
              className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg transition">
              ➕ Add Caterer
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
