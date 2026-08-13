import React from 'react';
import { Link } from 'react-router-dom';

const ChooseRegister = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-950 to-black p-6">
      <div className="max-w-md w-full bg-gray-900/30 border border-gray-800 backdrop-blur-xl rounded-[2.5rem] p-10 shadow-2xl text-center">
        <div className="mb-10">
          <h1 className="text-5xl font-black text-white italic tracking-tighter uppercase leading-none">
            Track <span className="text-indigo-500">Fit</span>
          </h1>
          <p className="text-gray-500 text-[10px] font-bold uppercase tracking-[0.3em] mt-3">Precision Fitness</p>
        </div>

        <div className="flex flex-col gap-5">
          <Link to="/register-user" className="group w-full py-6 bg-white rounded-2xl transition-all hover:scale-[1.02] active:scale-[0.98] flex flex-col items-center shadow-[0_0_20px_rgba(255,255,255,0.1)]">
            <span className="text-black font-black uppercase text-xl">Register as User</span>
            <span className="text-gray-400 text-[10px] font-bold uppercase">Start your tracking</span>
          </Link>

          <div className="flex items-center gap-4 py-2">
            <div className="h-[1px] flex-1 bg-gray-800"></div>
            <span className="text-gray-700 text-[10px] font-bold uppercase">OR</span>
            <div className="h-[1px] flex-1 bg-gray-800"></div>
          </div>

          <Link to="/register-owner" className="w-full py-6 bg-transparent border-2 border-gray-800 rounded-2xl transition-all hover:bg-gray-800 hover:border-gray-600 flex flex-col items-center">
            <span className="text-white font-black uppercase text-xl">Register as Owner</span>
            <span className="text-gray-500 text-[10px] font-bold uppercase tracking-tighter">Manage your Gym</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ChooseRegister;