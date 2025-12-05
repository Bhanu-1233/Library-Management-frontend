import React from "react";

const LogoutPopUp = ({ onConfirm, onCancel }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm bg-opacity-50 z-50">
      <div className="bg-gray-500 rounded-lg p-6 w-80 shadow-lg text-center">
        <h2 className="text-lg font-semibold mb-4 text-white">
          Are you sure you want to logout?
        </h2>
        <div className="flex justify-between gap-4">
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500 w-full cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 w-full cursor-pointer"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default LogoutPopUp;
