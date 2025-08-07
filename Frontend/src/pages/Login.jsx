import React, { useState } from "react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();

    // Simple validation (you can replace this with real auth later)
    if (!email || !password) {
      setMessage("Please enter both email and password.");
    } else if (!email.includes("@")) {
      setMessage("Please enter a valid email address.");
    } else if (password.length < 6) {
      setMessage("Password must be at least 6 characters.");
    } else {
      setMessage("✅ Login successful! ");
      // Redirect or API call here
    }
  };

  return (
    <>
      <style>
        {`
          .login-container {
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            background: linear-gradient(to right, #c2e9fb, #a1c4fd);
            font-family: 'Segoe UI', sans-serif;
          }

          .login-box {
            background-color: #fff;
            padding: 40px;
            border-radius: 12px;
            width: 100%;
            max-width: 400px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
          }

          .login-title {
            font-size: 28px;
            font-weight: bold;
            color: #1e293b;
            text-align: center;
            margin-bottom: 20px;
          }

          .form-group {
            margin-bottom: 20px;
          }

          .form-label {
            font-size: 14px;
            margin-bottom: 6px;
            color: #374151;
            display: block;
          }

          .form-input {
            width: 100%;
            padding: 10px 14px;
            border-radius: 8px;
            border: 1px solid #cbd5e1;
            font-size: 16px;
            outline: none;
          }

          .form-input:focus {
            border-color: #3b82f6;
          }

          .login-button {
            width: 100%;
            padding: 12px;
            background-color: #3b82f6;
            color: white;
            font-size: 16px;
            font-weight: 600;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            transition: background-color 0.3s ease;
          }

          .login-button:hover {
            background-color: #2563eb;
          }

          .login-footer {
            text-align: center;
            margin-top: 20px;
            font-size: 14px;
            color: #475569;
          }

          .login-footer a {
            color: #3b82f6;
            text-decoration: none;
          }

          .login-footer a:hover {
            text-decoration: underline;
          }

          .login-message {
            margin-bottom: 16px;
            color: #dc2626;
            text-align: center;
            font-weight: 500;
          }

          .login-success {
            color: #16a34a;
          }
        `}
      </style>

      <div className="login-container">
        <form className="login-box" onSubmit={handleLogin}>
          <h2 className="login-title">Login to SmartTech</h2>

          {message && (
            <div className={`login-message ${message.startsWith("✅") ? "login-success" : ""}`}>
              {message}
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              className="form-input"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-input"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="login-button">
            Login
          </button>

          <div className="login-footer">
            <p>
              Don't have an account? <a href="/register">Register</a>
            </p>
            <p>
              <a href="/forgot-password">Forgot Password?</a>
            </p>
          </div>
        </form>
      </div>
    </>
  );
};

export default Login;
