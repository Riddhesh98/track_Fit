import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const LoginUser = () => {
  const navigate=useNavigate()

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
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-black p-6">
      <div className="max-w-md w-full">
        <div className="text-center mb-12">
          <h2 className="text-5xl font-black italic text-white uppercase tracking-tighter">Welcome</h2>
          <p className="text-gray-500 text-[10px] font-bold uppercase tracking-[0.4em] mt-3">Athlete Portal</p>
        </div>

        <form className="flex flex-col gap-5">
           <input 
           onChange={(e) => setEmail(e.target.value)}
           type="email" placeholder="Email Address" required className="w-full h-16 px-6 bg-gray-900 border-2 border-gray-800 rounded-2xl text-white focus:border-indigo-500 outline-none transition-all" />
           
           
           <input
            onChange={(e) => setPassword(e.target.value)}
           type="password" placeholder="Password" required className="w-full h-16 px-6 bg-gray-900 border-2 border-gray-800 rounded-2xl text-white focus:border-indigo-500 outline-none transition-all" />

          <button
            onClick={sumbitHandler}
          className="w-full h-16 bg-indigo-600 text-white font-black uppercase tracking-widest rounded-2xl hover:bg-indigo-500 shadow-2xl transition-all">
            Sign In
          </button>
        </form>

        <div className="mt-10 flex justify-between items-center px-4">
          <Link to="/" className="text-gray-600 text-[10px] font-bold uppercase hover:text-white">← Home</Link>
          <Link to="/register-user" className="text-indigo-400 text-[10px] font-bold uppercase hover:text-indigo-300 transition-colors">Register Account</Link>
        </div>
      </div>
    </div>
  );
};

export default LoginUser;