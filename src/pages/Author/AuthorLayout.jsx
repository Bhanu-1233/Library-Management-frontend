import { useState } from "react";
import { useNavigate, useLocation, Outlet } from "react-router-dom";
import { useAuth } from "../../contexts/useAuth.js";
import { toast } from "react-toastify";
import libLogo from "../../assets/LibImage.webp";
import {
  LayoutDashboard,
  Plus,
  BookOpen,
  Menu,
  X,
  DollarSign,
  User,
} from "lucide-react";
import api from "../../components/Api";

const AuthorLayout = () => {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await api.post("/logout");
      localStorage.removeItem("user");
      setUser(null);
      toast.success("Logged out successfully 👋");
      navigate("/login");
    } catch (err) {
      toast.error("Logout failed");
      console.log(err);
    }
  };

  // Helper for active link highlighting
  const isActive = (path) =>
    location.pathname === path
      ? "bg-indigo-600 text-white border-l-4 border-indigo-400"
      : "text-gray-300 hover:bg-indigo-600 hover:text-white";

  // 👇 Handles link navigation + auto close on mobile
  const handleNavigate = (path) => {
    navigate(path);
    if (window.innerWidth < 768) setSidebarOpen(false);
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* 🔹 Navbar */}
      <header className="bg-white shadow-md flex justify-between items-center px-4 md:px-8 py-3 fixed top-0 left-0 w-full z-40">
        {/* Left Section */}
        <div className="flex items-center gap-3 md:gap-6">
          {/* Hamburger Icon (Mobile) */}
          <button
            className="md:hidden p-2 rounded hover:bg-gray-100 transition"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? <X size={22} /> : <Menu size={22} />}
          </button>

          {/* Logo and Title */}
          <div className="flex items-center gap-2">
            <img
              className="h-9 w-12 object-cover rounded-xl"
              src={libLogo}
              alt="logo"
            />
            <h1
              className="text-xl md:text-2xl font-bold text-gray-800 truncate max-w-[160px] sm:max-w-[220px] md:max-w-[280px]"
              title={user?.username || "Author"}
            >
              Welcome, {user?.username || "Author"} 👋
            </h1>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-3 md:gap-5">
          <button
            onClick={() => handleNavigate("/profile")}
            className="h-8 w-8 flex items-center justify-center border border-gray-300 rounded-full hover:bg-gray-100 transition"
          >
            {user?.profilephoto ? (
              <img
                src={user.profilephoto}
                alt="User Profile"
                className="w-8 h-8 rounded-full object-cover"
              />
            ) : (
              <User className="h-5 w-5 text-gray-600" />
            )}
          </button>
          <button
            onClick={handleLogout}
            className="hidden sm:block bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition font-semibold"
          >
            Logout
          </button>
        </div>
      </header>

      {/* 🔹 Sidebar (attached to navbar) */}
      <aside
        className={`fixed bg-[#111827] text-white flex flex-col p-6 space-y-6 shadow-lg transform transition-all duration-300 ease-in-out
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 
        top-[64px] w-64 h-[calc(100%-64px)] z-30`}
      >
        <div className="text-center mt-2">
          <h2 className="text-2xl font-bold text-indigo-400 tracking-wide">
            Author Panel
          </h2>
          <p className="text-gray-400 text-sm mt-1">Manage your books 📚</p>
        </div>

        <nav className="flex flex-col space-y-2">
          <button
            onClick={() => handleNavigate("/author-dashboard")}
            className={`flex items-center gap-3 px-4 py-2 rounded transition-all duration-200 ${isActive(
              "/author-dashboard"
            )}`}
          >
            <LayoutDashboard size={18} /> Dashboard
          </button>

          <button
            onClick={() => handleNavigate("/createbook")}
            className={`flex items-center gap-3 px-4 py-2 rounded transition-all duration-200 ${isActive(
              "/createbook"
            )}`}
          >
            <Plus size={18} /> Add Book
          </button>

          <button
            onClick={() => handleNavigate("/mybooks")}
            className={`flex items-center gap-3 px-4 py-2 rounded transition-all duration-200 ${isActive(
              "/mybooks"
            )}`}
          >
            <BookOpen size={18} /> My Books
          </button>

          <button
            onClick={() => handleNavigate("/mysales")}
            className={`flex items-center gap-3 px-4 py-2 rounded transition-all duration-200 ${isActive(
              "/mysales"
            )}`}
          >
            <DollarSign size={18} /> My Sales
          </button>

          {/* Mobile Logout Button */}
          <button
            onClick={handleLogout}
            className="md:hidden bg-red-600 text-white px-4 py-2 mt-3 rounded-lg hover:bg-red-700 transition font-semibold"
          >
            Logout
          </button>
        </nav>
      </aside>

      {/* 🔹 Page Content */}
      <main className="flex-1 mt-[64px] p-4 md:p-6 overflow-y-auto md:ml-64 transition-all duration-300">
        <Outlet />
      </main>
    </div>
  );
};

export default AuthorLayout;
