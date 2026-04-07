import 'dotenv/config'; // 👈 ADD THIS LINE AT THE TOP
import { GoogleGenerativeAI } from "@google/generative-ai";
import { User } from "../models/user.model.js";
import { Nutrition } from "../Models/nutrition.model.js";
import { Weight } from "../Models/Weight.model.js";
import PR from "../Models/PR.model.js";

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const getAICoachResponse = async (req, res) => {
  try {
    const { message } = req.body; // The user's question
    const userId = req.user._id;

    // --- STEP 1: GATHER ALL USER DATA (PARALLEL FETCHING) ---
    // We use Promise.all to fetch everything at once for speed
    const [userProfile, recentNutrition, weightHistory, prs] = await Promise.all([
      User.findById(userId).select("-password"), // Get profile (height, age, etc)
      
      // Get last 14 days of nutrition to see eating habits
      Nutrition.find({ user: userId }).sort({ date: -1 }).limit(14),
      
      // Get last 30 days weight entries to see trends
      Weight.find({ user: userId }).sort({ date: -1 }).limit(30),
      
      // Get all Personal Records
      PR.find({ user: userId }),
    ]);

    // --- STEP 2: FORMAT DATA FOR THE AI CONTEXT ---
    
    // Format Nutrition Data for the prompt
    const nutritionSummary = recentNutrition.map(n => 
      `- ${new Date(n.date).toDateString()}: ${n.calories}kcal (P:${n.protein}g, C:${n.carbs}g, F:${n.fats}g)`
    ).join("\n");

    // Format Weight Data
    const weightSummary = weightHistory.map(w => 
      `- ${new Date(w.date).toDateString()}: ${w.weight}kg`
    ).join("\n");

    // Format PR Data
    const prSummary = prs.map(p => 
      `- ${p.name}: ${p.weight}kg x ${p.reps} reps`
    ).join("\n");

    // --- STEP 3: CONSTRUCT THE SUPER-PROMPT ---
    const systemPrompt = `
      You are "TrackFit AI", an elite personal fitness & nutrition coach.
      
      **USER PROFILE:**
      - Name: ${userProfile.name}
      - Age: ${userProfile.age} | Gender: ${userProfile.gender}
      - Height: ${userProfile.height}cm
      - Goal Frequency: ${userProfile.frequency} days/week

      **RECENT DATA (Analyze this to give specific advice):**
      
      1. NUTRITION (Last 14 Days):
      ${nutritionSummary || "No logs yet."}
      
      2. WEIGHT TREND (Last 30 Entries):
      ${weightSummary || "No logs yet."}
      
      3. GYM RECORDS (Current PRs):
      ${prSummary || "No records yet."}

      **USER'S QUESTION:**
      "${message}"

     **INSTRUCTIONS:**
      - **PROTEIN RULE:** Be lenient with protein. Do NOT critique their protein intake unless it is critically low (e.g., under 50-60g). Remember that for users with higher body fat, 0.8g-1g per kg of *Lean Body Mass* is sufficient. If an 80kg user eats 80-90g protein, tell them that is likely GOOD enough. Only flag it if it's very low.just tell in a sweet  way to increase it a bit for better results if they can(if they needed it).
      - **CALORIES:** Analyze if they are eating too little/much based on their weight trend.
      - **TRAINING:** If their PRs look unbalanced (e.g., strong bench but weak squat), mention it gently.
      - **TONE:** Keep the answer concise, motivating, and actionable. Do not simply list their data back to them; use it to answer the question.
    
      1. BE EXTREMELY CONCISE: Your default response should be 2 to 3 short sentences. Get straight to the point like you are texting a client. 
      2. EXPAND ONLY ON DEMAND: Only provide a long, detailed analysis (like reviewing calories, PRs, or a full routine) if the user explicitly asks for a "review", "details", "plan", or asks a complex "why" question.
      3. CONTEXTUAL AWARENESS: Use the provided data to answer their question, but do NOT list their stats back to them unless necessary to make your point.
      4. PROTEIN LENIENCY: If you must critique nutrition, remember that 0.8g-1g of protein per kg of *Lean Body Mass* is enough. Don't nag them about protein unless it is critically low (under 60g).
      5. TONE: Confident, casual, motivating, and highly actionable. No fluff.
    
      `;

    // --- STEP 4: SEND TO GEMINI ---
    const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });
    const result = await model.generateContent(systemPrompt);
    const response = await result.response;
    const text = response.text();

    // --- STEP 5: SEND REPLY ---
    res.status(200).json({ success: true, reply: text });

  } catch (error) {
    console.error("AI Coach Error:", error);
    res.status(500).json({ 
      success: false, 
      message: "The coach is reviewing your logs... (Server Error, try again)." 
    });
  }
};

