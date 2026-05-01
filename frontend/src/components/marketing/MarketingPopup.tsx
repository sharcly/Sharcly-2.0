"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, CheckCircle2, ChevronRight, Mail, Phone, ArrowRight, Sparkles, Gift, Tag } from "lucide-react"

const STORAGE_KEY = "sharcly_marketing_dismissed"
const SUBMITTED_KEY = "sharcly_marketing_submitted"
const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8181/api"

export default function MarketingPopup() {
  const [isVisible, setIsVisible] = useState(false)
  const [offers, setOffers] = useState<any[]>([])
  const [selectedOffer, setSelectedOffer] = useState<any | null>(null)
  const [config, setConfig] = useState<any>(null)
  const [step, setStep] = useState<"select" | "capture" | "success">("select")
  const [loading, setLoading] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)

  // Form State
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [firstName, setFirstName] = useState("")
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null)

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 5000)
      return () => clearTimeout(timer)
    }
  }, [toast])

  useEffect(() => {
    // Don't show in admin area
    if (window.location.pathname.startsWith("/admin") || window.location.pathname.startsWith("/dashboard")) return

    let dataLoaded = false
    let ageVerifiedAt = false

    const triggerPopup = () => {
      setTimeout(() => setIsVisible(true), 1500)
    }

    const ageListener = () => {
      ageVerifiedAt = true
      if (dataLoaded) triggerPopup()
      window.removeEventListener("sharcly:age-verified", ageListener as any)
    }
    window.addEventListener("sharcly:age-verified", ageListener as any)

    const checkAndShow = async () => {
      try {
        const isSubmitted = localStorage.getItem(SUBMITTED_KEY) === "true"
        if (isSubmitted) return

        // 1. Fetch Config & Offers
        const [configRes, offersRes] = await Promise.all([
          fetch(`${API_BASE}/marketing/config`),
          fetch(`${API_BASE}/marketing/offers`)
        ])

        const { config: remoteConfig } = await configRes.json()
        const { offers: activeOffers } = await offersRes.json()

        setConfig(remoteConfig)
        if (!remoteConfig?.isEnabled || !activeOffers?.length) return

        setOffers(activeOffers)
        if (remoteConfig.displayMode === "single") {
          setSelectedOffer(activeOffers[0])
          setStep("capture")
        }

        dataLoaded = true

        // 2. Decide to show modal OR minimized tab
        const isDismissed = localStorage.getItem(STORAGE_KEY) === "true"
        if (isDismissed) {
          setIsMinimized(true)
          return
        }

        // 3. Final trigger check - Check Age Verification from cookie
        const isVerified = document.cookie.includes("sharcly_age_verified=true")
        if (isVerified || ageVerifiedAt) {
          triggerPopup()
          window.removeEventListener("sharcly:age-verified", ageListener as any)
        }
      } catch (e) {
        console.warn("[Marketing] Error:", e)
      }
    }

    checkAndShow()
    return () => window.removeEventListener("sharcly:age-verified", ageListener as any)
  }, [])

  const handleDismiss = () => {
    localStorage.setItem(STORAGE_KEY, "true")
    setIsVisible(false)
    setIsMinimized(true)
  }

  const handleReopen = () => {
    setIsMinimized(false)
    setStep("select")
    setIsVisible(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !selectedOffer) return

    setLoading(true)
    try {
      const res = await fetch(`${API_BASE}/marketing/subscribe`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          phone,
          firstName,
          offerId: selectedOffer.id
        })
      })

      const data = await res.json()
      if (res.ok && data.success) {
        setStep("success")
        localStorage.setItem(SUBMITTED_KEY, "true")
        setTimeout(() => {
          setIsVisible(false)
          setIsMinimized(false)
        }, 6000)
      } else {
        setToast({
          message: data.message || "Something went wrong. Please try again.",
          type: "error"
        })
      }
    } catch (err) {
      setToast({
        message: "An error occurred. Please check your connection.",
        type: "error"
      })
    } finally {
      setLoading(false)
    }
  }

  const getOfferLabel = (offer: any) => {
    if (!offer) return ""
    const suffix = offer.discountType === "percentage" ? "%" : ""
    return `${offer.codePrefix} ${offer.discountValue}${suffix} OFF`
  }

  return (
    <>
      <AnimatePresence>
        {isVisible && (
          <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleDismiss}
              className="absolute inset-0 bg-[#082f1d]/40 backdrop-blur-md"
            />

            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 40 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 40 }}
              className="relative w-full max-w-4xl bg-gradient-to-br from-[#eff8ee] via-white to-[#fefce8] rounded-[32px] shadow-[0_40px_100px_rgba(8,47,29,0.25)] overflow-hidden flex flex-col md:flex-row min-h-[500px] lg:min-h-[550px] border border-white"
            >
              <div className="flex-1 p-8 md:p-12 lg:p-16 flex flex-col justify-between order-2 md:order-1 relative z-10 bg-white/50 backdrop-blur-sm">
                <div className="space-y-10">
                  <div className="flex items-center gap-4">
                    <span className="text-xl font-bold text-[#082f1d] tracking-tighter">SHARCLY</span>
                    <div className="h-4 w-[1px] bg-[#082f1d]/20 mx-2" />
                    <span className="text-[10px] font-bold text-[#082f1d] uppercase tracking-[0.4em]">Exclusive Access</span>
                  </div>

                  {step === "select" && (
                    <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="space-y-6">
                      <div className="space-y-4">
                        <h2 className="text-5xl font-semibold text-[#082f1d] leading-[1.1] tracking-tight font-serif">
                          Choose your <br />
                          <span className="text-[#5a7a4a]">Welcome Gift.</span>
                        </h2>
                        <p className="text-[#082f1d]/80 text-xl font-medium max-w-sm">Pick a reward to unlock your exclusive savings today.</p>
                      </div>

                      <div className="grid gap-4 max-w-sm">
                        {offers.map((offer) => (
                          <button
                            key={offer.id}
                            onClick={() => { setSelectedOffer(offer); setStep("capture"); }}
                            className="w-full flex items-center justify-between px-6 py-5 bg-white rounded-[20px] shadow-[0_20px_40px_rgba(0,0,0,0.08)] border border-black/5 hover:border-[#E8C547] transition-all duration-300 group"
                          >
                            <div className="flex items-center gap-4">
                              <div className="bg-[#082f1d] rounded-full w-10 h-10 flex items-center justify-center text-white"><Sparkles size={18} /></div>
                              <div className="flex flex-col items-start text-left">
                                <span className="text-[#082f1d] font-bold text-base leading-tight">{getOfferLabel(offer)}</span>
                                <span className="text-[#5a7a4a] text-[10px] font-medium uppercase tracking-widest mt-0.5">Select offer</span>
                              </div>
                            </div>
                            <ChevronRight size={20} className="text-[#082f1d]/40 group-hover:translate-x-1 transition-all" />
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {step === "capture" && (
                    <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="space-y-6">
                      <div className="space-y-4">
                        <div className="flex items-center gap-3">
                          {config?.displayMode === "multiple" && (
                            <button onClick={() => setStep("select")} className="w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center text-[#082f1d]/60 border border-black/5 hover:text-[#082f1d] transition-all">
                              <ChevronRight size={20} className="rotate-180" />
                            </button>
                          )}
                          <div className="px-4 py-2 bg-white text-[#082f1d] text-xs font-bold shadow-sm rounded-full border border-black/5 flex items-center gap-3">
                            <Tag size={12} className="text-[#E8C547]" />
                            <span>{getOfferLabel(selectedOffer)} Unlocked</span>
                          </div>
                        </div>
                        <h2 className="text-4xl font-semibold text-[#082f1d] leading-tight tracking-tight font-serif">
                          Where should we send your <span className="text-[#E8C547]">code?</span>
                        </h2>
                      </div>

                      <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
                        <input
                          type="email" required placeholder="Email address" value={email} onChange={e => setEmail(e.target.value)}
                          className="w-full px-6 py-4 bg-white border border-black/10 rounded-2xl text-[#082f1d] focus:border-[#E8C547] focus:ring-4 focus:ring-[#E8C547]/10 outline-none transition-all"
                        />
                        <button
                          type="submit" disabled={loading}
                          className="w-full py-5 bg-[#082f1d] text-white rounded-2xl font-bold text-lg uppercase tracking-widest flex items-center justify-center gap-4 hover:bg-[#051d12] transition-all disabled:opacity-50 shadow-xl"
                        >
                          {loading ? "Processing..." : "Get My Discount"}
                          <ArrowRight size={22} />
                        </button>
                      </form>
                    </motion.div>
                  )}

                  {step === "success" && (
                    <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="space-y-6 text-center md:text-left">
                      <div className="w-20 h-20 bg-[#082f1d] text-white rounded-3xl flex items-center justify-center shadow-xl mx-auto md:mx-0"><CheckCircle2 size={40} /></div>
                      <div className="space-y-4">
                        <h2 className="text-5xl font-semibold text-[#082f1d] leading-tight tracking-tight font-serif">Check your <br /><span className="text-[#5a7a4a]">inbox.</span></h2>
                        <p className="text-[#082f1d]/70 text-xl max-w-sm">Success! Your unique code for {getOfferLabel(selectedOffer)} is being delivered right now.</p>
                      </div>
                    </motion.div>
                  )}
                </div>
              </div>

              {/* Visual/Image Side */}
              <div className="hidden md:flex w-5/12 relative order-2 items-center justify-center overflow-hidden bg-white/40">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(239,248,238,0.7),_transparent_80%)] z-10 pointer-events-none" />

                <AnimatePresence mode="wait">
                  <motion.div
                    key={selectedOffer?.id || 'default'}
                    initial={{ opacity: 0, scale: 1.1 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.8 }}
                    className="absolute inset-0 z-0 p-6 flex items-center justify-center"
                  >
                    {selectedOffer?.imageUrl ? (
                      <div className="relative w-full h-full rounded-[40px] overflow-hidden shadow-2xl shadow-[#082f1d]/10 border border-white bg-white">
                        <img
                          src={selectedOffer.imageUrl}
                          alt=""
                          className="w-full h-full object-cover scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                      </div>
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center p-12 opacity-60">
                        <div className="w-full h-full border border-dashed border-[#082f1d]/20 rounded-[40px] flex items-center justify-center bg-white/50">
                          <Gift size={120} className="text-[#E8C547]" />
                        </div>
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>

                {!selectedOffer?.imageUrl && (
                  <div className="relative z-20 w-full p-16 flex flex-col items-center justify-center pointer-events-none">
                    <div className="relative group">
                      <div className="absolute inset-0 bg-[#082f1d]/10 blur-[80px] rounded-full animate-pulse z-0" />
                      <div className="relative z-10 w-48 h-48 rounded-[40px] bg-white border border-black/5 backdrop-blur-3xl p-10 flex items-center justify-center shadow-xl group-hover:scale-105 transition-transform duration-700">
                        <img
                          src="https://cdn.mignite.app/ws/works_01KM0WR2ZSKYNHV0ZE2MPNM9EF/final-Logo-1--01KM5Y2NCW8720B30G9G0XW18Y.png"
                          alt="Sharcly"
                          className="w-full h-full object-contain opacity-80"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <button onClick={handleDismiss} className="absolute top-8 right-8 p-3 bg-white shadow-md rounded-full text-[#082f1d]/60 hover:text-[#082f1d] transition-all border border-black/5">
                <X size={20} />
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isMinimized && (
          <motion.div initial={{ x: 100, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: 100, opacity: 0 }} className="fixed right-0 top-1/2 -translate-y-1/2 z-[999]">
            <button
              onClick={handleReopen}
              className="bg-[#082f1d] text-white px-4 py-8 rounded-l-3xl shadow-2xl flex flex-col items-center gap-4 hover:translate-x-[-4px] transition-transform"
            >
              <Gift size={20} className="text-[#E8C547]" />
              <span className="[writing-mode:vertical-lr] rotate-180 uppercase tracking-[0.4em] text-[10px] font-black">Offers</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
