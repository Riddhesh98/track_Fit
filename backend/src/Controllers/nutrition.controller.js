import { Nutrition } from "../Models/nutrition.model.js";
export const addNutrition = async (req, res) => {
  try {
    const { calories, protein, carbs, fats, steps, date } = req.body;

    if (!calories) {
      return res.status(400).json({ message: "Calories are required" });
    }

    console.log("from nutrition controller", req.user);

    // If date not provided, use today's date (YYYY-MM-DD)
    const nutritionDate =
      date || new Date().toISOString().split("T")[0];

    const nutrition = await Nutrition.findOneAndUpdate(
      { user: req.user._id, date: nutritionDate }, // condition
      {
        $set: {
          calories,
          protein,
          carbs,
          fats,
          steps,
        },
      },
      {
        new: true,
        upsert: true, // create if not exists
      }
    );

    res.status(200).json({
      success: true,
      message: "Nutrition saved successfully",
      data: nutrition,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

  export const getLast10DaysNutrition = async (req, res) => {
    try {
      const nutrition = await Nutrition.find({
        user: req.user._id,
      })
        .sort({ date: -1 })
        .limit(10);
  
      res.status(200).json({
        success: true,
        data: nutrition,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };
  
  