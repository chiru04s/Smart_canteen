import React, { createContext, useState, useEffect } from "react";
import { translations, defaultLang } from "./i18n";

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // ── User ──────────────────────────────────────────────────────────────────
  const storedUser = localStorage.getItem("loginCredentials");
  const [user, setUserState] = useState(storedUser ? JSON.parse(storedUser) : null);

  const setUser = (userData) => {
    if (userData) localStorage.setItem("loginCredentials", JSON.stringify(userData));
    else          localStorage.removeItem("loginCredentials");
    setUserState(userData);
  };

  // ── Language ──────────────────────────────────────────────────────────────
  const [lang, setLang] = useState(localStorage.getItem("lang") || defaultLang);
  const t = (key) => translations[lang]?.[key] || translations[defaultLang][key] || key;
  const changeLang = (l) => { setLang(l); localStorage.setItem("lang", l); };

  // ── Cart ──────────────────────────────────────────────────────────────────
  const getCartKey = (u) => `cart_${u ? u.id : "guest"}`;
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const stored = localStorage.getItem(getCartKey(user));
    setCart(stored ? JSON.parse(stored) : []);
  }, [user]);

  useEffect(() => {
    if (user) localStorage.setItem(getCartKey(user), JSON.stringify(cart));
  }, [cart, user]);

  const addToCart = (item, quantity) => {
    if (!user) return;
    const itemKey = item._id || item.id;
    setCart((prev) => {
      const existing = prev.find((c) => (c._id || c.id) === itemKey);
      if (existing)
        return prev.map((c) => (c._id || c.id) === itemKey ? { ...c, quantity: c.quantity + quantity } : c);
      return [...prev, { ...item, quantity }];
    });
  };

  return (
    <AppContext.Provider value={{ user, setUser, cart, setCart, addToCart, lang, t, changeLang }}>
      {children}
    </AppContext.Provider>
  );
};
