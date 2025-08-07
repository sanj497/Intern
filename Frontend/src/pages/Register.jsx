import React, { useState } from "react";

const Register = () => {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    role: "user", // default role
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const contentType = res.headers.get("content-type");

      if (!res.ok) {
        if (contentType && contentType.includes("application/json")) {
          const errorData = await res.json();
          setMessage(errorData.message || "Something went wrong.");
        } else {
          const errorText = await res.text();
          console.error("Server returned non-JSON response:", errorText);
          setMessage("Unexpected server response.");
        }
        return;
      }

      const data = await res.json();
      setMessage("✅ Registered successfully!");
      setForm({ username: "", email: "", password: "", role: "user" });
    } catch (error) {
      console.error("Registration error:", error);
      setMessage("Server error. Please try again later.");
    }
  };

  return (
    <>
      <style>{`
        .register-container {
          min-height: 100vh;
          background: linear-gradient(to right, #d0f0fd, #a3c4f3);
          display: flex;
          justify-content: center;
          align-items: center;
          font-family: 'Segoe UI', sans-serif;
        }

        .register-box {
          background-color: #fff;
          padding: 40px;
          border-radius: 12px;
          width: 100%;
          max-width: 400px;
          box-shadow: 0 12px 30px rgba(0, 0, 0, 0.1);
        }

        .register-title {
          text-align: center;
          font-size: 28px;
          font-weight: bold;
          color: #1e293b;
          margin-bottom: 24px;
        }

        .form-group {
          margin-bottom: 18px;
        }

        .form-label {
          font-size: 14px;
          color: #374151;
          margin-bottom: 6px;
          display: block;
        }

        .form-input, .form-select {
          width: 100%;
          padding: 10px 14px;
          font-size: 15px;
          border: 1px solid #cbd5e1;
          border-radius: 8px;
          outline: none;
        }

        .form-input:focus, .form-select:focus {
          border-color: #3b82f6;
        }

        .register-button {
          width: 100%;
          padding: 12px;
          font-size: 16px;
          font-weight: 600;
          background-color: #3b82f6;
          color: white;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          transition: background-color 0.3s ease;
        }

        .register-button:hover {
          background-color: #2563eb;
        }

        .register-message {
          text-align: center;
          margin-top: 16px;
          font-weight: 500;
          color: #16a34a;
        }

        .register-error {
          color: #dc2626;
        }
      `}</style>

      <div className="register-container">
        <form className="register-box" onSubmit={handleSubmit}>
          <h2 className="register-title">Create an Account</h2>

          <div className="form-group">
            <label className="form-label">Username</label>
            <input
              type="text"
              name="username"
              className="form-input"
              placeholder="Your username"
              value={form.username}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              name="email"
              className="form-input"
              placeholder="you@example.com"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              name="password"
              className="form-input"
              placeholder="••••••••"
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Role</label>
            <select
              name="role"
              className="form-select"
              value={form.role}
              onChange={handleChange}
              required
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <button type="submit" className="register-button">Register</button>

          {message && (
            <div className={`register-message ${message.startsWith("✅") ? "" : "register-error"}`}>
              {message}
            </div>
          )}
        </form>
      </div>
    </>
  );
};

export default Register;
