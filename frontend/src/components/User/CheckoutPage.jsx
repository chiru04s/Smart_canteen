/* eslint-disable no-unused-vars */
import React, { useContext, useState } from "react";
import { AppContext } from "../../AppContext";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const CheckoutPage = () => {
  const { cart, setCart, user } = useContext(AppContext);
  const navigate = useNavigate();
  const [placing, setPlacing] = useState(false);

  const totalPrice = cart.reduce(
    (total, item) => total + Number(item.price) * Number(item.quantity),
    0
  );

  const handlePlaceOrder = async () => {
    if (cart.length === 0) {
      toast.error("Your cart is empty!");
      return;
    }
    if (!user) {
      toast.error("Please login first.");
      navigate("/login");
      return;
    }

    setPlacing(true);
    try {
      const orderPayload = {
        userId: user.id,
        userName: user.name,
        totalPrice,
        items: cart.map((item) => ({
          foodItemId: item._id || item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image_path: item.image_path || null,
        })),
      };

      const response = await axios.post("http://localhost:3000/orders", orderPayload);

      if (response.data.success) {
        // Clear cart after successful order
        setCart([]);
        toast.success("Order placed! Waiting for admin approval. ✅");
        setTimeout(() => navigate("/my-orders"), 1800);
      }
    } catch (err) {
      console.error("Order error:", err);
      toast.error("Failed to place order. Try again.");
    } finally {
      setPlacing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <ToastContainer />

      {/* Header */}
      <nav className="flex justify-between items-center p-4 bg-white shadow">
        <img src="logo.png" alt="Logo" className="w-8 h-8" />
        <span className="font-semibold text-gray-700">Checkout</span>
        <Link to="/cart" className="text-blue-600 text-sm">← Back to Cart</Link>
      </nav>

      <div className="max-w-2xl mx-auto mt-8 p-4">

        {/* User info */}
        {user && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-500">Ordering as</p>
            <p className="font-bold text-blue-700 text-lg">{user.name}</p>
            <p className="text-gray-500 text-sm">ID: {user.id}</p>
          </div>
        )}

        {/* Order Summary */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <h2 className="text-xl font-bold mb-4 text-gray-800">Order Summary</h2>
          {cart.length === 0 ? (
            <p className="text-gray-400 text-center py-6">Cart is empty</p>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b text-gray-600 text-sm">
                  <th className="text-left py-2">Item</th>
                  <th className="text-center py-2">Qty</th>
                  <th className="text-right py-2">Price</th>
                  <th className="text-right py-2">Total</th>
                </tr>
              </thead>
              <tbody>
                {cart.map((item) => {
                  const key = item._id || item.id;
                  return (
                    <tr key={key} className="border-b last:border-0">
                      <td className="py-3 flex items-center gap-2">
                        {item.image_path && (
                          <img
                            src={`http://localhost:3000/uploads/${item.image_path}`}
                            alt={item.name}
                            className="w-10 h-10 object-cover rounded"
                            onError={(e) => (e.target.style.display = "none")}
                          />
                        )}
                        <span className="font-medium">{item.name}</span>
                      </td>
                      <td className="py-3 text-center text-gray-600">{item.quantity}</td>
                      <td className="py-3 text-right text-gray-600">₹{item.price}</td>
                      <td className="py-3 text-right font-semibold">₹{item.price * item.quantity}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}

          {/* Total */}
          <div className="flex justify-between items-center mt-4 pt-4 border-t">
            <span className="text-lg font-bold text-gray-700">Grand Total</span>
            <span className="text-2xl font-extrabold text-green-600">₹{totalPrice}</span>
          </div>
        </div>

        {/* Note */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-6 text-sm text-yellow-800">
          ⏳ Your order will be sent to the admin. Once accepted, a caterer will be assigned to prepare it.
        </div>

        {/* Action buttons */}
        <div className="flex gap-3">
          <Link to="/cart" className="flex-1">
            <button className="w-full border border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-100 font-semibold">
              ← Edit Cart
            </button>
          </Link>
          <button
            onClick={handlePlaceOrder}
            disabled={placing || cart.length === 0}
            className={`flex-1 py-3 rounded-lg font-bold text-white transition ${
              placing || cart.length === 0
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-green-600 hover:bg-green-700"
            }`}
          >
            {placing ? "Placing Order..." : "✅ Place Order"}
          </button>
        </div>

        {/* My Orders link */}
        <div className="text-center mt-4">
          <Link to="/my-orders" className="text-blue-500 text-sm hover:underline">
            View My Previous Orders →
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
