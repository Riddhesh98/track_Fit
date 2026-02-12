import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';



const RegisterOwner = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const sumbitHandler = async (e) => {
    e.preventDefault();
   
    const data = {
      name,
      email,
      password,
    };

 

    try {
      const response = await axios.post(
        "http://localhost:3000/api/gymOwner/signup",
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
  }
  return (
    <div className="min-h-screen flex items-center justify-center bg-black p-6 text-white">
      <div className="max-w-md w-full bg-gray-900/20 border border-gray-800 p-10 rounded-[2.5rem] backdrop-blur-md">
        <h2 className="text-3xl font-black italic uppercase mb-2 text-white">Gym Owner</h2>
        <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest mb-10">Business Registration</p>
        
        <form className="flex flex-col gap-6">
          <input
            onChange={(e) => setName(e.target.value)}
          type="text" placeholder="Name" required className="w-full h-16 px-6 bg-gray-950 border border-gray-800 rounded-2xl focus:border-indigo-500 outline-none transition-all" />
          
          <input
            onChange={(e) => setEmail(e.target.value)}
          type="email" placeholder="Business Email" required className="w-full h-16 px-6 bg-gray-950 border border-gray-800 rounded-2xl focus:border-indigo-500 outline-none transition-all" />
        
          <input
            onChange={(e) => setPassword(e.target.value)}
          type="password" placeholder="Create Password" required className="w-full h-16 px-6 bg-gray-950 border border-gray-800 rounded-2xl focus:border-indigo-500 outline-none transition-all" />

          <button
          onClick={sumbitHandler}
          className="w-full h-16 bg-white text-black font-black uppercase tracking-widest rounded-2xl hover:bg-gray-200 mt-4 transition-all active:scale-[0.98]">
            Get Started
          </button>
        </form>
        <p className="text-center text-gray-600 mt-10 text-xs font-bold uppercase">Already Registered? <Link to="/login-owner" className="text-white hover:underline">Log In</Link></p>
      </div>
    </div>
  );
};

export default RegisterOwner;