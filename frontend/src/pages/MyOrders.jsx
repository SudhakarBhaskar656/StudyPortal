import React, { useState, useEffect } from 'react';
import { getMyOrders } from '../services/api';
import './MyOrders.css';

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch user's orders on component mount
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        setError('');
        const response = await getMyOrders();
        setOrders(response.data.data || []);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch orders');
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return <div className="container"><div className="loading">Loading your orders...</div></div>;
  }

  return (
    <div className="orders-container">
      <div className="container">
        <h1>My Purchased Courses</h1>

        {error && <div className="error-message">{error}</div>}

        {orders.length === 0 ? (
          <div className="no-orders">
            <p>You haven't purchased any courses yet.</p>
            <p>Go to the courses page and buy a course to get started!</p>
          </div>
        ) : (
          <div className="orders-table">
            <table>
              <thead>
                <tr>
                  <th>Course Name</th>
                  <th>Price</th>
                  <th>Purchased On</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order._id}>
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
    </div>
  );
};

export default MyOrders;
