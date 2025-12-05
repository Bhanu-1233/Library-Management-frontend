import React from "react";
import {
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
  Mail,
  BookOpen,
} from "lucide-react";
import { useLocation } from "react-router-dom";

const Footer = () => {
  const location = useLocation();

  // ❌ Hide footer on Profile Page (mobile + desktop)
  const hideFooter = location.pathname === "/profile";

  if (hideFooter) return null;

  return (
    <footer
      className="bg-[#111827] text-gray-300 py-10 mt-16 border-t border-gray-700 
        px-4 sm:px-6 md:px-10"
    >
      {/* 🔹 Grid Section */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">
        {/* 🔹 Brand Section */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <BookOpen className="text-indigo-500" size={28} />
            <h1 className="text-2xl font-bold text-white">LibraVerse</h1>
          </div>
          <p className="text-gray-400 text-sm leading-relaxed">
            Explore. Borrow. Learn. Your online library to access thousands of
            books anytime, anywhere.
          </p>
        </div>

        {/* 🔹 Support Section */}
        <div>
          <h2 className="text-lg font-semibold text-white mb-3">Support</h2>
          <ul className="space-y-2 text-gray-400 text-sm">
            <li className="hover:text-indigo-400 cursor-pointer">
              Help Center
            </li>
            <li className="hover:text-indigo-400 cursor-pointer">
              Privacy Policy
            </li>
            <li className="hover:text-indigo-400 cursor-pointer">
              Terms & Conditions
            </li>
            <li className="hover:text-indigo-400 cursor-pointer">
              Report a Problem
            </li>
          </ul>
        </div>

        {/* 🔹 Socials */}
        <div>
          <h2 className="text-lg font-semibold text-white mb-3">
            Connect With Us
          </h2>

          <p className="text-gray-400 text-sm">
            📍 Hyderabad, India
            <br />
            ✉️ support@libraverse.com
          </p>
        </div>
      </div>

      {/* 🔹 Bottom Strip */}
      <div className="text-center text-gray-500 text-sm mt-10 border-t border-gray-700 pt-4">
        © {new Date().getFullYear()} LibraVerse. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
