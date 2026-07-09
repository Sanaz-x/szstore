import { useEffect, useRef, useState } from 'react'
import { Zap, ShieldCheck, Clock, Bot, Heart, Percent } from 'lucide-react'
import gsap from 'gsap'
import CRTDisplay from '../components/CRTDisplay'

const tickerItems = [
  'AsepGaming — Free Fire — Rp 50.000 — SUCCESS',
  'DewiML — Mobile Legends — Rp 100.000 — SUCCESS',
  'ProPlayer99 — PUBG Mobile — Rp 25.000 — PENDING',
  'SitiVlr — Valorant — Rp 200.000 — SUCCESS',
  'GamerX — Genshin Impact — Rp 75.000 — SUCCESS',
  'RajuFF — Free Fire — Rp 15.000 — SUCCESS',
  'MobaKing — Mobile Legends — Rp 500.000 — SUCCESS',
]

export default function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const textRef = useRef<HTMLDivElement>(null)
  const crtRef = useRef<HTMLDivElement>(null)
  const flashRef = useRef<HTMLDivElement>(null)
  const statusRef = useRef<HTMLDivElement>(null)
  const [crtVisible, setCrtVisible] = useState(false)
  const [isInView, setIsInView] = useState(false)

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true)
          setCrtVisible(true)
          observer.unobserve(el)
        }
      },
      { threshold: 0.1 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (isInView) {

      const tl = gsap.timeline({ delay: 0.2 })

      if (crtRef.current) {
        tl.from(crtRef.current, { opacity: 0, scale: 0.95, duration: 0.8, ease: 'power3.out' }, 0.2)
      }

      if (textRef.current) {
        const els = textRef.current.querySelectorAll('.hero-animate')
        tl.from(els, {
          y: 40,
          opacity: 0,
          duration: 0.7,
          stagger: 0.15,
          ease: 'power3.out',
        }, 0.6)
      }

      if (statusRef.current) {
        tl.from(statusRef.current, { x: 60, opacity: 0, duration: 0.6, ease: 'power3.out' }, 1.4)
      }

      if (flashRef.current) {
        tl.from(flashRef.current, { x: 60, opacity: 0, duration: 0.6, ease: 'power3.out' }, 1.6)
      }

      return () => { tl.kill() }
    }
  }, [isInView])

  return (
    <section
      id="hero"
      ref={sectionRef}
      className="relative min-h-screen bg-[#050816] overflow-hidden pt-16"
    >
      {/* Dot grid background */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(159,211,232,0.15) 1px, transparent 1px)',
          backgroundSize: '30px 30px',
        }}
      />

      <div className="relative max-w-[1440px] mx-auto px-6 py-12 lg:py-0 min-h-[calc(100vh-64px)] flex flex-col lg:flex-row items-center gap-8 lg:gap-4">
        {/* Left Column — CRT Screen */}
        <div ref={crtRef} className="w-full lg:w-[55%] order-1">
          <div className="relative">
            {crtVisible && <CRTDisplay isVisible={isInView} />}
          </div>

          {/* Live Transaction Ticker */}
          <div className="hidden lg:block mt-4 h-10 bg-[rgba(10,16,32,0.6)] border-t border-b border-[rgba(159,211,232,0.2)] border-b-[rgba(159,211,232,0.1)] overflow-hidden rounded-lg">
            <div className="animate-ticker flex whitespace-nowrap">
              {[...tickerItems, ...tickerItems].map((item, i) => {
                const isSuccess = item.includes('SUCCESS')
                return (
                  <span key={i} className="inline-flex items-center gap-2 px-6 text-[10px] font-orbitron uppercase tracking-[0.1em] text-[rgba(159,211,232,0.7)]">
                    <span className={`w-1.5 h-1.5 rounded-full ${isSuccess ? 'bg-[#00E5FF]' : 'bg-[#FFD740]'}`} />
                    {item}
                  </span>
                )
              })}
            </div>
          </div>
        </div>

        {/* Right Column — Text & CTAs */}
        <div ref={textRef} className="w-full lg:w-[45%] order-2 flex flex-col justify-center">
          {/* Player 1 label */}
          <div className="hero-animate flex items-center gap-2 mb-4">
            <span className="text-[10px] font-orbitron uppercase tracking-[0.1em] text-[rgba(159,211,232,0.5)]">
              PLAYER 1
            </span>
            <Heart className="w-3 h-3 text-[#FF4081] fill-[#FF4081]" />
          </div>

          {/* Headline */}
          <h1 className="hero-animate text-3xl sm:text-4xl lg:text-[56px] font-orbitron font-black uppercase leading-[1.1] tracking-[0.05em]">
            <span className="text-gradient-cyan block" style={{ textShadow: '0 0 10px rgba(159,211,232,0.8), 0 0 20px rgba(159,211,232,0.4)' }}>
              TOP UP GAME
            </span>
            <span className="text-gradient-magenta block mt-1" style={{ textShadow: '0 0 10px rgba(224,64,251,0.8), 0 0 20px rgba(224,64,251,0.4)' }}>
              CEPAT, AMAN & MURAH
            </span>
          </h1>

          {/* Subheadline */}
          <p className="hero-animate mt-5 text-base font-rajdhani text-white/70 max-w-[480px] leading-relaxed">
            Platform top up game otomatis dengan pembayaran lengkap dan proses instan untuk semua gamer.
          </p>

          {/* CTA Buttons */}
          <div className="hero-animate flex flex-wrap gap-4 mt-8">
            <a
              href="/#topup"
              className="flex items-center gap-2 px-8 py-3.5 rounded-xl text-[13px] font-orbitron font-semibold uppercase tracking-[0.06em] text-[#0A1020] transition-all duration-300 hover:scale-[1.03] hover:shadow-neon-cyan"
              style={{ background: 'linear-gradient(135deg, #9FD3E8, #BEEAF5, #00E5FF)' }}
            >
              <Zap className="w-4 h-4" />
              TOP UP SEKARANG
            </a>
            <a
              href="/#promo"
              className="flex items-center gap-2 px-8 py-3.5 rounded-xl text-[13px] font-orbitron font-semibold uppercase tracking-[0.06em] text-[#E040FB] border border-[rgba(224,64,251,0.5)] bg-transparent transition-all duration-300 hover:bg-[rgba(224,64,251,0.1)] hover:shadow-neon-magenta"
            >
              <Percent className="w-4 h-4" />
              LIHAT PROMO
            </a>
          </div>

          {/* Trust Badges */}
          <div className="hero-animate flex flex-wrap gap-x-6 gap-y-3 mt-6">
            {[
              { icon: Zap, label: 'PROSES INSTAN' },
              { icon: ShieldCheck, label: 'AMAN TERPERCAYA' },
              { icon: Clock, label: '24/7 SUPPORT' },
              { icon: Bot, label: 'AUTO SYSTEM' },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-1.5 text-[10px] font-orbitron uppercase tracking-[0.1em] text-[rgba(159,211,232,0.6)]">
                <Icon className="w-4 h-4 text-[#9FD3E8]" />
                {label}
              </div>
            ))}
          </div>
        </div>

        {/* Status Panel */}
        <div
          ref={statusRef}
          className="hidden lg:block absolute top-24 right-6 text-right"
        >
          <p className="text-[10px] font-orbitron uppercase tracking-[0.1em] text-white/50 mb-1">
            STATUS SERVER
          </p>
          <div className="flex items-center gap-2 justify-end">
            <span className="w-2 h-2 rounded-full bg-[#00E5FF] animate-pulse-dot" />
            <span className="text-xs font-orbitron font-medium uppercase tracking-[0.08em] text-[#00E5FF]">
              ALL SYSTEM OPERATIONAL
            </span>
          </div>
        </div>

        {/* Flash Sale Badge */}
        <div
          ref={flashRef}
          className="hidden lg:block absolute top-44 right-6 w-[220px] card-surface rounded-2xl p-4 border border-[rgba(224,64,251,0.3)]"
        >
          <p className="text-xs font-orbitron font-medium uppercase tracking-[0.08em] text-[#FFD740] mb-1">
            FLASH SALE
          </p>
          <p className="text-2xl font-orbitron font-extrabold text-white tracking-wider">
            <span>07</span>
            <span className="animate-blink-colon">:</span>
            <span>45</span>
            <span className="animate-blink-colon">:</span>
            <span>12</span>
          </p>
          <p className="text-base font-orbitron font-semibold text-[#9FD3E8] mt-2">86 DIAMOND</p>
          <p className="text-xs font-rajdhani text-white/50">FREE FIRE</p>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-sm font-orbitron font-bold text-[#FFD740]">Rp 15.900</span>
            <span className="text-xs font-rajdhani text-white/40 line-through">Rp 19.900</span>
          </div>
          <span className="inline-block mt-1 px-2 py-0.5 rounded-lg bg-[#FF4081] text-white text-[10px] font-orbitron uppercase tracking-wider">
            DISKON -16%
          </span>
          <button className="w-full mt-3 py-2.5 rounded-xl text-[11px] font-orbitron font-semibold uppercase tracking-[0.06em] text-white transition-all duration-200 hover:scale-[1.02] hover:shadow-neon-magenta"
            style={{ background: 'linear-gradient(135deg, #E040FB, #AA00FF, #FF4081)' }}
          >
            BELI SEKARANG
          </button>
        </div>
      </div>
    </section>
  )
}
