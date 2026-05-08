import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

// 1. Configuration & Setup
dotenv.config();
const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

// 2. Helper Functions (Separation of Concerns)
/**
 * Handles the logic of prompting Gemini and cleaning the response.
 */
const fetchRecipeFromAI = async (ingredients, vibe) => {
  let userContext = "";

  if (ingredients && vibe) {
    userContext = `The user has the following ingredients: ${ingredients}. The user wants a meal with this vibe: "${vibe}". Use primarily these ingredients.`;
  } else if (ingredients) {
    userContext = `The user has the following ingredients: ${ingredients}. Generate a delicious and practical recipe using primarily these ingredients.`;
  } else if (vibe) {
    userContext = `The user wants a meal with this vibe: "${vibe}". They are going grocery shopping, so suggest a fantastic recipe that perfectly fits this mood.`;
  }

  const prompt = `
    You are the VibeCooking AI. 
    ${userContext}
    
    Generate a creative recipe. You can assume they have basic pantry staples like oil, salt, and pepper. 
    Return the response in strict JSON format with the following keys:
    - recipeName (string)
    - vibeMatchRationale (string - a short sentence explaining why this fits the vibe or the ingredients)
    - prepTime (string - e.g., "20 minutes")
    - ingredientsList (array of strings)
    - instructions (array of strings)
    
    Do NOT include markdown formatting. Return ONLY raw JSON.
  `;

  const result = await model.generateContent(prompt);
  let responseText = result.response.text();

  // CRITICAL FIX: Strip formatting if the AI hallucinates markdown tags
  responseText = responseText
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();

  return JSON.parse(responseText);
};

// 3. API Routes
app.get("/api/health", (req, res) => {
  res.json({ status: "VibeCooking Server is running! 🍳" });
});

app.post("/api/generate-recipe", async (req, res) => {
  try {
    const { ingredients, vibe } = req.body;

    // Validation
    if (!ingredients && !vibe) {
      return res
        .status(400)
        .json({ error: "Please provide either ingredients, a vibe, or both!" });
    }

    // Call the isolated AI function
    const recipeData = await fetchRecipeFromAI(ingredients, vibe);

    res.status(200).json(recipeData);
  } catch (error) {
    console.error("Error generating recipe:", error.message);
    res.status(500).json({
      error: "Failed to generate recipe from AI.",
      details: error.message,
    });
  }
});

// 4. Start Server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
