import { Routes, Route } from "react-router-dom";
import LoginPage        from "./components/Admin/LoginPage";
import Error404         from "./components/Error404";
import Caterer          from "./components/Admin/Caterer";
import Sales            from "./components/Admin/Sales";
import OrdersPage       from "./components/Admin/OrdersPage";
import AddCaterer       from "./components/Admin/AddCaterer";
import CatererList      from "./components/Admin/CatererList";
import AddFoodItem      from "./components/Admin/AddFoodItem";
import AuthPage         from "./components/User/AuthPage";
import SignUp           from "./components/User/SignUp";
import Login            from "./components/User/Login";
import HomePage         from "./components/User/HomePage";
import CartPage         from "./components/User/CartPage";
import CheckoutPage     from "./components/User/CheckoutPage";
import MyOrders         from "./components/User/MyOrders";
import CatererLogin     from "./components/Caterer/CatererLogin";
import CatererDashboard from "./components/Caterer/CatererDashboard";
import LandingPage      from "./LandingPage";
import { AdminProtectedRoute, UserProtectedRoute, CatererProtectedRoute } from "./components/ProtectedRoute";

function App() {
  return (
    <Routes>
      <Route path="/"    element={<LandingPage />} />
      <Route path="/auth" element={<AuthPage />} />

      {/* User public */}
      <Route path="/signup" element={<SignUp />} />
      <Route path="/login"  element={<Login />} />

      {/* User protected */}
      <Route element={<UserProtectedRoute />}>
        <Route path="/home"      element={<HomePage />} />
        <Route path="/cart"      element={<CartPage />} />
        <Route path="/checkout"  element={<CheckoutPage />} />
        <Route path="/my-orders" element={<MyOrders />} />
      </Route>

      {/* Caterer */}
      <Route path="/caterer/login" element={<CatererLogin />} />
      <Route element={<CatererProtectedRoute />}>
        <Route path="/caterer/dashboard" element={<CatererDashboard />} />
      </Route>

      {/* Admin */}
      <Route path="/admin" element={<LoginPage />} />
      <Route element={<AdminProtectedRoute />}>
        <Route path="/admin/dashboard/sales"       element={<Sales />} />
        <Route path="/admin/dashboard/orders"      element={<OrdersPage />} />
        <Route path="/admin/dashboard/caterer"     element={<Caterer />} />
        <Route path="/admin/dashboard/items"       element={<AddFoodItem />} />
        <Route path="/admin/dashboard/addCaterer"  element={<AddCaterer />} />
        <Route path="/admin/dashboard/catererList" element={<CatererList />} />
      </Route>

      <Route path="*" element={<Error404 />} />
    </Routes>
  );
}

export default App;
