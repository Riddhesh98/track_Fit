import { useEffect, useState } from "react";
import axios from "axios";
import { FiEdit2, FiTrash2, FiCalendar, FiPlus, FiCheck } from "react-icons/fi";
import { MdOutlineRestaurant } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import UserLayout from "../../components/layouts/UserLayout";

const NutritionPage = () => {
  const [calories, setCalories] = useState("");
  const [protein, setProtein] = useState("");
  const [carbs, setCarbs] = useState("");
  const [fats, setFats] = useState("");
  const [steps, setSteps] = useState("");

  const [history, setHistory] = useState([]);
  const [maintenanceCalories, setMaintenanceCalories] = useState(2500);
  const navigate = useNavigate();

  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  const createEntry = async (e) => {
    if (e) e.preventDefault();
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
      await axios.post(
        "http://localhost:3000/api/nutrition/add",
        data,
        { withCredentials: true }
      );
      setCalories("");
      setProtein("");
      setCarbs("");
      setFats("");
      setSteps("");
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
    const fetchWeightForMaintanceCalories = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/users/me", {
          withCredentials: true,
        });

        setWeight(response.data.user.weight);
        setHeight(response.data.user.height);
        setFrequency(response.data.user.frequency);
        setAge(response.data.user.age);
        setGender(response.data.user.gender);

        const bodyWeight = Number(response.data.user.weight);
        const bodyHeight = Number(response.data.user.height);
        const trainingFrequency = Number(response.data.user.frequency);
        const userAge = Number(response.data.user.age);
        const userGender = response.data.user.gender;

        let bmr;
        if (userGender === "female") {
          bmr = 10 * bodyWeight + 6.25 * bodyHeight - 5 * userAge - 161;
        } else {
          bmr = 10 * bodyWeight + 6.25 * bodyHeight - 5 * userAge + 5;
        }

        let activityMultiplier = 1.2;
        if (trainingFrequency <= 1) activityMultiplier = 1.2;
        else if (trainingFrequency <= 3) activityMultiplier = 1.375;
        else if (trainingFrequency <= 5) activityMultiplier = 1.55;
        else if (trainingFrequency === 6) activityMultiplier = 1.725;
        else if (trainingFrequency >= 7) activityMultiplier = 1.9;

        let dailyCalories = Math.round(bmr * activityMultiplier);

        if (dailyCalories < 2000 || isNaN(dailyCalories)) {
          setMaintenanceCalories(2500);
        } else {
          setMaintenanceCalories(dailyCalories);
        }
      } catch (e) {
        console.error("Failed to fetch user parameters", e);
      }
    };
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

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/api/nutrition/delete/${id}`, {
        withCredentials: true,
      });
      setConfirmDeleteId(null);
      fetchNutrition();
    } catch (error) {
      console.error(error);
    }
  };

  const latestEntry = history.length ? history[0] : null;
  const currentCalories = latestEntry ? latestEntry.calories : 0;
  const caloriePercent = Math.min(100, Math.round((currentCalories / maintenanceCalories) * 100));

  return (
    <UserLayout active="nutrition">
      <div className="space-y-8 pb-12">
        {/* HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-gray-200">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <MdOutlineRestaurant className="text-orange-600" size={18} />
              <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500">Nutrition Studio</span>
            </div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">
              Macro & Energy Targets
            </h1>
          </div>
          <div className="text-xs font-bold text-gray-600 bg-white border border-gray-200 px-3 py-1.5 rounded-lg shadow-xs self-start sm:self-auto">
            {history.length} Saved Entries
          </div>
        </div>

        {/* MAINTENANCE BASELINE & PROGRESS BAR */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-xs space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 block">Calculated Daily Maintenance Target</span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-3xl font-black text-gray-900">{maintenanceCalories}</span>
                <span className="text-sm font-bold text-gray-500">kcal / day</span>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Estimated from your age ({age || "24"}), height ({height || "175"} cm), and activity level.
              </p>
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 min-w-[220px] space-y-2">
              <div className="flex justify-between items-center text-xs font-bold">
                <span className="text-gray-500 uppercase tracking-wider text-[10px]">Today's Progress</span>
                <span className="text-gray-900">{currentCalories} / {maintenanceCalories} kcal</span>
              </div>
              <div className="w-full bg-gray-200 h-2.5 rounded-full overflow-hidden">
                <div
                  className="bg-orange-600 h-full transition-all duration-500"
                  style={{ width: `${caloriePercent}%` }}
                />
              </div>
              <span className="block text-right text-[10px] font-bold text-orange-600">{caloriePercent}% achieved</span>
            </div>
          </div>
        </div>

        {/* SPLIT STUDIO LAYOUT */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* LEFT COLUMN FORM (5 COLS) */}
          <div className="lg:col-span-5">
            <form onSubmit={createEntry} className="bg-white border border-gray-200 rounded-xl p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <h3 className="text-sm font-black text-gray-900 uppercase tracking-wider flex items-center gap-2">
                  <FiPlus className="text-orange-600" /> Log Meal / Macro Entry
                </h3>
                <span className="text-xs text-gray-500 font-bold">{new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1">
                    Total Calories (kcal) *
                  </label>
                  <input
                    type="number"
                    min="100"
                    max="10000"
                    required
                    placeholder="2400"
                    value={calories}
                    onChange={(e) => setCalories(e.target.value)}
                    className="w-full h-11 px-3 bg-gray-50 border border-gray-200 rounded-lg text-sm font-bold text-gray-900 outline-none focus:border-orange-600 transition-colors"
                  />
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1">
                      Protein (g)
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="500"
                      placeholder="175"
                      value={protein}
                      onChange={(e) => setProtein(e.target.value)}
                      className="w-full h-10 px-2.5 bg-gray-50 border border-gray-200 rounded-lg text-xs font-bold text-gray-900 outline-none focus:border-orange-600 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1">
                      Carbs (g)
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="1000"
                      placeholder="210"
                      value={carbs}
                      onChange={(e) => setCarbs(e.target.value)}
                      className="w-full h-10 px-2.5 bg-gray-50 border border-gray-200 rounded-lg text-xs font-bold text-gray-900 outline-none focus:border-orange-600 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1">
                      Fats (g)
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="300"
                      placeholder="65"
                      value={fats}
                      onChange={(e) => setFats(e.target.value)}
                      className="w-full h-10 px-2.5 bg-gray-50 border border-gray-200 rounded-lg text-xs font-bold text-gray-900 outline-none focus:border-orange-600 transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1">
                    Daily Steps (Optional)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100000"
                    placeholder="10000"
                    value={steps}
                    onChange={(e) => setSteps(e.target.value)}
                    className="w-full h-10 px-3 bg-gray-50 border border-gray-200 rounded-lg text-xs font-bold text-gray-900 outline-none focus:border-orange-600 transition-colors"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full h-11 bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs uppercase tracking-wider rounded-lg transition-colors flex items-center justify-center gap-2 shadow-xs mt-2"
              >
                <FiCheck size={16} /> Save Macro Record
              </button>
            </form>
          </div>

          {/* RIGHT COLUMN TABULAR HISTORY (7 COLS) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <h3 className="text-sm font-black text-gray-900 uppercase tracking-wider">Historical Nutrition Records</h3>
                <span className="text-xs font-bold text-gray-500">{history.length} Logs</span>
              </div>

              {history.length === 0 ? (
                <div className="py-8 text-center bg-gray-50 rounded-lg border border-dashed border-gray-200">
                  <p className="text-xs text-gray-500 font-medium">No nutrition records logged yet.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-gray-200 text-[10px] font-bold uppercase tracking-wider text-gray-500 bg-gray-50/50">
                        <th className="py-3 px-3">Date</th>
                        <th className="py-3 px-3">Calories</th>
                        <th className="py-3 px-3">Macros (P / C / F)</th>
                        <th className="py-3 px-3">Steps</th>
                        <th className="py-3 px-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 text-xs">
                      {history.map((item) => (
                        <tr key={item._id} className="hover:bg-gray-50/80 transition-colors">
                          <td className="py-3.5 px-3 font-bold text-gray-900 flex items-center gap-1.5">
                            <FiCalendar className="text-gray-400 shrink-0" />
                            <span className="whitespace-nowrap">
                              {new Date(item.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                            </span>
                          </td>
                          <td className="py-3.5 px-3 font-black text-amber-600 whitespace-nowrap">{item.calories} kcal</td>
                          <td className="py-3.5 px-3 font-bold text-gray-800 whitespace-nowrap">
                            <span className="text-orange-600">{item.protein ?? 0}g</span> / {item.carbs ?? 0}g / {item.fats ?? 0}g
                          </td>
                          <td className="py-3.5 px-3 font-medium text-gray-500 whitespace-nowrap">{item.steps ? `${item.steps}` : "—"}</td>
                          <td className="py-3.5 px-3 text-right whitespace-nowrap">
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
                              <div className="flex items-center justify-end gap-1">
                                <button
                                  onClick={() => navigate(`/nutrition/edit/${item._id}`)}
                                  className="p-1.5 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded transition-colors"
                                  title="Edit"
                                >
                                  <FiEdit2 size={14} />
                                </button>
                                <button
                                  onClick={() => setConfirmDeleteId(item._id)}
                                  className="p-1.5 text-gray-500 hover:text-rose-600 hover:bg-gray-100 rounded transition-colors"
                                  title="Delete"
                                >
                                  <FiTrash2 size={14} />
                                </button>
                              </div>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </UserLayout>
  );
};

export default NutritionPage;
