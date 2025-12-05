import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { BookOpen, BarChart3, IndianRupee } from "lucide-react";
import api from "../../components/Api";

const AuthorDashboard = () => {
  const [books, setBooks] = useState([]);
  const [stats, setStats] = useState({
    totalBooks: 0,
    availableBooks: 0,
    borrowedBooks: 0,
    earnings: 0,
  });

  // ✅ Fetch all author stats
  const fetchData = async () => {
    try {
      const res = await api.get("/books");
      if (res.data) {
        setBooks(res.data.books || []);
        setStats({
          totalBooks: res.data.totalBooks || 0,
          availableBooks: res.data.availableBooks || 0,
          borrowedBooks: res.data.borrowedBooks || 0,
          earnings: res.data.earnings || 0,
        });
      }
    } catch (error) {
      console.error("❌ Error loading dashboard:", error);
      toast.error("Failed to load author dashboard data");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="flex-1 flex flex-col overflow-y-auto bg-gray-50 min-h-screen">
      <main className="p-6 sm:p-8">
        {/* 📊 Stats Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {/* Total Books */}
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-xl shadow-md flex items-center gap-4 hover:scale-105 transition-transform duration-300">
            <BarChart3 size={36} />
            <div>
              <p className="text-sm opacity-80">Total Books</p>
              <h2 className="text-3xl font-bold">{stats.totalBooks}</h2>
            </div>
          </div>

          {/* Available Books */}
          <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-6 rounded-xl shadow-md flex items-center gap-4 hover:scale-105 transition-transform duration-300">
            <BookOpen size={36} />
            <div>
              <p className="text-sm opacity-80">Available Books</p>
              <h2 className="text-3xl font-bold">{stats.availableBooks}</h2>
            </div>
          </div>

          {/* Borrowed Books */}
          <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-white p-6 rounded-xl shadow-md flex items-center gap-4 hover:scale-105 transition-transform duration-300">
            <BookOpen size={36} />
            <div>
              <p className="text-sm opacity-80">Borrowed Books</p>
              <h2 className="text-3xl font-bold">{stats.borrowedBooks}</h2>
            </div>
          </div>

          {/* Earnings */}
          <div className="bg-gradient-to-r from-purple-500 to-purple-700 text-white p-6 rounded-xl shadow-md flex items-center gap-4 hover:scale-105 transition-transform duration-300">
            <IndianRupee size={36} />
            <div>
              <p className="text-sm opacity-80">My Earnings</p>
              <h2 className="text-3xl font-bold">
                ₹{stats.earnings.toLocaleString()}
              </h2>
            </div>
          </div>
        </div>

        {/* 📘 Recent Books Section */}
        <h2 className="text-xl font-semibold mb-4 text-gray-800">
          📚 Your Recent Books
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {books.length > 0 ? (
            books.slice(0, 6).map((book) => (
              <div
                key={book._id}
                className="bg-white rounded-lg shadow hover:shadow-xl transition transform hover:-translate-y-1 p-4"
              >
                <img
                  src={
                    book.thumbnailphoto || "https://via.placeholder.com/200x250"
                  }
                  alt={book.name}
                  className="w-full h-48 object-cover rounded-md"
                />
                <h3 className="text-lg font-bold mt-3 text-gray-800 truncate">
                  {book.name}
                </h3>
                <p className="text-gray-600 text-sm">{book.genre}</p>
                <p
                  className={`text-xs font-medium mt-1 ${
                    book.availableCopies > 0 ? "text-green-600" : "text-red-500"
                  }`}
                >
                  {book.availableCopies > 0 ? "Available" : "Borrowed"}
                </p>
              </div>
            ))
          ) : (
            <p className="text-gray-600 col-span-full text-center py-6">
              You haven’t added any books yet. Click{" "}
              <span className="font-semibold text-indigo-600">“Add Book”</span>{" "}
              to start 📖
            </p>
          )}
        </div>
      </main>
    </div>
  );
};

export default AuthorDashboard;
