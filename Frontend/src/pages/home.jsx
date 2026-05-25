import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();
  const [showLogin, setShowLogin] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      const { data } = await axios.post(
        "http://localhost:5000/api/auth/login",
        {
          email,
          password,
        }
      );

      localStorage.setItem("token", data.token);
      localStorage.setItem("userId", data.user.id);
      localStorage.setItem("username", data.user.username);
      localStorage.setItem("role", data.user.role);

      setMessage("✅ Login successful!");

      setTimeout(() => {
        setShowLogin(false);

        navigate(
          data.user.role === "admin"
            ? "/admin/dashboard"
            : "/dashboard"
        );
      }, 700);
    } catch (err) {
      setMessage(
        "❌ " + (err.response?.data?.msg || "Login failed.")
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        fontFamily: "'Segoe UI', sans-serif",
        backgroundColor: "#fff5f8",
        color: "#333",
        margin: 0,
        padding: 0,
      }}
    >
      {/* ── NAVBAR — Login & Register only ── */}
      <nav
        style={{
          background: "#fff",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "1rem 2.5rem",
          boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
          position: "sticky",
          top: 0,
          zIndex: 500,
        }}
      >
        <div
          style={{
            fontSize: "1.9rem",
            fontWeight: "bold",
            color: "#d96fa6",
            fontFamily: "'Brush Script MT', cursive",
          }}
        >
          🧵 granny_SB
        </div>

        <div
          style={{
            display: "flex",
            gap: "1rem",
            alignItems: "center",
          }}
        >
          <button
            onClick={() => setShowLogin(true)}
            style={{
              padding: "8px 20px",
              borderRadius: 25,
              background: "#fff",
              color: "#d96fa6",
              border: "2px solid #d96fa6",
              fontWeight: 600,
              fontSize: "0.9rem",
              cursor: "pointer",
            }}
            onMouseEnter={(e) => {
              e.target.style.background = "#d96fa6";
              e.target.style.color = "#fff";
            }}
            onMouseLeave={(e) => {
              e.target.style.background = "#fff";
              e.target.style.color = "#d96fa6";
            }}
          >
            Login
          </button>

          <Link
            to="/register"
            style={{
              padding: "8px 20px",
              borderRadius: 25,
              background: "#d96fa6",
              color: "#fff",
              fontWeight: 600,
              fontSize: "0.9rem",
              textDecoration: "none",
            }}
          >
            Register
          </Link>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section
        style={{
          position: "relative",
          height: "88vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
        }}
      >
        <img
          src="https://i.pinimg.com/736x/4a/7b/07/4a7b07f0d799cb908ccf9624f16b303c.jpg"
          alt="Crochet collection"
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            filter: "brightness(55%)",
          }}
        />

        <div
          style={{
            position: "relative",
            zIndex: 2,
            textAlign: "center",
            color: "#fff",
            padding: "0 2rem",
            maxWidth: "700px",
          }}
        >
          <span
            style={{
              display: "inline-block",
              background: "rgba(217,111,166,0.85)",
              color: "#fff",
              fontSize: "0.78rem",
              fontWeight: 600,
              letterSpacing: "2px",
              textTransform: "uppercase",
              padding: "6px 18px",
              borderRadius: "20px",
              marginBottom: "1.2rem",
            }}
          >
            Handmade with Love
          </span>

          <h1
            style={{
              fontSize: "clamp(2.2rem, 5vw, 3.8rem)",
              fontWeight: 800,
              lineHeight: 1.15,
              marginBottom: "1rem",
              textShadow: "0 2px 12px rgba(0,0,0,0.3)",
            }}
          >
            Welcome to Granny_SB
          </h1>

          <p
            style={{
              fontSize: "1.2rem",
              opacity: 0.9,
              marginBottom: "2rem",
              lineHeight: 1.5,
            }}
          >
            Where crochet meets tradition. Each piece crafted with care,
            just for you.
          </p>

          <div
            style={{
              display: "flex",
              gap: "1rem",
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <button
              onClick={() => setShowLogin(true)}
              style={{
                background: "rgba(255,255,255,0.15)",
                color: "#fff",
                padding: "14px 36px",
                borderRadius: "30px",
                fontWeight: 600,
                fontSize: "1rem",
                border: "2px solid rgba(255,255,255,0.6)",
                cursor: "pointer",
              }}
            >
              Sign In
            </button>
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section
        style={{
          padding: "5rem 2rem",
          backgroundColor: "#fff",
          textAlign: "center",
        }}
      >
        <h2
          style={{
            fontSize: "2.2rem",
            color: "#d96fa6",
            marginBottom: "0.5rem",
            fontFamily: "'Brush Script MT', cursive",
          }}
        >
          Our Promise
        </h2>

        <p
          style={{
            color: "#888",
            marginBottom: "3rem",
          }}
        >
          Quality, care, and craftsmanship in every stitch
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "1.5rem",
            maxWidth: "1000px",
            margin: "0 auto",
          }}
        >
          {[
            {
              icon: "🌿",
              title: "Eco-Friendly",
              text: "Made with sustainable materials to protect our planet.",
            },
            {
              icon: "🧶",
              title: "Premium Yarn",
              text: "Only the softest, highest quality yarns sourced with care.",
            },
            {
              icon: "🧵",
              title: "Handmade Love",
              text: "Each piece lovingly handcrafted by skilled artisans.",
            },
            {
              icon: "📦",
              title: "Fast Delivery",
              text: "Carefully packed and delivered right to your doorstep.",
            },
          ].map((f) => (
            <div
              key={f.title}
              style={{
                background: "#fff0f6",
                padding: "2rem 1.5rem",
                borderRadius: "20px",
                cursor: "default",
                transition: "transform 0.3s, box-shadow 0.3s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-6px)";
                e.currentTarget.style.boxShadow =
                  "0 10px 30px rgba(217,111,166,0.2)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "none";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              <div
                style={{
                  fontSize: "2.5rem",
                  marginBottom: "1rem",
                }}
              >
                {f.icon}
              </div>

              <h3
                style={{
                  fontSize: "1.1rem",
                  color: "#333",
                  marginBottom: "0.5rem",
                }}
              >
                {f.title}
              </h3>

              <p
                style={{
                  fontSize: "0.9rem",
                  color: "#777",
                  lineHeight: 1.5,
                }}
              >
                {f.text}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section
        style={{
          background: "linear-gradient(135deg, #d96fa6, #f48fb1)",
          padding: "5rem 2rem",
          textAlign: "center",
          color: "#fff",
        }}
      >
        <h2
          style={{
            fontSize: "2.2rem",
            fontWeight: 700,
            marginBottom: "1rem",
          }}
        >
          Ready to find your perfect piece?
        </h2>

        <p
          style={{
            fontSize: "1.1rem",
            opacity: 0.9,
            marginBottom: "2rem",
            maxWidth: "500px",
            margin: "0 auto 2rem",
          }}
        >
          Browse our full handmade crochet collection.
        </p>

        <button
          onClick={() => setShowLogin(true)}
          style={{
            background: "#fff",
            color: "#d96fa6",
            padding: "14px 40px",
            borderRadius: "30px",
            fontWeight: 700,
            fontSize: "1rem",
            border: "none",
            cursor: "pointer",
          }}
        >
          Login & Shop
        </button>
      </section>

      {/* ── FOOTER ── */}
      <footer
        style={{
          backgroundColor: "#2d2d2d",
          color: "#ccc",
          textAlign: "center",
          padding: "2.5rem 2rem",
        }}
      >
        <p
          style={{
            marginBottom: "0.5rem",
            fontSize: "0.9rem",
          }}
        >
          © 2025 granny_SB. All rights reserved.
        </p>

        <p style={{ fontSize: "0.9rem" }}>
          Follow us:{" "}
          <a
            href="https://www.instagram.com/granny_sb/"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: "#f48fb1",
              textDecoration: "none",
            }}
          >
            @granny_sb
          </a>
        </p>
      </footer>

      {/* ── LOGIN MODAL ── */}
      {showLogin && (
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowLogin(false);
              setMessage("");
            }
          }}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.5)",
            zIndex: 999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backdropFilter: "blur(3px)",
          }}
        >
          <div
            style={{
              background: "#fff",
              padding: "2.5rem",
              borderRadius: "20px",
              width: "100%",
              maxWidth: "420px",
              margin: "1rem",
              boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
              boxSizing: "border-box",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "1.5rem",
              }}
            >
              <h2
                style={{
                  fontSize: "1.6rem",
                  fontWeight: 700,
                  color: "#1e293b",
                  margin: 0,
                }}
              >
                Welcome back 👋
              </h2>

              <button
                onClick={() => {
                  setShowLogin(false);
                  setMessage("");
                }}
                style={{
                  background: "#f1f5f9",
                  border: "none",
                  borderRadius: "50%",
                  width: 32,
                  height: 32,
                  cursor: "pointer",
                  fontSize: "1rem",
                }}
              >
                ✕
              </button>
            </div>

            {message && (
              <div
                style={{
                  marginBottom: "1rem",
                  textAlign: "center",
                  fontWeight: 500,
                  fontSize: "0.9rem",
                  color: message.startsWith("✅")
                    ? "#16a34a"
                    : "#dc2626",
                }}
              >
                {message}
              </div>
            )}

            <form onSubmit={handleLogin}>
              {[
                {
                  label: "Email",
                  type: "email",
                  val: email,
                  set: setEmail,
                  ph: "you@example.com",
                },
                {
                  label: "Password",
                  type: "password",
                  val: password,
                  set: setPassword,
                  ph: "Enter your password",
                },
              ].map((f) => (
                <div
                  key={f.label}
                  style={{ marginBottom: "1.2rem" }}
                >
                  <label
                    style={{
                      display: "block",
                      fontSize: "0.85rem",
                      fontWeight: 500,
                      color: "#374151",
                      marginBottom: 6,
                    }}
                  >
                    {f.label}
                  </label>

                  <input
                    type={f.type}
                    placeholder={f.ph}
                    value={f.val}
                    onChange={(e) => f.set(e.target.value)}
                    required
                    style={{
                      width: "100%",
                      padding: "11px 14px",
                      borderRadius: "10px",
                      border: "1.5px solid #e2e8f0",
                      fontSize: "0.95rem",
                      outline: "none",
                      boxSizing: "border-box",
                    }}
                    onFocus={(e) =>
                      (e.target.style.borderColor = "#d96fa6")
                    }
                    onBlur={(e) =>
                      (e.target.style.borderColor = "#e2e8f0")
                    }
                  />
                </div>
              ))}

              <button
                type="submit"
                disabled={loading}
                style={{
                  width: "100%",
                  padding: 13,
                  background: "#d96fa6",
                  color: "#fff",
                  fontSize: "1rem",
                  fontWeight: 600,
                  border: "none",
                  borderRadius: "10px",
                  cursor: "pointer",
                }}
              >
                {loading ? "Logging in..." : "Login"}
              </button>
            </form>

            <div
              style={{
                textAlign: "center",
                marginTop: "1.2rem",
                fontSize: "0.88rem",
                color: "#64748b",
              }}
            >
              Don't have an account?{" "}
              <Link
                to="/register"
                onClick={() => setShowLogin(false)}
                style={{
                  color: "#d96fa6",
                  fontWeight: 500,
                }}
              >
                Register here
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;