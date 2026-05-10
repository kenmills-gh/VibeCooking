import { useState } from "react";

interface Recipe {
  recipeName: string;
  vibeMatchRationale: string;
  prepTime: string;
  ingredientsList: string[];
  instructions: string[];
}

function App() {
  const [ingredients, setIngredients] = useState("");
  const [vibe, setVibe] = useState("");
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const generateRecipe = async () => {
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
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ingredients, vibe }),
        },
      );

      if (!response.ok) throw new Error("Failed to fetch recipe from server");

      const data = await response.json();
      setRecipe(data);
    } catch (err) {
      console.error(err);
      setError("Something went wrong generating your recipe.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-background text-on-background font-body-md min-h-screen flex flex-col">
      {/* TopNavBar */}
      <header className="bg-background shadow-[0px_4px_20px_rgba(57,103,86,0.05)] sticky top-0 z-40 hidden md:block">
        <div className="flex justify-between items-center px-4 md:px-16 py-4 w-full max-w-[1280px] mx-auto">
          <div className="font-headline-md text-headline-md font-bold text-primary">
            VibeCooking
          </div>
          <nav className="flex gap-8 items-center">
            <a
              className="text-primary font-label-bold text-label-bold border-b-2 border-primary pb-1"
              href="#"
            >
              Explore
            </a>
            <a
              className="text-secondary font-label-bold text-label-bold hover:text-primary transition-colors"
              href="#"
            >
              My Library
            </a>
            <a
              className="text-secondary font-label-bold text-label-bold hover:text-primary transition-colors"
              href="#"
            >
              Meal Planner
            </a>
          </nav>
          <div className="flex gap-4 items-center">
            <button className="text-secondary hover:text-primary transition-colors">
              <span className="material-symbols-outlined">notifications</span>
            </button>
            <button className="text-secondary hover:text-primary transition-colors">
              <span className="material-symbols-outlined">account_circle</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Canvas */}
      <main className="flex-grow w-full max-w-[1280px] mx-auto px-4 md:px-16 py-8 md:py-12 space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Input Form */}
          <section className="lg:col-span-5 space-y-6">
            <div className="bg-surface-container-lowest rounded-xl p-6 md:p-8 shadow-[0px_4px_20px_rgba(57,103,86,0.05)] border border-surface-container hover:scale-[1.02] transition-transform duration-300">
              <h2 className="font-headline-sm text-headline-sm text-secondary mb-6">
                Start Cooking
              </h2>
              <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                <div className="space-y-2">
                  <label className="font-label-bold text-label-bold text-on-surface-variant block">
                    What's in your fridge?
                  </label>
                  <textarea
                    className="w-full rounded-lg border border-outline-variant bg-surface-container-lowest px-4 py-3 text-on-background focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary font-body-md transition-colors resize-none placeholder:text-outline"
                    placeholder="e.g., Salmon, Asparagus, Lemon..."
                    rows={4}
                    value={ingredients}
                    onChange={(e) => setIngredients(e.target.value)}
                  />
                  {error && (
                    <p className="text-error font-label-sm text-label-sm">
                      {error}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="font-label-bold text-label-bold text-on-surface-variant block">
                    Choose your Vibe
                  </label>
                  <select
                    className="w-full rounded-lg border border-outline-variant bg-surface-container-lowest px-4 py-3 text-on-background focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary font-body-md transition-colors"
                    value={vibe}
                    onChange={(e) => setVibe(e.target.value)}
                  >
                    <option value="">✨ Surprise Me...</option>
                    <option value="Cozy Night In">Cozy Night In</option>
                    <option value="Gourmet Date Night">
                      Gourmet Date Night
                    </option>
                    <option value="Quick & Healthy">Quick & Healthy</option>
                    <option value="Late Night Snack">Late Night Snack</option>
                    <option value="Party Appetizer">Party Appetizer</option>
                  </select>
                </div>

                <button
                  type="button"
                  onClick={generateRecipe}
                  disabled={loading}
                  className="w-full bg-primary text-on-primary hover:bg-primary-container hover:text-on-primary-container rounded-lg py-4 px-6 flex items-center justify-center gap-2 font-label-bold text-label-bold transition-all duration-200 shadow-sm hover:shadow-md disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  <span className="material-symbols-outlined">
                    auto_awesome
                  </span>
                  {loading ? "Cooking..." : "Generate Recipe"}
                </button>
              </form>
            </div>

            {/* Decorative Image Card */}
            <div className="hidden lg:block bg-surface-container-lowest rounded-xl overflow-hidden shadow-[0px_4px_20px_rgba(57,103,86,0.05)] h-64 relative group">
              <img
                src="https://images.unsplash.com/photo-1467003909585-2f8a72700288?q=80&w=800&auto=format&fit=crop"
                alt="Fresh ingredients"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
                <p className="font-headline-sm text-headline-sm text-on-primary">
                  Fresh Inspiration
                </p>
              </div>
            </div>
          </section>

          {/* Right Column: Dynamic Content Area */}
          <section className="lg:col-span-7 space-y-6">
            {/* 1. Loading State */}
            {loading && (
              <div className="bg-surface-container-lowest rounded-xl p-12 shadow-[0px_4px_20px_rgba(57,103,86,0.05)] border border-surface-container flex flex-col items-center justify-center text-center h-full min-h-[400px]">
                <span className="material-symbols-outlined text-display-lg text-primary animate-spin mb-6">
                  restaurant_menu
                </span>
                <h3 className="font-headline-md text-headline-md shimmer mb-2">
                  AI is cooking...
                </h3>
                <p className="font-body-md text-body-md text-on-surface-variant">
                  Crafting the perfect recipe for your vibe.
                </p>
              </div>
            )}

            {/* 2. Recipe Output State */}
            {!loading && recipe && (
              <div className="bg-surface-container-lowest rounded-xl p-6 md:p-8 shadow-[0px_4px_20px_rgba(57,103,86,0.05)] border border-surface-container flex flex-col gap-8 hover:shadow-lg transition-shadow duration-300">
                <div className="border-b border-surface-variant pb-6">
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="bg-primary-fixed text-on-primary-fixed-variant px-3 py-1 rounded-full font-label-sm text-label-sm">
                      {vibe || "Chef's Surprise"}
                    </span>
                    <span className="bg-secondary-fixed text-on-secondary-fixed-variant px-3 py-1 rounded-full font-label-sm text-label-sm">
                      AI Generated
                    </span>
                  </div>
                  <h1 className="font-display-lg-mobile md:font-display-lg text-display-lg-mobile md:text-display-lg text-secondary mb-4">
                    {recipe.recipeName}
                  </h1>
                  <div className="bg-surface-container-low p-4 rounded-lg border-l-4 border-primary">
                    <p className="font-body-md text-body-md text-on-surface-variant italic">
                      "{recipe.vibeMatchRationale}"
                    </p>
                  </div>
                  <div className="flex items-center gap-6 mt-6">
                    <div className="flex items-center gap-2 text-tertiary">
                      <span className="material-symbols-outlined">
                        schedule
                      </span>
                      <span className="font-label-bold text-label-bold">
                        {recipe.prepTime}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="font-headline-sm text-headline-sm text-secondary mb-4 flex items-center gap-2">
                      <span className="material-symbols-outlined text-primary">
                        kitchen
                      </span>
                      Ingredients
                    </h3>
                    <ul className="space-y-3">
                      {recipe.ingredientsList.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-3">
                          <input
                            type="checkbox"
                            className="mt-1 rounded border-outline text-primary focus:ring-primary w-4 h-4"
                          />
                          <span className="font-body-md text-body-md text-on-background">
                            {item}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-headline-sm text-headline-sm text-secondary mb-4 flex items-center gap-2">
                      <span className="material-symbols-outlined text-primary">
                        skillet
                      </span>
                      Instructions
                    </h3>
                    <ol className="space-y-6 relative border-l border-surface-variant ml-3 pl-6">
                      {recipe.instructions.map((step, idx) => (
                        <li key={idx} className="relative">
                          <span className="absolute -left-[35px] bg-primary text-on-primary w-6 h-6 rounded-full flex items-center justify-center font-label-bold text-label-sm shadow-sm">
                            {idx + 1}
                          </span>
                          <p className="font-body-md text-body-md text-on-background">
                            {step}
                          </p>
                        </li>
                      ))}
                    </ol>
                  </div>
                </div>

                <div className="mt-4 flex gap-4 pt-6 border-t border-surface-variant">
                  <button className="flex-1 bg-surface-variant text-on-surface hover:bg-tertiary-container transition-colors py-3 px-6 rounded-lg font-label-bold text-label-bold flex items-center justify-center gap-2">
                    <span className="material-symbols-outlined">
                      bookmark_border
                    </span>
                    Save Recipe
                  </button>
                  <button className="flex-1 border-2 border-secondary text-secondary hover:bg-secondary-container transition-colors py-3 px-6 rounded-lg font-label-bold text-label-bold flex items-center justify-center gap-2">
                    <span className="material-symbols-outlined">share</span>
                    Share
                  </button>
                </div>
              </div>
            )}

            {/* 3. Empty State (Before searching) */}
            {!loading && !recipe && (
              <div className="hidden lg:flex bg-surface-container-lowest rounded-xl p-12 shadow-[0px_4px_20px_rgba(57,103,86,0.05)] border border-surface-container flex-col items-center justify-center text-center h-full min-h-[400px]">
                <span className="material-symbols-outlined text-display-lg text-tertiary mb-6 opacity-50">
                  ramen_dining
                </span>
                <h3 className="font-headline-md text-headline-md text-secondary mb-2">
                  Ready to Cook?
                </h3>
                <p className="font-body-md text-body-md text-on-surface-variant">
                  Tell me what you have, and I'll find the perfect recipe.
                </p>
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}

export default App;
