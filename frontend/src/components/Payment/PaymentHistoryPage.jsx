import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import jsPDF from 'jspdf';

// Payment statuses constant
const STATUSES = ['All', 'Approved', 'Pending', 'Rejected'];

const PaymentHistoryPage = () => {
  const navigate = useNavigate();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('All');
  const [userId, setUserId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // JWT Decoding Function
  const decodeJwt = (token) => {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error('Error decoding JWT:', error);
      return null;
    }
  };

  // Fetch User ID from Token
  useEffect(() => {
    const token = localStorage.getItem('authToken') || localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    const decoded = decodeJwt(token);
    if (!decoded?.id) {
      navigate('/login');
      return;
    }
    setUserId(decoded.id);
  }, [navigate]);

  // Fetch Payment History
  const fetchPaymentHistory = async () => {
    if (!userId) return;

    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem('authToken') || localStorage.getItem('token');
      const res = await axios.get(`http://localhost:4000/payment/history/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const paymentData = res.data?.payments || res.data?.data || res.data;
      if (!paymentData) throw new Error('No payment data received');
      setPayments(Array.isArray(paymentData) ? paymentData : []);
    } catch (err) {
      console.error('Payment history error:', err);
      setError(err.response?.data?.message || err.message || 'Failed to load payment history');
      if (err.response?.status === 401) {
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchPaymentHistory();
    }
  }, [userId, filter]);

  const filteredPayments = payments.filter((payment) => {
    const matchesSearch = 
      payment.courseName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.amount?.toString().includes(searchTerm);
    const matchesFilter = filter === 'All' ? true : payment.status === filter;
    return matchesSearch && matchesFilter;
  });

  const handleDownloadPDF = () => {
    try {
      const doc = new jsPDF();
      
      // Add header
      doc.setFontSize(20);
      doc.setTextColor(55, 190, 183); // #37beb7
      doc.text('Payment History', 105, 20, { align: 'center' });
      
      // Add date
      doc.setFontSize(12);
      doc.setTextColor(100, 100, 100);
      doc.text('Generated on: ' + new Date().toLocaleDateString(), 105, 30, { align: 'center' });
      
      // Add line
      doc.setDrawColor(55, 190, 183);
      doc.line(20, 35, 190, 35);
      
      let yPosition = 50;
      
      // Add payment details
      filteredPayments.forEach((payment, index) => {
        if (yPosition > 270) {
          doc.addPage();
          yPosition = 20;
        }
        
        // Course name
        doc.setFontSize(14);
        doc.setTextColor(0, 0, 0);
        const courseName = payment.courseName ? payment.courseName.toString() : 'N/A';
        doc.text((index + 1) + '. ' + courseName, 20, yPosition);
        
        // Amount
        doc.setFontSize(12);
        const amount = payment.amount ? 'Rs ' + payment.amount.toString() : 'Rs 0';
        doc.text('Amount: ' + amount, 20, yPosition + 10);
        
        // Status
        const status = payment.status || 'Pending';
        // Set color based on status
        if (status === 'Approved') {
          doc.setTextColor(0, 128, 0); // Green
        } else if (status === 'Rejected') {
          doc.setTextColor(255, 0, 0); // Red
        } else {
          doc.setTextColor(255, 165, 0); // Orange
        }
        doc.text('Status: ' + status, 20, yPosition + 20);
        
        // Date
        doc.setTextColor(100, 100, 100);
        const date = payment.submittedAt 
          ? new Date(payment.submittedAt).toLocaleString()
          : 'N/A';
        doc.text('Date: ' + date, 20, yPosition + 30);
        
        // Add separator line
        doc.setDrawColor(200, 200, 200);
        doc.line(20, yPosition + 35, 190, yPosition + 35);
        
        yPosition += 45;
      });
      
      // Save the PDF
      doc.save('payment_history.pdf');
    } catch (err) {
      console.error('Error generating PDF:', err);
      alert('Failed to generate PDF. Please try again.');
    }
  };

  if (!userId) {
    return (
      <div className="min-h-screen bg-[#37beb7] bg-opacity-10 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#37beb7]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#37beb7] bg-opacity-10 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-800">Payment History</h2>
            <div className="flex items-center space-x-4">
              <button
                onClick={handleDownloadPDF}
                className="flex items-center px-4 py-2 bg-[#37beb7] text-white rounded-lg hover:bg-[#2da8a1] transition-colors duration-200"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Download PDF
              </button>
              <button
                onClick={() => navigate(-1)}
                className="flex items-center text-gray-600 hover:text-[#37beb7] transition-colors duration-200"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back
              </button>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-lg">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-red-700">{error}</p>
              </div>
              <button
                onClick={fetchPaymentHistory}
                className="mt-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors duration-200"
              >
                Try Again
              </button>
            </div>
          )}

          {/* Search and Filter Section */}
          <div className="mb-8 space-y-4 md:space-y-0 md:flex md:items-center md:justify-between">
            {/* Search Bar */}
            <div className="relative flex-1 max-w-md">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search by course name or amount..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#37beb7] focus:border-[#37beb7]"
              />
            </div>

            {/* Status Filter */}
            <div className="flex space-x-2">
              {STATUSES.map((status) => (
                <button
                  key={status}
                  onClick={() => setFilter(status)}
                  className={`px-4 py-2 rounded-lg transition-colors duration-200 ${
                    filter === status
                      ? status === 'Approved'
                        ? 'bg-green-500 text-white'
                        : status === 'Rejected'
                        ? 'bg-red-500 text-white'
                        : status === 'Pending'
                        ? 'bg-yellow-500 text-white'
                        : 'bg-[#37beb7] text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#37beb7] mb-4"></div>
              <p className="text-gray-600">Loading payment history...</p>
            </div>
          ) : filteredPayments.length === 0 ? (
            <div className="bg-gray-50 rounded-xl p-8 text-center">
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
              <h3 className="mt-2 text-lg font-medium text-gray-900">No payment records found</h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchTerm || filter !== 'All'
                  ? 'Try adjusting your search or filter criteria'
                  : 'You haven\'t made any payments yet.'}
              </p>
              <button
                onClick={fetchPaymentHistory}
                className="mt-4 bg-[#37beb7] text-white px-4 py-2 rounded-lg hover:bg-[#2da8a1] transition-colors duration-200"
              >
                Refresh Data
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPayments.map((payment) => (
                <div
                  key={payment._id}
                  className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-200"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-semibold text-gray-800">{payment.courseName || 'N/A'}</h3>
                    <span
                      className={`px-3 py-1 text-xs font-medium rounded-full ${
                        payment.status === 'Approved'
                          ? 'bg-green-100 text-green-800'
                          : payment.status === 'Rejected'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {payment.status || 'Pending'}
                    </span>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                      <p className="text-lg font-semibold text-gray-900">Rs {payment.amount || '0'}</p>
                      {payment.paymentSlip && (
                        <a
                          href={`http://localhost:4000/uploads/payments/${payment.paymentSlip}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#37beb7] hover:text-[#2da8a1] flex items-center"
                        >
                          <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                          View Slip
                        </a>
                      )}
                    </div>

                    <div className="text-sm text-gray-500">
                      {payment.submittedAt
                        ? new Date(payment.submittedAt).toLocaleString()
                        : 'N/A'}
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

export default PaymentHistoryPage;
