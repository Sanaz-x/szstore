import { useState } from 'react'
import { User, Server, Phone, Check, ChevronDown, Gem, ArrowRight, Shield } from 'lucide-react'
import { useScrollAnimation } from '../hooks/useScrollAnimation'

const games = ['Mobile Legends', 'Free Fire', 'PUBG Mobile', 'Valorant', 'Genshin Impact', 'COD Mobile', 'Roblox', 'Honor of Kings']

const denominations = [
  { amount: '86 Diamond', price: 'Rp 1.500', icon: '86' },
  { amount: '172 Diamond', price: 'Rp 3.000', icon: '172' },
  { amount: '257 Diamond', price: 'Rp 4.500', icon: '257' },
  { amount: '344 Diamond', price: 'Rp 6.000', icon: '344' },
  { amount: 'Weekly Pass', price: 'Rp 26.000', icon: 'WP', special: true },
  { amount: 'Starlight Member', price: 'Rp 110.000', icon: 'SM', special: true },
]

const payments = [
  { name: 'QRIS', type: 'QR Code', icon: 'Q' },
  { name: 'DANA', type: 'E-Wallet', icon: 'D' },
  { name: 'OVO', type: 'E-Wallet', icon: 'O' },
  { name: 'GoPay', type: 'E-Wallet', icon: 'G' },
  { name: 'ShopeePay', type: 'E-Wallet', icon: 'S' },
  { name: 'Bank Transfer', type: 'Virtual Account', icon: 'B' },
  { name: 'Pulsa', type: 'Telkomsel / XL / Axis', icon: 'P' },
  { name: 'Alfamart', type: 'Minimarket', icon: 'A' },
]

export default function TopupForm() {
  const [step, setStep] = useState(1)
  const [selectedGame, setSelectedGame] = useState('Mobile Legends')
  const [userId, setUserId] = useState('')
  const [serverId, setServerId] = useState('')
  const [whatsapp, setWhatsapp] = useState('')
  const [selectedDenom, setSelectedDenom] = useState<number | null>(null)
  const [selectedPayment, setSelectedPayment] = useState<number | null>(null)
  const [gameDropdown, setGameDropdown] = useState(false)

  const sectionRef = useScrollAnimation<HTMLElement>({ y: 60, opacity: 0, duration: 0.8 })

  const canProceedStep1 = selectedGame && userId && serverId && whatsapp
  const canProceedStep2 = selectedDenom !== null
  const canProceedStep3 = selectedPayment !== null

  const selectedDenomData = selectedDenom !== null ? denominations[selectedDenom] : null
  const totalPrice = selectedDenomData?.price || 'Rp 0'

  return (
    <section id="topup" ref={sectionRef} className="bg-[#050816] py-16 lg:py-20 relative">
      {/* Grid pattern */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: 'linear-gradient(rgba(159,211,232,1) 1px, transparent 1px), linear-gradient(90deg, rgba(159,211,232,1) 1px, transparent 1px)',
        backgroundSize: '50px 50px',
      }} />

      <div className="relative max-w-[1200px] mx-auto px-6">
        {/* Section Header */}
        <div className="flex items-center gap-2 mb-2">
          <span className="text-[#9FD3E8] text-xl">[</span>
          <h2 className="text-xl lg:text-4xl font-orbitron font-bold uppercase tracking-[0.03em] text-gradient-cyan">
            TOP UP GAME
          </h2>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center justify-center gap-0 mb-10 mt-6">
          {[
            { num: 1, label: 'Masukkan Data' },
            { num: 2, label: 'Pilih Nominal' },
            { num: 3, label: 'Pembayaran' },
          ].map((s, i) => (
            <div key={s.num} className="flex items-center">
              <div className="flex flex-col items-center">
                <div className={`w-9 h-9 rounded-full border-2 flex items-center justify-center text-sm font-orbitron font-semibold transition-all duration-300 ${
                  step >= s.num
                    ? step > s.num
                      ? 'border-[#00E5FF] bg-[#00E5FF] text-[#0A1020]'
                      : 'border-[#9FD3E8] bg-[rgba(159,211,232,0.15)] text-[#9FD3E8]'
                    : 'border-[rgba(255,255,255,0.2)] text-white/40'
                }`}>
                  {step > s.num ? <Check className="w-4 h-4" /> : s.num}
                </div>
                <span className={`text-[10px] font-orbitron uppercase tracking-[0.1em] mt-1.5 ${
                  step >= s.num ? 'text-[#9FD3E8]' : 'text-white/40'
                }`}>
                  {s.label}
                </span>
              </div>
              {i < 2 && (
                <div className={`w-16 sm:w-24 h-0.5 mx-2 mb-5 transition-colors duration-300 ${
                  step > s.num ? 'bg-[#00E5FF]' : 'bg-[rgba(255,255,255,0.1)]'
                }`} />
              )}
            </div>
          ))}
        </div>

        {/* Two Column Layout */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left — Form Area */}
          <div className="flex-1 lg:flex-[0.6]">
            {/* Step 1: Input Data */}
            {step === 1 && (
              <div className="space-y-4 animate-in fade-in duration-300">
                {/* Game Selector */}
                <div className="relative">
                  <label className="text-[10px] font-orbitron uppercase tracking-[0.1em] text-[rgba(159,211,232,0.6)] mb-2 block">
                    Pilih Game
                  </label>
                  <button
                    onClick={() => setGameDropdown(!gameDropdown)}
                    className="w-full flex items-center justify-between px-4 py-3.5 rounded-xl card-surface border border-[rgba(159,211,232,0.2)] text-white font-rajdhani text-sm focus:border-[#9FD3E8] focus:shadow-neon-cyan transition-all"
                  >
                    <span>{selectedGame}</span>
                    <ChevronDown className={`w-4 h-4 text-[#9FD3E8] transition-transform ${gameDropdown ? 'rotate-180' : ''}`} />
                  </button>
                  {gameDropdown && (
                    <div className="absolute top-full left-0 right-0 mt-1 z-20 card-surface border border-[rgba(159,211,232,0.2)] rounded-xl overflow-hidden max-h-48 overflow-y-auto">
                      {games.map((g) => (
                        <button
                          key={g}
                          onClick={() => { setSelectedGame(g); setGameDropdown(false) }}
                          className="w-full text-left px-4 py-2.5 text-sm font-rajdhani text-white/80 hover:bg-[rgba(159,211,232,0.1)] hover:text-white transition-colors"
                        >
                          {g}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* User ID */}
                <div>
                  <label className="text-[10px] font-orbitron uppercase tracking-[0.1em] text-[rgba(159,211,232,0.6)] mb-2 block">
                    User ID
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[rgba(159,211,232,0.4)]" />
                    <input
                      type="text"
                      value={userId}
                      onChange={(e) => setUserId(e.target.value)}
                      placeholder="Masukkan User ID"
                      className="w-full pl-10 pr-4 py-3.5 rounded-xl card-surface border border-[rgba(159,211,232,0.2)] text-white font-rajdhani text-sm placeholder:text-white/30 focus:border-[#9FD3E8] focus:shadow-neon-cyan focus:outline-none transition-all"
                    />
                  </div>
                </div>

                {/* Server ID */}
                <div>
                  <label className="text-[10px] font-orbitron uppercase tracking-[0.1em] text-[rgba(159,211,232,0.6)] mb-2 block">
                    Server ID
                  </label>
                  <div className="relative">
                    <Server className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[rgba(159,211,232,0.4)]" />
                    <input
                      type="text"
                      value={serverId}
                      onChange={(e) => setServerId(e.target.value)}
                      placeholder="Masukkan Server ID"
                      className="w-full pl-10 pr-4 py-3.5 rounded-xl card-surface border border-[rgba(159,211,232,0.2)] text-white font-rajdhani text-sm placeholder:text-white/30 focus:border-[#9FD3E8] focus:shadow-neon-cyan focus:outline-none transition-all"
                    />
                  </div>
                </div>

                {/* WhatsApp */}
                <div>
                  <label className="text-[10px] font-orbitron uppercase tracking-[0.1em] text-[rgba(159,211,232,0.6)] mb-2 block">
                    Nomor WhatsApp
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[rgba(159,211,232,0.4)]" />
                    <input
                      type="text"
                      value={whatsapp}
                      onChange={(e) => setWhatsapp(e.target.value)}
                      placeholder="08xxxxxxxxxx"
                      className="w-full pl-10 pr-4 py-3.5 rounded-xl card-surface border border-[rgba(159,211,232,0.2)] text-white font-rajdhani text-sm placeholder:text-white/30 focus:border-[#9FD3E8] focus:shadow-neon-cyan focus:outline-none transition-all"
                    />
                  </div>
                </div>

                <button
                  onClick={() => canProceedStep1 && setStep(2)}
                  disabled={!canProceedStep1}
                  className={`w-full py-3.5 rounded-xl text-[13px] font-orbitron font-semibold uppercase tracking-[0.06em] flex items-center justify-center gap-2 transition-all duration-300 ${
                    canProceedStep1
                      ? 'text-[#0A1020] hover:scale-[1.02] hover:shadow-neon-cyan cursor-pointer'
                      : 'text-white/30 bg-white/5 cursor-not-allowed'
                  }`}
                  style={canProceedStep1 ? { background: 'linear-gradient(135deg, #9FD3E8, #BEEAF5, #00E5FF)' } : {}}
                >
                  LANJUT <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Step 2: Pilih Nominal */}
            {step === 2 && (
              <div className="animate-in fade-in duration-300">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {denominations.map((d, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedDenom(i)}
                      className={`relative p-4 rounded-xl card-surface border transition-all duration-200 text-left ${
                        selectedDenom === i
                          ? 'border-[#9FD3E8] bg-[rgba(159,211,232,0.1)] shadow-[0_0_12px_rgba(159,211,232,0.2)]'
                          : d.special
                          ? 'border-[rgba(224,64,251,0.3)] hover:border-[rgba(224,64,251,0.6)]'
                          : 'border-[rgba(159,211,232,0.15)] hover:border-[rgba(159,211,232,0.4)] hover:shadow-neon-cyan'
                      }`}
                    >
                      {selectedDenom === i && (
                        <Check className="absolute top-2 right-2 w-4 h-4 text-[#00E5FF]" />
                      )}
                      <Gem className={`w-5 h-5 mb-2 ${d.special ? 'text-[#E040FB]' : 'text-[#9FD3E8]'}`} />
                      <p className="text-sm font-orbitron font-semibold text-white">{d.amount}</p>
                      <p className="text-sm font-orbitron font-bold text-[#FFD740] mt-1">{d.price}</p>
                    </button>
                  ))}
                </div>
                <div className="flex gap-3 mt-6">
                  <button
                    onClick={() => setStep(1)}
                    className="px-6 py-3 rounded-xl text-xs font-orbitron font-semibold uppercase tracking-[0.06em] text-white/60 border border-white/10 hover:bg-white/5 transition-all"
                  >
                    KEMBALI
                  </button>
                  <button
                    onClick={() => canProceedStep2 && setStep(3)}
                    disabled={!canProceedStep2}
                    className={`flex-1 py-3 rounded-xl text-[13px] font-orbitron font-semibold uppercase tracking-[0.06em] flex items-center justify-center gap-2 transition-all duration-300 ${
                      canProceedStep2
                        ? 'text-[#0A1020] hover:scale-[1.02] hover:shadow-neon-cyan'
                        : 'text-white/30 bg-white/5 cursor-not-allowed'
                    }`}
                    style={canProceedStep2 ? { background: 'linear-gradient(135deg, #9FD3E8, #BEEAF5, #00E5FF)' } : {}}
                  >
                    LANJUT <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Pembayaran */}
            {step === 3 && (
              <div className="animate-in fade-in duration-300">
                <div className="grid grid-cols-2 gap-3">
                  {payments.map((p, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedPayment(i)}
                      className={`relative flex items-center gap-3 p-3.5 rounded-xl card-surface border transition-all duration-200 ${
                        selectedPayment === i
                          ? 'border-[#9FD3E8] bg-[rgba(159,211,232,0.1)]'
                          : 'border-[rgba(159,211,232,0.15)] hover:border-[rgba(159,211,232,0.4)]'
                      }`}
                    >
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-lg font-orbitron font-bold ${
                        selectedPayment === i ? 'bg-[rgba(159,211,232,0.2)] text-[#9FD3E8]' : 'bg-white/5 text-white/40'
                      }`}>
                        {p.icon}
                      </div>
                      <div className="text-left">
                        <p className="text-sm font-rajdhani font-semibold text-white">{p.name}</p>
                        <p className="text-[10px] font-rajdhani text-white/40">{p.type}</p>
                      </div>
                      {selectedPayment === i && (
                        <Check className="absolute top-2 right-2 w-4 h-4 text-[#00E5FF]" />
                      )}
                    </button>
                  ))}
                </div>
                <div className="flex gap-3 mt-6">
                  <button
                    onClick={() => setStep(2)}
                    className="px-6 py-3 rounded-xl text-xs font-orbitron font-semibold uppercase tracking-[0.06em] text-white/60 border border-white/10 hover:bg-white/5 transition-all"
                  >
                    KEMBALI
                  </button>
                  <button
                    onClick={() => canProceedStep3 && alert('Pembayaran diproses!')}
                    disabled={!canProceedStep3}
                    className={`flex-1 py-3.5 rounded-xl text-[13px] font-orbitron font-semibold uppercase tracking-[0.06em] flex items-center justify-center gap-2 transition-all duration-300 ${
                      canProceedStep3
                        ? 'text-[#0A1020] hover:scale-[1.02] hover:shadow-neon-cyan'
                        : 'text-white/30 bg-white/5 cursor-not-allowed'
                    }`}
                    style={canProceedStep3 ? { background: 'linear-gradient(135deg, #9FD3E8, #BEEAF5, #00E5FF)' } : {}}
                  >
                    LANJUT KE PEMBAYARAN <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Right — Order Summary */}
          <div className="lg:flex-[0.4]">
            <div className="lg:sticky lg:top-24 card-surface rounded-2xl border border-[rgba(224,64,251,0.2)] p-6">
              <h3 className="text-base font-orbitron font-semibold uppercase tracking-[0.02em] text-gradient-cyan mb-4">
                RINGKASAN PESANAN
              </h3>
              <div className="h-px bg-gradient-to-r from-[#9FD3E8] to-transparent mb-4" />

              <div className="space-y-3">
                <div className="flex justify-between text-sm font-rajdhani">
                  <span className="text-white/60">Game</span>
                  <span className="text-white">{selectedGame}</span>
                </div>
                <div className="flex justify-between text-sm font-rajdhani">
                  <span className="text-white/60">User ID</span>
                  <span className="text-white">{userId || '-'}</span>
                </div>
                <div className="flex justify-between text-sm font-rajdhani">
                  <span className="text-white/60">Item</span>
                  <span className="text-white">{selectedDenomData?.amount || '-'}</span>
                </div>
                <div className="flex justify-between text-sm font-rajdhani">
                  <span className="text-white/60">Harga</span>
                  <span className="text-[#FFD740] font-orbitron font-bold">{selectedDenomData?.price || 'Rp 0'}</span>
                </div>
                <div className="flex justify-between text-sm font-rajdhani">
                  <span className="text-white/60">Biaya Admin</span>
                  <span className="text-[#00E5FF]">Rp 0</span>
                </div>
              </div>

              <div className="h-px bg-white/5 my-4" />

              <div className="flex justify-between items-center">
                <span className="text-xs font-orbitron uppercase tracking-[0.08em] text-white/60">TOTAL</span>
                <span className="text-xl font-orbitron font-extrabold text-[#FFD740]">{totalPrice}</span>
              </div>

              {/* Promo code */}
              <div className="flex gap-2 mt-4">
                <input
                  type="text"
                  placeholder="Kode Promo"
                  className="flex-1 px-3 py-2 rounded-lg card-surface border border-[rgba(159,211,232,0.15)] text-white text-sm font-rajdhani placeholder:text-white/30 focus:outline-none focus:border-[#9FD3E8]"
                />
                <button className="px-4 py-2 rounded-lg text-[10px] font-orbitron uppercase tracking-wider text-[#9FD3E8] border border-[rgba(159,211,232,0.3)] hover:bg-[rgba(159,211,232,0.1)] transition-all">
                  TERAPKAN
                </button>
              </div>

              {/* Security badge */}
              <div className="flex items-center gap-2 mt-4 text-[10px] font-orbitron uppercase tracking-[0.1em] text-[rgba(0,229,255,0.6)]">
                <Shield className="w-3 h-3" />
                AMAN & TERENKRIPSI
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
