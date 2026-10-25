/**
 * Unified Search Aggregator
 * Combines instant local Whole Foods with async Open Food Facts packaged goods.
 */
import { searchWholeFoods } from '../data/wholeFoodsData'
import { searchProductsByName } from './barcodeService'

/**
 * Searches across whole foods immediately, and optionally Open Food Facts
 * Returns { wholeFoods: Array, packagedFoods: Array, all: Array }
 */
export async function searchAllFoods(query, includeOpenFoodFacts = true) {
  if (!query || typeof query !== 'string') {
    return { wholeFoods: [], packagedFoods: [], all: [] }
  }

  const cleanQuery = query.trim()
  if (cleanQuery.length === 0) {
    return { wholeFoods: [], packagedFoods: [], all: [] }
  }

  // 1. Instant local whole foods
  const wholeResults = searchWholeFoods(cleanQuery).map(item => ({
    ...item,
    isWholeFood: true,
    source: 'whole_food',
    // Pre-select default portion or 100g
    currentPortion: item.portions?.find(p => p.isDefault) || item.portions?.[0] || { label: '100g', grams: 100 }
  }))

  let packagedResults = []

  // 2. Open Food Facts async if query is long enough and requested
  if (includeOpenFoodFacts && cleanQuery.length >= 2) {
    try {
      const offItems = await searchProductsByName(cleanQuery)
      packagedResults = (offItems || []).map(p => ({
        id: `off_${p.barcode || Math.random().toString(36).slice(2, 11)}`,
        name: p.name,
        category: p.category || 'Packaged Foods',
        serving: p.serving || '100g',
        calories: p.calories || 0,
        protein: p.protein || 0,
        carbs: p.carbs || 0,
        fat: p.fat || 0,
        barcode: p.barcode || '',
        imageUrl: p.imageUrl || null,
        isWholeFood: false,
        source: 'open_food_facts',
        micros: p.micros || {},
        cautions: p.cautions || {}
      }))
    } catch (err) {
      console.warn('Open Food Facts search error:', err)
      packagedResults = []
    }
  }

  return {
    wholeFoods: wholeResults,
    packagedFoods: packagedResults,
    all: [...wholeResults, ...packagedResults]
  }
}
