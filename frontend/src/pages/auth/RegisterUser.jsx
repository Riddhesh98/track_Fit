import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const RegisterUser = () => {
    const navigate = useNavigate();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const[age, setAge] = useState("");
    const [gender, setGender] = useState("");
    const[height, setHeight] = useState("");
    const[weight, setWeight] = useState("");
    const [frequency, setFrequency] = useState("");

    const sumbitHandler = async (e) => {
        e.preventDefault();
        const data={
            name,
            email,
            password,
            age,
            gender,
            height,
            weight,
            frequency
        }

        

        const response = await axios.post("http://localhost:3000/api/users/signup", data
            , {
                withCredentials: true
            }
        );

       if(response.status === 200 || response.status === 201){
        navigate("/user-dashboard");
       }
    }

  return (
    <div className="min-h-screen bg-black text-white p-6 md:flex md:items-center md:justify-center">
      <div className="max-w-md w-full py-8">
        <header className="mb-10">
          {/* Brand Name */}
          <h1 className="text-xl font-black italic uppercase tracking-tighter text-indigo-500 mb-4">
            Track Fit
          </h1>
          <h2 className="text-4xl font-black italic uppercase tracking-tighter text-white">
            User <span className="text-indigo-500">Sign Up</span>
          </h2>
          <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest mt-2">
            Create your profile to start tracking
          </p>
        </header>

        <form className="flex flex-col gap-6">
          {/* Compulsory Fields */}
          <div className="flex flex-col gap-5">
            <input 
              type="text" 
              placeholder="Name *" 
              required 
              onChange={(e) => setName(e.target.value)}
              className="w-full h-14 px-5 bg-gray-900 border border-gray-800 rounded-xl focus:border-indigo-500 outline-none transition-all placeholder:text-gray-600" 
            />
            <input 
              type="email" 
              placeholder="Email Address *" 
              required 
              onChange={(e) => setEmail(e.target.value)}
              className="w-full h-14 px-5 bg-gray-900 border border-gray-800 rounded-xl focus:border-indigo-500 outline-none transition-all placeholder:text-gray-600" 
            />
            <input 
              type="password" 
              placeholder="Create Password *" 
              required 
              onChange={(e) => setPassword(e.target.value)}
              className="w-full h-14 px-5 bg-gray-900 border border-gray-800 rounded-xl focus:border-indigo-500 outline-none transition-all placeholder:text-gray-600" 
            />
            
            <div className="grid grid-cols-2 gap-4">
              <input 
                type="number" 
                placeholder="Age *" 
                required 
                onChange={(e) => setAge(e.target.value)}
                className="w-full h-14 px-5 bg-gray-900 border border-gray-800 rounded-xl outline-none focus:border-indigo-500 transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" 
              />
              <select 
                required
                onChange={(e) => setGender(e.target.value)} 
                className="w-full h-14 px-5 bg-gray-900 border border-gray-800 rounded-xl text-gray-400 outline-none appearance-none focus:border-indigo-500"
              >
                <option  value="">Gender *</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>
          </div>

          {/* Visual Divider */}
          <div className="flex items-center gap-3 py-2">
            <div className="h-[1px] flex-1 bg-gray-800"></div>
            <span className="text-gray-600 text-[10px] font-bold uppercase tracking-widest whitespace-nowrap">
              Optional Physical Stats
            </span>
            <div className="h-[1px] flex-1 bg-gray-800"></div>
          </div>

          {/* Optional Fields */}
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-4">
              <input 
                onChange={(e) => setHeight(e.target.value)}
                type="number" 
                placeholder="Height (cm)" 
                className="w-full h-14 px-5 bg-gray-950 border border-gray-900 rounded-xl text-sm outline-none focus:border-indigo-500 transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" 
              />
              <input 
                type="number"
                onChange={(e) => setWeight(e.target.value)} 
                placeholder="Weight (kg)" 
                className="w-full h-14 px-5 bg-gray-950 border border-gray-900 rounded-xl text-sm outline-none focus:border-indigo-500 transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" 
              />
            </div>
            <input 
              type="text"
              onChange={(e) => setFrequency(e.target.value)}
              placeholder="Training Frequency (e.g. 4x week)" 
              className="w-full h-14 px-5 bg-gray-950 border border-gray-900 rounded-xl text-sm outline-none focus:border-indigo-500 transition-all" 
            />
          </div>

          <button 
          onClick={sumbitHandler}
            type="submit" 
            className="w-full h-16 bg-indigo-600 hover:bg-indigo-500 text-white font-black uppercase tracking-widest rounded-xl shadow-[0_10px_40px_rgba(79,70,229,0.3)] mt-4 transition-all active:scale-[0.98]"
          >
            Join Track Fit
          </button>
        </form>

        <p className="text-center text-gray-500 text-xs font-bold mt-10 uppercase tracking-tighter">
          Already have an account? 
          <Link to="/login-user" className="text-white hover:underline ml-2 transition-all">
            Log In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterUser;