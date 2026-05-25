import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../Components/Navbar";

const Checkout = () => {
  const navigate = useNavigate();
  const cart = JSON.parse(localStorage.getItem("cart") || "[]");
  const token = localStorage.getItem("token");
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [form, setForm] = useState({ fullName: "", phone: "", address: "", city: "" });
  const [errors, setErrors] = useState({});

  if (!token) { navigate("/login"); return null; }
  if (cart.length === 0) { navigate("/cart"); return null; }

  const total = cart.reduce((s, i) => s + (Number(i.price) * Number(i.quantity)), 0);

  const validate = () => {
    const e = {};
    if (!form.fullName.trim()) e.fullName = "Required";
    if (!form.phone.trim() || form.phone.length < 10) e.phone = "Enter valid phone number";
    if (!form.address.trim()) e.address = "Required";
    if (!form.city.trim()) e.city = "Required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const placeOrder = async () => {
    if (!validate()) return;
    setLoading(true);

    const items = cart.map(i => ({
      productId: i._id,
      quantity: parseInt(i.quantity, 10),
    }));

    try {
      const { data } = await axios.post(
        "http://localhost:5000/api/orders",
        { items, shippingAddress: form, paymentMethod },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (paymentMethod === "khalti" && data.paymentUrl) {
        localStorage.setItem("pendingOrderId", data.order._id);
        localStorage.setItem("pendingOrder", JSON.stringify(data.order));
        localStorage.removeItem("cart");
        window.dispatchEvent(new Event("cartUpdated"));
        window.location.href = data.paymentUrl;
      } else {
        // 1. Save order to localStorage FIRST as fallback
        localStorage.setItem("lastOrder", JSON.stringify(data.order));
        // 2. Navigate to success page immediately with state
        navigate("/order-success", { state: { order: data.order } });
        // 3. Clear cart AFTER navigation so cart-empty check doesn't fire
        setTimeout(() => {
          localStorage.removeItem("cart");
          window.dispatchEvent(new Event("cartUpdated"));
        }, 500);
      }
    } catch (err) {
      const msg = err.response?.data?.message || err.message || "Order failed";
      alert("❌ " + msg);
      console.error("Order error:", err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = (field) => ({
    width: "100%",
    padding: "11px 14px",
    borderRadius: 10,
    border: `1.5px solid ${errors[field] ? "#dc2626" : "#e2e8f0"}`,
    fontSize: "0.95rem",
    outline: "none",
    boxSizing: "border-box",
  });

  return (
    <div style={{ fontFamily: "'Segoe UI',sans-serif", background: "#fff5f8", minHeight: "100vh" }}>
      <Navbar />
      <div style={{ maxWidth: 960, margin: "0 auto", padding: "2rem", display: "grid", gridTemplateColumns: "1fr 360px", gap: "2rem" }}>

        {/* LEFT: Form */}
        <div>
          <h1 style={{ fontSize: "1.8rem", fontWeight: 700, color: "#333", marginBottom: "1.5rem" }}>Checkout</h1>

          {/* Shipping */}
          <div style={{ background: "#fff", borderRadius: 16, boxShadow: "0 4px 15px rgba(0,0,0,0.07)", padding: "1.8rem", marginBottom: "1.5rem" }}>
            <h2 style={{ fontSize: "1.1rem", fontWeight: 700, color: "#333", marginBottom: "1.2rem" }}>🏠 Shipping Address</h2>
            {[
              { name: "fullName", label: "Full Name", type: "text", ph: "Your full name" },
              { name: "phone",    label: "Phone",     type: "tel",  ph: "98XXXXXXXX" },
              { name: "address",  label: "Address",   type: "text", ph: "Street / House No." },
              { name: "city",     label: "City",      type: "text", ph: "Kathmandu" },
            ].map(f => (
              <div key={f.name} style={{ marginBottom: "1rem" }}>
                <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, color: "#374151", marginBottom: 5 }}>{f.label}</label>
                <input
                  type={f.type}
                  placeholder={f.ph}
                  value={form[f.name]}
                  onChange={e => setForm({ ...form, [f.name]: e.target.value })}
                  style={inputStyle(f.name)}
                  onFocus={e => e.target.style.borderColor = "#d96fa6"}
                  onBlur={e => e.target.style.borderColor = errors[f.name] ? "#dc2626" : "#e2e8f0"}
                />
                {errors[f.name] && (
                  <span style={{ color: "#dc2626", fontSize: "0.8rem" }}>{errors[f.name]}</span>
                )}
              </div>
            ))}
          </div>

          {/* Payment */}
          <div style={{ background: "#fff", borderRadius: 16, boxShadow: "0 4px 15px rgba(0,0,0,0.07)", padding: "1.8rem" }}>
            <h2 style={{ fontSize: "1.1rem", fontWeight: 700, color: "#333", marginBottom: "1.2rem" }}>💳 Payment Method</h2>
            {[
              { value: "cod",    label: "Cash on Delivery", icon: "💵", desc: "Pay when you receive your order" },
              { value: "khalti", label: "Pay with Khalti",  icon: "🟣", desc: "Fast & secure online payment" },
            ].map(m => (
              <div key={m.value} onClick={() => setPaymentMethod(m.value)}
                style={{
                  display: "flex", alignItems: "center", gap: "1rem",
                  padding: "1rem 1.2rem", borderRadius: 12,
                  border: `2px solid ${paymentMethod === m.value ? "#d96fa6" : "#e2e8f0"}`,
                  background: paymentMethod === m.value ? "#fff0f6" : "#fff",
                  cursor: "pointer", marginBottom: "0.8rem", transition: "all 0.2s"
                }}>
                <span style={{ fontSize: "1.8rem" }}>{m.icon}</span>
                <div>
                  <div style={{ fontWeight: 600, color: "#222" }}>{m.label}</div>
                  <div style={{ fontSize: "0.82rem", color: "#888" }}>{m.desc}</div>
                </div>
                <div style={{
                  marginLeft: "auto", width: 20, height: 20, borderRadius: "50%",
                  border: `2px solid ${paymentMethod === m.value ? "#d96fa6" : "#ccc"}`,
                  background: paymentMethod === m.value ? "#d96fa6" : "#fff"
                }} />
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT: Summary */}
        <div>
          <div style={{ background: "#fff", borderRadius: 16, boxShadow: "0 4px 15px rgba(0,0,0,0.07)", padding: "1.5rem", position: "sticky", top: 90 }}>
            <h2 style={{ fontSize: "1.1rem", fontWeight: 700, color: "#333", marginBottom: "1.2rem" }}>📦 Order Summary</h2>
            <div style={{ maxHeight: 280, overflowY: "auto" }}>
              {cart.map(item => (
                <div key={item._id} style={{ display: "flex", gap: "0.8rem", marginBottom: "1rem", alignItems: "center" }}>
                  <img
                    src={item.thumbnail} alt={item.productName}
                    style={{ width: 55, height: 55, objectFit: "cover", borderRadius: 10 }}
                    onError={e => { e.target.src = "https://placehold.co/55x55?text=?"; }}
                  />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: "0.88rem", color: "#222" }}>{item.productName}</div>
                    <div style={{ fontSize: "0.82rem", color: "#888" }}>Qty: {item.quantity}</div>
                  </div>
                  <div style={{ fontWeight: 700, color: "#d96fa6", fontSize: "0.9rem" }}>
                    Rs. {Number(item.price) * Number(item.quantity)}
                  </div>
                </div>
              ))}
            </div>
            <hr style={{ borderColor: "#f0f0f0", margin: "1rem 0" }} />
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.4rem", fontSize: "0.9rem" }}>
              <span style={{ color: "#666" }}>Subtotal</span>
              <span>Rs. {total}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1rem", fontSize: "0.9rem" }}>
              <span style={{ color: "#666" }}>Shipping</span>
              <span style={{ color: "#16a34a" }}>Free</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 700, fontSize: "1.15rem", marginBottom: "1.2rem" }}>
              <span>Total</span>
              <span style={{ color: "#d96fa6" }}>Rs. {total}</span>
            </div>
            <button
              onClick={placeOrder}
              disabled={loading}
              style={{
                width: "100%", padding: 14,
                background: loading ? "#e8a0c0" : "#d96fa6",
                color: "#fff", border: "none", borderRadius: 30,
                fontWeight: 700, fontSize: "1rem",
                cursor: loading ? "not-allowed" : "pointer",
                transition: "background 0.2s"
              }}>
              {loading ? "Placing Order..." : paymentMethod === "khalti" ? "Pay with Khalti 🟣" : "Place Order ✅"}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Checkout;