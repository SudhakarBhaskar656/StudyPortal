import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import "./Landing.css";

const LandingPage = () => {
  const navigate = useNavigate();

  // ✅ Check login
  const token = localStorage.getItem("token");

  return (
    <div className="landing">

      {/* HERO */}
      <section className="hero">
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="hero-content"
        >
          <h1>Master Tech Skills That Actually Get You Hired</h1>
          <p>
            Learn Backend, Frontend, DevOps & Fullstack with
            industry-level projects and real-world experience.
          </p>

          <div className="hero-buttons">
            <button
              onClick={() => navigate("/courses")}
              className="primary-btn"
            >
              Explore Courses
            </button>

            {!token ? (
              <button
                onClick={() => navigate("/register")}
                className="secondary-btn"
              >
                Get Started
              </button>
            ) : (
              <button
                onClick={() => navigate("/orders")}
                className="secondary-btn"
              >
                Go to Dashboard
              </button>
            )}
          </div>
        </motion.div>
      </section>

      {/* FEATURES */}
      <section className="features">
        <h2>Why Students Love CourseHub</h2>
        <p className="section-subtitle">
          Everything you need to become job-ready in tech.
        </p>

        <div className="feature-grid">
          <motion.div whileHover={{ scale: 1.05 }} className="feature-card">
            🚀 Project-Based Learning
            <p>Build real applications instead of watching boring theory.</p>
          </motion.div>

          <motion.div whileHover={{ scale: 1.05 }} className="feature-card">
            💼 Career Focused Curriculum
            <p>Designed to crack interviews & land real jobs.</p>
          </motion.div>

          <motion.div whileHover={{ scale: 1.05 }} className="feature-card">
            📈 Lifetime Access
            <p>Access courses anytime, forever.</p>
          </motion.div>

          <motion.div whileHover={{ scale: 1.05 }} className="feature-card">
            🤝 Community Support
            <p>Learn together with other passionate developers.</p>
          </motion.div>
        </div>
      </section>

      {/* STATS */}
      <section className="stats">
        <div className="stat">
          <h3>100+</h3>
          <p>Premium Courses</p>
        </div>
        <div className="stat">
          <h3>500+</h3>
          <p>Active Students</p>
        </div>
        <div className="stat">
          <h3>95%</h3>
          <p>Placement Success</p>
        </div>
        <div className="stat">
          <h3>4.8★</h3>
          <p>Average Rating</p>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="how-it-works">
        <h2>How It Works</h2>

        <div className="steps">
          <div className="step">
            <h4>1. Choose Course</h4>
            <p>Select a course that matches your career goal.</p>
          </div>

          <div className="step">
            <h4>2. Learn & Build</h4>
            <p>Complete real-world projects step by step.</p>
          </div>

          <div className="step">
            <h4>3. Get Hired</h4>
            <p>Apply confidently with practical experience.</p>
          </div>
        </div>
      </section>

      {/* TESTIMONIAL */}
      <section className="testimonials">
        <h2>Success Stories</h2>
        <div className="testimonial-card">
          <p>
            “The backend course helped me understand real architecture.
            I cracked my first developer job within 3 months!”
          </p>
          <h4>— CourseHub Student</h4>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="final-cta">
        <h2>Ready to Upgrade Your Career?</h2>
        <p>Join hundreds of students building real tech skills.</p>

        {!token ? (
          <button onClick={() => navigate("/register")}>
            Start Learning Today
          </button>
        ) : (
          <button onClick={() => navigate("/orders")}>
            Go to Dashboard
          </button>
        )}
      </section>

    </div>
  );
};

export default LandingPage;
