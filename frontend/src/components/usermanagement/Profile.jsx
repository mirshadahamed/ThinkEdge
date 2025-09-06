// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";

// const Profile = () => {
//   const [user, setUser] = useState(null);
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(true);
//   const [isEditing, setIsEditing] = useState(false);
//   const [formData, setFormData] = useState({});
//   const [activeTab, setActiveTab] = useState("profile");
//   const navigate = useNavigate();

//   const decodeJwt = (token) => {
//     try {
//       const base64Url = token.split('.')[1];
//       const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
//       const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
//         return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
//       }).join(''));
//       return JSON.parse(jsonPayload);
//     } catch (error) {
//       console.error('Error decoding JWT:', error);
//       return null;
//     }
//   };

//   useEffect(() => {
//     const authToken = localStorage.getItem("authToken");

//     if (!authToken) {
//       setError("You are not logged in.");
//       setLoading(false);
//       return;
//     }

//     const decodedToken = decodeJwt(authToken);
//     if (!decodedToken) {
//       setError("Invalid or expired token.");
//       setLoading(false);
//       return;
//     }

//     const userId = decodedToken.id;
//     if (!userId) {
//       setError("User ID missing in the token.");
//       setLoading(false);
//       return;
//     }

//     const fetchUserDetails = async () => {
//       try {
//         const response = await axios.get(`http://localhost:4000/api/users/user/${userId}`, {
//           headers: {
//             "Authorization": `Bearer ${authToken}`
//           }
//         });
//         setUser(response.data.data);
//         setFormData(response.data.data);
//         setLoading(false);
//       } catch (err) {
//         console.error("Error fetching user details:", err);
//         setError("Failed to load user data.");
//         setLoading(false);
//       }
//     };

//     fetchUserDetails();
//   }, []);

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({
//       ...formData,
//       [name]: value,
//     });
//   };

//   const handleSaveChanges = async (e) => {
//     e.preventDefault();
//     const authToken = localStorage.getItem("authToken");

//     if (!authToken) {
//       setError("You are not logged in.");
//       return;
//     }

//     try {
//       const userId = user._id;
//       const response = await axios.put(
//         `http://localhost:4000/api/users/user/${userId}`,
//         formData,
//         {
//           headers: {
//             "Authorization": `Bearer ${authToken}`,
//           },
//         }
//       );
//       setUser(response.data.data);
//       setIsEditing(false);
//       setError("");
//     } catch (err) {
//       console.error("Error saving changes:", err);
//       setError("Failed to save changes.");
//     }
//   };

//   const handleDeleteProfile = async () => {
//     if (!window.confirm("Are you sure you want to delete your profile? This action cannot be undone.")) {
//       return;
//     }

//     const authToken = localStorage.getItem("authToken");
//     if (!authToken) {
//       setError("You are not logged in.");
//       return;
//     }

//     try {
//       await axios.delete(`http://localhost:4000/api/users/delete/${user._id}`, {
//         headers: {
//           "Authorization": `Bearer ${authToken}`,
//         },
//       });
//       localStorage.removeItem("authToken");
//       window.location.href = "/";
//     } catch (err) {
//       console.error("Error deleting profile:", err);
//       setError("Failed to delete profile.");
//     }
//   };

//   const handleLogout = () => {
//     localStorage.removeItem("authToken");
//     navigate("/login");
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-[#37beb7] bg-opacity-10">
//         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#37beb7]"></div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-[#37beb7] bg-opacity-10">
//         <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg max-w-md w-full">
//           <p className="text-red-700">{error}</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-[#37beb7] bg-opacity-10 py-12">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         {/* Profile Header */}
//         <div className="bg-white rounded-3xl shadow-2xl overflow-hidden mb-8 transform hover:scale-[1.01] transition duration-300">
//           <div className="bg-[#37beb7] p-8 relative">
//             <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-16 -mt-16"></div>
//             <div className="absolute bottom-0 left-0 w-32 h-32 bg-white opacity-10 rounded-full -ml-16 -mb-16"></div>
//             <div className="flex items-center justify-between relative z-10">
//               <div className="flex items-center">
//                 <div className="bg-white p-4 rounded-2xl shadow-lg">
//                   <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-[#37beb7]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
//                   </svg>
//                 </div>
//                 <div className="ml-8">
//                   <h1 className="text-4xl font-bold text-white mb-2">{user.firstname} {user.lastname}</h1>
//                   <p className="text-white text-lg opacity-90">{user.email}</p>
//                 </div>
//               </div>
//               <button
//                 onClick={handleLogout}
//                 className="px-6 py-3 bg-white text-[#37beb7] rounded-xl hover:bg-gray-100 transition duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
//               >
//                 Logout
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* Tabs Navigation */}
//         <div className="bg-white rounded-3xl shadow-2xl overflow-hidden mb-8">
//           <div className="border-b border-gray-100">
//             <nav className="flex flex-wrap -mb-px px-4">
//               <button
//                 onClick={() => setActiveTab("profile")}
//                 className={`px-6 py-4 text-sm font-semibold ${
//                   activeTab === "profile"
//                     ? "border-b-2 border-[#37beb7] text-[#37beb7]"
//                     : "text-gray-500 hover:text-[#37beb7] transition-colors duration-200"
//                 }`}
//               >
//                 Profile
//               </button>

//               {user.role === "instructor" ? (
//                 <>
//                   <button
//                     onClick={() => navigate("/instructcourses")}
//                     className="px-6 py-4 text-sm font-semibold text-gray-500 hover:text-[#37beb7] transition-colors duration-200"
//                   >
//                     My Courses
//                   </button>
//                   <button
//                     onClick={() => navigate("/addCourse")}
//                     className="px-6 py-4 text-sm font-semibold text-gray-500 hover:text-[#37beb7] transition-colors duration-200"
//                   >
//                     Add Course
//                   </button>
//                   <button
//                     onClick={() => navigate("/addassessment")}
//                     className="px-6 py-4 text-sm font-semibold text-gray-500 hover:text-[#37beb7] transition-colors duration-200"
//                   >
//                     Add Assessment
//                   </button>
//                 </>
//               ) : (
//                 <>
//                   <button
//                     onClick={() => navigate("/courses")}
//                     className="px-6 py-4 text-sm font-semibold text-gray-500 hover:text-[#37beb7] transition-colors duration-200"
//                   >
//                     Available Courses
//                   </button>
//                   <button
//                     onClick={() => navigate("/EnrollCourse")}
//                     className="px-6 py-4 text-sm font-semibold text-gray-500 hover:text-[#37beb7] transition-colors duration-200"
//                   >
//                     Enrolled Courses
//                   </button>
//                   <button
//                     onClick={() => navigate("/paymenthistory")}
//                     className="px-6 py-4 text-sm font-semibold text-gray-500 hover:text-[#37beb7] transition-colors duration-200"
//                   >
//                     Payment History
//                   </button>
//                 </>
//               )}
//             </nav>
//           </div>
//         </div>

//         {/* Profile Content */}
//         <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
//           <div className="p-8">
//             <div className="flex justify-between items-center mb-8">
//               <h2 className="text-2xl font-bold text-gray-800">Profile Information</h2>
//               <div className="space-x-4">
//                 <button
//                   onClick={() => setIsEditing(!isEditing)}
//                   className="px-6 py-3 bg-[#37beb7] text-white rounded-xl hover:bg-[#2da8a1] transition duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
//                 >
//                   {isEditing ? "Cancel" : "Edit Profile"}
//                 </button>
//                 <button
//                   onClick={handleDeleteProfile}
//                   className="px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
//                 >
//                   Delete Profile
//                 </button>
//               </div>
//             </div>

//             {isEditing ? (
//               <form onSubmit={handleSaveChanges} className="space-y-8">
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//                   <div>
//                     <label className="block text-sm font-semibold text-gray-700 mb-2">First Name</label>
//                     <input
//                       type="text"
//                       name="firstname"
//                       value={formData.firstname}
//                       onChange={handleInputChange}
//                       className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#37beb7] focus:border-[#37beb7] transition duration-200"
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-sm font-semibold text-gray-700 mb-2">Last Name</label>
//                     <input
//                       type="text"
//                       name="lastname"
//                       value={formData.lastname}
//                       onChange={handleInputChange}
//                       className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#37beb7] focus:border-[#37beb7] transition duration-200"
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
//                     <input
//                       type="email"
//                       name="email"
//                       value={formData.email}
//                       onChange={handleInputChange}
//                       className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#37beb7] focus:border-[#37beb7] transition duration-200"
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-sm font-semibold text-gray-700 mb-2">Age</label>
//                     <input
//                       type="number"
//                       name="age"
//                       value={formData.age}
//                       onChange={handleInputChange}
//                       className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#37beb7] focus:border-[#37beb7] transition duration-200"
//                     />
//                   </div>
//                 </div>
//                 <div className="flex justify-end">
//                   <button
//                     type="submit"
//                     className="px-8 py-3 bg-[#37beb7] text-white rounded-xl hover:bg-[#2da8a1] transition duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
//                   >
//                     Save Changes
//                   </button>
//                 </div>
//               </form>
//             ) : (
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//                 <div className="bg-gray-50 p-8 rounded-2xl shadow-lg">
//                   <h3 className="text-xl font-semibold text-gray-800 mb-6">Personal Information</h3>
//                   <div className="space-y-6">
//                     <div className="bg-white p-4 rounded-xl shadow-sm">
//                       <p className="text-sm text-gray-500 mb-1">Full Name</p>
//                       <p className="text-gray-800 font-medium text-lg">{user.firstname} {user.lastname}</p>
//                     </div>
//                     <div className="bg-white p-4 rounded-xl shadow-sm">
//                       <p className="text-sm text-gray-500 mb-1">Email</p>
//                       <p className="text-gray-800 font-medium text-lg">{user.email}</p>
//                     </div>
//                     <div className="bg-white p-4 rounded-xl shadow-sm">
//                       <p className="text-sm text-gray-500 mb-1">Age</p>
//                       <p className="text-gray-800 font-medium text-lg">{user.age}</p>
//                     </div>
//                     <div className="bg-white p-4 rounded-xl shadow-sm">
//                       <p className="text-sm text-gray-500 mb-1">Role</p>
//                       <p className="text-gray-800 font-medium text-lg capitalize">{user.role}</p>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Quick Actions Section */}
//                 <div className="bg-gray-50 p-8 rounded-2xl shadow-lg">
//                   <h3 className="text-xl font-semibold text-gray-800 mb-6">Quick Actions</h3>
//                   <div className="space-y-4">
//                     {user.role === "instructor" ? (
//                       <>
//                         <button
//                           onClick={() => navigate("/instructcourses")}
//                           className="w-full bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition duration-200 flex items-center justify-between group"
//                         >
//                           <div className="flex items-center">
//                             <div className="bg-[#37beb7] bg-opacity-10 p-3 rounded-lg mr-4">
//                               <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#37beb7]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
//                               </svg>
//                             </div>
//                             <div>
//                               <p className="font-medium text-gray-800">My Courses</p>
//                               <p className="text-sm text-gray-500">View and manage your courses</p>
//                             </div>
//                           </div>
//                           <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 group-hover:text-[#37beb7] transition-colors duration-200" viewBox="0 0 20 20" fill="currentColor">
//                             <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
//                           </svg>
//                         </button>
//                         <button
//                           onClick={() => navigate("/AssessmentList")}
//                           className="w-full bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition duration-200 flex items-center justify-between group"
//                         >
//                           <div className="flex items-center">
//                             <div className="bg-[#37beb7] bg-opacity-10 p-3 rounded-lg mr-4">
//                               <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#37beb7]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
//                               </svg>
//                             </div>
//                             <div>
//                               <p className="font-medium text-gray-800">Assessment List</p>
//                               <p className="text-sm text-gray-500">Create a new course</p>
//                             </div>
//                           </div>
//                           <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 group-hover:text-[#37beb7] transition-colors duration-200" viewBox="0 0 20 20" fill="currentColor">
//                             <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
//                           </svg>
//                         </button>
//                       </>
//                     ) : (
//                       <>
//                         <button
//                           onClick={() => navigate("/courses")}
//                           className="w-full bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition duration-200 flex items-center justify-between group"
//                         >
//                           <div className="flex items-center">
//                             <div className="bg-[#37beb7] bg-opacity-10 p-3 rounded-lg mr-4">
//                               <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#37beb7]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
//                               </svg>
//                             </div>
//                             <div>
//                               <p className="font-medium text-gray-800">Available Courses</p>
//                               <p className="text-sm text-gray-500">Browse and enroll in courses</p>
//                             </div>
//                           </div>
//                           <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 group-hover:text-[#37beb7] transition-colors duration-200" viewBox="0 0 20 20" fill="currentColor">
//                             <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
//                           </svg>
//                         </button>
//                         <button
//                           onClick={() => navigate("/EnrollCourse")}
//                           className="w-full bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition duration-200 flex items-center justify-between group"
//                         >
//                           <div className="flex items-center">
//                             <div className="bg-[#37beb7] bg-opacity-10 p-3 rounded-lg mr-4">
//                               <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#37beb7]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
//                               </svg>
//                             </div>
//                             <div>
//                               <p className="font-medium text-gray-800">Enrolled Courses</p>
//                               <p className="text-sm text-gray-500">View your enrolled courses</p>
//                             </div>
//                           </div>
//                           <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 group-hover:text-[#37beb7] transition-colors duration-200" viewBox="0 0 20 20" fill="currentColor">
//                             <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
//                           </svg>
//                         </button>
//                         <button
//                           onClick={() => navigate("/paymenthistory")}
//                           className="w-full bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition duration-200 flex items-center justify-between group"
//                         >
//                           <div className="flex items-center">
//                             <div className="bg-[#37beb7] bg-opacity-10 p-3 rounded-lg mr-4">
//                               <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#37beb7]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
//                               </svg>
//                             </div>
//                             <div>
//                               <p className="font-medium text-gray-800">Payment History</p>
//                               <p className="text-sm text-gray-500">View your payment records</p>
//                             </div>
//                           </div>
//                           <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 group-hover:text-[#37beb7] transition-colors duration-200" viewBox="0 0 20 20" fill="currentColor">
//                             <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
//                           </svg>
//                         </button>
//                       </>
//                     )}
//                   </div>
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Profile;



import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [activeTab, setActiveTab] = useState("profile");
  const navigate = useNavigate();

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
    const authToken = localStorage.getItem("authToken");

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

    const fetchUserDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:4000/api/users/user/${userId}`, {
          headers: {
            "Authorization": `Bearer ${authToken}`
          }
        });
        setUser(response.data.data);
        setFormData(response.data.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching user details:", err);
        setError("Failed to load user data.");
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSaveChanges = async (e) => {
    e.preventDefault();
    const authToken = localStorage.getItem("authToken");

    if (!authToken) {
      setError("You are not logged in.");
      return;
    }

    try {
      const userId = user._id;
      const response = await axios.put(
        `http://localhost:4000/api/users/user/${userId}`,
        formData,
        {
          headers: {
            "Authorization": `Bearer ${authToken}`,
          },
        }
      );
      setUser(response.data.data);
      setIsEditing(false);
      setError("");
    } catch (err) {
      console.error("Error saving changes:", err);
      setError("Failed to save changes.");
    }
  };

  const handleDeleteProfile = async () => {
    if (!window.confirm("Are you sure you want to delete your profile? This action cannot be undone.")) {
      return;
    }

    const authToken = localStorage.getItem("authToken");
    if (!authToken) {
      setError("You are not logged in.");
      return;
    }

    try {
      await axios.delete(`http://localhost:4000/api/users/delete/${user._id}`, {
        headers: {
          "Authorization": `Bearer ${authToken}`,
        },
      });
      localStorage.removeItem("authToken");
      window.location.href = "/";
    } catch (err) {
      console.error("Error deleting profile:", err);
      setError("Failed to delete profile.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    navigate("/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#37beb7] bg-opacity-10">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#37beb7]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#37beb7] bg-opacity-10">
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg max-w-md w-full">
          <p className="text-red-700">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#37beb7] bg-opacity-10 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Profile Header */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden mb-8 transform hover:scale-[1.01] transition duration-300">
          <div className="bg-[#37beb7] p-8 relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-16 -mt-16"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-white opacity-10 rounded-full -ml-16 -mb-16"></div>
            <div className="flex items-center justify-between relative z-10">
              <div className="flex items-center">
                <div className="bg-white p-4 rounded-2xl shadow-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-[#37beb7]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div className="ml-8">
                  <h1 className="text-4xl font-bold text-white mb-2">{user.firstname} {user.lastname}</h1>
                  <p className="text-white text-lg opacity-90">{user.email}</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="px-6 py-3 bg-white text-[#37beb7] rounded-xl hover:bg-gray-100 transition duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                Logout
              </button>
            </div>
          </div>
        </div>

        {/* Tabs Navigation */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden mb-8">
          <div className="border-b border-gray-100">
            <nav className="flex flex-wrap -mb-px px-4">
              <button
                onClick={() => setActiveTab("profile")}
                className={`px-6 py-4 text-sm font-semibold ${
                  activeTab === "profile"
                    ? "border-b-2 border-[#37beb7] text-[#37beb7]"
                    : "text-gray-500 hover:text-[#37beb7] transition-colors duration-200"
                }`}
              >
                Profile
              </button>

              {user.role === "instructor" ? (
                <>
                  <button
                    onClick={() => navigate("/instructcourses")}
                    className="px-6 py-4 text-sm font-semibold text-gray-500 hover:text-[#37beb7] transition-colors duration-200"
                  >
                    My Courses
                  </button>
                  <button
                    onClick={() => navigate("/addCourse")}
                    className="px-6 py-4 text-sm font-semibold text-gray-500 hover:text-[#37beb7] transition-colors duration-200"
                  >
                    Add Course
                  </button>
                  <button
                    onClick={() => navigate("/addassessment")}
                    className="px-6 py-4 text-sm font-semibold text-gray-500 hover:text-[#37beb7] transition-colors duration-200"
                  >
                    Add Assessment
                  </button>


                  <button
                    onClick={() => navigate("/")}
                    className="px-6 py-4 text-sm font-semibold text-gray-500 hover:text-[#37beb7] transition-colors duration-200"
                  >
                    Messages
                  </button>

                  <button
                    onClick={() => navigate("/")}
                    className="px-6 py-4 text-sm font-semibold text-gray-500 hover:text-[#37beb7] transition-colors duration-200"
                  >
                   Announcements
                  </button>
                  <button
                    onClick={() => navigate("/")}
                    className="px-6 py-4 text-sm font-semibold text-gray-500 hover:text-[#37beb7] transition-colors duration-200"
                  >
                   Help Desk
                  </button>
                </>
              ) : user.role === "admin" ? (
                <>
                  <button
                    onClick={() => navigate("/admin/users")}
                    className="px-6 py-4 text-sm font-semibold text-gray-500 hover:text-[#37beb7] transition-colors duration-200"
                  >
                    Manage Users
                  </button>
                  <button
                    onClick={() => navigate("/admin/courses")}
                    className="px-6 py-4 text-sm font-semibold text-gray-500 hover:text-[#37beb7] transition-colors duration-200"
                  >
                    Manage Courses
                  </button>
                  <button
                    onClick={() => navigate("/admin/assessments")}
                    className="px-6 py-4 text-sm font-semibold text-gray-500 hover:text-[#37beb7] transition-colors duration-200"
                  >
                    Manage Assessments
                  </button>
                  <button
                    onClick={() => navigate("/admin/payments")}
                    className="px-6 py-4 text-sm font-semibold text-gray-500 hover:text-[#37beb7] transition-colors duration-200"
                  >
                    Payment Records
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => navigate("/courses")}
                    className="px-6 py-4 text-sm font-semibold text-gray-500 hover:text-[#37beb7] transition-colors duration-200"
                  >
                    Available Courses
                  </button>
                  <button
                    onClick={() => navigate("/EnrollCourse")}
                    className="px-6 py-4 text-sm font-semibold text-gray-500 hover:text-[#37beb7] transition-colors duration-200"
                  >
                    Enrolled Courses
                  </button>
                  <button
                    onClick={() => navigate("/paymenthistory")}
                    className="px-6 py-4 text-sm font-semibold text-gray-500 hover:text-[#37beb7] transition-colors duration-200"
                  >
                    Payment History
                  </button>
                </>
              )}
            </nav>
          </div>
        </div>

        {/* Profile Content */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          <div className="p-8">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold text-gray-800">Profile Information</h2>
              <div className="space-x-4">
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="px-6 py-3 bg-[#37beb7] text-white rounded-xl hover:bg-[#2da8a1] transition duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  {isEditing ? "Cancel" : "Edit Profile"}
                </button>
                <button
                  onClick={handleDeleteProfile}
                  className="px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  Delete Profile
                </button>
              </div>
            </div>

            {isEditing ? (
              <form onSubmit={handleSaveChanges} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">First Name</label>
                    <input
                      type="text"
                      name="firstname"
                      value={formData.firstname}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#37beb7] focus:border-[#37beb7] transition duration-200"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Last Name</label>
                    <input
                      type="text"
                      name="lastname"
                      value={formData.lastname}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#37beb7] focus:border-[#37beb7] transition duration-200"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#37beb7] focus:border-[#37beb7] transition duration-200"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Age</label>
                    <input
                      type="number"
                      name="age"
                      value={formData.age}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#37beb7] focus:border-[#37beb7] transition duration-200"
                    />
                  </div>
                </div>
                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="px-8 py-3 bg-[#37beb7] text-white rounded-xl hover:bg-[#2da8a1] transition duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-gray-50 p-8 rounded-2xl shadow-lg">
                  <h3 className="text-xl font-semibold text-gray-800 mb-6">Personal Information</h3>
                  <div className="space-y-6">
                    <div className="bg-white p-4 rounded-xl shadow-sm">
                      <p className="text-sm text-gray-500 mb-1">Full Name</p>
                      <p className="text-gray-800 font-medium text-lg">{user.firstname} {user.lastname}</p>
                    </div>
                    <div className="bg-white p-4 rounded-xl shadow-sm">
                      <p className="text-sm text-gray-500 mb-1">Email</p>
                      <p className="text-gray-800 font-medium text-lg">{user.email}</p>
                    </div>
                    <div className="bg-white p-4 rounded-xl shadow-sm">
                      <p className="text-sm text-gray-500 mb-1">Age</p>
                      <p className="text-gray-800 font-medium text-lg">{user.age}</p>
                    </div>
                    <div className="bg-white p-4 rounded-xl shadow-sm">
                      <p className="text-sm text-gray-500 mb-1">Role</p>
                      <p className="text-gray-800 font-medium text-lg capitalize">{user.role}</p>
                    </div>
                  </div>
                </div>

                {/* Quick Actions Section */}
                <div className="bg-gray-50 p-8 rounded-2xl shadow-lg">
                  <h3 className="text-xl font-semibold text-gray-800 mb-6">Quick Actions</h3>
                  <div className="space-y-4">
                    {user.role === "instructor" ? (
                      <>
                        <button
                          onClick={() => navigate("/instructcourses")}
                          className="w-full bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition duration-200 flex items-center justify-between group"
                        >
                          <div className="flex items-center">
                            <div className="bg-[#37beb7] bg-opacity-10 p-3 rounded-lg mr-4">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#37beb7]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                              </svg>
                            </div>
                            <div>
                              <p className="font-medium text-gray-800">My Courses</p>
                              <p className="text-sm text-gray-500">View and manage your courses</p>
                            </div>
                          </div>
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 group-hover:text-[#37beb7] transition-colors duration-200" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                          </svg>
                        </button>
                        <button
                          onClick={() => navigate("/AssessmentList")}
                          className="w-full bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition duration-200 flex items-center justify-between group"
                        >
                          <div className="flex items-center">
                            <div className="bg-[#37beb7] bg-opacity-10 p-3 rounded-lg mr-4">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#37beb7]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                            </div>
                            <div>
                              <p className="font-medium text-gray-800">Manage Assessments</p>
                              <p className="text-sm text-gray-500">View and manage assessments</p>
                            </div>
                          </div>
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 group-hover:text-[#37beb7] transition-colors duration-200" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                          </svg>
                        </button>
                        <button
                          onClick={() => navigate("/InstructorAssessView")}
                          className="w-full bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition duration-200 flex items-center justify-between group"
                        >
                          <div className="flex items-center">
                            <div className="bg-[#37beb7] bg-opacity-10 p-3 rounded-lg mr-4">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#37beb7]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                            </div>
                            <div>
                              <p className="font-medium text-gray-800">Assessments Submissions</p>
                              <p className="text-sm text-gray-500">View and manage Submissions</p>
                            </div>
                          </div>
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 group-hover:text-[#37beb7] transition-colors duration-200" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                          </svg>
                        </button>

                      </>
                    ) : user.role === "admin" ? (
                      <>
                        {/* <button
                          onClick={() => navigate("/admin/users")}
                          className="w-full bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition duration-200 flex items-center justify-between group"
                        >
                          <div className="flex items-center">
                            <div className="bg-[#37beb7] bg-opacity-10 p-3 rounded-lg mr-4">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#37beb7]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                              </svg>
                            </div>
                            <div>
                              <p className="font-medium text-gray-800">Manage Users</p>
                              <p className="text-sm text-gray-500">View and manage all users</p>
                            </div>
                          </div>
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 group-hover:text-[#37beb7] transition-colors duration-200" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                          </svg>
                        </button> */}
                        {/* <button
                          onClick={() => navigate("/admin/courses")}
                          className="w-full bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition duration-200 flex items-center justify-between group"
                        >
                          <div className="flex items-center">
                            <div className="bg-[#37beb7] bg-opacity-10 p-3 rounded-lg mr-4">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#37beb7]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                              </svg>
                            </div>
                            <div>
                              <p className="font-medium text-gray-800">Manage Courses</p>
                              <p className="text-sm text-gray-500">View and manage all courses</p>
                            </div>
                          </div>
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 group-hover:text-[#37beb7] transition-colors duration-200" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                          </svg>
                        </button>
                        <button
                          onClick={() => navigate("/admin/assessments")}
                          className="w-full bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition duration-200 flex items-center justify-between group"
                        >
                          <div className="flex items-center">
                            <div className="bg-[#37beb7] bg-opacity-10 p-3 rounded-lg mr-4">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#37beb7]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                            </div>
                            <div>
                              <p className="font-medium text-gray-800">Manage Assessments</p>
                              <p className="text-sm text-gray-500">View and manage assessments</p>
                            </div>
                          </div>
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 group-hover:text-[#37beb7] transition-colors duration-200" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                          </svg>
                        </button> */}
                        <button
                          onClick={() => navigate("/adminPayment")}
                          className="w-full bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition duration-200 flex items-center justify-between group"
                        >
                          <div className="flex items-center">
                            <div className="bg-[#37beb7] bg-opacity-10 p-3 rounded-lg mr-4">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#37beb7]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                              </svg>
                            </div>
                            <div>
                              <p className="font-medium text-gray-800">Payment Records</p>
                              <p className="text-sm text-gray-500">View all payment records</p>
                            </div>
                          </div>
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 group-hover:text-[#37beb7] transition-colors duration-200" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => navigate("/courses")}
                          className="w-full bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition duration-200 flex items-center justify-between group"
                        >
                          <div className="flex items-center">
                            <div className="bg-[#37beb7] bg-opacity-10 p-3 rounded-lg mr-4">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#37beb7]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                              </svg>
                            </div>
                            <div>
                              <p className="font-medium text-gray-800">Available Courses</p>
                              <p className="text-sm text-gray-500">Browse and enroll in courses</p>
                            </div>
                          </div>
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 group-hover:text-[#37beb7] transition-colors duration-200" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                          </svg>
                        </button>
                        <button
                          onClick={() => navigate("/EnrollCourse")}
                          className="w-full bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition duration-200 flex items-center justify-between group"
                        >
                          <div className="flex items-center">
                            <div className="bg-[#37beb7] bg-opacity-10 p-3 rounded-lg mr-4">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#37beb7]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                            </div>
                            <div>
                              <p className="font-medium text-gray-800">Enrolled Courses</p>
                              <p className="text-sm text-gray-500">View your enrolled courses</p>
                            </div>
                          </div>
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 group-hover:text-[#37beb7] transition-colors duration-200" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                          </svg>
                        </button>
                        <button
                          onClick={() => navigate("/paymenthistory")}
                          className="w-full bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition duration-200 flex items-center justify-between group"
                        >
                          <div className="flex items-center">
                            <div className="bg-[#37beb7] bg-opacity-10 p-3 rounded-lg mr-4">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#37beb7]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                              </svg>
                            </div>
                            <div>
                              <p className="font-medium text-gray-800">Payment History</p>
                              <p className="text-sm text-gray-500">View your payment records</p>
                            </div>
                          </div>
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 group-hover:text-[#37beb7] transition-colors duration-200" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;