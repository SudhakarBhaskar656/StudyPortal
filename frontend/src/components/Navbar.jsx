import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { isAuthenticated, user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          📚 CourseHub
        </Link>

        <ul className="nav-menu">
          <li>
            <Link to="/" className="nav-link">
              Courses
            </Link>
          </li>

          {isAuthenticated ? (
            <>
              {user?.role === 'Student' && (
                <>
                  <li>
                    <Link to="/my-courses" className="nav-link">
                      My Courses
                    </Link>
                  </li>
                  <li>
                    <Link to="/orders" className="nav-link">
                      My Orders
                    </Link>
                  </li>
                </>
              )}

              {user?.role === 'Admin' && (
                <li>
                  <Link to="/admin" className="nav-link">
                    Admin Dashboard
                  </Link>
                </li>
              )}

              <li className="nav-user">
                <span className="user-name">{user?.name}</span>
                <button className="logout-btn" onClick={handleLogout}>
                  Logout
                </button>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link to="/login" className="nav-link">
                  Login
                </Link>
              </li>
              <li>
                <Link to="/register" className="nav-link">
                  Register
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
