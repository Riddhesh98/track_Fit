import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiUserPlus,
  FiMail,
  FiDollarSign,
  FiCalendar,
  FiSend,
  FiCheckCircle,
  FiAlertCircle,
  FiCreditCard,
} from "react-icons/fi";
import OwnerLayout from "../components/OwnerLayout";
import { ownerFetch } from "../api/ownerApi";

const DURATION_PRESETS = [
  { label: "1 Month", days: 30 },
  { label: "3 Months", days: 90 },
  { label: "6 Months", days: 180 },
  { label: "1 Year", days: 365 },
];

const AddUser = () => {
  const [searchBy, setSearchBy] = useState("email"); // "email" | "id"
  const [email, setEmail] = useState("");
  const [userId, setUserId] = useState("");
  const [fee, setFee] = useState("");
  const [duration, setDuration] = useState("");
  const [unit, setUnit] = useState("days");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [successData, setSuccessData] = useState(null);
  const [errors, setErrors] = useState({});

  const durationInDays =
    unit === "months" ? Number(duration) * 30 : Number(duration);

  const endDatePreview = () => {
    if (!duration) return "—";
    const d = new Date();
    d.setDate(d.getDate() + durationInDays);
    return d.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const validate = () => {
    const e = {};
    if (searchBy === "email") {
      if (!email.trim() || !email.includes("@")) e.email = "Enter a valid email";
    } else {
      if (!userId.trim() || userId.trim().length < 10) e.userId = "Enter a valid User ID";
    }
    if (!fee || isNaN(fee) || Number(fee) <= 0) e.fee = "Enter a valid fee";
    if (!duration || isNaN(duration) || Number(duration) <= 0)
      e.duration = "Enter a valid duration";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setStatus(null);
    setErrorMsg("");

    const body = {
      fee: Number(fee),
      durationDays: durationInDays,
    };
    if (searchBy === "email") {
      body.email = email.trim().toLowerCase();
    } else {
      body.userId = userId.trim();
    }

    try {
      const data = await ownerFetch("/gymOwner/add-user-with-subscription", {
        method: "POST",
        body: JSON.stringify(body),
      });
      setSuccessData(data);
      setStatus("success");
    } catch (err) {
      setErrorMsg(err.message);
      setStatus("error");
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setEmail("");
    setUserId("");
    setFee("");
    setDuration("");
    setUnit("days");
    setErrors({});
    setStatus(null);
    setErrorMsg("");
    setSuccessData(null);
  };

  return (
    <OwnerLayout>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-2xl font-black text-white">Add Member</h1>
        <p className="text-gray-500 text-sm mt-1">
          Enter the user's email, set their fee and plan duration.
        </p>
      </motion.div>

      <div className="max-w-lg">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-[#111114] border border-white/5 rounded-2xl p-6"
        >
          {/* Card header */}
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-indigo-600/20 border border-indigo-600/30 rounded-xl flex items-center justify-center">
              <FiUserPlus size={18} className="text-indigo-400" />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">Add Member + Send Invitation</p>
              <p className="text-xs text-gray-500">User must accept before their plan activates</p>
            </div>
          </div>

          <AnimatePresence mode="wait">
            {/* SUCCESS */}
            {status === "success" ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="flex flex-col items-center py-6 text-center"
              >
                <div className="w-14 h-14 bg-emerald-500/20 border border-emerald-500/30 rounded-2xl flex items-center justify-center mb-4">
                  <FiCheckCircle size={28} className="text-emerald-400" />
                </div>
                <p className="text-white font-semibold text-lg">Invitation Sent!</p>
                <p className="text-gray-400 text-sm mt-1">
                  <span className="text-indigo-400 font-medium">
                    {successData?.user?.name || email || userId}
                  </span>{" "}
                  will see a gym invitation on their dashboard and must accept it to activate their membership.
                </p>
                <div className="mt-4 w-full bg-indigo-500/8 border border-indigo-500/15 rounded-xl px-4 py-3 text-left">
                  <p className="text-xs text-gray-500 mb-1.5">Plan Summary</p>
                  <div className="flex justify-between text-sm">
                    <span className="text-indigo-300">₹{fee}</span>
                    <span className="text-gray-400">
                      Expires:{" "}
                      <span className="text-white">{endDatePreview()}</span>
                    </span>
                  </div>
                </div>
                <button
                  onClick={reset}
                  className="mt-5 px-5 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 text-sm rounded-xl transition"
                >
                  Add Another
                </button>
              </motion.div>
            ) : status === "error" ? (
              /* ERROR */
              <motion.div
                key="error"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="flex flex-col items-center py-6 text-center"
              >
                <div className="w-14 h-14 bg-red-500/20 border border-red-500/30 rounded-2xl flex items-center justify-center mb-4">
                  <FiAlertCircle size={28} className="text-red-400" />
                </div>
                <p className="text-white font-semibold text-lg">Failed</p>
                <p className="text-gray-500 text-sm mt-1 max-w-xs">{errorMsg}</p>
                <button
                  onClick={() => setStatus(null)}
                  className="mt-5 px-5 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 text-sm rounded-xl transition"
                >
                  Try Again
                </button>
              </motion.div>
            ) : (
              /* FORM */
              <motion.form
                key="form"
                onSubmit={handleSend}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-5"
              >
                {/* Search By Toggle */}
                <div>
                  <label className="block text-xs text-gray-500 mb-1.5 uppercase tracking-wide font-medium">
                    Find User By
                  </label>
                  <div className="flex gap-1 bg-white/5 border border-white/8 rounded-xl p-1 w-fit">
                    {["email", "id"].map((opt) => (
                      <button
                        type="button"
                        key={opt}
                        onClick={() => { setSearchBy(opt); setEmail(""); setUserId(""); setErrors({}); }}
                        className={`px-4 py-1.5 rounded-lg text-xs font-semibold capitalize transition ${
                          searchBy === opt ? "bg-indigo-600 text-white" : "text-gray-400 hover:text-white"
                        }`}
                      >
                        {opt === "id" ? "User ID" : "Email"}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Email / User ID */}
                {searchBy === "email" ? (
                <div>
                  <label className="block text-xs text-gray-500 mb-1.5 uppercase tracking-wide font-medium">
                    User Email
                  </label>
                  <div className="relative">
                    <FiMail
                      size={15}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500"
                    />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        setErrors((p) => ({ ...p, email: undefined }));
                      }}
                      placeholder="user@example.com"
                      className={`w-full bg-white/5 border rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none transition ${
                        errors.email
                          ? "border-red-500/50 focus:border-red-500"
                          : "border-white/8 focus:border-indigo-500/60 focus:bg-indigo-500/5"
                      }`}
                    />
                  </div>
                  {errors.email && (
                    <p className="text-red-400 text-xs mt-1">{errors.email}</p>
                  )}
                </div>
                ) : (
                <div>
                  <label className="block text-xs text-gray-500 mb-1.5 uppercase tracking-wide font-medium">
                    User ID
                  </label>
                  <div className="relative">
                    <FiMail
                      size={15}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500"
                    />
                    <input
                      type="text"
                      value={userId}
                      onChange={(e) => {
                        setUserId(e.target.value);
                        setErrors((p) => ({ ...p, userId: undefined }));
                      }}
                      placeholder="Paste the user's TrackFit ID"
                      className={`w-full bg-white/5 border rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none transition font-mono ${
                        errors.userId
                          ? "border-red-500/50 focus:border-red-500"
                          : "border-white/8 focus:border-indigo-500/60 focus:bg-indigo-500/5"
                      }`}
                    />
                  </div>
                  {errors.userId && (
                    <p className="text-red-400 text-xs mt-1">{errors.userId}</p>
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

                {/* Duration Presets */}
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
                    <p className="text-red-400 text-xs mt-1">{errors.duration}</p>
                  )}
                </div>

                {/* Plan preview */}
                {fee && duration && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="bg-indigo-500/8 border border-indigo-500/15 rounded-xl px-4 py-3"
                  >
                    <p className="text-xs text-gray-500 mb-1.5">Plan Preview</p>
                    <div className="flex justify-between text-sm">
                      <span className="text-indigo-300">
                        ₹{fee} /{" "}
                        {unit === "months" ? `${duration}mo` : `${duration}d`}
                      </span>
                      <span className="text-gray-400">
                        Expires:{" "}
                        <span className="text-white">{endDatePreview()}</span>
                      </span>
                    </div>
                  </motion.div>
                )}

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading || (!email.trim() && !userId.trim())}
                  className="flex items-center justify-center gap-2 w-full py-3 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-xl transition"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Sending Invitation...
                    </>
                  ) : (
                    <>
                      <FiSend size={15} />
                      Send Invitation
                    </>
                  )}
                </button>
              </motion.form>
            )}
          </AnimatePresence>
        </motion.div>

        {/* How it works */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-4 bg-[#111114] border border-white/5 rounded-2xl p-4"
        >
          <p className="text-xs text-gray-600 font-semibold mb-2 uppercase tracking-wide">
            How it works
          </p>
          <ol className="space-y-1.5 text-xs text-gray-500">
            <li className="flex gap-2">
              <span className="text-indigo-500 font-bold">1.</span> Find the user by their TrackFit email or User ID
            </li>
            <li className="flex gap-2">
              <span className="text-indigo-500 font-bold">2.</span> Set their
              membership fee and plan duration
            </li>
            <li className="flex gap-2">
              <span className="text-indigo-500 font-bold">3.</span> Click "Send Invitation" — the user sees a notification on their dashboard
            </li>
            <li className="flex gap-2">
              <span className="text-indigo-500 font-bold">4.</span> Once they accept, their membership becomes Active
            </li>
          </ol>
        </motion.div>
      </div>
    </OwnerLayout>
  );
};

export default AddUser;
