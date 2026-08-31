import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { 
  FiActivity, 
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

  const [calories, setCalories] = useState("");
  const [protein, setProtein] = useState("");
  const [carbs, setCarbs] = useState("");
  const [fats, setFats] = useState("");
  const [steps, setSteps] = useState("");

  const updateHandler = async () => {
    const numCals = Number(calories);
    if (!calories || isNaN(numCals) || numCals < 100 || numCals > 10000) return;

    const data = {
      calories: numCals,
    };

    if (protein && !isNaN(Number(protein))) data.protein = Math.max(0, Math.min(500, Number(protein)));
    if (carbs && !isNaN(Number(carbs))) data.carbs = Math.max(0, Math.min(1000, Number(carbs)));
    if (fats && !isNaN(Number(fats))) data.fats = Math.max(0, Math.min(300, Number(fats)));
    if (steps && !isNaN(Number(steps))) data.steps = Math.max(0, Math.min(100000, Number(steps)));

    try {
      await axios.put(`http://localhost:3000/api/nutrition/edit/${id}`, data, {
        withCredentials: true,
      });
      navigate("/nutrition");
    } catch (err) {
      console.error(err.response?.data || err);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#f4f5f7] flex items-center justify-center p-4 sm:p-6 font-sans">
      <div className="w-full max-w-xl">
        <div className="bg-white border border-gray-200 rounded-xl p-6 sm:p-8 shadow-xs space-y-6">
          
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-gray-200">
            <div>
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Nutrition Edit Engine</span>
              <h1 className="text-2xl font-black text-gray-900 tracking-tight">
                Update Macro Record
              </h1>
            </div>
            <button
              onClick={() => navigate(-1)}
              className="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <FiX size={20} />
            </button>
          </div>

          {/* Form Fields */}
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InputGroup 
                icon={<FiActivity />} 
                label="Calories *" 
                placeholder="2400" 
                unit="kcal" 
                color="text-amber-600"
                min="100"
                max="10000"
                required
                value={calories}
                onChange={(e) => setCalories(e.target.value)}
              />
              <InputGroup 
                icon={<FiLayers />} 
                label="Protein" 
                placeholder="175" 
                unit="g" 
                color="text-orange-600"
                min="0"
                max="500"
                value={protein}
                onChange={(e) => setProtein(e.target.value)}
              />
              <InputGroup 
                icon={<FiTrendingUp />} 
                label="Carbs" 
                placeholder="210" 
                unit="g" 
                color="text-gray-700"
                min="0"
                max="1000"
                value={carbs}
                onChange={(e) => setCarbs(e.target.value)}
              />
              <InputGroup 
                icon={<FiDroplet />} 
                label="Fats" 
                placeholder="65" 
                unit="g" 
                color="text-gray-700"
                min="0"
                max="300"
                value={fats}
                onChange={(e) => setFats(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1">
                Steps Count (Optional)
              </label>
              <input
                type="number"
                min="0"
                max="100000"
                placeholder="10000"
                value={steps}
                onChange={(e) => setSteps(e.target.value)}
                className="w-full h-11 px-3 bg-gray-50 border border-gray-200 rounded-lg text-sm font-bold text-gray-900 outline-none focus:border-orange-600 transition-colors"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
            <button 
              onClick={() => navigate(-1)}
              className="flex-1 h-11 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 font-bold uppercase tracking-wider text-xs flex items-center justify-center gap-2 transition-colors"
            >
              <FiX size={16} /> Cancel
            </button>
            <button 
              onClick={updateHandler}
              className="flex-1 h-11 rounded-lg bg-orange-600 hover:bg-orange-700 text-white font-bold uppercase tracking-wider text-xs flex items-center justify-center gap-2 transition-colors shadow-xs"
            >
              <FiCheck size={16} /> Save Record
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

const InputGroup = ({ icon, label, placeholder, unit, color, ...props }) => (
  <div>
    <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1">
      {label}
    </label>
    <div className="relative">
      <input 
        type="number" 
        placeholder={placeholder}
        {...props}
        className="w-full h-11 pl-3 pr-10 bg-gray-50 border border-gray-200 rounded-lg text-sm font-bold text-gray-900 outline-none focus:border-orange-600 transition-colors"
      />
      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-xs font-bold text-gray-400">
        {unit}
      </div>
    </div>
  </div>
);

export default NutritionEdit;