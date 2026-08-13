import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate, useParams } from "react-router-dom";
import { 
  FiActivity, 
  FiPieChart, 
  FiLayers, 
  FiDroplet, 
  FiTrendingUp, 
  FiX, 
  FiCheck 
} from "react-icons/fi";
import axios from "axios";

const NutritionEdit = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  // State names kept exactly as requested
  const [calories, setCalories] = useState("");
  const [protein, setProtein] = useState("");
  const [carbs, setCarbs] = useState("");
  const [fats, setFats] = useState("");
  const [steps, setSteps] = useState("");

  const updateHandler = async () => {
    const data = {
      calories: Number(calories), // required
    };

    if (protein) data.protein = Number(protein);
    if (carbs) data.carbs = Number(carbs);
    if (fats) data.fats = Number(fats);
    if (steps) data.steps = Number(steps);

    console.log(data);
    try {
      const res = await axios.put(`http://localhost:3000/api/nutrition/edit/${id}`, data, {
        withCredentials: true,
      });
      console.log(res.data);
      navigate("/nutrition");
    } catch (err) {
      console.error(err.response?.data || err);
    }
  };

  return (
    <div className="min-h-screen w-full bg-black flex items-center justify-center p-4">
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-2xl"
      >
        {/* Card Container */}
        <div className="bg-[#09090b] border border-[#27272a] rounded-[2rem] p-8 shadow-2xl relative overflow-hidden">
          
          {/* Subtle Ambient Glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-32 bg-indigo-600/20 blur-[80px] pointer-events-none"></div>

          {/* Header */}
          <div className="flex items-center gap-5 mb-10 relative z-10">
            <div className="p-4 bg-[#18181b] rounded-2xl border border-[#27272a] shadow-lg group">
              <FiActivity className="text-indigo-500 text-2xl group-hover:scale-110 transition-transform" />
            </div>
            <div>
              <h1 className="text-3xl font-black italic uppercase text-white tracking-tighter">
                Edit <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-500">Log</span>
              </h1>
              <p className="text-[11px] font-bold text-zinc-500 uppercase tracking-[0.25em] mt-1">
                Update Daily Stats
              </p>
            </div>
          </div>

          {/* Macronutrients Section */}
          <div className="space-y-6 relative z-10">
            <div className="flex items-center gap-3 mb-5 border-b border-[#27272a] pb-2">
              <FiPieChart className="text-zinc-500" />
              <h2 className="text-xs font-black text-zinc-500 uppercase tracking-[0.2em]">
                Macronutrients
              </h2>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <InputGroup 
                icon={<FiActivity />} 
                label="Calories" 
                placeholder="0" 
                unit="kcal" 
                color="text-white"
                required
                value={calories}
                onChange={(e) => setCalories(e.target.value)}
              />
              <InputGroup 
                icon={<FiLayers />} 
                label="Protein" 
                placeholder="0" 
                unit="g" 
                color="text-emerald-500"
                value={protein}
                onChange={(e) => setProtein(e.target.value)}
              />
              <InputGroup 
                icon={<FiTrendingUp />} 
                label="Carbs" 
                placeholder="0" 
                unit="g" 
                color="text-amber-500"
                value={carbs}
                onChange={(e) => setCarbs(e.target.value)}
              />
              <InputGroup 
                icon={<FiDroplet />} 
                label="Fats" 
                placeholder="0" 
                unit="g" 
                color="text-rose-500"
                value={fats}
                onChange={(e) => setFats(e.target.value)}
              />
            </div>
          </div>

          {/* Divider */}
          <div className="h-px w-full bg-[#27272a] my-10"></div>

          {/* Activity Section */}
          <div className="space-y-6 relative z-10">
            <div className="flex items-center gap-3 mb-5 border-b border-[#27272a] pb-2">
              <FiActivity className="text-zinc-500" />
              <h2 className="text-xs font-black text-zinc-500 uppercase tracking-[0.2em]">
                Activity
              </h2>
            </div>

            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
                <FiActivity className="text-indigo-500" />
              </div>
              <input 
                type="number" 
                placeholder="0" 
                value={steps}
                onChange={(e) => setSteps(e.target.value)}
                className="w-full h-20 pl-14 pr-20 bg-[#121215] border border-[#27272a] rounded-2xl text-white placeholder:text-zinc-700 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600/50 outline-none transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none font-black text-2xl tracking-tight"
              />
              <div className="absolute top-3 left-14 text-[10px] font-bold text-zinc-600 uppercase tracking-widest pointer-events-none">
                Steps Count
              </div>
              <div className="absolute inset-y-0 right-0 pr-6 flex items-center pointer-events-none">
                <span className="text-sm font-bold text-zinc-600 uppercase tracking-widest">Steps</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-4 mt-10 relative z-10">
            <button 
              onClick={() => navigate(-1)}
              className="h-14 rounded-xl bg-[#18181b] border border-[#27272a] text-zinc-400 hover:text-white hover:bg-[#27272a] hover:border-zinc-600 transition-all font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-2"
            >
              <FiX className="text-lg" /> Cancel
            </button>
            
            <button 
              onClick={updateHandler}
              className="h-14 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-900/20 transition-all active:scale-[0.98] font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-2">
              <FiCheck className="text-lg" /> Save Update
            </button>
          </div>

        </div>
      </motion.div>
    </div>
  );
};

// Reusable Input Component
// FIXED: Added ...props to receive onChange, value, required, etc.
const InputGroup = ({ icon, label, placeholder, unit, color, ...props }) => (
  <div className="relative group">
    <div className={`absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none ${color} transition-opacity`}>
      {React.cloneElement(icon, { size: 18 })}
    </div>
    
    <input 
      type="number" 
      placeholder={placeholder}
      {...props} // This passes onChange, value, required to the input
      className="w-full h-16 pl-14 pr-12 bg-[#121215] border border-[#27272a] rounded-xl text-white placeholder:text-zinc-700 focus:border-indigo-500 focus:bg-[#18181b] outline-none transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none font-bold text-lg"
    />
    
    <div className="absolute top-2 left-14 text-[9px] font-black text-zinc-600 uppercase tracking-widest pointer-events-none group-focus-within:text-indigo-400 transition-colors">
      {label}
    </div>
    
    <div className="absolute inset-y-0 right-0 pr-5 flex items-center pointer-events-none">
      <span className="text-[10px] font-bold text-zinc-600 uppercase">{unit}</span>
    </div>
  </div>
);

export default NutritionEdit;