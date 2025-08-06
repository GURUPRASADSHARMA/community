import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { userLoggedIn } from "../storeslice/features/AuthSlice";
import { useEffect } from "react";

function Login (){
  const loginStatus = useSelector((state)=>state.auth.isLoggedIn)
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const [loginUser,setLoginUser]= useState({
    username:'',
    password:''
  });
  const loginInfo = (e)=>{
    setLoginUser({...loginUser,[e.target.name]:e.target.value})
    // console.log(loginUser)
  }
  const handleSubmit = async (e)=>{
      e.preventDefault();
      const formData = new FormData();
      formData.append("username",loginUser.username)
      formData.append("password",loginUser.password)
      // console.log(formData)
      // console.log(loginUser)
      try {

        const response = await axios.post("/api/v1/user/login",formData,{
          headers: { "Content-Type": "application/json" },
        })
        console.log(response.data)
        const userData = response?.data?.data.user
        if(response.data.statusCode){
            dispatch(userLoggedIn(userData))
              navigate('/home')
            
          }  
      } catch (error) {
        console.log("error while login user")
        alert("username or password is incorrect")
      }

  }
    useEffect(() => {
    if (loginStatus) {
      navigate('/home');
    }
  }, [loginStatus, navigate]);

  return (
    <div className="min-h-full bg-gray-300 flex items-center justify-center rounded-xl m-24">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h1>
          <p className="text-gray-600">Sign in to your account</p>
        </div>

        <form  className="space-y-6" onSubmit={handleSubmit}>
          {/* Username */}
          <div className="relative">
           
            <input
              name="username"
              value={loginUser.username}
              onChange={loginInfo}
              type="text"
              placeholder="Username"
              className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
              required
            />
          </div>

          {/* Password */}
          <div className="relative">
           
            <input
              type="password"
              name="password"
              value={loginUser.password}
              onChange={loginInfo}
              placeholder="Password"
              className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
              required
            />
          </div>

          <div className="flex items-center justify-between text-sm">
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors"
          >
            Sign In
          </button>
        </form>
        <p className="text-center mt-6 text-gray-600">
          Don't have an account?{' '}
          <Link
        to="/signup"
        className="text-indigo-600 hover:text-indigo-700 font-medium"
        >signUp</Link>
        </p>
     <p className="text-red-600 ml-6">NOTE: VERIFY YOUR EMAIL BEFORE LOGIN <Link
        to="/verifyemail"
        className="text-indigo-600 hover:text-indigo-700 font-medium"
        >verify email</Link></p>
        <div className="relative mt-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200"></div>
          </div>
        </div>
      </div>
    </div>
  );
  
};

export default Login;

