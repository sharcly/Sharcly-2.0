"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ShieldCheck, ArrowRight, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"

/**
 * AgeGateModal Component
 * A premium, glassmorphic age verification modal.
 * Persists verification status for 12 hours in localStorage.
 */

const AGE_GATE_KEY = "age-gate-verified-at"
const EXPIRY_TIME = 12 * 60 * 60 * 1000 // 12 hours in milliseconds

const AgeGateModal = () => {
  const [isVisible, setIsVisible] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const checkAgeGate = () => {
      try {
        const verifiedAt = localStorage.getItem(AGE_GATE_KEY)
        if (!verifiedAt) {
          setIsVisible(true)
          return
        }

        const timestamp = parseInt(verifiedAt, 10)
        const now = Date.now()

        // Show modal if more than 12 hours have passed
        if (now - timestamp > EXPIRY_TIME) {
          setIsVisible(true)
        }
      } catch (error) {
        console.error("Age gate check failed:", error)
        setIsVisible(true) // Default to showing if error
      }
    }

    checkAgeGate()
  }, [])

  const handleVerify = () => {
    try {
      localStorage.setItem(AGE_GATE_KEY, Date.now().toString())
      setIsVisible(false)
    } catch (error) {
      console.error("Failed to save age verification:", error)
      setIsVisible(false)
    }
  }

  const handleDecline = () => {
    // Redirect to a safe site if user is not of age
    window.location.href = "https://www.google.com"
  }

  // Prevent hydration mismatch by only rendering after mount
  if (!mounted) return null

  return (
    <AnimatePresence mode="wait">
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100000] flex items-center justify-center p-4 overflow-hidden"
        >
          {/* High-end Backdrop with deep blur */}
          <div className="absolute inset-0 bg-black/70 backdrop-blur-2xl" />
          
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 10 }}
            transition={{ 
              type: "spring", 
              damping: 25, 
              stiffness: 300,
              delay: 0.1
            }}
            className="w-full max-w-[440px] bg-zinc-950/60 border border-white/10 rounded-[2.5rem] p-10 text-center shadow-[0_0_50px_-12px_rgba(16,185,129,0.3)] relative overflow-hidden backdrop-blur-md"
          >
            {/* Ambient Background Glows */}
            <div className="absolute -top-24 -left-24 w-48 h-48 bg-emerald-500/10 blur-[80px] rounded-full pointer-events-none" />
            <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-emerald-500/10 blur-[80px] rounded-full pointer-events-none" />

            {/* Icon Header */}
            <div className="mb-8 flex justify-center relative">
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", damping: 15, delay: 0.3 }}
                className="w-24 h-24 bg-gradient-to-br from-emerald-500/20 to-emerald-500/5 rounded-full flex items-center justify-center border border-emerald-500/20 shadow-inner relative z-10"
              >
                <ShieldCheck className="w-12 h-12 text-emerald-400" strokeWidth={1.5} />
              </motion.div>
              {/* Animated Ring */}
              <div className="absolute inset-0 border border-emerald-500/30 rounded-full animate-ping opacity-20 scale-110" />
            </div>

            {/* Content */}
            <h2 className="text-4xl font-bold text-white mb-4 tracking-tight font-body">
              Age Verification
            </h2>
            <p className="text-zinc-300 text-lg leading-relaxed mb-10 font-sans">
              To enter Sharcly, you must be <br />
              <span className="text-emerald-400 font-bold underline underline-offset-4 decoration-emerald-500/50">21 years or older.</span>
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col gap-4 relative z-10">
              <Button 
                onClick={handleVerify}
                className="w-full h-16 text-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold rounded-2xl group transition-all duration-300 shadow-[0_0_20px_-5px_rgba(16,185,129,0.4)]"
              >
                Yes, I am 21+
                <ArrowRight className="ml-2 w-6 h-6 group-hover:translate-x-1 transition-transform" />
              </Button>
              
              <Button 
                onClick={handleDecline}
                variant="ghost"
                className="w-full h-16 text-zinc-400 hover:text-white hover:bg-white/5 rounded-2xl text-lg transition-all duration-200"
              >
                <LogOut className="mr-3 w-5 h-5 opacity-50" />
                I am under 21
              </Button>
            </div>

            {/* Footer Text */}
            <div className="mt-10 pt-8 border-t border-white/5">
              <p className="text-[11px] text-zinc-500 uppercase tracking-[0.2em] font-medium font-sans">
                Premium Wellness &bull; Responsible Use
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default AgeGateModal
