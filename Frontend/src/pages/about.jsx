import React from "react";
import Navbar from "../Components/Navbar";

const ContentBlock = ({ icon, title, text }) => {
  const [hover, setHover] = React.useState(false);
  return (
    <div onMouseEnter={()=>setHover(true)} onMouseLeave={()=>setHover(false)}
      style={{ backgroundColor: "#fff7f2", borderRadius: 12, padding: "20px 25px", marginBottom: "1.8rem", cursor: "default",
        boxShadow: hover ? "0 8px 20px rgba(165,124,109,0.4)" : "0 4px 10px rgba(165,124,109,0.15)",
        transform: hover ? "translateY(-6px)" : "none", transition: "all 0.3s ease" }}>
      <h3 style={{ fontSize: "1.6rem", color: "#8b6d59", marginBottom: "0.5rem" }}>{icon} {title}</h3>
      <p style={{ fontSize: "1.05rem", lineHeight: 1.75, color: "#5a4d41" }}>{text}</p>
    </div>
  );
};

const About = () => (
  <div style={{ fontFamily: "'Segoe UI',sans-serif", backgroundColor: "#f5f0eb", color: "#5a4d41", minHeight: "100vh" }}>
    <Navbar activePage="about" />
    <section style={{ flexGrow: 1, maxWidth: 900, margin: "3rem auto", padding: "2rem 3rem", backgroundColor: "#fff9f4", borderRadius: 15, boxShadow: "0 4px 15px rgba(165,124,109,0.1)" }}>
      <h2 style={{ fontSize: "2.8rem", marginBottom: "2rem", color: "#a57c6d", textAlign: "center", fontFamily: "'Brush Script MT',cursive" }}>About Granny_SB</h2>
      <ContentBlock icon="📖" title="Our Story" text="Granny_SB is born out of a passion for timeless crochet artistry, blending tradition with modern design. Each piece is lovingly handcrafted by skilled artisans, using premium yarns that ensure softness and durability." />
      <ContentBlock icon="🏡" title="Founded" text="Established in 2025, Granny_SB started as a small family project inspired by our grandmother's exquisite crochet work. It has grown into a beloved brand known for quality craftsmanship and heartfelt customer connections." />
      <ContentBlock icon="🌿" title="Sustainability" text="We are deeply committed to eco-friendly practices, sourcing sustainable yarns and using minimal waste production techniques. Granny_SB believes in protecting the planet while delivering products that make you feel good." />
      <ContentBlock icon="👩‍🎨" title="Meet the Team" text="Our team is a group of passionate crochet enthusiasts, designers, and quality experts working together to bring you the best. From pattern design to final finishing touches, we focus on every detail with love." />
    </section>
    <footer style={{ backgroundColor: "#d7c6b8", textAlign: "center", padding: "1.5rem", fontSize: "0.9rem", color: "#5a4d41" }}>
      <p>© 2025 Granny_SB. All rights reserved.</p>
    </footer>
  </div>
);

export default About;
