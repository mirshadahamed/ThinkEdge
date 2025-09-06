import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';

const AssessmentList = () => {
  const [assessments, setAssessments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCourse, setFilterCourse] = useState('');
  const navigate = useNavigate();

  const fetchAssessments = async () => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        navigate('/login');
        return;
      }

      const decoded = jwtDecode(token);
      const instructorId = decoded.id;

      const coursesRes = await axios.get(
        `http://localhost:4000/course/instructor-courses/${instructorId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const instructorCourses = coursesRes.data.courses;

      const assessmentPromises = instructorCourses.map((course) =>
        axios.get(`http://localhost:4000/assessment/course/${course._id}`)
      );

      const assessmentsResponses = await Promise.all(assessmentPromises);

      const allAssessments = assessmentsResponses.flatMap((res) => res.data.assessments);

      setAssessments(allAssessments);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching assessments:', err);
      setLoading(false);
    }
  };

  const handleDelete = async (assessmentId) => {
    if (window.confirm('Are you sure you want to delete this assessment?')) {
      try {
        await axios.delete(`http://localhost:4000/assessment/delete/${assessmentId}`);
        alert('Assessment deleted successfully');
        fetchAssessments();
      } catch (err) {
        console.error('Error deleting assessment:', err);
        alert('Failed to delete assessment');
      }
    }
  };

  const handleEdit = (assessmentId) => {
    navigate(`/edit-assessment/${assessmentId}`);
  };

  useEffect(() => {
    fetchAssessments();
  }, []);

  // Update filtering logic to include both assessment topic and course ID
  const filteredAssessments = assessments.filter(assessment => {
    const matchesSearch = assessment.topic.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCourse = !filterCourse || assessment.courseId.toLowerCase().includes(filterCourse.toLowerCase());
    return matchesSearch && matchesCourse;
  });

  // Get unique course IDs for the filter dropdown
  const uniqueCourses = [...new Set(assessments.map(assessment => assessment.courseId))];

  return (
    <div className="min-h-screen bg-[#37beb7] bg-opacity-10 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          {/* Header with Search and Filter */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <h2 className="text-3xl font-bold text-gray-800">Your Assessments</h2>
            <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
              {/* Search Bar */}
              <div className="relative w-full md:w-64">
                <input
                  type="text"
                  placeholder="Search assessments..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-2 pl-10 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#37beb7] focus:border-transparent"
                />
                <svg
                  className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
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

              {/* Course Filter Dropdown */}
              <div className="relative w-full md:w-48">
                {/* <select
                  value={filterCourse}
                  onChange={(e) => setFilterCourse(e.target.value)}
                  className="w-full px-4 py-2 pl-10 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#37beb7] focus:border-transparent appearance-none"
                >
                  <option value="">All Courses</option>
                  {uniqueCourses.map((courseId) => (
                    <option key={courseId} value={courseId}>
                      {courseId}
                    </option>
                  ))}
                </select> */}
                <svg
                  className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                  />
                </svg>
              </div>

              {/* Add New Assessment Button */}
              <button
                onClick={() => navigate('/addassessment')}
                className="w-full md:w-auto bg-[#37beb7] text-white px-4 py-2 rounded-lg hover:bg-[#2da8a1] transition-colors duration-200 flex items-center justify-center"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add New Assessment
              </button>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#37beb7]"></div>
            </div>
          ) : filteredAssessments.length === 0 ? (
            <div className="text-center py-12">
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
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No assessments found</h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchQuery || filterCourse ? 'Try adjusting your search or filter' : 'Get started by creating a new assessment.'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAssessments.map((assessment) => (
                <div
                  key={assessment._id}
                  className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200"
                >
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-semibold text-gray-800">{assessment.topic}</h3>
                      {/* <span className="px-3 py-1 text-sm font-medium text-[#37beb7] bg-[#37beb7] bg-opacity-10 rounded-full">
                        {assessment.courseId}
                      </span> */}
                    </div>
                    <p className="text-gray-600 mb-4 line-clamp-2">{assessment.description}</p>
                    
                    <div className="space-y-3 mb-4">
                      {assessment.assessmentLink && (
                        <a
                          href={assessment.assessmentLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center text-[#37beb7] hover:text-[#2da8a1] transition-colors duration-200"
                        >
                          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                          View Assessment Link
                        </a>
                      )}
                      {assessment.assessmentFile && (
                        <a
                          href={`http://localhost:4000/uploads/assessments/${assessment.assessmentFile}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center text-[#37beb7] hover:text-[#2da8a1] transition-colors duration-200"
                        >
                          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          Download PDF
                        </a>
                      )}
                    </div>

                    <div className="flex space-x-3 pt-4 border-t border-gray-100">
                      <button
                        onClick={() => navigate(`/edit-assessment/${assessment._id}`)}
                        className="flex-1 px-4 py-2 bg-[#37beb7] bg-opacity-10 text-[#37beb7] rounded-lg hover:bg-opacity-20 transition-colors duration-200 flex items-center justify-center"
                      >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(assessment._id)}
                        className="flex-1 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors duration-200 flex items-center justify-center"
                      >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AssessmentList;

