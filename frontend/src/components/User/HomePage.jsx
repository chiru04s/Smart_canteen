/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useContext } from "react";
import { FaSignOutAlt, FaUser, FaShoppingCart } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AppContext } from "../../AppContext";

const HomePage = () => {
  const navigate = useNavigate();
  const { user, setUser, addToCart, cart } = useContext(AppContext);
  const backendURL = "http://localhost:3000";
  const [foodItems, setFoodItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFoodItems = async () => {
      try {
        const response = await axios.get("http://localhost:3000/homepage");
        // response.data.data is the array from MongoDB
        setFoodItems(response.data.data || []);
      } catch (error) {
        // Show actual error details so you can debug
        console.error("Fetch error:", error.response?.data || error.message);
        toast.error("Could not load food items. Is the backend running?");
      } finally {
        setLoading(false);
      }
    };
    fetchFoodItems();
  }, []);

  const [quantities, setQuantities] = useState({});

  const handleQuantityChange = (itemKey, quantity) => {
    setQuantities((prev) => ({ ...prev, [itemKey]: quantity }));
  };

  const handleAddToCart = (item) => {
    const itemKey = item._id || item.id;
    const quantity = parseInt(quantities[itemKey]) || 1;
    addToCart(item, quantity);
    toast.success(`${quantity} × ${item.name} added to cart!`);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("loginCredentials");
    setUser(null);
    navigate("/login");
  };

  const totalCartQuantity = cart.reduce((total, item) => total + item.quantity, 0);

  return (
    <div>
      <ToastContainer />
      <nav className="flex justify-between items-center p-4 bg-white shadow">
        <div className="flex items-center">
          <img src="logo.png" alt="Logo" className="w-8 h-8 mr-2" />
        </div>
        <div className="flex items-center space-x-4">
          <FaUser />
          <span>{user?.name || "User"}</span>
          <Link to="/my-orders" className="text-sm text-gray-600 hover:text-green-700 font-medium hidden sm:block">
            My Orders
          </Link>
          <Link to="/cart" className="relative">
            <FaShoppingCart className="cursor-pointer text-green-600 text-xl" />
            {totalCartQuantity > 0 && (
              <span className="absolute border-red-600 border-2 -top-3 -right-2 bg-transparent text-red-700 rounded-full w-5 h-5 flex items-center justify-center text-xs font-extrabold">
                {totalCartQuantity}
              </span>
            )}
          </Link>
          <button onClick={handleLogout} title="Logout">
            <FaSignOutAlt />
          </button>
        </div>
      </nav>

      <div className="container mx-auto p-3 mt-5">
        {loading ? (
          <p className="text-center text-gray-500 mt-10">Loading food items...</p>
        ) : foodItems.length === 0 ? (
          <div className="text-center mt-10">
            <p className="text-gray-500 text-lg">No food items available yet.</p>
            <p className="text-gray-400 text-sm mt-2">Ask the admin to add items from the Admin Dashboard.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {foodItems.map((item) => {
              const itemKey = item._id || item.id;
              return (
                <div key={itemKey} className="border bg-white rounded-lg p-4 shadow-md">
                  {item.image_path ? (
                    <img
                      src={`${backendURL}/uploads/${item.image_path}`}
                      alt={item.name}
                      className="w-full h-40 object-cover rounded-md"
                      onError={(e) => { e.target.style.display = "none"; }}
                    />
                  ) : (
                    <div className="w-full h-40 bg-gray-200 rounded-md flex items-center justify-center text-gray-400">
                      No Image
                    </div>
                  )}
                  <h5 className="text-xl font-semibold mt-2">
                    {item.name}{" "}
                    <span className="text-green-600 ml-2">₹ {item.price}</span>
                  </h5>
                  <div className="flex justify-between items-center mt-4">
                    <div>
                      <label className="mr-2">Quantity:</label>
                      <input
                        type="number"
                        min="1"
                        value={quantities[itemKey] || 1}
                        onChange={(e) => handleQuantityChange(itemKey, e.target.value)}
                        className="border rounded px-2 py-1 w-16"
                      />
                    </div>
                    <button
                      className="bg-green-700 text-white px-4 py-2 rounded"
                      onClick={() => handleAddToCart(item)}
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
