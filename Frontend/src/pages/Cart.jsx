import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import Navbar from "../Components/Navbar";

const Cart = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useState(() => JSON.parse(localStorage.getItem("cart") || "[]"));

  const save = (newCart) => { setCart(newCart); localStorage.setItem("cart", JSON.stringify(newCart)); };
  const updateQty = (id, delta) => {
    const updated = cart.map(i => i._id === id ? { ...i, quantity: Math.max(1, i.quantity + delta) } : i);
    save(updated);
  };
  const remove = (id) => save(cart.filter(i => i._id !== id));
  const total = cart.reduce((s, i) => s + i.price * i.quantity, 0);

  const s = {
    page: { maxWidth: 900, margin: "0 auto", padding: "2rem" },
    title: { fontSize: "2rem", fontWeight: 700, color: "#333", marginBottom: "2rem" },
    card: { background: "#fff", borderRadius: 16, boxShadow: "0 4px 15px rgba(0,0,0,0.07)", padding: "1.2rem 1.5rem", marginBottom: "1rem", display: "flex", alignItems: "center", gap: "1.2rem" },
    img: { width: 90, height: 90, objectFit: "cover", borderRadius: 12, flexShrink: 0 },
    info: { flex: 1 },
    name: { fontWeight: 600, fontSize: "1rem", color: "#222", marginBottom: 4 },
    price: { color: "#d96fa6", fontWeight: 700, fontSize: "1rem" },
    qtyRow: { display: "flex", alignItems: "center", gap: 10, marginTop: 8 },
    qtyBtn: { background: "#f0f0f0", border: "none", borderRadius: "50%", width: 28, height: 28, cursor: "pointer", fontWeight: 700, fontSize: "1rem" },
    qty: { fontWeight: 600, minWidth: 24, textAlign: "center" },
    delBtn: { background: "#fff0f0", color: "#e53935", border: "1px solid #ffcdd2", borderRadius: 20, padding: "5px 12px", cursor: "pointer", fontSize: "0.82rem" },
    summary: { background: "#fff", borderRadius: 16, boxShadow: "0 4px 15px rgba(0,0,0,0.07)", padding: "1.5rem", marginTop: "1.5rem" },
    checkoutBtn: { width: "100%", padding: "14px", background: "#d96fa6", color: "#fff", border: "none", borderRadius: 30, fontWeight: 700, fontSize: "1.05rem", cursor: "pointer", marginTop: "1rem" },
    empty: { textAlign: "center", padding: "5rem 2rem", background: "#fff", borderRadius: 16, boxShadow: "0 4px 15px rgba(0,0,0,0.07)" },
  };

  return (
    <div style={{ fontFamily: "'Segoe UI',sans-serif", background: "#fff5f8", minHeight: "100vh" }}>
      <Navbar />
      <div style={s.page}>
        <h1 style={s.title}>🛒 Your Cart</h1>

        {cart.length === 0 ? (
          <div style={s.empty}>
            <div style={{ fontSize: "4rem", marginBottom: "1rem" }}>🛒</div>
            <p style={{ color: "#888", fontSize: "1.1rem", marginBottom: "1.5rem" }}>Your cart is empty</p>
            <Link to="/product" style={{ background: "#d96fa6", color: "#fff", padding: "12px 28px", borderRadius: 25, textDecoration: "none", fontWeight: 600 }}>Browse Products</Link>
          </div>
        ) : (
          <>
            {cart.map(item => (
              <div key={item._id} style={s.card}>
                <img src={item.thumbnail} alt={item.productName} style={s.img} />
                <div style={s.info}>
                  <div style={s.name}>{item.productName}</div>
                  <div style={s.price}>Rs. {item.price} each</div>
                  <div style={s.qtyRow}>
                    <button style={s.qtyBtn} onClick={() => updateQty(item._id, -1)}>−</button>
                    <span style={s.qty}>{item.quantity}</span>
                    <button style={s.qtyBtn} onClick={() => updateQty(item._id, 1)}>+</button>
                    <button style={s.delBtn} onClick={() => remove(item._id)}>🗑 Remove</button>
                  </div>
                </div>
                <div style={{ fontWeight: 700, color: "#333", fontSize: "1.1rem" }}>
                  Rs. {item.price * item.quantity}
                </div>
              </div>
            ))}

            <div style={s.summary}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "1.1rem", marginBottom: "0.5rem" }}>
                <span>Subtotal ({cart.reduce((s,i) => s+i.quantity, 0)} items)</span>
                <span style={{ fontWeight: 700, color: "#d96fa6" }}>Rs. {total}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.9rem", color: "#888", marginBottom: "1rem" }}>
                <span>Shipping</span><span>Calculated at checkout</span>
              </div>
              <hr style={{ borderColor: "#f0f0f0", marginBottom: "1rem" }} />
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "1.3rem", fontWeight: 700 }}>
                <span>Total</span><span style={{ color: "#d96fa6" }}>Rs. {total}</span>
              </div>
              <button style={s.checkoutBtn} onClick={() => navigate("/checkout")}>
                Proceed to Checkout →
              </button>
            </div>
          </>
        )}
      </div>

      <footer style={{ backgroundColor: "#2d2d2d", color: "#ccc", textAlign: "center", padding: "2rem", marginTop: "3rem" }}>
        <p style={{ fontSize: "0.9rem" }}>© 2025 granny_SB. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Cart;
