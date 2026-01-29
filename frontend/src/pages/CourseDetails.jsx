import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getCourseById, buyCourse } from '../services/api';
import { useAuth } from '../context/AuthContext';
import './CourseDetails.css';

const CourseDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [purchasing, setPurchasing] = useState(false);

  // Fetch course details on component mount
  useEffect(() => {
    const fetchCourse = async () => {
      try {
        setLoading(true);
        setError('');
        const response = await getCourseById(id);
        setCourse(response.data.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch course details');
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [id]);

  // Handle buy course click
  const handleBuyCourse = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    // Prevent admin from buying courses
    if (user?.role === 'Admin') {
      setError('Admins cannot buy courses');
      return;
    }

    try {
      setPurchasing(true);
      await buyCourse(id);
      alert('Course purchased successfully!');
      navigate('/orders');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to purchase course');
    } finally {
      setPurchasing(false);
    }
  };

  if (loading) {
    return <div className="container"><div className="loading">Loading course details...</div></div>;
  }

  if (!course) {
    return <div className="container"><div className="error-message">Course not found</div></div>;
  }

  return (
    <div className="course-details-container">
      <div className="container">
        <button onClick={() => navigate('/')} className="back-btn">
          ← Back to Courses
        </button>

        <div className="details-card">
          <h1>{course.title}</h1>

          {error && <div className="error-message">{error}</div>}

          <div className="course-info">
            <div className="info-group">
              <label>Description:</label>
              <p>{course.description || 'No description available'}</p>
            </div>

            <div className="info-group">
              <label>Price:</label>
              <p className="price">₹{course.price}</p>
            </div>
          </div>

          <button
            className="buy-btn"
            onClick={handleBuyCourse}
            disabled={purchasing}
          >
            {purchasing ? 'Processing...' : 'Buy Now'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CourseDetails;
