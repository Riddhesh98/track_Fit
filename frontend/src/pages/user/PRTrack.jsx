import React, { useEffect, useState } from "react";
import UserLayout from "../../components/layouts/UserLayout";
import { FiPlus, FiTrash2, FiEdit2, FiX, FiCheck, FiAward } from "react-icons/fi";
import { FaTrophy } from "react-icons/fa";
import axios from "axios";

const PRTrack = () => {
  const [editingId, setEditingId] = useState(null);
  const [name, setName] = useState("");
  const [weight, setWeight] = useState("");
  const [reps, setReps] = useState("");
  const [prs, setPrs] = useState([]);
  const [activeFilter, setActiveFilter] = useState("ALL");

  useEffect(() => {
    getAllPRs();
  }, []);

  const getAllPRs = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3000/api/pr/all",
        { withCredentials: true }
      );
      setPrs(response.data);
    } catch (err) {
      console.error("Failed to fetch PRs", err);
    }
  };

  const handleEdit = (item) => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setName(item.name);
    setWeight(item.weight);
    setReps(item.reps);
    setEditingId(item._id);
  };

  const handleCancelEdit = () => {
    setName("");
    setWeight("");
    setReps("");
    setEditingId(null);
  };

  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const numWeight = Number(weight);
    const numReps = Number(reps);
    if (!name || isNaN(numWeight) || numWeight <= 0 || numWeight > 1000 || isNaN(numReps) || numReps <= 0 || numReps > 100) return;

    const data = { name, weight: numWeight, reps: numReps };

    try {
      if (editingId) {
        await axios.put(
          `http://localhost:3000/api/pr/edit/${editingId}`,
          data,
          { withCredentials: true }
        );
      } else {
        await axios.post(
          "http://localhost:3000/api/pr/create",
          data,
          { withCredentials: true }
        );
      }
      await getAllPRs();
      handleCancelEdit();
    } catch (err) {
      console.error("Failed to submit PR", err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(
        `http://localhost:3000/api/pr/delete/${id}`,
        { withCredentials: true }
      );
      setConfirmDeleteId(null);
      getAllPRs();
    } catch (err) {
      console.error("Failed to delete PR", err);
    }
  };

  const quickPresets = ["Bench Press", "Squat", "Deadlift", "Overhead Press"];

  const filteredPrs = activeFilter === "ALL" 
    ? prs 
    : prs.filter(p => p.name.toLowerCase().includes(activeFilter.toLowerCase()));

  const max1RM = prs.reduce((max, item) => {
    const epley = Math.round(item.weight * (1 + item.reps / 30));
    return epley > max ? epley : max;
  }, 0);

  return (
    <UserLayout active="pr">
      <div className="space-y-8 pb-12">
        {/* HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-gray-200">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <FaTrophy className="text-orange-600" size={18} />
              <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500">Hall of Personal Records</span>
            </div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">
              Personal Best Lift Records
            </h1>
          </div>
          <div className="text-xs font-bold text-gray-600 bg-white border border-gray-200 px-3 py-1.5 rounded-lg shadow-xs self-start sm:self-auto">
            {prs.length} Lifts Registered
          </div>
        </div>

        {/* TELEMETRY BANNER */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 block">Peak Estimated 1-Rep Max</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-3xl font-black text-gray-900">{max1RM || "0"}</span>
              <span className="text-xs font-bold text-orange-600 uppercase">kg max</span>
            </div>
            <p className="text-xs text-gray-500 mt-1">Calculated via Epley 1RM formula [weight × (1 + reps/30)]</p>
          </div>

          <div className="w-12 h-12 rounded-lg bg-orange-50 border border-orange-200 flex items-center justify-center text-orange-600">
            <FiAward size={24} />
          </div>
        </div>

        {/* INPUT / UPDATE FORM */}
        <div className={`bg-white border ${editingId ? "border-orange-500" : "border-gray-200"} rounded-xl p-6 shadow-xs space-y-4`}>
          <div className="flex justify-between items-center pb-3 border-b border-gray-100">
            <h2 className="text-sm font-black text-gray-900 uppercase tracking-wider flex items-center gap-2">
              {editingId ? <FiEdit2 className="text-orange-600" /> : <FiPlus className="text-orange-600" />}
              {editingId ? "Update Lift Record" : "Register Personal Record"}
            </h2>

            {editingId && (
              <button
                onClick={handleCancelEdit}
                className="text-xs font-bold text-rose-600 flex items-center gap-1 hover:underline"
              >
                <FiX /> Cancel Edit
              </button>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1">
                Exercise / Movement Name *
              </label>
              <input
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Barbell Bench Press"
                className="w-full h-11 px-3 bg-gray-50 border border-gray-200 rounded-lg text-sm font-bold text-gray-900 outline-none focus:border-orange-600 transition-colors"
              />
            </div>

            <div className="flex flex-wrap gap-1.5">
              {quickPresets.map(preset => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setName(preset)}
                  className="px-2.5 py-1 bg-gray-100 hover:bg-gray-200 border border-gray-200 rounded text-[11px] font-bold text-gray-700 transition-colors"
                >
                  + {preset}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1">
                  Weight (KG) *
                </label>
                <input
                  type="number"
                  step="0.5"
                  min="1"
                  max="1000"
                  required
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  placeholder="100"
                  className="w-full h-11 px-3 bg-gray-50 border border-gray-200 rounded-lg text-sm font-bold text-gray-900 outline-none focus:border-orange-600 transition-colors"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1">
                  Reps Completed *
                </label>
                <input
                  type="number"
                  min="1"
                  max="100"
                  required
                  value={reps}
                  onChange={(e) => setReps(e.target.value)}
                  placeholder="5"
                  className="w-full h-11 px-3 bg-gray-50 border border-gray-200 rounded-lg text-sm font-bold text-gray-900 outline-none focus:border-orange-600 transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full h-11 rounded-lg bg-orange-600 hover:bg-orange-700 text-white font-bold uppercase text-xs tracking-wider flex items-center justify-center gap-2 transition-colors shadow-xs"
            >
              {editingId ? <FiCheck size={16} /> : <FiPlus size={16} />}
              {editingId ? "Save Updated PR" : "Register Personal Record"}
            </button>
          </form>
        </div>

        {/* MOVEMENT FILTER TABS */}
        <div className="flex bg-white border border-gray-200 p-1 rounded-lg gap-1 overflow-x-auto shadow-xs">
          {["ALL", "Bench", "Squat", "Deadlift"].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveFilter(tab)}
              className={`flex-1 py-1.5 px-3 text-xs font-bold rounded transition-all uppercase tracking-wider ${
                activeFilter === tab
                  ? "bg-gray-900 text-white shadow-xs"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* PR CARDS GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {filteredPrs.length === 0 ? (
            <div className="col-span-full py-10 text-center bg-white border border-dashed border-gray-200 rounded-xl">
              <p className="text-xs text-gray-500 font-medium">No personal records logged for this filter.</p>
            </div>
          ) : (
            filteredPrs.map((item) => {
              const est1RM = Math.round(item.weight * (1 + item.reps / 30));

              return (
                <div
                  key={item._id}
                  className="bg-white border border-gray-200 rounded-xl p-5 shadow-xs flex flex-col justify-between space-y-4 hover:border-gray-300 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-orange-50 border border-orange-200 flex items-center justify-center text-orange-600 shrink-0">
                        <FaTrophy size={14} />
                      </div>
                      <div>
                        <h3 className="text-sm font-extrabold text-gray-900 capitalize leading-snug">
                          {item.name}
                        </h3>
                        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block mt-0.5">
                          Est 1RM: {est1RM} kg
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleEdit(item)}
                        className="p-1.5 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded"
                        title="Edit Lift"
                      >
                        <FiEdit2 size={14} />
                      </button>
                      {confirmDeleteId === item._id ? (
                        <div className="flex items-center gap-1 bg-rose-50 border border-rose-200 px-2 py-1 rounded">
                          <span className="text-[9px] font-bold text-rose-600 uppercase">Confirm?</span>
                          <button
                            onClick={() => handleDelete(item._id)}
                            className="px-1.5 py-0.5 bg-rose-600 hover:bg-rose-700 text-white rounded text-[9px] font-bold uppercase transition-colors"
                          >
                            Yes
                          </button>
                          <button
                            onClick={() => setConfirmDeleteId(null)}
                            className="px-1.5 py-0.5 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded text-[9px] font-bold uppercase transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setConfirmDeleteId(item._id)}
                          className="p-1.5 text-gray-500 hover:text-rose-600 hover:bg-gray-100 rounded transition-colors"
                          title="Delete Lift"
                        >
                          <FiTrash2 size={14} />
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="flex items-baseline justify-between p-3 rounded-lg bg-gray-50 border border-gray-200/80">
                    <div>
                      <span className="block text-[9px] font-bold text-gray-500 uppercase tracking-wider">Weight</span>
                      <span className="text-xl font-black text-gray-900">{item.weight} <span className="text-xs font-bold text-orange-600">kg</span></span>
                    </div>
                    <div className="text-right">
                      <span className="block text-[9px] font-bold text-gray-500 uppercase tracking-wider">Reps</span>
                      <span className="text-xl font-black text-gray-900">{item.reps} <span className="text-xs font-bold text-gray-500">reps</span></span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </UserLayout>
  );
};

export default PRTrack;
