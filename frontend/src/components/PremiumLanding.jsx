import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PremiumHeroScene from "./PremiumHeroScene";

export default function PremiumLanding() {
  const navigate = useNavigate();
  const [mouseX, setMouseX] = useState(0);
  const [mouseY, setMouseY] = useState(0);

  const handleMouseMove = (e) => {
    setMouseX(e.clientX);
    setMouseY(e.clientY);
  };

  return (
    <div className="premium-landing" onMouseMove={handleMouseMove}>
      {/* Header */}
      <header className="premium-header">
        <div className="header-content">
          <div className="logo">
            <span className="logo-icon">🌿</span>
            <span className="logo-text">Expira</span>
          </div>
          <nav className="nav-links">
            <a href="#features" className="nav-link">Features</a>
            <a href="#benefits" className="nav-link">Benefits</a>
            <a href="#impact" className="nav-link">Impact</a>
          </nav>
          <div className="header-cta">
            <button
              className="btn btn-outline"
              onClick={() => navigate("/login")}
            >
              Sign In
            </button>
            <button
              className="btn btn-primary"
              onClick={() => navigate("/signup")}
            >
              Get Started
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="premium-hero">
        <div className="hero-content">
          <h1 className="hero-title">
            Live Mindfully.<br />
            Waste Less.
          </h1>
          <p className="hero-subtitle">
            Keep track of what matters. Expira helps you reduce waste, save money, and live sustainably.
          </p>
          <div className="hero-cta">
            <button className="btn btn-primary btn-large" onClick={() => navigate("/signup")}>
              Start Free
            </button>
            <button className="btn btn-outline btn-large">Learn More</button>
          </div>
        </div>
        <div className="hero-scene">
          <PremiumHeroScene mouseX={mouseX} mouseY={mouseY} />
        </div>
      </section>

      {/* Features Section */}
      <section className="premium-features" id="features">
        <div className="section-header">
          <h2>Thoughtfully Designed for Your Life</h2>
          <p>Everything you need to stay organized and sustainable</p>
        </div>

        <div className="features-grid">
          {[
            {
              icon: "📱",
              title: "Smart Scanning",
              description: "Scan product labels to automatically track expiry dates with our AI-powered OCR technology."
            },
            {
              icon: "🔔",
              title: "Gentle Reminders",
              description: "Receive thoughtful notifications as items approach expiry, giving you time to plan."
            },
            {
              icon: "🌍",
              title: "Track Your Impact",
              description: "See exactly how much waste you've prevented and carbon you've saved this month."
            },
            {
              icon: "⭐",
              title: "Earn Rewards",
              description: "Climb through levels and earn eco points for every product you use mindfully."
            },
            {
              icon: "📊",
              title: "Visual Insights",
              description: "Beautiful dashboards show your waste reduction progress and savings at a glance."
            },
            {
              icon: "💰",
              title: "Save Money",
              description: "Track estimated value of products you save from waste and watch your savings grow."
            }
          ].map((feature, i) => (
            <div key={i} className="feature-card">
              <span className="feature-icon">{feature.icon}</span>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Benefits Section */}
      <section className="premium-benefits" id="benefits">
        <div className="benefit-item">
          <div className="benefit-content">
            <h3>Reduce Waste with Purpose</h3>
            <p>
              Stop throwing away forgotten groceries. Expira keeps your pantry organized so you use what you have before it expires. Every product tracked is a step toward zero waste living.
            </p>
            <ul className="benefit-list">
              <li>✓ Never miss an expiry date again</li>
              <li>✓ Plan meals around your inventory</li>
              <li>✓ Donate items before they spoil</li>
            </ul>
          </div>
          <div className="benefit-image">📦</div>
        </div>

        <div className="benefit-item benefit-reverse">
          <div className="benefit-image">💚</div>
          <div className="benefit-content">
            <h3>Feel the Environmental Impact</h3>
            <p>
              Watch your eco score grow as you prevent waste. See real numbers: how many products you've saved, carbon emissions reduced, and money preserved. Your actions matter.
            </p>
            <ul className="benefit-list">
              <li>✓ Track carbon saved in kg CO₂</li>
              <li>✓ Monitor waste reduction rate</li>
              <li>✓ Compete with friends</li>
            </ul>
          </div>
        </div>

        <div className="benefit-item">
          <div className="benefit-content">
            <h3>Achieve Wellness Goals</h3>
            <p>
              Being mindful extends beyond health. Our gamification system makes sustainable living rewarding. Unlock levels, earn badges, and celebrate your progress toward becoming a Zero Waste Hero.
            </p>
            <ul className="benefit-list">
              <li>✓ Rise through achievement levels</li>
              <li>✓ Complete weekly challenges</li>
              <li>✓ Build lasting habits</li>
            </ul>
          </div>
          <div className="benefit-image">🏆</div>
        </div>
      </section>

      {/* Impact Section */}
      <section className="premium-impact" id="impact">
        <div className="impact-grid">
          {[
            { number: "2.5M", label: "Products Tracked", color: "#b8956a" },
            { number: "1.2M", label: "Tons of Waste Prevented", color: "#d4a574" },
            { number: "450K", label: "Users Worldwide", color: "#e8b87e" },
            { number: "2.8B", label: "kg CO₂ Saved", color: "#d97c6b" }
          ].map((stat, i) => (
            <div key={i} className="impact-card" style={{ borderColor: stat.color }}>
              <p className="impact-number" style={{ color: stat.color }}>{stat.number}</p>
              <p className="impact-label">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="premium-cta-section">
        <div className="cta-content">
          <h2>Ready to Live More Mindfully?</h2>
          <p>Join thousands of people building sustainable habits with Expira</p>
          <button className="btn btn-primary btn-large" onClick={() => navigate("/signup")}>
            Start Your Journey Today
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="premium-footer">
        <div className="footer-content">
          <div className="footer-section">
            <h4>Expira</h4>
            <p>Making mindful living effortless</p>
          </div>
          <div className="footer-section">
            <h4>Product</h4>
            <a href="#">Features</a>
            <a href="#">Pricing</a>
            <a href="#">Blog</a>
          </div>
          <div className="footer-section">
            <h4>Company</h4>
            <a href="#">About</a>
            <a href="#">Privacy</a>
            <a href="#">Terms</a>
          </div>
          <div className="footer-section">
            <h4>Connect</h4>
            <a href="#">Twitter</a>
            <a href="#">Instagram</a>
            <a href="#">LinkedIn</a>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2026 Expira. Building a more sustainable world, one product at a time.</p>
        </div>
      </footer>
    </div>
  );
}
