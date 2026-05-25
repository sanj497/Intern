import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(""); setLoading(true);
    try {
      const res = await axios.post("/api/admin/login", { email, password });
      localStorage.setItem("adminToken", res.data.token);
      localStorage.setItem("adminUser", JSON.stringify(res.data.data));
      navigate("/admin/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Please try again.");
    } finally { setLoading(false); }
  };

  return (
    <div style={{
      width: "100vw",
      height: "100vh",
      margin: 0,
      padding: 0,
      background: "linear-gradient(135deg, #fff5f8 0%, #fce4ec 100%)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "'Segoe UI', sans-serif",
      boxSizing: "border-box",
    }}>
      <div style={{
        background: "#fff",
        borderRadius: 20,
        padding: "48px 40px",
        width: "100%",
        maxWidth: 420,
        boxShadow: "0 20px 60px rgba(217,111,166,0.15)",
        boxSizing: "border-box",
      }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ fontSize: "2.8rem", fontFamily: "'Brush Script MT', cursive", color: "#d96fa6", marginBottom: 8 }}>
            🧵 granny_SB
          </div>
          <h1 style={{ margin: "0 0 4px", fontSize: "1.6rem", color: "#1e293b", fontWeight: 700 }}>Admin Portal</h1>
          <p style={{ color: "#94a3b8", fontSize: "0.9rem", margin: 0 }}>Sign in to manage your store</p>
        </div>

        <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {error && (
            <div style={{ background: "#fff0f6", border: "1px solid #f8bbd0", color: "#c2185b", padding: "12px 16px", borderRadius: 10, fontSize: "0.9rem" }}>
              ❌ {error}
            </div>
          )}

          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <label style={{ fontSize: "0.88rem", fontWeight: 600, color: "#374151" }}>Email Address</label>
            <input
              type="email" value={email} onChange={e => setEmail(e.target.value)}
              required placeholder="admin@granny.com"
              style={{ padding: "12px 14px", borderRadius: 10, border: "1.5px solid #e2e8f0", fontSize: "0.95rem", outline: "none", width: "100%", boxSizing: "border-box" }}
              onFocus={e => e.target.style.borderColor = "#d96fa6"}
              onBlur={e => e.target.style.borderColor = "#e2e8f0"}
            />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <label style={{ fontSize: "0.88rem", fontWeight: 600, color: "#374151" }}>Password</label>
            <input
              type="password" value={password} onChange={e => setPassword(e.target.value)}
              required placeholder="Enter your password"
              style={{ padding: "12px 14px", borderRadius: 10, border: "1.5px solid #e2e8f0", fontSize: "0.95rem", outline: "none", width: "100%", boxSizing: "border-box" }}
              onFocus={e => e.target.style.borderColor = "#d96fa6"}
              onBlur={e => e.target.style.borderColor = "#e2e8f0"}
            />
          </div>

          <button
            type="submit" disabled={loading}
            style={{ padding: 14, background: "#d96fa6", color: "#fff", border: "none", borderRadius: 10, fontSize: "1rem", fontWeight: 700, cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.7 : 1, marginTop: 4 }}
            onMouseEnter={e => { if (!loading) e.target.style.background = "#c2185b"; }}
            onMouseLeave={e => { e.target.style.background = "#d96fa6"; }}
          >
            {loading ? "Signing in..." : "Sign In →"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
