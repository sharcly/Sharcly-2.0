'use client'

import React, { useState, useEffect, useRef, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Pause, Play, ChevronLeft, ChevronRight, Check } from 'lucide-react'

interface VisualProps { isActive: boolean }

// --- SVG VISUAL COMPONENTS ---

const HempVisual = ({ isActive }: VisualProps) => (
    <svg viewBox="0 0 160 170" width="160" height="170" fill="none">
        <defs>
            <linearGradient id="stemGradient" x1="0" y1="1" x2="0" y2="0">
                <stop offset="0%" stopColor="#062D1B" />
                <stop offset="100%" stopColor="#4ade80" />
            </linearGradient>
            <linearGradient id="leafGradient" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#bbf7d0" />
                <stop offset="100%" stopColor="#166534" />
            </linearGradient>
        </defs>

        {/* Ground Shadow */}
        <ellipse cx="80" cy="155" rx="35" ry="6" fill="rgba(0,0,0,0.15)" />

        {/* Main Stem */}
        <path
            className="hemp-stem"
            d="M80,155 L80,35"
            stroke="url(#stemGradient)"
            strokeWidth="3.5"
            strokeLinecap="round"
        />

        {/* Bottom Node Leaves */}
        <g transform="translate(80, 130)">
            <g className="hemp-leaf" style={{ animationDelay: '0.6s' }} transform="rotate(-50) scale(0.45)">
                <path d="M0,0 Q-10,-20 0,-45 Q10,-20 0,0" fill="url(#leafGradient)" />
            </g>
            <g className="hemp-leaf" style={{ animationDelay: '0.7s' }} transform="rotate(50) scale(0.45)">
                <path d="M0,0 Q-10,-20 0,-45 Q10,-20 0,0" fill="url(#leafGradient)" />
            </g>
        </g>

        {/* Middle Node Leaves */}
        <g transform="translate(80, 95)">
            <g className="hemp-leaf" style={{ animationDelay: '0.9s' }} transform="rotate(-40) scale(0.6)">
                <path d="M0,0 Q-10,-20 0,-45 Q10,-20 0,0" fill="url(#leafGradient)" />
            </g>
            <g className="hemp-leaf" style={{ animationDelay: '1.0s' }} transform="rotate(40) scale(0.6)">
                <path d="M0,0 Q-10,-20 0,-45 Q10,-20 0,0" fill="url(#leafGradient)" />
            </g>
        </g>

        {/* Top Fan (Main Bloom) */}
        <g transform="translate(80, 50)">
            {[-70, -40, -15, 0, 15, 40, 70].map((angle, i) => {
                const scale = 1 - Math.abs(angle) / 120
                return (
                    <g
                        key={i}
                        className="hemp-leaf"
                        style={{ animationDelay: `${1.2 + i * 0.1}s` }}
                        transform={`rotate(${angle}) scale(${scale * 0.85})`}
                    >
                        <path d="M0,0 Q-12,-25 0,-55 Q12,-25 0,0" fill="url(#leafGradient)" />
                        <path d="M0,0 L0,-50" stroke="rgba(255,255,255,0.15)" strokeWidth="0.5" />
                    </g>
                )
            })}
        </g>
    </svg>
)

const FlaskVisual = ({ isActive }: VisualProps) => (
    <svg viewBox="0 0 160 170" width="160" height="170" fill="none">
        <clipPath id="flaskClip">
            <path d="M60,30 L100,30 L100,60 L130,140 Q135,155 120,155 L40,155 Q25,155 30,140 L60,60 Z" />
        </clipPath>
        <path d="M60,30 L100,30 L100,60 L130,140 Q135,155 120,155 L40,155 Q25,155 30,140 L60,60 Z" stroke="rgba(239,248,238,0.2)" strokeWidth="3" />
        <rect
            x="0" y="0" width="160" height="170"
            fill="url(#liquidGradient)"
            clipPath="url(#flaskClip)"
            className="flask-liquid"
        />
        <defs>
            <linearGradient id="liquidGradient" x1="0" y1="1" x2="0" y2="0">
                <stop offset="0%" stopColor="#14532d" />
                <stop offset="50%" stopColor="#84cc16" />
                <stop offset="100%" stopColor="#d9f99d" />
            </linearGradient>
        </defs>
        {[...Array(3)].map((_, i) => (
            <circle
                key={i}
                cx="80" cy="35" r="3"
                fill="#84cc16"
                className="flask-drop"
                style={{ animationDelay: `${i * 0.5}s` }}
            />
        ))}
        <path d="M65,70 Q70,90 65,120" stroke="rgba(255,255,255,0.15)" strokeWidth="2" strokeLinecap="round" />
    </svg>
)

const DistillVisual = ({ isActive }: VisualProps) => (
    <svg viewBox="0 0 190 160" width="190" height="160" fill="none">
        <rect x="20" y="80" width="40" height="60" rx="4" stroke="rgba(239,248,238,0.2)" strokeWidth="2" />
        <rect x="22" y="100" width="36" height="38" fill="#14532d" opacity="0.6" className="flask-liquid" />
        <path d="M40,80 L40,60 L150,60 L150,80" stroke="rgba(239,248,238,0.2)" strokeWidth="4" />
        <circle cx="150" cy="110" r="30" stroke="rgba(239,248,238,0.2)" strokeWidth="2" />
        <circle cx="150" cy="110" r="28" fill="#10b981" opacity="0.4" className="flask-liquid" style={{ transformOrigin: 'center' }} />
        <circle r="4" fill="#E8C547" className="distill-particle" />
    </svg>
)

const SpectrumVisual = ({ isActive }: VisualProps) => (
    <svg viewBox="0 0 200 160" width="200" height="160" fill="none">
        <line x1="20" y1="140" x2="180" y2="140" stroke="rgba(239,248,238,0.1)" strokeWidth="2" />
        {[...Array(8)].map((_, i) => {
            const h = 40 + Math.random() * 60
            return (
                <rect
                    key={i}
                    x={40 + i * 16} y={140 - h}
                    width="8" height={h}
                    rx="4"
                    fill={`url(#grad${i})`}
                    className="spectrum-bar"
                    style={{ animationDelay: `${i * 0.08}s` }}
                />
            )
        })}
        <defs>
            {[...Array(8)].map((_, i) => (
                <linearGradient key={i} id={`grad${i}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={['#E8C547', '#4ade80', '#10b981', '#E8C547', '#4ade80', '#10b981', '#E8C547', '#4ade80'][i]} />
                    <stop offset="100%" stopColor="transparent" />
                </linearGradient>
            ))}
        </defs>
        <g transform="translate(100, 30)" className="pill-badge">
            <rect x="-40" y="-12" width="80" height="24" rx="12" fill="rgba(232,197,71,0.2)" stroke="#E8C547" strokeWidth="1" />
            <text x="0" y="4" textAnchor="middle" fill="#E8C547" fontSize="8" fontWeight="900" fontFamily="var(--font-dm-sans)">ALL CLEAR</text>
        </g>
    </svg>
)

const GummiesVisual = ({ isActive }: VisualProps) => (
    <svg viewBox="0 0 200 170" width="200" height="170" fill="none">
        <circle cx="100" cy="85" r="50" stroke="rgba(239,248,238,0.05)" strokeDasharray="4 4" />
        <circle cx="100" cy="85" r="25" fill="rgba(232,197,71,0.1)" stroke="rgba(232,197,71,0.2)" />
        <text x="100" y="90" textAnchor="middle" fill="#E8C547" fontSize="12" fontWeight="700" fontFamily="var(--font-cormorant)">CBD</text>
        {[
            { color: '#f97316', angle: 0 },
            { color: '#a855f7', angle: 90 },
            { color: '#eab308', angle: 180 },
            { color: '#ef4444', angle: 270 }
        ].map((g, i) => (
            <g key={i} className="gummy-float" style={{ animationDelay: `${i * 0.4}s` }}>
                <rect
                    x={100 + 40 * Math.cos(g.angle * Math.PI / 180) - 12}
                    y={85 + 40 * Math.sin(g.angle * Math.PI / 180) - 12}
                    width="24" height="24" rx="6"
                    fill={`radial-gradient(circle at 30% 30%, white, ${g.color})`}
                    style={{ fill: g.color }}
                />
                <rect
                    x={100 + 40 * Math.cos(g.angle * Math.PI / 180) - 10}
                    y={85 + 40 * Math.sin(g.angle * Math.PI / 180) - 10}
                    width="20" height="20" rx="4"
                    stroke="rgba(255,255,255,0.3)" strokeWidth="1"
                />
            </g>
        ))}
    </svg>
)

const BottleVisual = ({ isActive }: VisualProps) => (
    <svg viewBox="0 0 130 190" width="130" height="190" fill="none">
        <defs>
            <linearGradient id="bottleGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#1a3d2b" />
                <stop offset="100%" stopColor="#051a10" />
            </linearGradient>
        </defs>
        <path d="M35,40 L95,40 Q105,40 105,55 L105,160 Q105,175 90,175 L40,175 Q25,175 25,160 L25,55 Q25,40 35,40 Z" fill="url(#bottleGrad)" stroke="rgba(255,255,255,0.1)" />
        <rect x="30" y="45" width="70" height="120" rx="10" fill="rgba(255,255,255,0.05)" />
        <g transform="translate(65, 90)">
            <text x="0" y="0" textAnchor="middle" fill="white" fontSize="10" fontWeight="900" letterSpacing="2" fontFamily="var(--font-dm-sans)">SHARCLY</text>
            <text x="0" y="12" textAnchor="middle" fill="#E8C547" fontSize="8" fontWeight="500" letterSpacing="1" fontFamily="var(--font-dm-sans)">CHILL</text>
        </g>
        <g className="bottle-lid">
            <rect x="35" y="25" width="60" height="15" rx="4" fill="#222" />
            {[...Array(5)].map((_, i) => (
                <line key={i} x1={45 + i * 10} y1="28" x2={45 + i * 10} y2="37" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
            ))}
        </g>
        <path d="M100,20 L105,25 L115,15" stroke="#E8C547" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
)

// --- DATA ---
const processSteps = [
    {
        num: "01", label: "Origin",
        title: "Hemp is where\nit begins.",
        body: "A naturally occurring plant with a wide range of compounds — including cannabinoids that interact gently with your body's own systems.",
        caption: "US-Grown Hemp Plant",
        visual: "hemp",
        Component: HempVisual,
    },
    {
        num: "02", label: "Extraction",
        title: "We extract\nCBD.",
        body: "From the hemp plant, we isolate CBD — keeping THC within legal limits (<0.3%) so you get every benefit without compromise.",
        caption: "CBD Extracted",
        visual: "flask",
        Component: FlaskVisual,
    },
    {
        num: "03", label: "Refinement",
        title: "We refine\nit.",
        body: "The extract is carefully purified into a clean CBD distillate. Every gummy delivers a consistent, measured dose you can rely on.",
        caption: "Distilled for Purity",
        visual: "distill",
        Component: DistillVisual,
    },
    {
        num: "04", label: "Verification",
        title: "We test\nevery batch.",
        body: "Each batch is independently lab-tested for purity, potency, and safety. The COA is linked to every product — no exceptions.",
        caption: "Third-Party Lab COA",
        visual: "spectrum",
        Component: SpectrumVisual,
    },
    {
        num: "05", label: "Crafting",
        title: "We turn it\ninto gummies.",
        body: "Blended with plant-based pectin, natural flavors, and cane sugar. Orange, Lemon, Strawberry, Grape — soft, stable, consistent.",
        caption: "4 Natural Flavours",
        visual: "gummies",
        Component: GummiesVisual,
    },
    {
        num: "06", label: "Delivery",
        title: "We bottle it\nfor you.",
        body: "Packed, sealed, and shipped within 24 hours — discreet plain packaging. Yours to open, and make part of every day.",
        caption: "Sealed & Ready",
        visual: "bottle",
        Component: BottleVisual,
    },
]

// --- DESIGN TOKENS ---
const colors = {
    deep: '#082f1d',
    deeper: '#051a10',
    light: '#eff8ee',
    gold: '#E8C547',
    muted: 'rgba(239,248,238,0.65)', // Increased opacity from 0.52
    border: 'rgba(239,248,238,0.12)', // Increased from 0.08
    goldDim: 'rgba(232,197,71,0.14)',
}

const DURATION = 4200 // ms

export default function ProcessStorySection() {
    const [activeStep, setActiveStep] = useState(0)
    const [paused, setPaused] = useState(false)
    const [fillPct, setFillPct] = useState(0)
    const [isHovered, setIsHovered] = useState(false)

    const fillRef = useRef<number>(0)
    const startRef = useRef<number>(0)

    const goTo = (idx: number) => {
        setActiveStep(idx)
        setFillPct(0)
        startRef.current = performance.now()
    }

    const next = () => {
        if (activeStep < processSteps.length - 1) {
            goTo(activeStep + 1)
        } else {
            goTo(0) // Loop back for auto-advance
        }
    }

    const prev = () => {
        if (activeStep > 0) {
            goTo(activeStep - 1)
        }
    }

    useEffect(() => {
        if (paused || isHovered) {
            if (fillRef.current) cancelAnimationFrame(fillRef.current)
            return
        }

        // Reset or resume start time based on current percentage
        startRef.current = performance.now() - (fillPct / 100) * DURATION

        const tick = (now: number) => {
            const elapsed = now - startRef.current
            const pct = Math.min(100, (elapsed / DURATION) * 100)

            // Update state
            setFillPct(pct)

            if (pct >= 100) {
                // Use functional update to avoid capturing old state
                setActiveStep(prev => {
                    const nextIdx = (prev + 1) % processSteps.length
                    // Reset for next step
                    setFillPct(0)
                    startRef.current = performance.now()
                    return nextIdx
                })
            } else {
                fillRef.current = requestAnimationFrame(tick)
            }
        }

        fillRef.current = requestAnimationFrame(tick)
        return () => cancelAnimationFrame(fillRef.current)
    }, [paused, isHovered]) // Removed activeStep from dependencies to manage it internally in the tick

    return (
        <section
            style={{
                minHeight: 'calc(100vh - 72px)', // Adjusted for navbar height
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '32px 24px', // Reduced from 60px
                position: 'relative',
                overflow: 'hidden',
                background: 'linear-gradient(160deg, #040e07 0%, #051a10 30%, #082f1d 60%, #051a10 85%, #040e07 100%)',
            }}
        >
            {/* Ambient Decorations */}
            <div
                className="absolute inset-0 pointer-events-none"
                style={{
                    background: 'radial-gradient(ellipse at top center, rgba(232,197,71,0.055), transparent 65%)',
                }}
            />
            <div className="absolute left-[5%] top-0 bottom-0 w-px bg-white/5 pointer-events-none" />
            <div className="absolute right-[5%] top-0 bottom-0 w-px bg-white/5 pointer-events-none" />

            {/* Header */}
            <header className="text-center mb-10 relative z-10">
                <div className="flex items-center justify-center gap-3 mb-2">
                    <div className="size-1 rounded-full bg-[#E8C547]" />
                    <span
                        style={{
                            fontFamily: 'var(--font-dm-sans)',
                            fontSize: '9px', // Reduced from 10px
                            fontWeight: 600,
                            color: colors.gold,
                            letterSpacing: '0.22em',
                            textTransform: 'uppercase'
                        }}
                    >
                        Inside Every Gummy
                    </span>
                    <div className="size-1 rounded-full bg-[#E8C547]" />
                </div>
                <h2
                    style={{
                        fontFamily: 'var(--font-cormorant)',
                        fontSize: 'clamp(30px, 4vw, 48px)', // Reduced from clamp(34px, 4.5vw, 58px)
                        fontWeight: 800,
                        color: colors.light,
                        lineHeight: 1.1
                    }}
                >
                    What You Feel <br />
                    <span style={{ fontStyle: 'italic', color: colors.gold, fontWeight: 700 }}>Starts Within.</span>
                </h2>
            </header>

            {/* Main Card */}
            <div
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                style={{
                    width: '100%',
                    maxWidth: '1100px',
                    background: 'rgba(239,248,238,0.035)',
                    backdropFilter: 'blur(24px)',
                    border: `1px solid ${colors.border}`,
                    borderRadius: '28px',
                    display: 'grid',
                    gridTemplateColumns: '340px 1fr', // Reduced from 380px
                    minHeight: '440px', // Reduced from 480px
                    boxShadow: '0 32px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(232,197,71,0.05)',
                    overflow: 'hidden',
                    zIndex: 10,
                    position: 'relative'
                }}
                className="process-card-responsive"
            >
                {/* Glossy Shine Overlay */}
                <div
                    className="absolute inset-0 pointer-events-none opacity-20"
                    style={{
                        background: 'linear-gradient(135deg, transparent 0%, rgba(255,255,255,0.05) 45%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0.05) 55%, transparent 100%)',
                        backgroundSize: '200% 200%',
                        animation: 'shine 8s linear infinite'
                    }}
                />
                {/* Left Panel */}
                <div
                    style={{
                        borderRight: '1px solid rgba(239,248,238,0.08)',
                        padding: '28px 24px', // Reduced from 36px 32px
                        display: 'flex',
                        flexDirection: 'column',
                        background: 'rgba(5,26,16,0.5)',
                    }}
                    className="left-panel-responsive"
                >
                    <div className="flex-1 space-y-1.5"> {/* Reduced from 2 */}
                        {processSteps.map((step, idx) => {
                            const isActive = activeStep === idx
                            const isDone = idx < activeStep

                            return (
                                <div
                                    key={step.num}
                                    onClick={() => goTo(idx)}
                                    style={{
                                        padding: '10px 14px', // Reduced from 14px 16px
                                        borderRadius: '12px', // Reduced from 14px
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '12px', // Reduced from 16px
                                        background: isActive ? 'rgba(232,197,71,0.06)' : 'transparent',
                                        transition: 'all 0.3s ease',
                                    }}
                                    className="group hover:bg-white/[0.04]"
                                >
                                    {/* Bullet Circle */}
                                    <div
                                        style={{
                                            width: '32px',
                                            height: '32px',
                                            borderRadius: '50%',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontFamily: 'var(--font-cormorant)',
                                            fontSize: '12px',
                                            transition: 'all 0.4s ease',
                                            border: isActive
                                                ? `1px solid ${colors.gold}`
                                                : isDone
                                                    ? `1px solid rgba(232,197,71,0.3)`
                                                    : `1px solid rgba(239,248,238,0.12)`,
                                            background: isActive
                                                ? colors.gold
                                                : isDone
                                                    ? `rgba(232,197,71,0.1)`
                                                    : 'transparent',
                                            color: isActive
                                                ? colors.deep
                                                : isDone
                                                    ? colors.gold
                                                    : 'rgba(239,248,238,0.52)',
                                            boxShadow: isActive ? `0 0 16px rgba(232,197,71,0.35)` : 'none'
                                        }}
                                    >
                                        {isDone ? <Check size={14} strokeWidth={3} /> : step.num}
                                    </div>

                                    {/* Text Block */}
                                    <div className="flex flex-col">
                                        <span
                                            style={{
                                                display: isActive ? 'block' : 'none',
                                                fontSize: '9px',
                                                fontFamily: 'var(--font-dm-sans)',
                                                fontWeight: 700,
                                                color: colors.gold,
                                                letterSpacing: '0.18em',
                                                textTransform: 'uppercase',
                                                marginBottom: '2px'
                                            }}
                                        >
                                            Step {step.num}
                                        </span>
                                        <span
                                            style={{
                                                fontSize: '15px', // Reduced from 16px
                                                fontFamily: 'var(--font-cormorant)',
                                                fontWeight: 600,
                                                color: isActive
                                                    ? colors.light
                                                    : isDone
                                                        ? 'rgba(239,248,238,0.6)'
                                                        : 'rgba(239,248,238,0.45)',
                                                transition: 'color 0.3s ease'
                                            }}
                                        >
                                            {step.label}
                                        </span>
                                    </div>
                                </div>
                            )
                        })}
                    </div>

                    {/* Timer Bar */}
                    <div className="mt-8">
                        <div className="flex justify-between items-center mb-3">
                            <span style={{ fontSize: '10px', color: 'rgba(239,248,238,0.3)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                                {paused ? 'Paused' : 'Auto advancing'}
                            </span>
                            <span style={{ fontSize: '10px', color: 'rgba(239,248,238,0.3)', fontWeight: 600 }}>
                                {activeStep + 1} / {processSteps.length}
                            </span>
                        </div>
                        <div style={{ height: '2px', background: 'rgba(239,248,238,0.07)', borderRadius: '2px', overflow: 'hidden' }}>
                            <div
                                style={{
                                    height: '100%',
                                    width: `${fillPct}%`,
                                    background: 'linear-gradient(to right, #E8C547, rgba(232,197,71,0.5))',
                                    transition: fillPct === 0 ? 'none' : 'width 0.1s linear'
                                }}
                            />
                        </div>
                    </div>
                </div>

                {/* Right Panel */}
                <div
                    style={{ padding: '32px 36px', display: 'flex', flexDirection: 'column', justifyContent: 'center', position: 'relative' }}
                    className="right-panel-responsive"
                >
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeStep}
                            initial={{ opacity: 0, x: 24 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -24 }}
                            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                            style={{ display: 'flex', gap: 40, alignItems: 'center', flex: 1 }}
                            className="pane-responsive"
                        >
                            {/* Text Block */}
                            <div style={{ flex: 1 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                                    <span style={{ fontSize: '9px', fontFamily: 'var(--font-dm-sans)', fontWeight: 600, color: colors.gold, opacity: 0.7, letterSpacing: '0.22em', textTransform: 'uppercase' }}>
                                        {processSteps[activeStep].num} · {processSteps[activeStep].label}
                                    </span>
                                </div>
                                <h3
                                    style={{
                                        fontSize: 'clamp(24px, 2.8vw, 36px)', // Reduced from clamp(28px, 3vw, 40px)
                                        fontFamily: 'var(--font-cormorant)',
                                        fontWeight: 700,
                                        color: colors.light,
                                        whiteSpace: 'pre-line',
                                        lineHeight: 1.1,
                                        marginBottom: 16 // Reduced from 20
                                    }}
                                >
                                    {processSteps[activeStep].title}
                                </h3>
                                <p
                                    style={{
                                        fontSize: '13.5px', // Reduced from 14.5px
                                        fontFamily: 'var(--font-dm-sans)',
                                        color: colors.muted,
                                        lineHeight: 1.7, // Reduced from 1.78
                                        maxWidth: '340px' // Reduced from 360px
                                    }}
                                >
                                    {processSteps[activeStep].body}
                                </p>
                            </div>

                            {/* Visual Box */}
                            <div
                                style={{
                                    width: 220, height: 180, // Reduced from 260x220
                                    background: 'rgba(239,248,238,0.03)',
                                    border: '1px solid rgba(239,248,238,0.14)',
                                    borderRadius: 16, // Reduced from 20
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    position: 'relative', overflow: 'hidden',
                                    boxShadow: '0 16px 50px rgba(0,0,0,0.4), 0 0 0 1px rgba(232,197,71,0.05)',
                                }}
                                className="visual-box-responsive"
                            >
                                {/* Visual Ambient Glow */}
                                <div
                                    className="absolute inset-0 pointer-events-none"
                                    style={{
                                        background: 'radial-gradient(circle at top, rgba(232,197,71,0.15), transparent 70%)',
                                    }}
                                />

                                {/* Corner Bracket */}
                                <div
                                    className="absolute top-4 right-4 w-5 h-5 border-t border-r pointer-events-none"
                                    style={{ borderColor: 'rgba(232,197,71,0.3)' }}
                                />

                                {/* SVG Visual Stage */}
                                <div className="relative z-10 w-full h-full flex items-center justify-center">
                                    <div key={activeStep} className="w-full h-full flex items-center justify-center">
                                        {React.createElement(processSteps[activeStep].Component, { isActive: true })}
                                    </div>
                                </div>

                                {/* Caption */}
                                <div
                                    style={{
                                        position: 'absolute',
                                        bottom: '12px',
                                        left: 0,
                                        right: 0,
                                        textAlign: 'center',
                                        fontSize: '9px',
                                        fontFamily: 'var(--font-dm-sans)',
                                        fontWeight: 600,
                                        color: 'rgba(232,197,71,0.6)',
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.18em'
                                    }}
                                >
                                    {processSteps[activeStep].caption}
                                </div>
                            </div>
                        </motion.div>
                    </AnimatePresence>

                    {/* Nav Controls */}
                    <div className="mt-10 flex items-center justify-between">
                        {/* Progress Dots */}
                        <div className="flex items-center gap-2">
                            {processSteps.map((_, idx) => {
                                const isActive = activeStep === idx
                                const isDone = idx < activeStep
                                return (
                                    <div
                                        key={idx}
                                        onClick={() => goTo(idx)}
                                        style={{
                                            height: '6px',
                                            width: isActive ? '24px' : '6px',
                                            borderRadius: '3px',
                                            background: isActive
                                                ? colors.gold
                                                : isDone
                                                    ? 'rgba(232,197,71,0.35)'
                                                    : 'rgba(239,248,238,0.15)',
                                            transition: 'all 0.3s ease',
                                            cursor: 'pointer'
                                        }}
                                    />
                                )
                            })}
                        </div>

                        <div className="flex items-center gap-6">
                            {/* Pause Button */}
                            <button
                                onClick={() => setPaused(!paused)}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 8,
                                    fontSize: '10px',
                                    fontFamily: 'var(--font-dm-sans)',
                                    fontWeight: 600,
                                    color: 'rgba(239,248,238,0.3)',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.1em',
                                    transition: 'color 0.3s ease',
                                }}
                                className="hover:text-[#E8C547]"
                            >
                                {paused ? <Play size={12} fill="currentColor" /> : <Pause size={12} fill="currentColor" />}
                                {paused ? 'Play' : 'Pause'}
                            </button>

                            {/* Prev/Next Buttons */}
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={prev}
                                    disabled={activeStep === 0}
                                    style={{
                                        width: 38, height: 38,
                                        borderRadius: '50%',
                                        border: '1px solid rgba(239,248,238,0.12)',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        color: colors.light,
                                        transition: 'all 0.3s ease',
                                        opacity: activeStep === 0 ? 0.3 : 1,
                                        cursor: activeStep === 0 ? 'default' : 'pointer'
                                    }}
                                    className="hover:border-[rgba(232,197,71,0.35)] hover:text-[#E8C547]"
                                >
                                    <ChevronLeft size={18} />
                                </button>
                                <button
                                    onClick={next}
                                    disabled={activeStep === processSteps.length - 1}
                                    style={{
                                        width: 38, height: 38,
                                        borderRadius: '50%',
                                        border: '1px solid rgba(239,248,238,0.12)',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        color: colors.light,
                                        transition: 'all 0.3s ease',
                                        opacity: activeStep === processSteps.length - 1 ? 0.3 : 1,
                                        cursor: activeStep === processSteps.length - 1 ? 'default' : 'pointer'
                                    }}
                                    className="hover:border-[rgba(232,197,71,0.35)] hover:text-[#E8C547]"
                                >
                                    <ChevronRight size={18} />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style jsx>{`
        @keyframes draw {
          to { stroke-dashoffset: 0; }
        }
        @keyframes bloom {
          from { transform: scale(0.5); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        @keyframes fillUp {
          from { transform: scaleY(0.05); }
          to { transform: scaleY(1); }
        }
        @keyframes drop {
          0% { transform: translateY(-20px); opacity: 0; }
          20% { opacity: 1; }
          80% { opacity: 1; }
          100% { transform: translateY(80px); opacity: 0; }
        }
        @keyframes orbit {
          from { transform: rotate(0deg) translateY(40px) rotate(0deg); }
          to { transform: rotate(360deg) translateY(40px) rotate(-360deg); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0); }
          50% { transform: translateY(-10px) rotate(5deg); }
        }
        @keyframes slideDown {
          from { transform: translateY(-28px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        @keyframes pulseGlow {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.8; }
        }
        @keyframes shine {
          0% { background-position: -200% -200%; }
          100% { background-position: 200% 200%; }
        }

        .hemp-stem { stroke-dasharray: 200; stroke-dashoffset: 200; animation: draw 1.8s ease forwards; }
        .hemp-leaf { transform-origin: center bottom; opacity: 0; animation: bloom 0.5s ease forwards; }
        
        .flask-liquid { transform-origin: bottom; animation: fillUp 1.8s ease forwards; }
        .flask-drop { animation: drop 1.5s infinite linear; }
        
        .distill-particle { offset-path: path("M40,80 L150,80"); animation: followPipe 2s infinite linear; }
        @keyframes followPipe {
          from { offset-distance: 0%; }
          to { offset-distance: 100%; }
        }

        .spectrum-bar { transform-origin: bottom; animation: fillUp 1s ease forwards; }
        .pill-badge { animation: bloom 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; }

        .gummy-float { animation: float 3s ease-in-out infinite; }
        .bottle-lid { animation: slideDown 0.9s cubic-bezier(0.22, 1, 0.36, 1) forwards 0.3s; }

        @media (max-width: 900px) {
          .process-card-responsive {
            grid-template-columns: 1fr !important;
            height: auto !important;
          }
          .left-panel-responsive {
            border-right: none !important;
            border-bottom: 1px solid rgba(239,248,238,0.08) !important;
            flex-direction: row !important;
            overflow-x: auto !important;
            padding: 20px !important;
          }
          .left-panel-responsive::-webkit-scrollbar {
            display: none;
          }
          .left-panel-responsive > div {
            display: flex !important;
            flex-direction: row !important;
            gap: 12px !important;
            flex: none !important;
          }
          .left-panel-responsive > div > div {
            padding: 10px 16px !important;
            white-space: nowrap !important;
          }
          .left-panel-responsive .timer-bar {
            display: none !important;
          }
          .right-panel-responsive {
            padding: 30px 24px !important;
          }
          .pane-responsive {
            flex-direction: column !important;
            align-items: flex-start !important;
            gap: 30px !important;
          }
          .visual-box-responsive {
            width: 100% !important;
            height: 180px !important;
          }
        }
        @media (max-width: 540px) {
          .left-panel-responsive > div > div > div:last-child {
            display: none !important;
          }
        }
      `}</style>
        </section>
    )
}
