"use client"

import { useState, useEffect } from "react"

const COOKIE_NAME = "sharcly_age_verified"
const COOKIE_DAYS = 30

function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null
  const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"))
  return match ? decodeURIComponent(match[2]) : null
}

function setCookie(name: string, value: string, days: number) {
  if (typeof document === "undefined") return
  const date = new Date()
  date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000)
  document.cookie = `${name}=${encodeURIComponent(value)};expires=${date.toUTCString()};path=/;SameSite=Lax`
}

const AgeGateModal = () => {
  const [visible, setVisible] = useState(false)
  const [exiting, setExiting] = useState(false)

  useEffect(() => {
    const verified = getCookie(COOKIE_NAME)
    if (!verified) {
      setVisible(true)
    }
  }, [])

  const handleConfirm = () => {
    setCookie(COOKIE_NAME, "true", COOKIE_DAYS)
    setExiting(true)
    setTimeout(() => setVisible(false), 500)
    // Dispatch event for MarketingPopup to listen
    window.dispatchEvent(new CustomEvent("sharcly:age-verified"))
  }

  const handleDeny = () => {
    window.location.href = "https://www.google.com"
  }

  const isLegalPage = typeof window !== "undefined" && [
    "/privacy",
    "/terms-condition",
    "/cookies",
    "/shipping-returns",
    "/contact",
    "/faq"
  ].some(path => window.location.pathname.startsWith(path))

  if (!visible || isLegalPage) return null

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 99999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1.5rem",
        transition: "opacity 500ms ease, backdrop-filter 500ms ease",
        opacity: exiting ? 0 : 1,
        backdropFilter: exiting ? "blur(0px)" : "blur(16px)",
        WebkitBackdropFilter: exiting ? "blur(0px)" : "blur(16px)",
        backgroundColor: exiting ? "transparent" : "rgba(8, 47, 29, 0.9)", // Forest Dark
      }}
    >
      {/* Modal Card */}
      <div
        style={{
          background: "linear-gradient(145deg, #082f1d 0%, #051d12 100%)",
          borderRadius: 24,
          padding: "3.5rem 3rem",
          maxWidth: 460,
          width: "100%",
          textAlign: "center",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.7), 0 0 0 1px rgba(232, 197, 71, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.05)",
          transform: exiting ? "scale(0.98) translateY(10px)" : "scale(1) translateY(0)",
          transition: "all 400ms cubic-bezier(0.16, 1, 0.3, 1)",
          opacity: exiting ? 0 : 1,
        }}
      >
        {/* Shield Icon */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.25rem' }}>
          <svg width="40" height="48" viewBox="0 0 24 24" fill="none" stroke="#E8C547" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ filter: 'drop-shadow(0px 4px 6px rgba(0,0,0,0.5))' }}>
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          </svg>
        </div>

        {/* Heading */}
        <h2
          style={{
            fontFamily: "var(--font-cormorant, 'Georgia', serif)",
            fontWeight: 600,
            fontSize: "2.25rem",
            color: "#ffffff",
            marginBottom: "1rem",
            lineHeight: 1.2,
          }}
        >
          Age Verification
        </h2>

        {/* Decorative line */}
        <div
          style={{
            width: 48,
            height: 2,
            background: "linear-gradient(90deg, transparent, #E8C547, transparent)",
            margin: "0 auto 1.5rem",
          }}
        />

        {/* Subtext */}
        <p
          style={{
            color: "rgba(255, 255, 255, 0.7)",
            fontSize: "1.05rem",
            lineHeight: 1.6,
            marginBottom: "2.5rem",
            maxWidth: 360,
            marginLeft: "auto",
            marginRight: "auto",
            fontFamily: "var(--font-dm-sans, sans-serif)",
          }}
        >
          You must be <span style={{ color: "#E8C547", fontWeight: 600 }}>21 years or older</span> to
          enter this website. Please confirm your age to continue.
        </p>

        {/* Buttons */}
        <div style={{ display: "flex", flexDirection: "row", gap: "1rem" }}>
          {/* Yes Button */}
          <button
            onClick={handleConfirm}
            style={{
              flex: 1,
              padding: "1.125rem 0.5rem",
              borderRadius: 12,
              border: "none",
              background: "#E8C547",
              color: "#082f1d",
              fontWeight: 700,
              fontSize: "0.95rem",
              letterSpacing: "0.02em",
              cursor: "pointer",
              transition: "all 250ms ease",
              boxShadow: "0 4px 14px rgba(232, 197, 71, 0.3)",
              fontFamily: "var(--font-dm-sans, sans-serif)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)"
              e.currentTarget.style.boxShadow = "0 6px 20px rgba(232, 197, 71, 0.4)"
              e.currentTarget.style.background = "#f0d67a"
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)"
              e.currentTarget.style.boxShadow = "0 4px 14px rgba(232, 197, 71, 0.3)"
              e.currentTarget.style.background = "#E8C547"
            }}
          >
            YES, 21 OR OLDER
          </button>

          {/* No Button */}
          <button
            onClick={handleDeny}
            style={{
              flex: 1,
              padding: "1.125rem 0.5rem",
              borderRadius: 12,
              border: "1px solid rgba(232, 197, 71, 0.3)",
              background: "transparent",
              color: "rgba(255, 255, 255, 0.6)",
              fontWeight: 600,
              fontSize: "0.95rem",
              cursor: "pointer",
              transition: "all 250ms ease",
              fontFamily: "var(--font-dm-sans, sans-serif)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "rgba(232, 197, 71, 0.6)"
              e.currentTarget.style.color = "#ffffff"
              e.currentTarget.style.background = "rgba(232, 197, 71, 0.05)"
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "rgba(232, 197, 71, 0.3)"
              e.currentTarget.style.color = "rgba(255, 255, 255, 0.6)"
              e.currentTarget.style.background = "transparent"
            }}
          >
            NO, UNDER 21
          </button>
        </div>

        {/* Disclaimer */}
        <p
          style={{
            color: "rgba(255, 255, 255, 0.4)",
            fontSize: "0.75rem",
            lineHeight: 1.5,
            marginTop: "2rem",
            fontFamily: "var(--font-dm-sans, sans-serif)",
          }}
        >
          By entering this site, you agree to our{" "}
          <a href="/terms-condition" style={{ color: "#E8C547", textDecoration: "none", transition: "color 200ms" }}>
            Terms of Service
          </a>{" "}
          and{" "}
          <a href="/privacy" style={{ color: "#E8C547", textDecoration: "none", transition: "color 200ms" }}>
            Privacy Policy
          </a>
          .
        </p>
      </div>
    </div>
  )
}

export default AgeGateModal
