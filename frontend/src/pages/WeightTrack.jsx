import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";
import {
  FiActivity, FiCalendar, FiPlus, FiTrendingUp, FiTrash2
} from "react-icons/fi";
import UserLayout from "../components/UserLayout";


const WeightTrack = () => {

  // --- STATE MANAGEMENT ---
  const [weight, setWeight] = useState("");
  const [graphData, setGraphData] = useState([]);
  const [history, setHistory] = useState([]);
  const [timeRange, setTimeRange] = useState("ALL");

  // --- EFFECTS ---
  useEffect(() => {
    fetchWeightData();
  }, []);

  // --- API FUNCTIONS ---
  const fetchWeightData = async () => {
    try {
      const res = await axios.get(
        "http://localhost:3000/api/weight/data",
        { withCredentials: true }
      );
      setGraphData(res.data.graphData);
      setHistory(res.data.history);
    } catch (err) {
      console.error("Error fetching data:", err);
    }
  };

  const handleSubmit = async () => {
    if (!weight) return;

    try {
      const res = await axios.post(
        "http://localhost:3000/api/weight/add",
        { weight: Number(weight) },
        { withCredentials: true }
      );

      setHistory([res.data.data, ...history]);
      setGraphData([...graphData, res.data.data]);
      setWeight("");
    } catch (err) {
      console.error("Error adding weight:", err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this entry?")) return;

    try {
      await axios.delete(
        `http://localhost:3000/api/weight/delete/${id}`,
        { withCredentials: true }
      );

      setHistory(prev => prev.filter(item => item._id !== id));
      setGraphData(prev => prev.filter(item => item._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  // --- FILTER ---
  const getFilteredData = () => {
    if (timeRange === "ALL") return graphData;

    const now = new Date();
    const cutoff = new Date();

    if (timeRange === "1W") cutoff.setDate(now.getDate() - 7);
    if (timeRange === "1M") cutoff.setMonth(now.getMonth() - 1);
    if (timeRange === "1Y") cutoff.setFullYear(now.getFullYear() - 1);

    return graphData.filter(item => new Date(item.date) >= cutoff);
  };

  const ChartData = getFilteredData();

  // --- RENDER ---
  return (
    <UserLayout active="weight"> 

      <div className="w-full max-w-xl mx-auto p-4 space-y-6">

        {/* HEADER */}
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-600/20 rounded-lg">
            <FiTrendingUp className="text-indigo-500 text-xl" />
          </div>
          <h1 className="text-2xl font-black italic uppercase text-white tracking-tighter">
            Weight <span className="text-indigo-500">Track</span>
          </h1>
        </div>

        {/* INPUT CARD */}
        <div className="bg-[#09090b] border border-[#27272a] rounded-3xl p-6 shadow-2xl">
          <div className="flex flex-col gap-4">
            <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">
              Current Weight
            </label>

            <div className="flex gap-3">
              <input
                type="number"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                placeholder="00.0"
                className="flex-1 h-16 px-6 bg-[#121215] border border-[#27272a] rounded-2xl text-white font-black text-3xl"
              />

              <button
                onClick={handleSubmit}
                className="w-16 h-16 bg-indigo-600 hover:bg-indigo-500 rounded-2xl flex items-center justify-center text-white"
              >
                <FiPlus size={28} />
              </button>
            </div>

            <p className="text-[10px] text-zinc-600 font-medium flex items-center gap-1">
              <FiCalendar /> Date is set to today automatically
            </p>
          </div>
        </div>

        {/* GRAPH */}
        <div className="bg-[#09090b] border border-[#27272a] rounded-3xl p-6 min-h-[300px]">
          <div className="flex justify-between mb-6">
            <h2 className="text-sm font-bold text-zinc-400 uppercase">Progress</h2>
            <div className="flex gap-2">
              {["1W", "1M", "1Y", "ALL"].map(tab => (
                <button
                  key={tab}
                  onClick={() => setTimeRange(tab)}
                  className={`px-3 py-1 text-xs font-bold rounded-md ${
                    timeRange === tab
                      ? "bg-indigo-600 text-white"
                      : "text-zinc-500 hover:text-white"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer>
              <AreaChart data={ChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                <XAxis
                  dataKey="date"
                  tickFormatter={(str) => {
                    const d = new Date(str);
                    return `${d.getDate()}/${d.getMonth() + 1}`;
                  }}
                />
                <YAxis domain={['dataMin - 2', 'dataMax + 2']} />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="weight"
                  stroke="#4f46e5"
                  fill="#4f46e5"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* HISTORY */}
        <div className="space-y-3">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <FiActivity className="text-indigo-500" />
            History
          </h3>

          <AnimatePresence>
            {history.map(item => (
              <motion.div
                key={item._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="flex justify-between items-center bg-[#09090b] border border-[#27272a] p-4 rounded-2xl"
              >
                <span className="text-sm text-zinc-400">
                  {new Date(item.date).toDateString()}
                </span>

                <div className="flex items-center gap-4">
                  <span className="text-xl font-black text-white">
                    {item.weight} KG
                  </span>

                  <button
                    onClick={() => handleDelete(item._id)}
                    className="p-2 bg-[#18181b] hover:bg-red-600 rounded-lg"
                  >
                    <FiTrash2 size={14} />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {history.length === 0 && (
            <p className="text-center text-zinc-600 py-6">
              No weight logs found.
            </p>
          )}
        </div>

      </div>
    </UserLayout>
  );
};

export default WeightTrack;
