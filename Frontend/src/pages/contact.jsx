import React, { useState } from "react";
import axios from "axios";
import Navbar from "../Components/Navbar";

const Contact = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      await axios.post("http://localhost:5000/api/contact", form);
      setSubmitted(true);
    } catch (err) {
      setError("❌ Failed to send message. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    padding: "11px 14px",
    borderRadius: 10,
    border: "1.5px solid #e2e8f0",
    fontSize: "0.95rem",
    color: "#333",
    outline: "none",
    width: "100%",
    boxSizing: "border-box",
    fontFamily: "'Segoe UI', sans-serif",
    transition: "border-color 0.2s",
  };

  return (
    <div
      style={{
        fontFamily: "'Segoe UI',sans-serif",
        backgroundColor: "#fff5f8",
        color: "#333",
        minHeight: "100vh",
      }}
    >
      <Navbar activePage="contact" />

      {/* Hero banner */}
      <div
        style={{
          background: "linear-gradient(135deg, #d96fa6, #f48fb1)",
          padding: "3rem 2rem",
          textAlign: "center",
          color: "#fff",
        }}
      >
        <h1
          style={{
            fontSize: "2.5rem",
            fontWeight: 800,
            marginBottom: "0.5rem",
          }}
        >
          Get in Touch 💬
        </h1>

        <p style={{ fontSize: "1.1rem", opacity: 0.9 }}>
          Have questions? We'd love to hear from you!
        </p>
      </div>

      <div
        style={{
          maxWidth: 900,
          margin: "3rem auto",
          padding: "0 1.5rem",
          display: "grid",
          gridTemplateColumns: "1fr 1.6fr",
          gap: "2rem",
          alignItems: "start",
        }}
      >
        {/* LEFT — info cards */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
          }}
        >
          {[
            {
              icon: "📍",
              title: "Our Location",
              text: "Laxmimarga, Nepal",
            },
            {
              icon: "📧",
              title: "Email Us",
              text: "grannysb@gmail.com",
            },
            {
              icon: "📞",
              title: "Call Us",
              text: "+977 9852059248",
            },
            {
              icon: "🕐",
              title: "Working Hours",
              text: "Sun – Fri: 9am – 6pm",
            },
          ].map((c) => (
            <div
              key={c.title}
              style={{
                background: "#fff",
                borderRadius: 16,
                padding: "1.2rem 1.4rem",
                boxShadow: "0 4px 15px rgba(217,111,166,0.08)",
                border: "1.5px solid #fce4ec",
                display: "flex",
                alignItems: "center",
                gap: "1rem",
              }}
            >
              <div
                style={{
                  width: 46,
                  height: 46,
                  borderRadius: "50%",
                  background: "#fff0f6",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "1.4rem",
                  flexShrink: 0,
                }}
              >
                {c.icon}
              </div>

              <div>
                <div
                  style={{
                    fontWeight: 700,
                    color: "#333",
                    fontSize: "0.9rem",
                    marginBottom: 2,
                  }}
                >
                  {c.title}
                </div>

                <div
                  style={{
                    color: "#888",
                    fontSize: "0.85rem",
                  }}
                >
                  {c.text}
                </div>
              </div>
            </div>
          ))}

          {/* Social links */}
          <div
            style={{
              background: "#fff",
              borderRadius: 16,
              padding: "1.2rem 1.4rem",
              boxShadow: "0 4px 15px rgba(217,111,166,0.08)",
              border: "1.5px solid #fce4ec",
            }}
          >
            <div
              style={{
                fontWeight: 700,
                color: "#333",
                fontSize: "0.9rem",
                marginBottom: "0.8rem",
              }}
            >
              Follow Us
            </div>

            <div
              style={{
                display: "flex",
                gap: "0.6rem",
                flexWrap: "wrap",
              }}
            >
              <a
                href="https://www.instagram.com/granny_sb/"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  fontSize: "0.75rem",
                  background: "#fff0f6",
                  color: "#d96fa6",
                  padding: "6px 10px",
                  borderRadius: 20,
                  textDecoration: "none",
                  fontWeight: 600,
                  border: "1px solid #fce4ec",
                }}
              >
                📸 Instagram
              </a>
            </div>
          </div>
        </div>

        {/* RIGHT — form */}
        <div
          style={{
            background: "#fff",
            borderRadius: 20,
            padding: "2rem",
            boxShadow: "0 4px 20px rgba(217,111,166,0.1)",
            border: "1.5px solid #fce4ec",
          }}
        >
          {!submitted ? (
            <>
              <h2
                style={{
                  fontSize: "1.4rem",
                  fontWeight: 700,
                  color: "#333",
                  marginBottom: "0.3rem",
                }}
              >
                Send us a message
              </h2>

              <p
                style={{
                  color: "#888",
                  fontSize: "0.9rem",
                  marginBottom: "1.5rem",
                }}
              >
                We'll get back to you within 24 hours.
              </p>

              {error && (
                <div
                  style={{
                    background: "#ffebee",
                    color: "#b71c1c",
                    padding: "10px 14px",
                    borderRadius: 10,
                    marginBottom: "1rem",
                    fontSize: "0.9rem",
                    fontWeight: 500,
                  }}
                >
                  {error}
                </div>
              )}

              <form
                onSubmit={handleSubmit}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "1.1rem",
                }}
              >
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "1rem",
                  }}
                >
                  <div>
                    <label
                      style={{
                        display: "block",
                        fontSize: "0.85rem",
                        fontWeight: 600,
                        color: "#374151",
                        marginBottom: 5,
                      }}
                    >
                      Full Name
                    </label>

                    <input
                      type="text"
                      placeholder="Your full name"
                      value={form.name}
                      onChange={(e) =>
                        setForm({ ...form, name: e.target.value })
                      }
                      required
                      style={inputStyle}
                      onFocus={(e) =>
                        (e.target.style.borderColor = "#d96fa6")
                      }
                      onBlur={(e) =>
                        (e.target.style.borderColor = "#e2e8f0")
                      }
                    />
                  </div>

                  <div>
                    <label
                      style={{
                        display: "block",
                        fontSize: "0.85rem",
                        fontWeight: 600,
                        color: "#374151",
                        marginBottom: 5,
                      }}
                    >
                      Email Address
                    </label>

                    <input
                      type="email"
                      placeholder="your@email.com"
                      value={form.email}
                      onChange={(e) =>
                        setForm({ ...form, email: e.target.value })
                      }
                      required
                      style={inputStyle}
                      onFocus={(e) =>
                        (e.target.style.borderColor = "#d96fa6")
                      }
                      onBlur={(e) =>
                        (e.target.style.borderColor = "#e2e8f0")
                      }
                    />
                  </div>
                </div>

                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "0.85rem",
                      fontWeight: 600,
                      color: "#374151",
                      marginBottom: 5,
                    }}
                  >
                    Message
                  </label>

                  <textarea
                    placeholder="Write your message here..."
                    rows={5}
                    value={form.message}
                    onChange={(e) =>
                      setForm({ ...form, message: e.target.value })
                    }
                    required
                    style={{
                      ...inputStyle,
                      resize: "vertical",
                    }}
                    onFocus={(e) =>
                      (e.target.style.borderColor = "#d96fa6")
                    }
                    onBlur={(e) =>
                      (e.target.style.borderColor = "#e2e8f0")
                    }
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    padding: "13px 0",
                    background: loading ? "#e8a0c0" : "#d96fa6",
                    border: "none",
                    borderRadius: 30,
                    color: "#fff",
                    fontWeight: 700,
                    fontSize: "1rem",
                    cursor: loading ? "not-allowed" : "pointer",
                    transition: "background 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    if (!loading) e.target.style.background = "#c2185b";
                  }}
                  onMouseLeave={(e) => {
                    if (!loading) e.target.style.background = "#d96fa6";
                  }}
                >
                  {loading ? "Sending..." : "Send Message 💌"}
                </button>
              </form>
            </>
          ) : (
            <div
              style={{
                textAlign: "center",
                padding: "3rem 1rem",
              }}
            >
              <div
                style={{
                  fontSize: "4rem",
                  marginBottom: "1rem",
                }}
              >
                🎉
              </div>

              <h2
                style={{
                  fontSize: "1.6rem",
                  fontWeight: 700,
                  color: "#333",
                  marginBottom: "0.5rem",
                }}
              >
                Message Sent!
              </h2>

              <p
                style={{
                  color: "#888",
                  fontSize: "1rem",
                  marginBottom: "2rem",
                }}
              >
                Thanks for reaching out! We'll get back to you within 24 hours.
              </p>

              <button
                onClick={() => {
                  setSubmitted(false);
                  setForm({
                    name: "",
                    email: "",
                    message: "",
                  });
                }}
                style={{
                  padding: "12px 28px",
                  background: "#fff0f6",
                  color: "#d96fa6",
                  border: "2px solid #d96fa6",
                  borderRadius: 25,
                  fontWeight: 600,
                  fontSize: "0.95rem",
                  cursor: "pointer",
                }}
              >
                Send Another Message
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer
        style={{
          backgroundColor: "#2d2d2d",
          color: "#ccc",
          textAlign: "center",
          padding: "2.5rem 2rem",
          marginTop: "3rem",
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
    </div>
  );
};

export default Contact;