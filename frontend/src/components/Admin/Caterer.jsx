/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import Sidebar from "./Sidebar";
import { Link, useNavigate } from "react-router-dom";

export default function Caterer() {
  
  return (
    <div className="flex">
      
    <Sidebar></Sidebar>
    <div className="grow flex justify-center items-center min-h-screen bg-gray-100">
      {/* Card 1: Add Caterer */}
      <div className="max-w-sm rounded overflow-hidden shadow-lg m-4 bg-white">
        <div className="px-6 py-4">
          <div className="font-bold text-xl mb-2 text-center">Add Caterer</div>
          <p className="text-gray-700 text-base text-center">
            Add a new caterer to the canteen.
          </p>
        </div>
                <Link to="/admin/dashboard/addCaterer">
                <div className="px-6 pt-4 pb-2">
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded flex items-center justify-center">
            <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            Add Caterer
          </button>
        </div>
        </Link>
      
      </div>

      {/* Card 2: Total Caterers */}
      <div className="max-w-sm rounded overflow-hidden shadow-lg m-4 bg-white">
        <div className="px-6 py-4">
          <div className="font-bold text-xl mb-2 text-center">Total Caterers</div>
          <p className="text-gray-700 text-base text-center">
            View the total number of caterers.
          </p>
        </div>
        <Link to="/admin/dashboard/catererList">

        <div className="px-6 pt-4 pb-2">
          <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded flex items-center justify-center">
            <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5s8.268 2.943 9.542 7-2.943 9.057-7.943 9.542-9.057-2.943-9.542-7.943z"></path></svg>
            View Total
          </button>
        </div>
        </Link>
      </div>
    </div>
       </div>
  );
}
