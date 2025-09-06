import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const PaymentSubmissionPage = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();

  const [course, setCourse] = useState({});
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [paymentSlip, setPaymentSlip] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const decodeJwt = (token) => {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error('Error decoding JWT:', error);
      return null;
    }
  };

  useEffect(() => {
    const authToken = localStorage.getItem("authToken") || localStorage.getItem("token");

    if (!authToken) {
      setError("You are not logged in.");
      setLoading(false);
      return;
    }

    const decodedToken = decodeJwt(authToken);
    if (!decodedToken) {
      setError("Invalid or expired token.");
      setLoading(false);
      return;
    }

    const userId = decodedToken.id;
    if (!userId) {
      setError("User ID missing in the token.");
      setLoading(false);
      return;
    }

    const fetchCourseDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:4000/course/detail/${courseId}`);
        setCourse(response.data.course);
      } catch (err) {
        console.error('Error fetching course:', err);
        setError('Failed to load course details');
      }
    };
  
    const fetchUserDetails = async () => {
      try {
        const token = localStorage.getItem('authToken') || localStorage.getItem('token');
        const response = await axios.get(`http://localhost:4000/api/users/user/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        
        const userData = response.data.data || response.data;
        
        if (!userData) {
          throw new Error('User data not found in response');
        }
        
        if (!userData.firstname || !userData.lastname) {
          throw new Error('Missing name fields in user data');
        }
        
        setUserName(`${userData.firstname} ${userData.lastname}`);
        setUserEmail(userData.email || '');
      } catch (err) {
        console.error('Error fetching user:', err.response?.data || err.message);
        setError('Failed to load user details. Please try again.');
      } finally {
        setLoading(false);
      }
    };
  
    fetchCourseDetails();
    fetchUserDetails();
  }, [courseId]);
  

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!paymentSlip) {
      alert('Please upload your payment slip.');
      return;
    }

    const authToken = localStorage.getItem("authToken") || localStorage.getItem("token");
    const decodedToken = decodeJwt(authToken);
    const userId = decodedToken?.id;

    if (!userId) {
      alert('User ID not found in token');
      return;
    }

    setSubmitting(true);
  
    const formData = new FormData();
    formData.append('userId', userId); // Critical fix - adding userId
    formData.append('userName', userName);
    formData.append('userEmail', userEmail);
    formData.append('courseId', course._id);
    formData.append('courseName', course.courseName);
    formData.append('amount', course.courseAmount);
    formData.append('paymentSlip', paymentSlip);
  
    try {
      const response = await axios.post('http://localhost:4000/payment/submit', formData, {
        headers: {
          Authorization: `Bearer ${authToken}`,
          'Content-Type': 'multipart/form-data'
        }
        
      }
    );
    // axios.post(`http://localhost:4000/course/user/enroll/${courseId}`, {}, {
    //   headers: {
    //     Authorization: `Bearer ${token}`
    //   }
    // })
    //   .then((response) => {
    //     navigate(`/payment/${courseId}`)

    //   })
    //   .catch((err) => {
    //     console.error('Enrollment error:', err);
    //     alert('Failed to enroll in the course');
    //   });
      
      alert(response.data.message || 'Payment submitted successfully! Awaiting admin approval.');
      navigate('/EnrollCourse');
    } catch (err) {
      console.error('Payment submission error:', err.response?.data || err.message);
      alert(err.response?.data?.message || 'Failed to submit payment');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#37beb7] bg-opacity-10 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-[#37beb7] border-t-transparent"></div>
          <p className="mt-4 text-gray-600">Loading payment details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#37beb7] bg-opacity-10 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-6 max-w-md w-full">
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
            <div className="flex items-center">
              <svg className="h-5 w-5 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-red-700">{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#37beb7] bg-opacity-10 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden mb-8 transform hover:scale-[1.01] transition duration-300">
          <div className="bg-[#37beb7] p-8 relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-16 -mt-16"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-white opacity-10 rounded-full -ml-16 -mb-16"></div>
            <div className="relative z-10">
              <h1 className="text-4xl font-bold text-white mb-4">Complete Your Payment</h1>
              <p className="text-white text-lg opacity-90">Course: {course.courseName}</p>
            </div>
          </div>
        </div>

        {/* Payment Form */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* User Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">User Name</label>
                <input
                  type="text"
                  value={userName}
                  readOnly
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#37beb7] focus:border-[#37beb7] transition duration-200"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">User Email</label>
                <input
                  type="email"
                  value={userEmail}
                  readOnly
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#37beb7] focus:border-[#37beb7] transition duration-200"
                />
              </div>
            </div>

            {/* Course Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Course Name</label>
                <input
                  type="text"
                  value={course.courseName}
                  readOnly
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#37beb7] focus:border-[#37beb7] transition duration-200"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Amount</label>
                <input
                  type="text"
                  value={`Rs. ${course.courseAmount || 0}`}
                  readOnly
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#37beb7] focus:border-[#37beb7] transition duration-200"
                />
              </div>
            </div>

            {/* Payment Slip Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Upload Payment Slip</label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-200 border-dashed rounded-xl hover:border-[#37beb7] transition duration-200">
                <div className="space-y-1 text-center">
                  <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                    <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <div className="flex text-sm text-gray-600">
                    <label className="relative cursor-pointer bg-white rounded-md font-medium text-[#37beb7] hover:text-[#2da8a1] focus-within:outline-none">
                      <span>Upload a file</span>
                      <input
                        type="file"
                        accept="image/*,application/pdf"
                        onChange={(e) => setPaymentSlip(e.target.files[0])}
                        required
                        className="sr-only"
                      />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-500">PNG, JPG, PDF up to 10MB</p>
                </div>
              </div>
              {paymentSlip && (
                <p className="mt-2 text-sm text-gray-500">
                  Selected file: {paymentSlip.name}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={submitting}
              className={`w-full py-3 px-4 rounded-xl text-white font-medium text-lg transition duration-200 transform hover:scale-[1.02] ${
                submitting
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-[#37beb7] hover:bg-[#2da8a1] shadow-lg hover:shadow-xl'
              }`}
            >
              {submitting ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing Payment...
                </span>
              ) : (
                'Submit Payment'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PaymentSubmissionPage;