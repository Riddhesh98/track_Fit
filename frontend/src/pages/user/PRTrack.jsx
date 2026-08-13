import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import UserLayout from "../../components/layouts/UserLayout";
import { FiPlus, FiTrash2, FiEdit2, FiClock, FiX, FiCheck } from "react-icons/fi";
import { FaTrophy } from "react-icons/fa";
import axios from "axios";

const PRTrack = () => {

  const [editingId, setEditingId] = useState(null);
  const [name, setName] = useState("");
  const [weight, setWeight] = useState("");
  const [reps, setReps] = useState("");
  const [prs, setPrs] = useState([]);
  const [selectedHistory, setSelectedHistory] = useState(null);

  useEffect(() => {
    getAllPRs();
  }, []);

  const getAllPRs = async () => {
    const response = await axios.get(
      "http://localhost:3000/api/pr/all",
      { withCredentials: true }
    );
    setPrs(response.data);
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

  // ✅ SUBMIT HANDLES CREATE + UPDATE
  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = { name, weight, reps };

    if (editingId) {
      // UPDATE
      await axios.put(
        `http://localhost:3000/api/pr/edit/${editingId}`,
        data,
        { withCredentials: true }
      );
    } else {
      // CREATE
      await axios.post(
        "http://localhost:3000/api/pr/create",
        data,
        { withCredentials: true }
      );
    }

    await getAllPRs(); // refresh list
    handleCancelEdit();
  };

  // ✅ DELETE WITH BACKEND
  const handleDelete = async (id) => {
    if (window.confirm("Delete this PR?")) {
      await axios.delete(
        `http://localhost:3000/api/pr/delete/${id}`,
        { withCredentials: true }
      );
      getAllPRs();
    }
  };

  return (
    <UserLayout active="pr">
      <div className="min-h-screen w-full bg-black p-4">

        <div className="max-w-3xl mx-auto space-y-8 mt-4">

          {/* HEADER */}
          <div className="flex items-center gap-3">
            <div className="p-3 bg-yellow-500/10 rounded-xl">
              <FaTrophy className="text-yellow-500 text-2xl" />
            </div>
            <div>
              <h1 className="text-2xl font-black italic uppercase text-white">
                Personal <span className="text-indigo-500">Records</span>
              </h1>
              <p className="text-xs font-bold text-zinc-500 uppercase">
                Track your max lifts
              </p>
            </div>
          </div>

          {/* FORM */}
          <div className={`bg-[#09090b] border ${editingId ? "border-indigo-500" : "border-[#27272a]"} rounded-3xl p-6`}>

            <div className="flex justify-between mb-4">
              <h2 className="text-sm font-bold text-zinc-400 uppercase">
                {editingId ? "Update PR" : "New Record"}
              </h2>

              {editingId && (
                <button
                  onClick={handleCancelEdit}
                  className="text-xs font-bold text-red-400 flex items-center gap-1"
                >
                  <FiX /> Cancel
                </button>
              )}
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-3">

              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Exercise Name"
                className="flex-1 h-14 bg-[#121215] border border-[#27272a] rounded-xl px-4 py-4 text-white font-bold outline-none focus:border-indigo-500"
              />

              <div className="flex gap-3">

                <input
                  type="number"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  placeholder="KG"
                  className="w-28 h-14 bg-[#121215] border border-[#27272a] rounded-xl px-4 text-white font-bold outline-none focus:border-indigo-500 no-spinner"
                />

                <input
                  type="number"
                  value={reps}
                  onChange={(e) => setReps(e.target.value)}
                  placeholder="Reps"
                  className="w-24 h-14 bg-[#121215] border border-[#27272a] rounded-xl px-4 text-white font-bold outline-none focus:border-indigo-500 no-spinner"
                />

                <button
                  type="submit"
                  className="h-14 w-14 flex items-center justify-center rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg active:scale-95 transition"
                >
                  {editingId ? <FiCheck size={22} /> : <FiPlus size={22} />}
                </button>

              </div>
            </form>
          </div>

          {/* LIST */}
          <div className="grid md:grid-cols-2 gap-4 pb-20">
            {prs.map((item) => (
              <PRCard
                key={item._id}
                data={item}
                onEdit={() => handleEdit(item)}
                onDelete={() => handleDelete(item._id)}
                onHistory={() => setSelectedHistory(item)}
              />
            ))}
          </div>

        </div>

        {/* HISTORY PANEL (EMPTY FOR NOW — NO DUMMY DATA) */}
        <AnimatePresence>
          {selectedHistory && (
            <HistoryDrawer
              exercise={selectedHistory}
              onClose={() => setSelectedHistory(null)}
            />
          )}
        </AnimatePresence>

      </div>
    </UserLayout>
  );
};

/* ---------------- CARD ---------------- */

const PRCard = ({ data, onEdit, onDelete, onHistory }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    className="bg-[#09090b] border border-[#27272a] rounded-2xl p-5"
  >
    <div className="flex justify-between mb-4">
      <h3 className="text-lg font-black text-white uppercase">
        {data.name}
      </h3>
      <div className="flex gap-2">
        <button onClick={onEdit}><FiEdit2 /></button>
        <button onClick={onDelete}><FiTrash2 /></button>
      </div>
    </div>

    <div className="mb-4 text-white font-black text-3xl">
      {data.weight} KG / {data.reps} REPS
    </div>

    <button
      onClick={onHistory}
      className="w-full py-3 bg-[#121215] rounded-xl text-zinc-400"
    >
      <FiClock className="inline mr-2" />
      View History
    </button>
  </motion.div>
);

/* ---------------- EMPTY HISTORY ---------------- */

const HistoryDrawer = ({ exercise, onClose }) => (
  <>
    <div onClick={onClose} className="fixed inset-0 bg-black/80 z-40" />
    <motion.div
      initial={{ x: "100%" }}
      animate={{ x: 0 }}
      exit={{ x: "100%" }}
      className="fixed right-0 top-0 h-full w-full max-w-md bg-[#09090b] border-l border-[#27272a] z-50 p-6"
    >
      <h2 className="text-xl text-white font-black mb-6">
        {exercise.name}
      </h2>

      <p className="text-zinc-500 text-sm">
        History feature coming soon...
      </p>
    </motion.div>
  </>
);

export default PRTrack;
