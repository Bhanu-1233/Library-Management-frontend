import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../contexts/useAuth.js";
import axios from "axios";
import Loader from "../components/Loader";

const Return = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const backendURL = import.meta.env.VITE_BACKEND_API_URL;

  const { state } = useLocation();
  const { item } = state || {};

  const [loading, setLoading] = useState(false);

  // ❗ Prevent crash on refresh
  useEffect(() => {
    if (!item) {
      toast.error("Invalid return request!");
      navigate("/borrowed");
    }
  }, [item, navigate]);

  const handleReturn = async () => {
    setLoading(true);

    try {
      const response = await axios.post(
        `${backendURL}/return`,
        { transaction_id: item._id },
        { withCredentials: true }
      );

      toast.success(response.data.message);

      setTimeout(() => {
        navigate("/returned");
      }, 800);
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  if (!item) return null; // fallback

  return (
    <div className="min-h-screen bg-gray-200 flex flex-col md:flex-row justify-center items-start md:items-center p-4 md:p-10 gap-6 mt-14">
      {/* 🔹 Book Card */}
      <div
        id="card"
        className="bg-black rounded-2xl overflow-hidden shadow-[0_0_15px_white] hover:shadow-[0_0_30px_white]
                 transition duration-300 w-full md:w-1/3 p-4 flex flex-col"
      >
        <div className="relative">
          <span className="absolute top-2 left-2 bg-red-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
            {item.book_id.genre}
          </span>
        </div>

        {/* Book Image */}
        <div className="mt-10 flex justify-center">
          <img
            src={
              item.book_id.thumbnailphoto ||
              "https://via.placeholder.com/400x250"
            }
            alt={item.book_id.name}
            className="w-full max-w-xs md:max-w-sm object-contain rounded-lg"
          />
        </div>

        {/* Book Info */}
        <div className="p-2 mt-4">
          <h2 className="text-lg md:text-xl font-bold text-white">
            {item.book_id.name}
          </h2>

          <p className="text-gray-400 mt-1 text-sm line-clamp-2">
            {item.book_id.description}
          </p>

          <div className="mt-3 text-gray-400 text-sm">
            <p className="mb-1">🧑 Author: {item.book_id.author.fullname}</p>
            <p>📅 {new Date(item.createdAt).toLocaleDateString()}</p>
          </div>
        </div>
      </div>

      {/* 🔹 Return Form */}
      <div className="bg-white w-full md:w-1/2 p-6 rounded-lg shadow-md h-auto">
        <h2 className="text-xl font-semibold mb-4 text-center">
          Return Details
        </h2>

        {loading ? (
          <Loader />
        ) : (
          <div className="space-y-3 text-sm md:text-base">
            <p>
              <b>Name of the Returner:</b> {user.fullname}
            </p>
            <p>
              <b>Book:</b> {item.book_id.name}
            </p>
            <p>
              <b>Author:</b> {item.book_id.author?.fullname || "Unknown"}
            </p>
            <p>
              <b>Description:</b> {item.book_id.description}
            </p>
            <p>
              <b>Issued On:</b> {new Date(item.createdAt).toLocaleDateString()}
            </p>

            <p>
              <b>Return At:</b> {new Date(Date.now()).toLocaleDateString()} (
              <span className="text-red-600">Today</span>)
            </p>

            <button
              onClick={handleReturn}
              className="bg-yellow-500 hover:bg-yellow-600 font-bold cursor-pointer text-white px-4 py-2 rounded-lg w-full mt-4"
            >
              Confirm Return
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Return;
