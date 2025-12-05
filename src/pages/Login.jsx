import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/useAuth.js";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import mailIcon from "../assets/mail_icon.svg";
import lockIcon from "../assets/lock_icon.svg";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const backendURL = import.meta.env.VITE_BACKEND_API_URL;
  const { setUser } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${backendURL}/login`, formData, {
        withCredentials: true,
      });

      const userData = response.data.userData;
      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));

      toast.success(response.data.message || "Login successful 🎉");

      setTimeout(() => {
        if (userData.role === "author") {
          navigate("/author-dashboard", { replace: true });
        } else {
          navigate("/", { replace: true });
        }
      }, 800);
    } catch (error) {
      console.error(error);
      toast.error(
        error.response?.data?.message || "Something went wrong during login"
      );
    }
  };

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center bg-cover bg-center px-4 sm:px-6"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1524995997946-a1c2e315a42f')",
      }}
    >
      <div className="w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-md bg-black/80 rounded-2xl shadow-lg backdrop-blur-md px-6 sm:px-8 py-8 sm:py-10 text-center">
        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6">
          Login to your Account
        </h2>

        <form onSubmit={handleLogin} className="flex flex-col gap-4 sm:gap-5">
          {/* Email Field */}
          <div className="flex items-center gap-3 border border-gray-500 px-4 py-3 bg-[#333A5C] rounded-full">
            <img src={mailIcon} alt="Mail Icon" className="w-6 h-5" />
            <input
              type="text"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className="rounded outline-none border-0 bg-transparent text-white w-full text-sm sm:text-base"
              required
            />
          </div>

          {/* Password Field */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-3 border border-gray-500 px-4 py-3 bg-[#333A5C] rounded-full">
              <img src={lockIcon} alt="Lock Icon" className="w-6 h-5" />
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                className="rounded outline-none border-0 bg-transparent text-white w-full text-sm sm:text-base"
                required
              />
            </div>

            <button
              type="button"
              onClick={() => navigate("/forgot-password")}
              className="text-blue-400 text-xs sm:text-sm hover:underline self-end"
            >
              Forgot Password?
            </button>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            className="bg-gradient-to-b from-blue-300 to-blue-500 text-white py-2 sm:py-2.5 rounded-full hover:bg-blue-700 mt-2 font-semibold text-sm sm:text-base transition-transform hover:scale-105 cursor-pointer"
          >
            Login
          </button>
        </form>

        {/* Register Redirect */}
        <div className="text-center mt-4 sm:mt-5">
          <p className="text-gray-300 text-sm sm:text-base">
            Don’t have an account?{" "}
            <span
              onClick={() => navigate("/register", { replace: true })}
              className="text-red-400 underline ml-1 sm:ml-2 cursor-pointer hover:text-blue-400"
            >
              Sign Up
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
