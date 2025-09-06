import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('authToken');
        if (!token) {
          navigate('/login');
          return;
        }

        const decoded = jwtDecode(token);
        const response = await axios.get(`http://localhost:4000/user/${decoded.id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setUser(response.data.user);
        setFormData({
          name: response.data.user.name,
          email: response.data.user.email,
          phone: response.data.user.phone || '',
          address: response.data.user.address || '',
        });
        setLoading(false);
      } catch (err) {
        console.error('Error fetching user data:', err);
        setError('Failed to load user data');
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('authToken');
      const decoded = jwtDecode(token);
      const response = await axios.put(
        `http://localhost:4000/user/update/${decoded.id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setUser(response.data.user);
      setIsEditing(false);
      alert('Profile updated successfully!');
    } catch (err) {
      console.error('Error updating profile:', err);
      setError('Failed to update profile');
    }
  };

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
        <div className="text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#37beb7] bg-opacity-10 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800">Profile</h2>
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="bg-[#37beb7] text-white px-4 py-2 rounded-lg hover:bg-[#2da8a1] transition-colors duration-200"
              >
                Edit Profile
              </button>
            )}
          </div>

          {isEditing ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#37beb7] focus:border-[#37beb7]"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#37beb7] focus:border-[#37beb7]"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#37beb7] focus:border-[#37beb7]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  rows="3"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#37beb7] focus:border-[#37beb7]"
                />
              </div>
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-[#37beb7] text-white rounded-lg hover:bg-[#2da8a1] transition-colors duration-200"
                >
                  Save Changes
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Name</h3>
                  <p className="mt-1 text-lg text-gray-900">{user.name}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Email</h3>
                  <p className="mt-1 text-lg text-gray-900">{user.email}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Phone</h3>
                  <p className="mt-1 text-lg text-gray-900">{user.phone || 'Not provided'}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Address</h3>
                  <p className="mt-1 text-lg text-gray-900">{user.address || 'Not provided'}</p>
                </div>
              </div>

              {/* Role-specific sections */}
              {user.role === 'admin' && (
                <div className="mt-8 pt-8 border-t border-gray-200">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">Admin Dashboard</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-[#37beb7] bg-opacity-10 rounded-xl p-6">
                      <h4 className="text-lg font-medium text-gray-800 mb-2">Admin Stats</h4>
                      <div className="space-y-2">
                        <p className="text-gray-600">Role: Administrator</p>
                        <p className="text-gray-600">Account Status: Active</p>
                        <p className="text-gray-600">Last Login: {new Date().toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="bg-[#37beb7] bg-opacity-10 rounded-xl p-6">
                      <h4 className="text-lg font-medium text-gray-800 mb-2">Quick Actions</h4>
                      <div className="space-y-3">
                        <button
                          onClick={() => navigate('/admin-payments')}
                          className="w-full px-4 py-2 bg-[#37beb7] text-white rounded-lg hover:bg-[#2da8a1] transition-colors duration-200 flex items-center justify-center"
                        >
                          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                          </svg>
                          Manage Payments
                        </button>
                        <button
                          onClick={() => navigate('/admin-dashboard')}
                          className="w-full px-4 py-2 bg-white border border-[#37beb7] text-[#37beb7] rounded-lg hover:bg-[#37beb7] hover:text-white transition-colors duration-200 flex items-center justify-center"
                        >
                          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                          </svg>
                          View Dashboard
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {user.role === 'instructor' && (
                <div className="mt-8 pt-8 border-t border-gray-200">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">Instructor Dashboard</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-[#37beb7] bg-opacity-10 rounded-xl p-6">
                      <h4 className="text-lg font-medium text-gray-800 mb-2">Instructor Stats</h4>
                      <div className="space-y-2">
                        <p className="text-gray-600">Role: Instructor</p>
                        <p className="text-gray-600">Account Status: Active</p>
                        <p className="text-gray-600">Last Login: {new Date().toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="bg-[#37beb7] bg-opacity-10 rounded-xl p-6">
                      <h4 className="text-lg font-medium text-gray-800 mb-2">Quick Actions</h4>
                      <div className="space-y-3">
                        <button
                          onClick={() => navigate('/AssessmentList')}
                          className="w-full px-4 py-2 bg-[#37beb7] text-white rounded-lg hover:bg-[#2da8a1] transition-colors duration-200 flex items-center justify-center"
                        >
                          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                          </svg>
                          Manage Assessments
                        </button>
                        <button
                          onClick={() => navigate('/instructor-courses')}
                          className="w-full px-4 py-2 bg-white border border-[#37beb7] text-[#37beb7] rounded-lg hover:bg-[#37beb7] hover:text-white transition-colors duration-200 flex items-center justify-center"
                        >
                          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                          </svg>
                          View Courses
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {user.role === 'student' && (
                <div className="mt-8 pt-8 border-t border-gray-200">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">Student Dashboard</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-[#37beb7] bg-opacity-10 rounded-xl p-6">
                      <h4 className="text-lg font-medium text-gray-800 mb-2">Student Stats</h4>
                      <div className="space-y-2">
                        <p className="text-gray-600">Role: Student</p>
                        <p className="text-gray-600">Account Status: Active</p>
                        <p className="text-gray-600">Last Login: {new Date().toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="bg-[#37beb7] bg-opacity-10 rounded-xl p-6">
                      <h4 className="text-lg font-medium text-gray-800 mb-2">Quick Actions</h4>
                      <div className="space-y-3">
                        <button
                          onClick={() => navigate('/enrolled-courses')}
                          className="w-full px-4 py-2 bg-[#37beb7] text-white rounded-lg hover:bg-[#2da8a1] transition-colors duration-200 flex items-center justify-center"
                        >
                          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                          </svg>
                          View Enrolled Courses
                        </button>
                        <button
                          onClick={() => navigate('/available-courses')}
                          className="w-full px-4 py-2 bg-white border border-[#37beb7] text-[#37beb7] rounded-lg hover:bg-[#37beb7] hover:text-white transition-colors duration-200 flex items-center justify-center"
                        >
                          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                          Browse Courses
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile; 