# Food Logging System Redesign & AI Vision Integration Specification

## 1. Executive Summary & Purpose
The goal of this redesign is to make everyday food logging effortless and practical by eliminating the friction of manual macro searches for staple foods (e.g., a banana, an apple, an egg, chicken breast), while drastically improving the accuracy of nutrition label scanning through Gemini AI Vision.

---

## 2. Decision Log

| Decision ID | Decision | Alternatives Considered | Rationale |
| :--- | :--- | :--- | :--- |
| **DEC-01** | **Curated Local Whole Foods Index + Gemini Flash Vision** | Live USDA REST API; All-in-one AI query generation | Instant zero-latency search for staple foods (like bananas), zero API costs for regular lookups, and state-of-the-art accuracy for label image parsing. |
| **DEC-02** | **Portion Presets + Gram Weight Adjuster** | 100g only; Count units only | Provides the best of both worlds: convenient 1-tap everyday presets (e.g. "1 medium banana ~118g") while allowing fine-grained scale precision. |
| **DEC-03** | **Label Scanner Focus for Camera** | Open food recognition / plate scanner | Focused precision on reading complex nutritional tables (Hebrew & English) without ambiguity or hallucinated meal guesses. |
| **DEC-04** | **Dual Configuration for Gemini API Key** | Backend Edge function only; BYOK only | Primary setup via `.env` (`VITE_GEMINI_API_KEY`) with optional client settings override for flexibility and fast dev setup. |

---

## 3. Architecture & Data Model

### 3.1 Curated Whole Foods Index (`src/data/wholeFoodsData.js`)
Contains verified, USDA-referenced staple whole foods across major dietary categories:
- **Fruits**: Banana, Apple, Orange, Berries, Avocado, etc.
- **Vegetables**: Broccoli, Spinach, Cucumber, Tomato, Carrot, Sweet Potato, Potato, etc.
- **Proteins**: Chicken breast, Eggs, Salmon, Tuna, Ground beef, Tofu, etc.
- **Grains & Carbs**: White/Brown rice, Oats, Quinoa, Whole wheat bread, Pasta, etc.
- **Dairy & Healthy Fats**: Olive oil, Butter, Almonds, Walnuts, Peanut butter, Greek yogurt, Milk, etc.

Each food record follows the structure:
```javascript
{
  id: 'wf_banana',
  name: 'Banana, Raw',
  hebrewName: 'בננה',
  category: 'Carbs',
  per100g: {
    calories: 89,
    protein: 1.1,
    carbs: 22.8,
    fat: 0.3,
    fiber: 2.6,
    sugar: 12.2
  },
  portions: [
    { label: '1 medium (7" to 7-7/8" long)', grams: 118, isDefault: true },
    { label: '1 small (6" to 6-7/8" long)', grams: 101 },
    { label: '1 large (8" to 8-7/8" long)', grams: 136 },
    { label: '1 cup sliced', grams: 150 },
    { label: '100g', grams: 100 }
  ],
  micros: { potassium: 358, vit_c: 8.7, vit_b12: 0, magnesium: 27, calcium: 5, iron: 0.3 },
  cautions: { sodium: 1, cholesterol: 0, transFat: 0, saturatedFat: 0.1, addedSugar: 0 }
}
```

### 3.2 Unified Search Aggregator (`src/utils/searchAggregator.js`)
- Performs instantaneous substring & token matching over `wholeFoodsData.js` (both English and Hebrew).
- Debounces (300ms) requests to Open Food Facts (`searchProductsByName`).
- Merges results with clear distinction:
  - **🌿 Whole Foods**: Prioritized at the top of results.
  - **📦 Packaged Foods**: Follows whole foods, complete with barcode indicators and brands.

---

## 4. User Experience & Component Flow

### 4.1 Search & Portion Selection Flow in `AddFoodModal.jsx`
1. **Search Input**: User types *"banana"* or *"בננה"*.
2. **Instant Result**: *"Banana, Raw"* appears immediately with a green leaf badge and quick macro summary.
3. **Selection**: Tapping the result loads the interactive portion selector:
   - **Preset Chips**: `[1 medium (118g)]` (default selected), `[1 small (101g)]`, `[1 large (136g)]`, `[100g]`.
   - **Slider & Number Box**: Moving the slider or typing a custom gram amount scales the nutrition dynamically:
     $$\text{nutrient} = \frac{\text{selectedGrams}}{100} \times \text{per100g}$$
4. **1-Tap Log**: Tapping "Add to Meal" adds the scaled item to the user's active daily log with all macros, micros, and cautions accurately computed.

### 4.2 AI Vision Label Scanner Flow
1. User switches to the **📷 AI Label Scanner** tab.
2. User snaps a photo of the back of a product or uploads an existing photo.
3. **`geminiVisionService.js`**:
   - Compresses image to client-side base64 JPEG (<1280px).
   - Calls Google Gemini 1.5/2.5 Flash with structured system prompt and JSON schema.
   - Extracts calories, protein, carbs, fat, fiber, sodium, saturated fat, etc.
4. Extracted values populate the Food Form for one-tap review and confirmation.
5. If offline or no API key is present, it seamlessly falls back to the local OCR regex parser.

---

## 5. Technical Specifications & Dependencies

- **AI Model**: Google Gemini 1.5 Flash (`gemini-1.5-flash`) via standard REST API (`https://generativelanguage.googleapis.com/v1beta/models/...`).
- **Environment Variable**: `VITE_GEMINI_API_KEY` in `.env` with fallback to `localStorage` user setting.
- **State Management**: Existing React state within `AddFoodModal.jsx` and `App.jsx`.
- **Zero New Heavy Dependencies**: Standard `fetch` calls without requiring heavyweight external SDKs.
