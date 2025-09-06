import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import jsPDF from 'jspdf';

const CourseDetailPage = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [assessments, setAssessments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submissions, setSubmissions] = useState({});
  const [showSubmissionModal, setShowSubmissionModal] = useState(false);
  const [selectedAssessment, setSelectedAssessment] = useState(null);
  const [submissionFile, setSubmissionFile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [completedLectures, setCompletedLectures] = useState([]);
  const [authError, setAuthError] = useState(false);
  const [userId, setUserId] = useState('');
  const [showCertificateButton, setShowCertificateButton] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState('');
  const [isGeneratingCertificate, setIsGeneratingCertificate] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('authToken');
        if (!token) {
          navigate('/login');
          return;
        }

        const decodedToken = jwtDecode(token);
        const userId = decodedToken.id;
        setUserId(userId);

        // Fetch course data
        const courseRes = await axios.get(`http://localhost:4000/course/get/${courseId}`);
        setCourse(courseRes.data.course);

        // Fetch payment status
        const paymentRes = await axios.get(`http://localhost:4000/payment/status/${courseId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setPaymentStatus(paymentRes.data.status);

        if (!userId || !token) {
          setAuthError(true);
          return;
        }

        // Only fetch course content if payment is approved
        if (paymentRes.data.status === 'Approved') {
          try {
            // Fetch assessments
            const assessmentRes = await axios.get(`http://localhost:4000/assessment/course/${courseId}`);
            setAssessments(assessmentRes.data.assessments || []);

            // Fetch submissions
            try {
              const submissionRes = await axios.get(
                `http://localhost:4000/submission/course/${courseId}/user/${userId}`,
                { headers: { Authorization: `Bearer ${token}` } }
              );
              const submissionsObj = {};
              (submissionRes.data.submissions || []).forEach(sub => {
                submissionsObj[sub.assessmentId] = sub;
              });
              setSubmissions(submissionsObj);
            } catch (submissionErr) {
              console.error('Submission fetch error:', submissionErr);
              setSubmissions({});
            }

            // Fetch progress
            try {
              const progressRes = await axios.get(
                `http://localhost:4000/progress/${courseId}/${userId}`,
                { headers: { Authorization: `Bearer ${token}` } }
              );
              
              if (progressRes.data?.completedLectures) {
                setCompletedLectures(progressRes.data.completedLectures);
              } else {
                console.error('Invalid progress data format');
                setCompletedLectures([]);
              }
            } catch (progressErr) {
              console.error('Progress fetch error:', progressErr);
              setCompletedLectures([]);
            }
          } catch (apiError) {
            console.error('Error fetching authenticated data:', apiError);
            setAssessments([]);
            setSubmissions({});
            setCompletedLectures([]);
          }
        }
      } catch (err) {
        console.error('Error fetching course data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [courseId, navigate]);

  const openSubmissionModal = (assessment, edit = false) => {
    if (!userId) {
      alert('Please log in to submit assignments');
      navigate('/login');
      return;
    }
    setSelectedAssessment(assessment);
    setIsEditing(edit);
    setSubmissionFile(null);
    setShowSubmissionModal(true);
  };

  const handleSubmission = async () => {
    if (!submissionFile && !isEditing) return;

    const formData = new FormData();
    formData.append('assessmentId', selectedAssessment._id);
    formData.append('courseId', courseId);
    formData.append('submissionFile', submissionFile);

    try {
      const token = localStorage.getItem('authToken');
      let response;
      
      if (isEditing && submissions[selectedAssessment._id]) {
        response = await axios.put(
          `http://localhost:4000/submission/edit/${submissions[selectedAssessment._id]._id}`,
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
              Authorization: `Bearer ${token}`,
            },
          }
        );
      } else {
        response = await axios.post(
          'http://localhost:4000/submission/add',
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
              Authorization: `Bearer ${token}`,
            },
          }
        );
      }

      setSubmissions(prev => ({
        ...prev,
        [selectedAssessment._id]: response.data.submission
      }));

      setShowSubmissionModal(false);
      alert('Submission processed successfully!');
    } catch (err) {
      console.error('Submission error:', err);
      alert(`Failed to process submission: ${err.response?.data?.message || err.message}`);
    }
  };

  const removeSubmission = async (assessmentId) => {
    if (!window.confirm('Are you sure you want to remove this submission?')) return;

    try {
      const token = localStorage.getItem('authToken');
      await axios.delete(
        `http://localhost:4000/submission/${submissions[assessmentId]._id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSubmissions(prev => {
        const newSubmissions = { ...prev };
        delete newSubmissions[assessmentId];
        return newSubmissions;
      });

      alert('Submission removed successfully!');
    } catch (err) {
      console.error('Error removing submission:', err);
      alert(`Failed to remove submission: ${err.response?.data?.message || err.message}`);
    }
  };

  const toggleLectureCompletion = async (lectureId) => {
    try {
      const token = localStorage.getItem('authToken');
      
      if (!userId) {
        alert('Please log in to track progress');
        return;
      }

      if (userId && token) {
        const response = await axios.post(
          `http://localhost:4000/progress/toggle-lecture`,
          { courseId, lectureId, userId },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        
        if (response.data && Array.isArray(response.data.completedLectures)) {
          setCompletedLectures(response.data.completedLectures);
        }
      }
    } catch (err) {
      console.error('Error toggling lecture completion:', err);
      alert('Failed to update lecture status. Please try again.');
    }
  };

  const calculateProgress = () => {
    if (!course) return 0;
    
    const totalLectures = course.lectures?.length || 0;
    const totalAssessments = assessments.length;
    const totalItems = totalLectures + totalAssessments;
    
    if (totalItems === 0) return 0;
    
    const completedLectureCount = completedLectures.length;
    const completedAssessmentCount = Object.keys(submissions).length;
    
    return Math.round(((completedLectureCount + completedAssessmentCount) / totalItems) * 100);
  };

  const calculateGrade = (average) => {
    if (average >= 85) return 'High Distinction (HD)';
    if (average >= 75) return 'Distinction (DN)';
    if (average >= 65) return 'Credit (CR)';
    if (average >= 45) return 'Pass (PS)';
    return 'Fail (F)';
  };

  const calculateAverageGrade = () => {
    let totalGrade = 0;
    let gradedCount = 0;

    Object.values(submissions).forEach(submission => {
      if (submission.status === 'Graded' && submission.grade) {
        // Convert grade to number if it's a percentage string
        const gradeValue = typeof submission.grade === 'string' 
          ? parseFloat(submission.grade.replace('%', ''))
          : submission.grade;
        
        if (!isNaN(gradeValue)) {
          totalGrade += gradeValue;
          gradedCount++;
        }
      }
    });

    return gradedCount > 0 ? totalGrade / gradedCount : 0;
  };

  const handleDownloadCertificate = () => {
    try {
      setIsGeneratingCertificate(true);
      const token = localStorage.getItem('authToken');
      
      // Calculate average grade
      const averageGrade = calculateAverageGrade();
      const finalGrade = calculateGrade(averageGrade);

      // Get user data from token
      const decodedToken = jwtDecode(token);
      const userName = decodedToken.name || 'Student';

      // Create PDF document
      const doc = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4'
      });

      // Add background color
      doc.setFillColor(55, 190, 183); // #37beb7
      doc.rect(0, 0, 297, 210, 'F');

      // Add white content area
      doc.setFillColor(255, 255, 255);
      doc.rect(10, 10, 277, 190, 'F');

      // Add border
      doc.setDrawColor(55, 190, 183);
      doc.setLineWidth(2);
      doc.rect(15, 15, 267, 180);

      // Add certificate title
      doc.setFontSize(36);
      doc.setTextColor(55, 190, 183);
      doc.setFont('helvetica', 'bold');
      doc.text('Certificate of Completion', 148.5, 40, { align: 'center' });

      // Add decorative line
      doc.setDrawColor(55, 190, 183);
      doc.setLineWidth(1);
      doc.line(50, 50, 247, 50);

      // Add certificate content
      doc.setFontSize(16);
      doc.setTextColor(0, 0, 0);
      doc.setFont('helvetica', 'normal');
      doc.text('This is to certify that', 148.5, 70, { align: 'center' });

      // Add student name
      doc.setFontSize(24);
      doc.setFont('helvetica', 'bold');
      doc.text(userName, 148.5, 85, { align: 'center' });

      // Add course completion text
      doc.setFontSize(16);
      doc.setFont('helvetica', 'normal');
      doc.text('has successfully completed the course', 148.5, 100, { align: 'center' });

      // Add course name
      doc.setFontSize(20);
      doc.setFont('helvetica', 'bold');
      doc.text(course.courseName, 148.5, 115, { align: 'center' });

      // Add grade information
      doc.setFontSize(16);
      doc.setFont('helvetica', 'normal');
      doc.text(`with a grade of: ${finalGrade}`, 148.5, 130, { align: 'center' });
      doc.text(`(Average Score: ${averageGrade.toFixed(2)}%)`, 148.5, 140, { align: 'center' });

      // Add completion date
      doc.text(`Completion Date: ${new Date().toLocaleDateString()}`, 148.5, 155, { align: 'center' });

      // Add certificate ID
      // doc.setFontSize(12);
      // doc.setTextColor(128, 128, 128);
      // const certificateId = `CERT-${courseId}-${Date.now()}`;
      // doc.text(`Certificate ID: TeaCups`, 148.5, 170, { align: 'center' });

      // Add decorative elements
      doc.setDrawColor(55, 190, 183);
      doc.setLineWidth(0.5);
      doc.line(50, 160, 247, 160);

      // Save the PDF
      doc.save(`${course.courseName}_Certificate_${userName.replace(/\s+/g, '_')}.pdf`);
    } catch (err) {
      console.error('Error generating certificate:', err);
      alert('Failed to generate certificate. Please try again.');
    } finally {
      setIsGeneratingCertificate(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#37beb7] bg-opacity-10 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#37beb7]"></div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-[#37beb7] bg-opacity-10 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Course Not Found</h2>
          <p className="text-gray-600 mb-6">The course you're looking for doesn't exist or has been removed.</p>
          <button
            onClick={() => navigate('/courses')}
            className="px-6 py-3 bg-[#37beb7] text-white rounded-xl hover:bg-[#2da8a1] transition duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            Browse Courses
          </button>
        </div>
      </div>
    );
  }

  if (paymentStatus !== 'Approved') {
    return (
      <div className="min-h-screen bg-[#37beb7] bg-opacity-10 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden mb-8">
            <div className="bg-[#37beb7] p-8 relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-16 -mt-16"></div>
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-white opacity-10 rounded-full -ml-16 -mb-16"></div>
              <div className="relative z-10">
                <h1 className="text-4xl font-bold text-white mb-4">{course.courseName}</h1>
                <p className="text-white text-lg opacity-90">Duration: {course.courseDuration}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-lg mb-6">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-yellow-700">
                    Your payment status is: <strong>{paymentStatus}</strong>
                  </p>
                  <p className="mt-2 text-sm text-yellow-700">
                    You will be able to access the course content once your payment is approved by the administrator.
                  </p>
                </div>
              </div>
            </div>

            <div className="prose max-w-none">
              <p className="text-lg text-gray-700 mb-4">{course.courseDescription}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#37beb7] bg-opacity-10 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Course Header */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden mb-8">
          <div className="bg-[#37beb7] p-8 relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-16 -mt-16"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-white opacity-10 rounded-full -ml-16 -mb-16"></div>
            <div className="relative z-10">
              <h1 className="text-4xl font-bold text-white mb-4">{course.courseName}</h1>
              <div className="flex items-center justify-between">
                <p className="text-white text-lg opacity-90">Duration: {course.courseDuration}</p>
                {calculateProgress() === 100 && (
                  <button
                    onClick={handleDownloadCertificate}
                    disabled={isGeneratingCertificate}
                    className="bg-white text-[#37beb7] px-6 py-2 rounded-xl hover:bg-opacity-90 transition-colors duration-200 flex items-center space-x-2 shadow-lg"
                  >
                    {isGeneratingCertificate ? (
                      <>
                        <svg className="animate-spin h-5 w-5 text-[#37beb7]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span>Generating...</span>
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <span>Download Certificate</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Course Image */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8">
          <img
            src={`http://localhost:4000/uploads/${course.coursePhoto}`}
            alt={course.courseName}
            className="w-full h-64 object-cover"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://placehold.co/800x400?text=Course+Image';
            }}
          />
        </div>

        {/* Course Description */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">About This Course</h2>
          <p className="text-lg text-gray-700">{course.courseDescription}</p>
        </div>

        {/* Progress Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-800">Course Progress</h2>
            <span className="text-lg font-semibold text-[#37beb7]">{calculateProgress()}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className="bg-[#37beb7] h-3 rounded-full transition-all duration-300" 
              style={{ width: `${calculateProgress()}%` }}
            ></div>
          </div>
        </div>

        {/* Lectures Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Lectures & Materials</h2>
          {course.lectures && course.lectures.length > 0 ? (
            <div className="space-y-4">
              {course.lectures.map((lecture, idx) => (
                <div 
                  key={lecture._id} 
                  className="p-6 bg-gray-50 rounded-xl border border-gray-200 hover:bg-gray-100 transition-all duration-300 flex justify-between items-start"
                >
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">
                      {lecture.topicName || `Lecture ${idx + 1}`}
                    </h3>
                    {lecture.material ? (
                      <a
                        href={lecture.material}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-[#37beb7] hover:text-[#2da8a1] transition-colors duration-200"
                      >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        View Material
                      </a>
                    ) : (
                      <p className="text-gray-500">No materials available</p>
                    )}
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={completedLectures.includes(lecture._id)}
                      onChange={() => toggleLectureCompletion(lecture._id)}
                      className="h-5 w-5 text-[#37beb7] rounded focus:ring-[#37beb7] cursor-pointer"
                      id={`lecture-${lecture._id}`}
                    />
                    <label htmlFor={`lecture-${lecture._id}`} className="sr-only">
                      Mark as complete
                    </label>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
              <p className="text-gray-500">No lectures or materials added yet.</p>
            </div>
          )}
        </div>

        {/* Assessments Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Assessments</h2>
          {assessments.length > 0 ? (
            <div className="space-y-4">
              {assessments.map((assess) => (
                <div key={assess._id} className="p-6 bg-gray-50 rounded-xl border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">{assess.topic}</h3>
                  <p className="text-gray-600 mb-4">{assess.description}</p>
                  
                  {assess.assessmentLink && (
                    <a
                      href={assess.assessmentLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-[#37beb7] hover:text-[#2da8a1] transition-colors duration-200 mb-4"
                    >
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      View Assessment
                    </a>
                  )}

                  {submissions[assess._id] ? (
                    <div className="space-y-4">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium text-gray-700">Status:</span>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          submissions[assess._id].status === 'Graded' 
                            ? 'bg-green-100 text-green-800'
                            : submissions[assess._id].status === 'Submitted'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {submissions[assess._id].status}
                        </span>
                      </div>

                      {submissions[assess._id].status === 'Graded' ? (
                        <div className="bg-white p-4 rounded-lg border border-gray-200">
                          <div className="grid grid-cols-2 gap-4 mb-4">
                            <div>
                              <span className="text-sm font-medium text-gray-700">Grade:</span>
                              <p className="text-lg font-semibold text-[#37beb7]">{submissions[assess._id].grade || 'N/A'}</p>
                            </div>
                            <div>
                              <span className="text-sm font-medium text-gray-700">Graded On:</span>
                              <p className="text-sm text-gray-600">
                                {new Date(submissions[assess._id].gradedAt).toLocaleString()}
                              </p>
                            </div>
                          </div>
                          {submissions[assess._id].feedback && (
                            <div>
                              <span className="text-sm font-medium text-gray-700">Feedback:</span>
                              <p className="mt-1 text-gray-600">{submissions[assess._id].feedback}</p>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="flex flex-wrap gap-2">
                          <button
                            onClick={() => openSubmissionModal(assess, true)}
                            className="px-4 py-2 bg-yellow-100 text-yellow-800 rounded-xl hover:bg-yellow-200 transition-colors duration-200"
                          >
                            Edit Submission
                          </button>
                          <button
                            onClick={() => removeSubmission(assess._id)}
                            className="px-4 py-2 bg-red-100 text-red-800 rounded-xl hover:bg-red-200 transition-colors duration-200"
                          >
                            Remove Submission
                          </button>
                          <a
                            href={`http://localhost:4000/uploads/submissions/${submissions[assess._id].submissionFile}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-4 py-2 bg-blue-100 text-blue-800 rounded-xl hover:bg-blue-200 transition-colors duration-200 inline-flex items-center"
                          >
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                            View Submission
                          </a>
                        </div>
                      )}

                      <p className="text-sm text-gray-500">
                        Submitted on: {new Date(submissions[assess._id].submittedAt).toLocaleString()}
                      </p>
                    </div>
                  ) : (
                    <button
                      onClick={() => openSubmissionModal(assess)}
                      className="px-4 py-2 bg-[#37beb7] text-white rounded-xl hover:bg-[#2da8a1] transition-colors duration-200"
                    >
                      Add Submission
                    </button>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
              <p className="text-gray-500">No assessments available for this course.</p>
            </div>
          )}
        </div>
      </div>

      {/* Submission Modal */}
      {showSubmissionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 w-full max-w-md">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">
              {isEditing ? 'Edit' : 'Add'} Submission
            </h3>
            
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-medium mb-2">
                Assessment: {selectedAssessment.topic}
              </label>
              <input
                type="file"
                accept=".pdf,.doc,.docx,.zip"
                onChange={(e) => setSubmissionFile(e.target.files[0])}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#37beb7] focus:border-transparent"
              />
            </div>
            
            {isEditing && submissions[selectedAssessment._id] && (
              <p className="text-sm text-gray-600 mb-4">
                Current file: {submissions[selectedAssessment._id].submissionFile}
              </p>
            )}

            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowSubmissionModal(false)}
                className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmission}
                disabled={!submissionFile && !isEditing}
                className={`px-6 py-3 rounded-xl text-white transition-colors duration-200 ${
                  submissionFile || isEditing 
                    ? 'bg-[#37beb7] hover:bg-[#2da8a1]' 
                    : 'bg-gray-400 cursor-not-allowed'
                }`}
              >
                {isEditing ? 'Update Submission' : 'Submit'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseDetailPage;

