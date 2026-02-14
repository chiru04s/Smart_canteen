import React, { createContext, useState, useEffect } from "react";

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // ✅ FIX: Read from "loginCredentials" key correctly
  const storedUser = localStorage.getItem("loginCredentials");
  const [user, setUserState] = useState(storedUser ? JSON.parse(storedUser) : null);

  // ✅ FIX: Wrap setUser so it ALWAYS saves to localStorage too
  const setUser = (userData) => {
    if (userData) {
      localStorage.setItem("loginCredentials", JSON.stringify(userData));
    } else {
      localStorage.removeItem("loginCredentials");
    }
    setUserState(userData);
  };

  // Function to get cart storage key for each user
  const getCartKey = (u) => `cart_${u ? u.id : "guest"}`;

  const [cart, setCart] = useState([]);

  // Load cart whenever user changes
  useEffect(() => {
    const storedCart = localStorage.getItem(getCartKey(user));
    setCart(storedCart ? JSON.parse(storedCart) : []);
  }, [user]);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (user) {
      localStorage.setItem(getCartKey(user), JSON.stringify(cart));
    }
  }, [cart, user]);

  // Function to Add Items to Cart — ✅ FIX: use _id (MongoDB) with fallback to id
  const addToCart = (item, quantity) => {
    if (!user) {
      console.warn("User is not logged in. Cannot add items to the cart.");
      return;
    }

    const itemKey = item._id || item.id;

    setCart((prevCart) => {
      const existingItem = prevCart.find((cartItem) => (cartItem._id || cartItem.id) === itemKey);
      if (existingItem) {
        return prevCart.map((cartItem) =>
          (cartItem._id || cartItem.id) === itemKey
            ? { ...cartItem, quantity: cartItem.quantity + quantity }
            : cartItem
        );
      } else {
        return [...prevCart, { ...item, quantity }];
      }
    });
  };

  return (
    <AppContext.Provider value={{ user, setUser, cart, setCart, addToCart }}>
      {children}
    </AppContext.Provider>
  );
};
