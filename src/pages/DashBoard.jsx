// Dashboard.jsx
import { useState, useEffect } from "react";
import { useAuth } from "../contexts/useAuth.js";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Loader from "../components/Loader";

const Dashboard = () => {
  const auth = useAuth();
  const user = auth?.user ?? auth;
  const navigate = useNavigate();
  const backendURL = import.meta.env.VITE_BACKEND_API_URL;

  const [borrowedBooks, setBorrowedBooks] = useState([]);
  const [returnedBooks, setReturnedBooks] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch all dashboard data
  useEffect(() => {
    let mounted = true;

    const fetchData = async () => {
      setLoading(true);
      try {
        const [bRes, rRes] = await Promise.all([
          axios.get(`${backendURL}/user/borrowed/books`, {
            withCredentials: true,
          }),
          axios.get(`${backendURL}/user/returned/books`, {
            withCredentials: true,
          }),
        ]);

        if (!mounted) return;

        setBorrowedBooks(bRes.data?.borrowedBooks ?? []);
        setReturnedBooks(rRes.data?.returnedBooks ?? []);
      } catch (err) {
        console.error("fetch dashboard data error:", err);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchData();
    return () => {
      mounted = false;
    };
  }, []);

  const totalBorrowed = borrowedBooks.length + returnedBooks.length;
  const currentlyBorrowed = borrowedBooks.length;
  const totalReturned = returnedBooks.length;

  const formatDate = (d) => {
    if (!d) return "-";
    const dt = new Date(d);
    return isNaN(dt) ? "-" : dt.toLocaleDateString();
  };

  return (
    <div className="p-6 md:mt-20 min-h-screen mt-14">
      <h1 className="text-3xl text-center mt-6 mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Profile Card */}
        <div className="bg-gray-200 p-6 rounded-xl shadow-md md:col-span-1">
          <div className="flex items-center gap-4">
            <img
              src={user?.profilephoto}
              alt="avatar"
              className="w-20 h-20 rounded-full object-cover"
            />
            <div>
              <h2 className="text-lg font-semibold">
                {user?.fullname ?? user?.username ?? "Guest"}
              </h2>
            </div>
          </div>

          <div className="mt-6 text-sm space-y-2">
            <div className="flex">
              <span className="w-45">Current Borrowed Books</span>
              <span className="font-semibold">{currentlyBorrowed}</span>
            </div>
            <div className="flex">
              <span className="w-45">Returned Books</span>
              <span className="font-semibold">{totalReturned}</span>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="bg-blue-500 text-white p-6 rounded-xl shadow-md text-center flex flex-col items-center justify-center">
          <h1 className="text-2xl">Total Borrowed Books</h1>
          <p className="text-3xl font-bold">{totalBorrowed}</p>
        </div>

        <div className="bg-green-500 text-white p-6 rounded-xl shadow-md text-center flex flex-col items-center justify-center">
          <h1 className="text-2xl">Returned Books</h1>
          <p className="text-3xl font-bold">{totalReturned}</p>
        </div>

        <div className="bg-orange-400 text-white p-6 rounded-xl shadow-md text-center flex flex-col items-center justify-center">
          <h1 className="text-2xl">Currently Borrowed</h1>
          <p className="text-3xl font-bold">{currentlyBorrowed}</p>
        </div>
      </div>

      {/* Current Borrowed Books */}
      <div className="mt-8 bg-white p-6 rounded-xl shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold">Current Borrowed Books</h3>
          <button
            onClick={() => navigate("/borrowed")}
            className="text-blue-600 text-sm"
          >
            View All
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {loading ? (
            <div className="flex justify-center items-center h-48 w-full col-span-4">
              <Loader />
            </div>
          ) : borrowedBooks.length === 0 ? (
            <p className="text-gray-500">No borrowed books</p>
          ) : (
            borrowedBooks.slice(0, 4).map((item) => (
              <div
                key={item._id}
                className="bg-gray-50 p-3 rounded-lg shadow flex flex-col"
              >
                <div className="h-40 bg-gray-100 flex items-center justify-center overflow-hidden rounded">
                  <img
                    src={
                      item.book_id?.thumbnailphoto ||
                      "https://via.placeholder.com/200x250"
                    }
                    alt={item.book_id?.name}
                    className="w-full h-full object-contain"
                  />
                </div>
                <h4 className="mt-3 font-semibold text-sm">
                  {item.book_id?.name}
                </h4>
                <p className="text-xs text-gray-500">
                  by {item.book_id?.author?.fullname ?? "Unknown"}
                </p>
                <p className="text-xs text-gray-400">
                  Genre: {item.book_id?.genre ?? "-"}
                </p>
                <p className="text-xs mt-2">
                  Return by:{" "}
                  <span className="text-red-500">
                    {formatDate(item.returnAt)}
                  </span>
                </p>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Recently Returned + Reminders */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h3 className="font-semibold mb-4">Recently Returned Books</h3>

          {loading ? (
            <div className="flex justify-center items-center h-32">
              <Loader />
            </div>
          ) : returnedBooks.length === 0 ? (
            <p className="text-gray-500">No recently returned</p>
          ) : (
            returnedBooks.slice(0, 3).map((item) => (
              <div key={item._id} className="flex items-center gap-4 mb-4">
                <img
                  src={
                    item.book_id?.thumbnailphoto ||
                    "https://via.placeholder.com/80"
                  }
                  alt={item.book_id?.name}
                  className="h-16 w-16 object-cover rounded"
                />
                <div>
                  <h4 className="font-semibold text-sm">
                    {item.book_id?.name}
                  </h4>
                  <p className="text-xs text-gray-500">
                    {item.book_id?.author?.fullname}
                  </p>
                  <p className="text-xs text-gray-400">
                    Returned At:{" "}
                    {formatDate(
                      item.returnedAt ?? item.updatedAt ?? item.returnAt
                    )}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md">
          <h3 className="font-semibold mb-4">Reminders</h3>

          {loading ? (
            <div className="flex justify-center items-center h-32">
              <Loader />
            </div>
          ) : borrowedBooks.length === 0 ? (
            <p className="text-gray-500">No reminders</p>
          ) : (
            borrowedBooks.slice(0, 5).map((item) => (
              <p key={item._id} className="text-sm mb-2">
                Return <b>{item.book_id?.name}</b> by{" "}
                <span className="text-red-500">
                  {formatDate(item.returnAt)}
                </span>
              </p>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
