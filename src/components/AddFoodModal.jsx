import React, { useState, useRef, useEffect, useMemo } from 'react'
import { createPortal } from 'react-dom'
import { 
  X, 
  Barcode, 
  Camera, 
  FileText, 
  Upload, 
  Check, 
  Sparkles, 
  AlertCircle, 
  Loader2, 
  Search, 
  ArrowRight,
  ShieldAlert,
  Key,
  Sliders,
  CheckCircle2,
  ChevronRight
} from 'lucide-react'
import { fetchProductByBarcode, searchProductsByName, SAMPLE_BARCODES } from '../utils/barcodeService'
import { parseNutritionText } from '../utils/nutritionOcrParser'
import { 
  WHOLE_FOODS_DATABASE, 
  searchWholeFoods, 
  scaleWholeFoodPortion 
} from '../data/wholeFoodsData'
import { 
  parseNutritionLabelWithGemini, 
  getGeminiApiKey 
} from '../utils/geminiVisionService'

// Sample Label Templates for instant test without needing to upload
const SAMPLE_OCR_TEMPLATES = [
  {
    title: 'High-Protein Greek Yogurt Label',
    desc: 'Standard nutrition facts for 0% fat Greek yogurt',
    name: '0% Plain Greek Yogurt (High Protein)',
    category: 'Dairy',
    text: `Nutrition Facts
Serving Size: 100g
Calories: 60
Total Fat: 0g
Total Carbohydrate: 4g
Dietary Fiber: 0g
Total Sugars: 3.5g
Protein: 10.5g
Calcium: 130mg
Potassium: 150mg
Magnesium: 12mg
Sodium: 45mg`
  },
  {
    title: 'Protein Bar Nutrition Facts Label',
    desc: 'Standard sports nutrition bar facts label',
    name: 'Choc Peanut Crunch Protein Bar',
    category: 'Snacks & Pantry',
    text: `Nutrition Facts
Serving Size: 1 Bar (60g)
Amount Per Serving
Calories: 215
Total Fat: 8.5g
Saturated Fat: 2.5g
Total Carbohydrate: 18g
Dietary Fiber: 9g
Total Sugars: 1.5g
Protein: 21g
Calcium: 140mg
Iron: 2.2mg
Potassium: 220mg
Magnesium: 45mg`
  },
  {
    title: 'Whole Raw Almonds Nutrition Label',
    desc: 'Healthy nuts and dry goods label',
    name: 'Natural Raw Almonds',
    category: 'Healthy Fats',
    text: `Nutrition Facts
Serving Size: 100g
Amount Per Serving
Calories: 579
Total Fat: 49.9g
Total Carbohydrate: 21.6g
Dietary Fiber: 12.5g
Protein: 21.2g
Calcium: 269mg
Iron: 3.7mg
Magnesium: 270mg
Zinc: 3.1mg
Potassium: 733mg`
  }
]

export default function AddFoodModal({ isOpen, onClose, onSave, initialQuery = '', initialMode = 'search' }) {
  // Mode tabs: 'search' | 'barcode' | 'ocr' | 'manual'
  const [activeMode, setActiveMode] = useState(initialMode || 'search')

  useEffect(() => {
    if (isOpen) {
      setActiveMode(initialMode || 'search')
    }
  }, [isOpen, initialMode])

  // --- SEARCH TAB STATE ---
  const [searchQuery, setSearchQuery] = useState(initialQuery || '')
  const [selectedWholeFood, setSelectedWholeFood] = useState(null)
  const [selectedGrams, setSelectedGrams] = useState(100)
  const [packagedResults, setPackagedResults] = useState([])
  const [isSearchingPackaged, setIsSearchingPackaged] = useState(false)
  const searchDebounceRef = useRef(null)

  // Pre-filter Whole Foods locally with zero latency
  const wholeFoodResults = useMemo(() => {
    if (!searchQuery.trim()) {
      // Default to top 8 popular staples when query is empty
      return WHOLE_FOODS_DATABASE.slice(0, 8)
    }
    return searchWholeFoods(searchQuery)
  }, [searchQuery])

  // Debounced search for Open Food Facts
  useEffect(() => {
    if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current)
    const q = searchQuery.trim()
    if (!q || q.length < 2) {
      setPackagedResults([])
      setIsSearchingPackaged(false)
      return
    }

    setIsSearchingPackaged(true)
    searchDebounceRef.current = setTimeout(async () => {
      try {
        const offResults = await searchProductsByName(q)
        setPackagedResults(offResults || [])
      } catch (err) {
        console.warn('Packaged search error:', err)
        setPackagedResults([])
      } finally {
        setIsSearchingPackaged(false)
      }
    }, 400)

    return () => {
      if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current)
    }
  }, [searchQuery])

  // Handle selecting a whole food for portion scaling
  const handleSelectWholeFood = (food) => {
    setSelectedWholeFood(food)
    const defPortion = food.portions?.find(p => p.isDefault) || food.portions?.[0]
    const initialWeight = defPortion ? defPortion.grams : 100
    setSelectedGrams(initialWeight)
  }

  // Calculated scaled whole food item
  const scaledWholeFood = useMemo(() => {
    if (!selectedWholeFood) return null
    return scaleWholeFoodPortion(selectedWholeFood, selectedGrams)
  }, [selectedWholeFood, selectedGrams])

  // --- FOOD FORM STATE (for Manual / Review Mode) ---
  const [foodData, setFoodData] = useState({
    name: initialQuery || '',
    category: 'Protein',
    serving: '100g',
    calories: '',
    protein: '',
    carbs: '',
    fat: '',
    source: 'manual',
    barcode: '',
    imageUrl: '',
    micros: {
      vit_d: '',
      vit_b12: '',
      vit_c: '',
      vit_a: '',
      magnesium: '',
      zinc: '',
      iron: '',
      calcium: '',
      potassium: '',
      omega_3: ''
    },
    cautions: {
      transFat: '',
      cholesterol: '',
      sodium: '',
      saturatedFat: '',
      addedSugar: ''
    }
  })

  const [showMicros, setShowMicros] = useState(false)
  const [showCautions, setShowCautions] = useState(false)
  const [detectedFields, setDetectedFields] = useState({})

  // --- BARCODE MODE STATE ---
  const [barcodeInput, setBarcodeInput] = useState('')
  const [barcodeLoading, setBarcodeLoading] = useState(false)
  const [barcodeError, setBarcodeError] = useState('')
  const [cameraActive, setCameraActive] = useState(false)
  const scannerRef = useRef(null)

  // --- AI VISION & OCR MODE STATE ---
  const [selectedImage, setSelectedImage] = useState(null)
  const [imagePreviewUrl, setImagePreviewUrl] = useState(null)
  const [ocrProgress, setOcrProgress] = useState(0)
  const [ocrStatusText, setOcrStatusText] = useState('')
  const [ocrLoading, setOcrLoading] = useState(false)
  const [ocrRawText, setOcrRawText] = useState('')
  const [ocrError, setOcrError] = useState('')
  const [ocrSuccessMsg, setOcrSuccessMsg] = useState('')
  const fileInputRef = useRef(null)

  // Reset selected image when closing
  useEffect(() => {
    if (!isOpen) {
      setSelectedWholeFood(null)
      setSelectedImage(null)
      setImagePreviewUrl(null)
      setOcrError('')
      setOcrSuccessMsg('')
      stopCameraScanner()
    }
  }, [isOpen])

  // Stop camera when unmounting
  useEffect(() => {
    return () => {
      stopCameraScanner()
    }
  }, [activeMode, isOpen])

  // Escape key handler
  useEffect(() => {
    if (!isOpen) return
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        stopCameraScanner()
        onClose()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      document.body.style.overflow = prevOverflow || 'unset'
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  // --- HANDLERS FOR LOGGING & FORM SUBMISSION ---
  const handleLogScaledWholeFood = () => {
    if (!scaledWholeFood) return
    const newFood = {
      id: 'wf_' + Date.now(),
      name: scaledWholeFood.name,
      category: scaledWholeFood.category || 'Carbs',
      serving: scaledWholeFood.serving,
      calories: Math.round(scaledWholeFood.calories),
      protein: scaledWholeFood.protein,
      carbs: scaledWholeFood.carbs,
      fat: scaledWholeFood.fat,
      source: 'whole_food',
      micros: scaledWholeFood.micros || {},
      cautions: scaledWholeFood.cautions || {}
    }
    onSave(newFood)
    onClose()
  }

  const handleCustomizeWholeFood = () => {
    if (!scaledWholeFood) return
    setFoodData({
      name: scaledWholeFood.name,
      category: scaledWholeFood.category || 'Carbs',
      serving: scaledWholeFood.serving,
      calories: String(scaledWholeFood.calories),
      protein: String(scaledWholeFood.protein),
      carbs: String(scaledWholeFood.carbs),
      fat: String(scaledWholeFood.fat),
      source: 'whole_food',
      barcode: '',
      imageUrl: '',
      micros: {
        vit_d: scaledWholeFood.micros?.vit_d || '',
        vit_b12: scaledWholeFood.micros?.vit_b12 || '',
        vit_c: scaledWholeFood.micros?.vit_c || '',
        vit_a: scaledWholeFood.micros?.vit_a || '',
        magnesium: scaledWholeFood.micros?.magnesium || '',
        zinc: scaledWholeFood.micros?.zinc || '',
        iron: scaledWholeFood.micros?.iron || '',
        calcium: scaledWholeFood.micros?.calcium || '',
        potassium: scaledWholeFood.micros?.potassium || '',
        omega_3: scaledWholeFood.micros?.omega_3 || ''
      },
      cautions: {
        transFat: scaledWholeFood.cautions?.transFat ?? '',
        cholesterol: scaledWholeFood.cautions?.cholesterol ?? '',
        sodium: scaledWholeFood.cautions?.sodium ?? '',
        saturatedFat: scaledWholeFood.cautions?.saturatedFat ?? '',
        addedSugar: scaledWholeFood.cautions?.addedSugar ?? ''
      }
    })
    setShowMicros(true)
    setActiveMode('manual')
  }

  const handleSelectPackagedFood = (pkg) => {
    setFoodData({
      name: pkg.name,
      category: 'Snacks & Pantry',
      serving: pkg.serving || '100g',
      calories: String(pkg.calories || 0),
      protein: String(pkg.protein || 0),
      carbs: String(pkg.carbs || 0),
      fat: String(pkg.fat || 0),
      source: 'open_food_facts',
      barcode: pkg.barcode || '',
      imageUrl: pkg.imageUrl || '',
      micros: {
        vit_d: '',
        vit_b12: '',
        vit_c: '',
        vit_a: '',
        magnesium: '',
        zinc: '',
        iron: '',
        calcium: '',
        potassium: '',
        omega_3: ''
      },
      cautions: {
        transFat: '',
        cholesterol: '',
        sodium: '',
        saturatedFat: '',
        addedSugar: ''
      }
    })
    setActiveMode('manual')
  }

  const handleMicroChange = (key, val) => {
    setFoodData(prev => ({
      ...prev,
      micros: { ...prev.micros, [key]: val }
    }))
  }

  const handleCautionChange = (key, val) => {
    setFoodData(prev => ({
      ...prev,
      cautions: { ...prev.cautions, [key]: val }
    }))
  }

  const handleManualSubmit = (e) => {
    e.preventDefault()
    if (!foodData.name.trim()) return

    const newFood = {
      id: 'f_custom_' + Date.now(),
      name: foodData.name.trim(),
      category: foodData.category || 'Protein',
      serving: foodData.serving.trim() || '100g',
      calories: Math.round(parseFloat(foodData.calories) || 0),
      protein: Math.round((parseFloat(foodData.protein) || 0) * 10) / 10,
      carbs: Math.round((parseFloat(foodData.carbs) || 0) * 10) / 10,
      fat: Math.round((parseFloat(foodData.fat) || 0) * 10) / 10,
      source: foodData.source || activeMode,
      barcode: foodData.barcode || undefined,
      imageUrl: foodData.imageUrl || undefined,
      micros: {
        vit_d: parseFloat(foodData.micros.vit_d) || 0,
        vit_b12: parseFloat(foodData.micros.vit_b12) || 0,
        vit_c: parseFloat(foodData.micros.vit_c) || 0,
        vit_a: parseFloat(foodData.micros.vit_a) || 0,
        magnesium: parseFloat(foodData.micros.magnesium) || 0,
        zinc: parseFloat(foodData.micros.zinc) || 0,
        iron: parseFloat(foodData.micros.iron) || 0,
        calcium: parseFloat(foodData.micros.calcium) || 0,
        potassium: parseFloat(foodData.micros.potassium) || 0,
        omega_3: parseFloat(foodData.micros.omega_3) || 0
      },
      cautions: {
        transFat: parseFloat(foodData.cautions?.transFat) || 0,
        cholesterol: parseFloat(foodData.cautions?.cholesterol) || 0,
        sodium: parseFloat(foodData.cautions?.sodium) || 0,
        saturatedFat: parseFloat(foodData.cautions?.saturatedFat) || 0,
        addedSugar: parseFloat(foodData.cautions?.addedSugar) || 0
      }
    }

    onSave(newFood)
    onClose()
  }

  // --- BARCODE LOOKUP ---
  const handleBarcodeLookup = async (codeToLookup) => {
    const code = (codeToLookup || barcodeInput).trim()
    if (!code) {
      setBarcodeError('Please enter a barcode number.')
      return
    }

    setBarcodeLoading(true)
    setBarcodeError('')
    stopCameraScanner()

    try {
      const res = await fetchProductByBarcode(code)
      setFoodData({
        name: res.name,
        category: res.category,
        serving: res.serving,
        calories: res.calories || '',
        protein: res.protein || '',
        carbs: res.carbs || '',
        fat: res.fat || '',
        source: 'barcode',
        barcode: res.barcode,
        imageUrl: res.imageUrl || '',
        micros: {
          vit_d: res.micros.vit_d || '',
          vit_b12: res.micros.vit_b12 || '',
          vit_c: res.micros.vit_c || '',
          vit_a: res.micros.vit_a || '',
          magnesium: res.micros.magnesium || '',
          zinc: res.micros.zinc || '',
          iron: res.micros.iron || '',
          calcium: res.micros.calcium || '',
          potassium: res.micros.potassium || '',
          omega_3: res.micros.omega_3 || ''
        },
        cautions: {
          transFat: res.cautions?.transFat ?? '',
          cholesterol: res.cautions?.cholesterol ?? '',
          sodium: res.cautions?.sodium ?? '',
          saturatedFat: res.cautions?.saturatedFat ?? '',
          addedSugar: res.cautions?.addedSugar ?? ''
        }
      })
      setDetectedFields({
        calories: true,
        protein: true,
        carbs: true,
        fat: true,
        ...res.micros,
        ...(res.cautions || {})
      })
      if (res.cautions && Object.values(res.cautions).some(v => parseFloat(v) > 0)) {
        setShowCautions(true)
      }
      setActiveMode('manual')
    } catch (err) {
      setBarcodeError(err.message || 'Product could not be retrieved from the database.')
    } finally {
      setBarcodeLoading(false)
    }
  }

  const startCameraScanner = async () => {
    setCameraActive(true)
    setBarcodeError('')
    try {
      const { Html5Qrcode } = await import('html5-qrcode')
      setTimeout(() => {
        try {
          const html5QrCode = new Html5Qrcode("interactive-barcode-reader")
          scannerRef.current = html5QrCode
          html5QrCode.start(
            { facingMode: "environment" },
            { fps: 10, qrbox: { width: 260, height: 160 } },
            (decodedText) => {
              setBarcodeInput(decodedText)
              handleBarcodeLookup(decodedText)
            },
            () => {}
          ).catch((err) => {
            setBarcodeError('Camera access failed: ' + (err.message || 'Check browser permissions'))
            setCameraActive(false)
          })
        } catch (e) {
          setBarcodeError('Could not initialize scanner: ' + e.message)
          setCameraActive(false)
        }
      }, 200)
    } catch (importErr) {
      setBarcodeError('Failed to load barcode scanner engine: ' + importErr.message)
      setCameraActive(false)
    }
  }

  const stopCameraScanner = () => {
    if (scannerRef.current) {
      try {
        scannerRef.current.stop().then(() => {
          scannerRef.current.clear()
          scannerRef.current = null
        }).catch(() => {})
      } catch (e) {}
    }
    setCameraActive(false)
  }

  // --- GEMINI AI VISION & OCR HANDLERS ---
  const handleImageFileChange = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setSelectedImage(file)
    const previewUrl = URL.createObjectURL(file)
    setImagePreviewUrl(previewUrl)
    setOcrRawText('')
    setOcrError('')
    setOcrSuccessMsg('')
  }

  const handleRunAiVision = async () => {
    if (!selectedImage && !imagePreviewUrl) {
      setOcrError('Please select or upload a nutrition label photo first.')
      return
    }

    setOcrLoading(true)
    setOcrError('')
    setOcrSuccessMsg('')
    setOcrStatusText('Analyzing image with Gemini Flash Vision...')
    setOcrProgress(30)

    try {
      // 1. Try Gemini AI Vision first
      const parsed = await parseNutritionLabelWithGemini(selectedImage || imagePreviewUrl)
      setOcrProgress(100)
      setOcrSuccessMsg('Label analyzed successfully via Gemini Vision!')
      applyParsedDataToForm(parsed, 'gemini_vision')
    } catch (aiErr) {
      console.warn('Gemini Vision error, evaluating fallback:', aiErr)

      // If project has not set an API key in .env, inform user
      if (aiErr.code === 'NO_API_KEY') {
        setOcrError('No Gemini API key found in .env (VITE_GEMINI_API_KEY). Using local OCR fallback or manual entry.')
      } else {
        setOcrError(`AI Vision Notice: ${aiErr.message}. You can retry or use the local OCR parser.`)
      }

      // Automatically fallback to local Tesseract OCR if requested
      try {
        setOcrStatusText('Running local OCR fallback engine...')
        setOcrProgress(50)
        const { default: Tesseract } = await import('tesseract.js')
        const res = await Tesseract.recognize(
          selectedImage || imagePreviewUrl,
          'eng',
          {
            logger: (m) => {
              if (m.status === 'recognizing text') {
                setOcrStatusText('Recognizing text: ' + Math.round((m.progress || 0) * 100) + '%')
                setOcrProgress(Math.round((m.progress || 0) * 100))
              }
            }
          }
        )
        const text = res.data?.text || ''
        setOcrRawText(text)
        const fallbackParsed = parseNutritionText(text)
        applyParsedDataToForm({
          name: 'Photo Scanned Product',
          serving: fallbackParsed.serving || '100g',
          calories: fallbackParsed.calories,
          protein: fallbackParsed.protein,
          carbs: fallbackParsed.carbs,
          fat: fallbackParsed.fat,
          micros: fallbackParsed.micros,
          cautions: fallbackParsed.cautions
        }, 'ocr_fallback')
      } catch (tessErr) {
        setOcrError('Both AI Vision and local OCR could not read this image. Please enter macros manually or paste label text below.')
      }
    } finally {
      setOcrLoading(false)
    }
  }

  const applyParsedDataToForm = (parsed, source = 'gemini_vision') => {
    setFoodData(prev => ({
      ...prev,
      name: parsed.name || prev.name || 'Scanned Food Product',
      serving: parsed.serving || '100g',
      calories: parsed.calories || '',
      protein: parsed.protein || '',
      carbs: parsed.carbs || '',
      fat: parsed.fat || '',
      source,
      imageUrl: imagePreviewUrl || '',
      micros: {
        vit_d: parsed.micros?.vit_d || '',
        vit_b12: parsed.micros?.vit_b12 || '',
        vit_c: parsed.micros?.vit_c || '',
        vit_a: parsed.micros?.vit_a || '',
        magnesium: parsed.micros?.magnesium || '',
        zinc: parsed.micros?.zinc || '',
        iron: parsed.micros?.iron || '',
        calcium: parsed.micros?.calcium || '',
        potassium: parsed.micros?.potassium || '',
        omega_3: parsed.micros?.omega_3 || ''
      },
      cautions: {
        transFat: parsed.cautions?.transFat ?? '',
        cholesterol: parsed.cautions?.cholesterol ?? '',
        sodium: parsed.cautions?.sodium ?? '',
        saturatedFat: parsed.cautions?.saturatedFat ?? '',
        addedSugar: parsed.cautions?.addedSugar ?? ''
      }
    }))

    setDetectedFields({
      calories: true,
      protein: true,
      carbs: true,
      fat: true,
      ...(parsed.micros || {}),
      ...(parsed.cautions || {})
    })

    if (parsed.micros && Object.values(parsed.micros).some(v => parseFloat(v) > 0)) {
      setShowMicros(true)
    }
    if (parsed.cautions && Object.values(parsed.cautions).some(v => parseFloat(v) > 0)) {
      setShowCautions(true)
    }

    setActiveMode('manual')
  }

  const hasApiKey = Boolean(getGeminiApiKey())

  return createPortal(
    <div 
      onClick={() => { stopCameraScanner(); onClose(); }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="add-food-modal-title"
      className="modal-backdrop nested-modal"
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        className="modal-card" 
        style={{
          maxWidth: '860px',
          maxHeight: '92vh',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        {/* Modal Header */}
        <div className="modal-header" style={{ padding: '16px 20px', borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, var(--primary) 0%, #059669 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 14px var(--primary-glow)'
            }}>
              <Sparkles size={22} color="#fff" aria-hidden="true" />
            </div>
            <div>
              <h3 id="add-food-modal-title" style={{ fontSize: '1.24rem', fontWeight: '800', color: '#fff', margin: 0 }}>
                Log Food & Nutrition
              </h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '2px 0 0' }}>
                Instant Whole Foods Search • Smart Portions • Barcode • Gemini AI Label Scanner
              </p>
            </div>
          </div>

          <button 
            type="button"
            onClick={() => { stopCameraScanner(); onClose(); }} 
            className="modal-close-btn"
            aria-label="Close dialog"
          >
            <X size={20} aria-hidden="true" />
          </button>
        </div>

        {/* 4 Navigation Tabs */}
        <div style={{
          display: 'flex',
          background: '#0d1527',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          padding: '8px 14px',
          gap: '8px',
          flexShrink: 0,
          overflowX: 'auto',
          WebkitOverflowScrolling: 'touch'
        }}>
          {/* Tab 1: Whole Foods & Search */}
          <button
            type="button"
            onClick={() => { stopCameraScanner(); setActiveMode('search'); }}
            style={{
              flex: '1 1 auto',
              padding: '10px 14px',
              minHeight: '44px',
              borderRadius: 'var(--radius-md)',
              border: activeMode === 'search' ? '1px solid var(--primary)' : '1px solid rgba(255, 255, 255, 0.08)',
              background: activeMode === 'search' ? 'rgba(16, 185, 129, 0.22)' : 'rgba(255, 255, 255, 0.03)',
              color: activeMode === 'search' ? '#34d399' : '#94a3b8',
              fontWeight: activeMode === 'search' ? '700' : '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              fontSize: '0.86rem',
              transition: 'var(--transition)',
              whiteSpace: 'nowrap'
            }}
          >
            <Search size={16} />
            <span>1. Search & Whole Foods</span>
          </button>

          {/* Tab 2: Barcode */}
          <button
            type="button"
            onClick={() => { stopCameraScanner(); setActiveMode('barcode'); }}
            style={{
              flex: '1 1 auto',
              padding: '10px 14px',
              minHeight: '44px',
              borderRadius: 'var(--radius-md)',
              border: activeMode === 'barcode' ? '1px solid var(--accent-blue)' : '1px solid rgba(255, 255, 255, 0.08)',
              background: activeMode === 'barcode' ? 'rgba(56, 189, 248, 0.22)' : 'rgba(255, 255, 255, 0.03)',
              color: activeMode === 'barcode' ? '#38bdf8' : '#94a3b8',
              fontWeight: activeMode === 'barcode' ? '700' : '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              fontSize: '0.86rem',
              transition: 'var(--transition)',
              whiteSpace: 'nowrap'
            }}
          >
            <Barcode size={16} />
            <span>2. Barcode</span>
          </button>

          {/* Tab 3: AI Label Vision */}
          <button
            type="button"
            onClick={() => { stopCameraScanner(); setActiveMode('ocr'); }}
            style={{
              flex: '1 1 auto',
              padding: '10px 14px',
              minHeight: '44px',
              borderRadius: 'var(--radius-md)',
              border: activeMode === 'ocr' ? '1px solid var(--accent-purple)' : '1px solid rgba(255, 255, 255, 0.08)',
              background: activeMode === 'ocr' ? 'rgba(168, 85, 247, 0.22)' : 'rgba(255, 255, 255, 0.03)',
              color: activeMode === 'ocr' ? '#c084fc' : '#94a3b8',
              fontWeight: activeMode === 'ocr' ? '700' : '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              fontSize: '0.86rem',
              transition: 'var(--transition)',
              whiteSpace: 'nowrap'
            }}
          >
            <Camera size={16} />
            <span>3. AI Label Scanner</span>
          </button>

          {/* Tab 4: Manual Form */}
          <button
            type="button"
            onClick={() => { stopCameraScanner(); setActiveMode('manual'); }}
            style={{
              flex: '1 1 auto',
              padding: '10px 14px',
              minHeight: '44px',
              borderRadius: 'var(--radius-md)',
              border: activeMode === 'manual' ? '1px solid #64748b' : '1px solid rgba(255, 255, 255, 0.08)',
              background: activeMode === 'manual' ? 'rgba(100, 116, 139, 0.22)' : 'rgba(255, 255, 255, 0.03)',
              color: activeMode === 'manual' ? '#f1f5f9' : '#94a3b8',
              fontWeight: activeMode === 'manual' ? '700' : '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              fontSize: '0.86rem',
              transition: 'var(--transition)',
              whiteSpace: 'nowrap'
            }}
          >
            <FileText size={16} />
            <span>4. Manual / Review</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="modal-body" style={{ flex: '1 1 auto', overflowY: 'auto', padding: '20px' }}>

          {/* ========================================================================= */}
          {/* ===================== MODE 1: SEARCH & WHOLE FOODS ====================== */}
          {/* ========================================================================= */}
          {activeMode === 'search' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              
              {/* Search Bar */}
              <div style={{ position: 'relative' }}>
                <Search 
                  size={18} 
                  style={{ position: 'absolute', left: '14px', top: '15px', color: 'var(--primary-light)' }} 
                />
                <input
                  type="text"
                  autoFocus
                  placeholder="Type any food: Banana, Apple, Chicken Breast, Eggs, Rice, Yogurt... (English or Hebrew)"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value)
                    setSelectedWholeFood(null)
                  }}
                  className="input-field"
                  style={{
                    paddingLeft: '44px',
                    paddingRight: searchQuery ? '40px' : '14px',
                    fontSize: '1.02rem',
                    height: '48px',
                    borderColor: 'var(--primary)',
                    background: 'rgba(15, 23, 42, 0.85)'
                  }}
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery('')
                      setSelectedWholeFood(null)
                    }}
                    style={{
                      position: 'absolute',
                      right: '12px',
                      top: '12px',
                      background: 'none',
                      border: 'none',
                      color: 'var(--text-muted)',
                      cursor: 'pointer',
                      padding: '4px'
                    }}
                  >
                    <X size={18} />
                  </button>
                )}
              </div>

              {/* ACTIVE SELECTION: PORTION SELECTOR & DYNAMIC MACRO CALCULATOR */}
              {selectedWholeFood && scaledWholeFood && (
                <div style={{
                  background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.12) 0%, rgba(6, 78, 59, 0.2) 100%)',
                  border: '1.5px solid var(--primary)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '20px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '16px',
                  animation: 'fadeIn 0.2s ease-in-out'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ fontSize: '2rem' }}>{selectedWholeFood.icon || '🌿'}</span>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <h4 style={{ fontSize: '1.18rem', fontWeight: '800', color: '#fff', margin: 0 }}>
                            {selectedWholeFood.name}
                          </h4>
                          <span className="badge badge-green">Verified Whole Food</span>
                        </div>
                        {selectedWholeFood.hebrewName && (
                          <div style={{ fontSize: '0.84rem', color: 'var(--primary-light)', marginTop: '2px' }}>
                            {selectedWholeFood.hebrewName}
                          </div>
                        )}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setSelectedWholeFood(null)}
                      className="btn-ghost btn-sm"
                      style={{ color: 'var(--text-muted)', padding: '4px 8px' }}
                    >
                      Change Item
                    </button>
                  </div>

                  {/* Predefined Portion Chips */}
                  {selectedWholeFood.portions && selectedWholeFood.portions.length > 0 && (
                    <div>
                      <label className="input-label" style={{ marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Sliders size={14} color="var(--primary-light)" />
                        <span>Select Standard Portion:</span>
                      </label>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                        {selectedWholeFood.portions.map((portion, idx) => {
                          const isSelected = selectedGrams === portion.grams
                          return (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => setSelectedGrams(portion.grams)}
                              style={{
                                padding: '8px 14px',
                                borderRadius: '20px',
                                fontSize: '0.82rem',
                                fontWeight: isSelected ? '700' : '500',
                                background: isSelected ? 'var(--primary)' : 'rgba(255, 255, 255, 0.05)',
                                color: isSelected ? '#041f14' : 'var(--text-main)',
                                border: isSelected ? '1px solid var(--primary)' : '1px solid rgba(255, 255, 255, 0.1)',
                                cursor: 'pointer',
                                transition: 'all 0.15s ease'
                              }}
                            >
                              {portion.label}
                            </button>
                          )
                        })}
                      </div>
                    </div>
                  )}

                  {/* Weight Slider & Exact Gram Input */}
                  <div style={{
                    background: 'rgba(0, 0, 0, 0.25)',
                    padding: '14px 16px',
                    borderRadius: 'var(--radius-md)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '10px'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <label className="input-label" style={{ margin: 0 }}>Fine-Tune Exact Weight (Grams):</label>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <input
                          type="number"
                          min="1"
                          max="2000"
                          value={selectedGrams}
                          onChange={(e) => setSelectedGrams(Math.max(1, parseInt(e.target.value) || 0))}
                          className="input-field"
                          style={{
                            width: '90px',
                            textAlign: 'center',
                            fontSize: '1rem',
                            fontWeight: '700',
                            padding: '6px'
                          }}
                        />
                        <span style={{ fontSize: '0.86rem', color: 'var(--text-muted)' }}>grams</span>
                      </div>
                    </div>

                    <input
                      type="range"
                      min="10"
                      max="400"
                      step="5"
                      value={selectedGrams > 400 ? 400 : selectedGrams}
                      onChange={(e) => setSelectedGrams(parseInt(e.target.value))}
                      style={{
                        width: '100%',
                        accentColor: 'var(--primary)',
                        cursor: 'pointer'
                      }}
                    />
                  </div>

                  {/* Dynamic Macro & Micro Breakdown Card */}
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(4, 1fr)',
                    gap: '10px',
                    textAlign: 'center'
                  }}>
                    <div style={{ background: 'rgba(16, 185, 129, 0.15)', padding: '10px', borderRadius: 'var(--radius-md)' }}>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Calories</div>
                      <div style={{ fontSize: '1.35rem', fontWeight: '800', color: 'var(--primary-light)' }}>
                        {scaledWholeFood.calories} <span style={{ fontSize: '0.75rem' }}>kcal</span>
                      </div>
                    </div>
                    <div style={{ background: 'rgba(56, 189, 248, 0.12)', padding: '10px', borderRadius: 'var(--radius-md)' }}>
                      <div style={{ fontSize: '0.72rem', color: 'var(--accent-blue)', textTransform: 'uppercase' }}>Protein</div>
                      <div style={{ fontSize: '1.25rem', fontWeight: '800', color: '#fff' }}>
                        {scaledWholeFood.protein}g
                      </div>
                    </div>
                    <div style={{ background: 'rgba(245, 158, 11, 0.12)', padding: '10px', borderRadius: 'var(--radius-md)' }}>
                      <div style={{ fontSize: '0.72rem', color: 'var(--accent-yellow)', textTransform: 'uppercase' }}>Carbs</div>
                      <div style={{ fontSize: '1.25rem', fontWeight: '800', color: '#fff' }}>
                        {scaledWholeFood.carbs}g
                      </div>
                    </div>
                    <div style={{ background: 'rgba(244, 63, 94, 0.12)', padding: '10px', borderRadius: 'var(--radius-md)' }}>
                      <div style={{ fontSize: '0.72rem', color: 'var(--accent-red)', textTransform: 'uppercase' }}>Fat</div>
                      <div style={{ fontSize: '1.25rem', fontWeight: '800', color: '#fff' }}>
                        {scaledWholeFood.fat}g
                      </div>
                    </div>
                  </div>

                  {/* Key Micronutrients Strip */}
                  {scaledWholeFood.micros && (
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                      <span>Fiber: <strong style={{ color: '#fff' }}>{scaledWholeFood.fiber || 0}g</strong></span>
                      {scaledWholeFood.micros.potassium > 0 && (
                        <span>Potassium: <strong style={{ color: '#fff' }}>{scaledWholeFood.micros.potassium}mg</strong></span>
                      )}
                      {scaledWholeFood.micros.vit_c > 0 && (
                        <span>Vit C: <strong style={{ color: '#fff' }}>{scaledWholeFood.micros.vit_c}mg</strong></span>
                      )}
                      {scaledWholeFood.micros.magnesium > 0 && (
                        <span>Magnesium: <strong style={{ color: '#fff' }}>{scaledWholeFood.micros.magnesium}mg</strong></span>
                      )}
                      {scaledWholeFood.micros.calcium > 0 && (
                        <span>Calcium: <strong style={{ color: '#fff' }}>{scaledWholeFood.micros.calcium}mg</strong></span>
                      )}
                      {scaledWholeFood.micros.iron > 0 && (
                        <span>Iron: <strong style={{ color: '#fff' }}>{scaledWholeFood.micros.iron}mg</strong></span>
                      )}
                    </div>
                  )}

                  {/* Action Buttons for this item */}
                  <div style={{ display: 'flex', gap: '10px', marginTop: '6px' }}>
                    <button
                      type="button"
                      onClick={handleLogScaledWholeFood}
                      className="btn btn-primary"
                      style={{
                        flex: 2,
                        padding: '12px 20px',
                        fontSize: '0.96rem',
                        fontWeight: '700',
                        boxShadow: '0 4px 14px var(--primary-glow)'
                      }}
                    >
                      <Check size={18} />
                      <span>Log {scaledWholeFood.name} ({scaledWholeFood.serving})</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleCustomizeWholeFood}
                      className="btn btn-secondary"
                      style={{ flex: 1, fontSize: '0.84rem' }}
                    >
                      <span>Customize All</span>
                      <ChevronRight size={14} />
                    </button>
                  </div>
                </div>
              )}

              {/* LIST OF VERIFIED WHOLE FOODS */}
              <div>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '10px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '1.1rem' }}>🌿</span>
                    <span style={{ fontWeight: '700', fontSize: '0.92rem', color: '#fff' }}>
                      {searchQuery ? `Verified Whole Foods (${wholeFoodResults.length})` : 'Popular Everyday Whole Foods (1-Tap):'}
                    </span>
                  </div>
                  <span style={{ fontSize: '0.74rem', color: 'var(--primary-light)' }}>
                    USDA Verified • No Barcode Needed
                  </span>
                </div>

                {wholeFoodResults.length === 0 ? (
                  <div style={{ padding: '16px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                    No whole foods matched "{searchQuery}". See packaged results below or switch to manual.
                  </div>
                ) : (
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
                    gap: '10px'
                  }}>
                    {wholeFoodResults.map((item) => {
                      const defPortion = item.portions?.find(p => p.isDefault) || item.portions?.[0]
                      const defGrams = defPortion ? defPortion.grams : 100
                      const defCal = Math.round((item.per100g.calories * defGrams) / 100)
                      const isChosen = selectedWholeFood?.id === item.id

                      return (
                        <div
                          key={item.id}
                          onClick={() => handleSelectWholeFood(item)}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '12px 14px',
                            borderRadius: 'var(--radius-md)',
                            background: isChosen ? 'rgba(16, 185, 129, 0.18)' : 'rgba(255, 255, 255, 0.03)',
                            border: isChosen ? '1px solid var(--primary)' : '1px solid var(--border-color)',
                            cursor: 'pointer',
                            transition: 'var(--transition)'
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
                            <span style={{ fontSize: '1.5rem' }}>{item.icon || '🌿'}</span>
                            <div style={{ minWidth: 0 }}>
                              <div style={{ fontWeight: '700', fontSize: '0.9rem', color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                {item.name}
                              </div>
                              <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                                {defPortion ? defPortion.label : '100g'}
                              </div>
                            </div>
                          </div>

                          <div style={{ textAlign: 'right', flexShrink: 0, marginLeft: '8px' }}>
                            <div style={{ fontWeight: '800', fontSize: '0.92rem', color: 'var(--primary-light)' }}>
                              {defCal} cal
                            </div>
                            <div style={{ fontSize: '0.68rem', color: '#94a3b8' }}>
                              {Math.round((item.per100g.protein * defGrams) / 10) / 10}g P
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>

              {/* LIST OF PACKAGED PRODUCTS FROM OPEN FOOD FACTS */}
              {searchQuery.trim().length >= 2 && (
                <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '16px', marginTop: '8px' }}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '10px'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '1.1rem' }}>📦</span>
                      <span style={{ fontWeight: '700', fontSize: '0.92rem', color: '#fff' }}>
                        Packaged & Branded Products (Open Food Facts):
                      </span>
                    </div>
                    {isSearchingPackaged && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                        <Loader2 size={12} className="animate-spin" />
                        <span>Searching global database...</span>
                      </div>
                    )}
                  </div>

                  {packagedResults.length === 0 && !isSearchingPackaged ? (
                    <div style={{ padding: '12px', color: 'var(--text-muted)', fontSize: '0.82rem' }}>
                      No branded items found for "{searchQuery}".
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {packagedResults.map((item, idx) => (
                        <div
                          key={idx}
                          onClick={() => handleSelectPackagedFood(item)}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '10px 14px',
                            borderRadius: 'var(--radius-sm)',
                            background: 'rgba(255, 255, 255, 0.02)',
                            border: '1px solid var(--border-color)',
                            cursor: 'pointer',
                            transition: 'var(--transition)'
                          }}
                        >
                          <div style={{ minWidth: 0, flex: 1 }}>
                            <div style={{ fontWeight: '600', fontSize: '0.88rem', color: '#fff', wordBreak: 'break-word' }}>
                              {item.name}
                            </div>
                            <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                              {item.serving} • <span style={{ color: 'var(--accent-blue)' }}>{item.protein}g P</span> | <span style={{ color: 'var(--accent-yellow)' }}>{item.carbs}g C</span> | <span style={{ color: 'var(--accent-red)' }}>{item.fat}g F</span>
                            </div>
                          </div>

                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexShrink: 0 }}>
                            <span style={{ fontWeight: '700', fontSize: '0.92rem', color: 'var(--accent-blue)' }}>
                              {item.calories} cal
                            </span>
                            <span className="badge badge-blue" style={{ fontSize: '0.72rem' }}>
                              Select
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

            </div>
          )}

          {/* ========================================================================= */}
          {/* ===================== MODE 2: BARCODE SCANNER =========================== */}
          {/* ========================================================================= */}
          {activeMode === 'barcode' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              <div style={{
                background: 'rgba(56, 189, 248, 0.08)',
                border: '1px solid rgba(56, 189, 248, 0.2)',
                borderRadius: 'var(--radius-md)',
                padding: '14px 18px',
                fontSize: '0.85rem',
                color: 'var(--text-main)',
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}>
                <Barcode size={24} color="var(--accent-blue)" />
                <div>
                  <strong>Scan Barcode with Camera or Enter Number:</strong>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>
                    Queries Open Food Facts for Israeli and international packaged goods.
                  </div>
                </div>
              </div>

              {/* Barcode Input Bar */}
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                <input
                  type="text"
                  placeholder="Enter or paste barcode (e.g. 5449000000996, 7290000045231)…"
                  value={barcodeInput}
                  onChange={(e) => setBarcodeInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleBarcodeLookup()}
                  className="input-field"
                  style={{ flex: '1 1 200px', fontSize: '1rem', letterSpacing: '0.05em' }}
                />
                <button
                  type="button"
                  disabled={barcodeLoading || !barcodeInput.trim()}
                  onClick={() => handleBarcodeLookup()}
                  className="btn btn-primary"
                  style={{ flex: '1 1 auto', whiteSpace: 'nowrap', minHeight: '44px' }}
                >
                  {barcodeLoading ? <Loader2 size={16} className="animate-spin" /> : <Search size={16} />}
                  <span>Search Barcode</span>
                </button>

                <button
                  type="button"
                  onClick={() => cameraActive ? stopCameraScanner() : startCameraScanner()}
                  className="btn btn-secondary"
                  style={{ flex: '1 1 auto', whiteSpace: 'nowrap', minHeight: '44px' }}
                >
                  <Camera size={16} color="var(--accent-blue)" />
                  <span>{cameraActive ? 'Close Camera' : 'Open Camera'}</span>
                </button>
              </div>

              {/* Camera Scanner Viewport */}
              {cameraActive && (
                <div style={{
                  background: '#000',
                  borderRadius: 'var(--radius-md)',
                  padding: '12px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  border: '2px solid var(--accent-blue)'
                }}>
                  <div style={{ color: 'var(--accent-blue)', fontSize: '0.82rem', marginBottom: '8px', fontWeight: '600' }}>
                    Point camera steadily at the product barcode:
                  </div>
                  <div id="interactive-barcode-reader" style={{ width: '100%', maxWidth: '340px' }} />
                </div>
              )}

              {barcodeError && (
                <div style={{
                  background: 'rgba(244, 63, 94, 0.1)',
                  border: '1px solid rgba(244, 63, 94, 0.3)',
                  padding: '10px 14px',
                  borderRadius: 'var(--radius-sm)',
                  color: 'var(--accent-red)',
                  fontSize: '0.84rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <AlertCircle size={16} />
                  <span>{barcodeError}</span>
                </div>
              )}

              {/* Sample Barcodes Quick Click */}
              <div>
                <label className="input-label" style={{ marginBottom: '8px', display: 'block' }}>
                  Quick Examples to Test:
                </label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {SAMPLE_BARCODES.map(sample => (
                    <button
                      key={sample.barcode}
                      type="button"
                      onClick={() => {
                        setBarcodeInput(sample.barcode)
                        handleBarcodeLookup(sample.barcode)
                      }}
                      className="btn btn-secondary btn-sm"
                      style={{ fontSize: '0.78rem' }}
                    >
                      <Barcode size={13} color="var(--accent-blue)" />
                      <span>{sample.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* ===================== MODE 3: GEMINI AI LABEL SCANNER =================== */}
          {/* ========================================================================= */}
          {activeMode === 'ocr' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              
              {/* Header Banner */}
              <div style={{
                background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.12) 0%, rgba(126, 34, 206, 0.18) 100%)',
                border: '1px solid rgba(168, 85, 247, 0.3)',
                borderRadius: 'var(--radius-md)',
                padding: '14px 18px',
                fontSize: '0.85rem',
                color: 'var(--text-main)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '12px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '10px',
                    background: 'rgba(168, 85, 247, 0.25)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Camera size={20} color="#c084fc" />
                  </div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <strong style={{ color: '#fff' }}>Gemini Flash Vision Label Scanner</strong>
                      <span className="badge badge-purple" style={{ fontSize: '0.7rem' }}>Bilingual AI</span>
                    </div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.76rem', marginTop: '2px' }}>
                      Snap a photo of the back-of-pack Nutrition Facts table (Hebrew סימון תזונתי or English).
                    </div>
                  </div>
                </div>

                {/* API Key Status Indicator (Read from env) */}
                <div
                  style={{
                    fontSize: '0.76rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '5px 11px',
                    borderRadius: 'var(--radius-sm)',
                    background: hasApiKey ? 'rgba(52, 211, 153, 0.12)' : 'rgba(245, 158, 11, 0.12)',
                    border: `1px solid ${hasApiKey ? 'rgba(52, 211, 153, 0.35)' : 'rgba(245, 158, 11, 0.35)'}`,
                    color: hasApiKey ? '#34d399' : '#f59e0b',
                    fontWeight: 500
                  }}
                  title={hasApiKey ? 'Gemini API key active from environment (.env)' : 'VITE_GEMINI_API_KEY is missing in your .env file'}
                >
                  <Key size={13} color={hasApiKey ? '#34d399' : '#f59e0b'} />
                  <span>{hasApiKey ? 'AI Key Active (ENV)' : 'Missing .env Key'}</span>
                </div>
              </div>

              {/* Photo Upload / Camera Snap Zone */}
              <div 
                onClick={() => fileInputRef.current?.click()}
                style={{
                  border: '2px dashed rgba(168, 85, 247, 0.4)',
                  borderRadius: 'var(--radius-md)',
                  padding: '28px',
                  textAlign: 'center',
                  cursor: 'pointer',
                  background: 'rgba(255, 255, 255, 0.02)',
                  transition: 'var(--transition)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '10px'
                }}
              >
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  accept="image/*" 
                  capture="environment"
                  onChange={handleImageFileChange}
                  style={{ display: 'none' }} 
                />

                {imagePreviewUrl ? (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
                    <img 
                      src={imagePreviewUrl} 
                      alt="Label preview" 
                      style={{ 
                        maxHeight: '180px', 
                        borderRadius: 'var(--radius-sm)', 
                        border: '1px solid var(--border-color)',
                        objectFit: 'contain'
                      }} 
                    />
                    <div style={{ fontSize: '0.82rem', color: 'var(--accent-purple)', fontWeight: '600' }}>
                      ✓ Image loaded! Tap to replace or click Scan below
                    </div>
                  </div>
                ) : (
                  <>
                    <div style={{
                      width: '54px',
                      height: '54px',
                      borderRadius: '50%',
                      background: 'rgba(168, 85, 247, 0.15)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <Upload size={26} color="#c084fc" />
                    </div>
                    <div>
                      <div style={{ fontWeight: '700', fontSize: '1.02rem', color: '#f8fafc' }}>
                        Snap or Upload Back-of-Product Nutrition Label
                      </div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                        Supports camera capture, photo library, JPG, PNG & WebP
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Action Button: Run Scan */}
              {imagePreviewUrl && (
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                  <button
                    type="button"
                    disabled={ocrLoading}
                    onClick={handleRunAiVision}
                    className="btn btn-primary"
                    style={{
                      background: 'linear-gradient(135deg, #a855f7 0%, #7e22ce 100%)',
                      boxShadow: '0 4px 14px rgba(168, 85, 247, 0.4)',
                      padding: '12px 32px',
                      fontSize: '1rem',
                      fontWeight: '700'
                    }}
                  >
                    {ocrLoading ? (
                      <>
                        <Loader2 size={18} className="animate-spin" />
                        <span>{ocrStatusText} ({ocrProgress}%)</span>
                      </>
                    ) : (
                      <>
                        <Sparkles size={18} />
                        <span>Extract Nutrition with Gemini AI</span>
                      </>
                    )}
                  </button>
                </div>
              )}

              {ocrSuccessMsg && (
                <div style={{
                  background: 'rgba(16, 185, 129, 0.1)',
                  border: '1px solid rgba(16, 185, 129, 0.3)',
                  padding: '10px 14px',
                  borderRadius: 'var(--radius-sm)',
                  color: 'var(--primary-light)',
                  fontSize: '0.84rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <CheckCircle2 size={16} />
                  <span>{ocrSuccessMsg}</span>
                </div>
              )}

              {ocrError && (
                <div style={{
                  background: 'rgba(244, 63, 94, 0.1)',
                  border: '1px solid rgba(244, 63, 94, 0.3)',
                  padding: '10px 14px',
                  borderRadius: 'var(--radius-sm)',
                  color: 'var(--accent-red)',
                  fontSize: '0.84rem'
                }}>
                  {ocrError}
                </div>
              )}

              {/* Test Label Templates */}
              <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '16px' }}>
                <label className="input-label" style={{ marginBottom: '8px', display: 'block' }}>
                  Or test extraction instantly using pre-made label templates:
                </label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {SAMPLE_OCR_TEMPLATES.map((tmpl, idx) => (
                    <div
                      key={idx}
                      style={{
                        padding: '10px 14px',
                        background: 'rgba(255, 255, 255, 0.02)',
                        border: '1px solid var(--border-color)',
                        borderRadius: 'var(--radius-sm)',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        flexWrap: 'wrap',
                        gap: '8px'
                      }}
                    >
                      <div>
                        <div style={{ fontWeight: '600', fontSize: '0.88rem', color: '#fff' }}>{tmpl.title}</div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{tmpl.desc}</div>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          const parsed = parseNutritionText(tmpl.text)
                          applyParsedDataToForm({
                            name: tmpl.name,
                            serving: parsed.serving || '100g',
                            calories: parsed.calories,
                            protein: parsed.protein,
                            carbs: parsed.carbs,
                            fat: parsed.fat,
                            micros: parsed.micros,
                            cautions: parsed.cautions
                          }, 'template_test')
                        }}
                        className="btn btn-secondary btn-sm"
                        style={{ color: 'var(--accent-purple)' }}
                      >
                        <Sparkles size={14} /> Test Template
                      </button>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* ========================================================================= */}
          {/* ===================== MODE 4: MANUAL ENTRY & REVIEW ===================== */}
          {/* ========================================================================= */}
          {activeMode === 'manual' && (
            <form id="food-entry-form" onSubmit={handleManualSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              
              {foodData.source === 'whole_food' && (
                <div style={{
                  background: 'rgba(16, 185, 129, 0.1)',
                  border: '1px solid rgba(16, 185, 129, 0.3)',
                  padding: '8px 14px',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.82rem',
                  color: 'var(--primary-light)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <CheckCircle2 size={16} />
                  <span>Whole food scaled values loaded! You can make any manual adjustments before saving.</span>
                </div>
              )}

              {foodData.source === 'gemini_vision' && (
                <div style={{
                  background: 'rgba(168, 85, 247, 0.1)',
                  border: '1px solid rgba(168, 85, 247, 0.3)',
                  padding: '8px 14px',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.82rem',
                  color: '#c084fc',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <Sparkles size={16} />
                  <span>Values extracted via Gemini AI Vision! Please review and adjust if needed.</span>
                </div>
              )}

              {foodData.source === 'barcode' && (
                <div style={{
                  background: 'rgba(56, 189, 248, 0.1)',
                  border: '1px solid rgba(56, 189, 248, 0.3)',
                  padding: '8px 14px',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.82rem',
                  color: 'var(--accent-blue)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <Barcode size={16} />
                  <span>Values retrieved from barcode database (Barcode: {foodData.barcode || 'scanned'}).</span>
                </div>
              )}

              {/* Food Name & Category */}
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '14px' }}>
                <div className="input-group">
                  <label className="input-label">Food / Ingredient Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Banana, Raw / Greek Yogurt / Chicken Breast..."
                    value={foodData.name}
                    onChange={(e) => setFoodData({ ...foodData, name: e.target.value })}
                    className="input-field"
                  />
                </div>

                <div className="input-group">
                  <label className="input-label">Category</label>
                  <select
                    value={foodData.category}
                    onChange={(e) => setFoodData({ ...foodData, category: e.target.value })}
                    className="select-field"
                  >
                    <option value="Protein">Protein</option>
                    <option value="Carbs">Carbohydrates</option>
                    <option value="Healthy Fats">Healthy Fats</option>
                    <option value="Dairy">Dairy & Eggs</option>
                    <option value="Produce">Fresh Produce</option>
                    <option value="Supplement">Supplements & Powders</option>
                    <option value="Snacks & Pantry">Pantry & Snacks</option>
                  </select>
                </div>
              </div>

              {/* Serving Size & Base Macros */}
              <div style={{
                background: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-md)',
                padding: '16px',
                display: 'flex',
                flexDirection: 'column',
                gap: '14px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <label className="input-label" style={{ color: 'var(--primary-light)', margin: 0 }}>
                    Primary Nutritional Profile (Per Serving)
                  </label>
                  <div style={{ width: '180px' }}>
                    <input
                      type="text"
                      placeholder="Serving size (e.g. 100g)"
                      value={foodData.serving}
                      onChange={(e) => setFoodData({ ...foodData, serving: e.target.value })}
                      className="input-field"
                      style={{ fontSize: '0.82rem', padding: '6px 10px' }}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
                  <div className="input-group">
                    <label className="input-label" style={{ fontSize: '0.74rem' }}>
                      Calories (kcal)
                    </label>
                    <input
                      type="number"
                      required
                      placeholder="0"
                      value={foodData.calories}
                      onChange={(e) => setFoodData({ ...foodData, calories: e.target.value })}
                      className="input-field"
                      style={{ borderColor: detectedFields.calories ? 'var(--primary)' : undefined }}
                    />
                  </div>

                  <div className="input-group">
                    <label className="input-label" style={{ fontSize: '0.74rem' }}>
                      Protein (g)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      placeholder="0"
                      value={foodData.protein}
                      onChange={(e) => setFoodData({ ...foodData, protein: e.target.value })}
                      className="input-field"
                      style={{ borderColor: detectedFields.protein ? 'var(--macro-protein)' : undefined }}
                    />
                  </div>

                  <div className="input-group">
                    <label className="input-label" style={{ fontSize: '0.74rem' }}>
                      Carbs (g)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      placeholder="0"
                      value={foodData.carbs}
                      onChange={(e) => setFoodData({ ...foodData, carbs: e.target.value })}
                      className="input-field"
                      style={{ borderColor: detectedFields.carbs ? 'var(--macro-carbs)' : undefined }}
                    />
                  </div>

                  <div className="input-group">
                    <label className="input-label" style={{ fontSize: '0.74rem' }}>
                      Fat (g)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      placeholder="0"
                      value={foodData.fat}
                      onChange={(e) => setFoodData({ ...foodData, fat: e.target.value })}
                      className="input-field"
                      style={{ borderColor: detectedFields.fat ? 'var(--macro-fat)' : undefined }}
                    />
                  </div>
                </div>

                {/* Macro Math Estimation Helper */}
                {(() => {
                  const p = parseFloat(foodData.protein) || 0
                  const c = parseFloat(foodData.carbs) || 0
                  const f = parseFloat(foodData.fat) || 0
                  const hasAnyMacro = p > 0 || c > 0 || f > 0
                  const computedCals = Math.round((p * 4) + (c * 4) + (f * 9))
                  const enteredCals = parseFloat(foodData.calories) || 0

                  if (!hasAnyMacro) return null

                  const isCalorieEmpty = !foodData.calories || foodData.calories === '' || enteredCals === 0
                  const diff = Math.abs(enteredCals - computedCals)
                  const hasSignificantDivergence = !isCalorieEmpty && computedCals > 0 && (diff / computedCals > 0.25)

                  return (
                    <div style={{
                      marginTop: '4px',
                      padding: '8px 12px',
                      borderRadius: 'var(--radius-sm)',
                      background: hasSignificantDivergence ? 'rgba(245, 158, 11, 0.1)' : 'rgba(16, 185, 129, 0.08)',
                      border: hasSignificantDivergence ? '1px solid rgba(245, 158, 11, 0.3)' : '1px solid rgba(16, 185, 129, 0.2)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      flexWrap: 'wrap',
                      gap: '8px',
                      fontSize: '0.78rem'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Sparkles size={13} color={hasSignificantDivergence ? 'var(--accent-yellow)' : 'var(--primary-light)'} />
                        <span style={{ color: hasSignificantDivergence ? 'var(--accent-yellow)' : 'var(--text-muted)' }}>
                          {isCalorieEmpty ? (
                            <>Estimated from macros (4P + 4C + 9F): <strong className="tabular-nums" style={{ color: '#fff' }}>~{computedCals} kcal</strong></>
                          ) : hasSignificantDivergence ? (
                            <>Entered {enteredCals} kcal differs from calculated macro energy (~{computedCals} kcal)</>
                          ) : (
                            <>Macros match entered energy (~{computedCals} kcal)</>
                          )}
                        </span>
                      </div>

                      {(isCalorieEmpty || hasSignificantDivergence) && (
                        <button
                          type="button"
                          onClick={() => setFoodData(prev => ({ ...prev, calories: String(computedCals) }))}
                          className="btn btn-secondary btn-sm"
                          style={{
                            fontSize: '0.72rem',
                            padding: '3px 8px',
                            minHeight: '26px',
                            borderColor: 'rgba(16, 185, 129, 0.4)',
                            color: 'var(--primary-light)'
                          }}
                        >
                          Use ~{computedCals} kcal
                        </button>
                      )}
                    </div>
                  )
                })()}
              </div>

              {/* Collapsible Micronutrients */}
              <div style={{
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-md)',
                overflow: 'hidden'
              }}>
                <button
                  type="button"
                  onClick={() => setShowMicros(!showMicros)}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    background: 'rgba(255, 255, 255, 0.02)',
                    border: 'none',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    cursor: 'pointer',
                    color: 'var(--text-main)',
                    fontSize: '0.86rem',
                    fontWeight: '600'
                  }}
                >
                  <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Sparkles size={16} color="var(--primary-light)" />
                    Micronutrients & Vitamins (Optional precision tracking)
                  </span>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    {showMicros ? 'Hide ▲' : 'Expand ▼'}
                  </span>
                </button>

                {showMicros && (
                  <div style={{
                    padding: '16px',
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
                    gap: '12px',
                    background: 'rgba(0, 0, 0, 0.2)'
                  }}>
                    <div className="input-group">
                      <label className="input-label" style={{ fontSize: '0.7rem' }}>Calcium (mg)</label>
                      <input
                        type="number"
                        placeholder="0"
                        value={foodData.micros.calcium}
                        onChange={(e) => handleMicroChange('calcium', e.target.value)}
                        className="input-field"
                      />
                    </div>

                    <div className="input-group">
                      <label className="input-label" style={{ fontSize: '0.7rem' }}>Iron (mg)</label>
                      <input
                        type="number"
                        step="0.1"
                        placeholder="0"
                        value={foodData.micros.iron}
                        onChange={(e) => handleMicroChange('iron', e.target.value)}
                        className="input-field"
                      />
                    </div>

                    <div className="input-group">
                      <label className="input-label" style={{ fontSize: '0.7rem' }}>Magnesium (mg)</label>
                      <input
                        type="number"
                        placeholder="0"
                        value={foodData.micros.magnesium}
                        onChange={(e) => handleMicroChange('magnesium', e.target.value)}
                        className="input-field"
                      />
                    </div>

                    <div className="input-group">
                      <label className="input-label" style={{ fontSize: '0.7rem' }}>Zinc (mg)</label>
                      <input
                        type="number"
                        step="0.1"
                        placeholder="0"
                        value={foodData.micros.zinc}
                        onChange={(e) => handleMicroChange('zinc', e.target.value)}
                        className="input-field"
                      />
                    </div>

                    <div className="input-group">
                      <label className="input-label" style={{ fontSize: '0.7rem' }}>Potassium (mg)</label>
                      <input
                        type="number"
                        placeholder="0"
                        value={foodData.micros.potassium}
                        onChange={(e) => handleMicroChange('potassium', e.target.value)}
                        className="input-field"
                      />
                    </div>

                    <div className="input-group">
                      <label className="input-label" style={{ fontSize: '0.7rem' }}>Vitamin C (mg)</label>
                      <input
                        type="number"
                        step="0.1"
                        placeholder="0"
                        value={foodData.micros.vit_c}
                        onChange={(e) => handleMicroChange('vit_c', e.target.value)}
                        className="input-field"
                      />
                    </div>

                    <div className="input-group">
                      <label className="input-label" style={{ fontSize: '0.7rem' }}>Vitamin D3 (IU)</label>
                      <input
                        type="number"
                        placeholder="0"
                        value={foodData.micros.vit_d}
                        onChange={(e) => handleMicroChange('vit_d', e.target.value)}
                        className="input-field"
                      />
                    </div>

                    <div className="input-group">
                      <label className="input-label" style={{ fontSize: '0.7rem' }}>Vitamin B12 (mcg)</label>
                      <input
                        type="number"
                        step="0.1"
                        placeholder="0"
                        value={foodData.micros.vit_b12}
                        onChange={(e) => handleMicroChange('vit_b12', e.target.value)}
                        className="input-field"
                      />
                    </div>

                    <div className="input-group">
                      <label className="input-label" style={{ fontSize: '0.7rem' }}>Omega-3 (mg)</label>
                      <input
                        type="number"
                        placeholder="0"
                        value={foodData.micros.omega_3}
                        onChange={(e) => handleMicroChange('omega_3', e.target.value)}
                        className="input-field"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Collapsible Cautions */}
              <div style={{
                border: '1px solid rgba(244, 63, 94, 0.25)',
                borderRadius: 'var(--radius-md)',
                overflow: 'hidden',
                background: 'rgba(244, 63, 94, 0.02)'
              }}>
                <button
                  type="button"
                  onClick={() => setShowCautions(!showCautions)}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    background: 'rgba(244, 63, 94, 0.06)',
                    border: 'none',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    cursor: 'pointer',
                    color: 'var(--text-main)',
                    fontSize: '0.86rem',
                    fontWeight: '600'
                  }}
                >
                  <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <ShieldAlert size={16} color="#f43f5e" />
                    <span>Caution Nutrients (Sodium, Trans Fat, Cholesterol...)</span>
                  </span>
                  <span style={{ fontSize: '0.78rem', color: '#f43f5e', fontWeight: '700' }}>
                    {showCautions ? 'Hide ▲' : 'Expand ▼'}
                  </span>
                </button>

                {showCautions && (
                  <div style={{
                    padding: '16px',
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
                    gap: '12px',
                    background: 'rgba(0, 0, 0, 0.25)'
                  }}>
                    <div className="input-group">
                      <label className="input-label" style={{ fontSize: '0.7rem' }}>Sodium (mg)</label>
                      <input
                        type="number"
                        placeholder="0"
                        value={foodData.cautions?.sodium || ''}
                        onChange={(e) => handleCautionChange('sodium', e.target.value)}
                        className="input-field"
                      />
                    </div>

                    <div className="input-group">
                      <label className="input-label" style={{ fontSize: '0.7rem' }}>Trans Fat (g)</label>
                      <input
                        type="number"
                        step="0.1"
                        placeholder="0"
                        value={foodData.cautions?.transFat || ''}
                        onChange={(e) => handleCautionChange('transFat', e.target.value)}
                        className="input-field"
                      />
                    </div>

                    <div className="input-group">
                      <label className="input-label" style={{ fontSize: '0.7rem' }}>Cholesterol (mg)</label>
                      <input
                        type="number"
                        placeholder="0"
                        value={foodData.cautions?.cholesterol || ''}
                        onChange={(e) => handleCautionChange('cholesterol', e.target.value)}
                        className="input-field"
                      />
                    </div>

                    <div className="input-group">
                      <label className="input-label" style={{ fontSize: '0.7rem' }}>Saturated Fat (g)</label>
                      <input
                        type="number"
                        step="0.1"
                        placeholder="0"
                        value={foodData.cautions?.saturatedFat || ''}
                        onChange={(e) => handleCautionChange('saturatedFat', e.target.value)}
                        className="input-field"
                      />
                    </div>

                    <div className="input-group">
                      <label className="input-label" style={{ fontSize: '0.7rem' }}>Added Sugars (g)</label>
                      <input
                        type="number"
                        step="0.1"
                        placeholder="0"
                        value={foodData.cautions?.addedSugar || ''}
                        onChange={(e) => handleCautionChange('addedSugar', e.target.value)}
                        className="input-field"
                      />
                    </div>
                  </div>
                )}
              </div>

            </form>
          )}

        </div>

        {/* Modal Footer */}
        <div className="modal-footer" style={{ padding: '14px 20px', borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
          <button
            type="button"
            onClick={() => { stopCameraScanner(); onClose(); }}
            className="btn btn-secondary"
            style={{ minWidth: '100px' }}
          >
            Cancel
          </button>

          {activeMode === 'manual' ? (
            <button
              type="submit"
              form="food-entry-form"
              className="btn btn-primary"
              style={{ minWidth: '220px' }}
            >
              <Check size={16} />
              <span>Save & Log Food</span>
            </button>
          ) : activeMode === 'search' && selectedWholeFood ? (
            <button
              type="button"
              onClick={handleLogScaledWholeFood}
              className="btn btn-primary"
              style={{ minWidth: '220px' }}
            >
              <Check size={16} />
              <span>Log {scaledWholeFood?.name} ({scaledWholeFood?.serving})</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setActiveMode('manual')}
              className="btn btn-secondary"
              style={{ minWidth: '200px' }}
            >
              <span>Custom Manual Entry</span>
              <ArrowRight size={16} />
            </button>
          )}
        </div>

      </div>
    </div>,
    document.body
  )
}
