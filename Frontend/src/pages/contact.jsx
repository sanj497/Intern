import React, { useState } from "react";
import axios from "axios";
import Navbar from "../Components/Navbar";

const Contact = () => {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError("");
    try {
      await axios.post("http://localhost:5000/api/contact", form);
      setSubmitted(true);
    } catch (err) {
      setError("❌ Failed to send message. Please try again.");
    } finally { setLoading(false); }
  };

  const inputStyle = { padding: "12px 16px", borderRadius: 8, border: "1.5px solid #c1ad9b", fontSize: "1rem", color: "#5a4d41", outline: "none", width: "100%", boxSizing: "border-box" };

  return (
    <div style={{ fontFamily: "'Segoe UI',sans-serif", backgroundColor: "#f5f0eb", color: "#5a4d41", minHeight: "100vh" }}>
      <Navbar activePage="contact" />
      <section style={{ maxWidth: 700, margin: "3rem auto", padding: "2rem 3rem", backgroundColor: "#fff9f4", borderRadius: 15, boxShadow: "0 4px 15px rgba(165,124,109,0.1)", textAlign: "center" }}>
        <h2 style={{ fontSize: "2.8rem", marginBottom: "1rem", color: "#a57c6d", fontFamily: "'Brush Script MT',cursive" }}>Get in Touch</h2>
        <p style={{ fontSize: "1.1rem", marginBottom: "2rem", color: "#7d6858" }}>Have questions? We'd love to hear from you!</p>
        {error && <div style={{ color: "#b71c1c", marginBottom: "1rem", fontWeight: 500 }}>{error}</div>}
        {!submitted ? (
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.3rem", textAlign: "left" }}>
            {[{ n: "name", l: "Name", t: "text", p: "Your full name" }, { n: "email", l: "Email", t: "email", p: "your@email.com" }].map(f => (
              <div key={f.n}>
                <label style={{ fontWeight: 600, fontSize: "1rem", display: "block", marginBottom: "0.3rem" }}>{f.l}</label>
                <input type={f.t} placeholder={f.p} value={form[f.n]} onChange={e => setForm({ ...form, [f.n]: e.target.value })} required style={inputStyle} />
              </div>
            ))}
            <div>
              <label style={{ fontWeight: 600, fontSize: "1rem", display: "block", marginBottom: "0.3rem" }}>Message</label>
              <textarea placeholder="Write your message..." rows={5} value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} required style={{ ...inputStyle, resize: "vertical" }} />
            </div>
            <button type="submit" disabled={loading}
              style={{ padding: "14px 0", backgroundColor: "#a57c6d", border: "none", borderRadius: 30, color: "#fff", fontWeight: 700, fontSize: "1.1rem", cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.7 : 1 }}>
              {loading ? "Sending..." : "Send Message"}
            </button>
          </form>
        ) : (
          <div style={{ padding: "3rem", background: "#fff0f6", borderRadius: 16 }}>
            <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>✅</div>
            <p style={{ fontSize: "1.2rem", color: "#6b5b4c", fontWeight: 600 }}>Thanks! We'll get back to you soon.</p>
          </div>
        )}
      </section>
      <footer style={{ backgroundColor: "#d7c6b8", textAlign: "center", padding: "1.5rem", fontSize: "0.9rem", color: "#5a4d41" }}>
        <p>© 2025 Granny_SB. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Contact;
