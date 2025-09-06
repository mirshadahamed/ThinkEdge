// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import { Link } from 'react-router-dom';

// const EnrolledCoursesPage = () => {
//   const [enrolledCourses, setEnrolledCourses] = useState([]);
//   const [loading, setLoading] = useState(true);

//   // Fetch enrolled courses for a user
//   useEffect(() => {
//     const fetchEnrolledCourses = async () => {
//       try {
        
//         const response = await axios.get('http://localhost:4000/course/user/enrolled-courses', {
//           // Assuming you have a way to send user info, e.g., token or user ID
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem('authToken')}`, // Example for token-based auth
//           },
//         });
//         setEnrolledCourses(response.data.enrolledCourses);
//         setLoading(false);
//       } catch (err) {
//         console.error('Error fetching enrolled courses:', err);
//         setLoading(false);
//       }
//     };

//     fetchEnrolledCourses();
//   }, []);

//   if (loading) {
//     return <div>Loading your enrolled courses...</div>;
//   }

//   return (
//     <div className="max-w-7xl mx-auto p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//       {enrolledCourses.map((course) => (
//         <Link
//           key={course._id}
//           to={`/coursedetail/${course._id}`}
//           className="border shadow-lg rounded-lg overflow-hidden"
//         >
//           <img
//             src={`http://localhost:4000/public/uploads/${course.coursePhoto}`}
//             alt={course.courseName}
//             className="w-full h-48 object-cover"
//           />
//           <div className="p-4">
//             <h3 className="text-xl font-semibold text-gray-800">{course.courseName}</h3>
//             <p className="text-sm text-gray-600">Course ID: {course.courseId}</p>
//             <p className="text-gray-600 mt-2">{course.courseDescription}</p>
//             <p className="text-sm text-gray-700 mt-2">Duration: {course.courseDuration}</p>
//           </div>
//         </Link>
//       ))} 
//     </div>
//   );
// };

// export default EnrolledCoursesPage;
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const EnrolledCoursesPage = () => {
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch enrolled courses for a user
  useEffect(() => {
    const fetchEnrolledCourses = async () => {
      try {
        const response = await axios.get('http://localhost:4000/course/user/enrolled-courses', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('authToken')}`,
          },
        });
        setEnrolledCourses(response.data.enrolledCourses);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching enrolled courses:', err);
        setError('Failed to fetch enrolled courses');
        setLoading(false);
      }
    };

    fetchEnrolledCourses();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#37beb7]/5 to-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-[#37beb7] border-t-transparent"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#37beb7]/5 to-white flex items-center justify-center">
        <div className="bg-white p-6 rounded-2xl shadow-xl max-w-md w-full">
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
            <p className="text-red-700">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#37beb7]/5 to-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">My Enrolled Courses</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Access and manage your enrolled courses
          </p>
        </div>

        {/* Courses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {enrolledCourses.map((course) => (
            <Link
              key={course._id}
              to={`/coursedetail/${course._id}`}
              className="bg-white rounded-xl shadow-sm hover:shadow-md overflow-hidden transform hover:scale-[1.01] transition duration-300 flex flex-col border border-gray-100"
            >
              <div className="relative h-44">
                <img
                  src={`http://localhost:4000/public/uploads/${course.coursePhoto}`}
                  alt={course.courseName}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://placehold.co/600x400?text=Course+Image';
                  }}
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3">
                  <span className="text-white text-sm font-medium">{course.courseId}</span>
                </div>
              </div>
              
              <div className="p-4 flex-grow flex flex-col">
                <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-1">{course.courseName}</h3>
                
                <p className="text-gray-600 text-sm mb-4 line-clamp-2 flex-grow">{course.courseDescription}</p>
                
                <div className="flex items-center justify-between mb-4 text-sm">
                  <div className="flex items-center text-gray-500 bg-gray-50 px-3 py-1.5 rounded-lg">
                    <svg className="w-4 h-4 mr-1.5 text-[#37beb7]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{course.courseDuration}</span>
                  </div>
                  <div className="flex items-center text-gray-500 bg-gray-50 px-3 py-1.5 rounded-lg">
                    <svg className="w-4 h-4 mr-1.5 text-[#37beb7]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Enrolled</span>
                  </div>
                </div>

                <button className="w-full bg-[#37beb7] text-white py-2.5 rounded-lg font-medium text-sm hover:bg-[#2da8a1] transition duration-200 shadow-sm hover:shadow-md flex items-center justify-center">
                  <span>View Course</span>
                  <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </button>
              </div>
            </Link>
          ))}
        </div>

        {/* No Courses Message */}
        {enrolledCourses.length === 0 && (
          <div className="text-center py-12 bg-white rounded-xl shadow-sm">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h3 className="mt-4 text-lg font-medium text-gray-900">No enrolled courses</h3>
            <p className="mt-1 text-gray-500">You haven't enrolled in any courses yet</p>
            <Link
              to="/courses"
              className="mt-6 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#37beb7] hover:bg-[#2da8a1] focus:outline-none"
            >
              Browse Courses
              <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default EnrolledCoursesPage;