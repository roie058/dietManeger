/**
 * Caution Nutrients & Unhealthy Food Habits Reference Data
 * Clinical guidelines based on AHA (American Heart Association), WHO, and Dietary Guidelines
 */

export const CAUTION_NUTRIENTS = {
  transFat: {
    id: 'transFat',
    label: 'Trans Fat',
    shortLabel: 'Trans Fat',
    unit: 'g',
    dailyLimit: 0.5,
    idealLimit: 0.0,
    warningThreshold: 0.2,
    badgeColor: 'badge-rose',
    accentColor: '#f43f5e',
    severity: 'critical',
    category: 'Vascular Risk',
    title: 'Industrial Trans Fatty Acids',
    whyCare: 'The WHO and FDA recommend 0g intake. Trans fats directly elevate atherogenic LDL-C, lower protective HDL-C, and provoke chronic vascular inflammation.',
    sources: 'Commercial baked pastries, deep-fried fast food, margarine, processed snacks, shortening',
    counterMeasure: 'Eliminate partially hydrogenated oils. Choose monounsaturated and cold-pressed fats like extra virgin olive oil and avocado.'
  },
  cholesterol: {
    id: 'cholesterol',
    label: 'Dietary Cholesterol',
    shortLabel: 'Cholesterol',
    unit: 'mg',
    dailyLimit: 300,
    idealLimit: 200,
    warningThreshold: 240,
    badgeColor: 'badge-amber',
    accentColor: '#f59e0b',
    severity: 'moderate',
    category: 'Lipid Balance',
    title: 'Dietary Sterols & Cholesterol',
    whyCare: 'While blood cholesterol response varies with ApoE genotype, keeping dietary cholesterol under 300mg reduces oxidative burden on the vascular endothelium.',
    sources: 'Egg yolks, organ meats, shrimp, butter, processed meats, full-fat dairy',
    counterMeasure: 'Combine dietary cholesterol with viscous soluble fiber (oats, legumes, psyllium husk) which actively binds intestinal cholesterol for excretion.'
  },
  sodium: {
    id: 'sodium',
    label: 'Sodium (Salt)',
    shortLabel: 'Sodium / Salt',
    unit: 'mg',
    dailyLimit: 2300,
    idealLimit: 1500,
    warningThreshold: 1800,
    badgeColor: 'badge-blue',
    accentColor: '#38bdf8',
    severity: 'high',
    category: 'Cardiovascular & Fluid',
    title: 'Sodium & Salt Intake',
    whyCare: 'Excess sodium shifts fluid balance into blood vessels, elevating blood pressure, arterial stiffness, and promoting systemic water retention.',
    sources: '1 tsp salt = 2,300mg sodium. Processed cold cuts, canned soups, soy sauce, pickles, chips, commercial bread',
    counterMeasure: 'Counterbalance sodium with high-potassium foods (spinach, avocado, salmon, coconut water) and drink an extra 500ml water to flush renal sodium.'
  },
  saturatedFat: {
    id: 'saturatedFat',
    label: 'Saturated Fat',
    shortLabel: 'Sat. Fat',
    unit: 'g',
    dailyLimit: 20,
    idealLimit: 15,
    warningThreshold: 16,
    badgeColor: 'badge-amber',
    accentColor: '#fb923c',
    severity: 'moderate',
    category: 'Cardiovascular Risk',
    title: 'Saturated Fatty Acids',
    whyCare: 'AHA recommends keeping saturated fat under 6-7% of daily calories (~16-20g). High intakes downregulate hepatic LDL clearance receptors.',
    sources: 'Bacon, fatty cuts of beef, butter, heavy cream, coconut oil, palm oil',
    counterMeasure: 'Swap butter for olive oil or avocado oil. Choose lean poultry breast, fish, and legumes.'
  },
  addedSugar: {
    id: 'addedSugar',
    label: 'Added Sugars',
    shortLabel: 'Added Sugar',
    unit: 'g',
    dailyLimit: 36, // Men 36g, Women 25g
    femaleLimit: 25,
    warningThreshold: 25,
    badgeColor: 'badge-rose',
    accentColor: '#ec4899',
    severity: 'high',
    category: 'Metabolic & Insulin',
    title: 'Refined & Added Sugars',
    whyCare: 'Concentrated sugars cause rapid insulin spikes, trigger liver de novo lipogenesis (visceral/fatty liver risk), and provoke afternoon energy crashes.',
    sources: 'Sodas, sweetened coffee drinks, candy, pastries, ketchup, sweet dressings, barbecue sauce',
    counterMeasure: 'Eat whole fresh fruits where natural sugars are encapsulated in dietary fiber and polyphenols.'
  }
}

export const LIFESTYLE_HABIT_GUIDELINES = {
  lateNightEating: {
    title: 'Circadian Digestive Window',
    cutoffHour: 21, // 9:00 PM
    maxLateCalories: 350,
    desc: 'Eating heavy meals after 9:00 PM delays melatonin release, reduces nocturnal heart rate dip, and causes morning insulin resistance.',
    tip: 'If hungry before bed, opt for light casein protein (Greek yogurt) or chamomile herbal tea with magnesium.'
  },
  sodiumPotassiumRatio: {
    title: 'Sodium-to-Potassium (Na:K) Ratio',
    targetRatio: 1.0,
    warningRatio: 1.25,
    desc: 'The molar ratio between sodium and potassium is a stronger predictor of cardiovascular health than sodium alone. Optimal is under 1.0 (more potassium than sodium).',
    tip: 'Pair savory salted meals with potassium-dense dark leafy greens, sweet potatoes, or avocados.'
  }
}
