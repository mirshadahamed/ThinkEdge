import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Menu } from "lucide-react";

const Header = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [userName, setUserName] = useState("");

  // Fetch firstName from localStorage
  useEffect(() => {
    const fetchUserName = () => {
      const storedUserName = localStorage.getItem("firstName");
      console.log("Fetched First Name:", storedUserName); // Debugging
      setUserName(storedUserName || ""); // Update state
    };

    fetchUserName();

    // Listen for localStorage changes (ensures it updates after login)
    window.addEventListener("storage", fetchUserName);

    return () => {
      window.removeEventListener("storage", fetchUserName);
    };
  }, []);

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("firstName");
    setUserName(""); // Clear state
    window.location.href = "/login"; // Redirect to login
  };

  return (
    <header className="mx-auto w-full max-w-[1320px] py-2 bg-gradient-to-r from-green-800 to-green-300 text-white px-4 shadow-lg relative top-2 z-50 rounded-full">
      <div className="max-w-6xl mx-auto flex justify-between items-center relative">
        <h1 className="text-xl font-bold">GREEN PULSE</h1>

        <button className="md:hidden focus:outline-none" onClick={() => setMenuOpen(!menuOpen)}>
          <Menu className="w-6 h-6" />
        </button>

        <nav className={`md:flex space-x-4 items-center ${menuOpen ? "block" : "hidden"} absolute md:relative top-14 md:top-0 left-0 md:left-auto w-full md:w-auto bg-green-800 md:bg-transparent shadow-md md:shadow-none p-4 md:p-0 rounded-full md:rounded-none`}>
          <ul className="md:flex md:space-x-4 items-center">
            <li><Link to="/" className="block py-1 md:py-0 hover:text-gray-200 transition">Home</Link></li>
            <li><Link to="/projectManagement/list" className="block py-1 md:py-0 hover:text-gray-200 transition">Projects</Link></li>
            <li><Link to="/viewGoals" className="block py-1 md:py-0 hover:text-gray-200 transition">Check Goals</Link></li>
            <li><Link to="/about" className="block py-1 md:py-0 hover:text-gray-200 transition">About</Link></li>

            {/* Profile / Login Dropdown */}
            <li className="relative">
              {userName ? (
                <>
                  <button className="hover:text-gray-200 transition focus:outline-none px-3 py-1 bg-white text-green-800 rounded-full shadow-md hover:bg-gray-100"
                    onClick={() => setDropdownOpen(!dropdownOpen)}>
                    {userName} ▼
                  </button>
                  {dropdownOpen && (
                    <ul className="absolute right-0 mt-2 w-40 bg-white text-black shadow-xl rounded-lg overflow-hidden border border-gray-200">
                      <li><button onClick={handleLogout} className="block w-full text-left px-4 py-2 hover:bg-green-100 transition">Logout</button></li>
                    </ul>
                  )}
                </>
              ) : (
                <>
                  <button className="hover:text-gray-200 transition focus:outline-none px-3 py-1 bg-white text-green-800 rounded-full shadow-md hover:bg-gray-100"
                    onClick={() => setDropdownOpen(!dropdownOpen)}>
                    Profile ▼
                  </button>
                  {dropdownOpen && (
                    <ul className="absolute right-0 mt-2 w-40 bg-white text-black shadow-xl rounded-lg overflow-hidden border border-gray-200">
                      <li><Link to="/" className="block px-4 py-2 hover:bg-green-100 transition">Login</Link></li>
                      <li><Link to="/register" className="block px-4 py-2 hover:bg-green-100 transition">Register</Link></li>
                    </ul>
                  )}
                </>
              )}
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
