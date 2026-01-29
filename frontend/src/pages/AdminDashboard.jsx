import React, { useState, useEffect } from 'react';
import { createCourseWithImage, getAllCourses, deleteCourse, getAllOrders } from '../services/api';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [tab, setTab] = useState('courses'); // 'courses' or 'orders'
  const [courses, setCourses] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    image: null,
  });

  // Fetch courses
  const fetchCourses = async () => {
    try {
      setLoading(true);
      const response = await getAllCourses();
      setCourses(response.data.data || []);
    } catch (err) {
      setError('Failed to fetch courses');
    } finally {
      setLoading(false);
    }
  };

  // Fetch orders
  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await getAllOrders();
      setOrders(response.data.data || []);
    } catch (err) {
      setError('Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  // Load data on component mount and tab change
  useEffect(() => {
    if (tab === 'courses') {
      fetchCourses();
    } else {
      fetchOrders();
    }
  }, [tab]);

  // Handle form input
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle file input
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData((prev) => ({
      ...prev,
      image: file,
    }));
  };

  // Handle course creation
  const handleCreateCourse = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!formData.title || !formData.price) {
      setError('Title and price are required');
      return;
    }

    try {
      setLoading(true);
      
      const data = new FormData();
      data.append('title', formData.title);
      data.append('description', formData.description);
      data.append('price', parseFloat(formData.price));
      if (formData.image) {
        data.append('image', formData.image);
      }

      await createCourseWithImage(data);
      setSuccess('Course created successfully!');
      setFormData({ title: '', description: '', price: '', image: null });
      
      // Reset file input
      const fileInput = document.getElementById('image');
      if (fileInput) fileInput.value = '';
      
      fetchCourses();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create course');
    } finally {
      setLoading(false);
    }
  };

  // Handle course deletion
  const handleDeleteCourse = async (courseId) => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      try {
        setLoading(true);
        await deleteCourse(courseId);
        setSuccess('Course deleted successfully!');
        fetchCourses();
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to delete course');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="admin-container">
      <div className="container">
        <h1>Admin Dashboard</h1>

        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}

        {/* Tab Navigation */}
        <div className="tab-navigation">
          <button
            className={`tab-btn ${tab === 'courses' ? 'active' : ''}`}
            onClick={() => setTab('courses')}
          >
            Manage Courses
          </button>
          <button
            className={`tab-btn ${tab === 'orders' ? 'active' : ''}`}
            onClick={() => setTab('orders')}
          >
            View Orders
          </button>
        </div>

        {/* Courses Tab */}
        {tab === 'courses' && (
          <div className="tab-content">
            <div className="form-section">
              <h2>Create New Course</h2>
              <form onSubmit={handleCreateCourse}>
                <div className="form-group">
                  <label htmlFor="title">Course Title *</label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="Enter course title"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="description">Description</label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Enter course description"
                    rows="4"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="price">Price (₹) *</label>
                  <input
                    type="number"
                    id="price"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    placeholder="Enter course price"
                    min="0"
                    step="0.01"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="image">Course Image (JPG, PNG)</label>
                  <input
                    type="file"
                    id="image"
                    name="image"
                    accept="image/jpeg,image/jpg,image/png"
                    onChange={handleFileChange}
                  />
                  {formData.image && (
                    <p className="file-name">Selected: {formData.image.name}</p>
                  )}
                </div>

                <button type="submit" className="submit-btn" disabled={loading}>
                  {loading ? 'Creating...' : 'Create Course'}
                </button>
              </form>
            </div>

            <div className="list-section">
              <h2>All Courses</h2>
              {courses.length === 0 ? (
                <p className="no-data">No courses available</p>
              ) : (
                <div className="courses-list">
                  {courses.map((course) => (
                    <div key={course._id} className="list-item">
                      <div className="item-info">
                        <h3>{course.title}</h3>
                        <p>{course.description}</p>
                        <p className="price">₹{course.price}</p>
                      </div>
                      <button
                        className="delete-btn"
                        onClick={() => handleDeleteCourse(course._id)}
                        disabled={loading}
                      >
                        Delete
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Orders Tab */}
        {tab === 'orders' && (
          <div className="tab-content">
            <h2>All Orders</h2>
            {orders.length === 0 ? (
              <p className="no-data">No orders available</p>
            ) : (
              <div className="orders-table">
                <table>
                  <thead>
                    <tr>
                      <th>Student Name</th>
                      <th>Email</th>
                      <th>Course Name</th>
                      <th>Price</th>
                      <th>Purchased On</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order) => (
                      <tr key={order._id}>
                        <td>{order.student?.name || 'N/A'}</td>
                        <td>{order.student?.email || 'N/A'}</td>
                        <td>{order.course?.title || 'N/A'}</td>
                        <td>₹{order.course?.price || 'N/A'}</td>
                        <td>{new Date(order.purchasedAt).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
