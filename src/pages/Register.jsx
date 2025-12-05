import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import personIcon from "../assets/person_icon.svg";
import mailIcon from "../assets/mail_icon.svg";
import lockIcon from "../assets/lock_icon.svg";
import { toast } from "react-toastify";

const Register = () => {
  const [formData, setFormData] = useState({
    fullname: "",
    username: "",
    email: "",
    password: "",
    gender: "",
    role: "",
  });
  const [profilePhoto] = useState(null);
  const backendURL = import.meta.env.VITE_BACKEND_API_URL;
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = new FormData();
      Object.keys(formData).forEach((key) => {
        data.append(key, formData[key]);
      });
      if (profilePhoto) {
        data.append("profilephoto", profilePhoto);
      }

      const res = await axios.post(`${backendURL}/register`, data, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });

      toast.success(res.data.message || "Registration successful");
      navigate("/login", { replace: true });
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-black text-white">
      {/* 🌆 Left Side Image */}
      <div
        className="w-full md:w-1/2 h-64 md:h-auto bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1507842217343-583bb7270b66')",
        }}
      >
        {/* Overlay for contrast */}
        <div className="w-full h-full bg-black/50 backdrop-blur-sm flex items-center justify-center">
          <h1 className="text-3xl sm:text-4xl font-bold text-center px-4 leading-snug">
            Welcome to <span className="text-blue-400">BookVerse</span> 📚
          </h1>
        </div>
      </div>

      {/* 🧾 Right Side Form */}
      <div className="w-full md:w-1/2 flex justify-center items-center bg-gradient-to-b from-gray-900 to-gray-800 px-4 sm:px-6 py-10">
        <div className="w-full max-w-md bg-[#1E1E2E]/70 p-6 sm:p-8 rounded-2xl shadow-2xl">
          <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-center text-white">
            Create Account
          </h2>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* Full Name */}
            <div className="flex items-center gap-3 border border-gray-400 px-4 py-3 bg-[#333A5C]/70 rounded-full">
              <img src={personIcon} alt="Full Name" className="w-6 h-5" />
              <input
                type="text"
                name="fullname"
                placeholder="Full Name"
                value={formData.fullname}
                onChange={handleChange}
                className="bg-transparent text-white w-full outline-none border-none"
                required
              />
            </div>

            {/* Username */}
            <div className="flex items-center gap-3 border border-gray-400 px-4 py-3 bg-[#333A5C]/70 rounded-full">
              <img src={personIcon} alt="Username" className="w-6 h-5" />
              <input
                type="text"
                name="username"
                placeholder="Username"
                value={formData.username}
                onChange={handleChange}
                className="bg-transparent text-white w-full outline-none border-none"
                required
              />
            </div>

            {/* Email */}
            <div className="flex items-center gap-3 border border-gray-400 px-4 py-3 bg-[#333A5C]/70 rounded-full">
              <img src={mailIcon} alt="Email" className="w-6 h-5" />
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                className="bg-transparent text-white w-full outline-none border-none"
                required
              />
            </div>

            {/* Password */}
            <div className="flex items-center gap-3 border border-gray-400 px-4 py-3 bg-[#333A5C]/70 rounded-full">
              <img src={lockIcon} alt="Password" className="w-6 h-5" />
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                className="bg-transparent text-white w-full outline-none border-none"
                required
              />
            </div>

            {/* Gender */}
            <div className="flex items-center gap-3 border border-gray-400 px-4 py-3 bg-[#333A5C]/70 rounded-full">
              <img src={personIcon} alt="Gender" className="w-6 h-5" />
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="bg-transparent text-white w-full outline-none border-none"
                required
              >
                <option className="bg-[#333A5C]" value="">
                  Select Gender
                </option>
                <option className="bg-[#333A5C]" value="male">
                  Male
                </option>
                <option className="bg-[#333A5C]" value="female">
                  Female
                </option>
              </select>
            </div>

            {/* Role */}
            <div className="flex items-center gap-3 border border-gray-400 px-4 py-3 bg-[#333A5C]/70 rounded-full">
              <img src={personIcon} alt="Role" className="w-6 h-5" />
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="bg-transparent text-white w-full outline-none border-none"
                required
              >
                <option className="bg-[#333A5C]" value="">
                  Role
                </option>
                <option className="bg-[#333A5C]" value="user">
                  User
                </option>
                <option className="bg-[#333A5C]" value="author">
                  Author
                </option>
              </select>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="bg-gradient-to-b from-blue-400 to-blue-600 text-white py-2 px-4 rounded-full font-semibold hover:scale-105 transition-transform cursor-pointer"
            >
              Register
            </button>
          </form>

          {/* Login Redirect */}
          <div className="text-center mt-4">
            <p className="text-gray-300 text-sm sm:text-base">
              Already have an account?{" "}
              <span
                onClick={() => navigate("/login", { replace: true })}
                className="text-red-400 cursor-pointer underline hover:text-blue-400"
              >
                Login
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
