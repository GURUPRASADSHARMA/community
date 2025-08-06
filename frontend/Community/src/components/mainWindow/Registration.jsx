import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from "axios";
import handleSuccess from "../utils/toastify/tostify";
import handleError from "../utils/toastify/tostify";

function Registration() {
 const navigate = useNavigate()
  const [file, setFile] = useState(null);
  const [userData, setUserData] = useState({
    fullname: '',
    username: '',
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleFile = (e) => {
  const uploaded = e.target.files[0];
  if (uploaded && uploaded.type.startsWith("image/")) {
    setFile(uploaded);
    setErrors(prev => ({ ...prev, file: null }));
  } else {
    setFile(null);
    setErrors(prev => ({
      ...prev,
      file: "Please upload a valid image file"
    }));
  }
};


  const handleUserdata = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const validate = () => {
    const newErrors = {};
    if (!userData.fullname.trim()) newErrors.fullname = "Full name is required";
    if (!userData.username.trim()) newErrors.username = "Username is required";
    if (!userData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) newErrors.email = "Invalid email format";
    if (userData.password.length < 6) newErrors.password = "Password must be at least 6 characters";
    if (!file) newErrors.file = "Profile image is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const formData = new FormData();
    formData.append("fullname", userData.fullname);
    formData.append("username", userData.username);
    formData.append("email", userData.email);
    formData.append("password", userData.password);
    formData.append("profileImage", file);

    setLoading(true);
    try {
      const result = await axios.post("/api/v1/user/register", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        }
      });
      console.log(result)
      if (result.data.statusCode==true) {
        console.log("sucess")
        navigate('/login')
      }
    } catch (error) {
      handleError("Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-full bg-gray-300 flex justify-center items-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Account</h1>
          <p className="text-gray-600">Join our community today</p>
        </div>
        <form className="space-y-4" onSubmit={handleSubmit}>

          {/* Profile Upload */}
          <div className="flex flex-col items-center">
            <label
              htmlFor="imageUpload"
              className="cursor-pointer relative w-24 h-24 rounded-full overflow-hidden border-2 border-indigo-500 hover:border-indigo-700 transition"
            >
              {file ? (
                <img
                  src={URL.createObjectURL(file)}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-600 text-sm">
                  Upload
                </div>
              )}
              <div className="absolute bottom-0 w-full text-center bg-black bg-opacity-50 text-white text-xs py-1">
                Change
              </div>
            </label>
            <input
              type="file"
              id="imageUpload"
              accept="image/*"
              onChange={handleFile}
              className="hidden"
            />
            {errors.file && <p className="text-red-500 text-sm mt-1">{errors.file}</p>}
          </div>

          {/* Full Name */}
          <div>
            <input
              type="text"
              name="fullname"
              value={userData.fullname}
              placeholder="Full Name"
              onChange={handleUserdata}
              className="w-full px-4 py-3 bg-gray-50 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            {errors.fullname && <p className="text-red-500 text-sm mt-1">{errors.fullname}</p>}
          </div>

          {/* Username */}
          <div>
            <input
              type="text"
              name="username"
              value={userData.username}
              placeholder="Username"
              onChange={handleUserdata}
              className="w-full px-4 py-3 bg-gray-50 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            {errors.username && <p className="text-red-500 text-sm mt-1">{errors.username}</p>}
          </div>

          {/* Email */}
          <div>
            <input
              type="email"
              name="email"
              value={userData.email}
              placeholder="Email address"
              onChange={handleUserdata}
              className="w-full px-4 py-3 bg-gray-50 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>

          {/* Password */}
          <div>
            <input
              type="password"
              name="password"
              value={userData.password}
              placeholder="Password"
              onChange={handleUserdata}
              className="w-full px-4 py-3 bg-gray-50 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition disabled:opacity-60"
            disabled={loading}
          >
            {loading ? (
              <svg className="animate-spin h-5 w-5 mx-auto text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            ) : (
              "Create Account"
            )}
          </button>
        </form>

        <p className="text-center mt-6 text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="text-indigo-600 hover:text-indigo-700 font-medium">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Registration;
