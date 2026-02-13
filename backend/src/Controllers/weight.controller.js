import { Weight } from "../Models/Weight.model.js";

// 1. Add or Update Weight (Upsert)
export const addWeight = async (req, res) => {
  try {
    const { weight, date } = req.body;
    const userId = req.user._id;
    const entryDate = date || new Date().toISOString().split('T')[0];

    const newEntry = await Weight.findOneAndUpdate(
      { user: userId, date: entryDate },
      { weight },
      { new: true, upsert: true } // Create if doesn't exist, update if it does
    );

    res.status(201).json({ success: true, data: newEntry });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 2. Get Weight Data (Graph + History)
export const getWeightData = async (req, res) => {
  try {
    const userId = req.user._id;

    // Fetch ALL data for the graph, sorted by date (Oldest -> Newest)
    const allData = await Weight.find({ user: userId }).sort({ date: 1 });

    // Create a copy and reverse it for the "History List" (Newest -> Oldest)
    // We slice the last 14 items for the list view
    const historyData = [...allData].reverse().slice(0, 14);

    res.status(200).json({
      success: true,
      graphData: allData, // Send all data for the chart
      history: historyData, // Send only 14 for the list
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};



// 3. Delete Weight Entry
export const deleteWeight = async (req, res) => {
    try {
      const { id } = req.params;
      await Weight.findOneAndDelete({ _id: id, user: req.user._id });
      res.status(200).json({ success: true, message: "Deleted successfully" });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  };
  
  // 4. Update Weight Entry (By ID)
  export const updateWeight = async (req, res) => {
    try {
      const { id } = req.params;
      const { weight, date } = req.body;
  
      const updated = await Weight.findOneAndUpdate(
        { _id: id, user: req.user._id },
        { weight, date }, // Allow updating date too if needed
        { new: true, runValidators: true }
      );
  
      res.status(200).json({ success: true, data: updated });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  };