/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Sidebar from "./Sidebar";

const AddFoodItem = () => {
  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [price, setPrice] = useState("");
  const [date, setDate] = useState("");
  const [image, setImage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", name);
    formData.append("quantity", quantity);
    formData.append("price", price);
    formData.append("date", date);
    if (image) {
      formData.append("image", image);
    }
    //  logging form data
    // formData.forEach((value, key) => {
    //     console.log(`${key}: ${value}`);
    //   });
    try {
      await axios.post(
        "http://localhost:3000/admin/dashboard/foodItems",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      toast.success("Food item added successfully.");
      setName("");
      setQuantity("");
      setDate("");
      setImage(null);
    } catch (error) {
      console.error("Error adding food item:", error);
      toast.error("Failed to add food item.");
    }
  };

  return (
    <div className="flex">
      <Sidebar></Sidebar>
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Add Food Item</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block">Name:</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border p-2 w-full"
              required
            />
          </div>
          <div>
            <label className="block">Quantity:</label>
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="border p-2 w-full"
              min="1"
              required
            />
          </div>
          <div>
            <label className="block">Price for 1 qt:</label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="border p-2 w-full"
              min="1"
              required
            />
          </div>
          <div>
            <label className="block">Date:</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="border p-2 w-full"
              required
            />
          </div>
          <div>
            <label className="block">Image:</label>
            <input
              type="file"
              onChange={(e) => setImage(e.target.files[0])}
              className="border p-2 w-full"
              accept="image/*"
            />
          </div>
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Add Food Item
          </button>
        </form>
        <ToastContainer />
      </div>{" "}
    </div>
  );
};

export default AddFoodItem;
