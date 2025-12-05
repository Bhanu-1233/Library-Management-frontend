import { useState } from "react";
import axios from "axios";
import { useAuth } from "../contexts/useAuth.js";
import { toast } from "react-toastify";
import api from "../components/Api.jsx";
import personIcon from "../assets/person_icon.svg";
import LogoutPopUp from "../components/LogoutPopUp.jsx";

const Profile = () => {
  const { user, setUser } = useAuth();
  const [username] = useState(user?.username || "");
  const [fullname, setFullname] = useState(user?.fullname || "");
  const [email] = useState(user?.email || "");
  const [gender] = useState(user?.gender || "");
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [preview, setPreview] = useState(user?.profilephoto || "");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showLogoutPopUp, setShowLogoutPopUp] = useState(false);

  const backendURL = import.meta.env.VITE_BACKEND_API_URL;

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePhoto(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("fullname", fullname);
      formData.append("username", user?.username || "");
      formData.append("email", email);
      formData.append("gender", gender);
      if (profilePhoto) formData.append("profilePhoto", profilePhoto);

      const res = await axios.put(`${backendURL}/update`, formData, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });

      setUser(res.data.data);
      localStorage.setItem("user", JSON.stringify(res.data.data));
      toast.success("Profile updated successfully 🎉");
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Profile update failed");
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    try {
      const res = await api.put(
        "/user/change-password",
        { oldPassword, newPassword },
        { withCredentials: true }
      );
      toast.success(res.data.message || "Password updated successfully ✅");
      setOldPassword("");
      setNewPassword("");
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to change password");
    }
  };

  const handleLogout = async () => {
    try {
      await axios.post(
        "http://localhost:8000/logout",
        {},
        { withCredentials: true }
      );
    } catch (error) {
      console.log(
        "Error during logout:",
        error.response?.data?.error || "Unknown error"
      );
    } finally {
      setShowLogoutPopUp(false);
      setUser(null);
      localStorage.removeItem("user");
    }
  };

  return (
    <div
      className="
        min-h-screen flex flex-col md:flex-row
        p-6 md:p-10 
        mt-16 md:mt-24 
        mb-20 md:mb-0
        gap-8
      "
    >
      {/* ===== Left Section ===== */}
      <div className="bg-gray-300 shadow-md rounded-lg p-6 flex flex-col items-center w-full md:w-1/3">
        <div className="relative">
          <img
            src={preview || personIcon}
            className="w-40 h-40 rounded-full border-4 border-gray-300 object-cover"
          />
          <label
            htmlFor="profileUpload"
            className="absolute bottom-2 right-2 bg-blue-600 text-white rounded-full w-8 h-8 flex justify-center items-center cursor-pointer text-lg"
          >
            +
          </label>
          <input
            id="profileUpload"
            type="file"
            className="hidden"
            accept="image/*"
            onChange={handleFileChange}
          />
        </div>

        <h2 className="text-xl font-bold mt-3">{fullname}</h2>
        <p className="text-gray-600">{email}</p>
        <p className="text-sm text-gray-500 capitalize">
          Role: {user?.role || "User"}
        </p>
        <p className="text-sm text-gray-500">Gender: {gender || "Not set"}</p>
      </div>

      {/* ===== Right Section ===== */}
      <div className="flex-1 bg-white shadow-md rounded-lg p-6 md:p-8 space-y-10">
        {/* Update Profile */}
        <form onSubmit={handleUpdateProfile} className="space-y-4">
          <h3 className="text-2xl font-semibold mb-4 border-b pb-2 text-center">
            Update Profile
          </h3>

          <div>
            <label className="block text-sm font-medium mb-1">Full Name</label>
            <input
              type="text"
              value={fullname}
              onChange={(e) => setFullname(e.target.value)}
              className="w-full border p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Username</label>
            <input
              type="text"
              value={username}
              readOnly
              className="w-full border p-2 rounded-md bg-gray-100 cursor-not-allowed"
            />
          </div>

          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 font-semibold mt-3 w-full md:w-auto cursor-pointer"
          >
            Save Changes
          </button>
        </form>

        {/* Change Password */}
        <form
          onSubmit={handleChangePassword}
          className="w-full border-t pt-6 space-y-4"
        >
          <h3 className="text-lg font-semibold mb-2 text-center">
            Change Password
          </h3>

          <div>
            <label className="block text-sm font-medium mb-1">
              Old Password
            </label>
            <input
              type="password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              className="w-full border p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
              placeholder="Enter old password"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              New Password
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full border p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
              placeholder="Enter new password"
              required
            />
          </div>

          <button
            type="submit"
            className="bg-green-600 text-white w-full py-2 rounded-md hover:bg-green-700 font-semibold cursor-pointer"
          >
            Change Password
          </button>
        </form>

        {/* Mobile-only Logout */}
      </div>
      <button
        onClick={() => setShowLogoutPopUp(true)}
        className="block md:hidden bg-red-600 text-white w-full py-2 rounded-md hover:bg-red-700 font-semibold mt-4 cursor-pointer"
      >
        Logout
      </button>
      {showLogoutPopUp && (
        <LogoutPopUp
          onConfirm={handleLogout}
          onCancel={() => setShowLogoutPopUp(false)}
        />
      )}
    </div>
  );
};

export default Profile;
