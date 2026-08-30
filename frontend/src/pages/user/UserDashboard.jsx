import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import {
  FiTrendingUp, FiAward, FiUser, FiActivity,
} from "react-icons/fi";
import { MdOutlineRestaurant } from "react-icons/md";
import UserLayout from "../../components/layouts/UserLayout";

const API = "http://localhost:3000/api";

/* ───────────── helpers ───────────── */
const card = "bg-[#0f0f11] border border-white/[0.06] rounded-2xl p-5";

const StatChip = ({ label, value, color = "text-indigo-400" }) => (
  <div className="flex flex-col gap-1">
    <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">{label}</span>
    <span className={`text-2xl font-black ${color}`}>{value ?? "—"}</span>
  </div>
);

/* ── greeting ── */
const greeting = () => {
  const h = new Date().getHours();
  if (h < 12) return "Good Morning";
  if (h < 17) return "Good Afternoon";
  return "Good Evening";
};

/* ───────────── main component ───────────── */
/* ───────────── main component ───────────── */
const UserDashboard = () => {
  const [user, setUser] = useState(null);
  const [weightData, setWeightData] = useState([]);
  const [prs, setPrs] = useState([]);
  const [nutrition, setNutrition] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAll = useCallback(async () => {
    try {
      const [uRes, wRes, prRes, nRes] = await Promise.allSettled([
        axios.get(`${API}/users/me`, { withCredentials: true }),
        axios.get(`${API}/weight/data`, { withCredentials: true }),
        axios.get(`${API}/pr/all`, { withCredentials: true }),
        axios.get(`${API}/nutrition/last10days`, { withCredentials: true }),
      ]);

      if (uRes.status === "fulfilled") setUser(uRes.value.data.user);
      if (wRes.status === "fulfilled") {
        const all = wRes.value.data.graphData || [];
        setWeightData(all.slice(-14));
      }
      if (prRes.status === "fulfilled") setPrs(prRes.value.data || []);
      if (nRes.status === "fulfilled") {
        const nutritionArr = nRes.value.data?.data || [];
        setNutrition(nutritionArr.slice(0, 7));
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  /* ── derived ── */
  const latestWeight = weightData.length ? weightData[weightData.length - 1]?.weight : null;
  const firstWeight = weightData.length ? weightData[0]?.weight : null;
  const weightChange = latestWeight && firstWeight ? (latestWeight - firstWeight).toFixed(1) : null;
  const todayNutrition = nutrition[0] || null;
  const topPRs = [...prs].sort((a, b) => b.weight - a.weight).slice(0, 3);

  /* ── weekly calorie trend ── */
  const calorieTrend = [...nutrition].reverse().map((n) => ({
    date: new Date(n.date).toLocaleDateString("en-IN", { weekday: "short" }),
    calories: n.calories,
    protein: n.protein,
  }));

  if (loading) {
    return (
      <UserLayout active="dashboard">
        <div className="flex items-center justify-center min-h-[80vh]">
          <div className="w-10 h-10 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
        </div>
      </UserLayout>
    );
  }

  return (
    <UserLayout active="dashboard">
      <div className="max-w-2xl mx-auto p-4 pb-20 space-y-5">

        {/* ── HERO GREETING ── */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="pt-4"
        >
          <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-1">
            {greeting()},
          </p>
          <h1 className="text-3xl font-black text-white tracking-tight leading-tight">
            {user?.name?.split(" ")[0] ?? "Athlete"}{" "}
            <span className="text-indigo-500">💪</span>
          </h1>
          <p className="text-sm text-zinc-500 mt-1">
            {new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" })}
          </p>
        </motion.div>

        {/* ── ATHLETE STATUS CARD ── */}
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="relative overflow-hidden rounded-3xl p-6"
          style={{
            background: "linear-gradient(135deg, #1e1b4b 0%, #312e81 40%, #1e1b4b 100%)",
            border: "1px solid rgba(129,140,248,0.2)",
          }}
        >
          {/* Decorative glow */}
          <div className="absolute -top-8 -right-8 w-40 h-40 bg-indigo-500/20 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-violet-500/10 rounded-full blur-2xl pointer-events-none" />

          <div className="relative flex justify-between items-center">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-indigo-300/70 mb-1">
                TrackFit Athlete Profile
              </p>
              <p className="text-xl font-black text-white">
                {user?.name ?? "TrackFit Member"}
              </p>
              <p className="text-xs text-indigo-200/60 mt-1">
                Goal: {user?.frequency ? `${user.frequency} Workout sessions / week` : "Consistent Fitness & PR Growth"}
              </p>
            </div>

            <div className="bg-indigo-500/20 border border-indigo-500/30 rounded-2xl p-4 text-center">
              <span className="block text-2xl font-black text-indigo-400">{prs.length}</span>
              <span className="text-[9px] font-bold uppercase text-indigo-200 tracking-wider">PR Lifts Logged</span>
            </div>
          </div>
        </motion.div>

        {/* ── QUICK STATS ROW ── */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className={`${card} grid grid-cols-3 gap-4`}
        >
          <StatChip label="Current Weight" value={latestWeight ? `${latestWeight} kg` : null} />
          <StatChip
            label="Change"
            value={weightChange != null ? `${weightChange > 0 ? "+" : ""}${weightChange} kg` : null}
            color={weightChange > 0 ? "text-orange-400" : weightChange < 0 ? "text-emerald-400" : "text-zinc-400"}
          />
          <StatChip label="Workouts PRs" value={prs.length} color="text-violet-400" />
        </motion.div>

        {/* ── TODAY'S NUTRITION ── */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className={card}
        >
          <div className="flex items-center gap-2 mb-4">
            <MdOutlineRestaurant className="text-orange-400 text-lg" />
            <h2 className="text-sm font-bold text-zinc-300 uppercase tracking-wider">Today's Nutrition</h2>
          </div>

          {todayNutrition ? (
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "Calories", value: `${todayNutrition.calories} kcal`, color: "text-orange-400", bg: "bg-orange-500/10" },
                { label: "Protein", value: `${todayNutrition.protein ?? 0}g`, color: "text-blue-400", bg: "bg-blue-500/10" },
                { label: "Carbs", value: `${todayNutrition.carbs ?? 0}g`, color: "text-yellow-400", bg: "bg-yellow-500/10" },
                { label: "Fats", value: `${todayNutrition.fats ?? 0}g`, color: "text-pink-400", bg: "bg-pink-500/10" },
              ].map((m) => (
                <div key={m.label} className={`${m.bg} rounded-xl p-3 flex flex-col gap-1`}>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">{m.label}</span>
                  <span className={`text-xl font-black ${m.color}`}>{m.value}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-zinc-600 text-center py-4">No nutrition logged today</p>
          )}
        </motion.div>

        {/* ── WEIGHT CHART ── */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className={card}
        >
          <div className="flex items-center gap-2 mb-4">
            <FiTrendingUp className="text-indigo-400 text-lg" />
            <h2 className="text-sm font-bold text-zinc-300 uppercase tracking-wider">Weight Trend</h2>
            <span className="ml-auto text-[10px] text-zinc-600 font-bold">Last 14 days</span>
          </div>

          {weightData.length > 1 ? (
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={weightData} margin={{ top: 4, right: 4, left: -24, bottom: 0 }}>
                  <defs>
                    <linearGradient id="wGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1f1f23" />
                  <XAxis
                    dataKey="date"
                    tick={{ fill: "#52525b", fontSize: 10 }}
                    tickFormatter={(d) => {
                      const dt = new Date(d);
                      return `${dt.getDate()}/${dt.getMonth() + 1}`;
                    }}
                  />
                  <YAxis domain={["dataMin - 1", "dataMax + 1"]} tick={{ fill: "#52525b", fontSize: 10 }} />
                  <Tooltip
                    contentStyle={{ background: "#09090b", border: "1px solid #27272a", borderRadius: 10, fontSize: 12 }}
                    labelFormatter={(d) => new Date(d).toDateString()}
                  />
                  <Area
                    type="monotone"
                    dataKey="weight"
                    stroke="#6366f1"
                    fill="url(#wGrad)"
                    strokeWidth={2}
                    dot={{ r: 3, fill: "#6366f1" }}
                    activeDot={{ r: 5 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <p className="text-sm text-zinc-600 text-center py-6">Log at least 2 weights to see your trend</p>
          )}
        </motion.div>

        {/* ── CALORIE TREND ── */}
        {calorieTrend.length > 1 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className={card}
          >
            <div className="flex items-center gap-2 mb-4">
              <FiActivity className="text-orange-400 text-lg" />
              <h2 className="text-sm font-bold text-zinc-300 uppercase tracking-wider">Calorie Trend</h2>
              <span className="ml-auto text-[10px] text-zinc-600 font-bold">Last 7 days</span>
            </div>
            <div className="h-40">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={calorieTrend} margin={{ top: 4, right: 4, left: -24, bottom: 0 }}>
                  <defs>
                    <linearGradient id="cGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f97316" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1f1f23" />
                  <XAxis dataKey="date" tick={{ fill: "#52525b", fontSize: 10 }} />
                  <YAxis tick={{ fill: "#52525b", fontSize: 10 }} />
                  <Tooltip
                    contentStyle={{ background: "#09090b", border: "1px solid #27272a", borderRadius: 10, fontSize: 12 }}
                  />
                  <Area type="monotone" dataKey="calories" stroke="#f97316" fill="url(#cGrad)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        )}

        {/* ── TOP PRs ── */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className={card}
        >
          <div className="flex items-center gap-2 mb-4">
            <FiAward className="text-yellow-400 text-lg" />
            <h2 className="text-sm font-bold text-zinc-300 uppercase tracking-wider">Top Lifts</h2>
          </div>

          {topPRs.length > 0 ? (
            <div className="space-y-3">
              {topPRs.map((pr, i) => (
                <div key={pr._id} className="flex items-center gap-3">
                  <span className={`text-xs font-black w-5 text-center ${i === 0 ? "text-yellow-400" : i === 1 ? "text-zinc-300" : "text-orange-600"}`}>
                    {i === 0 ? "🥇" : i === 1 ? "🥈" : "🥉"}
                  </span>
                  <span className="flex-1 text-sm font-bold text-white capitalize">{pr.name}</span>
                  <span className="text-sm font-black text-indigo-400">{pr.weight} kg</span>
                  <span className="text-xs text-zinc-500">× {pr.reps}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-zinc-600 text-center py-4">No PRs logged yet</p>
          )}
        </motion.div>

        {/* ── PROFILE SNAPSHOT ── */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          className={card}
        >
          <div className="flex items-center gap-2 mb-4">
            <FiUser className="text-violet-400 text-lg" />
            <h2 className="text-sm font-bold text-zinc-300 uppercase tracking-wider">My Profile</h2>
          </div>
          {user ? (
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: "Age", value: user.age },
                { label: "Height", value: user.height ? `${user.height} cm` : "—" },
                { label: "Goal Weight", value: user.weight ? `${user.weight} kg` : "—" },
                { label: "Gender", value: user.gender },
                { label: "Frequency", value: user.frequency ? `${user.frequency}×/wk` : "—" },
                {
                  label: "Member since",
                  value: new Date(user.createdAt).toLocaleDateString("en-IN", { month: "short", year: "2-digit" }),
                },
              ].map((f) => (
                <div key={f.label} className="bg-white/[0.03] rounded-xl p-3">
                  <p className="text-[9px] font-bold uppercase tracking-widest text-zinc-600">{f.label}</p>
                  <p className="text-sm font-bold text-white capitalize mt-0.5">{f.value || "—"}</p>
                </div>
              ))}
            </div>
          ) : null}
        </motion.div>

        {/* ── MOTIVATIONAL FOOTER ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center py-4"
        >
          <p className="text-xs text-zinc-600 italic">
            "The only bad workout is the one that didn't happen." 🔥
          </p>
        </motion.div>
      </div>
    </UserLayout>
  );
};

export default UserDashboard;
