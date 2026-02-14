/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

export default function SignUp() {
  const [name, setName] = useState("");
  const [department, setDepartment] = useState("");
  const [identifier, setIdentifier] = useState("");
  const [isStudent, setIsStudent] = useState(true); // Default to student form

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if fields are empty
    if (name === "" || department === "" || identifier === "") {
      toast.error("All fields are required");
      return;
    }
    console.log(name, department, identifier, isStudent);

    try {
      // Send registration request to the backend
      const response = await axios.post("http://localhost:3000/signup", {
        name,
        department,
        identifier,
        role: isStudent ? "student" : "staff",
      });

      // Check if registration was successful
      if (response.data.success) {
        toast.success("Registration successful!");
        // Reset form fields
        setName("");
        setDepartment("");
        setIdentifier("");
      } else {
        toast.error(response.data.message || "Registration failed");
      }
    } catch (error) {
      // Handle network or server errors
      toast.error(error.response?.data?.message || "Registration failed. Check if server is running.");
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
                <h1 className="text-2xl font-semibold">
                  {isStudent ? "Student" : "Staff"} Registration
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
                      id="name"
                      name="name"
                      type="text"
                      className="peer placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:border-rose-600"
                      placeholder="Name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                    <label
                      htmlFor="name"
                      className="absolute left-0 -top-3.5 text-gray-600 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-440 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm"
                    >
                      Name
                    </label>
                  </div>
                  <div className="relative">
                    <input
                      autoComplete="off"
                      id="department"
                      name="department"
                      type="text"
                      className="peer placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:border-rose-600"
                      placeholder="Department"
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                    />
                    <label
                      htmlFor="department"
                      className="absolute left-0 -top-3.5 text-gray-600 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-440 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm"
                    >
                      Department
                    </label>
                  </div>
                  <div className="relative">
                    <input
                      autoComplete="off"
                      id="identifier"
                      name="identifier"
                      type="text"
                      className="peer placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:border-rose-600"
                      placeholder={isStudent ? "Roll Number" : "Staff ID"}
                      value={identifier}
                      onChange={(e) => setIdentifier(e.target.value)}
                    />
                    <label
                      htmlFor="identifier"
                      className="absolute left-0 -top-3.5 text-gray-600 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-440 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm"
                    >
                      {isStudent ? "Roll Number" : "Staff ID"}
                    </label>
                  </div>
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setIsStudent(!isStudent)}
                      className="bg-blue-500 text-white rounded-md px-2 py-1 mb-4"
                    >
                      Switch to {isStudent ? "Staff" : "Student"} Form
                    </button>
                  </div>
                  <div className="relative">
                    <button
                      type="submit"
                      className="bg-green-500 text-white rounded-md px-2 py-1"
                    >
                      Submit
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
