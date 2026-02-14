/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import Sidebar from "./Sidebar";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from 'axios';
export default function AddCaterer() {
  const [catererName, setCatererName] = useState("");
  const [catererId, setCatererId] = useState("");
  const handleSubmit = async (e) => {
    // Check if fields are empty
    e.preventDefault();
    if (catererName === "" || catererId === "") {
      toast.error("Both fields are required");
      return;
    }
    try {
        const response = await axios.post('http://localhost:3000/admin/dashboard/addCaterer', {
            catererName,
            catererId
        });
    
        console.log("Response received:", response.data);
        toast.success(response.data.message);
    } catch (error) {
        console.error("Request failed:", error.response ? error.response.data : error);
        toast.error(error.response?.data?.message || "Error adding caterer");
    }
    setCatererName("")
    setCatererId("")
  };
  return (
    <div className="flex">
      <ToastContainer />
      <Sidebar></Sidebar>
      <div className="min-h-screen grow bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
        <div className="relative py-3 sm:max-w-xl sm:mx-auto">
          <div className="absolute inset-0 bg-gradient-to-r from-red-300 to-red-600 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
          <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
            <div className="max-w-md mx-auto">
              <div>
                <h1 className="text-2xl font-semibold">Create Caterer</h1>
              </div>
              <div className="divide-y divide-gray-200">
                <form
                  onSubmit={handleSubmit}
                  className="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7"
                >
                  <div className="relative">
                    <input
                      autoComplete="off"
                      id="adminId"
                      name="adminId"
                      type="text"
                      className="peer placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:border-rose-600"
                      placeholder="Admin Id"
                      value={catererName}
                      onChange={(e) => setCatererName(e.target.value)}
                    />
                    <label
                      htmlFor="adminId"
                      className="absolute left-0 -top-3.5 text-gray-600 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-440 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm"
                    >
                      Caterer Name
                    </label>
                  </div>
                  <div className="relative">
                    <input
                      autoComplete="off"
                      id="password"
                      name="password"
                      type="password"
                      className="peer placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:border-rose-600"
                      placeholder="Password"
                      value={catererId}
                      onChange={(e) => setCatererId(e.target.value)}
                    />
                    <label
                      htmlFor="password"
                      className="absolute left-0 -top-3.5 text-gray-600 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-440 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm"
                    >
                      Caterer ID
                    </label>
                  </div>
                  <div className="relative">
                    <button
                      type="submit"
                      className="bg-red-500 text-white rounded-md px-2 py-1"
                    >
                      Submit
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>{" "}
    </div>
  );
}
