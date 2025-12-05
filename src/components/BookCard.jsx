import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/useAuth.js";
import { toast } from "react-toastify";
import api from "./Api.jsx";
import Loader from "./Loader.jsx";

const BookCard = ({ book }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const razorKey = import.meta.env.VITE_RAZORPAY_KEY;

  // ========= BORROW =========
  const handleBorrow = () => {
    if (!user) {
      navigate("/login");
    } else {
      navigate("/borrow", { state: { book } });
    }
  };

  // ========= DETAILS PAGE =========
  const handleDetails = () => {
    navigate(`/book/${book._id}`);
  };

  // ========= BUY NOW =========
  const handleBuy = async () => {
    if (!user) return navigate("/login");

    setLoading(true);

    try {
      const res = await api.post("/create-order", {
        user_id: user._id,
        book_id: book._id,
      });

      if (res.data.success) {
        initPay(res.data.order, book);
      } else {
        toast.error("Failed to create order");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong while starting payment");
    } finally {
      setLoading(false);
    }
  };

  // ========= RAZORPAY INIT =========
  const initPay = (order, book) => {
    const options = {
      key: razorKey,
      amount: order.amount,
      currency: order.currency,
      name: "Libraverse 📚",
      description: `Purchase: ${book.name}`,
      order_id: order.id,

      handler: async (response) => {
        try {
          const verifyRes = await api.post("/verify-payment", {
            ...response,
            book_id: book._id,
            user_id: user._id,
          });

          if (verifyRes.data.success) {
            toast.success(`Payment successful for "${book.name}"!`);
          } else {
            toast.error("Payment verification failed ❌");
          }
        } catch (err) {
          console.error(err);
        }
      },

      theme: { color: "#2563EB" },

      modal: {
        ondismiss: () => toast.info("Payment cancelled."),
      },

      prefill: {
        name: user.fullname || "",
        email: user.email || "",
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  return (
    <>
      <div
        id="card"
        className="bg-black rounded-2xl overflow-hidden shadow-[0_0_15px_white] hover:shadow-[0_0_30px_white]
                   transition-opacity duration-300 ml-5 border-white mr-5 flex flex-col justify-between h-full"
      >
        {/* ============= LOADER OVERLAY (ONLY FOR BUY NOW) ============= */}
        {loading && (
          <div className="absolute inset-0 bg-black/60 flex justify-center items-center z-20 rounded-2xl">
            <Loader />
          </div>
        )}

        {/* Thumbnail + Badges */}
        <div
          className={`relative cursor-pointer ${
            loading ? "pointer-events-none opacity-40" : ""
          }`}
          onClick={handleDetails}
        >
          <span className="absolute top-2 left-2 bg-red-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
            {book.genre}
          </span>

          <span className="absolute top-2 right-2 bg-white text-green-600 text-xs font-semibold px-3 py-1 rounded-full shadow-md">
            {book.availableCopies} left
          </span>

          <div className="mt-10">
            <img
              src={book.thumbnailphoto || "https://via.placeholder.com/400x250"}
              alt={book.name}
              className="w-76 h-46 object-contain mx-auto mt-3"
            />
          </div>
        </div>

        {/* Book Info */}
        <div
          className={`p-4 ${loading ? "opacity-40 pointer-events-none" : ""}`}
        >
          <h2
            onClick={handleDetails}
            className="text-xl font-bold text-white cursor-pointer hover:underline"
          >
            {book.name}
          </h2>

          <p className="text-gray-500 mt-1 text-sm line-clamp-2">
            {book.description}
          </p>

          <div className="flex items-center text-sm text-gray-500 mt-2 justify-between">
            <span>🧑 {book.author.fullname}</span>
            <span>📅 {new Date(book.createdAt).toLocaleDateString()}</span>
          </div>

          <div className="flex items-center justify-between mt-4 mb-4">
            <p className="text-lg font-bold text-white">
              ₹{book.price.toLocaleString()}
            </p>
            <button
              onClick={handleDetails}
              className="text-yellow-400 hover:text-yellow-300 text-sm font-semibold underline cursor-pointer"
            >
              View Details →
            </button>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 mt-auto">
            <button
              onClick={handleBuy}
              disabled={loading}
              className={`bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg w-1/2 px-2 py-1 cursor-pointer ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              Buy Now
            </button>

            <button
              onClick={handleBorrow}
              disabled={loading}
              className={`bg-yellow-400 hover:bg-yellow-500 text-black font-semibold rounded-lg w-1/2 px-2 py-1 cursor-pointer ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              Borrow Now
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default BookCard;
