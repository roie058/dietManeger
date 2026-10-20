/**
 * Barcode & Open Food Facts Service
 * Queries Open Food Facts API for product details, macros and micronutrients
 */

export const SAMPLE_BARCODES = [
  { barcode: '7290000045231', name: 'Fresh Cottage Cheese 5%', category: 'Dairy' },
  { barcode: '7290000066120', name: 'Greek Yogurt 0% Fat', category: 'Dairy' },
  { barcode: '7290100851411', name: 'Natural Whole Raw Almonds', category: 'Healthy Fats' },
  { barcode: '5449000000996', name: 'Coca-Cola Zero Sugar', category: 'Snacks & Pantry' },
  { barcode: '3017620422003', name: 'Nutella Hazelnut Spread', category: 'Snacks & Pantry' },
  { barcode: '737628064502', name: 'Thai Peanut Noodle Bowl', category: 'Carbs' }
]

export async function fetchProductByBarcode(barcode) {
  const cleanBarcode = String(barcode).trim().replace(/[^0-9]/g, '')
  if (!cleanBarcode) {
    throw new Error('Please enter a valid barcode')
  }

  const url = `https://world.openfoodfacts.org/api/v2/product/${cleanBarcode}.json`

  try {
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`OpenFoodFacts returned status ${response.status}`)
    }
    const data = await response.json()

    if (data.status !== 1 || !data.product) {
      throw new Error('Product not found in Open Food Facts database')
    }

    const p = data.product
    const n = p.nutriments || {}

    // Extract product title (prefer Hebrew if available, then general)
    const name = p.product_name_he || p.product_name_en || p.product_name || p.generic_name || 'Scanned Food Product'
    const brand = p.brands ? ` (${p.brands})` : ''
    const fullName = `${name}${brand}`

    // Serving info
    const serving = p.serving_size || '100g'

    // Calories: try 100g then serving
    let calories = n['energy-kcal_100g'] ?? n['energy-kcal_serving'] ?? n['energy-kcal']
    if (calories === undefined || calories === null) {
      // Sometimes only kJ is available
      const kj = n['energy_100g'] || n['energy']
      if (kj) calories = Math.round(kj / 4.184)
    }

    const protein = parseFloat(n.proteins_100g ?? n.proteins_serving ?? n.proteins ?? 0)
    const carbs = parseFloat(n.carbohydrates_100g ?? n.carbohydrates_serving ?? n.carbohydrates ?? 0)
    const fat = parseFloat(n.fat_100g ?? n.fat_serving ?? n.fat ?? 0)

    // Calculate calories if missing
    if (!calories && (protein || carbs || fat)) {
      calories = Math.round((protein * 4) + (carbs * 4) + (fat * 9))
    }

    // Micronutrients parsing
    const micros = {
      calcium: Math.round(parseFloat(n.calcium_100g ?? n.calcium ?? 0) * (n.calcium_unit === 'g' ? 1000 : 1)),
      iron: Math.round(parseFloat(n.iron_100g ?? n.iron ?? 0) * (n.iron_unit === 'g' ? 1000 : 1) * 10) / 10,
      potassium: Math.round(parseFloat(n.potassium_100g ?? n.potassium ?? 0) * (n.potassium_unit === 'g' ? 1000 : 1)),
      magnesium: Math.round(parseFloat(n.magnesium_100g ?? n.magnesium ?? 0) * (n.magnesium_unit === 'g' ? 1000 : 1)),
      zinc: Math.round(parseFloat(n.zinc_100g ?? n.zinc ?? 0) * (n.zinc_unit === 'g' ? 1000 : 1) * 10) / 10,
      vit_c: Math.round(parseFloat(n['vitamin-c_100g'] ?? n['vitamin-c'] ?? 0) * 10) / 10,
      vit_d: Math.round(parseFloat(n['vitamin-d_100g'] ?? n['vitamin-d'] ?? 0) * (n['vitamin-d_unit'] === 'mcg' ? 1 : 40) * 10) / 10, // 1 mcg = 40 IU
      vit_b12: Math.round(parseFloat(n['vitamin-b12_100g'] ?? n['vitamin-b12'] ?? 0) * 10) / 10,
      vit_a: Math.round(parseFloat(n['vitamin-a_100g'] ?? n['vitamin-a'] ?? 0)),
      omega_3: Math.round(parseFloat(n['omega-3-fat_100g'] ?? 0) * 1000)
    }

    // Determine category based on macros or OpenFoodFacts categories
    let category = 'Snacks & Pantry'
    if (protein > 15 && protein > carbs && protein > fat) category = 'Protein'
    else if (fat > 12 && fat > protein) category = 'Healthy Fats'
    else if (carbs > 20 && carbs > protein) category = 'Carbs'
    else if ((p.categories_tags || []).some(t => t.includes('dairy') || t.includes('milk') || t.includes('cheese'))) category = 'Dairy'

    return {
      name: fullName,
      barcode: cleanBarcode,
      serving: serving,
      calories: Math.round(calories || 0),
      protein: Math.round(protein * 10) / 10,
      carbs: Math.round(carbs * 10) / 10,
      fat: Math.round(fat * 10) / 10,
      category,
      micros,
      imageUrl: p.image_front_small_url || p.image_url || null,
      source: 'barcode'
    }
  } catch (error) {
    console.error('Barcode lookup error:', error)
    throw error
  }
}

/**
 * Search products by keyword in Open Food Facts
 */
export async function searchProductsByName(query) {
  if (!query || query.trim().length < 2) return []

  const url = `https://world.openfoodfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(query)}&search_simple=1&action=process&json=1&page_size=8`

  try {
    const res = await fetch(url)
    if (!res.ok) return []
    const data = await res.json()
    if (!data.products) return []

    return data.products.map(p => {
      const n = p.nutriments || {}
      const name = p.product_name_he || p.product_name_en || p.product_name || 'Food Product'
      const brand = p.brands ? ` (${p.brands})` : ''
      return {
        barcode: p.code || '',
        name: `${name}${brand}`,
        calories: Math.round(n['energy-kcal_100g'] || 0),
        protein: Math.round((n.proteins_100g || 0) * 10) / 10,
        carbs: Math.round((n.carbohydrates_100g || 0) * 10) / 10,
        fat: Math.round((n.fat_100g || 0) * 10) / 10,
        serving: p.serving_size || '100g',
        imageUrl: p.image_front_small_url || null
      }
    })
  } catch (err) {
    console.warn('Search products error:', err)
    return []
  }
}
