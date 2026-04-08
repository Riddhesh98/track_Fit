import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiCreditCard,
  FiDollarSign,
  FiCalendar,
  FiCheckCircle,
  FiArrowLeft,
  FiChevronDown,
  FiAlertCircle,
} from "react-icons/fi";
import OwnerLayout from "../components/OwnerLayout";
import { ownerFetch } from "../api/ownerApi";

const DURATION_PRESETS = [
  { label: "1 Month", days: 30 },
  { label: "3 Months", days: 90 },
  { label: "6 Months", days: 180 },
  { label: "1 Year", days: 365 },
];

const OwnerSubscription = () => {
  const { userId } = useParams();
  const navigate = useNavigate();

  // If no userId in URL, we load the linked-users list for a picker
  const [linkedUsers, setLinkedUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(userId || "");
  const [loadingUsers, setLoadingUsers] = useState(!userId);

  const [fee, setFee] = useState("");
  const [duration, setDuration] = useState("");
  const [unit, setUnit] = useState("days");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [errors, setErrors] = useState({});

  const durationInDays =
    unit === "months" ? Number(duration) * 30 : Number(duration);

  const endDate = () => {
    if (!duration) return "—";
    const d = new Date();
    d.setDate(d.getDate() + durationInDays);
    return d.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  // Fetch linked/approved users if no userId in URL
  useEffect(() => {
    if (!userId) {
      setLoadingUsers(true);
      ownerFetch("/gymOwner/my-users")
        .then((data) => {
          const approved = (data.users || []).filter(
            (u) => u.linkStatus === "approved"
          );
          setLinkedUsers(approved);
        })
        .catch(() => setLinkedUsers([]))
        .finally(() => setLoadingUsers(false));
    }
  }, [userId]);

  const validate = () => {
    const e = {};
    if (!selectedUserId) e.user = "Select a member";
    if (!fee || isNaN(fee) || Number(fee) <= 0) e.fee = "Enter a valid fee";
    if (!duration || isNaN(duration) || Number(duration) <= 0)
      e.duration = "Enter a valid duration";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setError("");

    try {
      await ownerFetch("/gymOwner/subscription", {
        method: "POST",
        body: JSON.stringify({
          userId: selectedUserId,
          fee: Number(fee),
          durationDays: durationInDays,
        }),
      });
      setSuccess(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setFee("");
    setDuration("");
    setUnit("days");
    setErrors({});
    setError("");
    setSuccess(false);
    if (!userId) setSelectedUserId("");
  };

  const selectedUserName = linkedUsers.find((u) => u._id === selectedUserId)?.name || "";

  return (
    <OwnerLayout>
      {userId && (
        <button
          onClick={() => navigate(`/owner/users/${userId}`)}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition text-sm mb-6"
        >
          <FiArrowLeft size={16} />
          Back to User
        </button>
      )}

      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-2xl font-black text-white">
          {userId ? "Renew Subscription" : "Create Subscription"}
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          {userId
            ? "Update the subscription plan for this member"
            : "Select a member and set up their subscription plan"}
        </p>
      </motion.div>

      <div className="max-w-xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-[#111114] border border-white/5 rounded-2xl p-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-indigo-600/20 border border-indigo-600/30 rounded-xl flex items-center justify-center">
              <FiCreditCard size={18} className="text-indigo-400" />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">
                Subscription Details
              </p>
              <p className="text-xs text-gray-500">
                Define fee and duration for the plan
              </p>
            </div>
          </div>

          <AnimatePresence mode="wait">
            {success ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="flex flex-col items-center py-8 text-center"
              >
                <div className="w-16 h-16 bg-emerald-500/20 border border-emerald-500/30 rounded-2xl flex items-center justify-center mb-4">
                  <FiCheckCircle size={32} className="text-emerald-400" />
                </div>
                <p className="text-white font-bold text-xl">
                  Subscription Created!
                </p>
                <p className="text-gray-500 text-sm mt-2">
                  ₹{fee} plan active for{" "}
                  {unit === "months" ? `${duration} month(s)` : `${duration} days`}
                </p>
                <p className="text-gray-600 text-xs mt-1">
                  Expires on {endDate()}
                </p>
                <div className="flex gap-3 mt-6">
                  <button
                    onClick={reset}
                    className="px-5 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 text-sm rounded-xl transition"
                  >
                    Create Another
                  </button>
                  <button
                    onClick={() => navigate("/owner/users")}
                    className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium rounded-xl transition"
                  >
                    View Members
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                onSubmit={handleSubmit}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-5"
              >
                {/* Member picker — only shown when no userId in URL */}
                {!userId && (
                  <div>
                    <label className="block text-xs text-gray-500 mb-1.5 uppercase tracking-wide font-medium">
                      Select Member
                    </label>
                    {loadingUsers ? (
                      <div className="flex items-center gap-2 py-3 text-gray-500 text-sm">
                        <div className="w-4 h-4 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                        Loading members...
                      </div>
                    ) : linkedUsers.length === 0 ? (
                      <p className="text-amber-400 text-xs bg-amber-500/10 border border-amber-500/20 rounded-xl px-4 py-3">
                        No approved members yet. Add a member first from the "Add Member" page.
                      </p>
                    ) : (
                      <div className="relative">
                        <select
                          value={selectedUserId}
                          onChange={(e) => {
                            setSelectedUserId(e.target.value);
                            setErrors((p) => ({ ...p, user: undefined }));
                          }}
                          className={`w-full appearance-none bg-white/5 border rounded-xl px-4 py-3 text-sm text-white focus:outline-none transition ${
                            errors.user
                              ? "border-red-500/50"
                              : "border-white/8 focus:border-indigo-500/60"
                          }`}
                        >
                          <option value="" className="bg-[#111114] text-gray-400">
                            — Choose a member —
                          </option>
                          {linkedUsers.map((u) => (
                            <option
                              key={u._id}
                              value={u._id}
                              className="bg-[#111114] text-white"
                            >
                              {u.name} ({u.email})
                            </option>
                          ))}
                        </select>
                        <FiChevronDown
                          size={15}
                          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
                        />
                      </div>
                    )}
                    {errors.user && (
                      <p className="text-red-400 text-xs mt-1">{errors.user}</p>
                    )}
                  </div>
                )}

                {/* Fee */}
                <div>
                  <label className="block text-xs text-gray-500 mb-1.5 uppercase tracking-wide font-medium">
                    Membership Fee (₹)
                  </label>
                  <div className="relative">
                    <FiDollarSign
                      size={15}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500"
                    />
                    <input
                      type="number"
                      value={fee}
                      onChange={(e) => {
                        setFee(e.target.value);
                        setErrors((p) => ({ ...p, fee: undefined }));
                      }}
                      placeholder="e.g. 1500"
                      className={`w-full bg-white/5 border rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none transition no-spinner ${
                        errors.fee
                          ? "border-red-500/50 focus:border-red-500"
                          : "border-white/8 focus:border-indigo-500/60 focus:bg-indigo-500/5"
                      }`}
                    />
                  </div>
                  {errors.fee && (
                    <p className="text-red-400 text-xs mt-1">{errors.fee}</p>
                  )}
                </div>

                {/* Quick duration presets */}
                <div>
                  <label className="block text-xs text-gray-500 mb-2 uppercase tracking-wide font-medium">
                    Quick Presets
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {DURATION_PRESETS.map((p) => (
                      <button
                        type="button"
                        key={p.label}
                        onClick={() => {
                          setDuration(p.days);
                          setUnit("days");
                          setErrors((e) => ({ ...e, duration: undefined }));
                        }}
                        className={`py-2 rounded-xl text-xs font-medium border transition ${
                          String(duration) === String(p.days) && unit === "days"
                            ? "bg-indigo-600/20 text-indigo-400 border-indigo-600/30"
                            : "bg-white/5 text-gray-400 border-white/8 hover:bg-white/10 hover:text-white"
                        }`}
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Custom Duration */}
                <div>
                  <label className="block text-xs text-gray-500 mb-1.5 uppercase tracking-wide font-medium">
                    Custom Duration
                  </label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <FiCalendar
                        size={15}
                        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500"
                      />
                      <input
                        type="number"
                        value={duration}
                        onChange={(e) => {
                          setDuration(e.target.value);
                          setErrors((p) => ({ ...p, duration: undefined }));
                        }}
                        placeholder="e.g. 30"
                        className={`w-full bg-white/5 border rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none transition no-spinner ${
                          errors.duration
                            ? "border-red-500/50 focus:border-red-500"
                            : "border-white/8 focus:border-indigo-500/60 focus:bg-indigo-500/5"
                        }`}
                      />
                    </div>
                    <div className="flex gap-1 bg-white/5 border border-white/8 rounded-xl p-1">
                      {["days", "months"].map((u) => (
                        <button
                          type="button"
                          key={u}
                          onClick={() => setUnit(u)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition ${
                            unit === u
                              ? "bg-indigo-600 text-white"
                              : "text-gray-400 hover:text-white"
                          }`}
                        >
                          {u}
                        </button>
                      ))}
                    </div>
                  </div>
                  {errors.duration && (
                    <p className="text-red-400 text-xs mt-1">
                      {errors.duration}
                    </p>
                  )}
                </div>

                {/* Summary preview */}
                {fee && duration && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="bg-indigo-500/8 border border-indigo-500/15 rounded-xl px-4 py-3"
                  >
                    <p className="text-xs text-gray-500 mb-1.5">Plan Summary</p>
                    <div className="flex justify-between text-sm">
                      <span className="text-indigo-300">
                        ₹{fee} /{" "}
                        {unit === "months" ? `${duration}mo` : `${duration}d`}
                      </span>
                      <span className="text-gray-400">
                        Expires:{" "}
                        <span className="text-white">{endDate()}</span>
                      </span>
                    </div>
                  </motion.div>
                )}

                {/* API error */}
                {error && (
                  <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
                    <FiAlertCircle size={15} className="text-red-400 shrink-0" />
                    <p className="text-red-400 text-xs">{error}</p>
                  </div>
                )}

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center justify-center gap-2 w-full py-3 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-xl transition"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Creating Subscription...
                    </>
                  ) : (
                    <>
                      <FiCreditCard size={15} />
                      {userId ? "Renew Subscription" : "Create Subscription"}
                    </>
                  )}
                </button>
              </motion.form>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </OwnerLayout>
  );
};

export default OwnerSubscription;
