import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getMyCourses } from "../services/api";
import "./Courses.css";

const MyCourses = () => {
  const [courses, setCourses] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadMyCourses = async () => {
      try {
        setLoading(true);
        const res = await getMyCourses();
        const coursesData = res.data.data || res.data;
        setCourses(coursesData);
        setError("");
      } catch (err) {
        setError("Unable to fetch your courses. Please try again later.");
        setCourses([]);
      } finally {
        setLoading(false);
      }
    };

    loadMyCourses();
  }, []);

  const handleViewCourse = (courseId) => {
    navigate(`/course/${courseId}`);
  };

  return (
    <div className="courses-container">
      <div className="container">
        <h1>My Purchased Courses</h1>

        {error && <div className="error-message">{error}</div>}

        {loading && <div className="loading">Loading your courses...</div>}

        {!loading && courses.length === 0 && (
          <div className="no-courses">You haven't purchased any courses yet</div>
        )}

        {!loading && courses.length > 0 && (
          <div className="courses-grid">
            {courses.map((course) => {
              const imageKey = course.imageId || course.image || course.image?._id || null;
              return (
                <div key={course._id} className="course-card">
                  {imageKey && (
                    <img
                      src={`http://localhost:4000/api/v1/course/image/${imageKey}`}
                      alt={course.title}
                      style={{
                        width: "100%",
                        height: "180px",
                        objectFit: "cover",
                        borderRadius: "8px",
                        marginBottom: "12px",
                      }}
                    />
                  )}

                  <h3 className="course-title">{course.title || "Untitled Course"}</h3>

                  <p className="course-description">
                    {course.description || "No description available"}
                  </p>

                  <div className="course-footer">
                    <p className="course-price">₹{course.price || 0}</p>

                    <div className="purchased-badge">✓ Purchased</div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyCourses;
