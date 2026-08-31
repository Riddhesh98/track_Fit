import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import {
  FiAward, FiUser, FiPlus, FiCheck, FiArrowRight,
} from "react-icons/fi";
import { MdOutlineRestaurant } from "react-icons/md";
import UserLayout from "../../components/layouts/UserLayout";

const API = "http://localhost:3000/api";

const greeting = () => {
  const h = new Date().getHours();
  if (h < 12) return "Morning";
  if (h < 17) return "Afternoon";
  return "Evening";
};

const UserDashboard = () => {
  const [user, setUser] = useState(null);
  const [weightData, setWeightData] = useState([]);
  const [prs, setPrs] = useState([]);
  const [nutrition, setNutrition] = useState([]);
  const [loading, setLoading] = useState(true);

  /* Quick Inline Input States */
  const [quickWeight, setQuickWeight] = useState("");
  const [quickCalories, setQuickCalories] = useState("");
  const [quickProtein, setQuickProtein] = useState("");
  const [isSubmittingWeight, setIsSubmittingWeight] = useState(false);
  const [isSubmittingNutrition, setIsSubmittingNutrition] = useState(false);

  /* Chart Tab State */
  const [activeChartTab, setActiveChartTab] = useState("weight"); // 'weight' | 'calories'

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

  /* Quick Action Handlers */
  const handleQuickWeightSubmit = async (e) => {
    e.preventDefault();
    const numWeight = Number(quickWeight);
    if (!quickWeight || isNaN(numWeight) || numWeight < 20 || numWeight > 300) return;
    setIsSubmittingWeight(true);
    try {
      await axios.post(`${API}/weight/add`, { weight: numWeight }, { withCredentials: true });
      setQuickWeight("");
      fetchAll();
    } catch (err) {
      console.error("Failed to add weight", err);
    } finally {
      setIsSubmittingWeight(false);
    }
  };

  const handleQuickNutritionSubmit = async (e) => {
    e.preventDefault();
    const numCals = Number(quickCalories);
    if (!quickCalories || isNaN(numCals) || numCals < 100 || numCals > 10000) return;
    setIsSubmittingNutrition(true);
    try {
      const payload = { calories: numCals };
      if (quickProtein && !isNaN(Number(quickProtein))) {
        payload.protein = Math.max(0, Math.min(500, Number(quickProtein)));
      }
      await axios.post(`${API}/nutrition/add`, payload, { withCredentials: true });
      setQuickCalories("");
      setQuickProtein("");
      fetchAll();
    } catch (err) {
      console.error("Failed to add nutrition log", err);
    } finally {
      setIsSubmittingNutrition(false);
    }
  };

  /* derived values */
  const latestWeight = weightData.length ? weightData[weightData.length - 1]?.weight : null;
  const firstWeight = weightData.length ? weightData[0]?.weight : null;
  const weightChange = latestWeight && firstWeight ? (latestWeight - firstWeight).toFixed(1) : null;
  const todayNutrition = nutrition[0] || null;
  const topPRs = [...prs].sort((a, b) => b.weight - a.weight).slice(0, 3);

  const calorieTrend = [...nutrition].reverse().map((n) => ({
    date: new Date(n.date).toLocaleDateString("en-IN", { weekday: "short" }),
    calories: n.calories,
    protein: n.protein,
  }));

  if (loading) {
    return (
      <UserLayout active="dashboard">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="w-8 h-8 border-2 border-gray-900 border-t-transparent rounded-full animate-spin" />
        </div>
      </UserLayout>
    );
  }

  return (
    <UserLayout active="dashboard">
      <div className="space-y-8 pb-12">
        {/* EDITORIAL HEADER & METRICS SUMMARY */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-gray-200">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2.5 h-2.5 rounded-full bg-orange-600" />
              <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500">
                Good {greeting()} — Athlete Overview
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight">
              {user?.name ?? "Athlete"}
            </h1>
          </div>

          <div className="flex items-center gap-6 text-sm">
            <div>
              <span className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider">Current Weight</span>
              <span className="text-xl font-black text-gray-900">{latestWeight ? `${latestWeight} kg` : "—"}</span>
            </div>
            <div className="w-[1px] h-8 bg-gray-200" />
            <div>
              <span className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider">14-Day Delta</span>
              <span className={`text-xl font-black ${weightChange > 0 ? "text-amber-600" : weightChange < 0 ? "text-green-600" : "text-gray-900"}`}>
                {weightChange != null ? `${weightChange > 0 ? "+" : ""}${weightChange} kg` : "—"}
              </span>
            </div>
            <div className="w-[1px] h-8 bg-gray-200" />
            <div>
              <span className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider">Max PR Lifts</span>
              <span className="text-xl font-black text-gray-900">{prs.length}</span>
            </div>
          </div>
        </div>

        {/* ASYMMETRIC DUAL-COLUMN LAYOUT */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* MAIN COLUMN (7 COLS) */}
          <div className="lg:col-span-7 space-y-8">
            
            {/* CHART VISUALIZER DECK */}
            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
                <div>
                  <h2 className="text-base font-extrabold text-gray-900 tracking-tight">
                    {activeChartTab === "weight" ? "Bodyweight Progression" : "Caloric Intake Velocity"}
                  </h2>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {activeChartTab === "weight" ? "Daily check-in trend over time" : "Daily caloric log summaries"}
                  </p>
                </div>

                <div className="flex bg-gray-100 p-1 rounded-lg border border-gray-200 self-start sm:self-auto">
                  <button
                    onClick={() => setActiveChartTab("weight")}
                    className={`px-3 py-1 rounded font-bold text-xs transition-all ${
                      activeChartTab === "weight" ? "bg-white text-gray-900 shadow-xs" : "text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    Weight (kg)
                  </button>
                  <button
                    onClick={() => setActiveChartTab("calories")}
                    className={`px-3 py-1 rounded font-bold text-xs transition-all ${
                      activeChartTab === "calories" ? "bg-white text-gray-900 shadow-xs" : "text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    Calories (kcal)
                  </button>
                </div>
              </div>

              {activeChartTab === "weight" && (
                weightData.length > 1 ? (
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={weightData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <defs>
                          <linearGradient id="wLightGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#ea580c" stopOpacity={0.15} />
                            <stop offset="95%" stopColor="#ea580c" stopOpacity={0.0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="2 2" stroke="#f3f4f6" vertical={false} />
                        <XAxis
                          dataKey="date"
                          tick={{ fill: "#4b5563", fontSize: 11, fontWeight: 500 }}
                          tickLine={false}
                          axisLine={{ stroke: "#e5e7eb" }}
                          tickFormatter={(d) => {
                            const dt = new Date(d);
                            return `${dt.getDate()} ${dt.toLocaleString("en-US", { month: "short" })}`;
                          }}
                        />
                        <YAxis domain={["dataMin - 1", "dataMax + 1"]} tick={{ fill: "#4b5563", fontSize: 11 }} tickLine={false} axisLine={false} />
                        <Tooltip
                          contentStyle={{ background: "#ffffff", border: "1px solid #e5e7eb", borderRadius: 8, fontSize: 12, boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}
                          labelFormatter={(d) => new Date(d).toDateString()}
                        />
                        <Area type="monotone" dataKey="weight" stroke="#ea580c" fill="url(#wLightGrad)" strokeWidth={2.5} dot={{ r: 3, fill: "#ea580c" }} activeDot={{ r: 6 }} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg border border-dashed border-gray-200">
                    <p className="text-xs text-gray-500 font-medium">Log 2 or more weight entries to populate weight progression chart</p>
                  </div>
                )
              )}

              {activeChartTab === "calories" && (
                calorieTrend.length > 0 ? (
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={calorieTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <defs>
                          <linearGradient id="cLightGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#ca8a04" stopOpacity={0.15} />
                            <stop offset="95%" stopColor="#ca8a04" stopOpacity={0.0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="2 2" stroke="#f3f4f6" vertical={false} />
                        <XAxis dataKey="date" tick={{ fill: "#4b5563", fontSize: 11 }} tickLine={false} axisLine={{ stroke: "#e5e7eb" }} />
                        <YAxis tick={{ fill: "#4b5563", fontSize: 11 }} tickLine={false} axisLine={false} />
                        <Tooltip contentStyle={{ background: "#ffffff", border: "1px solid #e5e7eb", borderRadius: 8, fontSize: 12 }} />
                        <Area type="monotone" dataKey="calories" stroke="#ca8a04" fill="url(#cLightGrad)" strokeWidth={2.5} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg border border-dashed border-gray-200">
                    <p className="text-xs text-gray-500 font-medium">No calorie entries logged in the last 7 days</p>
                  </div>
                )
              )}
            </div>

            {/* TODAY'S NUTRITION INTAKE */}
            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <MdOutlineRestaurant size={18} className="text-gray-800" />
                  <h2 className="text-sm font-bold uppercase tracking-wider text-gray-900">Today's Macro Intake</h2>
                </div>
                <span className="text-xs font-bold text-gray-500">
                  {todayNutrition ? `${todayNutrition.calories} kcal logged` : "No meal logged"}
                </span>
              </div>

              {todayNutrition ? (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
                  <div className="p-3.5 rounded-lg bg-gray-50 border border-gray-200/80">
                    <span className="block text-[10px] font-bold uppercase tracking-wider text-gray-500">Calories</span>
                    <span className="text-lg font-black text-amber-600">{todayNutrition.calories} kcal</span>
                  </div>
                  <div className="p-3.5 rounded-lg bg-gray-50 border border-gray-200/80">
                    <span className="block text-[10px] font-bold uppercase tracking-wider text-gray-500">Protein</span>
                    <span className="text-lg font-black text-orange-600">{todayNutrition.protein ?? 0} g</span>
                  </div>
                  <div className="p-3.5 rounded-lg bg-gray-50 border border-gray-200/80">
                    <span className="block text-[10px] font-bold uppercase tracking-wider text-gray-500">Carbs</span>
                    <span className="text-lg font-black text-gray-900">{todayNutrition.carbs ?? 0} g</span>
                  </div>
                  <div className="p-3.5 rounded-lg bg-gray-50 border border-gray-200/80">
                    <span className="block text-[10px] font-bold uppercase tracking-wider text-gray-500">Fats</span>
                    <span className="text-lg font-black text-gray-900">{todayNutrition.fats ?? 0} g</span>
                  </div>
                </div>
              ) : (
                <p className="text-xs text-gray-500 italic py-2">
                  Use the quick-log panel on the right to log your calories for today.
                </p>
              )}
            </div>

          </div>

          {/* SECONDARY SIDEBAR COLUMN (5 COLS) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* DIRECT INLINE QUICK LOG CARDS */}
            <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-xs space-y-4">
              <h3 className="text-xs font-black uppercase tracking-wider text-gray-900 flex items-center gap-2">
                <FiPlus className="text-orange-600" /> Quick Log Check-In
              </h3>

              {/* Weight Quick Form */}
              <form onSubmit={handleQuickWeightSubmit} className="space-y-2 pt-1 border-t border-gray-100">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-500">
                  Log Body Weight (kg)
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    step="0.1"
                    min="20"
                    max="300"
                    required
                    value={quickWeight}
                    onChange={(e) => setQuickWeight(e.target.value)}
                    placeholder="75.5"
                    className="flex-1 h-10 px-3 bg-gray-50 border border-gray-200 rounded-lg text-sm font-bold text-gray-900 outline-none focus:border-orange-600 transition-colors"
                  />
                  <button
                    type="submit"
                    disabled={isSubmittingWeight}
                    className="px-4 h-10 bg-gray-900 hover:bg-gray-800 text-white text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-1"
                  >
                    {isSubmittingWeight ? "..." : <FiCheck size={14} />}
                  </button>
                </div>
              </form>

              {/* Nutrition Quick Form */}
              <form onSubmit={handleQuickNutritionSubmit} className="space-y-2 pt-3 border-t border-gray-100">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-500">
                  Log Daily Intake (Calories & Protein)
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    min="100"
                    max="10000"
                    required
                    value={quickCalories}
                    onChange={(e) => setQuickCalories(e.target.value)}
                    placeholder="Calories (kcal)"
                    className="w-full h-10 px-3 bg-gray-50 border border-gray-200 rounded-lg text-xs font-bold text-gray-900 outline-none focus:border-orange-600 transition-colors"
                  />
                  <input
                    type="number"
                    min="0"
                    max="500"
                    value={quickProtein}
                    onChange={(e) => setQuickProtein(e.target.value)}
                    placeholder="Protein (g)"
                    className="w-full h-10 px-3 bg-gray-50 border border-gray-200 rounded-lg text-xs font-bold text-gray-900 outline-none focus:border-orange-600 transition-colors"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isSubmittingNutrition}
                  className="w-full h-10 bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-1 mt-1 shadow-xs"
                >
                  {isSubmittingNutrition ? "Saving..." : <>Save Intake Log <FiArrowRight size={14} /></>}
                </button>
              </form>
            </div>

            {/* TOP PR LIFTS */}
            <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FiAward className="text-gray-800" size={16} />
                  <h3 className="text-xs font-black uppercase tracking-wider text-gray-900">Personal Best Lifts</h3>
                </div>
                <span className="text-[10px] font-bold text-gray-500 uppercase">{topPRs.length} logged</span>
              </div>

              {topPRs.length > 0 ? (
                <div className="space-y-2.5">
                  {topPRs.map((pr, i) => (
                    <div key={pr._id} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 border border-gray-200/70 text-xs">
                      <div className="flex items-center gap-2.5">
                        <span className="font-black text-gray-400 w-4 text-center">{i + 1}</span>
                        <span className="font-bold text-gray-900 capitalize">{pr.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-black text-orange-600">{pr.weight} kg</span>
                        <span className="text-gray-500 text-[11px]">× {pr.reps}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-gray-500 italic py-2">No PRs recorded yet.</p>
              )}
            </div>

            {/* ATHLETE BASELINE SNAPSHOT */}
            {user && (
              <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-xs space-y-3">
                <h3 className="text-xs font-black uppercase tracking-wider text-gray-900 flex items-center gap-2">
                  <FiUser size={15} /> Physical Baseline
                </h3>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2.5 bg-gray-50 rounded border border-gray-200/60">
                    <span className="block text-[9px] font-bold text-gray-400 uppercase">Age</span>
                    <span className="font-bold text-gray-900">{user.age ?? "—"}</span>
                  </div>
                  <div className="p-2.5 bg-gray-50 rounded border border-gray-200/60">
                    <span className="block text-[9px] font-bold text-gray-400 uppercase">Height</span>
                    <span className="font-bold text-gray-900">{user.height ? `${user.height} cm` : "—"}</span>
                  </div>
                  <div className="p-2.5 bg-gray-50 rounded border border-gray-200/60">
                    <span className="block text-[9px] font-bold text-gray-400 uppercase">Gender</span>
                    <span className="font-bold text-gray-900 capitalize">{user.gender ?? "—"}</span>
                  </div>
                  <div className="p-2.5 bg-gray-50 rounded border border-gray-200/60">
                    <span className="block text-[9px] font-bold text-gray-400 uppercase">Frequency</span>
                    <span className="font-bold text-gray-900">{user.frequency ?? "—"}</span>
                  </div>
                </div>
              </div>
            )}

          </div>

        </div>
      </div>
    </UserLayout>
  );
};

export default UserDashboard;
