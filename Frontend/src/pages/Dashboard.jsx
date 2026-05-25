import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import Navbar from "../Components/Navbar";

const STATUS_COLORS = {
  pending: { bg: "#fff3e0", color: "#e65100" },
  confirmed: { bg: "#e8f5e9", color: "#2e7d32" },
  processing: { bg: "#e3f2fd", color: "#1565c0" },
  shipped: { bg: "#f3e5f5", color: "#6a1b9a" },
  delivered: { bg: "#e8f5e9", color: "#1b5e20" },
  cancelled: { bg: "#ffebee", color: "#b71c1c" },
};

const Dashboard = () => {
  const navigate = useNavigate();

  const username = localStorage.getItem("username") || "User";
  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");

  const [tab, setTab] = useState("orders");
  const [orders, setOrders] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  const BASE_URL = "http://localhost:5000";

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    Promise.all([
      axios.get(`${BASE_URL}/api/orders/my`, {
        headers: { Authorization: `Bearer ${token}` },
      }),
      axios.get(`${BASE_URL}/api/favorites/${userId}`),
    ])
      .then(([ordRes, favRes]) => {
        setOrders(ordRes.data.orders || []);
        setFavorites(favRes.data.favorites || []);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const removeFav = async (productId) => {
    try {
      await axios.delete(`${BASE_URL}/api/favorites/remove`, {
        data: { userId, productId },
      });

      setFavorites((prev) =>
        prev.filter((p) => p._id !== productId)
      );
    } catch {
      alert("Failed to remove");
    }
  };

  const s = {
    page: { maxWidth: 1100, margin: "0 auto", padding: "2rem" },
    hero: {
      background: "linear-gradient(135deg,#ffb6c1 0%,#fce4ec 100%)",
      padding: "2.5rem 2rem",
      borderRadius: 20,
      marginBottom: "2rem",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
    },
    stat: {
      background: "#fff",
      borderRadius: 16,
      padding: "1.5rem",
      textAlign: "center",
      boxShadow: "0 4px 15px rgba(0,0,0,0.07)",
      flex: 1,
      margin: "0 0.5rem",
    },
    tabs: {
      display: "flex",
      gap: "0.5rem",
      marginBottom: "1.5rem",
      background: "#fff",
      padding: "0.4rem",
      borderRadius: 30,
      boxShadow: "0 2px 10px rgba(0,0,0,0.06)",
      width: "fit-content",
    },
    tab: (active) => ({
      padding: "9px 24px",
      borderRadius: 25,
      border: "none",
      cursor: "pointer",
      fontWeight: 600,
      fontSize: "0.9rem",
      background: active ? "#d96fa6" : "transparent",
      color: active ? "#fff" : "#666",
    }),
    orderCard: {
      background: "#fff",
      borderRadius: 16,
      boxShadow: "0 4px 15px rgba(0,0,0,0.07)",
      padding: "1.5rem",
      marginBottom: "1rem",
    },
    badge: (s) => ({
      display: "inline-block",
      padding: "3px 12px",
      borderRadius: 20,
      fontSize: "0.8rem",
      fontWeight: 600,
      background:
        (STATUS_COLORS[s] || STATUS_COLORS.pending).bg,
      color:
        (STATUS_COLORS[s] || STATUS_COLORS.pending).color,
    }),
    favCard: {
      background: "#fff",
      borderRadius: 16,
      boxShadow: "0 4px 15px rgba(0,0,0,0.07)",
      overflow: "hidden",
    },
  };

  return (
    <div
      style={{
        fontFamily: "'Segoe UI',sans-serif",
        background: "#fff5f8",
        minHeight: "100vh",
      }}
    >
      <Navbar />

      <div style={s.page}>
        {/* HERO */}
        <div style={s.hero}>
          <div>
            <h1 style={{ fontSize: "1.8rem", color: "#3b3b3b" }}>
              Welcome back, {username}! 👋
            </h1>
            <p style={{ color: "#666" }}>
              Manage your orders, favorites, and account
            </p>
          </div>

          <Link
            to="/product"
            style={{
              background: "#d96fa6",
              color: "#fff",
              padding: "10px 24px",
              borderRadius: 25,
              textDecoration: "none",
              fontWeight: 600,
            }}
          >
            Shop More 🛍️
          </Link>
        </div>

        {/* STATS */}
        <div style={{ display: "flex", gap: "1rem", marginBottom: "2rem" }}>
          {[
            {
              icon: "📦",
              num: orders.length,
              label: "Total Orders",
            },
            {
              icon: "⏳",
              num: orders.filter((o) =>
                ["pending", "confirmed", "processing"].includes(
                  o.status
                )
              ).length,
              label: "Active Orders",
            },
            {
              icon: "❤️",
              num: favorites.length,
              label: "Favorites",
            },
          ].map((s2) => (
            <div key={s2.label} style={s.stat}>
              <div style={{ fontSize: "2rem" }}>{s2.icon}</div>
              <div
                style={{
                  fontSize: "2rem",
                  fontWeight: 700,
                  color: "#d96fa6",
                }}
              >
                {s2.num}
              </div>
              <div style={{ color: "#666", fontSize: "0.85rem" }}>
                {s2.label}
              </div>
            </div>
          ))}
        </div>

        {/* TABS */}
        <div style={s.tabs}>
          {[
            ["orders", "📦 My Orders"],
            ["favorites", "❤️ Favorites"],
          ].map(([k, l]) => (
            <button
              key={k}
              style={s.tab(tab === k)}
              onClick={() => setTab(k)}
            >
              {l}
            </button>
          ))}
        </div>

        {loading ? (
          <p>Loading...</p>
        ) : tab === "orders" ? (
          orders.length === 0 ? (
            <p>No orders yet</p>
          ) : (
            orders.map((order) => (
              <div key={order._id} style={s.orderCard}>
                <div>
                  <div style={{ fontWeight: 700 }}>
                    Order #{order._id.slice(-8)}
                  </div>

                  <span style={s.badge(order.status)}>
                    {order.status}
                  </span>
                </div>

                {order.items.map((item, i) => (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      gap: "10px",
                      marginTop: "10px",
                    }}
                  >
                    {/* ✅ FIXED IMAGE */}
                    <img
                      src={
                        item.thumbnail ||
                        item.Thumbnail ||
                        "https://via.placeholder.com/50"
                      }
                      alt={item.productName}
                      style={{
                        width: 48,
                        height: 48,
                        objectFit: "cover",
                        borderRadius: 8,
                      }}
                    />

                    <div style={{ flex: 1 }}>
                      <div>{item.productName}</div>
                      <div style={{ fontSize: "0.8rem" }}>
                        Qty: {item.quantity}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ))
          )
        ) : favorites.length === 0 ? (
          <p>No favorites yet</p>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fill,minmax(200px,1fr))",
              gap: "1rem",
            }}
          >
            {favorites.map((p) => (
              <div key={p._id} style={s.favCard}>
                {/* ✅ FIXED IMAGE */}
                <img
                  src={
                    p.thumbnail ||
                    p.Thumbnail ||
                    "https://via.placeholder.com/200"
                  }
                  alt={p.productName}
                  style={{
                    width: "100%",
                    height: 160,
                    objectFit: "cover",
                  }}
                />

                <div style={{ padding: "1rem" }}>
                  <div>{p.productName}</div>
                  <div style={{ color: "#d96fa6" }}>
                    Rs. {p.price}
                  </div>

                  <button onClick={() => removeFav(p._id)}>
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;