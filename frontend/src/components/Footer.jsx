import { Link } from "react-router-dom";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">

        <div className="footer-section">
          <h3>CourseHub</h3>
          <p>Learn. Build. Grow your tech career.</p>
        </div>

        <div className="footer-section">
          <h4>Quick Links</h4>
          <Link to="/">Home</Link>
          <Link to="/courses">Courses</Link>
          <Link to="/login">Login</Link>
        </div>

        <div className="footer-section">
          <h4>Contact</h4>
          <p>Email: support@coursehub.com</p>
          <p>India</p>
        </div>

      </div>

      <div className="footer-bottom">
        © {new Date().getFullYear()} CourseHub. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
