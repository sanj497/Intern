import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { khaltiPayment, verifyKhaltiPayment } from "../store/khaltiSlice";

const PaymentSuccess = () => {
  const dispatch = useDispatch();
  const { khaltiUrl, status } = useSelector((state) => state.khalti);

  const [orderId, setOrderId] = useState("");
  const [amount, setAmount] = useState("");
  const [pidx, setPidx] = useState("");
  const [verificationMessage, setVerificationMessage] = useState("");

  const handlePay = () => {
    dispatch(khaltiPayment({ orderId, amount }));
    setVerificationMessage(""); // clear message on new payment
  };

  const handleVerify = async () => {
    if (!pidx) {
      alert("Please enter PIDX to verify.");
      return;
    }
    setVerificationMessage(""); // clear before verify

    // Dispatch verify thunk and handle result
    // Since thunk doesn't return result directly,
    // let's modify verify thunk to return success boolean,
    // or use a simple callback here (for now, show message on status change)
    
    // For simplicity, we just dispatch and watch status below
    dispatch(verifyKhaltiPayment(pidx));
  };

  // Show message if status is success and pidx entered
  React.useEffect(() => {
    if (status === "SUCCESS" && pidx) {
      setVerificationMessage("Verification completed successfully.");
    } else if (status === "ERROR" && pidx) {
      setVerificationMessage("Verification failed or incomplete.");
    }
  }, [status, pidx]);

  return (
    <div>
      <h2>Khalti Payment Demo</h2>

      <input
        type="text"
        placeholder="Order ID"
        value={orderId}
        onChange={(e) => setOrderId(e.target.value)}
      />
      <input
        type="number"
        placeholder="Amount (in paisa)"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
      <button onClick={handlePay}>Initiate Payment</button>

      {khaltiUrl && (
        <div>
          <p>Click the link to pay:</p>
          <a href={khaltiUrl} target="_blank" rel="noreferrer">
            {khaltiUrl}
          </a>
        </div>
      )}

      <hr />

      <input
        type="text"
        placeholder="Enter PIDX to verify"
        value={pidx}
        onChange={(e) => setPidx(e.target.value)}
      />
      <button onClick={handleVerify}>Verify Payment</button>

      <p>Status: {status}</p>
      {verificationMessage && <p>{verificationMessage}</p>}
    </div>
  );
};

export default PaymentSuccess;