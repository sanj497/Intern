import React from "react";

const About = () => {
  return (
    <div style={styles.container}>
      {/* Navbar */}
      <nav style={styles.navbar}>
        <h1 style={styles.logo}>Granny_SB</h1>
        <div style={styles.navLinks}>
          <a href="/" style={styles.link}>Home</a>
          <a href="/products" style={styles.link}>Shop</a>
          <a href="/about" style={{ ...styles.link, fontWeight: "700", borderBottom: "2px solid #a57c6d" }}>About</a>
          <a href="/contact" style={styles.link}>Contact</a>
        </div>
      </nav>

      {/* About Content */}
      <section style={styles.aboutSection}>
        <h2 style={styles.heading}>About Granny_SB</h2>

        <ContentBlock>
          <h3 style={styles.subheading}>Our Story</h3>
          <p style={styles.paragraph}>
            Granny_SB is born out of a passion for timeless crochet artistry, blending tradition with modern design. 
            Each piece is lovingly handcrafted by skilled artisans, using premium yarns that ensure softness and durability. 
            Our mission is to create crochet creations that bring warmth, joy, and a touch of elegance to your everyday life.
          </p>
        </ContentBlock>

        <ContentBlock>
          <h3 style={styles.subheading}>Founded</h3>
          <p style={styles.paragraph}>
            Established in 2025, Granny_SB started as a small family project inspired by our grandmother’s exquisite crochet work. 
            Over the years, it has grown into a beloved brand known for quality craftsmanship, sustainability, and heartfelt customer connections.
          </p>
        </ContentBlock>

        <ContentBlock>
          <h3 style={styles.subheading}>Sustainability Commitment</h3>
          <p style={styles.paragraph}>
            We are deeply committed to eco-friendly practices, sourcing sustainable yarns and using minimal waste production techniques. 
            Granny_SB believes in protecting the planet while delivering products that make you feel good inside and out.
          </p>
        </ContentBlock>

        <ContentBlock>
          <h3 style={styles.subheading}>Meet the Team</h3>
          <p style={styles.paragraph}>
            Our team is a group of passionate crochet enthusiasts, designers, and quality experts working together to bring you the best. 
            From pattern design to final finishing touches, we focus on every detail with love and care.
          </p>
        </ContentBlock>
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

// ContentBlock component for hover effect wrapper
const ContentBlock = ({ children }) => {
  const [hover, setHover] = React.useState(false);
  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        ...styles.contentBlock,
        boxShadow: hover
          ? "0 8px 20px rgba(165, 124, 109, 0.4)"
          : "0 4px 10px rgba(165, 124, 109, 0.15)",
        transform: hover ? "translateY(-6px)" : "translateY(0)",
        transition: "all 0.3s ease",
      }}
    >
      {children}
    </div>
  );
};

export default About;

const styles = {
  container: {
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    backgroundColor: "#f5f0eb", // soft nude-beige background
    color: "#5a4d41", // warm dark brown text
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
  },
  navbar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "1rem 2rem",
    backgroundColor: "#d7c6b8", // muted nude
    boxShadow: "0 2px 5px rgba(90, 77, 65, 0.15)",
  },
  logo: {
    fontSize: "1.8rem",
    fontWeight: "bold",
    color: "#a57c6d", // soft brown
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
  aboutSection: {
    flexGrow: 1,
    maxWidth: "900px",
    margin: "3rem auto",
    padding: "2rem 3rem",
    backgroundColor: "#fff9f4",
    borderRadius: "15px",
    boxShadow: "0 4px 15px rgba(165, 124, 109, 0.1)",
  },
  heading: {
    fontSize: "2.8rem",
    marginBottom: "2rem",
    color: "#a57c6d",
    textAlign: "center",
  },
  subheading: {
    fontSize: "1.6rem",
    marginBottom: "0.5rem",
    color: "#8b6d59",
  },
  paragraph: {
    fontSize: "1.1rem",
    lineHeight: 1.75,
    color: "#5a4d41",
  },
  contentBlock: {
    backgroundColor: "#fff7f2",
    borderRadius: "12px",
    padding: "20px 25px",
    marginBottom: "1.8rem",
    cursor: "default",
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
