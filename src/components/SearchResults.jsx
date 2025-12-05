import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import BookCard from "../components/BookCard";

const SearchResults = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  const results = state?.results || [];
  const query = state?.query || "";

  return (
    <div className="min-h-screen bg-gray-50 pt-28 px-8">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">
        🔍 Search Results for:{" "}
        <span className="text-indigo-600">"{query}"</span>
      </h2>

      {results.length === 0 ? (
        <p className="text-gray-600 text-lg">
          No books found matching your search.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {results.map((book) => (
            <BookCard key={book._id} book={book} />
          ))}
        </div>
      )}

      <button
        onClick={() => navigate("/")}
        className="mt-8 bg-indigo-600 text-white cursor-pointer px-6 py-2 rounded-lg hover:bg-indigo-700"
      >
        ⬅ Back to Home
      </button>
    </div>
  );
};

export default SearchResults;
