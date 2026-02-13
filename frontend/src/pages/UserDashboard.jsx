import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiMenu, FiX } from "react-icons/fi";
import { MdOutlineRestaurant } from "react-icons/md";
import { Link, useNavigate } from 'react-router-dom';

const UserDashboard = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen bg-black text-white relative">

      {/* Top Navbar */}
      <div className="flex items-center p-4 border-b border-gray-800">
        <button
          onClick={() => setOpen(true)}
          className="text-2xl hover:text-indigo-400 transition"
        >
          <FiMenu />
        </button>

        <h1 className="ml-4 text-xl font-semibold tracking-wide">
          TrackFit
        </h1>
      </div>

      {/* Empty Dashboard Area */}
      <div className="p-6">
        <h2 className="text-2xl font-bold text-gray-300">
          Dashboard (Coming Soon)
        </h2>
      </div>

      {/* Overlay */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "tween", duration: 0.3 }}
            className="fixed top-0 left-0 h-full w-72 bg-gray-950 border-r border-gray-800 z-50 p-6"
          >
            {/* Close Button */}
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-xl font-bold">Menu</h2>
              <button
                onClick={() => setOpen(false)}
                className="text-2xl hover:text-red-400 transition"
              >
                <FiX />
              </button>
            </div>

            {/* Logo */}
            <div className="mb-10">
              <h1 className="text-2xl font-bold text-indigo-500">
                TF
              </h1>
              <p className="text-gray-400 text-sm">
                TrackFit App
              </p>
            </div>

            {/* Menu Items */}
            <div className="space-y-4">
              <button 
              //for navigation
              onClick={() =>{
                navigate("/nutrition");
                setOpen(false);
              }}
              className="flex items-center gap-3 w-full p-3 rounded-lg hover:bg-gray-800 transition">
                <MdOutlineRestaurant className="text-xl" />
                <span>Nutrition</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default UserDashboard;
