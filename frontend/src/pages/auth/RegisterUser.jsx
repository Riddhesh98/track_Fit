import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiArrowRight } from 'react-icons/fi';
import axios from 'axios';

const RegisterUser = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [frequency, setFrequency] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const submitHandler = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setIsLoading(true);

    const data = {
      name,
      email,
      password,
      age,
      gender,
      height,
      weight,
      frequency
    };

    try {
      const response = await axios.post(
        "http://localhost:3000/api/users/signup", 
        data, 
        { withCredentials: true }
      );

      if (response.status === 200 || response.status === 201) {
        navigate("/user-dashboard");
      }
    } catch (err) {
      console.error(err);
      setErrorMsg(err.response?.data?.message || "Signup failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#f4f5f7] flex items-center justify-center p-4 py-10 font-sans">
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
            Create Athlete Profile
          </h1>
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">
            Start tracking your workout & body metrics
          </p>
        </div>

        {/* Card Form */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 sm:p-8 shadow-xs space-y-4">
          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-rose-700 text-xs font-bold text-center">
              {errorMsg}
            </div>
          )}

          <form onSubmit={submitHandler} className="space-y-4">
            <div>
              <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">
                Full Name *
              </label>
              <input 
                type="text" 
                placeholder="Enter your name" 
                required 
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full h-11 px-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 text-xs font-bold outline-none focus:border-orange-600 transition-colors" 
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">
                Email Address *
              </label>
              <input 
                type="email" 
                placeholder="athlete@trackfit.com" 
                required 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-11 px-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 text-xs font-bold outline-none focus:border-orange-600 transition-colors" 
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">
                Password *
              </label>
              <input 
                type="password" 
                placeholder="Create password" 
                required 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-11 px-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 text-xs font-bold outline-none focus:border-orange-600 transition-colors" 
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">
                  Age *
                </label>
                <input 
                  type="number" 
                  placeholder="24" 
                  required 
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  className="w-full h-11 px-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 text-xs font-bold outline-none focus:border-orange-600 transition-colors" 
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">
                  Gender *
                </label>
                <select 
                  required
                  value={gender}
                  onChange={(e) => setGender(e.target.value)} 
                  className="w-full h-11 px-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 text-xs font-bold outline-none focus:border-orange-600"
                >
                  <option value="">Select</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>
            </div>

            <div className="flex items-center gap-3 py-1">
              <div className="h-[1px] flex-1 bg-gray-200"></div>
              <span className="text-gray-400 text-[9px] font-bold uppercase tracking-wider whitespace-nowrap">
                Optional Physical Baseline
              </span>
              <div className="h-[1px] flex-1 bg-gray-200"></div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[9px] font-bold text-gray-500 uppercase tracking-wider mb-1">Height (cm)</label>
                <input 
                  type="number" 
                  placeholder="175" 
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  className="w-full h-11 px-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 text-xs font-bold outline-none focus:border-orange-600 transition-colors" 
                />
              </div>

              <div>
                <label className="block text-[9px] font-bold text-gray-500 uppercase tracking-wider mb-1">Weight (kg)</label>
                <input 
                  type="number" 
                  placeholder="70" 
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  className="w-full h-11 px-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 text-xs font-bold outline-none focus:border-orange-600 transition-colors" 
                />
              </div>
            </div>

            <div>
              <label className="block text-[9px] font-bold text-gray-500 uppercase tracking-wider mb-1">Training Frequency</label>
              <input 
                type="text"
                placeholder="e.g. 5x per week" 
                value={frequency}
                onChange={(e) => setFrequency(e.target.value)}
                className="w-full h-11 px-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 text-xs font-bold outline-none focus:border-orange-600 transition-colors" 
              />
            </div>

            <button 
              type="submit"
              disabled={isLoading}
              className="w-full h-11 bg-gray-900 hover:bg-gray-800 text-white font-bold uppercase text-xs tracking-wider rounded-lg transition-colors flex items-center justify-center gap-2 mt-2 shadow-xs"
            >
              {isLoading ? "Creating Profile..." : (
                <>Join TrackFit <FiArrowRight size={16} /></>
              )}
            </button>
          </form>

          <div className="pt-4 text-center border-t border-gray-100">
            <Link to="/login-user" className="text-gray-600 text-xs font-bold hover:text-orange-600 transition-colors uppercase tracking-wider inline-flex items-center gap-1">
              Already registered? <span className="text-orange-600 underline">Log In</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterUser;