import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { khaltiPayment } from "../store/khaltiSlice";

const KhaltiPayment = () => {
  const [orderId, setOrderId] = useState("");
  const [totalAmount, setTotalAmount] = useState("");
  const [focused, setFocused] = useState(null);
  const [toast, setToast] = useState(null);

  const dispatch = useDispatch();
  const paymentUrl = useSelector((state) => state.khalti.khaltiUrl);
  const pidx = useSelector((state) => state.khalti.pidx);
  const status = useSelector((state) => state.khalti.status);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const handleInitiatePayment = () => {
    if (!orderId || !totalAmount) {
      showToast("Please provide valid order details.", "error");
      return;
    }
    dispatch(khaltiPayment({
      paymentMethod: "khalti",
      paymentStatus: "unpaid",
      pidx: null,
      orderId,
      totalAmount: Number(totalAmount),
    }));
  };

  useEffect(() => {
    if (paymentUrl) {
      window.open(paymentUrl, "_blank");
      showToast("Payment initiated! Redirecting to Khalti...", "success");
    }
  }, [paymentUrl]);

  const formattedAmount = totalAmount
    ? `NPR ${Number(totalAmount).toLocaleString("en-NP")}`
    : null;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Libre+Baskerville:wght@400;700&display=swap');

        * { font-family: 'Plus Jakarta Sans', sans-serif; }
        .font-serif-custom { font-family: 'Libre Baskerville', serif; }

        /* === Keyframes only – nothing else here === */
        @keyframes cardIn {
          from { opacity: 0; transform: translateY(20px) scale(0.98); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(-6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulseDot {
          0%,100% { opacity:1; box-shadow: 0 0 0 0 rgba(61,184,112,0.5); }
          50%      { opacity:.7; box-shadow: 0 0 0 5px rgba(61,184,112,0); }
        }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes toastIn {
          from { opacity:0; transform: translateX(-50%) translateY(12px); }
          to   { opacity:1; transform: translateX(-50%) translateY(0); }
        }
        @keyframes shineMove {
          from { left: -60%; }
          to   { left: 130%; }
        }

        /* === Animation utility classes === */
        .animate-cardIn   { animation: cardIn 0.55s cubic-bezier(0.22,1,0.36,1) both; }
        .animate-fadeUp   { animation: fadeUp 0.3s ease both; }
        .animate-pulseDot { animation: pulseDot 2s ease-in-out infinite; }
        .animate-spin-arc { animation: spin 0.75s linear infinite; }
        .animate-toastIn  { animation: toastIn 0.35s cubic-bezier(0.22,1,0.36,1) both; }

        /* === Pseudo-element effects (impossible in Tailwind) === */
        /* Title green underline */
        .title-khalti {
          color: #3db870;
          position: relative;
        }
        .title-khalti::after {
          content: '';
          position: absolute;
          left: 0; right: 0; bottom: -3px;
          height: 2.5px;
          background: linear-gradient(90deg, #3db870, #6dd98c);
          border-radius: 99px;
        }

        /* Button shine sweep on hover */
        .btn-shine { position: relative; overflow: hidden; }
        .btn-shine::before {
          content: '';
          position: absolute;
          top: 0; left: -60%;
          width: 40%; height: 100%;
          background: rgba(255,255,255,0.18);
          transform: skewX(-20deg);
          transition: left 0.5s ease;
          pointer-events: none;
        }
        .btn-shine:hover:not(:disabled)::before {
          animation: shineMove 0.5s ease forwards;
        }

        /* Hide number input spinners */
        input[type=number]::-webkit-inner-spin-button,
        input[type=number]::-webkit-outer-spin-button { -webkit-appearance: none; }
        input[type=number] { -moz-appearance: textfield; }

        /* Decorative rings */
        .ring-deco {
          position: absolute;
          border-radius: 50%;
          pointer-events: none;
          border: 1.5px solid rgba(74,180,120,0.12);
        }
      `}</style>

      {/* ─── PAGE ─── */}
      <div
        className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden"
        style={{
          background: "#f0faf4",
          backgroundImage:
            "radial-gradient(ellipse 80% 60% at 20% 10%, rgba(134,210,172,0.25) 0%, transparent 60%), radial-gradient(ellipse 60% 50% at 80% 90%, rgba(74,180,120,0.15) 0%, transparent 60%)",
        }}
      >
        {/* Decorative rings */}
        <div className="ring-deco" style={{ width: 520, height: 520, top: -180, left: -180 }} />
        <div className="ring-deco" style={{ width: 340, height: 340, bottom: -120, right: -80, borderColor: "rgba(74,180,120,0.08)" }} />

        {/* ─── CARD ─── */}
        <div
          className="animate-cardIn relative w-full max-w-md rounded-3xl px-10 py-11 bg-white"
          style={{
            border: "1.5px solid rgba(74,180,120,0.2)",
            boxShadow: "0 4px 6px rgba(0,0,0,0.03), 0 20px 48px rgba(74,180,120,0.1), 0 1px 0 rgba(255,255,255,0.9) inset",
          }}
        >
          {/* Top shimmer strip */}
          <div
            className="absolute top-0 rounded-b-md"
            style={{ left: 40, right: 40, height: 3, background: "linear-gradient(90deg,#3db870,#6dd98c,#3db870)" }}
          />

          {/* ── HEADER ── */}
          <div className="mb-8">
            {/* Badge */}
            <div
              className="inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 mb-5"
              style={{ background: "#edfbf3", border: "1px solid rgba(61,184,112,0.3)" }}
            >
              <span className="animate-pulseDot w-2 h-2 rounded-full bg-green-500 block" />
              <span className="text-[10.5px] font-semibold uppercase tracking-[0.09em]" style={{ color: "#2a9558" }}>
                Secure Checkout
              </span>
            </div>

            {/* Title */}
            <h1 className="font-serif-custom text-[28px] font-bold leading-tight" style={{ color: "#1a3d2b", letterSpacing: "-0.3px" }}>
              Pay with <span className="title-khalti">Khalti</span>
            </h1>
            <p className="mt-2 text-[13.5px] font-light" style={{ color: "#7aab8e" }}>
              Digital wallet payments, fast &amp; reliable
            </p>
          </div>

          {/* Divider */}
          <div
            className="mb-7"
            style={{ height: 1, background: "linear-gradient(90deg,transparent,rgba(74,180,120,0.2),transparent)" }}
          />

          {/* ── ORDER ID ── */}
          <div className="mb-[18px]">
            <div className="flex items-center gap-1.5 text-[11.5px] font-bold uppercase tracking-[0.08em] mb-2" style={{ color: "#4a7a5e" }}>
              <span>🧾</span> Order ID
            </div>
            <input
              type="text"
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              onFocus={() => setFocused("order")}
              onBlur={() => setFocused(null)}
              placeholder="e.g. ORD-20240522-001"
              className="w-full rounded-xl px-4 py-[13px] text-[15px] outline-none transition-all duration-200"
              style={{
                background: focused === "order" ? "#fff" : "#f7fdf9",
                border: `1.5px solid ${focused === "order" ? "#3db870" : "#c8e8d5"}`,
                boxShadow: focused === "order" ? "0 0 0 3px rgba(61,184,112,0.12)" : "none",
                color: "#1a3d2b",
              }}
            />
          </div>

          {/* ── AMOUNT ── */}
          <div className="mb-[18px]">
            <div className="flex items-center gap-1.5 text-[11.5px] font-bold uppercase tracking-[0.08em] mb-2" style={{ color: "#4a7a5e" }}>
              <span>💵</span> Amount (NPR)
            </div>
            <div className="relative">
              <input
                type="number"
                value={totalAmount}
                onChange={(e) => setTotalAmount(e.target.value)}
                onFocus={() => setFocused("amount")}
                onBlur={() => setFocused(null)}
                placeholder="0.00"
                className="w-full rounded-xl px-4 py-[13px] text-[15px] outline-none transition-all duration-200"
                style={{
                  paddingRight: formattedAmount && focused !== "amount" ? 112 : 16,
                  background: focused === "amount" ? "#fff" : "#f7fdf9",
                  border: `1.5px solid ${focused === "amount" ? "#3db870" : "#c8e8d5"}`,
                  boxShadow: focused === "amount" ? "0 0 0 3px rgba(61,184,112,0.12)" : "none",
                  color: "#1a3d2b",
                }}
              />
              {formattedAmount && focused !== "amount" && (
                <span
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[12px] font-semibold pointer-events-none"
                  style={{ color: "#3db870" }}
                >
                  {formattedAmount}
                </span>
              )}
            </div>
          </div>

          {/* ── SUMMARY ── */}
          {orderId && totalAmount && (
            <div
              className="animate-fadeUp flex items-center justify-between rounded-2xl px-5 py-4 mb-[22px]"
              style={{
                background: "linear-gradient(135deg,#edfbf3,#f4fdf7)",
                border: "1.5px solid rgba(61,184,112,0.25)",
              }}
            >
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.07em]" style={{ color: "#7aab8e" }}>Paying for</p>
                <p className="text-[13px] font-semibold mt-0.5" style={{ color: "#2a6645" }}>{orderId}</p>
              </div>
              <p className="font-serif-custom text-[20px] font-bold" style={{ color: "#2a9558" }}>{formattedAmount}</p>
            </div>
          )}

          {/* ── BUTTON ── */}
          <button
            onClick={handleInitiatePayment}
            disabled={status === "loading"}
            className="btn-shine w-full flex items-center justify-center gap-2.5 text-white text-[15px] font-bold rounded-2xl py-[15px] transition-all duration-150 disabled:opacity-60 disabled:cursor-not-allowed"
            style={{
              background: "linear-gradient(160deg,#3db870,#28a05a)",
              boxShadow: "0 6px 20px rgba(45,160,90,0.35), 0 1px 0 rgba(255,255,255,0.2) inset",
              letterSpacing: "0.02em",
            }}
            onMouseEnter={(e) => {
              if (status !== "loading") {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = "0 10px 28px rgba(45,160,90,0.42), 0 1px 0 rgba(255,255,255,0.2) inset";
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 6px 20px rgba(45,160,90,0.35), 0 1px 0 rgba(255,255,255,0.2) inset";
            }}
          >
            {status === "loading" ? (
              <>
                <span className="animate-spin-arc inline-block w-[17px] h-[17px] rounded-full border-2 border-white/30 border-t-white" />
                Processing...
              </>
            ) : (
              <>
                <span>⚡</span> Initiate Payment
              </>
            )}
          </button>

          {/* ── RESULTS ── */}
          {(paymentUrl || pidx) && (
            <div className="mt-[22px] space-y-2.5" style={{ animation: "fadeUp 0.4s ease both" }}>
              {paymentUrl && (
                <div
                  className="rounded-xl px-4 py-[13px]"
                  style={{ background: "#f7fdf9", border: "1.5px solid #c8e8d5" }}
                >
                  <p className="text-[10.5px] font-semibold uppercase tracking-[0.08em] mb-1.5" style={{ color: "#7aab8e" }}>
                    Payment URL
                  </p>
                  <a
                    href={paymentUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[13px] break-all hover:underline"
                    style={{ color: "#2a9558" }}
                  >
                    {paymentUrl.length > 50 ? paymentUrl.slice(0, 50) + "…" : paymentUrl}
                  </a>
                </div>
              )}
              {pidx && (
                <div
                  className="rounded-xl px-4 py-[13px]"
                  style={{ background: "#f7fdf9", border: "1.5px solid #c8e8d5" }}
                >
                  <p className="text-[10.5px] font-semibold uppercase tracking-[0.08em] mb-1.5" style={{ color: "#7aab8e" }}>
                    Transaction ID (pidx)
                  </p>
                  <span
                    className="inline-block rounded-lg px-[11px] py-1 text-[12.5px]"
                    style={{
                      fontFamily: "'Courier New', monospace",
                      background: "#edfbf3",
                      border: "1px solid rgba(61,184,112,0.3)",
                      color: "#2a9558",
                      letterSpacing: "0.04em",
                    }}
                  >
                    {pidx}
                  </span>
                </div>
              )}
            </div>
          )}

          {/* ── FOOTER ── */}
          <div className="mt-[26px] flex items-center justify-center gap-1.5">
            <span className="text-[11px]">🔒</span>
            <span className="text-[11.5px] font-light" style={{ color: "#aacbb8" }}>Secured by</span>
            <span className="text-[12px] font-extrabold" style={{ color: "#3db870" }}>Khalti</span>
            <span className="text-[11.5px] font-light" style={{ color: "#aacbb8" }}>· 256-bit SSL</span>
          </div>
        </div>
      </div>

      {/* ─── TOAST ─── */}
      {toast && (
        <div
          className="animate-toastIn fixed bottom-7 left-1/2 flex items-center gap-2.5 rounded-full px-5 py-3 text-[13.5px] font-medium bg-white"
          style={{
            transform: "translateX(-50%)",
            border: toast.type === "error" ? "1.5px solid #fca5a5" : "1.5px solid #c8e8d5",
            color: toast.type === "error" ? "#b91c1c" : "#1a3d2b",
            boxShadow: "0 12px 36px rgba(74,180,120,0.2)",
            zIndex: 999,
            whiteSpace: "nowrap",
          }}
        >
          <span>{toast.type === "error" ? "⚠️" : "✅"}</span>
          {toast.message}
        </div>
      )}
    </>
  );
};

export default KhaltiPayment;
