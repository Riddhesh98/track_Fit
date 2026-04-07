import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const LoginOwner = () => {
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
        "http://localhost:3000/api/gymOwner/login",
        data,
        {
          withCredentials: true,
        }
      );

      console.log(response.data);

      if (response.status === 200 || response.status === 201) {
        navigate("/owner-dashboard");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black p-6">
      <div className="max-w-md w-full bg-gray-950 border border-gray-900 p-10 rounded-[3rem] shadow-[0_0_60px_rgba(0,0,0,1)]">
        
        {/* Heading */}
        <div className="text-center mb-10">
          <h2 className="text-4xl font-black italic text-white uppercase tracking-tighter">
            Owner Login
          </h2>
          <p className="text-gray-600 text-[10px] font-bold uppercase tracking-[0.2em] mt-2">
            Manage your facility
          </p>
        </div>

        {/* Form */}
        <form onSubmit={submitHandler} className="flex flex-col gap-6">
          
          <input
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            placeholder="Business Email"
            required
            className="w-full h-14 px-6 bg-transparent border border-gray-800 rounded-xl text-white focus:border-white transition-all outline-none"
          />

          <input
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            placeholder="Password"
            required
            className="w-full h-14 px-6 bg-transparent border border-gray-800 rounded-xl text-white focus:border-white transition-all outline-none"
          />

          {/* Owner Login Button */}
          <button
            type="submit"
            className="w-full h-14 bg-white text-black font-black uppercase tracking-widest rounded-xl hover:bg-gray-200 transition-all active:scale-[0.98]"
          >
            Login
          </button>



        </form>

        {/* Bottom Links */}
        <div className="mt-8 flex justify-between items-center px-4">
          <Link
            to="/register-owner"
            className="text-gray-500 text-[10px] font-bold uppercase hover:text-white transition-colors tracking-widest"
          >
            Register Business
          </Link>

          {/* Athlete switcher — pill style */}
          <Link
            to="/login-user"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-gray-800 text-gray-600 text-[10px] font-bold uppercase tracking-widest hover:border-gray-600 hover:text-gray-300 hover:bg-gray-900/40 transition-all duration-300 group"
          >
            <span>Athlete</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3 group-hover:translate-x-0.5 transition-transform duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

      </div>
    </div>
  );
};

export default LoginOwner;