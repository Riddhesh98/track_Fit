import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";
import {
  FiUsers,
  FiCheckCircle,
  FiXCircle,
  FiClock,
  FiEye,
  FiCreditCard,
  FiSearch,
  FiRefreshCw,
  FiAlertCircle,
} from "react-icons/fi";
import OwnerLayout from "../../components/layouts/OwnerLayout";

/* ── Status Badge ── */
const StatusBadge = ({ status }) => {
  const config = {
    active: {
      label: "Active",
      cls: "bg-emerald-500/15 text-emerald-400 border-emerald-500/25",
      dot: "bg-emerald-400",
    },
    expired: {
      label: "Expired",
      cls: "bg-red-500/15 text-red-400 border-red-500/25",
      dot: "bg-red-400",
    },
    pending: {
      label: "Pending",
      cls: "bg-amber-500/15 text-amber-400 border-amber-500/25",
      dot: "bg-amber-400",
    },
    rejected: {
      label: "Rejected",
      cls: "bg-gray-500/15 text-gray-400 border-gray-500/25",
      dot: "bg-gray-400",
    },
  };
  const { label, cls, dot } = config[status] ?? config.pending;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${cls}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dot} animate-pulse`} />
      {label}
    </span>
  );
};

/* ── Stat Card ── */
const StatCard = ({ icon: Icon, label, value, color, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    className="bg-[#111114] border border-white/5 rounded-2xl p-5 flex items-center gap-4 hover:border-white/10 transition-all duration-300 group"
  >
    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color} shrink-0 group-hover:scale-110 transition-transform`}>
      <Icon size={22} className="text-white" />
    </div>
    <div>
      <p className="text-gray-500 text-xs font-medium uppercase tracking-wide">{label}</p>
      <p className="text-3xl font-black text-white mt-0.5">{value}</p>
    </div>
  </motion.div>
);

/* ── Main Component ── */
const OwnerDashboard = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get("http://localhost:3000/api/gymOwner/my-users", { withCredentials: true });
      setUsers(response.data.users || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filtered = users.filter((u) => {
    const matchSearch =
      u.name?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "all" || u.subStatus === filter;
    return matchSearch && matchFilter;
  });

  const stats = {
    total: users.length,
    active: users.filter((u) => u.subStatus === "active").length,
    expired: users.filter((u) => u.subStatus === "expired").length,
    pending: users.filter((u) => u.subStatus === "pending").length,
  };

  return (
    <OwnerLayout>
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-2xl font-black text-white">Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">Welcome back! Here's your gym overview.</p>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard icon={FiUsers} label="Total Members" value={loading ? "—" : stats.total} color="bg-indigo-600" delay={0.05} />
        <StatCard icon={FiCheckCircle} label="Active Subs" value={loading ? "—" : stats.active} color="bg-emerald-600" delay={0.1} />
        <StatCard icon={FiXCircle} label="Expired Subs" value={loading ? "—" : stats.expired} color="bg-red-600" delay={0.15} />
        <StatCard icon={FiClock} label="Pending" value={loading ? "—" : stats.pending} color="bg-amber-600" delay={0.2} />
      </div>

      {/* Table card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="bg-[#111114] border border-white/5 rounded-2xl overflow-hidden"
      >
        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 p-5 border-b border-white/5">
          <h2 className="text-sm font-semibold text-white flex-1">All Members</h2>
          <div className="relative">
            <FiSearch size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              placeholder="Search members..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-white/5 border border-white/8 rounded-lg pl-8 pr-3 py-2 text-sm text-gray-300 placeholder-gray-600 focus:outline-none focus:border-indigo-500/50 transition w-48"
            />
          </div>
          <div className="flex gap-1 bg-white/5 rounded-lg p-1">
            {["all", "active", "expired", "pending"].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1 rounded-md text-xs font-medium capitalize transition ${filter === f ? "bg-indigo-600 text-white" : "text-gray-400 hover:text-white"}`}
              >
                {f}
              </button>
            ))}
          </div>
          <button onClick={fetchUsers} className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition">
            <FiRefreshCw size={14} />
          </button>
        </div>

        {/* States */}
        {loading ? (
          <div className="flex items-center justify-center py-20 gap-3 text-gray-500">
            <FiRefreshCw size={20} className="animate-spin" />
            <span className="text-sm">Loading members...</span>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <FiAlertCircle size={28} className="text-red-400 mb-3" />
            <p className="text-gray-400 font-medium">Failed to load members</p>
            <p className="text-gray-600 text-sm mt-1">{error}</p>
            <button onClick={fetchUsers} className="mt-4 px-4 py-2 bg-indigo-600 text-white text-sm rounded-xl hover:bg-indigo-500 transition">
              Retry
            </button>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center mb-4">
              <FiUsers size={24} className="text-gray-600" />
            </div>
            <p className="text-gray-400 font-medium">
              {users.length === 0 ? "No members yet" : "No members found"}
            </p>
            <p className="text-gray-600 text-sm mt-1">
              {users.length === 0 ? "Send a request to add your first member" : "Try adjusting your search or filter"}
            </p>
            {users.length === 0 && (
              <button
                onClick={() => navigate("/owner/add-user")}
                className="mt-4 px-4 py-2 bg-indigo-600 text-white text-sm rounded-xl hover:bg-indigo-500 transition"
              >
                Add Member
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/5">
                  {["Name", "Email", "Status", "Days Left", "Actions"].map((h) => (
                    <th key={h} className="text-left text-[11px] uppercase tracking-widest text-gray-600 px-5 py-3 font-semibold">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.03]">
                {filtered.map((user, i) => (
                  <motion.tr
                    key={user._id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04 }}
                    className="hover:bg-white/[0.02] transition"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-indigo-600/20 border border-indigo-600/30 flex items-center justify-center text-indigo-400 text-xs font-bold shrink-0">
                          {user.name?.charAt(0).toUpperCase()}
                        </div>
                        <span className="text-sm font-medium text-white">{user.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-sm text-gray-400">{user.email}</td>
                    <td className="px-5 py-4">
                      <StatusBadge status={user.subStatus} />
                    </td>
                    <td className="px-5 py-4">
                      {user.daysLeft !== null ? (
                        <span className={`text-sm font-semibold ${user.daysLeft <= 3 ? "text-red-400" : user.daysLeft <= 7 ? "text-amber-400" : "text-white"}`}>
                          {user.daysLeft} <span className="text-gray-600 font-normal">days</span>
                        </span>
                      ) : (
                        <span className="text-gray-600 text-sm">—</span>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => navigate(`/owner/users/${user._id}`)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-white/5 text-gray-400 border border-white/8 hover:bg-white/10 hover:text-white transition"
                        >
                          <FiEye size={13} /> View
                        </button>
                        <button
                          onClick={() => navigate(`/owner/subscription/${user._id}`)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-indigo-600/20 text-indigo-400 border border-indigo-600/30 hover:bg-indigo-600 hover:text-white transition"
                        >
                          <FiCreditCard size={13} /> Subscribe
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>
    </OwnerLayout>
  );
};

export { OwnerDashboard };
export default OwnerDashboard;
