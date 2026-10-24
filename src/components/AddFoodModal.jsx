import React, { useState, useRef, useEffect } from 'react'
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
  ShieldAlert
} from 'lucide-react'
import { fetchProductByBarcode, searchProductsByName, SAMPLE_BARCODES } from '../utils/barcodeService'
import { parseNutritionText } from '../utils/nutritionOcrParser'

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

export default function AddFoodModal({ isOpen, onClose, onSave, initialQuery = '', initialMode = 'manual' }) {
  const [activeMode, setActiveMode] = useState(initialMode) // 'manual' | 'barcode' | 'ocr'

  useEffect(() => {
    if (isOpen) {
      setActiveMode(initialMode)
    }
  }, [isOpen, initialMode])

  // Food Form State
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

  // Barcode Mode States
  const [barcodeInput, setBarcodeInput] = useState('')
  const [barcodeLoading, setBarcodeLoading] = useState(false)
  const [barcodeError, setBarcodeError] = useState('')
  const [cameraActive, setCameraActive] = useState(false)
  const [nameSearchResults, setNameSearchResults] = useState([])
  const [nameSearchLoading, setNameSearchLoading] = useState(false)
  const scannerRef = useRef(null)

  // OCR Mode States
  const [selectedImage, setSelectedImage] = useState(null)
  const [imagePreviewUrl, setImagePreviewUrl] = useState(null)
  const [ocrProgress, setOcrProgress] = useState(0)
  const [ocrStatusText, setOcrStatusText] = useState('')
  const [ocrLoading, setOcrLoading] = useState(false)
  const [ocrRawText, setOcrRawText] = useState('')
  const [ocrError, setOcrError] = useState('')
  const fileInputRef = useRef(null)

  useEffect(() => {
    if (initialQuery) {
      setFoodData(prev => ({ ...prev, name: initialQuery }))
    }
  }, [initialQuery])

  // Stop camera when modal closes or mode changes
  useEffect(() => {
    return () => {
      stopCameraScanner()
    }
  }, [activeMode, isOpen])

  if (!isOpen) return null

  // --- MANUAL HANDLERS ---
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

  const handleSubmit = (e) => {
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

  // --- BARCODE HANDLERS ---
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
      setActiveMode('manual') // switch to review populated data
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
            (err) => {
              // Scanner scanning frame callback, ignore frame noise
            }
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

  const handleNameSearch = async (query) => {
    if (!query || query.length < 2) return
    setNameSearchLoading(true)
    try {
      const results = await searchProductsByName(query)
      setNameSearchResults(results)
    } catch (e) {
      console.warn(e)
    } finally {
      setNameSearchLoading(false)
    }
  }

  // --- OCR / PHOTO HANDLERS ---
  const handleImageFileChange = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setSelectedImage(file)
    const previewUrl = URL.createObjectURL(file)
    setImagePreviewUrl(previewUrl)
    setOcrRawText('')
    setOcrError('')
  }

  const handleRunOcr = async () => {
    if (!selectedImage && !imagePreviewUrl) {
      setOcrError('Please select or upload a nutrition label photo first.')
      return
    }

    setOcrLoading(true)
    setOcrError('')
    setOcrProgress(10)
    setOcrStatusText('Loading OCR engine…')

    try {
      const { default: Tesseract } = await import('tesseract.js')
      const res = await Tesseract.recognize(
        selectedImage || imagePreviewUrl,
        'eng',
        {
          logger: (m) => {
            if (m.status === 'recognizing text') {
              setOcrStatusText('Recognizing text: ' + Math.round((m.progress || 0) * 100) + '%')
              setOcrProgress(Math.round((m.progress || 0) * 100))
            } else {
              setOcrStatusText(m.status)
            }
          }
        }
      )

      const text = res.data?.text || ''
      setOcrRawText(text)
      applyParsedOcrText(text, 'Photo Scanned Product')
    } catch (err) {
      console.error(err)
      setOcrError('OCR recognition failed. You can also paste text directly or choose a sample label.')
    } finally {
      setOcrLoading(false)
    }
  }

  const applyParsedOcrText = (text, defaultName = 'Nutrition Label Item') => {
    const parsed = parseNutritionText(text)
    setFoodData(prev => ({
      ...prev,
      name: prev.name || defaultName,
      serving: parsed.serving || '100g',
      calories: parsed.calories || '',
      protein: parsed.protein || '',
      carbs: parsed.carbs || '',
      fat: parsed.fat || '',
      source: 'ocr_label',
      imageUrl: imagePreviewUrl || '',
      micros: {
        vit_d: parsed.micros.vit_d || '',
        vit_b12: parsed.micros.vit_b12 || '',
        vit_c: parsed.micros.vit_c || '',
        vit_a: parsed.micros.vit_a || '',
        magnesium: parsed.micros.magnesium || '',
        zinc: parsed.micros.zinc || '',
        iron: parsed.micros.iron || '',
        calcium: parsed.micros.calcium || '',
        potassium: parsed.micros.potassium || '',
        omega_3: parsed.micros.omega_3 || ''
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
      ...parsed.rawExtracted
    })

    if (Object.values(parsed.micros).some(v => v > 0)) {
      setShowMicros(true)
    }

    if (parsed.cautions && Object.values(parsed.cautions).some(v => parseFloat(v) > 0)) {
      setShowCautions(true)
    }

    setActiveMode('manual') // switch to review populated data
  }

  // Close on Escape key and lock body scroll
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
          maxWidth: '820px'
        }}
      >
        {/* Modal Header */}
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 14px var(--primary-glow)'
            }}>
              <Sparkles size={20} color="#fff" aria-hidden="true" />
            </div>
            <div>
              <h3 id="add-food-modal-title" style={{ fontSize: '1.28rem', fontWeight: '800', color: '#fff' }}>
                Add Item to Food Database
              </h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Add items via Manual Entry, Barcode Scan, or Nutrition Label Photo (OCR)
              </p>
            </div>
          </div>

          <button 
            type="button"
            onClick={() => { stopCameraScanner(); onClose(); }} 
            className="modal-close-btn"
            aria-label="Close add food dialog"
          >
            <X size={20} aria-hidden="true" />
          </button>
        </div>

        {/* High-Contrast Tab Selection: Manual | Barcode | Photo OCR */}
        <div style={{
          display: 'flex',
          background: '#0d1527',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          padding: '10px 14px',
          gap: '8px',
          flexShrink: 0,
          overflowX: 'auto',
          WebkitOverflowScrolling: 'touch'
        }}>
          <button
            type="button"
            onClick={() => { stopCameraScanner(); setActiveMode('manual'); }}
            style={{
              flex: '1 1 auto',
              padding: '10px 12px',
              minHeight: '44px',
              borderRadius: 'var(--radius-md)',
              border: activeMode === 'manual' ? '1px solid var(--primary)' : '1px solid rgba(255, 255, 255, 0.08)',
              background: activeMode === 'manual' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255, 255, 255, 0.03)',
              color: activeMode === 'manual' ? '#34d399' : '#94a3b8',
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
            <span>1. Manual</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveMode('barcode')}
            style={{
              flex: '1 1 auto',
              padding: '10px 12px',
              minHeight: '44px',
              borderRadius: 'var(--radius-md)',
              border: activeMode === 'barcode' ? '1px solid var(--accent-blue)' : '1px solid rgba(255, 255, 255, 0.08)',
              background: activeMode === 'barcode' ? 'rgba(56, 189, 248, 0.2)' : 'rgba(255, 255, 255, 0.03)',
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

          <button
            type="button"
            onClick={() => { stopCameraScanner(); setActiveMode('ocr'); }}
            style={{
              flex: '1 1 auto',
              padding: '10px 12px',
              minHeight: '44px',
              borderRadius: 'var(--radius-md)',
              border: activeMode === 'ocr' ? '1px solid var(--accent-purple)' : '1px solid rgba(255, 255, 255, 0.08)',
              background: activeMode === 'ocr' ? 'rgba(168, 85, 247, 0.2)' : 'rgba(255, 255, 255, 0.03)',
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
            <span>3. Label OCR</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="modal-body">
          
          {/* ===================== MODE 2: BARCODE SCANNER & LOOKUP ===================== */}
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
                  <strong>Scan with Camera or Enter Barcode Number:</strong>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>
                    Automatically retrieves product name, brand, calories, macros, and micronutrients from Open Food Facts.
                  </div>
                </div>
              </div>

              {/* Barcode Input Bar */}
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                <input
                  type="text"
                  id="barcode-input-field"
                  name="barcodeQuery"
                  autoComplete="off"
                  aria-label="Enter or paste barcode number"
                  placeholder="Enter or paste barcode (e.g. 5449000000996, 737628064502)…"
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
                  aria-label="Search product by barcode"
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

              {/* Name Search fallback in OpenFoodFacts */}
              <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '16px' }}>
                <div style={{ fontSize: '0.84rem', color: 'var(--text-muted)', marginBottom: '8px' }}>
                  Don't have a barcode? Search product by name in Open Food Facts:
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <input
                    type="text"
                    id="name-search-input"
                    name="productNameSearch"
                    autoComplete="off"
                    aria-label="Search product by name"
                    placeholder="e.g. Greek yogurt, tuna in water, peanut butter…"
                    className="input-field"
                    style={{ flex: 1 }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleNameSearch(e.target.value)
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const val = document.getElementById('name-search-input')?.value
                      handleNameSearch(val)
                    }}
                    className="btn btn-secondary"
                    aria-label="Search Open Food Facts database by product name"
                  >
                    {nameSearchLoading ? <Loader2 size={16} className="animate-spin" /> : <Search size={16} />}
                    <span>Search</span>
                  </button>
                </div>

                {nameSearchResults.length > 0 && (
                  <div style={{
                    marginTop: '12px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px',
                    maxHeight: '200px',
                    overflowY: 'auto'
                  }}>
                    {nameSearchResults.map((prod, idx) => (
                      <div
                        key={idx}
                        onClick={() => {
                          if (prod.barcode) {
                            handleBarcodeLookup(prod.barcode)
                          } else {
                            setFoodData(prev => ({
                              ...prev,
                              name: prod.name,
                              calories: prod.calories,
                              protein: prod.protein,
                              carbs: prod.carbs,
                              fat: prod.fat,
                              serving: prod.serving,
                              source: 'barcode'
                            }))
                            setActiveMode('manual')
                          }
                        }}
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          padding: '10px 14px',
                          background: 'rgba(255, 255, 255, 0.03)',
                          border: '1px solid var(--border-color)',
                          borderRadius: 'var(--radius-sm)',
                          cursor: 'pointer',
                          transition: 'var(--transition)'
                        }}
                      >
                        <div>
                          <div style={{ fontWeight: '600', fontSize: '0.88rem' }}>{prod.name}</div>
                          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                            {prod.calories} kcal | P: {prod.protein}g | C: {prod.carbs}g | F: {prod.fat}g (per {prod.serving})
                          </div>
                        </div>
                        <span className="badge badge-blue">Select Product</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ===================== MODE 3: NUTRITION LABEL PHOTO OCR ===================== */}
          {activeMode === 'ocr' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              <div style={{
                background: 'rgba(168, 85, 247, 0.08)',
                border: '1px solid rgba(168, 85, 247, 0.2)',
                borderRadius: 'var(--radius-md)',
                padding: '14px 18px',
                fontSize: '0.85rem',
                color: 'var(--text-main)',
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}>
                <Camera size={24} color="var(--accent-purple)" />
                <div>
                  <strong>Photo or Image Upload of Nutrition Facts Label:</strong>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>
                    Intelligently scans calories, protein, carbohydrates, fats, and micronutrients from packaging.
                  </div>
                </div>
              </div>

              {/* Upload Drop Zone */}
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
                        maxHeight: '160px', 
                        borderRadius: 'var(--radius-sm)', 
                        border: '1px solid var(--border-color)',
                        objectFit: 'contain'
                      }} 
                    />
                    <div style={{ fontSize: '0.82rem', color: 'var(--accent-purple)', fontWeight: '600' }}>
                      ✓ Image loaded! Click here to replace
                    </div>
                  </div>
                ) : (
                  <>
                    <div style={{
                      width: '50px',
                      height: '50px',
                      borderRadius: '50%',
                      background: 'rgba(168, 85, 247, 0.15)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <Upload size={24} color="#c084fc" />
                    </div>
                    <div>
                      <div style={{ fontWeight: '700', fontSize: '1rem', color: '#f8fafc' }}>
                        Drag & drop image or click to upload / capture photo
                      </div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                        Supports JPG, PNG, WebP of the nutrition facts label
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Action: Run OCR */}
              {imagePreviewUrl && (
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                  <button
                    type="button"
                    disabled={ocrLoading}
                    onClick={handleRunOcr}
                    className="btn btn-primary"
                    style={{
                      background: 'linear-gradient(135deg, #a855f7 0%, #7e22ce 100%)',
                      boxShadow: '0 4px 14px rgba(168, 85, 247, 0.4)',
                      padding: '12px 28px',
                      fontSize: '1rem'
                    }}
                  >
                    {ocrLoading ? (
                      <>
                        <Loader2 size={18} className="animate-spin" />
                        <span>{ocrStatusText || 'Analyzing image...'} ({ocrProgress}%)</span>
                      </>
                    ) : (
                      <>
                        <Sparkles size={18} />
                        <span>Run OCR Recognition & Extraction</span>
                      </>
                    )}
                  </button>
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

              {/* Ready Sample Label Templates for 1-click test */}
              <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '16px' }}>
                <label className="input-label" style={{ marginBottom: '8px', display: 'block' }}>
                  Or test extraction instantly on sample nutrition labels:
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
                        <div style={{ fontWeight: '600', fontSize: '0.88rem' }}>{tmpl.title}</div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{tmpl.desc}</div>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setFoodData(prev => ({ ...prev, name: tmpl.name, category: tmpl.category }))
                          applyParsedOcrText(tmpl.text, tmpl.name)
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

              {/* Raw OCR text view / paste area */}
              <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <label className="input-label">Or paste scanned text directly (from mobile camera / lens):</label>
                  {ocrRawText && (
                    <button
                      type="button"
                      onClick={() => applyParsedOcrText(ocrRawText)}
                      className="btn btn-ghost btn-sm"
                      style={{ color: 'var(--primary-light)', padding: 0 }}
                    >
                      Re-parse
                    </button>
                  )}
                </div>
                <textarea
                  rows="3"
                  className="input-field"
                  placeholder="Paste label lines here (e.g. Calories 150, Protein 12g, Carbohydrates 20g...)"
                  value={ocrRawText}
                  onChange={(e) => setOcrRawText(e.target.value)}
                />
                {ocrRawText && (
                  <button
                    type="button"
                    onClick={() => applyParsedOcrText(ocrRawText)}
                    className="btn btn-secondary btn-sm"
                    style={{ marginTop: '8px' }}
                  >
                    <ArrowRight size={14} /> Extract Nutrition Values
                  </button>
                )}
              </div>
            </div>
          )}

          {/* ===================== MODE 1: FORM REVIEW & MANUAL ENTRY ===================== */}
          {activeMode === 'manual' && (
            <form id="food-entry-form" onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              
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
                  <span>Values retrieved from barcode database (Barcode: {foodData.barcode || 'scanned'}). Review and adjust as needed.</span>
                </div>
              )}

              {foodData.source === 'ocr_label' && (
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
                  <Camera size={16} />
                  <span>Values parsed from nutrition facts label! You can fine-tune or complete any field below.</span>
                </div>
              )}

              {/* Food Name & Category */}
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '14px' }}>
                <div className="input-group">
                  <label className="input-label">Food / Ingredient Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Non-Fat Greek Yogurt, Grilled Chicken Breast, Quinoa..."
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
                  <label className="input-label" style={{ color: 'var(--primary-light)' }}>
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

                {/* Real-time Macro Math Helper & One-Click Auto-Calculate */}
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

              {/* Collapsible Micronutrients Section */}
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
                    Micronutrients & Vitamins (Optional for precision tracking)
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

              {/* Collapsible Unhealthy Habits & Caution Nutrients Section */}
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
                    <span>Unhealthy Food Habits & Caution Nutrients (Sodium, Trans Fat, Cholesterol...)</span>
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
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                        <label className="input-label" style={{ fontSize: '0.7rem' }}>Sodium / Salt (mg)</label>
                        <span style={{ fontSize: '0.62rem', color: 'var(--text-muted)' }}>&le; 2300mg</span>
                      </div>
                      <input
                        type="number"
                        placeholder="0"
                        value={foodData.cautions?.sodium || ''}
                        onChange={(e) => handleCautionChange('sodium', e.target.value)}
                        className="input-field"
                        style={{ borderColor: detectedFields.sodium ? '#38bdf8' : undefined }}
                      />
                    </div>

                    <div className="input-group">
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                        <label className="input-label" style={{ fontSize: '0.7rem' }}>Trans Fat (g)</label>
                        <span style={{ fontSize: '0.62rem', color: '#f43f5e', fontWeight: '700' }}>0g limit</span>
                      </div>
                      <input
                        type="number"
                        step="0.1"
                        placeholder="0"
                        value={foodData.cautions?.transFat || ''}
                        onChange={(e) => handleCautionChange('transFat', e.target.value)}
                        className="input-field"
                        style={{ borderColor: detectedFields.transFat ? '#f43f5e' : undefined }}
                      />
                    </div>

                    <div className="input-group">
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                        <label className="input-label" style={{ fontSize: '0.7rem' }}>Cholesterol (mg)</label>
                        <span style={{ fontSize: '0.62rem', color: 'var(--text-muted)' }}>&le; 300mg</span>
                      </div>
                      <input
                        type="number"
                        placeholder="0"
                        value={foodData.cautions?.cholesterol || ''}
                        onChange={(e) => handleCautionChange('cholesterol', e.target.value)}
                        className="input-field"
                        style={{ borderColor: detectedFields.cholesterol ? '#f59e0b' : undefined }}
                      />
                    </div>

                    <div className="input-group">
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                        <label className="input-label" style={{ fontSize: '0.7rem' }}>Saturated Fat (g)</label>
                        <span style={{ fontSize: '0.62rem', color: 'var(--text-muted)' }}>&le; 20g</span>
                      </div>
                      <input
                        type="number"
                        step="0.1"
                        placeholder="0"
                        value={foodData.cautions?.saturatedFat || ''}
                        onChange={(e) => handleCautionChange('saturatedFat', e.target.value)}
                        className="input-field"
                        style={{ borderColor: detectedFields.saturatedFat ? '#fb923c' : undefined }}
                      />
                    </div>

                    <div className="input-group">
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                        <label className="input-label" style={{ fontSize: '0.7rem' }}>Added Sugars (g)</label>
                        <span style={{ fontSize: '0.62rem', color: 'var(--text-muted)' }}>&le; 36g</span>
                      </div>
                      <input
                        type="number"
                        step="0.1"
                        placeholder="0"
                        value={foodData.cautions?.addedSugar || ''}
                        onChange={(e) => handleCautionChange('addedSugar', e.target.value)}
                        className="input-field"
                        style={{ borderColor: detectedFields.addedSugar ? '#ec4899' : undefined }}
                      />
                    </div>
                  </div>
                )}
              </div>

            </form>
          )}

        </div>

        {/* Modal Footer */}
        <div className="modal-footer">
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
              <span>Save to Food Database</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setActiveMode('manual')}
              className="btn btn-primary"
              style={{ minWidth: '220px' }}
            >
              <span>Continue to Review & Edit</span>
              <ArrowRight size={16} />
            </button>
          )}
        </div>

      </div>
    </div>,
    document.body
  )
}
