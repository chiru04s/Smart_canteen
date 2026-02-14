/* eslint-disable no-unused-vars */
import React, { useContext } from "react";
import { AppContext } from "../../AppContext";
import { FaTrash } from "react-icons/fa";
import { Link } from "react-router-dom";

const CartPage = () => {
  const { cart, setCart, user } = useContext(AppContext);

  const handleRemove = (item) => {
    const itemKey = item._id || item.id;
    setCart(cart.filter((c) => (c._id || c.id) !== itemKey));
  };

  const totalPrice = cart.reduce(
    (total, item) => total + Number(item.price) * Number(item.quantity),
    0
  );

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Navbar */}
      <nav className="flex justify-between items-center p-4 bg-white shadow">
        <img src="logo.png" alt="logo" className="w-8 h-8" />
        <span className="font-semibold text-gray-700">Your Cart</span>
        <Link to="/home" className="text-blue-600 text-sm">← Back to Menu</Link>
      </nav>

      <div className="max-w-2xl mx-auto my-8 p-4">
        {user && (
          <p className="text-gray-500 text-sm mb-4">
            Logged in as: <strong>{user.name}</strong>
          </p>
        )}

        <h2 className="text-2xl font-bold my-4 text-gray-800">Cart</h2>

        {cart.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-400 text-lg mb-4">Your cart is empty.</p>
            <Link to="/home">
              <button className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700">
                Browse Menu 🍟
              </button>
            </Link>
          </div>
        ) : (
          <>
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <table className="w-full border-collapse">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="p-3 text-left text-gray-600">Item</th>
                    <th className="p-3 text-center text-gray-600">Qty</th>
                    <th className="p-3 text-right text-gray-600">Price</th>
                    <th className="p-3 text-right text-gray-600">Total</th>
                    <th className="p-3 text-center text-gray-600">Remove</th>
                  </tr>
                </thead>
                <tbody>
                  {cart.map((item) => {
                    const itemKey = item._id || item.id;
                    return (
                      <tr key={itemKey} className="border-t">
                        <td className="p-3 font-medium text-gray-800">{item.name}</td>
                        <td className="p-3 text-center text-gray-600">{item.quantity}</td>
                        <td className="p-3 text-right text-gray-600">₹{item.price}</td>
                        <td className="p-3 text-right font-semibold">₹{item.price * item.quantity}</td>
                        <td className="p-3 text-center">
                          <button
                            className="text-red-500 hover:text-red-700"
                            onClick={() => handleRemove(item)}
                          >
                            <FaTrash />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Total */}
            <div className="flex justify-between items-center mt-6 bg-white rounded-lg shadow p-4">
              <span className="text-lg font-bold text-gray-700">Total</span>
              <span className="text-2xl font-extrabold text-green-600">₹{totalPrice}</span>
            </div>

            {/* Actions */}
            <div className="flex gap-3 mt-4">
              <Link to="/home" className="flex-1">
                <button className="w-full border border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-100 font-semibold">
                  ← Continue Shopping
                </button>
              </Link>
              <Link to="/checkout" className="flex-1">
                <button className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 font-bold">
                  Proceed to Checkout →
                </button>
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CartPage;
