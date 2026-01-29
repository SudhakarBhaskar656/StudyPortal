import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllCourses } from "../services/api";
import "./Courses.css";

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const navigate = useNavigate();

  useEffect(() => {
    const loadCourses = async () => {
      try {
        setLoading(true);

        const res = await getAllCourses(page, 9);

        setCourses(res.data.data || []);
        setTotalPages(res.data.pagination?.totalPages || 1);

        setError("");
      } catch (err) {
        setError("Unable to fetch courses. Please try again later.");
        setCourses([]);
      } finally {
        setLoading(false);
      }
    };

    loadCourses();
  }, [page]);

  const handleBuyNow = (courseId) => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    } else {
      navigate(`/course/${courseId}`);
    }
  };

  return (
    <div className="courses-container">
      <div className="container">
        <h1>Available Courses</h1>

        {error && <div className="error-message">{error}</div>}
        {loading && <div className="loading">Loading courses...</div>}

        {!loading && courses.length === 0 && (
          <div className="no-courses">No courses available</div>
        )}

        {!loading && courses.length > 0 && (
          <>
            <div className="courses-grid">
              {courses.map((course) => {
                const imageSrc = course.imageId
                  ? `http://localhost:4000/api/v1/course/image/${course.imageId}`
                  : course.imageUrl
                  ? course.imageUrl
                  : "/placeholder.png";

                return (
                  <div key={course._id} className="course-card">
                    <img
                      src={imageSrc}
                      alt={course.title}
                      style={{
                        width: "100%",
                        height: "180px",
                        objectFit: "cover",
                        borderRadius: "8px",
                        marginBottom: "12px",
                      }}
                    />

                    <h3 className="course-title">{course.title}</h3>

                    <p className="course-description">
                      {course.description}
                    </p>

                    <div className="course-footer">
                      <p className="course-price">₹{course.price}</p>

                      {course.isPurchased ? (
                        <div className="purchased-badge">✓ Purchased</div>
                      ) : (
                        <button
                          className="view-btn"
                          onClick={() => handleBuyNow(course._id)}
                        >
                          Buy Now
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* 🔥 PAGINATION */}
            <div className="pagination">
              <button
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
              >
                Prev
              </button>

              <span>
                Page {page} of {totalPages}
              </span>

              <button
                disabled={page === totalPages}
                onClick={() => setPage(page + 1)}
              >
                Next
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Courses;
