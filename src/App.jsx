import { useState, useCallback, useEffect, useRef } from 'react'
import { Eye, EyeOff } from "lucide-react"
import './App.css'

function App() {
  const [length, setLength] = useState(12)
  const [numberAllowed, setNumberAllowed] = useState(true)
  const [charAllowed, setCharAllowed] = useState(true)
  const [specialAllowed, setSpecialAllowed] = useState(false)
  const [pass, setPass] = useState("")
  const [copied, setCopied] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const passwordRef = useRef(null)

  // Password generator function
  const passGen = useCallback(() => {
    let password = ""
    let str = ""

    if (charAllowed) str += "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"
    if (numberAllowed) str += "0123456789"
    if (specialAllowed) str += "!#$%&'()*+,-./:;<=>?@[\\]^_`{|}~"

    if (str.length === 0) {
      setPass("")
      return
    }

    for (let i = 0; i < length; i++) {
      let charIndex = Math.floor(Math.random() * str.length)
      password += str.charAt(charIndex)
    }
    setPass(password)
  }, [length, numberAllowed, charAllowed, specialAllowed])

  // Auto-generate password
  useEffect(() => {
    passGen()
  }, [length, numberAllowed, charAllowed, specialAllowed, passGen])

  // Copy password
  const copyPassword = () => {
    if (!pass) return
    passwordRef.current?.select()
    window.navigator.clipboard.writeText(pass)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // Password strength
  const getStrength = () => {
    let score = 0
    if (length >= 8) score++
    if (length >= 12) score++
    if (numberAllowed) score++
    if (specialAllowed) score++
    if (charAllowed) score++

    if (score <= 2) return { label: "Weak", color: "bg-red-500" }
    if (score === 3) return { label: "Medium", color: "bg-yellow-500" }
    return { label: "Strong", color: "bg-green-500" }
  }

  const strength = getStrength()

  return (
    <div className="w-full h-screen flex justify-center items-center bg-gradient-to-r from-gray-900 via-black to-gray-900">
      <div className="w-full max-w-md mx-auto rounded-2xl shadow-2xl px-6 py-8 bg-gray-800/60 backdrop-blur-lg border border-gray-700">
        
        {/* Heading */}
        <h1 className="text-white text-center text-2xl font-extrabold mb-6 tracking-wide">
          Stylish Password Generator
        </h1>

        {/* Input + Copy + Eye button */}
        <div className="flex items-center shadow-inner rounded-lg overflow-hidden mb-4 bg-gray-900/70">
          <input
            type={showPassword ? "text" : "password"}
            value={pass}
            className="outline-none w-full py-3 px-3 text-gray-100 bg-transparent text-lg"
            placeholder="Password"
            readOnly
            ref={passwordRef}
          />
          <button 
            onClick={() => setShowPassword(prev => !prev)}
            className="px-3 text-gray-300 hover:text-white transition"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
          <button 
            onClick={copyPassword}
            className={`px-4 font-semibold transition ${
              copied 
                ? "bg-green-600 text-white" 
                : "bg-orange-500 hover:bg-orange-600 text-white"
            }`}
          >
            {copied ? "Copied!" : "Copy"}
          </button>
        </div>

        {/* Strength Meter */}
        <div className="flex items-center mb-6">
          <div className={`h-2 w-24 rounded-full ${strength.color} transition-all`}></div>
          <span className="ml-3 text-sm text-white">{strength.label}</span>
        </div>

        {/* Length Slider */}
        <div className="mb-5">
          <label className="block text-white mb-2 font-medium">
            Password Length: <span className="text-orange-400">{length}</span>
          </label>
          <input 
            type="range" 
            min={6} 
            max={30} 
            value={length} 
            className="cursor-pointer w-full accent-orange-500"
            onChange={(e) => setLength(e.target.value)}
          />
        </div>

        {/* Options */}
        <div className="flex flex-col gap-3 mb-6 text-white">
          <label className="flex items-center gap-2">
            <input 
              type="checkbox" 
              checked={numberAllowed} 
              onChange={() => setNumberAllowed(prev => !prev)} 
              className="accent-orange-500"
            />
            Include Numbers (0–9)
          </label>

          <label className="flex items-center gap-2">
            <input 
              type="checkbox" 
              checked={charAllowed} 
              onChange={() => setCharAllowed(prev => !prev)} 
              className="accent-orange-500"
            />
            Include Characters (A–Z, a–z)
          </label>

          <label className="flex items-center gap-2">
            <input 
              type="checkbox" 
              checked={specialAllowed} 
              onChange={() => setSpecialAllowed(prev => !prev)} 
              className="accent-orange-500"
            />
            Include Special Characters (!@#$%^&*)
          </label>
        </div>

        {/* Generate Button */}
        <button 
          onClick={passGen}
          className="w-full bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white py-3 rounded-lg transition font-semibold shadow-lg"
        >
          Generate Password
        </button>
      </div>
    </div>
  )
}

export default App
