import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import SelectPaymentType from "./pages/SelectPaymentType";
import Khalti from "./pages/Khalti";
import { Provider } from "react-redux";
import store from "./store/store";
import Sucess from "./pages/PaymentSuccess";
import Login from "./pages/Login";
import Register from "./pages/Register";
import React from "react";
import Product from "./pages/product";
import Home from "./pages/home";
import About from "./pages/about";
import Contact from "./pages/contact";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import OrderSuccess from "./pages/OrderSuccess";
import Dashboard from "./pages/Dashboard";


const ProtectedRoute = ({ children, adminOnly = false }) => {
  const token = localStorage.getItem("token");
  const role  = localStorage.getItem("role");
  if (!token) return <Navigate to="/login" replace />;
  if (adminOnly && role !== "admin") return <Navigate to="/dashboard" replace />;
  return children;
};

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          {/* Public */}
          <Route path="/"        element={<Home />} />
          <Route path="/home"    element={<Home />} />
          <Route path="/login"   element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/product" element={<Product />} />
          <Route path="/about"   element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/cart"    element={<Cart />} />
          <Route path="/payment" element={<SelectPaymentType />} />
          <Route path="/khalti"  element={<Khalti />} />
          <Route path="/success" element={<Sucess />} />

          {/* Customer — must be logged in */}
          <Route path="/checkout"      element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
          <Route path="/order-success" element={<OrderSuccess />} />
          <Route path="/dashboard"     element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />

          
        </Routes>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
