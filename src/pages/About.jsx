import React from "react";
import { BookOpen, Users, Target, Heart } from "lucide-react";
import libraryImg from "../assets/LibImage.webp"; // 📸 add any image to /src/assets/

const About = () => {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 mt-20">
      {/* 🔹 Hero Section */}
      <section className="relative bg-gradient-to-r from-indigo-600 to-blue-500 text-white py-20 px-6 md:px-16">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            About <span className="text-yellow-300">LibraVerse</span>
          </h1>
          <p className="text-lg opacity-90 max-w-3xl mx-auto">
            Empowering readers, students, and knowledge seekers with easy access
            to books, insights, and learning — anytime, anywhere.
          </p>
        </div>
      </section>

      {/* 🔹 Image + Introduction Section */}
      <section className="max-w-6xl mx-auto py-16 px-6 md:px-12 flex flex-col md:flex-row items-center gap-10">
        <div className="flex-1">
          <img
            src={libraryImg}
            alt="Library"
            className="rounded-2xl shadow-lg w-full object-cover"
          />
        </div>

        <div className="flex-1">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            A Platform Built for Every Reader 📚
          </h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            LibraVerse was founded with a vision to bridge the gap between
            readers and resources. Whether you're a student looking for academic
            books or a curious mind seeking new stories, our platform ensures
            smooth borrowing, organized management, and real-time access to
            thousands of books.
          </p>
          <p className="text-gray-600 leading-relaxed">
            We believe that learning should be limitless — and libraries should
            evolve with technology to empower modern learners.
          </p>
        </div>
      </section>

      {/* 🔹 Our Mission Section */}
      <section className="bg-indigo-50 py-16 px-6 md:px-12">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-indigo-700 mb-8">
            Our Mission
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition">
              <Target className="text-indigo-600 w-10 h-10 mb-3 mx-auto" />
              <h3 className="text-xl font-semibold mb-2 text-gray-800">
                Vision
              </h3>
              <p className="text-gray-600 text-sm">
                To revolutionize digital library access and inspire a reading
                culture among people of all ages.
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition">
              <BookOpen className="text-indigo-600 w-10 h-10 mb-3 mx-auto" />
              <h3 className="text-xl font-semibold mb-2 text-gray-800">
                Knowledge
              </h3>
              <p className="text-gray-600 text-sm">
                Offering vast collections and personalized recommendations to
                make learning more engaging and efficient.
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition">
              <Users className="text-indigo-600 w-10 h-10 mb-3 mx-auto" />
              <h3 className="text-xl font-semibold mb-2 text-gray-800">
                Community
              </h3>
              <p className="text-gray-600 text-sm">
                Building a network of readers, authors, and institutions that
                support open access to knowledge.
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition">
              <Heart className="text-indigo-600 w-10 h-10 mb-3 mx-auto" />
              <h3 className="text-xl font-semibold mb-2 text-gray-800">
                Passion
              </h3>
              <p className="text-gray-600 text-sm">
                We love books, technology, and education — and that passion
                drives every feature we create.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 🔹 Footer CTA Section */}
      <section className="bg-indigo-600 text-white py-16 text-center px-6">
        <h2 className="text-3xl font-bold mb-4">
          Join the Future of Reading Today 🚀
        </h2>
        <p className="max-w-3xl mx-auto mb-6 opacity-90">
          Become a part of LibraVerse — where stories meet technology and
          learning never stops.
        </p>
        <button
          onClick={() => (window.location.href = "/register")}
          className="bg-yellow-400 text-black font-semibold px-8 py-3 rounded-lg hover:bg-yellow-500 transition"
        >
          Get Started
        </button>
      </section>
    </div>
  );
};

export default About;
