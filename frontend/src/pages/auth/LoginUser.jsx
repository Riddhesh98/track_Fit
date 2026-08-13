import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const LoginUser = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const submitHandler = async (e) => {
    e.preventDefault();

    const data = {
      email,
      password,
    };

    try {
      const response = await axios.post(
        "http://localhost:3000/api/users/login",
        data,
        {
          withCredentials: true,
        }
      );

      console.log(response.data);

      if (response.status === 200 || response.status === 201) {
        navigate("/user-dashboard");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black p-6">
      <div className="max-w-md w-full">
        
        {/* Heading */}
        <div className="text-center mb-12">
          <h2 className="text-5xl font-black italic text-white uppercase tracking-tighter">
            Welcome
          </h2>
          <p className="text-gray-500 text-[10px] font-bold uppercase tracking-[0.4em] mt-3">
            Athlete Portal
          </p>
        </div>

        {/* Form */}
        <form onSubmit={submitHandler} className="flex flex-col gap-5">
          
          <input
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            placeholder="Email Address"
            required
            className="w-full h-16 px-6 bg-gray-900 border-2 border-gray-800 rounded-2xl text-white focus:border-indigo-500 outline-none transition-all"
          />

          <input
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            placeholder="Password"
            required
            className="w-full h-16 px-6 bg-gray-900 border-2 border-gray-800 rounded-2xl text-white focus:border-indigo-500 outline-none transition-all"
          />

          {/* Sign In Button */}
          <button
            type="submit"
            className="w-full h-16 bg-indigo-600 text-white font-black uppercase tracking-widest rounded-2xl hover:bg-indigo-500 shadow-2xl transition-all"
          >
            Sign In
          </button>



        </form>

        {/* Bottom Links */}
        <div className="mt-10 flex justify-between items-center px-4">
          <Link
            to="/"
            className="text-indigo-400 text-[10px] font-bold uppercase hover:text-indigo-300 transition-colors"
          >
            Register Account
          </Link>

          {/* Gym Owner switcher — pill style */}
          <Link
            to="/login-owner"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-gray-800 text-gray-600 text-[10px] font-bold uppercase tracking-widest hover:border-gray-600 hover:text-gray-300 hover:bg-gray-900/40 transition-all duration-300 group"
          >
            <span>Gym Owner</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3 group-hover:translate-x-0.5 transition-transform duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

      </div>
    </div>
  );
};

export default LoginUser;