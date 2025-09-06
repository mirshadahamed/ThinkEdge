import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from 'jwt-decode';


const InstructorCourse = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [userId, setUserId] = useState('');
  
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const token = localStorage.getItem('authToken');

        const decodedToken = jwtDecode(token);
                const userId = decodedToken.id;
                setUserId(userId);


        const response = await axios.get(`http://localhost:4000/course/instructor-courses/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setCourses(response.data.courses);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching courses:", err);
        setError("Failed to load courses. Please try again later.");
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#37beb7] bg-opacity-10 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#37beb7]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#37beb7] bg-opacity-10 flex items-center justify-center">
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg max-w-md w-full">
          <p className="text-red-700">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#37beb7] bg-opacity-10 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden mb-8 transform hover:scale-[1.01] transition duration-300">
          <div className="bg-[#37beb7] p-8 relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-16 -mt-16"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-white opacity-10 rounded-full -ml-16 -mb-16"></div>
            <div className="relative z-10 flex justify-between items-center">
              <div>
                <h1 className="text-4xl font-bold text-white mb-4">My Courses</h1>
                <p className="text-white text-lg opacity-90">Manage and track your courses</p>
              </div>
              <button
                onClick={() => navigate("/addCourse")}
                className="px-6 py-3 bg-white text-[#37beb7] rounded-xl hover:bg-gray-100 transition duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                Add New Course
              </button>
            </div>
          </div>
        </div>

        {/* Course Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses.map((course) => (
            <div
              key={course._id}
              className="bg-white rounded-2xl shadow-lg overflow-hidden transform hover:scale-[1.02] transition duration-300"
            >
              <div className="relative">
                <img
                  src={`http://localhost:4000/public/uploads/${course.coursePhoto}`}
                  alt={course.courseName}
                  className="w-full h-48 object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "https://placehold.co/800x400?text=Course+Image";
                  }}
                />
                <div className="absolute top-4 right-4">
                  <span className="bg-[#37beb7] text-white px-3 py-1 rounded-full text-sm font-medium">
                    {course.courseDuration}
                  </span>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{course.courseName}</h3>
                <p className="text-gray-600 mb-4 line-clamp-2">{course.courseDescription}</p>
                <div className="flex items-center justify-between">
                  <span className="text-[#37beb7] font-semibold">Rs.{course.courseAmount}</span>
                  <div className="space-x-2">
                    <button
                      onClick={() => navigate(`/edit-course/${course._id}`)}
                      className="px-4 py-2 bg-[#37beb7] text-white rounded-xl hover:bg-[#2da8a1] transition duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                    >
                      Edit
                    </button>
                    {/* <button
                      onClick={() => navigate(`/coursedetail/${course._id}`)}
                      className="px-4 py-2 bg-white text-[#37beb7] border-2 border-[#37beb7] rounded-xl hover:bg-[#37beb7] hover:text-white transition duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                    >
                      View
                    </button> */}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {courses.length === 0 && (
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-16 w-16 text-[#37beb7] mx-auto mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
              />
            </svg>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Courses Created Yet</h3>
            <p className="text-gray-600 mb-6">Start creating your first course to share your knowledge.</p>
            <button
              onClick={() => navigate("/addCourse")}
              className="px-6 py-3 bg-[#37beb7] text-white rounded-xl hover:bg-[#2da8a1] transition duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              Create Your First Course
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default InstructorCourse;