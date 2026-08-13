import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Input from "../ui/Input";

// Icons
import {
  FiMenu,
  FiX,
  FiHome,
  FiTrendingUp,
  FiAward,
  FiZap,
  FiUser,
  FiLogOut,
} from "react-icons/fi";
import { MdOutlineRestaurant } from "react-icons/md";

const UserLayout = ({ children, active }) => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const handleNav = (path) => {
    navigate(path);
    setOpen(false);
  };

  const handleLogout = async () => {
    try {
      await fetch("http://localhost:3000/api/users/logout", {
        method: "POST",
        credentials: "include",
      });
    } catch (_) {}
    localStorage.clear();
    navigate("/login-user");
  };

  return (
    <div className="min-h-screen bg-black text-white relative">

      {/* Top Navbar */}
      <div className="flex items-center p-4 border-b border-gray-800 bg-black/50 backdrop-blur-md sticky top-0 z-30">
        <button
          onClick={() => setOpen(true)}
          className="text-2xl hover:text-indigo-400 transition"
        >
          <FiMenu />
        </button>

        <h1 className="ml-4 text-xl font-bold italic">
          Track<span className="text-indigo-500">Fit</span>
        </h1>
      </div>

      {/* Page Content */}
      <main>{children}</main>

      {/* Overlay */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40"
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
          <motion.aside
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-0 left-0 h-full w-72 bg-[#09090b] border-r border-gray-800 z-50 p-6 flex flex-col"
          >
            {/* Header */}
            <div className="flex justify-between items-center mb-10">
              <h1 className="text-2xl font-black italic">
                TF<span className="text-indigo-500">.</span>
              </h1>
              <button
                onClick={() => setOpen(false)}
                className="text-2xl text-gray-400 hover:text-white"
              >
                <FiX />
              </button>
            </div>

            {/* Menu */}
            <div className="space-y-2 flex-1">
              <MenuItem
                icon={<FiHome />}
                label="Dashboard"
                active={active === "dashboard"}
                onClick={() => handleNav("/user-dashboard")}
              />

              <MenuItem
                icon={<MdOutlineRestaurant />}
                label="Nutrition"
                active={active === "nutrition"}
                onClick={() => handleNav("/nutrition")}
              />

              <MenuItem
                icon={<FiTrendingUp />}
                label="Weight Track"
                active={active === "weight"}
                onClick={() => handleNav("/weight")}
              />

              <MenuItem
                icon={<FiAward />}
                label="PR Track"
                active={active === "pr"}
                onClick={() => handleNav("/pr")}
              />

              {/* Coming soon */}
              <MenuItem
                icon={<FiZap />}
                label="AI Coach"
                active={active === "ai-coach"}
                onClick={() => handleNav("/ai-coach")}
              />


            </div>

            {/* Bottom */}
            <div className="border-t border-gray-800 pt-6 space-y-1">
              <MenuItem
                icon={<FiUser />}
                label="My Profile"
                active={active === "profile"}
                onClick={() => handleNav("/profile")}
              />
              <button
                onClick={handleLogout}
                className="flex items-center gap-4 w-full p-3 rounded-xl transition text-gray-400 hover:bg-red-500/10 hover:text-red-400"
              >
                <span className="text-xl"><FiLogOut /></span>
                <span>Logout</span>
              </button>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </div>
  );
};

const MenuItem = ({ icon, label, onClick, active }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-4 w-full p-3 rounded-xl transition ${
      active
        ? "bg-indigo-600 text-white"
        : "text-gray-400 hover:bg-white/5 hover:text-white"
    }`}
  >
    <span className="text-xl">{icon}</span>
    <span>{label}</span>
  </button>
);

export default UserLayout;
