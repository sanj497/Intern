import React from "react";

const Home = () => {
  return (
    <div style={styles.container}>
      {/* Navbar */}
      <nav style={styles.navbar}>
        <div style={styles.logo}>Granny_SB</div>
        <div style={styles.navLinks}>
          <a href="/" style={styles.navLink}>Home</a>
          <a href="/products" style={styles.navLink}>Shop</a>
          <a href="/about" style={styles.navLink}>About</a>
          <a href="/contact" style={styles.navLink}>Contact</a>
        </div>
      </nav>

      {/* Hero Section */}
      <section style={styles.hero}>
        <img
          src="https://i.pinimg.com/736x/4a/7b/07/4a7b07f0d799cb908ccf9624f16b303c.jpg"
          alt="Crochet"
          style={styles.heroImage}
        />
        <div style={styles.heroOverlay}></div>
        <div style={styles.heroContent}>
          <h1 style={styles.heroTitle}>Welcome to Granny_SB</h1>
          <p style={styles.heroSubtitle}>Where crochet meets love and tradition.</p>
          <a href="/product" style={styles.ctaButton}>Shop Now</a>
        </div>
      </section>

      {/* Features */}
      <section style={styles.featuresSection}>
        <h2 style={styles.sectionTitle}>Our Promise</h2>
        <div style={styles.features}>
          <div style={styles.featureBox} className="feature-hover">
            <h3>🌿 Eco-Friendly</h3>
            <p>Made with sustainable materials to protect the planet.</p>
          </div>
          <div style={styles.featureBox} className="feature-hover">
            <h3>🧶 Premium Yarn</h3>
            <p>We use only the softest, highest quality yarns.</p>
          </div>
          <div style={styles.featureBox} className="feature-hover">
            <h3>🧵 Handmade Love</h3>
            <p>Each piece is lovingly handcrafted just for you.</p>
          </div>
        </div>
      </section>

      {/* Commitment */}
      <section style={styles.commitment}>
        <h2 style={styles.sectionTitle}>Our Commitment</h2>
        <p style={styles.commitmentText}>
          At Granny_SB, we are committed to keeping the art of crochet alive through sustainable, handmade, and heartwarming pieces that bring joy and comfort to every home.
        </p>
      </section>

      {/* Footer */}
      <footer style={styles.footer}>
        <p>© 2025 Granny_SB. All rights reserved.</p>
        <p>Follow us on Instagram: <a href="#" style={{ color: "#fff", textDecoration: "underline" }}>@granny_sb</a></p>
      </footer>

      {/* Embedded CSS for hover */}
      <style>
        {`
          .feature-hover:hover {
            transform: scale(1.05);
            background-color: #f0e6ff;
            box-shadow: 0 4px 20px rgba(0,0,0,0.2);
            cursor: pointer;
            transition: all 0.3s ease-in-out;
          }
        `}
      </style>
    </div>
  );
};

// Styles
const styles = {
  container: {
    fontFamily: "'Segoe UI', sans-serif",
    backgroundColor: "#fff5f8",
    color: "#333",
  },
  navbar: {
    backgroundColor: "#ffffff",
    display: "flex",
    justifyContent: "space-between",
    padding: "1rem 2rem",
    alignItems: "center",
    boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
    position: "sticky",
    top: 0,
    zIndex: 1000,
  },
  logo: {
    fontSize: "1.8rem",
    fontWeight: "bold",
    color: "#d96fa6",
    fontFamily: "'Playfair Display', serif",
  },
  navLinks: {
    display: "flex",
    gap: "1.5rem",
  },
  navLink: {
    color: "#333",
    textDecoration: "none",
    fontWeight: "500",
    fontSize: "1rem",
  },
  hero: {
    position: "relative",
    height: "80vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    borderBottomLeftRadius: "30px",
    borderBottomRightRadius: "30px",
  },
  heroImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    position: "absolute",
    top: 0,
    left: 0,
    zIndex: 0,
    filter: "brightness(60%)",
  },
  heroOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    height: "100%",
    width: "100%",
    backgroundColor: "rgba(0,0,0,0.3)",
    zIndex: 1,
  },
  heroContent: {
    position: "relative",
    zIndex: 2,
    color: "#fff",
    textAlign: "center",
    padding: "0 2rem",
  },
  heroTitle: {
    fontSize: "3rem",
    fontWeight: "bold",
    marginBottom: "1rem",
  },
  heroSubtitle: {
    fontSize: "1.3rem",
    marginBottom: "1.5rem",
  },
  ctaButton: {
    backgroundColor: "#d96fa6",
    color: "#fff",
    padding: "0.8rem 2rem",
    fontSize: "1rem",
    borderRadius: "25px",
    textDecoration: "none",
    boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
  },
  featuresSection: {
    padding: "4rem 2rem",
    backgroundColor: "#fff",
    textAlign: "center",
  },
  sectionTitle: {
    fontSize: "2rem",
    marginBottom: "2rem",
    color: "#d96fa6",
    fontFamily: "'Playfair Display', serif",
  },
  features: {
    display: "flex",
    justifyContent: "center",
    gap: "2rem",
    flexWrap: "wrap",
  },
  featureBox: {
    backgroundColor: "#fff0f6",
    padding: "2rem",
    borderRadius: "15px",
    width: "250px",
    transition: "all 0.3s ease",
  },
  commitment: {
    padding: "3rem 2rem",
    textAlign: "center",
    backgroundColor: "#fce4ec",
  },
  commitmentText: {
    fontSize: "1.2rem",
    maxWidth: "700px",
    margin: "0 auto",
    lineHeight: "1.6",
  },
  footer: {
    backgroundColor: "#d96fa6",
    color: "#fff",
    textAlign: "center",
    padding: "2rem",
    marginTop: "3rem",
    borderTopLeftRadius: "30px",
    borderTopRightRadius: "30px",
  },
};

export default Home;
