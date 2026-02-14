/* eslint-disable no-unused-vars */
import React, { useState, useContext } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaUserGraduate, FaIdBadge } from "react-icons/fa";
import "./login.css";
import { AppContext } from "../../AppContext";
export default function Login() {
  const { setUser } = useContext(AppContext);

  const [idOrRollNo, setIdOrRollNo] = useState("");
  const [role, setRole] = useState("student"); // Default to student
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    // Check if field is empty
    if (idOrRollNo === "") {
      toast.error("Field is required");
      return;
    }

    try {
      // Send login request to the backend
      const response = await axios.post("http://localhost:3000/login", {
        idOrRollNo,
        role,
      });

      // Check if login was successful
      if (response.data.success) {
        setUser({ name: response.data.name, id: response.data.id });
        localStorage.setItem("token", response.data.token); // Store the token
        localStorage.setItem("role", response.data.role); // Store the role
        toast.success("Login successful");
        navigate("/home");
        // navigate(response.data.role === 'user' ? "/user/dashboard" : "/admin/dashboard"); // Redirect based on role
      } else {
        toast.error("Login failed");
      }
    } catch (error) {
      // Handle network or server errors
      if (error.response?.status === 404) {
        toast.error("User not found. Please sign up first.");
      } else {
        toast.error(error.response?.data?.message || "Login failed. Check if server is running.");
      }
    }
  };

  return (
    <>
      <ToastContainer />
      <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
        <div className="relative py-3 sm:max-w-xl sm:mx-auto">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-300 to-blue-600 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
          <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
            <div className="max-w-md mx-auto">
              <div>
                <h1 className="text-2xl font-semibold flex items-center justify-center">
                  {role === "student" ? (
                    <FaUserGraduate className="mr-2" />
                  ) : (
                    <FaIdBadge className="mr-2" />
                  )}
                  {role === "student" ? "Student" : "Staff"} Login
                </h1>
              </div>
              <div className="divide-y divide-gray-200">
                <form
                  onSubmit={handleSubmit}
                  className="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7"
                >
                  <div className="relative">
                    <input
                      autoComplete="off"
                      id="idOrRollNo"
                      name="idOrRollNo"
                      type="text"
                      className="peer placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:border-rose-600"
                      placeholder={
                        role === "student" ? "Roll Number" : "Staff ID"
                      }
                      value={idOrRollNo}
                      onChange={(e) => setIdOrRollNo(e.target.value)}
                    />
                    <label
                      htmlFor="idOrRollNo"
                      className="absolute left-0 -top-3.5 text-gray-600 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-440 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm"
                    >
                      {role === "student" ? "Roll Number" : "Staff ID"}
                    </label>
                  </div>
                  <div className="relative flex justify-center space-x-4">
                    <label>
                      <input
                        type="radio"
                        value="student"
                        checked={role === "student"}
                        onChange={() => setRole("student")}
                      />
                      Student
                    </label>
                    <label>
                      <input
                        type="radio"
                        value="staff"
                        checked={role === "staff"}
                        onChange={() => setRole("staff")}
                      />
                      Staff
                    </label>
                  </div>
                  <div className="relative">
                    <button
                      type="submit"
                      className="bg-blue-500 text-white rounded-md px-2 py-1"
                    >
                      Login
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
