// src/pages/Home.jsx
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Slider from "react-slick";
import { ChevronLeft, ChevronRight } from "lucide-react";
import BookCard from "../components/BookCard";
import api from "../components/Api";
import { toast } from "react-toastify";
import LibImg1 from "../assets/Lib img1.jpeg";
import LibImg2 from "../assets/Lib img2.jpeg";
import LibImg3 from "../assets/Lib img3.jpeg";

const Home = () => {
  const [booksList, setBookList] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const location = useLocation();
  // read search param
  const searchParams = new URLSearchParams(location.search);
  const query = searchParams.get("q")?.trim() || "";

  const carouselItems = [
    {
      image: LibImg1,
      title: "Discover New Books",
      subtitle: "Explore thousands of titles from your favorite authors.",
    },
    {
      image: LibImg2,
      title: "Borrow & Read Anytime",
      subtitle:
        "Instant access to eBooks and physical copies from your library.",
    },
    {
      image: LibImg3,
      title: "Empower Your Knowledge",
      subtitle: "Join a growing community of readers and learners.",
    },
  ];

  const NextArrow = ({ onClick }) => (
    <div
      onClick={onClick}
      className="absolute right-4 md:right-6 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full cursor-pointer z-10"
    >
      <ChevronRight size={26} />
    </div>
  );

  const PrevArrow = ({ onClick }) => (
    <div
      onClick={onClick}
      className="absolute left-4 md:left-6 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full cursor-pointer z-10"
    >
      <ChevronLeft size={26} />
    </div>
  );

  const settings = {
    dots: true,
    infinite: true,
    autoplay: true,
    autoplaySpeed: 3500,
    arrows: true,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    speed: 800,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  const getBooks = async (pageNum = 1, searchQuery = "") => {
    try {
      setLoading(true);

      let endpoint;
      if (searchQuery) {
        endpoint = `/searchbooks?query=${encodeURIComponent(searchQuery)}`;
      } else {
        endpoint = `/allbooks?page=${pageNum}&limit=8`;
      }

      const res = await api.get(endpoint);
      const data = res.data;

      if (searchQuery) {
        // search results — reset list & paging
        setBookList(data.books || []);
        setTotalPages(1);
        setPage(1);
      } else {
        if (pageNum === 1) {
          setBookList(data.books || []);
        } else {
          setBookList((prev) => [...prev, ...(data.books || [])]);
        }
        setTotalPages(data.totalPages || 1);
        setPage(data.currentPage || pageNum);
      }
    } catch (error) {
      toast.error("Error fetching books");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // run on mount, or whenever query changes
  useEffect(() => {
    getBooks(1, query);
    // Optionally, scroll to top after search
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [query]);

  return (
    <div className="min-h-screen overflow-auto mt-6 md:mt-20 mb-24">
      {/* Carousel Section */}
      <div className="relative w-full max-w-7xl mt-15 px-4 md:px-0 md:mx-auto md:mt-15 mb-10 rounded-2xl overflow-hidden shadow-lg">
        <Slider {...settings}>
          {carouselItems.map((item, idx) => (
            <div key={idx} className="relative h-[260px] md:h-[420px]">
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/50 flex flex-col justify-center items-center text-white text-center px-4 md:px-6">
                <h2 className="text-2xl md:text-4xl font-bold mb-2 drop-shadow-lg">
                  {item.title}
                </h2>
                <p className="text-sm md:text-lg opacity-90">{item.subtitle}</p>
              </div>
            </div>
          ))}
        </Slider>
      </div>

      {/* Books Grid / Results */}
      <div className="px-4 md:px-6 py-6 md:py-10">
        {loading && booksList.length === 0 ? (
          <div className="flex justify-center items-center h-40">
            <p className="text-gray-600 font-semibold">Loading books...</p>
          </div>
        ) : booksList.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-8">
              {booksList.map((book) => (
                <BookCard key={book._id} book={book} />
              ))}
            </div>

            {/* View More only when not searching */}
            {!query && page < totalPages && (
              <div className="flex justify-center mt-8 md:mt-10 mb-10">
                <button
                  onClick={() => getBooks(page + 1, "")}
                  disabled={loading}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-semibold shadow-md cursor-pointer"
                >
                  {loading ? "Loading..." : "View More"}
                </button>
              </div>
            )}
          </>
        ) : (
          <p className="text-center text-gray-600 text-lg">
            {query ? `No books found for "${query}"` : "No books available 📚"}
          </p>
        )}
      </div>
    </div>
  );
};

export default Home;
