import React from 'react';
import { IoIosArrowRoundForward, IoMdSchool } from "react-icons/io";
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaChalkboardTeacher, FaBookReader, FaCertificate } from "react-icons/fa";
import { GiTeacher } from "react-icons/gi";
import { MdOutlineWorkspacePremium, MdOutlineQuiz, MdOutlineSupportAgent } from "react-icons/md";
import { motion } from "framer-motion";
import { Link } from 'react-router-dom';
import banner from './assets/banner.png';

const Home = () => {
  const courses = [
    {
      id: 1,
      title: "Web Development Fundamentals",
      description: "Learn HTML, CSS, and JavaScript to build modern websites",
      icon: <FaBookReader className="text-3xl text-[#37beb7]" />,
      duration: "8 Weeks"
    },
    {
      id: 2,
      title: "Advanced React Masterclass",
      description: "Master React hooks, context API, and advanced patterns",
      icon: <FaChalkboardTeacher className="text-3xl text-[#37beb7]" />,
      duration: "6 Weeks"
    },
    {
      id: 3,
      title: "UI/UX Design Principles",
      description: "Learn design thinking and create stunning interfaces",
      icon: <GiTeacher className="text-3xl text-[#37beb7]" />,
      duration: "4 Weeks"
    }
  ];

  const features = [
    {
      id: 1,
      title: "Expert Instructors",
      description: "Learn from industry professionals with real-world experience",
      icon: <GiTeacher className="text-2xl" />
    },
    {
      id: 2,
      title: "Interactive Learning",
      description: "Engaging content with quizzes and hands-on projects",
      icon: <MdOutlineQuiz className="text-2xl" />
    },
    {
      id: 3,
      title: "Certification",
      description: "Earn recognized certificates upon completion",
      icon: <FaCertificate className="text-2xl" />
    },
    {
      id: 4,
      title: "Premium Content",
      description: "Access to exclusive learning materials",
      icon: <MdOutlineWorkspacePremium className="text-2xl" />
    }
  ];

  const stats = [
    { value: "10K+", label: "Students Enrolled" },
    { value: "200+", label: "Courses Available" },
    { value: "50+", label: "Expert Instructors" },
    { value: "24/7", label: "Support Available" }
  ];

  return (
    <div className="min-h-screen bg-white font-sans antialiased">
      {/* Navbar */}
      <nav className="bg-white shadow-sm fixed w-full z-50">
        <div className="container mx-auto px-4 py-3 lg:py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-[#37beb7] rounded-full flex items-center justify-center">
                <IoMdSchool className="text-white text-xl" />
              </div>
              <span className="text-xl lg:text-2xl font-bold text-[#37beb7]">ThinkEdge</span>
            </div>
            
            <div className="hidden lg:flex space-x-8 items-center">
              <a href="#" className="text-gray-700 hover:text-[#37beb7] transition-colors duration-300 font-medium">Home</a>
              <a href="#" className="text-gray-700 hover:text-[#37beb7] transition-colors duration-300 font-medium">Courses</a>
              <a href="#" className="text-gray-700 hover:text-[#37beb7] transition-colors duration-300 font-medium">Instructors</a>
              <a href="#" className="text-gray-700 hover:text-[#37beb7] transition-colors duration-300 font-medium">Resources</a>
              <a href="#" className="text-gray-700 hover:text-[#37beb7] transition-colors duration-300 font-medium">About</a>
            </div>
            
            <div className="flex items-center space-x-4">
              <Link to='/login' className="hidden md:block text-gray-700 hover:text-[#37beb7] transition-colors duration-300 font-medium">
                Login
              </Link>
              <Link to='/register'>
                <button className="bg-[#37beb7] text-white px-4 py-2 lg:px-6 lg:py-2 rounded-full hover:bg-[#2fa19a] transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-1 font-medium text-sm lg:text-base">
                  Get Started
                </button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-16 md:pt-40 md:pb-24 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-6 md:space-y-8"
            >
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                Transform Your Future With <span className="text-[#37beb7]">Online Learning</span>
              </h1>
              <p className="text-gray-600 text-lg md:text-xl">
                Access 200+ high-quality courses taught by industry experts. Learn at your own pace and get certified.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to='/register'> 
                  <button className="bg-[#37beb7] text-white px-8 py-3 rounded-full flex items-center gap-2 hover:bg-[#2fa19a] transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-1 font-medium">
                    Explore Courses
                    <IoIosArrowRoundForward className="text-xl" />
                  </button>
                </Link>
                <button className="border border-[#37beb7] text-[#37beb7] px-8 py-3 rounded-full hover:bg-[#37beb7] hover:text-white transition-all duration-300 font-medium">
                  How It Works
                </button>
              </div>
              
              <div className="flex flex-wrap gap-4 pt-4">
                {stats.map((stat, index) => (
                  <div key={index} className="flex items-center">
                    <div className="bg-[#37beb7] bg-opacity-10 p-2 rounded-lg">
                      <span className="text-[#37beb7] font-bold text-lg">{stat.value}</span>
                    </div>
                    <span className="ml-2 text-gray-600 text-sm">{stat.label}</span>
                  </div>
                ))}
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="relative"
            >
              <div className="w-full h-80 sm:h-96 lg:h-[450px] bg-[#37beb7] rounded-3xl opacity-10"></div>
              <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
                <img 
                  src={banner} 
                  alt="E-Learning Platform" 
                  className="w-full max-w-md lg:max-w-lg object-contain" 
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Popular Courses Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Popular Courses</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Discover our most popular courses designed to boost your career
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses.map((course) => (
              <motion.div 
                key={course.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: course.id * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
                className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100"
              >
                <div className="mb-4">
                  {course.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3">{course.title}</h3>
                <p className="text-gray-600 mb-4">{course.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">{course.duration}</span>
                  <button className="text-[#37beb7] hover:text-[#2fa19a] font-medium flex items-center gap-1">
                    Enroll Now <IoIosArrowRoundForward />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Link to="/courses">
              <button className="border border-[#37beb7] text-[#37beb7] px-8 py-3 rounded-full hover:bg-[#37beb7] hover:text-white transition-all duration-300 font-medium flex items-center gap-2 mx-auto">
                View All Courses
                <IoIosArrowRoundForward className="text-xl" />
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <h2 className="text-3xl md:text-4xl font-bold">Why Choose Our Platform?</h2>
              <p className="text-gray-600 text-lg">
                We provide the best learning experience with cutting-edge technology and expert instructors.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {features.map((feature) => (
                  <div key={feature.id} className="flex items-start space-x-4">
                    <div className="bg-[#37beb7] bg-opacity-10 p-3 rounded-full">
                      {feature.icon}
                    </div>
                    <div>
                      <h4 className="font-semibold text-lg">{feature.title}</h4>
                      <p className="text-gray-600 text-sm">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="w-full h-80 sm:h-96 bg-[#37beb7] rounded-3xl opacity-10"></div>
              <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center p-8">
                <div className="bg-white p-6 rounded-xl shadow-xl max-w-md">
                  <h3 className="text-xl font-semibold mb-4">Start Learning Today</h3>
                  <p className="text-gray-600 mb-6">
                    Join thousands of students who have transformed their careers with our courses.
                  </p>
                  <Link to="/register">
                    <button className="w-full bg-[#37beb7] text-white py-3 rounded-lg hover:bg-[#2fa19a] transition-all duration-300 font-medium">
                      Sign Up Free
                    </button>
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">What Our Students Say</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Hear from our successful students who transformed their careers
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((item) => (
              <motion.div 
                key={item}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: item * 0.1 }}
                viewport={{ once: true }}
                className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-all duration-300"
              >
                <div className="flex items-center mb-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg key={star} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-gray-600 mb-6">
                  "This platform completely transformed my career. The courses are well-structured and the instructors are knowledgeable. I landed a job within 2 months of completing my course!"
                </p>
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-full bg-gray-200 mr-4"></div>
                  <div>
                    <h4 className="font-semibold">John Doe</h4>
                    <p className="text-gray-500 text-sm">Web Developer at TechCorp</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-[#37beb7] text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <h2 className="text-3xl md:text-4xl font-bold">Ready to Start Learning?</h2>
              <p className="text-lg text-white text-opacity-90">
                Join thousands of students advancing their careers with our courses
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/register">
                  <button className="bg-white text-[#37beb7] px-8 py-3 rounded-full hover:bg-opacity-90 transition-all duration-300 shadow-md hover:shadow-lg font-medium">
                    Get Started Free
                  </button>
                </Link>
                <button className="border border-white text-white px-8 py-3 rounded-full hover:bg-white hover:bg-opacity-10 transition-all duration-300 font-medium">
                  Contact Us
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white pt-16 pb-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-10 h-10 bg-[#37beb7] rounded-full flex items-center justify-center">
                  <IoMdSchool className="text-white text-xl" />
                </div>
                <span className="text-xl font-bold text-white">EduSmart</span>
              </div>
              <p className="text-gray-400 mb-4">
                Empowering learners worldwide with quality education.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-[#37beb7] transition-colors duration-300"><FaFacebook size={20} /></a>
                <a href="#" className="text-gray-400 hover:text-[#37beb7] transition-colors duration-300"><FaTwitter size={20} /></a>
                <a href="#" className="text-gray-400 hover:text-[#37beb7] transition-colors duration-300"><FaInstagram size={20} /></a>
                <a href="#" className="text-gray-400 hover:text-[#37beb7] transition-colors duration-300"><FaLinkedin size={20} /></a>
              </div>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-3">
                <li><a href="#" className="text-gray-400 hover:text-[#37beb7] transition-colors duration-300">Home</a></li>
                <li><a href="#" className="text-gray-400 hover:text-[#37beb7] transition-colors duration-300">Courses</a></li>
                <li><a href="#" className="text-gray-400 hover:text-[#37beb7] transition-colors duration-300">Pricing</a></li>
                <li><a href="#" className="text-gray-400 hover:text-[#37beb7] transition-colors duration-300">Blog</a></li>
                <li><a href="#" className="text-gray-400 hover:text-[#37beb7] transition-colors duration-300">Contact</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Support</h4>
              <ul className="space-y-3">
                <li><a href="#" className="text-gray-400 hover:text-[#37beb7] transition-colors duration-300">FAQ</a></li>
                <li><a href="#" className="text-gray-400 hover:text-[#37beb7] transition-colors duration-300">Help Center</a></li>
                <li><a href="#" className="text-gray-400 hover:text-[#37beb7] transition-colors duration-300">Terms of Service</a></li>
                <li><a href="#" className="text-gray-400 hover:text-[#37beb7] transition-colors duration-300">Privacy Policy</a></li>
                <li><a href="#" className="text-gray-400 hover:text-[#37beb7] transition-colors duration-300">Cookie Policy</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Contact Us</h4>
              <ul className="space-y-3 text-gray-400">
                <li className="flex items-start">
                  <svg className="w-5 h-5 mr-2 mt-1 text-[#37beb7]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>123 Education Street, Colombo, Sri Lanka</span>
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 mr-2 text-[#37beb7]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span>Nikshan@edusmart.com</span>
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 mr-2 text-[#37beb7]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <span>+94 77 11 4567</span>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm mb-4 md:mb-0">
              &copy; {new Date().getFullYear()} Sm Learn. All rights reserved.
            </p>
            <div className="flex space-x-6">
              <a href="#" className="text-gray-400 hover:text-[#37beb7] transition-colors duration-300 text-sm">Privacy Policy</a>
              <a href="#" className="text-gray-400 hover:text-[#37beb7] transition-colors duration-300 text-sm">Terms of Service</a>
              <a href="#" className="text-gray-400 hover:text-[#37beb7] transition-colors duration-300 text-sm">Cookie Policy</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;