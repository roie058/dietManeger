import React, { useState, useRef, useEffect } from 'react'
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
  RefreshCw,
  Eye,
  Info
} from 'lucide-react'
import { fetchProductByBarcode, searchProductsByName, SAMPLE_BARCODES } from '../utils/barcodeService'
import { parseNutritionText } from '../utils/nutritionOcrParser'
import Tesseract from 'tesseract.js'
import { Html5Qrcode } from 'html5-qrcode'

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

export default function AddFoodModal({ isOpen, onClose, onSave, initialQuery = '' }) {
  const [activeMode, setActiveMode] = useState('manual') // 'manual' | 'barcode' | 'ocr'

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
    }
  })

  const [showMicros, setShowMicros] = useState(false)
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
        }
      })
      setDetectedFields({
        calories: true,
        protein: true,
        carbs: true,
        fat: true,
        ...res.micros
      })
      setActiveMode('manual') // switch to review populated data
    } catch (err) {
      setBarcodeError(err.message || 'Product could not be retrieved from the database.')
    } finally {
      setBarcodeLoading(false)
    }
  }

  const startCameraScanner = () => {
    setCameraActive(true)
    setBarcodeError('')
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
    setOcrStatusText('Loading OCR engine...')

    try {
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
      }
    }))

    setDetectedFields({
      ...parsed.rawExtracted
    })

    if (Object.values(parsed.micros).some(v => v > 0)) {
      setShowMicros(true)
    }

    setActiveMode('manual') // switch to review populated data
  }

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.82)',
      backdropFilter: 'blur(10px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      padding: '16px'
    }}>
      <div 
        className="glass-panel" 
        style={{
          width: '100%',
          maxWidth: '780px',
          maxHeight: '92vh',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          border: '1px solid var(--border-glow)',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.7)'
        }}
      >
        {/* Modal Header */}
        <div style={{
          padding: '20px 24px',
          borderBottom: '1px solid var(--border-color)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: 'rgba(255, 255, 255, 0.02)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Sparkles size={18} color="#fff" />
            </div>
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '800' }}>
                Add Item to Food Database
              </h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Add items via Manual Entry, Barcode Scan, or Nutrition Label Photo (OCR)
              </p>
            </div>
          </div>

          <button 
            onClick={() => { stopCameraScanner(); onClose(); }} 
            className="btn btn-ghost btn-icon"
          >
            <X size={20} />
          </button>
        </div>

        {/* Tab Selection: Manual | Barcode | Photo OCR */}
        <div style={{
          display: 'flex',
          background: 'rgba(0, 0, 0, 0.3)',
          borderBottom: '1px solid var(--border-color)',
          padding: '8px 24px',
          gap: '10px'
        }}>
          <button
            type="button"
            onClick={() => { stopCameraScanner(); setActiveMode('manual'); }}
            style={{
              flex: 1,
              padding: '10px 14px',
              borderRadius: '10px',
              border: activeMode === 'manual' ? '1px solid var(--primary)' : '1px solid transparent',
              background: activeMode === 'manual' ? 'rgba(16, 185, 129, 0.15)' : 'transparent',
              color: activeMode === 'manual' ? 'var(--primary-light)' : 'var(--text-muted)',
              fontWeight: activeMode === 'manual' ? '700' : '500',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              fontSize: '0.88rem',
              transition: 'var(--transition)'
            }}
          >
            <FileText size={16} />
            <span>1. Manual Entry</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveMode('barcode')}
            style={{
              flex: 1,
              padding: '10px 14px',
              borderRadius: '10px',
              border: activeMode === 'barcode' ? '1px solid var(--accent-blue)' : '1px solid transparent',
              background: activeMode === 'barcode' ? 'rgba(56, 189, 248, 0.15)' : 'transparent',
              color: activeMode === 'barcode' ? 'var(--accent-blue)' : 'var(--text-muted)',
              fontWeight: activeMode === 'barcode' ? '700' : '500',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              fontSize: '0.88rem',
              transition: 'var(--transition)'
            }}
          >
            <Barcode size={16} />
            <span>2. Barcode Scan</span>
          </button>

          <button
            type="button"
            onClick={() => { stopCameraScanner(); setActiveMode('ocr'); }}
            style={{
              flex: 1,
              padding: '10px 14px',
              borderRadius: '10px',
              border: activeMode === 'ocr' ? '1px solid var(--accent-purple)' : '1px solid transparent',
              background: activeMode === 'ocr' ? 'rgba(168, 85, 247, 0.15)' : 'transparent',
              color: activeMode === 'ocr' ? '#c084fc' : 'var(--text-muted)',
              fontWeight: activeMode === 'ocr' ? '700' : '500',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              fontSize: '0.88rem',
              transition: 'var(--transition)'
            }}
          >
            <Camera size={16} />
            <span>3. Nutrition Label Photo (OCR)</span>
          </button>
        </div>

        {/* Modal Body */}
        <div style={{
          padding: '24px',
          overflowY: 'auto',
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          gap: '20px'
        }}>
          
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
              <div style={{ display: 'flex', gap: '10px' }}>
                <input
                  type="text"
                  placeholder="Enter or paste barcode (e.g. 5449000000996, 737628064502)..."
                  value={barcodeInput}
                  onChange={(e) => setBarcodeInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleBarcodeLookup()}
                  className="input-field"
                  style={{ flex: 1, fontSize: '1rem', letterSpacing: '0.05em' }}
                />
                <button
                  type="button"
                  disabled={barcodeLoading || !barcodeInput.trim()}
                  onClick={() => handleBarcodeLookup()}
                  className="btn btn-primary"
                  style={{ whiteSpace: 'nowrap' }}
                >
                  {barcodeLoading ? <Loader2 size={16} className="animate-spin" /> : <Search size={16} />}
                  <span>Search Barcode</span>
                </button>

                <button
                  type="button"
                  onClick={() => cameraActive ? stopCameraScanner() : startCameraScanner()}
                  className="btn btn-secondary"
                  style={{ whiteSpace: 'nowrap' }}
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
                    placeholder="e.g. Greek yogurt, tuna in water, peanut butter..."
                    id="name-search-input"
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

            </form>
          )}

        </div>

        {/* Modal Footer */}
        <div style={{
          padding: '16px 24px',
          borderTop: '1px solid var(--border-color)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: 'rgba(255, 255, 255, 0.02)'
        }}>
          <button
            type="button"
            onClick={() => { stopCameraScanner(); onClose(); }}
            className="btn btn-secondary"
          >
            Cancel
          </button>

          {activeMode === 'manual' ? (
            <button
              type="submit"
              form="food-entry-form"
              className="btn btn-primary"
            >
              <Check size={16} />
              <span>Save to Food Database</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setActiveMode('manual')}
              className="btn btn-primary"
            >
              <span>Continue to Review & Edit</span>
              <ArrowRight size={16} />
            </button>
          )}
        </div>

      </div>
    </div>
  )
}
