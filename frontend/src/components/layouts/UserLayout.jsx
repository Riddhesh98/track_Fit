import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

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
  FiChevronRight,
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
    <div className="min-h-screen bg-[#f4f5f7] text-gray-900 relative font-sans selection:bg-gray-900 selection:text-white">
      {/* Top Navbar */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-xs">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Hamburger Button (Visible on screens < lg / 1024px) */}
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="p-2 text-gray-800 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors lg:hidden focus:outline-none border border-gray-200 shrink-0"
              aria-label="Open Navigation Menu"
            >
              <FiMenu size={22} />
            </button>

            {/* Brand Logo Header */}
            <div
              onClick={() => navigate("/user-dashboard")}
              className="cursor-pointer flex items-center gap-2.5 select-none group"
            >
              <div className="w-8.5 h-8.5 rounded-lg bg-orange-600 flex items-center justify-center font-black text-white text-xs tracking-tighter shadow-sm border border-orange-700 shrink-0 group-hover:bg-orange-700 transition-colors">
                <svg className="w-5 h-5 text-white fill-current" viewBox="0 0 24 24">
                  <path d="M4 4h16v3H13.5v13h-3.5V7H4V4zm10.5 6.5H20v3h-5.5v-3z" />
                </svg>
              </div>
              <span className="text-xl font-black tracking-tight text-gray-900 uppercase">
                TRACK<span className="text-orange-600">FIT</span>
              </span>
            </div>
          </div>

          {/* Desktop Links (Visible on screens >= lg / 1024px) */}
          <nav className="hidden lg:flex items-center gap-1">
            <NavIconButton
              icon={<FiHome size={15} />}
              label="Dashboard"
              active={active === "dashboard"}
              onClick={() => handleNav("/user-dashboard")}
            />
            <NavIconButton
              icon={<MdOutlineRestaurant size={15} />}
              label="Nutrition"
              active={active === "nutrition"}
              onClick={() => handleNav("/nutrition")}
            />
            <NavIconButton
              icon={<FiTrendingUp size={15} />}
              label="Weight"
              active={active === "weight"}
              onClick={() => handleNav("/weight")}
            />
            <NavIconButton
              icon={<FiAward size={15} />}
              label="PR Lifts"
              active={active === "pr"}
              onClick={() => handleNav("/pr")}
            />
            <NavIconButton
              icon={<FiZap size={15} />}
              label="AI Coach"
              active={active === "ai-coach"}
              onClick={() => handleNav("/ai-coach")}
            />
          </nav>

          {/* Profile Shortcut Button */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleNav("/profile")}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-all text-xs font-bold ${
                active === "profile"
                  ? "bg-gray-900 text-white border-gray-900"
                  : "bg-white border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50"
              }`}
              title="Profile Settings"
            >
              <FiUser size={15} />
              <span className="hidden sm:inline">Profile</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Page Body */}
      <main className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {children}
      </main>

      {/* Mobile & Tablet Drawer Modal */}
      <AnimatePresence>
        {open && (
          <div className="fixed inset-0 z-50 lg:hidden">
            {/* Backdrop Blur */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm"
              onClick={() => setOpen(false)}
            />

            {/* Mobile Drawer Panel */}
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 260 }}
              className="fixed top-0 left-0 bottom-0 w-80 max-w-[85vw] bg-white border-r border-gray-200 shadow-2xl p-6 flex flex-col justify-between overflow-y-auto"
            >
              <div>
                {/* Drawer Header */}
                <div className="flex justify-between items-center pb-5 border-b border-gray-100 mb-6">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8.5 h-8.5 rounded-lg bg-orange-600 flex items-center justify-center font-black text-white text-xs shadow-sm border border-orange-700 shrink-0">
                      <svg className="w-5 h-5 text-white fill-current" viewBox="0 0 24 24">
                        <path d="M4 4h16v3H13.5v13h-3.5V7H4V4zm10.5 6.5H20v3h-5.5v-3z" />
                      </svg>
                    </div>
                    <div>
                      <h2 className="text-base font-black tracking-tight uppercase text-gray-900">
                        TRACK<span className="text-orange-600">FIT</span>
                      </h2>
                      <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                        Fitness & Performance Analytics
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    className="p-2 text-gray-500 hover:text-gray-900 rounded-lg hover:bg-gray-100 border border-gray-200"
                    aria-label="Close Navigation"
                  >
                    <FiX size={18} />
                  </button>
                </div>

                {/* Drawer Menu Navigation */}
                <div className="space-y-1">
                  <MenuItem
                    icon={<FiHome size={17} />}
                    label="Dashboard"
                    active={active === "dashboard"}
                    onClick={() => handleNav("/user-dashboard")}
                  />
                  <MenuItem
                    icon={<MdOutlineRestaurant size={17} />}
                    label="Nutrition & Macros"
                    active={active === "nutrition"}
                    onClick={() => handleNav("/nutrition")}
                  />
                  <MenuItem
                    icon={<FiTrendingUp size={17} />}
                    label="Weight Analytics"
                    active={active === "weight"}
                    onClick={() => handleNav("/weight")}
                  />
                  <MenuItem
                    icon={<FiAward size={17} />}
                    label="Personal Best PRs"
                    active={active === "pr"}
                    onClick={() => handleNav("/pr")}
                  />
                  <MenuItem
                    icon={<FiZap size={17} />}
                    label="AI Coach"
                    active={active === "ai-coach"}
                    onClick={() => handleNav("/ai-coach")}
                  />
                </div>
              </div>

              {/* Bottom Drawer Actions */}
              <div className="pt-5 border-t border-gray-100 space-y-2 mt-6">
                <MenuItem
                  icon={<FiUser size={17} />}
                  label="Athlete Profile"
                  active={active === "profile"}
                  onClick={() => handleNav("/profile")}
                />
                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex items-center justify-between w-full px-3.5 py-2.5 rounded-lg transition-colors text-rose-700 hover:bg-rose-50 border border-rose-200 font-bold text-xs uppercase tracking-wider"
                >
                  <span className="flex items-center gap-2.5">
                    <FiLogOut size={16} /> Sign Out
                  </span>
                  <FiChevronRight size={14} />
                </button>
              </div>
            </motion.aside>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

const NavIconButton = ({ icon, label, onClick, active }) => (
  <button
    type="button"
    onClick={onClick}
    className={`flex items-center gap-2 px-3 py-2 rounded-lg font-bold text-xs transition-all ${
      active
        ? "bg-gray-900 text-white shadow-xs"
        : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
    }`}
  >
    {icon}
    <span>{label}</span>
  </button>
);

const MenuItem = ({ icon, label, onClick, active }) => (
  <button
    type="button"
    onClick={onClick}
    className={`flex items-center justify-between w-full px-3.5 py-2.5 rounded-lg transition-all font-bold text-xs uppercase tracking-wider ${
      active
        ? "bg-gray-900 text-white"
        : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
    }`}
  >
    <span className="flex items-center gap-3">
      {icon}
      <span>{label}</span>
    </span>
    <FiChevronRight size={14} className={active ? "text-white" : "text-gray-400"} />
  </button>
);

export default UserLayout;
