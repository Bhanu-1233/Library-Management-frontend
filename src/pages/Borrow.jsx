import { useLocation } from "react-router-dom";

import { useAuth } from "../contexts/useAuth.js";
import axios from "axios";
import { toast } from "react-toastify";

const Borrow = () => {
  const { state } = useLocation();
  const { user } = useAuth();
  const backendURL = import.meta.env.VITE_BACKEND_API_URL;
  // console.log("user", user);

  const { book } = state || {};
  // console.log("book", book);
  if (!book) {
    return (
      <p className="text-center text-red-600 mt-10">
        Book data missing. Please go back and try again.
      </p>
    );
  }

  const hanldeBorrrow = async () => {
    try {
      const postData = {
        user_id: user._id,
        book_id: book._id,
      };
      const response = await axios.post(`${backendURL}/borrow`, postData, {
        withCredentials: true,
      });

      // console.log("data", response.data);

      // console.log("borrow message", response.data.message);
      toast.success(response.data.message || "Book Borrowed Successfully");
    } catch (error) {
      console.log("error borrowing book", error);
      toast.error(error.response.data.message);
    }
  };
  return (
    <div className="min-h-screen bg-gray-200 flex flex-col md:flex-row justify-center items-start md:items-center p-4 md:p-10 gap-6 mt-16">
      {/* 🔹 Book Card */}
      <div
        id="card"
        className="bg-black rounded-2xl overflow-hidden shadow-[0_0_15px_white] hover:shadow-[0_0_30px_white]
                 transition duration-300 w-full md:w-1/3 p-4 flex flex-col"
      >
        {/* Badges */}
        <div className="relative">
          <span className="absolute top-2 left-2 bg-red-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
            {book.genre}
          </span>

          <span className="absolute top-2 right-2 bg-white text-green-600 text-xs font-semibold px-3 py-1 rounded-full shadow-md">
            {book.availableCopies} left
          </span>

          {/* Book Image */}
          <img
            src={book.thumbnailphoto || "https://via.placeholder.com/400x250"}
            alt={book.name}
            className="w-full max-h-64 object-contain mt-10 rounded-lg"
          />
        </div>

        {/* Book Info */}
        <div className="mt-4">
          <h2 className="text-lg md:text-xl font-bold text-white">
            {book.name}
          </h2>
          <p className="text-gray-400 mt-1 text-sm line-clamp-2">
            {book.description}
          </p>

          <div className="text-sm text-gray-400 mt-2">
            <span className="block">🧑 Author: {book.author.fullname}</span>
            <span className="block">
              📅 {new Date(book.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>
      </div>

      {/* 🔹 Borrow Form */}
      <div className="bg-white w-full md:w-1/2 p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4 text-center">
          Borrow Details
        </h2>

        <div className="space-y-3 text-sm md:text-base">
          <p>
            <b>Borrower Name:</b> {user.fullname}
          </p>
          <p>
            <b>Book:</b> {book.name}
          </p>
          <p>
            <b>Description:</b> {book.description}
          </p>
          <p>
            <b>Book Updated At:</b>{" "}
            {new Date(book.createdAt).toLocaleDateString()}
          </p>
          <p>
            <b>Author:</b> {book.author?.fullname || "Unknown"}
          </p>
          <p>
            <b>Issued on:</b>{" "}
            {new Date().toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
            })}
          </p>

          <p>
            <b>Return by:</b>{" "}
            {new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toLocaleDateString(
              "en-GB",
              {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
              }
            )}{" "}
            (<span className="text-red-600">After 15 days</span>)
          </p>

          <button
            onClick={hanldeBorrrow}
            className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold px-4 py-2 rounded-lg w-full mt-4 cursor-pointer"
          >
            Confirm Borrow
          </button>
        </div>
      </div>
    </div>
  );
};

export default Borrow;
