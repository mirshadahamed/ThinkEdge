import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const InstructorAssessView = () => {
  const { courseId } = useParams();
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [gradingSubmission, setGradingSubmission] = useState(null);
  const [grade, setGrade] = useState('');
  const [feedback, setFeedback] = useState('');
  const [gradingLoading, setGradingLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

//   useEffect(() => {
//     const fetchSubmissions = async () => {
//       try {
//         setLoading(true);
//         const response = await axios.get(`http://localhost:4000/submission/submissions/${courseId}`, {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem('authToken')}`,
//           },
//         });
//         setSubmissions(response.data.submissions);
//       } catch (error) {
//         console.error('Error fetching submissions:', error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchSubmissions();
//   }, [courseId]);

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:4000/submission/submissions`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('authToken')}`,
          },
        });
        setSubmissions(response.data.submissions);
      } catch (error) {
        console.error('Error fetching submissions:', error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchSubmissions();
  }, []);
  

  const handleGradeSubmission = async (submissionId) => {
    setGradingLoading(true);
    try {
      const response = await axios.put(`http://localhost:4000/submission/grade-submission/${submissionId}`, {
        grade,
        feedback,
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
        },
      });
      setSubmissions(submissions.map(sub => 
        sub._id === submissionId ? { ...sub, status: 'Graded', grade, feedback } : sub
      ));
      setGradingSubmission(null);
      setGrade('');
      setFeedback('');
      alert('Submission graded successfully!');
    } catch (error) {
      console.error('Error grading submission:', error);
      alert('Failed to grade submission.');
    } finally {
      setGradingLoading(false);
    }
  };

  const handleResetGrade = async (submissionId) => {
  if (!window.confirm('Are you sure you want to delete the grade? This will revert the submission status.')) return;
  
  try {
    await axios.put(`http://localhost:4000/submission/reset-grade/${submissionId}`, {}, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('authToken')}`,
      },
    });

    setSubmissions(submissions.map(sub =>
      sub._id === submissionId
        ? { ...sub, grade: '', feedback: '', status: 'Submitted for Evaluation' }
        : sub
    ));

    alert('Grade removed successfully.');
  } catch (error) {
    console.error('Error resetting grade:', error);
    alert('Failed to remove grade.');
  }
};

  const handleEditSubmission = (submission) => {
    setGradingSubmission(submission);
    setGrade(submission.grade || '');
    setFeedback(submission.feedback || '');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header with Search */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <h2 className="text-2xl font-bold text-gray-900">Submissions Dashboard</h2>
            
          </div>
        </div>

        {/* Main Content */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
          </div>
        ) : submissions.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {submissions.map((submission) => (
              <div
                key={submission._id}
                className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200"
              >
                <div className="p-6">
                  {/* Student Info Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      
                      <p className="text-sm text-gray-500 mt-1">
                        Submission ID: {submission._id.slice(-6)}
                      </p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      submission.status === 'Graded' 
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {submission.status}
                    </span>
                  </div>

                  {/* Grade Info */}
                  <div className="bg-gray-50 rounded-lg p-4 mb-4">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Current Grade:</span>
                      <span className="font-semibold text-gray-900">
                        {submission.grade || 'Not graded'}
                      </span>
                    </div>
                  </div>

                  {/* Download Link */}
                  {submission.submissionFile && (
                    <a
                      href={`http://localhost:4000/uploads/submissions/${submission.submissionFile}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-purple-600 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors duration-200 mb-4"
                    >
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      Download Submission
                    </a>
                  )}

                  {/* Action Buttons */}
                  <div className="space-y-2">
                    {submission.status === 'Submitted for Evaluation' && (
                      <button
                        onClick={() => handleEditSubmission(submission)}
                        className="w-full bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors duration-200 flex items-center justify-center"
                      >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Grade Submission
                      </button>
                    )}

                    {submission.status === 'Graded' && (
                      <>
                        <button
                          onClick={() => handleEditSubmission(submission)}
                          className="w-full bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition-colors duration-200 flex items-center justify-center"
                        >
                          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                          Edit Grade
                        </button>
                        <button
                          onClick={() => handleResetGrade(submission._id)}
                          className="w-full bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors duration-200 flex items-center justify-center"
                        >
                          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                          Delete Grade
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="mt-2 text-lg font-medium text-gray-900">No submissions found</h3>
            {searchQuery && (
              <p className="mt-1 text-gray-500">Try adjusting your search query</p>
            )}
          </div>
        )}
      </div>

      {/* Grading Modal */}
      {gradingSubmission && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md mx-4">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900">
                  {gradingSubmission.status === 'Graded' ? 'Edit Grade' : 'Grade Submission'}
                </h3>
                <button
                  onClick={() => {
                    setGradingSubmission(null);
                    setGrade('');
                    setFeedback('');
                  }}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                
                {gradingSubmission.status === 'Graded' && (
                  <p className="text-gray-600 mt-2">
                    <span className="font-medium">Current Grade:</span> {gradingSubmission.grade}
                  </p>
                )}
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Grade</label>
                  <input
                    type="text"
                    placeholder="Enter grade"
                    value={grade}
                    onChange={(e) => setGrade(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Feedback</label>
                  <textarea
                    placeholder="Enter feedback"
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    rows="4"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => {
                    setGradingSubmission(null);
                    setGrade('');
                    setFeedback('');
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleGradeSubmission(gradingSubmission._id)}
                  disabled={gradingLoading}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 flex items-center"
                >
                  {gradingLoading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Grading...
                    </>
                  ) : (
                    'Submit Grade'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InstructorAssessView;