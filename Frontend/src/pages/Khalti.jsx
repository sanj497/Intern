import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { khaltiPayment } from "../store/khaltiSlice"; // adjust if needed

const KhaltiPayment = () => {
  const [orderId, setOrderId] = useState("");
  const [totalAmount, setTotalAmount] = useState("");

  const dispatch = useDispatch();
  const paymentUrl = useSelector((state) => state.khalti.khaltiUrl);
  const pidx = useSelector((state) => state.khalti.pidx);
  const status = useSelector((state) => state.khalti.status);

  const handleInitiatePayment = () => {
    if (!orderId || !totalAmount) {
      alert("Please provide valid order details.");
      return;
    }

    const payload = {
      paymentMethod: "khalti",
      paymentStatus: "unpaid",
      pidx: null,
      orderId,
      totalAmount: Number(totalAmount),
    };

    dispatch(khaltiPayment(payload));
  };

  useEffect(() => {
    if (paymentUrl) {
      window.open(paymentUrl, "_blank");
      alert("Payment initiated successfully! Redirecting to Khalti...");
    }
  }, [paymentUrl]);

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h2>Khalti Payment Integration (Redux)</h2>

      <div style={{ marginBottom: "10px" }}>
        <label>Order ID: </label>
        <input
          type="text"
          value={orderId}
          onChange={(e) => setOrderId(e.target.value)}
          placeholder="Enter Order ID"
        />
      </div>
      <div style={{ marginBottom: "10px" }}>
        <label>Total Amount: </label>
        <input
          type="number"
          value={totalAmount}
          onChange={(e) => setTotalAmount(e.target.value)}
          placeholder="Enter Total Amount"
        />
      </div>

      <button
        onClick={handleInitiatePayment}
        disabled={status === "loading"}
        style={{
          padding: "10px",
          background: "#5cb85c",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        {status === "loading" ? "Processing..." : "Initiate Payment"}
      </button>

      {paymentUrl && (
        <div style={{ marginTop: "20px" }}>
          <p>Payment URL:</p>
          <a href={paymentUrl} target="_blank" rel="noopener noreferrer">
            {paymentUrl}
          </a>
        </div>
      )}

      {pidx && (
        <div style={{ marginTop: "20px" }}>
          <p><strong>pidx:</strong> {pidx}</p>
        </div>
      )}
    </div>
  );
};

export default KhaltiPayment;