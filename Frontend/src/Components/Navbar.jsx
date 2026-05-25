import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = ({ activePage = "" }) => {
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem("token");
  const username = localStorage.getItem("username");
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const updateCount = () => {
      const cart = JSON.parse(localStorage.getItem("cart") || "[]");
      setCartCount(cart.reduce((s, i) => s + i.quantity, 0));
    };
    updateCount();
    window.addEventListener("storage", updateCount);
    window.addEventListener("cartUpdated", updateCount);
    return () => {
      window.removeEventListener("storage", updateCount);
      window.removeEventListener("cartUpdated", updateCount);
    };
  }, []);

  const handleLogout = async () => {
    // Save cart to DB before logging out
    const token = localStorage.getItem("token");
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    if (token && cart.length > 0) {
      try {
        const { default: axios } = await import("axios");
        await axios.post("http://localhost:5000/api/cart/save",
          { items: cart.map(i => ({ productId: i._id, quantity: i.quantity })) },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } catch (e) { /* silent */ }
    }
    localStorage.clear();
    navigate("/");
  };

  return (
    <>
      <style>{`
        .navbar { background:#fff; display:flex; justify-content:space-between; align-items:center; padding:1rem 2.5rem; box-shadow:0 2px 10px rgba(0,0,0,0.08); position:sticky; top:0; z-index:500; }
        .nav-logo { font-size:1.9rem; font-weight:bold; color:#d96fa6; font-family:'Brush Script MT',cursive; text-decoration:none; }
        .nav-links { display:flex; gap:1.4rem; align-items:center; }
        .nav-links a { color:#444; text-decoration:none; font-weight:500; font-size:0.95rem; transition:color 0.2s; padding:4px 0; border-bottom:2px solid transparent; }
        .nav-links a:hover,.nav-links a.active { color:#d96fa6; border-bottom-color:#d96fa6; }
        .nav-btn { padding:8px 20px; border-radius:25px; font-size:0.9rem; font-weight:600; cursor:pointer; border:none; text-decoration:none; transition:all 0.2s; }
        .btn-outline { background:#fff; color:#d96fa6; border:2px solid #d96fa6 !important; }
        .btn-outline:hover { background:#d96fa6; color:#fff; }
        .btn-filled { background:#d96fa6; color:#fff; }
        .btn-filled:hover { background:#c2185b; }
        .btn-ghost { background:#f5f5f5; color:#666; border:1px solid #ddd !important; }
        .btn-ghost:hover { background:#ececec; }
        .cart-btn { position:relative; background:#fff0f6; color:#d96fa6; border:1px solid #f8bbd0; padding:7px 16px; border-radius:25px; font-weight:600; cursor:pointer; font-size:0.9rem; text-decoration:none; }
        .cart-badge { position:absolute; top:-6px; right:-6px; background:#e91e63; color:#fff; border-radius:50%; width:18px; height:18px; font-size:0.7rem; display:flex; align-items:center; justify-content:center; font-weight:700; }
        .nav-user { color:#d96fa6; font-weight:600; font-size:0.88rem; }
      `}</style>
      <nav className="navbar">
        <Link to="/" className="nav-logo">🧵 granny_SB</Link>
        <div className="nav-links">
          <Link to="/product" className={activePage === "product" ? "active" : ""}>Shop</Link>
          <Link to="/about" className={activePage === "about" ? "active" : ""}>About</Link>
          <Link to="/contact" className={activePage === "contact" ? "active" : ""}>Contact</Link>
          {isLoggedIn ? (
            <>
              <Link to="/cart" className="cart-btn">
                🛒 Cart
                {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
              </Link>
              <span className="nav-user">Hi, {username}!</span>
              <Link to="/dashboard" className="nav-btn btn-filled">Dashboard</Link>
              <button className="nav-btn btn-ghost" onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/cart" className="cart-btn">
                🛒 Cart
                {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
              </Link>
              <Link to="/login" className="nav-btn btn-outline">Login</Link>
              <Link to="/register" className="nav-btn btn-filled">Register</Link>
            </>
          )}
        </div>
      </nav>
    </>
  );
};

export default Navbar;
