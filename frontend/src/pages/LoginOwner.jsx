import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
const LoginOwner = () => {
  const navigate = useNavigate()
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const sumbitHandler = async (e) => {
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
  }


  return (
    <div className="min-h-screen flex items-center justify-center bg-black p-6">
      <div className="max-w-md w-full bg-gray-950 border border-gray-900 p-10 rounded-[3rem] shadow-[0_0_60px_rgba(0,0,0,1)]">
        <div className="text-center mb-10">
          <h2 className="text-4xl font-black italic text-white uppercase tracking-tighter">Owner Login</h2>
          <p className="text-gray-600 text-[10px] font-bold uppercase tracking-[0.2em] mt-2">Manage your facility</p>
        </div>

        <form className="flex flex-col gap-6">
           <input 
           onChange={(e) => setEmail(e.target.value)}
           type="email" placeholder="Business Email" required className="w-full h-14 px-6 bg-transparent border border-gray-800 rounded-xl text-white focus:border-white transition-all outline-none" />
           <input
           onChange={(e) => setPassword(e.target.value)}
           type="password" placeholder="Password" required className="w-full h-14 px-6 bg-transparent border border-gray-800 rounded-xl text-white focus:border-white transition-all outline-none" />

          <button
          onClick={sumbitHandler}
          className="w-full h-14 bg-white text-black font-black uppercase tracking-widest rounded-xl hover:bg-gray-200 transition-all active:scale-[0.98]">
            Enter Dashboard
          </button>
        </form>

        <div className="mt-8 text-center px-4">
          <Link to="/register-owner" className="text-gray-500 text-[10px] font-bold uppercase hover:text-white transition-colors tracking-widest">Need to register your business?</Link>
        </div>
      </div>
    </div>
  );
};

export default LoginOwner;