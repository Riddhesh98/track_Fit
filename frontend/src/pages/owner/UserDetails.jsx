import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";
import {
  FiArrowLeft,
  FiUser,
  FiClock,
  FiDollarSign,
  FiTrendingUp,
  FiZap,
  FiActivity,
  FiRefreshCw,
  FiAlertCircle,
  FiCreditCard,
  FiTrash2,
} from "react-icons/fi";
import OwnerLayout from "../../components/layouts/OwnerLayout";

/* ── Section card wrapper ── */
const Section = ({ title, icon: Icon, children, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    className="bg-[#111114] border border-white/5 rounded-2xl p-5"
  >
    <div className="flex items-center gap-2 mb-4">
      <Icon size={16} className="text-indigo-400" />
      <h3 className="text-sm font-semibold text-white">{title}</h3>
    </div>
    {children}
  </motion.div>
);

/* ── Info row ── */
const InfoRow = ({ label, value }) => (
  <div className="flex justify-between items-center py-2 border-b border-white/[0.04] last:border-0">
    <span className="text-xs text-gray-500 uppercase tracking-wide">{label}</span>
    <span className="text-sm font-medium text-white">{value ?? "—"}</span>
  </div>
);

/* ── Status badge ── */
const StatusBadge = ({ status }) => {
  const map = {
    active: "bg-emerald-500/15 text-emerald-400 border-emerald-500/25",
    expired: "bg-red-500/15 text-red-400 border-red-500/25",
    pending: "bg-amber-500/15 text-amber-400 border-amber-500/25",
    approved: "bg-emerald-500/15 text-emerald-400 border-emerald-500/25",
    none: "bg-gray-500/15 text-gray-400 border-gray-500/25",
  };
  return (
    <span
      className={`px-2.5 py-1 rounded-full text-xs font-medium border capitalize ${
        map[status] ?? map.pending
      }`}
    >
      {status}
    </span>
  );
};

/* ── Main ── */
const UserDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [removing, setRemoving] = useState(false);

  const fetchDetails = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`http://localhost:3000/api/gymOwner/user/${id}`, { withCredentials: true });
      setData(response.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async () => {
    if (!window.confirm(`Remove ${data?.user?.name} from your gym? This will delete their subscription records too.`)) return;
    setRemoving(true);
    try {
      await axios.delete(`http://localhost:3000/api/gymOwner/user/${id}`, { withCredentials: true });
      navigate("/owner/users");
    } catch (err) {
      alert(err.message);
      setRemoving(false);
    }
  };

  useEffect(() => {
    fetchDetails();
  }, [id]);

  const user = data?.user;
  const sub = data?.subscription;
  const linkStatus = data?.linkStatus;

  const fmtDate = (d) =>
    d
      ? new Date(d).toLocaleDateString("en-IN", {
          day: "numeric",
          month: "short",
          year: "numeric",
        })
      : "—";

  return (
    <OwnerLayout>
      {/* Back */}
      <button
        onClick={() => navigate("/owner/users")}
        className="flex items-center gap-2 text-gray-400 hover:text-white transition text-sm mb-6"
      >
        <FiArrowLeft size={16} />
        Back to Members
      </button>

      {loading ? (
        <div className="flex items-center justify-center py-32 gap-3 text-gray-500">
          <FiRefreshCw size={20} className="animate-spin" />
          <span className="text-sm">Loading member details...</span>
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center py-32 text-center">
          <FiAlertCircle size={28} className="text-red-400 mb-3" />
          <p className="text-gray-400 font-medium">Failed to load member</p>
          <p className="text-gray-600 text-sm mt-1">{error}</p>
          <button
            onClick={fetchDetails}
            className="mt-4 px-4 py-2 bg-indigo-600 text-white text-sm rounded-xl hover:bg-indigo-500 transition"
          >
            Retry
          </button>
        </div>
      ) : !user ? (
        <div className="flex flex-col items-center justify-center py-32 text-center">
          <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center mb-4">
            <FiUser size={24} className="text-gray-600" />
          </div>
          <p className="text-gray-400 font-medium">Member not found</p>
          <p className="text-gray-600 text-sm mt-1">
            This member is not linked to your gym
          </p>
        </div>
      ) : (
        <div className="space-y-5">
          {/* Profile Header */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#111114] border border-white/5 rounded-2xl p-5 flex items-center gap-5"
          >
            <div className="w-16 h-16 rounded-2xl bg-indigo-600/20 border border-indigo-600/30 flex items-center justify-center text-indigo-400 text-2xl font-black shrink-0">
              {user.name?.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-xl font-black text-white">{user.name}</h1>
              <p className="text-gray-400 text-sm mt-0.5">{user.email}</p>
              <div className="flex items-center gap-3 mt-2">
                <StatusBadge status={sub ? sub.status : "none"} />
                {user.age && (
                  <span className="text-gray-600 text-xs">Age {user.age}</span>
                )}
                {user.gender && (
                  <span className="text-gray-600 text-xs capitalize">
                    {user.gender}
                  </span>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => navigate(`/owner/subscription/${user._id}`)}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium rounded-xl transition shrink-0"
              >
                <FiCreditCard size={14} />
                {sub ? "Renew Plan" : "Create Plan"}
              </button>
              <button
                onClick={handleRemove}
                disabled={removing}
                className="flex items-center gap-2 px-4 py-2 bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white border border-red-500/20 hover:border-red-500 text-sm font-medium rounded-xl transition shrink-0 disabled:opacity-40"
              >
                <FiTrash2 size={14} />
                {removing ? "Removing..." : "Remove"}
              </button>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {/* Subscription Details */}
            <Section title="Subscription" icon={FiDollarSign} delay={0.1}>
              {sub ? (
                <>
                  <InfoRow label="Fee" value={`₹${sub.fee}`} />
                  <InfoRow label="Start Date" value={fmtDate(sub.startDate)} />
                  <InfoRow label="End Date" value={fmtDate(sub.endDate)} />
                  <InfoRow
                    label="Days Left"
                    value={
                      <span
                        className={
                          sub.daysLeft <= 5
                            ? "text-red-400 font-bold"
                            : "text-emerald-400 font-bold"
                        }
                      >
                        {sub.daysLeft} days
                      </span>
                    }
                  />
                  <InfoRow label="Status" value={<StatusBadge status={sub.status} />} />
                </>
              ) : (
                <div className="flex flex-col items-center py-6 text-center text-gray-600">
                  <FiCreditCard size={24} className="mb-2" />
                  <p className="text-sm">No subscription yet</p>
                  <button
                    onClick={() => navigate(`/owner/subscription/${user._id}`)}
                    className="mt-3 px-4 py-1.5 text-xs bg-indigo-600/20 text-indigo-400 border border-indigo-600/30 rounded-lg hover:bg-indigo-600 hover:text-white transition"
                  >
                    Create Plan
                  </button>
                </div>
              )}
            </Section>

            {/* Member Info */}
            <Section title="Member Info" icon={FiActivity} delay={0.15}>
              <InfoRow label="Name" value={user.name} />
              <InfoRow label="Email" value={user.email} />
              <InfoRow label="Age" value={user.age ? `${user.age} yrs` : null} />
              <InfoRow label="Gender" value={user.gender} />
              <InfoRow
                label="Link Status"
                value={<StatusBadge status={linkStatus} />}
              />
            </Section>

            {/* Quick Stats */}
            <Section title="Body Stats" icon={FiTrendingUp} delay={0.2}>
              <InfoRow
                label="Height"
                value={user.height ? `${user.height} cm` : null}
              />
              <InfoRow
                label="Weight"
                value={user.weight ? `${user.weight} kg` : null}
              />
              <InfoRow
                label="Frequency"
                value={
                  user.frequency
                    ? `${user.frequency}x / week`
                    : null
                }
              />
            </Section>
          </div>

          {/* Subscription Timeline */}
          {sub && (
            <Section title="Subscription Timeline" icon={FiClock} delay={0.25}>
              <div className="relative pt-2 pb-1">
                {/* progress bar */}
                {(() => {
                  const total =
                    new Date(sub.endDate) - new Date(sub.startDate);
                  const elapsed = new Date() - new Date(sub.startDate);
                  const pct = Math.min(
                    100,
                    Math.max(0, Math.round((elapsed / total) * 100))
                  );
                  return (
                    <>
                      <div className="flex justify-between text-xs text-gray-500 mb-2">
                        <span>{fmtDate(sub.startDate)}</span>
                        <span
                          className={
                            sub.daysLeft <= 5
                              ? "text-red-400"
                              : "text-emerald-400"
                          }
                        >
                          {sub.daysLeft} days left
                        </span>
                        <span>{fmtDate(sub.endDate)}</span>
                      </div>
                      <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${
                            sub.daysLeft <= 5
                              ? "bg-red-500"
                              : sub.daysLeft <= 10
                              ? "bg-amber-500"
                              : "bg-indigo-500"
                          }`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <p className="text-xs text-gray-600 mt-1.5">
                        {pct}% of plan used
                      </p>
                    </>
                  );
                })()}
              </div>
            </Section>
          )}
        </div>
      )}
    </OwnerLayout>
  );
};

export default UserDetails;
