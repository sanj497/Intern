import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const syncCart = async (token) => {
    try {
      const localCart = JSON.parse(localStorage.getItem("cart") || "[]");
      if (localCart.length > 0) {
        await axios.post("http://localhost:5000/api/cart/save",
          { items: localCart.map(i => ({ productId: i._id, quantity: i.quantity })) },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else {
        const { data } = await axios.get("http://localhost:5000/api/cart",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (data.items?.length > 0) {
          const dbCart = data.items.map(i => ({
            _id: i.product?._id || i.product,
            productName: i.productName,
            price: i.price,
            thumbnail: i.thumbnail,
            quantity: i.quantity
          }));
          localStorage.setItem("cart", JSON.stringify(dbCart));
          window.dispatchEvent(new Event("cartUpdated"));
        }
      }
    } catch(e) { /* silent */ }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage(""); setLoading(true);
    try {
      const { data } = await axios.post("http://localhost:5000/api/auth/login", { email, password });
      const { token, user } = data;

      localStorage.setItem("token", token);
      localStorage.setItem("userId", user.id);
      localStorage.setItem("username", user.username);
      localStorage.setItem("role", user.role);

      await syncCart(token);

      setMessage("✅ Login successful!");
      setTimeout(() => {
        if (user.role === "admin") navigate("/admin/dashboard");
        else navigate("/dashboard");
      }, 600);
    } catch (err) {
      setMessage("❌ " + (err.response?.data?.msg || "Login failed."));
    } finally { setLoading(false); }
  };

  return (
    <div style={{ minHeight:"100vh", background:"linear-gradient(135deg,#fff5f8,#fce4ec)", display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"'Segoe UI',sans-serif" }}>
      <div style={{ background:"#fff", padding:"2.5rem", borderRadius:20, width:"100%", maxWidth:420, margin:"1rem", boxShadow:"0 20px 60px rgba(0,0,0,0.1)" }}>
        <div style={{ textAlign:"center", marginBottom:"2rem" }}>
          <div style={{ fontSize:"2rem", fontFamily:"'Brush Script MT',cursive", color:"#d96fa6", marginBottom:"0.5rem" }}>🧵 granny_SB</div>
          <h2 style={{ fontSize:"1.5rem", fontWeight:700, color:"#1e293b" }}>Welcome Back</h2>
        </div>
        {message && (
          <div style={{ marginBottom:"1rem", textAlign:"center", fontWeight:500, color:message.startsWith("✅")?"#16a34a":"#dc2626" }}>{message}</div>
        )}
        <form onSubmit={handleLogin}>
          {[
            { l:"Email",    t:"email",    v:email,    s:setEmail,    p:"you@example.com" },
            { l:"Password", t:"password", v:password, s:setPassword, p:"Enter your password" }
          ].map(f => (
            <div key={f.l} style={{ marginBottom:"1.2rem" }}>
              <label style={{ display:"block", fontSize:"0.85rem", fontWeight:600, color:"#374151", marginBottom:6 }}>{f.l}</label>
              <input type={f.t} placeholder={f.p} value={f.v} onChange={e => f.s(e.target.value)} required
                style={{ width:"100%", padding:"11px 14px", borderRadius:10, border:"1.5px solid #e2e8f0", fontSize:"0.95rem", outline:"none", boxSizing:"border-box" }} />
            </div>
          ))}
          <button type="submit" disabled={loading}
            style={{ width:"100%", padding:13, background:"#d96fa6", color:"#fff", fontSize:"1rem", fontWeight:600, border:"none", borderRadius:10, cursor:"pointer" }}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
        <div style={{ textAlign:"center", marginTop:"1.2rem", fontSize:"0.88rem", color:"#64748b" }}>
          <p>Don't have an account? <Link to="/register" style={{ color:"#d96fa6", fontWeight:600 }}>Register here</Link></p>
          <p style={{ marginTop:"0.5rem" }}><Link to="/" style={{ color:"#d96fa6" }}>← Back to Home</Link></p>
        </div>
      </div>
    </div>
  );
};

export default Login;
