// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";

// const CoursesPage = () => {
//   const [courses, setCourses] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchCourses = async () => {
//       try {
//         const response = await axios.get("http://localhost:4000/course/get");
//         setCourses(response.data.courses);
//         setLoading(false);
//       } catch (err) {
//         console.error("Error fetching courses:", err);
//         setError("Failed to load courses. Please try again later.");
//         setLoading(false);
//       }
//     };

//     fetchCourses();
//   }, []);

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-[#37beb7] bg-opacity-10 flex items-center justify-center">
//         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#37beb7]"></div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="min-h-screen bg-[#37beb7] bg-opacity-10 flex items-center justify-center">
//         <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg max-w-md w-full">
//           <p className="text-red-700">{error}</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-[#37beb7] bg-opacity-10 py-12">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         {/* Header Section */}
//         <div className="bg-white rounded-3xl shadow-2xl overflow-hidden mb-8 transform hover:scale-[1.01] transition duration-300">
//           <div className="bg-[#37beb7] p-8 relative">
//             <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-16 -mt-16"></div>
//             <div className="absolute bottom-0 left-0 w-32 h-32 bg-white opacity-10 rounded-full -ml-16 -mb-16"></div>
//             <div className="relative z-10">
//               <h1 className="text-4xl font-bold text-white mb-4">Available Courses</h1>
//               <p className="text-white text-lg opacity-90">Explore our wide range of courses and enhance your skills</p>
//             </div>
//           </div>
//         </div>

//         {/* Course Grid */}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
//           {courses.map((course) => (
//             <div
//               key={course._id}
//               className="bg-white rounded-2xl shadow-lg overflow-hidden transform hover:scale-[1.02] transition duration-300"
//             >
//               <div className="relative">
//                 <img
//                   src={`http://localhost:4000/uploads/${course.coursePhoto}`}
//                   alt={course.courseName}
//                   className="w-full h-48 object-cover"
//                   onError={(e) => {
//                     e.target.onerror = null;
//                     e.target.src = "https://placehold.co/800x400?text=Course+Image";
//                   }}
//                 />
//                 <div className="absolute top-4 right-4">
//                   <span className="bg-[#37beb7] text-white px-3 py-1 rounded-full text-sm font-medium">
//                     {course.courseDuration}
//                   </span>
//                 </div>
//               </div>
//               <div className="p-6">
//                 <h3 className="text-xl font-bold text-gray-900 mb-2">{course.courseName}</h3>
//                 <p className="text-gray-600 mb-4 line-clamp-2">{course.courseDescription}</p>
//                 <div className="flex items-center justify-between">
//                   <span className="text-[#37beb7] font-semibold">${course.coursePrice}</span>
//                   <button
//                     onClick={() => navigate(`/course/${course._id}`)}
//                     className="px-4 py-2 bg-[#37beb7] text-white rounded-xl hover:bg-[#2da8a1] transition duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
//                   >
//                     View Details
//                   </button>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>

//         {courses.length === 0 && (
//           <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
//             <svg
//               xmlns="http://www.w3.org/2000/svg"
//               className="h-16 w-16 text-[#37beb7] mx-auto mb-4"
//               fill="none"
//               viewBox="0 0 24 24"
//               stroke="currentColor"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth={2}
//                 d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
//               />
//             </svg>
//             <h3 className="text-xl font-semibold text-gray-900 mb-2">No Courses Available</h3>
//             <p className="text-gray-600">Check back later for new courses.</p>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default CoursesPage;




import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CoursesPage = () => {
  const [courses, setCourses] = useState([]);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Fetch all courses and user's enrolled courses
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    
    const fetchData = async () => {
      try {
        // Fetch all courses
        const coursesResponse = await axios.get('http://localhost:4000/course/get');
        setCourses(coursesResponse.data.courses);
        
        // Fetch user's enrolled courses if token exists
        if (token) {
          try {
            const enrolledResponse = await axios.get('http://localhost:4000/course/user/enrolled-courses', {
              headers: {
                Authorization: `Bearer ${token}`
              }
            });
            setEnrolledCourses(enrolledResponse.data.enrolledCourses || []);
          } catch (err) {
            console.error('Error fetching enrolled courses:', err);
            setEnrolledCourses([]);
          }
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching courses:', err);
        setLoading(false);
        setError('Failed to fetch courses');
      }
    };

    fetchData();
  }, []);

  const navigate = useNavigate();

  function handleEnroll(courseId) {
    const token = localStorage.getItem('authToken');
    if (!token) {
      navigate('/login');
      return;
    }

    axios.post(`http://localhost:4000/course/user/enroll/${courseId}`, {}, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then((response) => {
        setEnrolledCourses(prev => [...prev, courseId]);
        navigate(`/payment/${courseId}`)
      })
      .catch((err) => {
        console.error('Enrollment error:', err);
        alert('Failed to enroll in the course');
      });
  }

  const isEnrolled = (courseId) => {
    return enrolledCourses.some(course => course._id === courseId || course === courseId);
  };

  // Filter courses based on search term and category
  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.courseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.courseDescription.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || course.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-[#37beb7] bg-opacity-10 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-[#37beb7] border-t-transparent"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#37beb7] bg-opacity-10 flex items-center justify-center">
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
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Explore Our Courses</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover a wide range of courses designed to help you achieve your learning goals
          </p>
        </div>

        {/* Search and Filter Section */}
        <div className="mb-8 flex flex-col md:flex-row gap-4 justify-between items-center bg-white p-4 rounded-xl shadow-sm">
          <div className="w-full md:w-96">
            <div className="relative">
              <input
                type="text"
                placeholder="Search courses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2.5 pl-10 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#37beb7] focus:border-[#37beb7] transition duration-200"
              />
              <svg
                className="absolute left-3 top-3 h-5 w-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full md:w-48 px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#37beb7] focus:border-[#37beb7] transition duration-200"
          >
            <option value="all">All Categories</option>
            <option value="programming">Programming</option>
            <option value="design">Design</option>
            <option value="business">Business</option>
            <option value="marketing">Marketing</option>
          </select>
        </div>

        {/* Courses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <div
              key={course._id}
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
                <div className="absolute top-3 right-3">
                  <span className="bg-[#37beb7] text-white px-3 py-1 rounded-full text-sm font-medium shadow-md">
                    Rs.{course.courseAmount}
                  </span>
                </div>
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
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    {/* <span>{course.enrolledStudents || 0} enrolled</span> */}
                  </div>
                </div>

                <div className="mt-auto">
                  {isEnrolled(course._id) ? (
                    <button
                      className="w-full bg-gray-50 text-gray-600 py-2.5 rounded-lg font-medium text-sm border border-gray-200 cursor-default flex items-center justify-center"
                      disabled
                    >
                      <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Already Enrolled
                    </button>
                  ) : (
                    <button
                      onClick={() => handleEnroll(course._id)}
                      className="w-full bg-[#37beb7] text-white py-2.5 rounded-lg font-medium text-sm hover:bg-[#2da8a1] transition duration-200 shadow-sm hover:shadow-md flex items-center justify-center"
                    >
                      <span>Enroll Now</span>
                      <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* No Results Message */}
        {filteredCourses.length === 0 && (
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
            <h3 className="mt-4 text-lg font-medium text-gray-900">No courses found</h3>
            <p className="mt-1 text-gray-500">Try adjusting your search or filter criteria</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CoursesPage;