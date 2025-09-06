import React from "react";

const About = () => {
  return (
    <div className="min-h-screen bg-green-50 flex flex-col items-center justify-center text-center p-6">
      <div className="max-w-5xl px-6 py-12 text-center">
        {/* Header Section */}
        <h1 className="text-4xl font-bold mb-4">About Green Pulse</h1>
        <p className="text-lg text-black">
          Green Pulse is a powerful ecosystem project management platform
          designed to help teams manage and execute eco-friendly projects with
          efficiency and sustainability at its core.
        </p>

        {/* Features Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
          <div className="bg-white text-green-800 p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-bold">🌱 Sustainable Planning</h3>
            <p className="text-gray-700 mt-2">
              We provide tools for planning and executing environmentally
              friendly projects.
            </p>
          </div>
          <div className="bg-white text-green-800 p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-bold">🔍 Transparency & Tracking</h3>
            <p className="text-gray-700 mt-2">
              Track project progress with real-time analytics and transparent
              reporting.
            </p>
          </div>
          <div className="bg-white text-green-800 p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-bold">🤝 Community Engagement</h3>
            <p className="text-gray-700 mt-2">
              Connect with like-minded individuals and collaborate on
              sustainability-driven initiatives.
            </p>
          </div>
        </div>

        {/* Mission & Vision */}
        <div className="mt-12 bg-green-700 p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold">🌍 Our Mission</h2>
          <p className="mt-2 text-gray-200">
            To empower organizations and individuals with tools that promote
            sustainable project execution while ensuring maximum efficiency and
            productivity.
          </p>
        </div>

        <div className="mt-6 bg-green-800 p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold">🚀 Our Vision</h2>
          <p className="mt-2 text-gray-200">
            A world where eco-friendly project management is the standard, not
            the exception.
          </p>
        </div>

        {/* Call to Action */}
        <div className="mt-12">
          <a
            href="/projectManagement/list"
            className="bg-white text-green-800 font-bold py-3 px-6 rounded-lg shadow-lg hover:bg-green-100 transition"
          >
            Explore Our Projects
          </a>
        </div>
      </div>
    </div>
  );
};

export default About;
