# 🥗 NutriFlow - Diet & Healthy Lifestyle Manager

A modern, science-based diet and healthy lifestyle application built with React, Vite, and custom CSS design system. Designed to make tracking daily macros, hitting weight loss/gain targets, optimizing micronutrients, batch cooking meal preps, and managing grocery shopping seamless and visually rewarding.

---

## 🚀 Key Features

1. **📊 Daily Macronutrient & Calorie Tracker**
   - Real-time calories consumed vs remaining
   - Interactive progress meters for Protein, Carbohydrates, and Fats
   - 1-Click Quick Food Library with common high-protein, wholesome staples
   - Custom food and meal entry logger

2. **🎯 Metabolic Rate & Goal Planner (BMR / TDEE)**
   - Mifflin-St Jeor formula calculation based on age, sex, weight, height, and activity level
   - Configurable caloric targets for **Aggressive/Steady Fat Loss**, **Maintenance**, or **Lean Muscle Bulk**
   - Flexible macro splits (High Protein, Balanced, Low Carb, Keto)
   - Hydration target calculation based on body weight

3. **💊 Micronutrients: Essential Vitamins & Minerals Guide**
   - In-depth guide for Vitamin D3, B12, Magnesium, Zinc, Iron, Omega-3, Potassium, and Calcium
   - Recommended Daily Allowances (RDA) and optimal longevity targets
   - Food sources & deficiency risks
   - Daily checklist to mark off covered micronutrients

4. **💧 Hydration Tracker**
   - Track water intake with 1-click cup/bottle logger (+250ml, +500ml, +750ml, +1L)
   - Custom milliliter logger
   - Science-backed tips on morning hydration and electrolyte balance

5. **🍱 Batch Meal Prep Planner**
   - Structured templates for multi-day meal preps with macro breakdowns
   - Reheating and storage tips
   - 1-Click export of recipe ingredients directly to your Shopping List

6. **🛒 Smart Categorized Shopping List**
   - Grouped by grocery department (Produce, Meat & Poultry, Fish, Dairy, Pantry, etc.)
   - Real-time checked-off counter
   - Fast item addition and cleanup

7. **💾 Local Storage Persistence**
   - All logs, biometric profile settings, and grocery items are automatically saved in the browser.

---

## 🛠️ Project Structure

```
dietManeger/
├── package.json               # Dependencies (React 18, Vite 4, Lucide Icons)
├── vite.config.js             # Vite development configuration
├── index.html                 # Entry HTML with Google Fonts (Outfit & Plus Jakarta Sans)
├── .gitignore
├── src/
│   ├── main.jsx               # React DOM entry point
│   ├── App.jsx                # App layout, state coordination & navigation
│   ├── index.css              # Dark-mode design system with glassmorphism & tokens
│   ├── data/
│   │   ├── initialData.js     # Default user profile, food library, initial meals & preps
│   │   └── vitaminsMinerals.js# Clinical micronutrient RDA & food sources database
│   ├── utils/
│   │   ├── calculators.js     # BMR, TDEE, macro split, and hydration math
│   │   └── storage.js         # LocalStorage read/write wrapper
│   └── components/
│       ├── Navbar.jsx         # Sticky header with active tab and streak
│       ├── MacroDashboard.jsx # Calorie/macro rings, meal log, quick-add database
│       ├── TdeeCalculator.jsx # BMR/TDEE calculator and target setter
│       ├── VitaminGuide.jsx   # Micronutrient guide and daily checklist
│       ├── WaterTracker.jsx   # Water intake tracker with quick logs
│       ├── MealPlanner.jsx    # Batch cooking recipe planner
│       └── ShoppingList.jsx   # Aisle-grouped grocery checklist
```

---

## 💻 Running Locally

To start the local development server:

```bash
npm run dev
```

Then open your browser to `http://localhost:3000`.
