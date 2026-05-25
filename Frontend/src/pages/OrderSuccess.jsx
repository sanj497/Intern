import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import Navbar from "../Components/Navbar";

const OrderSuccess = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [order, setOrder] = useState(state?.order || null);
  const [verifying, setVerifying] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const pidx = params.get("pidx");
    const orderId = localStorage.getItem("pendingOrderId");

    if (pidx && orderId) {
      // Khalti redirect — verify payment
      setVerifying(true);
      axios.post(
        "http://localhost:5000/api/orders/verify-payment",
        { pidx, orderId },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      ).then((res) => {
        const savedOrder =
          res.data?.order ||
          JSON.parse(localStorage.getItem("pendingOrder") || "null");
        if (savedOrder) setOrder(savedOrder);
        localStorage.removeItem("cart");
        localStorage.removeItem("pendingOrderId");
        localStorage.removeItem("pendingOrder");
        window.dispatchEvent(new Event("cartUpdated"));
      }).catch(console.error)
        .finally(() => setVerifying(false));

    } else if (state?.order) {
      // COD success — state passed from navigate
      setOrder(state.order);
      localStorage.removeItem("cart");
      localStorage.removeItem("lastOrder");
      window.dispatchEvent(new Event("cartUpdated"));

    } else {
      // Fallback — try localStorage (e.g. page was refreshed)
      const fallback = JSON.parse(localStorage.getItem("lastOrder") || "null");
      if (fallback) {
        setOrder(fallback);
        localStorage.removeItem("lastOrder");
      }
    }
  }, []);

  // Redirect to home if nothing to show after 5s
  useEffect(() => {
    if (!order && !verifying) {
      const timer = setTimeout(() => navigate("/"), 5000);
      return () => clearTimeout(timer);
    }
  }, [order, verifying]);

  if (verifying) {
    return (
      <div style={{ fontFamily: "'Segoe UI',sans-serif", background: "#fff5f8", minHeight: "100vh" }}>
        <Navbar />
        <div style={{ maxWidth: 600, margin: "4rem auto", padding: "2rem", textAlign: "center" }}>
          <div style={{ background: "#fff", borderRadius: 20, padding: "3rem 2rem", boxShadow: "0 8px 30px rgba(0,0,0,0.08)" }}>
            <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>⏳</div>
            <h2 style={{ color: "#333", marginBottom: "0.5rem" }}>Verifying your payment...</h2>
            <p style={{ color: "#888" }}>Please wait, do not close this page.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ fontFamily: "'Segoe UI',sans-serif", background: "#fff5f8", minHeight: "100vh" }}>
      <Navbar />
      <div style={{ maxWidth: 600, margin: "4rem auto", padding: "2rem", textAlign: "center" }}>
        <div style={{ background: "#fff", borderRadius: 20, padding: "3rem 2rem", boxShadow: "0 8px 30px rgba(0,0,0,0.08)" }}>

          <div style={{ fontSize: "4rem", marginBottom: "1rem" }}>🎉</div>
          <h1 style={{ fontSize: "2rem", fontWeight: 700, color: "#333", marginBottom: "0.5rem" }}>Order Placed!</h1>
          <p style={{ color: "#666", fontSize: "1rem", marginBottom: "2rem" }}>
            Thank you for your order. We'll start preparing it right away!
          </p>

          {order ? (
            <div style={{ background: "#fff0f6", borderRadius: 16, padding: "1.5rem", marginBottom: "2rem", textAlign: "left" }}>
              <div style={{ display: "flex", justifyContent: "space-between", padding: "0.5rem 0", borderBottom: "1px solid #fce4ec" }}>
                <span style={{ color: "#666", fontSize: "0.9rem" }}>Order ID</span>
                <span style={{ fontWeight: 600, fontSize: "0.88rem", color: "#555" }}>
                  #{order._id?.slice(-8).toUpperCase()}
                </span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", padding: "0.5rem 0", borderBottom: "1px solid #fce4ec" }}>
                <span style={{ color: "#666", fontSize: "0.9rem" }}>Total Amount</span>
                <span style={{ fontWeight: 700, color: "#d96fa6" }}>Rs. {order.totalAmount}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", padding: "0.5rem 0", borderBottom: "1px solid #fce4ec" }}>
                <span style={{ color: "#666", fontSize: "0.9rem" }}>Payment</span>
                <span style={{ fontWeight: 600, color: "#333", textTransform: "capitalize" }}>
                  {order.paymentMethod}
                </span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", padding: "0.5rem 0" }}>
                <span style={{ color: "#666", fontSize: "0.9rem" }}>Status</span>
                <span style={{ fontWeight: 600, color: "#e65100", textTransform: "capitalize" }}>
                  {order.status || "pending"}
                </span>
              </div>
            </div>
          ) : (
            <div style={{ background: "#fff0f6", borderRadius: 16, padding: "1.5rem", marginBottom: "2rem" }}>
              <p style={{ color: "#888", margin: 0 }}>
                Your order has been received. Check your dashboard for details.
              </p>
            </div>
          )}

          <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
            <Link to="/dashboard"
              style={{ background: "#d96fa6", color: "#fff", padding: "12px 28px", borderRadius: 25, textDecoration: "none", fontWeight: 600 }}>
              View My Orders
            </Link>
            <Link to="/product"
              style={{ background: "#fff", color: "#d96fa6", border: "2px solid #d96fa6", padding: "12px 28px", borderRadius: 25, textDecoration: "none", fontWeight: 600 }}>
              Continue Shopping
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;