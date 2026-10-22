/**
 * Smart Nutrition Facts Label Parser
 * Extracts Calories, Macronutrients and Micronutrients from OCR text
 * Supports both Hebrew (סימון תזונתי) and English (Nutrition Facts) formats.
 */
import { calculateCaloriesFromMacros } from './calculators'

export function parseNutritionText(rawText) {
  if (!rawText || typeof rawText !== 'string') {
    return {
      name: '',
      serving: '100g',
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0,
      micros: {},
      rawExtracted: {}
    }
  }

  // Normalize text: replace commas in decimals (e.g. "12,5" -> "12.5")
  const normalized = rawText
    .replace(/(\d+),(\d+)/g, '$1.$2')
    .replace(/[־–—]/g, '-')
    .replace(/\r\n/g, '\n')

  const lines = normalized.split('\n').map(l => l.trim()).filter(Boolean)

  const result = {
    name: '',
    serving: '100g',
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
    micros: {
      vit_d: 0,
      vit_b12: 0,
      vit_c: 0,
      vit_a: 0,
      magnesium: 0,
      zinc: 0,
      iron: 0,
      calcium: 0,
      potassium: 0,
      omega_3: 0
    },
    rawExtracted: {}
  }

  // Helper to extract first valid number following a pattern on the same line or next line
  const findNumber = (patterns) => {
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i]
      for (const pattern of patterns) {
        if (pattern.test(line)) {
          // Look for numbers in current line after the match or anywhere in current line
          const matchNumber = line.match(/(?:[:=–\-\s]|^)([0-9]+(?:\.[0-9]+)?)\s*(?:kcal|קק"?ל|קלוריות|g|גרם|mg|מ"?ג|mcg|מק"?ג|%)?/i)
          if (matchNumber && parseFloat(matchNumber[1]) >= 0) {
            // Check if line actually has numbers
            const allNums = line.match(/[0-9]+(?:\.[0-9]+)?/g)
            if (allNums && allNums.length > 0) {
              // Return the most appropriate number
              return parseFloat(allNums[allNums.length - 1]) // Usually the value column is last
            }
          }
          // Try next line if current line only had the label
          if (i + 1 < lines.length) {
            const nextLine = lines[i + 1]
            const nextMatch = nextLine.match(/^([0-9]+(?:\.[0-9]+)?)/)
            if (nextMatch) {
              return parseFloat(nextMatch[1])
            }
          }
        }
      }
    }
    return null
  }

  // Calories / Energy
  const calVal = findNumber([
    /calories/i,
    /energy/i,
    /אנרגיה/i,
    /קלוריות/i,
    /קק"?ל/i
  ])
  if (calVal !== null && calVal > 0) {
    result.calories = Math.round(calVal)
    result.rawExtracted.calories = calVal
  }

  // Protein / חלבונים
  const proteinVal = findNumber([
    /protein/i,
    /חלבונים?/i,
    /חלבון/i
  ])
  if (proteinVal !== null) {
    result.protein = Math.round(proteinVal * 10) / 10
    result.rawExtracted.protein = proteinVal
  }

  // Total Carbs / פחמימות
  const carbsVal = findNumber([
    /total\s*carbohydrate/i,
    /carbohydrates?/i,
    /carbs/i,
    /סך\s*ה?פחמימות/i,
    /פחמימות?/i
  ])
  if (carbsVal !== null) {
    result.carbs = Math.round(carbsVal * 10) / 10
    result.rawExtracted.carbs = carbsVal
  }

  // Total Fat / שומנים
  const fatVal = findNumber([
    /total\s*fat/i,
    /fat/i,
    /סך\s*ה?שומנים/i,
    /שומנים?/i
  ])
  if (fatVal !== null) {
    result.fat = Math.round(fatVal * 10) / 10
    result.rawExtracted.fat = fatVal
  }

  // Calcium (mg)
  const calciumVal = findNumber([
    /calcium/i,
    /סידן/i
  ])
  if (calciumVal !== null) {
    result.micros.calcium = Math.round(calciumVal)
    result.rawExtracted.calcium = calciumVal
  }

  // Iron (mg)
  const ironVal = findNumber([
    /iron/i,
    /ברזל/i
  ])
  if (ironVal !== null) {
    result.micros.iron = Math.round(ironVal * 10) / 10
    result.rawExtracted.iron = ironVal
  }

  // Potassium / אשלגן (mg)
  const potVal = findNumber([
    /potassium/i,
    /אשלגן/i
  ])
  if (potVal !== null) {
    result.micros.potassium = Math.round(potVal)
    result.rawExtracted.potassium = potVal
  }

  // Magnesium / מגנזיום (mg)
  const magVal = findNumber([
    /magnesium/i,
    /מגנזיום/i
  ])
  if (magVal !== null) {
    result.micros.magnesium = Math.round(magVal)
    result.rawExtracted.magnesium = magVal
  }

  // Zinc / אבץ (mg)
  const zincVal = findNumber([
    /zinc/i,
    /אבץ/i
  ])
  if (zincVal !== null) {
    result.micros.zinc = Math.round(zincVal * 10) / 10
    result.rawExtracted.zinc = zincVal
  }

  // Vitamin C / ויטמין C (mg)
  const vitCVal = findNumber([
    /vitamin\s*c/i,
    /ויטמין\s*c/i,
    /ויטמין\s*סי/i,
    /חומצה\s*אסקורבית/i
  ])
  if (vitCVal !== null) {
    result.micros.vit_c = Math.round(vitCVal * 10) / 10
    result.rawExtracted.vit_c = vitCVal
  }

  // Vitamin D / ויטמין D (IU or mcg)
  const vitDVal = findNumber([
    /vitamin\s*d/i,
    /ויטמין\s*d/i,
    /ויטמין\s*די/i
  ])
  if (vitDVal !== null) {
    result.micros.vit_d = Math.round(vitDVal * 10) / 10
    result.rawExtracted.vit_d = vitDVal
  }

  // Vitamin B12 / ויטמין B12 (mcg)
  const vitB12Val = findNumber([
    /vitamin\s*b12/i,
    /ויטמין\s*b12/i,
    /בי\s*12/i
  ])
  if (vitB12Val !== null) {
    result.micros.vit_b12 = Math.round(vitB12Val * 10) / 10
    result.rawExtracted.vit_b12 = vitB12Val
  }

  // Serving size detection (e.g. 100g, 150g, 1 cup)
  const servingMatch = normalized.match(/(?:serving\s*size|גודל\s*מנה|ל-?100\s*(?:גרם|ג['׳]|g))[:\s]*([^\n,]+)/i)
  if (servingMatch && servingMatch[1]) {
    result.serving = servingMatch[1].trim()
  } else if (/100\s*(?:g|גרם)/i.test(normalized)) {
    result.serving = '100g'
  }

  // Guess calories from macros if calories wasn't clearly parsed or is 0
  if (!result.calories && (result.protein > 0 || result.carbs > 0 || result.fat > 0)) {
    result.calories = calculateCaloriesFromMacros(result.protein, result.carbs, result.fat)
  }

  return result
}
