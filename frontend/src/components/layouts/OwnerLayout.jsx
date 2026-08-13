import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiHome,
  FiUsers,
  FiUserPlus,
  FiLogOut,
  FiMenu,
  FiX,
  FiZap,
} from "react-icons/fi";

const NAV_ITEMS = [
  { label: "Dashboard", icon: FiHome, path: "/owner-dashboard" },
  { label: "Members", icon: FiUsers, path: "/owner/users" },
  { label: "Add Member", icon: FiUserPlus, path: "/owner/add-user" },
];

const OwnerLayout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await fetch("http://localhost:3000/api/gymOwner/logout", {
        method: "POST",
        credentials: "include",
      });
    } catch (_) {}
    localStorage.clear();
    navigate("/login-owner");
  };

  const isActive = (path) => location.pathname === path;

  return (
    <div className="flex h-screen bg-[#09090b] text-white overflow-hidden">
      {/* ── Desktop Sidebar ── */}
      <aside className="hidden md:flex flex-col w-64 bg-[#0d0d10] border-r border-white/5 shrink-0">
        <SidebarContent
          navItems={NAV_ITEMS}
          isActive={isActive}
          navigate={navigate}
          onLogout={handleLogout}
        />
      </aside>

      {/* ── Mobile overlay ── */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 md:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
            />
            <motion.aside
              className="fixed top-0 left-0 h-full w-64 bg-[#0d0d10] border-r border-white/5 z-50 flex flex-col md:hidden"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 220 }}
            >
              <SidebarContent
                navItems={NAV_ITEMS}
                isActive={isActive}
                navigate={navigate}
                onLogout={handleLogout}
                onClose={() => setMobileOpen(false)}
                mobile
              />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* ── Main content ── */}
      <div className="flex flex-col flex-1 min-w-0">
        {/* Mobile top bar */}
        <header className="flex md:hidden items-center gap-4 px-4 py-3 bg-[#0d0d10] border-b border-white/5">
          <button
            onClick={() => setMobileOpen(true)}
            className="text-gray-400 hover:text-white transition"
          >
            <FiMenu size={22} />
          </button>
          <span className="text-lg font-black italic">
            Track<span className="text-indigo-500">Fit</span>
          </span>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8">{children}</main>
      </div>
    </div>
  );
};

/* ── Sidebar inner content ── */
const SidebarContent = ({
  navItems,
  isActive,
  navigate,
  onLogout,
  onClose,
  mobile,
}) => (
  <div className="flex flex-col h-full p-5">
    {/* Logo */}
    <div className="flex items-center justify-between mb-8">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
          <FiZap size={16} className="text-white" />
        </div>
        <span className="text-lg font-black italic">
          Gym<span className="text-indigo-400">Owner</span>
        </span>
      </div>
      {mobile && (
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-white transition"
        >
          <FiX size={20} />
        </button>
      )}
    </div>

    {/* Nav label */}
    <p className="text-[10px] uppercase tracking-widest text-gray-600 mb-3 px-1">
      Navigation
    </p>

    {/* Nav items */}
    <nav className="flex flex-col gap-1 flex-1">
      {navItems.map(({ label, icon: Icon, path }) => {
        const active = isActive(path);
        return (
          <button
            key={path}
            onClick={() => {
              navigate(path);
              onClose?.();
            }}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 w-full text-left group ${
              active
                ? "bg-indigo-600/20 text-indigo-400 border border-indigo-600/30"
                : "text-gray-400 hover:bg-white/5 hover:text-white border border-transparent"
            }`}
          >
            <span
              className={`text-base ${active ? "text-indigo-400" : "text-gray-500 group-hover:text-gray-300"}`}
            >
              <Icon size={18} />
            </span>
            {label}
            {active && (
              <span className="ml-auto w-1.5 h-1.5 rounded-full bg-indigo-400" />
            )}
          </button>
        );
      })}
    </nav>

    {/* Logout */}
    <div className="border-t border-white/5 pt-4 mt-4">
      <button
        onClick={onLogout}
        className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-400 hover:bg-red-500/10 hover:text-red-400 transition-all duration-200 w-full border border-transparent hover:border-red-500/20"
      >
        <FiLogOut size={18} />
        Logout
      </button>
    </div>
  </div>
);

export default OwnerLayout;
