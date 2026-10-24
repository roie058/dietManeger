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

5. **🍱 Batch Meal Prep Planner & 7-Day Architecture**
   - Structured templates for multi-day meal preps with macro breakdowns
   - Reheating and storage tips
   - 7-Day calendar planner with 1-click export of recipe ingredients directly to your Shopping List

6. **🛒 Smart Categorized Shopping List**
   - Grouped by grocery department (Produce, Meat & Poultry, Fish, Dairy, Pantry, etc.)
   - Real-time checked-off counter
   - Fast item addition and cleanup

7. **📱 Mobile-First Architecture & Thumb-Zone Ergonomics**
   - Ergonomic fixed bottom navigation bar (`MobileBottomNav`) for one-handed operation on mobile devices
   - 1-Tap Floating Action Button (`MobileQuickAddFab`) in thumb reach for instant barcode scanning, label OCR, and custom logging
   - Fitts' Law touch targets ($\ge 44-48\text{px}$), zero iOS auto-zoom disruption, and safe-area notch support (`viewport-fit=cover`)
   - Native bottom-sheet modals with smooth drawer gestures

8. **☁️ Permanent Cloud Storage & Multi-Device Sync (Supabase)**
   - **Zero Data Loss**: Immune to accidental browser clearing, cache wipes, or private browsing closures.
   - **Browser Storage Persistence API**: Automatically requests `navigator.storage.persist()` on app startup to lock local data against storage eviction.
   - **Cross-Device Cloud Sync**: Backs up biometric profile, daily history, food library, recipes, and body composition to a secure Supabase PostgreSQL database using Row-Level Security (RLS).
   - **Debounced Auto-Sync**: Automatically pushes changes to the cloud in the background.
   - **Manual JSON Backup & Restore**: 1-click export to download all data as `.json` file to local disk anytime, with instant restore.

9. **📲 Progressive Web App (PWA) & Offline Support**
   - Standalone mobile app installation for iOS and Android
   - Service worker asset caching with offline readiness
   - Fast launch from home screen with app icon and theme color

10. **⚠️ Unhealthy Habits & Dietary Caution Nutrients Tracker**
    - Daily upper limit tracking for **Trans Fat** (0g limit), **Dietary Cholesterol** (&le;300mg), **Sodium / Salt** (&le;2300mg), **Saturated Fat** (&le;20g), and **Added Sugars** (&le;36g)
    - **Cardiovascular Sodium-to-Potassium (Na:K) Ratio** clinical indicator (target &le;1.0)
    - **Circadian Digestive Window**: Late-night eating detection (>350 kcal after 9:00 PM)
    - Automatic extraction via Barcode scanning and OCR Nutrition Facts label reader
    - Habit Safety Score (0–100%) with clinical countermeasures and food swaps

---

## 🛠️ Project Structure

```
dietManeger/
├── package.json               # Dependencies (React 18, Vite 4, Lucide Icons, html5-qrcode, tesseract.js)
├── vite.config.js             # Vite development & manual chunking configuration
├── index.html                 # Entry HTML with safe-area meta & Google Fonts
├── supabase_schema.sql        # Supabase PostgreSQL DDL with Row-Level Security (RLS)
├── .env.example               # Clean environment configuration template
├── .gitignore
├── src/
│   ├── main.jsx               # React DOM entry point & Service Worker registration
│   ├── App.jsx                # App layout, state coordination & navigation
│   ├── index.css              # Dark-mode design system with glassmorphism, mobile tokens & utilities
│   ├── data/
│   │   ├── initialData.js     # Default user profile, food library, initial meals & recipes
│   │   ├── defaultWeeklyPlan.js# Default 7-day nutritional structure
│   │   └── vitaminsMinerals.js# Clinical micronutrient RDA & food sources database
│   ├── utils/
│   │   ├── calculators.js     # BMR, TDEE, macro split, micronutrient & hydration math
│   │   ├── cloudSync.js       # Supabase authentication & debounced cloud synchronization
│   │   ├── storage.js         # LocalStorage read/write wrapper & persistent storage API
│   │   ├── barcodeService.js  # Open Food Facts API barcode resolution
│   │   └── nutritionOcrParser.js # Optical character recognition text parser for nutrition labels
│   └── components/
│       ├── Navbar.jsx         # Responsive desktop/mobile header with 4 core pillars
│       ├── MobileBottomNav.jsx# Ergonomic fixed bottom navigation bar & "More" drawer sheet
│       ├── MobileQuickAddFab.jsx # Thumb-zone floating action button for 1-tap food/barcode/water logging
│       ├── OnboardingModal.jsx# 3-step interactive setup wizard for initial metabolic calibration
│       ├── MacroDashboard.jsx # Calorie/macro rings, meal log, quick water, progressive deep-dive
│       ├── PlanHub.jsx        # Consolidated hub for Weekly Calendar, Recipes, Shopping List & Food DB
│       ├── ProfileHub.jsx     # Consolidated hub for Goals, TDEE, Body Composition & Cloud Sync
│       ├── DateNavigator.jsx  # Multi-day history date switcher & analytics toggle
│       ├── HistoricalAnalytics.jsx # Multi-day trends, calorie deficit, weight curve & macro split
│       ├── AddFoodModal.jsx   # 3-in-1 logger: Manual, Camera Barcode & Photo Label OCR
│       ├── CloudSyncModal.jsx # Supabase cloud account sync & JSON backup/restore
│       ├── WeeklyMealCalendar.jsx # 7-day drag/assign planner & auto-shopping list generator
│       ├── TdeeCalculator.jsx # BMR/TDEE calculator and target setter
│       ├── VitaminGuide.jsx   # Micronutrient guide and daily checklist
│       ├── WaterTracker.jsx   # Water intake tracker with quick logs
│       ├── MealPlanner.jsx    # Batch cooking recipe planner
│       └── ShoppingList.jsx   # Aisle-grouped grocery checklist
```

---

## 💻 Getting Started & Scripts

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables (Optional)
NutriFlow works 100% offline and locally out of the box. For cloud synchronization across devices, copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

And set your Supabase credentials:
```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-public-key
```

### 3. Start Development Server
```bash
npm run dev
```
Open your browser to `http://localhost:3000`.

### 4. Build for Production
```bash
npm run build
```
Creates an optimized production bundle with vendor chunking in `dist/`.

### 5. Preview Production Build
```bash
npm run preview
```
