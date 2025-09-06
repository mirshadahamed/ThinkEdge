import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';

const AssessmentAddForm = ({ instructorId }) => {
  const [courses, setCourses] = useState([]);
  const [formData, setFormData] = useState({
    courseId: '',
    topic: '',
    description: '',
    assessmentFile: null,
    assessmentLink: '',
  });
  const navigate = useNavigate();
  

  const fetchCourses = async () => {
    try {
       const token = localStorage.getItem('authToken');
              if (!token) {
                navigate('/login');
                return;
              }
      
              // Decode token to get user ID
              const decoded = jwtDecode(token);

              const res = await axios.get(
                `http://localhost:4000/course/instructor-courses/${decoded.id}`,
                {
                  headers: {
                    Authorization: `Bearer ${token}`
                  }
                }
              );
                    setCourses(res.data.courses);
    } catch (err) {
      console.error('Error fetching courses:', err);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      assessmentFile: e.target.files[0],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const submissionData = new FormData();
    submissionData.append('courseId', formData.courseId);
    submissionData.append('topic', formData.topic);
    submissionData.append('description', formData.description);
    if (formData.assessmentLink) submissionData.append('assessmentLink', formData.assessmentLink);
    if (formData.assessmentFile) submissionData.append('assessmentFile', formData.assessmentFile);

    try {
      const res = await axios.post('http://localhost:4000/assessment/add', submissionData);
      alert('Assessment added successfully!');
      navigate('/editassessment')
    } catch (err) {
      console.error('Error adding assessment:', err);
      alert('Failed to add assessment.');
    }
  };

  return (
    <div className="min-h-screen bg-[#37beb7] bg-opacity-10 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-800">Add New Assessment</h2>
            <button
              onClick={() => navigate('/AssessmentList')}
              className="text-[#37beb7] hover:text-[#2da8a1] transition-colors duration-200 flex items-center"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Assessments
            </button>
          </div>

          <form onSubmit={handleSubmit} encType="multipart/form-data" className="space-y-6">
            {/* Course Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Course</label>
              <select
                name="courseId"
                value={formData.courseId}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#37beb7] focus:border-[#37beb7] transition-colors duration-200"
              >
                <option value="">Select a course</option>
                {courses.map((course) => (
                  <option key={course._id} value={course._id}>
                    {course.courseName}
                  </option>
                ))}
              </select>
            </div>

            {/* Topic */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Topic</label>
              <input
                type="text"
                name="topic"
                value={formData.topic}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#37beb7] focus:border-[#37beb7] transition-colors duration-200"
                placeholder="Enter assessment topic"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="4"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#37beb7] focus:border-[#37beb7] transition-colors duration-200"
                placeholder="Enter assessment description"
              />
            </div>

            {/* Assessment Link */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Assessment Link <span className="text-gray-500">(optional)</span>
              </label>
              <input
                type="url"
                name="assessmentLink"
                value={formData.assessmentLink}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#37beb7] focus:border-[#37beb7] transition-colors duration-200"
                placeholder="Enter assessment link"
              />
            </div>

            {/* PDF Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload PDF <span className="text-gray-500">(optional)</span>
              </label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-xl hover:border-[#37beb7] transition-colors duration-200">
                <div className="space-y-1 text-center">
                  <svg
                    className="mx-auto h-12 w-12 text-gray-400"
                    stroke="currentColor"
                    fill="none"
                    viewBox="0 0 48 48"
                    aria-hidden="true"
                  >
                    <path
                      d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <div className="flex text-sm text-gray-600">
                    <label
                      htmlFor="file-upload"
                      className="relative cursor-pointer bg-white rounded-md font-medium text-[#37beb7] hover:text-[#2da8a1] focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-[#37beb7]"
                    >
                      <span>Upload a file</span>
                      <input
                        id="file-upload"
                        name="file-upload"
                        type="file"
                        accept="application/pdf"
                        onChange={handleFileChange}
                        className="sr-only"
                      />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-500">PDF up to 10MB</p>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
              <button
                type="submit"
                className="px-6 py-3 bg-[#37beb7] text-white rounded-xl hover:bg-[#2da8a1] transition-colors duration-200 flex items-center"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Add Assessment
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AssessmentAddForm;
