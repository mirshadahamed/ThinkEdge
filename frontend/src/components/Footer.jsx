import React from "react";
import { Facebook, Instagram, Twitter, Youtube, Leaf } from "lucide-react";

const Footer = () => {
  return (
    <footer className=" bg-gradient-to-r from-green-800 to-green-300 text-white py-6 rounded-t-lg">
      <div className="max-w-6xl mx-auto px-6">
        {/* Top Section */}
        <div className="flex flex-col md:flex-row items-center justify-between text-center md:text-left">
          {/* Logo & Icon */}
          <div className="flex items-center gap-3">
            <Leaf className="w-8 h-8 text-green-500" />
            <h2 className="text-2xl font-bold">Green Pulse</h2>
          </div>

          {/* Social Media Icons */}
          <div className="flex gap-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-green-500 transition">
              <Facebook className="w-6 h-6" />
            </a>
            <a href="#" className="hover:text-green-500 transition">
              <Instagram className="w-6 h-6" />
            </a>
            <a href="#" className="hover:text-green-500 transition">
              <Twitter className="w-6 h-6" />
            </a>
            <a href="#" className="hover:text-green-500 transition">
              <Youtube className="w-6 h-6" />
            </a>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-white mt-6 pt-4 text-center text-gray-200 text-sm w-full">
          © {new Date().getFullYear()} Green Pulse. All Rights Reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
