import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Load environment variables
dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors()); // Allows your React frontend to communicate with this server
app.use(express.json()); // Allows the server to parse JSON bodies

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Basic health check route
app.get("/api/health", (req, res) => {
  res.json({ status: "VibeCooking Server is running! 🍳" });
});

// The core Recipe Generation Route
app.post("/api/generate-recipe", async (req, res) => {
  try {
    const { ingredients, vibe } = req.body;

    if (!ingredients || !vibe) {
      return res
        .status(400)
        .json({ error: "Ingredients and vibe are required." });
    }

    // Initialize the specific model (Flash is fast and free)
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // The Prompt Engine
    const prompt = `
      You are the VibeCooking AI. The user has the following ingredients: ${ingredients}.
      The user wants a meal with this vibe: "${vibe}".
      
      Generate a creative recipe using primarily those ingredients, plus basic pantry staples like oil, salt, and pepper. 
      Return the response in strict JSON format with the following keys:
      - recipeName (string)
      - vibeMatchRationale (string - a short sentence explaining why this fits the vibe)
      - prepTime (string - e.g., "20 minutes")
      - ingredientsList (array of strings)
      - instructions (array of strings)
      
      Do NOT include markdown formatting like \`\`\`json in your response, just the raw JSON object.
    `;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    // Parse the AI's text response into an actual JSON object
    const recipeData = JSON.parse(responseText);

    res.json(recipeData);
  } catch (error) {
    console.error("Error generating recipe:", error);
    res.status(500).json({ error: "Failed to generate recipe from AI." });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
