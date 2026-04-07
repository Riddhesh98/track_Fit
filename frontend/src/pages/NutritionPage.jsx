import { useEffect, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { FiEdit2, FiTrash2, FiCalendar, FiActivity } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import UserLayout from "../components/UserLayout";
const NutritionPage = () => {
  const [calories, setCalories] = useState("");
  const [protein, setProtein] = useState("");
  const [carbs, setCarbs] = useState("");
  const [fats, setFats] = useState("");
  const [steps, setSteps] = useState("");

  const [showProtein, setShowProtein] = useState(false);
  const [showCarbs, setShowCarbs] = useState(false);
  const [showFats, setShowFats] = useState(false);
  const [showSteps, setShowSteps] = useState(false);

  const [history, setHistory] = useState([]);
  // const maintenanceCalories = 2500; // example

  const [maintenanceCalories, setMaintenanceCalories] = useState(2500); 
const navigate = useNavigate();

  const [isEditOpen, setIsEditOpen] = useState(false);


  const createEntry = async () => {
    const data = {
      calories: Number(calories), // required
    };
  
    if (protein) data.protein = Number(protein);
    if (carbs) data.carbs = Number(carbs);
    if (fats) data.fats = Number(fats);
    if (steps) data.steps = Number(steps);
  
    console.log(data);
  
    try {
      const res = await axios.post(
        "http://localhost:3000/api/nutrition/add",
        data,
        {
          withCredentials: true,
        }
      );
      console.log(res.data);
      //for re-rendering the page
      fetchNutrition();
    } catch (err) {
      console.error(err.response?.data || err);
    }
  };
  
  useEffect(() => {
    fetchNutrition();
  
  }, []);

  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [frequency, setFrequency] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");

  useEffect(() => {

    const fetchWeightForMaintanceCalories = async () =>{
      const response = await axios.get("http://localhost:3000/api/users/me", {
        withCredentials: true,
      })
  
      setWeight(response.data.user.weight);
      setHeight(response.data.user.height);
      setFrequency(response.data.user.frequency);
      setAge(response.data.user.age);
      setGender(response.data.user.gender);
  
      // console.log(response.data.user.weight);
      // console.log(response.data.user.height);
      // console.log(response.data.user.frequency);
      // console.log(response.data.user.age);
      // console.log(response.data.user.gender);
  
      // console.log("weight", weight);
      // console.log("height", height);
      // console.log("frequency", frequency);
      // console.log("age", age);
      // console.log("gender", gender);
    
    
     
  // convert string inputs to numbers
  const bodyWeight = Number(weight);
  const bodyHeight = Number(height);
  const trainingFrequency = Number(frequency);
  const userAge = Number(age);
  const userGender = gender;
  
  // console.log("bodyWeight", bodyWeight, "bodyHeight", bodyHeight, "trainingFrequency", trainingFrequency, "userAge", userAge, "userGender", userGender);
  
  // 1️⃣ BMR (Mifflin–St Jeor)
  let bmr;
  
  if (userGender === "female") {
    bmr =
      10 * bodyWeight +
      6.25 * bodyHeight -
      5 * userAge -
      161;
  } else {
    bmr =
      10 * bodyWeight +
      6.25 * bodyHeight -
      5 * userAge +
      5;
  }
  
  console.log(bmr);
  
  // 2️⃣ Activity multiplier based on training frequency
  let activityMultiplier = 1.2;
  
  if (trainingFrequency <= 1) activityMultiplier = 1.2;
  else if (trainingFrequency <= 3) activityMultiplier = 1.375;
  else if (trainingFrequency <= 5) activityMultiplier = 1.55;
  else if (trainingFrequency === 6) activityMultiplier = 1.725;
  else if (trainingFrequency >= 7) activityMultiplier = 1.9;
  
  // 3️⃣ Final daily calories (maintenance)
  let dailyCalories = Math.round(bmr * activityMultiplier);
  
 if(dailyCalories<2000){
  setMaintenanceCalories(2500);

 }
 else{
  setMaintenanceCalories(dailyCalories);
 }
      
     
    }
    fetchWeightForMaintanceCalories();
  }, [weight, height, frequency, age, gender]);
  

  const fetchNutrition = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/nutrition/last10days", {
        withCredentials: true,
      });
      setHistory(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };

const handleDelete = (id) =>{
    try {
      axios.delete(`http://localhost:3000/api/nutrition/delete/${id}`
        ,
        {
          withCredentials: true
        }
      );
      //for re-rendering the page
      fetchNutrition()
    } catch (error) {
      console.error(error);
    }
} 

  return (

    <UserLayout active="nutrition" >

    <div className="min-h-screen bg-black text-white px-4 py-6">
      <div className="max-w-md mx-auto space-y-6">

        {/* Maintenance Calories */}
        <div className="bg-gray-900 rounded-xl p-4 text-center border border-gray-800">
          <p className="text-gray-400 text-sm">Maintenance Calories</p>
          <h1 className="text-3xl font-bold">{maintenanceCalories} kcal</h1>
        </div>

        {/* Add Nutrition */}
        <div className="bg-gray-900 rounded-xl p-4 space-y-4 border border-gray-800">
          <h2 className="text-lg font-semibold">Add Today’s Intake</h2>

          <input
            type="number"
            placeholder="Calories"
            value={calories}
            onChange={(e) => setCalories(e.target.value)}
            className="w-full bg-black border border-gray-700 rounded-lg px-4 py-3"
          />

          {/* Checkboxes */}
          <div className="grid grid-cols-2 gap-3 text-sm text-gray-300">
            <label><input type="checkbox" onChange={(e) => 
              setShowProtein(!showProtein)} /> Protein</label>
            <label><input type="checkbox" onChange={() => setShowCarbs(!showCarbs)} /> Carbs</label>
            <label><input type="checkbox" onChange={() => setShowFats(!showFats)} /> Fats</label>
            <label><input type="checkbox" onChange={() => setShowSteps(!showSteps)} /> Steps</label>
          </div>

          {showProtein && (
            <input
              type="number"
              placeholder="Protein (g)"
              value={protein}
              onChange={(e) => setProtein(e.target.value)}
              className="w-full bg-black border border-gray-700 rounded-lg px-4 py-3"
            />
          )}

          {showCarbs && (
            <input
              type="number"
              placeholder="Carbs (g)"
              value={carbs}
              onChange={(e) => setCarbs(e.target.value)}
              className="w-full bg-black border border-gray-700 rounded-lg px-4 py-3"
            />
          )}

          {showFats && (
            <input
              type="number"
              placeholder="Fats (g)"
              value={fats}
              onChange={(e) => setFats(e.target.value)}
              className="w-full bg-black border border-gray-700 rounded-lg px-4 py-3"
            />
          )}

          {showSteps && (
            <input
              type="number"
              placeholder="Steps"
              value={steps}
              onChange={(e) => setSteps(e.target.value)}
              className="w-full bg-black border border-gray-700 rounded-lg px-4 py-3"
            />
          )}

          <button
          onClick={createEntry}
          className="w-full bg-indigo-600 py-3 rounded-lg font-semibold hover:bg-indigo-500 transition">
            Save
          </button>
        </div>

        {/* Divider */}
        <hr className="border-gray-800" />

        {/* History */}
        <div className="space-y-6 mt-8">
  <div className="flex items-center justify-between px-1">
    <h3 className="text-xl font-bold text-white flex items-center gap-2">
      <FiActivity className="text-indigo-500" />
      Last Entries
    </h3>
    <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">
      {history.length} Logs Found
    </span>
  </div>

  <div className="grid gap-4">
    <AnimatePresence mode="popLayout">
      {history.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-gray-900/50 border-2 border-dashed border-gray-800 rounded-2xl py-12 text-center"
        >
          <p className="text-gray-500 font-medium">No nutrition entries yet.</p>
        </motion.div>
      ) : (
        history.map((item, index) => (
          <motion.div
            key={item._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ delay: index * 0.05 }}
            className="group relative bg-gray-900/40 border border-gray-800 hover:border-indigo-500/50 backdrop-blur-md rounded-2xl p-5 transition-all duration-300"
          >
            {/* Header: Date & Actions */}
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-2 text-indigo-400">
                <FiCalendar className="text-sm" />
                <span className="text-xs font-bold uppercase tracking-tighter">
                  {new Date(item.date).toLocaleDateString('en-US', { 
                    weekday: 'short', 
                    month: 'short', 
                    day: 'numeric' 
                  })}
                </span>
              </div>
              
              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
  onClick={() => navigate(`/nutrition/edit/${item._id}`)}
  className="p-2 bg-gray-800 hover:bg-indigo-600 rounded-lg text-white transition-colors"
  title="Edit Entry"
>
  <FiEdit2 size={14} />
</button>
              

                <button 
                  onClick={() => handleDelete(item._id)} // replace with your func
                  className="p-2 bg-gray-800 hover:bg-red-600 rounded-lg text-white transition-colors"
                  title="Delete Entry"
                >
                  <FiTrash2 size={14} />
                </button>
              </div>
            </div>

            {/* Main Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="flex flex-col">
                <span className="text-[10px] text-gray-500 uppercase font-black">Calories</span>
                <span className="text-lg font-black text-white italic">{item.calories}</span>
              </div>

              {/* Only show steps if they exist */}
              {item.steps && (
                <div className="flex flex-col border-l border-gray-800 pl-4">
                  <span className="text-[10px] text-gray-500 uppercase font-black">Steps</span>
                  <span className="text-lg font-black text-indigo-400 italic">{item.steps.toLocaleString()}</span>
                </div>
              )}

              {/* Macros Row */}
              <div className="col-span-2 md:col-span-1 flex items-center gap-3 bg-black/40 rounded-xl px-3 py-2 mt-2 md:mt-0">
                {item.protein && (
                  <div className="text-center flex-1">
                    <p className="text-[8px] text-gray-600 uppercase font-bold">P</p>
                    <p className="text-xs font-bold text-white">{item.protein}g</p>
                  </div>
                )}
                {item.carbs && (
                  <div className="text-center flex-1 border-x border-gray-800">
                    <p className="text-[8px] text-gray-600 uppercase font-bold">C</p>
                    <p className="text-xs font-bold text-white">{item.carbs}g</p>
                  </div>
                )}
                {item.fats && (
                  <div className="text-center flex-1">
                    <p className="text-[8px] text-gray-600 uppercase font-bold">F</p>
                    <p className="text-xs font-bold text-white">{item.fats}g</p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        ))
      )}
    </AnimatePresence>
  </div>
</div>

      </div>
    </div>

     </UserLayout>
  );
};

export default NutritionPage;
