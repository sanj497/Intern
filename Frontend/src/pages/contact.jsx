import React, { useState } from "react";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you can add form submission logic (e.g., send to API)
    setSubmitted(true);
  };

  return (
    <div style={styles.container}>
      {/* Navbar */}
      <nav style={styles.navbar}>
        <h1 style={styles.logo}>Granny_SB</h1>
        <div style={styles.navLinks}>
          <a href="/" style={styles.link}>Home</a>
          <a href="/products" style={styles.link}>Shop</a>
          <a href="/about" style={styles.link}>About</a>
          <a href="/contact" style={{ ...styles.link, fontWeight: "700", borderBottom: "2px solid #a57c6d" }}>Contact</a>
        </div>
      </nav>

      {/* Contact Form Section */}
      <section style={styles.contactSection}>
        <h2 style={styles.heading}>Get in Touch</h2>
        <p style={styles.description}>
          Have questions or want to share your crochet stories? We’d love to hear from you!
        </p>

        {!submitted ? (
          <form style={styles.form} onSubmit={handleSubmit} noValidate>
            <label htmlFor="name" style={styles.label}>Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Your full name"
              style={styles.input}
            />

            <label htmlFor="email" style={styles.label}>Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="your.email@example.com"
              style={styles.input}
            />

            <label htmlFor="message" style={styles.label}>Message</label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              required
              placeholder="Write your message here..."
              rows="5"
              style={{ ...styles.input, resize: "vertical" }}
            ></textarea>

            <button type="submit" style={styles.submitButton}>
              Send Message
            </button>
          </form>
        ) : (
          <p style={styles.thankYouMessage}>
            Thanks for reaching out! We’ll get back to you soon.
          </p>
        )}
      </section>

      {/* Footer */}
      <footer style={styles.footer}>
        <p>© 2025 Granny_SB. All rights reserved.</p>
        <p>
          Follow us on
          <a href="https://www.instagram.com" target="_blank" rel="noreferrer" style={styles.footerLink}> Instagram</a> &amp; 
          <a href="https://www.facebook.com" target="_blank" rel="noreferrer" style={styles.footerLink}> Facebook</a>
        </p>
      </footer>
    </div>
  );
};

export default Contact;

const styles = {
  container: {
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    backgroundColor: "#f5f0eb",
    color: "#5a4d41",
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
  },
  navbar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "1rem 2rem",
    backgroundColor: "#d7c6b8",
    boxShadow: "0 2px 5px rgba(90, 77, 65, 0.15)",
  },
  logo: {
    fontSize: "1.8rem",
    fontWeight: "bold",
    color: "#a57c6d",
  },
  navLinks: {
    display: "flex",
    gap: "1.5rem",
  },
  link: {
    textDecoration: "none",
    color: "#7d6858",
    fontWeight: "500",
    transition: "color 0.3s ease",
    cursor: "pointer",
  },
  contactSection: {
    flexGrow: 1,
    maxWidth: "700px",
    margin: "3rem auto",
    padding: "2rem 3rem",
    backgroundColor: "#fff9f4",
    borderRadius: "15px",
    boxShadow: "0 4px 15px rgba(165, 124, 109, 0.1)",
    textAlign: "center",
  },
  heading: {
    fontSize: "2.8rem",
    marginBottom: "1rem",
    color: "#a57c6d",
  },
  description: {
    fontSize: "1.2rem",
    marginBottom: "2rem",
    color: "#7d6858",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "1.3rem",
    textAlign: "left",
  },
  label: {
    fontWeight: "600",
    fontSize: "1rem",
    marginBottom: "0.3rem",
  },
  input: {
    padding: "12px 16px",
    borderRadius: "8px",
    border: "1.5px solid #c1ad9b",
    fontSize: "1rem",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    color: "#5a4d41",
    outline: "none",
    transition: "border-color 0.3s ease",
  },
  submitButton: {
    marginTop: "1rem",
    padding: "14px 0",
    backgroundColor: "#a57c6d",
    border: "none",
    borderRadius: "30px",
    color: "#fff",
    fontWeight: "700",
    fontSize: "1.1rem",
    cursor: "pointer",
    transition: "background-color 0.3s ease",
  },
  thankYouMessage: {
    fontSize: "1.2rem",
    color: "#6b5b4c",
    fontWeight: "600",
  },
  footer: {
    backgroundColor: "#d7c6b8",
    textAlign: "center",
    padding: "1.5rem",
    fontSize: "0.9rem",
    color: "#5a4d41",
    marginTop: "3rem",
  },
  footerLink: {
    marginLeft: "0.3rem",
    color: "#a57c6d",
    textDecoration: "none",
    cursor: "pointer",
  },
};
