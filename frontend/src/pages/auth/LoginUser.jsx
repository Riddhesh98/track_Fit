import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiLock, FiMail, FiArrowRight } from 'react-icons/fi';
import axios from 'axios';

const LoginUser = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const submitHandler = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setIsLoading(true);

    const data = { email, password };

    try {
      const response = await axios.post(
        "http://localhost:3000/api/users/login",
        data,
        { withCredentials: true }
      );

      if (response.status === 200 || response.status === 201) {
        navigate("/user-dashboard");
      }
    } catch (error) {
      console.log(error);
      setErrorMsg(error.response?.data?.message || "Invalid credentials. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#f4f5f7] flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-md space-y-6">
        {/* Brand Logo Header */}
        <div className="flex flex-col items-center justify-center text-center space-y-2">
          <div 
            onClick={() => navigate("/")} 
            className="cursor-pointer flex items-center gap-2.5 mb-1 select-none group"
          >
            <div className="w-10 h-10 rounded-xl bg-orange-600 flex items-center justify-center font-black text-white text-xs tracking-tighter shadow-sm border border-orange-700 shrink-0 group-hover:bg-orange-700 transition-colors">
              <svg className="w-6 h-6 text-white fill-current" viewBox="0 0 24 24">
                <path d="M4 4h16v3H13.5v13h-3.5V7H4V4zm10.5 6.5H20v3h-5.5v-3z"/>
              </svg>
            </div>
            <span className="text-2xl font-black tracking-tight text-gray-900 uppercase">
              TRACK<span className="text-orange-600">FIT</span>
            </span>
          </div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">
            Athlete Sign In
          </h1>
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">
            Access your fitness & nutrition dashboard
          </p>
        </div>

        {/* Card Form */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 sm:p-8 shadow-xs space-y-5">
          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-rose-700 text-xs font-bold text-center">
              {errorMsg}
            </div>
          )}

          <form onSubmit={submitHandler} className="space-y-4">
            <div>
              <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">
                Email Address
              </label>
              <div className="relative">
                <FiMail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  placeholder="athlete@trackfit.com"
                  required
                  className="w-full h-11 pl-10 pr-4 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 font-bold text-sm outline-none focus:border-orange-600 transition-colors placeholder:text-gray-400 placeholder:font-normal"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">
                Account Password
              </label>
              <div className="relative">
                <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type="password"
                  placeholder="••••••••••••"
                  required
                  className="w-full h-11 pl-10 pr-4 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 font-bold text-sm outline-none focus:border-orange-600 transition-colors placeholder:text-gray-400 placeholder:font-normal"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-11 bg-gray-900 hover:bg-gray-800 text-white font-bold uppercase text-xs tracking-wider rounded-lg transition-colors flex items-center justify-center gap-2 mt-2 shadow-xs"
            >
              {isLoading ? "Authenticating..." : (
                <>Sign In to Dashboard <FiArrowRight size={16} /></>
              )}
            </button>
          </form>

          <div className="pt-4 text-center border-t border-gray-100">
            <Link
              to="/signup-user"
              className="text-gray-600 text-xs font-bold hover:text-orange-600 transition-colors uppercase tracking-wider inline-flex items-center gap-1"
            >
              Don't have an account? <span className="text-orange-600 underline">Register Now</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginUser;