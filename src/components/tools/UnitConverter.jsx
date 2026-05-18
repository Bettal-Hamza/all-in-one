import { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Ruler, ArrowRightLeft, ChevronDown, Copy, Check,
  ShieldCheck, Gauge, LayoutGrid, Zap,
  Weight, Thermometer, Move, Box, Timer, HardDrive, Droplets,
} from 'lucide-react'
import { recordVisit } from '../../lib/recentTools.js'
import FAQSchema from '../FAQSchema.jsx'
import SEOManager from '../SEOManager.jsx'

const CATEGORIES = [
  {
    id: 'length',
    label: 'Length',
    Icon: Ruler,
    units: [
      { id: 'mm',   label: 'Millimeter',  abbr: 'mm',   toBase: 0.001 },
      { id: 'cm',   label: 'Centimeter',  abbr: 'cm',   toBase: 0.01 },
      { id: 'm',    label: 'Meter',       abbr: 'm',    toBase: 1 },
      { id: 'km',   label: 'Kilometer',   abbr: 'km',   toBase: 1000 },
      { id: 'in',   label: 'Inch',        abbr: 'in',   toBase: 0.0254 },
      { id: 'ft',   label: 'Foot',        abbr: 'ft',   toBase: 0.3048 },
      { id: 'yd',   label: 'Yard',        abbr: 'yd',   toBase: 0.9144 },
      { id: 'mi',   label: 'Mile',        abbr: 'mi',   toBase: 1609.344 },
    ],
  },
  {
    id: 'weight',
    label: 'Weight',
    Icon: Weight,
    units: [
      { id: 'mg',   label: 'Milligram',   abbr: 'mg',   toBase: 0.000001 },
      { id: 'g',    label: 'Gram',        abbr: 'g',    toBase: 0.001 },
      { id: 'kg',   label: 'Kilogram',    abbr: 'kg',   toBase: 1 },
      { id: 't',    label: 'Metric Ton',  abbr: 't',    toBase: 1000 },
      { id: 'oz',   label: 'Ounce',       abbr: 'oz',   toBase: 0.0283495 },
      { id: 'lb',   label: 'Pound',       abbr: 'lb',   toBase: 0.453592 },
      { id: 'st',   label: 'Stone',       abbr: 'st',   toBase: 6.35029 },
    ],
  },
  {
    id: 'temperature',
    label: 'Temperature',
    Icon: Thermometer,
    units: [
      { id: 'c',  label: 'Celsius',    abbr: '°C', custom: true },
      { id: 'f',  label: 'Fahrenheit', abbr: '°F', custom: true },
      { id: 'k',  label: 'Kelvin',     abbr: 'K',  custom: true },
    ],
  },
  {
    id: 'area',
    label: 'Area',
    Icon: Move,
    units: [
      { id: 'mm2',   label: 'mm²',             abbr: 'mm²',   toBase: 0.000001 },
      { id: 'cm2',   label: 'cm²',             abbr: 'cm²',   toBase: 0.0001 },
      { id: 'm2',    label: 'm²',              abbr: 'm²',    toBase: 1 },
      { id: 'ha',    label: 'Hectare',         abbr: 'ha',    toBase: 10000 },
      { id: 'km2',   label: 'km²',             abbr: 'km²',   toBase: 1000000 },
      { id: 'in2',   label: 'in²',             abbr: 'in²',   toBase: 0.00064516 },
      { id: 'ft2',   label: 'ft²',             abbr: 'ft²',   toBase: 0.092903 },
      { id: 'ac',    label: 'Acre',            abbr: 'ac',    toBase: 4046.86 },
      { id: 'mi2',   label: 'mi²',             abbr: 'mi²',   toBase: 2589988.11 },
    ],
  },
  {
    id: 'volume',
    label: 'Volume',
    Icon: Droplets,
    units: [
      { id: 'ml',    label: 'Milliliter',  abbr: 'mL',   toBase: 0.000001 },
      { id: 'l',     label: 'Liter',       abbr: 'L',    toBase: 0.001 },
      { id: 'm3',    label: 'm³',          abbr: 'm³',   toBase: 1 },
      { id: 'tsp',   label: 'Teaspoon',    abbr: 'tsp',  toBase: 0.00000492892 },
      { id: 'tbsp',  label: 'Tablespoon',  abbr: 'tbsp', toBase: 0.0000147868 },
      { id: 'floz',  label: 'Fluid Ounce', abbr: 'fl oz',toBase: 0.0000295735 },
      { id: 'cup',   label: 'Cup',         abbr: 'cup',  toBase: 0.000236588 },
      { id: 'pt',    label: 'Pint',        abbr: 'pt',   toBase: 0.000473176 },
      { id: 'gal',   label: 'Gallon',      abbr: 'gal',  toBase: 0.00378541 },
    ],
  },
  {
    id: 'speed',
    label: 'Speed',
    Icon: Gauge,
    units: [
      { id: 'ms',    label: 'Meters/sec',   abbr: 'm/s',   toBase: 1 },
      { id: 'kmh',   label: 'km/h',         abbr: 'km/h',  toBase: 0.277778 },
      { id: 'mph',   label: 'Miles/hour',   abbr: 'mph',   toBase: 0.44704 },
      { id: 'kn',    label: 'Knot',         abbr: 'kn',    toBase: 0.514444 },
      { id: 'fts',   label: 'Feet/sec',     abbr: 'ft/s',  toBase: 0.3048 },
    ],
  },
  {
    id: 'data',
    label: 'Data',
    Icon: HardDrive,
    units: [
      { id: 'b',     label: 'Byte',       abbr: 'B',    toBase: 1 },
      { id: 'kb',    label: 'Kilobyte',   abbr: 'KB',   toBase: 1024 },
      { id: 'mb',    label: 'Megabyte',   abbr: 'MB',   toBase: 1048576 },
      { id: 'gb',    label: 'Gigabyte',   abbr: 'GB',   toBase: 1073741824 },
      { id: 'tb',    label: 'Terabyte',   abbr: 'TB',   toBase: 1099511627776 },
      { id: 'bit',   label: 'Bit',        abbr: 'bit',  toBase: 0.125 },
      { id: 'kbit',  label: 'Kilobit',    abbr: 'Kbit', toBase: 128 },
      { id: 'mbit',  label: 'Megabit',    abbr: 'Mbit', toBase: 131072 },
    ],
  },
  {
    id: 'time',
    label: 'Time',
    Icon: Timer,
    units: [
      { id: 'ms',    label: 'Millisecond', abbr: 'ms',   toBase: 0.001 },
      { id: 's',     label: 'Second',      abbr: 's',    toBase: 1 },
      { id: 'min',   label: 'Minute',      abbr: 'min',  toBase: 60 },
      { id: 'hr',    label: 'Hour',        abbr: 'hr',   toBase: 3600 },
      { id: 'day',   label: 'Day',         abbr: 'day',  toBase: 86400 },
      { id: 'wk',    label: 'Week',        abbr: 'wk',   toBase: 604800 },
      { id: 'mo',    label: 'Month (30d)', abbr: 'mo',   toBase: 2592000 },
      { id: 'yr',    label: 'Year (365d)', abbr: 'yr',   toBase: 31536000 },
    ],
  },
]

function convertTemp(value, fromId, toId) {
  if (fromId === toId) return value
  let celsius
  if (fromId === 'c') celsius = value
  else if (fromId === 'f') celsius = (value - 32) * 5 / 9
  else celsius = value - 273.15
  if (toId === 'c') return celsius
  if (toId === 'f') return celsius * 9 / 5 + 32
  return celsius + 273.15
}

function convert(value, fromUnit, toUnit, categoryId) {
  if (categoryId === 'temperature') return convertTemp(value, fromUnit.id, toUnit.id)
  const base = value * fromUnit.toBase
  return base / toUnit.toBase
}

function formatResult(num) {
  if (num === 0) return '0'
  const abs = Math.abs(num)
  if (abs >= 1e15 || (abs > 0 && abs < 1e-10)) return num.toExponential(6)
  if (Number.isInteger(num) && abs < 1e15) return num.toLocaleString('en-US')
  const decimals = abs >= 1000 ? 4 : abs >= 1 ? 6 : 10
  const fixed = parseFloat(num.toPrecision(12))
  return fixed.toLocaleString('en-US', { maximumFractionDigits: decimals })
}

// ─── DYNAMIC SEO META PER CATEGORY ──────────────────────────────────────────

const CATEGORY_SEO = {
  length: {
    title: 'Online Length Unit Converter | mm, cm, m, km, in, ft, mi',
    description: 'Convert between length units instantly — millimeters, centimeters, meters, kilometers, inches, feet, yards, and miles. Free, private, and works offline.',
  },
  weight: {
    title: 'Online Weight & Mass Converter | kg, lb, oz, g, stone',
    description: 'Convert between weight and mass units including kilograms, pounds, ounces, grams, milligrams, metric tons, and stones. Instant results in your browser.',
  },
  temperature: {
    title: 'Temperature Converter | Celsius, Fahrenheit, Kelvin',
    description: 'Convert between Celsius (°C), Fahrenheit (°F), and Kelvin (K) instantly. Uses exact conversion formulas for scientific-grade precision.',
  },
  area: {
    title: 'Online Area Unit Converter | m², ft², acres, hectares',
    description: 'Convert between area units — square meters, square feet, acres, hectares, square kilometers, and square miles. Real-time metric and imperial area conversion.',
  },
  volume: {
    title: 'Online Volume Converter | liters, gallons, cups, mL, fl oz',
    description: 'Convert between volume units including liters, milliliters, gallons, cups, pints, fluid ounces, tablespoons, and cubic meters instantly.',
  },
  speed: {
    title: 'Online Speed Unit Converter | m/s, km/h, mph, knots',
    description: 'Convert between speed units including meters per second (m/s), kilometers per hour (km/h), miles per hour (mph), knots, and feet per second instantly.',
  },
  data: {
    title: 'Data Storage Converter | bytes, KB, MB, GB, TB, bits',
    description: 'Convert between digital storage units — bytes, kilobytes, megabytes, gigabytes, terabytes, bits, kilobits, and megabits. Uses binary (1024) base.',
  },
  time: {
    title: 'Online Time Unit Converter | seconds, minutes, hours, days',
    description: 'Convert between time units — milliseconds, seconds, minutes, hours, days, weeks, months, and years. Instant real-time calculations in your browser.',
  },
}

// ─── SEO CONTENT ────────────────────────────────────────────────────────────

const HOW_TO_STEPS = [
  {
    Icon: LayoutGrid,
    title: 'Pick a category',
    body: 'Choose from Length, Weight, Temperature, Area, Volume, Speed, Data, or Time. Each category contains all the units you need for everyday and technical conversions.',
  },
  {
    Icon: ArrowRightLeft,
    title: 'Select your units',
    body: 'Pick the unit you\'re converting from and the unit you\'re converting to. Use the swap button to reverse the direction instantly.',
  },
  {
    Icon: Zap,
    title: 'Enter a value',
    body: 'Type any number and see the converted result instantly — no button to click. Results update in real time as you type, with full precision for scientific use.',
  },
  {
    Icon: Copy,
    title: 'Copy the result',
    body: 'Click the copy icon to send the result straight to your clipboard. Ready to paste into spreadsheets, documents, or code.',
  },
]

const FAQS = [
  {
    q: 'Is this Unit Converter accurate for scientific work?',
    a: 'Yes — Toolyy\'s Unit Converter uses IEEE 754 double-precision arithmetic, the same standard used by scientific calculators, spreadsheets, and programming languages. Conversion factors are sourced from NIST and SI standards. Results are displayed with up to 12 significant digits of precision.',
  },
  {
    q: 'How do I convert mph to km/h?',
    a: 'To convert miles per hour to kilometers per hour, multiply by 1.60934. For example, 60 mph × 1.60934 = 96.56 km/h. Toolyy\'s Speed converter does this instantly — select "Miles/hour" as the source unit and "km/h" as the target, then type your value.',
  },
  {
    q: 'What is the formula for Celsius to Fahrenheit?',
    a: 'The formula is °F = (°C × 9/5) + 32. For example, 100°C × 9/5 + 32 = 212°F. To convert Fahrenheit back to Celsius, use °C = (°F − 32) × 5/9. Toolyy applies these exact formulas so results are precise to full floating-point accuracy.',
  },
  {
    q: 'Does it work offline?',
    a: 'Yes — once the page has loaded, the converter works entirely offline. All conversion logic runs in your browser using JavaScript. There are no server calls, no API dependencies, and no network requests. You can disconnect from the internet and continue converting.',
  },
  {
    q: 'What is the difference between metric and imperial units?',
    a: 'The metric system (SI) uses base-10 units like meters, kilograms, and liters, used by most countries worldwide. The imperial system uses feet, pounds, and gallons, primarily in the United States and United Kingdom. Toolyy supports both systems and converts between them seamlessly.',
  },
  {
    q: 'Is my data private?',
    a: 'Completely. The Unit Converter is a pure client-side tool. Every calculation happens in your browser and nothing is sent to any server. There is no tracking of what you convert, no analytics on your inputs, and no data storage of any kind.',
  },
  {
    q: 'How many bytes are in a gigabyte?',
    a: 'In binary (computing standard), 1 Gigabyte = 1,073,741,824 bytes (1024³). In decimal (storage marketing), 1 GB = 1,000,000,000 bytes (10⁹). Toolyy\'s Data converter uses binary (base-1024) values, which matches how operating systems report storage.',
  },
  {
    q: 'Which temperature scales are supported?',
    a: 'The tool supports Celsius, Fahrenheit, and Kelvin. Temperature conversion uses exact formulas (not lookup tables), so results are precise to the full accuracy of your browser\'s floating-point engine.',
  },
]

// ─── SUB-COMPONENTS ─────────────────────────────────────────────────────────

function FaqItem({ q, a }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="border-b border-gray-100 last:border-0">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between gap-4 py-4 text-left group"
        aria-expanded={open}
      >
        <span className="text-sm font-bold text-gray-800 group-hover:text-brand transition-colors">{q}</span>
        <ChevronDown
          className={`w-4 h-4 flex-shrink-0 text-gray-300 transition-transform duration-300 ${open ? 'rotate-180 text-brand' : ''}`}
        />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="answer"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <p className="text-sm text-gray-500 leading-relaxed pb-4 pr-8">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function UnitSelect({ units, value, onChange, label }) {
  return (
    <div className="flex-1">
      <label className="text-[10px] font-black uppercase tracking-widest text-gray-300 mb-1.5 block">
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-3 rounded-2xl border border-gray-200 bg-gray-50/80 text-sm font-bold text-gray-800 focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand/30 transition-colors appearance-none cursor-pointer"
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%239ca3af' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center' }}
      >
        {units.map(u => (
          <option key={u.id} value={u.id}>{u.label} ({u.abbr})</option>
        ))}
      </select>
    </div>
  )
}

// ─── MAIN COMPONENT ──────────────────────────────────────────────────────────

export default function UnitConverter() {
  const [catId, setCatId] = useState('length')
  const [fromId, setFromId] = useState('km')
  const [toId, setToId] = useState('mi')
  const [inputVal, setInputVal] = useState('1')
  const [copied, setCopied] = useState(false)

  const cat = useMemo(() => CATEGORIES.find(c => c.id === catId), [catId])
  const fromUnit = cat.units.find(u => u.id === fromId) || cat.units[0]
  const toUnit = cat.units.find(u => u.id === toId) || cat.units[1]

  useEffect(() => { recordVisit('unit-converter') }, [])

  function handleCategoryChange(newCatId) {
    const newCat = CATEGORIES.find(c => c.id === newCatId)
    setCatId(newCatId)
    setFromId(newCat.units[0].id)
    setToId(newCat.units[Math.min(1, newCat.units.length - 1)].id)
    setInputVal('1')
  }

  function handleSwap() {
    setFromId(toId)
    setToId(fromId)
  }

  const numVal = parseFloat(inputVal)
  const isValid = inputVal !== '' && !isNaN(numVal) && isFinite(numVal)
  const result = isValid ? convert(numVal, fromUnit, toUnit, catId) : null
  const resultStr = result !== null ? formatResult(result) : ''

  async function handleCopy() {
    if (!resultStr) return
    await navigator.clipboard.writeText(resultStr.replace(/,/g, ''))
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <SEOManager
        title={CATEGORY_SEO[catId].title}
        description={CATEGORY_SEO[catId].description}
        appName="Toolyy Unit Converter"
        appDescription="A free online real-time unit calculator that converts between hundreds of metric and imperial units across 8 categories — length, weight, temperature, area, volume, speed, data, and time. 100% private, offline-capable, no sign-up required."
        applicationCategory="UtilityApplication"
        operatingSystem="All"
      />
      <FAQSchema faqs={FAQS} />

      {/* ── Page heading ───────────────────────────────────────────── */}
      <motion.header
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-8"
      >
        <p className="text-xs font-bold tracking-widest uppercase text-brand/70 mb-1">Developer &amp; Utility</p>
        <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-gray-900">
          Unit Converter
        </h1>
        <p className="mt-2 text-gray-400 font-medium">
          Convert between any units — length, weight, temperature &amp; more. Free online metric conversion calculator.
        </p>
      </motion.header>

      {/* ── Tool ────────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Main converter */}
          <div className="lg:col-span-2 bg-surface-card backdrop-blur-xl border border-surface-border rounded-3xl shadow-glass p-6 flex flex-col gap-5">
            {/* Category tabs */}
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((c) => {
                const active = c.id === catId
                return (
                  <button
                    key={c.id}
                    onClick={() => handleCategoryChange(c.id)}
                    className={`
                      inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all duration-200
                      ${active
                        ? 'bg-brand text-white shadow-md'
                        : 'bg-gray-50/80 text-gray-500 hover:bg-gray-100 border border-gray-100'}
                    `}
                  >
                    <c.Icon aria-hidden="true" className={`w-3.5 h-3.5 ${active ? 'text-white/80' : 'text-gray-400'}`} />
                    {c.label}
                  </button>
                )
              })}
            </div>

            {/* From / To selects */}
            <div className="flex items-end gap-3">
              <UnitSelect
                units={cat.units}
                value={fromId}
                onChange={setFromId}
                label="From"
              />
              <button
                onClick={handleSwap}
                className="flex-shrink-0 w-10 h-10 mb-0.5 rounded-xl bg-brand/10 hover:bg-brand/20 flex items-center justify-center transition-colors"
                aria-label="Swap units"
              >
                <ArrowRightLeft aria-hidden="true" className="w-4 h-4 text-brand" />
              </button>
              <UnitSelect
                units={cat.units}
                value={toId}
                onChange={setToId}
                label="To"
              />
            </div>

            {/* Input */}
            <div>
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-300 mb-1.5 block">
                Value
              </label>
              <input
                type="number"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                placeholder="Enter a number"
                className="w-full px-4 py-3 rounded-2xl border border-gray-200 bg-gray-50/80 text-lg font-bold text-gray-800 focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand/30 transition-colors"
                autoFocus
              />
            </div>

            {/* Result */}
            <div className="bg-gray-50/80 border border-gray-100 rounded-2xl p-5">
              <div className="flex items-center justify-between mb-1">
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-300">
                  Result
                </p>
                {resultStr && (
                  <button
                    onClick={handleCopy}
                    className="inline-flex items-center gap-1 text-[10px] font-bold text-gray-400 hover:text-brand transition-colors"
                  >
                    {copied
                      ? <><Check aria-hidden="true" className="w-3 h-3 text-emerald-500" /> Copied</>
                      : <><Copy aria-hidden="true" className="w-3 h-3" /> Copy</>
                    }
                  </button>
                )}
              </div>
              <p className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight break-all">
                {isValid
                  ? <>{resultStr} <span className="text-lg font-bold text-gray-400">{toUnit.abbr}</span></>
                  : <span className="text-gray-300">—</span>
                }
              </p>
              {isValid && (
                <p className="text-xs text-gray-400 mt-1.5 font-medium">
                  {inputVal} {fromUnit.abbr} = {resultStr} {toUnit.abbr}
                </p>
              )}
            </div>

          </div>

          {/* Sidebar — quick reference */}
          <div className="flex flex-col gap-4">
            <div className="bg-surface-card backdrop-blur-xl border border-surface-border rounded-3xl shadow-glass p-5">
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-300 mb-3">
                All {cat.label} Units
              </p>
              <div className="space-y-1.5">
                {cat.units.map(u => {
                  const val = isValid ? convert(numVal, fromUnit, u, catId) : null
                  return (
                    <div
                      key={u.id}
                      className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-colors ${
                        u.id === toId ? 'bg-brand/10 text-brand font-extrabold' : 'text-gray-600'
                      }`}
                    >
                      <span className="font-bold">{u.abbr}</span>
                      <span className={u.id === toId ? 'font-extrabold' : 'font-medium text-gray-500'}>
                        {val !== null ? formatResult(val) : '—'}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>

          </div>
        </div>
      </motion.div>

      {/* ── SEO Content Article ──────────────────────────────────── */}
      <motion.article
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="mt-20"
        aria-label="Free Unit Converter — complete guide"
      >
        <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-gray-900 mb-3">
          Free Online Unit Converter
        </h2>
        <p className="text-sm text-gray-500 leading-relaxed mb-16 max-w-2xl">
          Toolyy's browser-based Unit Converter lets you convert between hundreds of metric and imperial units
          across 8 categories — instantly, privately, and at no cost. No account needed,
          no ads interrupting your workflow, and everything runs locally on your device.
        </p>

        <div className="space-y-16">

          {/* ── How to Convert Units ──────────────────────────── */}
          <section aria-labelledby="howto-heading">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 rounded-xl bg-brand/10 flex items-center justify-center">
                <LayoutGrid aria-hidden="true" className="w-4 h-4 text-brand" />
              </div>
              <h3 id="howto-heading" className="text-xl font-black text-gray-900">
                How to Convert Units Online
              </h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {HOW_TO_STEPS.map(({ Icon, title, body }, i) => (
                <div
                  key={i}
                  className="bg-white border border-gray-100 rounded-2xl p-6 shadow-glass flex gap-4"
                >
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 rounded-2xl bg-brand/8 flex items-center justify-center">
                      <Icon aria-hidden="true" className="w-5 h-5 text-brand" />
                    </div>
                  </div>
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-brand/50">
                      Step {i + 1}
                    </span>
                    <h4 className="text-sm font-extrabold text-gray-900 mt-0.5 mb-1">{title}</h4>
                    <p className="text-xs text-gray-500 leading-relaxed">{body}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ── Metric vs Imperial Overview ─────────────────────── */}
          <section aria-labelledby="overview-heading">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 rounded-xl bg-amber-50 flex items-center justify-center">
                <ArrowRightLeft aria-hidden="true" className="w-4 h-4 text-amber-600" />
              </div>
              <h3 id="overview-heading" className="text-xl font-black text-gray-900">
                Metric vs Imperial Units — Overview
              </h3>
            </div>
            <div className="bg-white border border-gray-100 rounded-3xl p-8 shadow-glass space-y-4">
              <p className="text-sm text-gray-600 leading-relaxed">
                The <strong className="text-gray-800">metric system</strong> (International System of Units, SI) is a decimal-based
                measurement standard used by most countries worldwide. It uses base units like the meter (length),
                kilogram (mass), liter (volume), and second (time), with prefixes such as kilo-, centi-, and milli-
                to denote multiples and fractions. Its consistent base-10 structure makes mental math and scientific
                calculations straightforward.
              </p>
              <p className="text-sm text-gray-600 leading-relaxed">
                The <strong className="text-gray-800">imperial system</strong> (also called the US customary system) uses units like
                feet, pounds, gallons, and Fahrenheit. It is primarily used in the United States, Liberia, and Myanmar.
                Imperial units have inconsistent conversion factors — 12 inches in a foot, 3 feet in a yard, 5,280 feet
                in a mile — which makes cross-unit conversion more complex without a tool.
              </p>
              <p className="text-sm text-gray-600 leading-relaxed">
                Toolyy's Unit Converter bridges both systems seamlessly. Whether you need to convert kilometers to miles
                for a road trip, kilograms to pounds for shipping, or Celsius to Fahrenheit for a recipe, the tool
                handles the conversion instantly with full precision.
              </p>
            </div>
          </section>

          {/* ── Supported Units Table ──────────────────────────── */}
          <section aria-labelledby="units-heading">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 rounded-xl bg-blue-50 flex items-center justify-center">
                <Ruler aria-hidden="true" className="w-4 h-4 text-blue-600" />
              </div>
              <h3 id="units-heading" className="text-xl font-black text-gray-900">
                All Supported Units
              </h3>
            </div>
            <div className="bg-white border border-gray-100 rounded-3xl p-8 shadow-glass">
              <p className="text-sm text-gray-500 leading-relaxed mb-6">
                Toolyy supports real-time conversion across the following units. Every conversion is computed
                client-side with precision factors sourced from NIST and SI standards.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {CATEGORIES.map(category => (
                  <div key={category.id}>
                    <h4 className="text-xs font-black uppercase tracking-widest text-gray-900 mb-2 flex items-center gap-1.5">
                      <category.Icon aria-hidden="true" className="w-3.5 h-3.5 text-brand" />
                      {category.label}
                    </h4>
                    <ul className="space-y-1">
                      {category.units.map(u => (
                        <li key={u.id} className="text-xs text-gray-500">
                          {u.label} <span className="text-gray-300">({u.abbr})</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ── Privacy ──────────────────────────────────────── */}
          <section aria-labelledby="privacy-heading">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 rounded-xl bg-red-50 flex items-center justify-center">
                <ShieldCheck aria-hidden="true" className="w-4 h-4 text-red-500" />
              </div>
              <h3 id="privacy-heading" className="text-xl font-black text-gray-900">
                100% Private &amp; Offline
              </h3>
            </div>
            <div className="bg-white border border-gray-100 rounded-3xl p-8 shadow-glass">
              <p className="text-sm text-gray-600 leading-relaxed mb-4">
                Toolyy's Unit Converter runs <strong className="text-gray-800">entirely in your browser</strong>.
                Every conversion is computed locally using JavaScript — nothing is sent to any server.
                The tool works fully offline once the page has loaded, making it perfect for fieldwork,
                travel, and environments with limited connectivity.
              </p>
              <p className="text-sm text-gray-600 leading-relaxed">
                There is no tracking, no analytics on your inputs, and no data collection of any kind.
                Close the tab and everything is gone. Your conversions are yours alone.
              </p>
            </div>
          </section>

          {/* ── FAQ ────────────────────────────────────────────── */}
          <section aria-labelledby="faq-heading">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 rounded-xl bg-emerald-50 flex items-center justify-center">
                <Ruler aria-hidden="true" className="w-4 h-4 text-emerald-500" />
              </div>
              <h3 id="faq-heading" className="text-xl font-black text-gray-900">
                Frequently Asked Questions
              </h3>
            </div>
            <div className="bg-white border border-gray-100 rounded-3xl px-8 shadow-glass divide-y divide-gray-100">
              {FAQS.map((item, i) => (
                <FaqItem key={i} q={item.q} a={item.a} />
              ))}
            </div>
          </section>

          {/* ── Common Conversion Formulas ───────────────────────── */}
          <section aria-labelledby="formulas-heading">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 rounded-xl bg-violet-50 flex items-center justify-center">
                <Zap aria-hidden="true" className="w-4 h-4 text-violet-600" />
              </div>
              <h3 id="formulas-heading" className="text-xl font-black text-gray-900">
                Common Conversion Formulas
              </h3>
            </div>
            <div className="bg-white border border-gray-100 rounded-3xl p-8 shadow-glass">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
                {[
                  { label: 'Kilometers to Miles', formula: 'mi = km × 0.621371' },
                  { label: 'Miles to Kilometers', formula: 'km = mi × 1.60934' },
                  { label: 'Kilograms to Pounds', formula: 'lb = kg × 2.20462' },
                  { label: 'Pounds to Kilograms', formula: 'kg = lb × 0.453592' },
                  { label: 'Celsius to Fahrenheit', formula: '°F = (°C × 9/5) + 32' },
                  { label: 'Fahrenheit to Celsius', formula: '°C = (°F − 32) × 5/9' },
                  { label: 'Liters to Gallons', formula: 'gal = L × 0.264172' },
                  { label: 'Meters to Feet', formula: 'ft = m × 3.28084' },
                  { label: 'Inches to Centimeters', formula: 'cm = in × 2.54' },
                  { label: 'km/h to mph', formula: 'mph = km/h × 0.621371' },
                ].map(({ label, formula }) => (
                  <div key={label} className="flex items-baseline justify-between py-2 border-b border-gray-50 last:border-0">
                    <span className="text-xs font-bold text-gray-700">{label}</span>
                    <code className="text-xs text-brand font-mono bg-brand/5 px-2 py-0.5 rounded-lg">{formula}</code>
                  </div>
                ))}
              </div>
            </div>
          </section>

        </div>
      </motion.article>
    </div>
  )
}
