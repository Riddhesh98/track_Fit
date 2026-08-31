import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";
import {
  FiActivity, FiCalendar, FiPlus, FiTrendingUp, FiTrash2, FiArrowUpRight, FiArrowDownRight, FiCheck
} from "react-icons/fi";
import UserLayout from "../../components/layouts/UserLayout";

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white border border-gray-200 p-3 rounded-lg shadow-md text-xs">
        <p className="font-bold text-gray-500 uppercase tracking-wider">
          {new Date(data.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
        </p>
        <p className="text-lg font-black text-gray-900 mt-0.5">
          {data.weight} <span className="text-xs text-orange-600">kg</span>
        </p>
      </div>
    );
  }
  return null;
};

const WeightTrack = () => {
  const [weight, setWeight] = useState("");
  const [graphData, setGraphData] = useState([]);
  const [history, setHistory] = useState([]);
  const [timeRange, setTimeRange] = useState("ALL");

  useEffect(() => {
    fetchWeightData();
  }, []);

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

  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    const numWeight = Number(weight);
    if (!weight || isNaN(numWeight) || numWeight < 20 || numWeight > 300) return;

    try {
      const res = await axios.post(
        "http://localhost:3000/api/weight/add",
        { weight: numWeight },
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
    try {
      await axios.delete(
        `http://localhost:3000/api/weight/delete/${id}`,
        { withCredentials: true }
      );

      setHistory(prev => prev.filter(item => item._id !== id));
      setGraphData(prev => prev.filter(item => item._id !== id));
      setConfirmDeleteId(null);
    } catch (err) {
      console.error(err);
    }
  };

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

  const currentWeight = history.length ? history[0].weight : 0;
  const initialWeight = history.length ? history[history.length - 1].weight : currentWeight;
  const totalChange = (currentWeight - initialWeight).toFixed(1);
  const isLoss = totalChange < 0;

  return (
    <UserLayout active="weight">
      <div className="space-y-8 pb-12">
        {/* HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-gray-200">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <FiTrendingUp className="text-orange-600" size={18} />
              <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500">Body Composition Suite</span>
            </div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">
              Weight Progression Analytics
            </h1>
          </div>
          {/* <div className="text-xs font-bold text-gray-600 bg-white border border-gray-200 px-3 py-1.5 rounded-lg shadow-xs self-start sm:self-auto">
            {history.length} Check-Ins Logged
          </div> */}
        </div>

        {/* <div className="grid grid-cols-1 sm:grid-cols-3 gap-4"> */}
          {/* <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-xs">
            <span className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider">Latest Weight</span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-2xl font-black text-gray-900">{currentWeight}</span>
              <span className="text-xs font-bold text-gray-500">kg</span>
            </div>
          </div> */}

          {/* <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-xs">
            <span className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider">Net Weight Delta</span>
            <div className="flex items-center gap-2 mt-1">
              <span className={`text-2xl font-black ${isLoss ? "text-green-600" : totalChange > 0 ? "text-amber-600" : "text-gray-900"}`}>
                {totalChange > 0 ? `+${totalChange}` : totalChange} kg
              </span>
              {isLoss ? <FiArrowDownRight className="text-green-600" size={20} /> : totalChange > 0 ? <FiArrowUpRight className="text-amber-600" size={20} /> : null}
            </div>
          </div> */}

          {/* <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-xs">
            <span className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider">Total Check-Ins</span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-2xl font-black text-gray-900">{history.length}</span>
              <span className="text-xs font-bold text-gray-500">entries</span>
            </div>
          </div> */}
        {/* </div> */}

        {/* INLINE WEIGHT INPUT */}
        <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-xl p-6 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-black text-gray-900 uppercase tracking-wider flex items-center gap-2">
              <FiPlus className="text-orange-600" /> Log Body Weight Check-In
            </label>
            <span className="text-xs text-gray-500 font-bold flex items-center gap-1">
              <FiCalendar /> {new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" })}
            </span>
          </div>

          <div className="flex gap-3">
            <input
              type="number"
              step="0.1"
              min="20"
              max="300"
              required
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              placeholder="e.g. 74.5 kg (20 - 300)"
              className="flex-1 h-11 px-4 bg-gray-50 border border-gray-200 rounded-lg text-base font-bold text-gray-900 outline-none focus:border-orange-600 transition-colors"
            />
            <button
              type="submit"
              className="px-6 h-11 bg-orange-600 hover:bg-orange-700 rounded-lg text-white font-bold uppercase text-xs tracking-wider transition-colors flex items-center justify-center gap-1.5 shadow-xs"
            >
              <FiCheck size={16} /> Save Entry
            </button>
          </div>
        </form>

        {/* RECHARTS VISUALIZER */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-gray-100">
            <div>
              <h2 className="text-sm font-black text-gray-900 uppercase tracking-wider flex items-center gap-2">
                <FiActivity className="text-orange-600" /> Progression Curve
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">Time-series body weight tracking graph</p>
            </div>

            <div className="flex bg-gray-100 p-1 rounded-lg border border-gray-200 self-start sm:self-auto">
              {["1W", "1M", "1Y", "ALL"].map(tab => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setTimeRange(tab)}
                  className={`px-3 py-1 text-xs font-bold rounded transition-all ${
                    timeRange === tab
                      ? "bg-white text-gray-900 shadow-xs"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          <div className="h-72 w-full pt-2">
            {ChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={ChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="weightLightGlow" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ea580c" stopOpacity={0.15}/>
                      <stop offset="95%" stopColor="#ea580c" stopOpacity={0.0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="2 2" stroke="#f3f4f6" vertical={false} />
                  <XAxis
                    dataKey="date"
                    tick={{ fill: '#4b5563', fontSize: 11 }}
                    tickLine={false}
                    axisLine={{ stroke: '#e5e7eb' }}
                    tickFormatter={(str) => {
                      const d = new Date(str);
                      return `${d.getDate()} ${d.toLocaleString("en-US", { month: "short" })}`;
                    }}
                  />
                  <YAxis domain={['dataMin - 1', 'dataMax + 1']} tick={{ fill: '#4b5563', fontSize: 11 }} tickLine={false} axisLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="weight"
                    stroke="#ea580c"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#weightLightGlow)"
                    dot={{ r: 3, fill: '#ea580c' }}
                    activeDot={{ r: 6 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center bg-gray-50 rounded-lg border border-dashed border-gray-200">
                <p className="text-xs text-gray-500 font-medium">No check-ins logged for selected time range</p>
              </div>
            )}
          </div>
        </div>

        {/* TABULAR HISTORY LOG */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <h3 className="text-sm font-black text-gray-900 uppercase tracking-wider">Weight Check-In History</h3>
            <span className="text-xs font-bold text-gray-500">{history.length} Logs</span>
          </div>

          {history.length === 0 ? (
            <div className="py-8 text-center bg-gray-50 rounded-lg border border-dashed border-gray-200">
              <p className="text-xs text-gray-500 font-medium">No weight entries recorded yet.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-200 text-[10px] font-bold uppercase tracking-wider text-gray-500 bg-gray-50/50">
                    <th className="py-3 px-4">Date</th>
                    <th className="py-3 px-4">Body Weight</th>
                    <th className="py-3 px-4">Delta vs Prior</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-xs">
                  {history.map((item, index) => {
                    const prevItem = history[index + 1];
                    const diff = prevItem ? (item.weight - prevItem.weight).toFixed(1) : null;

                    return (
                      <tr key={item._id} className="hover:bg-gray-50/80 transition-colors">
                        <td className="py-3.5 px-4 font-bold text-gray-900 flex items-center gap-2">
                          <FiCalendar className="text-gray-400" />
                          {new Date(item.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
                        </td>
                        <td className="py-3.5 px-4 font-black text-gray-900 text-sm">
                          {item.weight} <span className="text-xs font-bold text-orange-600">kg</span>
                        </td>
                        <td className="py-3.5 px-4 font-bold">
                          {diff !== null ? (
                            <span className={diff < 0 ? "text-green-600" : diff > 0 ? "text-amber-600" : "text-gray-500"}>
                              {diff > 0 ? `+${diff}` : diff} kg
                            </span>
                          ) : (
                            <span className="text-gray-400 font-normal">Baseline</span>
                          )}
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          {confirmDeleteId === item._id ? (
                            <div className="flex items-center justify-end gap-1.5">
                              <span className="text-[10px] font-bold text-rose-600 uppercase">Confirm?</span>
                              <button
                                onClick={() => handleDelete(item._id)}
                                className="px-2 py-1 bg-rose-600 hover:bg-rose-700 text-white rounded text-[10px] font-bold uppercase transition-colors"
                              >
                                Yes
                              </button>
                              <button
                                onClick={() => setConfirmDeleteId(null)}
                                className="px-2 py-1 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded text-[10px] font-bold uppercase transition-colors"
                              >
                                Cancel
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => setConfirmDeleteId(item._id)}
                              className="p-1.5 text-gray-500 hover:text-rose-600 hover:bg-gray-100 rounded transition-colors"
                              title="Delete Entry"
                            >
                              <FiTrash2 size={14} />
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </UserLayout>
  );
};

export default WeightTrack;
