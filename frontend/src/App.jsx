import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
// import Home from './components/Home'; // Create a Home component for the root path



import Header from './components/Header';
import Footer from './components/Footer';
import Register from './components/usermanagement/Register';
import Login from './components/usermanagement/Login';
import AddCourseForm from './components/Course/AddCourseForm';
import AdminCourseList from './components/Course/AdminCourseList';
import AdminCourseDetail from './components/Course/AdminCourseDetail';
import CoursesPage from './components/Course/CoursesPage';
import EnrolledCoursesPage from './components/Course/EnrolledCoursespage';
import CourseDetailPage from './components/Course/CourseDetailPage';
import AssessmentAddForm from './components/Assessment/Assessment';
import InstructorCourses from './components/Course/InstructorCourse';
import EditCourse from './components/Course/EditCourse';
import PaymentSubmissionPage from './components/Payment/PaymentSubmissionPage';
import AdminPaymentsPage from './components/Payment/AdminPaymentsPage';
import AssessmentList from './components/Assessment/AssessmentList';
import PaymentHistoryPage from './components/Payment/PaymentHistoryPage';
import EditAssessmentForm from './components/Assessment/EditAssessmentForm';
import InstructorAssessView from './components/Assessment/InstructorAssessView';
import AdminDashboard from './components/AdminDashboard';
import Home from './Home';



import Profile from './components/usermanagement/Profile';


const App = () => {
    return (
        <Router>
            <div>
              

                <Routes>
               

                    
                    <Route path="/" element={<Home />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/Login" element={<Login />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/addCourse" element={<AddCourseForm />} />
                    <Route path="/adminCourseList" element={<AdminCourseList/>}/>
                    <Route path="/adminCourseDetails/:courseId" element={<AdminCourseDetail/>}/>
                    <Route path="/courses" element={<CoursesPage />} />
                    <Route path="/EnrollCourse" element={<EnrolledCoursesPage />} />
                    <Route path="/coursedetail/:courseId" element={<CourseDetailPage />} />
                    <Route path="/addassessment" element={<AssessmentAddForm/>}/>
                    <Route path="/instructcourses" element={<InstructorCourses />} />
                    <Route path="/edit-course/:courseId" element={<EditCourse />} />
                    <Route path="/payment/:courseId" element={<PaymentSubmissionPage />} />
                    <Route path="/adminPayment" element={<AdminPaymentsPage />} />
                    <Route path="/AssessmentList" element={<AssessmentList />} />
                    <Route path="/paymenthistory" element={<PaymentHistoryPage  />} />
                    <Route path="/edit-assessment/:id" element={<EditAssessmentForm />} />
                    <Route path="/InstructorAssessView" element={<InstructorAssessView  />} />
                    <Route path="/admin-dashboard" element={<AdminDashboard />} />






                    




                    
                </Routes>

              
            </div>
        </Router>
    );
};

export default App;
