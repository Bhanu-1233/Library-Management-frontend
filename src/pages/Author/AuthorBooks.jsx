import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Edit, Trash2, BookOpen } from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../../components/Api";

const AuthorBooks = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch author's books
  const fetchBooks = async () => {
    try {
      setLoading(true);
      const res = await api.get("/books");
      setBooks(res.data.books || []);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load your books");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  // Handle delete
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this book?")) return;
    try {
      await api.delete(`/deletebook/${id}`);
      toast.success("Book deleted successfully 🗑️");
      setBooks((prev) => prev.filter((book) => book._id !== id));
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to delete book");
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center gap-2">
        <BookOpen className="text-indigo-600" /> My Books
      </h2>

      {loading ? (
        <p className="text-gray-600">Loading your books...</p>
      ) : books.length === 0 ? (
        <p className="text-gray-600">
          You haven’t added any books yet. Click{" "}
          <span
            onClick={() => navigate("/createbook")}
            className="text-indigo-600 cursor-pointer font-semibold"
          >
            “Add Book”
          </span>{" "}
          to start 📖
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {books.map((book) => (
            <div
              key={book._id}
              className="bg-white rounded-lg shadow-md hover:shadow-lg transition transform hover:-translate-y-1 p-4 relative"
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
              <p className="text-sm text-gray-600">{book.genre}</p>
              <p className="text-sm text-gray-500 mt-1">
                Copies: {book.availableCopies}
              </p>
              <p className="text-sm text-gray-500">
                Price: ₹{book.price || "—"}
              </p>

              <div className="flex justify-between items-center mt-4">
                <button
                  onClick={() => navigate(`/updatebook/${book._id}`)}
                  className="flex items-center gap-2 text-indigo-600 hover:text-indigo-800 font-medium"
                >
                  <Edit size={18} /> Edit
                </button>

                <button
                  onClick={() => handleDelete(book._id)}
                  className="flex items-center gap-2 text-red-600 hover:text-red-800 font-medium"
                >
                  <Trash2 size={18} /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AuthorBooks;
