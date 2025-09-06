import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const AdminCourseList = () => {
  const [courses, setCourses] = useState([]);

  const fetchCourses = async () => {
    try {
      const res = await axios.get('https://localhost:4000/course/get');
      setCourses(res.data.courses);
    } catch (err) {
      console.error('Failed to fetch courses:', err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this course?")) {
      try {
        await axios.delete(`https://localhost:4000/course/delete/${id}`);
        fetchCourses();
      } catch (err) {
        console.error("Delete error:", err);
      }
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Course List (Admin)</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-lg rounded-lg">
          <thead>
            <tr className="bg-blue-600 text-white">
              <th className="py-3 px-4 text-left">Course ID</th>
              <th className="py-3 px-4 text-left">Name</th>
              <th className="py-3 px-4 text-left">Description</th>
              <th className="py-3 px-4 text-left">Details</th>
              <th className="py-3 px-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {courses.map((course) => (
              <tr key={course._id} className="border-b hover:bg-gray-50">
                <td className="py-3 px-4">{course.courseId}</td>
                <td className="py-3 px-4">{course.courseName}</td>
                <td className="py-3 px-4 truncate max-w-xs">{course.courseDescription}</td>
                <td className="py-3 px-4">
                  <Link to={`/admin/course-detail/${course._id}`}>
                    <button className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-700 transition">View</button>
                  </Link>
                </td>
                <td className="py-3 px-4">
                  <button
                    onClick={() => handleDelete(course._id)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-700 transition"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {courses.length === 0 && (
              <tr>
                <td colSpan="5" className="text-center py-4">No courses available.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminCourseList;
