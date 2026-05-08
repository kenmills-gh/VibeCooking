import { useState } from "react";

// Defining the shape of our expected JSON response
interface Recipe {
  recipeName: string;
  vibeMatchRationale: string;
  prepTime: string;
  ingredientsList: string[];
  instructions: string[];
}

function App() {
  const [ingredients, setIngredients] = useState("");
  const [vibe, setVibe] = useState(""); // Default to empty for "Surprise Me"
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // The blank string at the top acts as our "No Vibe" option
  const vibesList = [
    "",
    "15-Minute Lazy Dinner",
    "Fancy Date Night",
    "Comforting & Cozy",
    "Post-Workout Fuel",
    "Healthy & Fresh",
    "Midnight Snack",
  ];

  const generateRecipe = async () => {
    // Only throw an error if BOTH inputs are entirely empty
    if (!ingredients.trim() && !vibe) {
      setError("Please provide some ingredients or select a vibe!");
      return;
    }

    setLoading(true);
    setError("");
    setRecipe(null);

    try {
      const response = await fetch(
        "http://localhost:5000/api/generate-recipe",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ ingredients, vibe }),
        },
      );

      if (!response.ok) {
        throw new Error("Failed to fetch recipe from server");
      }

      const data = await response.json();
      setRecipe(data);
    } catch (err) {
      console.error(err);
      setError(
        "Something went wrong generating your recipe. Is the server running?",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-6 md:p-12 font-sans">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <header className="mb-10 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400 mb-2">
            VibeCooking 🍳
          </h1>
          <p className="text-slate-400 text-lg">
            Turn whatever is in your fridge into a vibe.
          </p>
        </header>

        {/* Input Section */}
        <div className="bg-slate-800 p-6 rounded-2xl shadow-xl mb-8 border border-slate-700">
          <div className="mb-5">
            <label className="block text-sm font-semibold text-slate-300 mb-2">
              What's in your kitchen? (Ingredients)
            </label>
            <textarea
              className="w-full bg-slate-900 text-slate-100 border border-slate-600 rounded-lg p-4 focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all"
              rows={3}
              placeholder="e.g., chicken breast, leftover rice, soy sauce... (Optional if selecting a vibe)"
              value={ingredients}
              onChange={(e) => setIngredients(e.target.value)}
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-semibold text-slate-300 mb-2">
              Select the Vibe
            </label>
            <select
              className="w-full bg-slate-900 text-slate-100 border border-slate-600 rounded-lg p-4 focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all"
              value={vibe}
              onChange={(e) => setVibe(e.target.value)}
            >
              <option value="">✨ Any Vibe / Surprise Me</option>
              {vibesList
                .filter((v) => v !== "")
                .map((v) => (
                  <option key={v} value={v}>
                    {v}
                  </option>
                ))}
            </select>
          </div>

          {error && <p className="text-red-400 text-sm mb-4">{error}</p>}

          <button
            onClick={generateRecipe}
            disabled={loading}
            className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white font-bold py-4 px-6 rounded-lg transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg"
          >
            {loading ? "Cooking up a vibe... 👨‍🍳" : "Generate Recipe"}
          </button>
        </div>

        {/* Results Section */}
        {recipe && (
          <div className="bg-slate-800 p-6 md:p-8 rounded-2xl shadow-2xl border border-emerald-500/30 animate-fade-in-up">
            <div className="mb-6 border-b border-slate-700 pb-6 text-center">
              <h2 className="text-3xl font-bold text-emerald-400 mb-3">
                {recipe.recipeName}
              </h2>
              <p className="text-slate-300 italic mb-2">
                "{recipe.vibeMatchRationale}"
              </p>
              <div className="inline-block bg-slate-900 px-4 py-2 rounded-full text-sm font-medium text-cyan-400">
                ⏱️ Prep Time: {recipe.prepTime}
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {/* Ingredients List */}
              <div className="md:col-span-1 bg-slate-900/50 p-5 rounded-xl border border-slate-700/50">
                <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                  🛒 Ingredients
                </h3>
                <ul className="space-y-2">
                  {recipe.ingredientsList.map((item, idx) => (
                    <li
                      key={idx}
                      className="text-slate-300 text-sm flex items-start"
                    >
                      <span className="text-emerald-500 mr-2">•</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Instructions */}
              <div className="md:col-span-2">
                <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                  📝 Instructions
                </h3>
                <ol className="space-y-4">
                  {recipe.instructions.map((step, idx) => (
                    <li
                      key={idx}
                      className="flex gap-4 bg-slate-900/30 p-4 rounded-xl"
                    >
                      <span className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 font-bold">
                        {idx + 1}
                      </span>
                      <span className="text-slate-300 leading-relaxed">
                        {step}
                      </span>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
