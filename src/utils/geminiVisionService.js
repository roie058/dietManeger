/**
 * Gemini AI Vision Service for Nutrition Label Scanning
 * Sends nutrition label photos to Google Gemini Flash API for high-precision table extraction.
 * Supports Hebrew (סימון תזונתי) and English labels.
 */

// Helper to get active API key from env or localStorage
export function getGeminiApiKey() {
  const fromLocal = localStorage.getItem('gemini_api_key')
  if (fromLocal && fromLocal.trim()) return fromLocal.trim()
  return (import.meta.env.VITE_GEMINI_API_KEY || '').trim()
}

export function setGeminiApiKey(key) {
  if (!key) {
    localStorage.removeItem('gemini_api_key')
  } else {
    localStorage.setItem('gemini_api_key', key.trim())
  }
}

/**
 * Resize image in browser canvas to prevent uploading massive 10MB phone camera photos.
 * Keeps aspect ratio with max dimension of 1280px, encoded to JPEG @ 0.85 quality.
 */
export async function optimizeImageForAi(fileOrBlob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const img = new Image()
      img.onload = () => {
        const MAX_DIM = 1280
        let width = img.width
        let height = img.height

        if (width > MAX_DIM || height > MAX_DIM) {
          if (width > height) {
            height = Math.round((height * MAX_DIM) / width)
            width = MAX_DIM
          } else {
            width = Math.round((width * MAX_DIM) / height)
            height = MAX_DIM
          }
        }

        const canvas = document.createElement('canvas')
        canvas.width = width
        canvas.height = height
        const ctx = canvas.getContext('2d')
        ctx.drawImage(img, 0, 0, width, height)

        const dataUrl = canvas.toDataURL('image/jpeg', 0.85)
        // Extract raw base64 without prefix
        const base64Data = dataUrl.split(',')[1]
        resolve({ base64Data, mimeType: 'image/jpeg', dataUrl })
      }
      img.onerror = () => reject(new Error('Failed to load image into canvas'))
      img.src = e.target.result
    }
    reader.onerror = () => reject(new Error('Failed to read image file'))
    reader.readAsDataURL(fileOrBlob)
  })
}

const EXTRACTION_PROMPT = `
You are an expert nutritionist and OCR system analyzing a photo of a food product nutrition facts table.
The image may be in English (Nutrition Facts) or Hebrew (סימון תזונתי) or bilingual.

TASK:
Accurately extract the product name (if visible) and all nutritional values.
Prefer values per 100g if available; otherwise use the stated serving size.
If energy is given in kJ and kcal is missing, calculate kcal = Math.round(kJ / 4.184).
If sodium is given as salt, calculate sodium(mg) = Math.round(salt(g) * 400).

Return ONLY a valid JSON object with the following structure (no markdown formatting, no backticks, no comments):
{
  "name": "Product title or description in image",
  "serving": "100g or serving size as stated",
  "calories": 0,
  "protein": 0.0,
  "carbs": 0.0,
  "fat": 0.0,
  "fiber": 0.0,
  "sugar": 0.0,
  "cautions": {
    "sodium": 0,
    "saturatedFat": 0.0,
    "transFat": 0.0,
    "cholesterol": 0,
    "addedSugar": 0.0
  },
  "micros": {
    "potassium": 0,
    "calcium": 0,
    "iron": 0.0,
    "magnesium": 0,
    "zinc": 0.0,
    "vit_c": 0.0,
    "vit_d": 0.0,
    "vit_b12": 0.0,
    "vit_a": 0.0,
    "omega_3": 0
  }
}
`

/**
 * Calls Gemini Vision API to parse a nutrition label
 */
export async function parseNutritionLabelWithGemini(fileOrBlob, customApiKey = null) {
  const apiKey = (customApiKey || getGeminiApiKey() || '').trim()

  if (!apiKey) {
    const err = new Error('No Gemini API key found. Please provide an API key in .env or settings.')
    err.code = 'NO_API_KEY'
    throw err
  }

  // 1. Optimize image into lightweight base64 JPEG
  const { base64Data, mimeType } = await optimizeImageForAi(fileOrBlob)

  // 2. Prepare payload for Gemini API
  // Using gemini-1.5-flash as default fast model, fallback to gemini-2.5-flash if needed
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`

  const requestBody = {
    contents: [
      {
        parts: [
          { text: EXTRACTION_PROMPT },
          {
            inline_data: {
              mime_type: mimeType,
              data: base64Data
            }
          }
        ]
      }
    ],
    generationConfig: {
      temperature: 0.1,
      response_mime_type: 'application/json'
    }
  }

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(requestBody)
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    const msg = errorData.error?.message || `Gemini API returned HTTP ${response.status}`
    const error = new Error(msg)
    error.status = response.status
    throw error
  }

  const data = await response.json()
  const textOutput = data.candidates?.[0]?.content?.parts?.[0]?.text

  if (!textOutput) {
    throw new Error('Gemini could not find or parse nutritional information in this image')
  }

  try {
    // Clean any accidental markdown backticks just in case
    const cleanJson = textOutput.replace(/```json/g, '').replace(/```/g, '').trim()
    const parsed = JSON.parse(cleanJson)

    return {
      name: parsed.name || 'Scanned Food Product',
      serving: parsed.serving || '100g',
      calories: Math.round(Number(parsed.calories) || 0),
      protein: Math.round((Number(parsed.protein) || 0) * 10) / 10,
      carbs: Math.round((Number(parsed.carbs) || 0) * 10) / 10,
      fat: Math.round((Number(parsed.fat) || 0) * 10) / 10,
      fiber: Math.round((Number(parsed.fiber) || 0) * 10) / 10,
      sugar: Math.round((Number(parsed.sugar) || 0) * 10) / 10,
      micros: {
        potassium: Math.round(Number(parsed.micros?.potassium) || 0),
        calcium: Math.round(Number(parsed.micros?.calcium) || 0),
        iron: Math.round((Number(parsed.micros?.iron) || 0) * 10) / 10,
        magnesium: Math.round(Number(parsed.micros?.magnesium) || 0),
        zinc: Math.round((Number(parsed.micros?.zinc) || 0) * 10) / 10,
        vit_c: Math.round((Number(parsed.micros?.vit_c) || 0) * 10) / 10,
        vit_d: Math.round((Number(parsed.micros?.vit_d) || 0) * 10) / 10,
        vit_b12: Math.round((Number(parsed.micros?.vit_b12) || 0) * 10) / 10,
        vit_a: Math.round(Number(parsed.micros?.vit_a) || 0),
        omega_3: Math.round(Number(parsed.micros?.omega_3) || 0)
      },
      cautions: {
        sodium: Math.round(Number(parsed.cautions?.sodium) || 0),
        saturatedFat: Math.round((Number(parsed.cautions?.saturatedFat) || 0) * 10) / 10,
        transFat: Math.round((Number(parsed.cautions?.transFat) || 0) * 10) / 10,
        cholesterol: Math.round(Number(parsed.cautions?.cholesterol) || 0),
        addedSugar: Math.round((Number(parsed.cautions?.addedSugar) || 0) * 10) / 10
      },
      source: 'gemini_vision'
    }
  } catch (parseErr) {
    console.error('Failed to parse Gemini JSON output:', textOutput, parseErr)
    throw new Error('Gemini returned text that could not be parsed as nutrition data')
  }
}
