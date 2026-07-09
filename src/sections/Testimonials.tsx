import { useRef, useState } from 'react'
import { Star, ChevronLeft, ChevronRight } from 'lucide-react'
import { useScrollAnimation } from '../hooks/useScrollAnimation'

const testimonials = [
  {
    name: 'GamerPro',
    username: '@gamerpro',
    avatar: '/assets/avatars/gamerpro.jpg',
    rating: 5,
    review: 'Top up cepat banget, 1 menit langsung masuk! Harga juga paling murah dibanding yang lain. Recommended!',
    game: 'Free Fire',
  },
  {
    name: 'MLBB Addict',
    username: '@mlbbaddict',
    avatar: '/assets/avatars/mlbbaddict.jpg',
    rating: 5,
    review: 'Harga murah, pelayanan mantap, recommended! Sudah top up puluhan kali di sini, tidak pernah ada masalah.',
    game: 'Mobile Legends',
  },
  {
    name: 'FreeFire ID',
    username: '@freefireid',
    avatar: '/assets/avatars/freefireid.jpg',
    rating: 5,
    review: 'Pembayaran lengkap dan aman, trusted banget. CS-nya juga ramah dan responsif.',
    game: 'Free Fire',
  },
]

export default function Testimonials() {
  const [scrollPos, setScrollPos] = useState(0)
  const carouselRef = useRef<HTMLDivElement>(null)
  const headerRef = useScrollAnimation<HTMLDivElement>({ y: 20, opacity: 0, duration: 0.6 })

  const scroll = (dir: number) => {
    if (carouselRef.current) {
      const newPos = scrollPos + dir * 380
      const maxScroll = carouselRef.current.scrollWidth - carouselRef.current.clientWidth
      const clamped = Math.max(0, Math.min(newPos, maxScroll))
      carouselRef.current.scrollTo({ left: clamped, behavior: 'smooth' })
      setScrollPos(clamped)
    }
  }

  return (
    <section className="bg-[#0A1020] py-16 lg:py-20">
      <div className="max-w-[1440px] mx-auto px-6">
        {/* Header */}
        <div ref={headerRef} className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2">
            <span className="text-[#9FD3E8]">&lt;&lt;</span>
            <h2 className="text-xl lg:text-4xl font-orbitron font-bold uppercase tracking-[0.03em] text-gradient-cyan">
              APA KATA MEREKA
            </h2>
            <span className="text-[#9FD3E8]">&gt;&gt;</span>
          </div>
          <div className="hidden sm:flex items-center gap-2">
            <button
              onClick={() => scroll(-1)}
              className="w-10 h-10 rounded-full card-surface border border-[rgba(159,211,232,0.2)] flex items-center justify-center text-[#9FD3E8] hover:bg-[rgba(159,211,232,0.1)] transition-all"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => scroll(1)}
              className="w-10 h-10 rounded-full card-surface border border-[rgba(159,211,232,0.2)] flex items-center justify-center text-[#9FD3E8] hover:bg-[rgba(159,211,232,0.1)] transition-all"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Carousel */}
        <div
          ref={carouselRef}
          className="flex gap-6 overflow-x-auto scrollbar-hide scroll-smooth pb-4"
          style={{ scrollbarWidth: 'none' }}
        >
          {testimonials.map((t, i) => (
            <div
              key={i}
              className="min-w-[320px] lg:min-w-[360px] card-surface rounded-2xl border border-[rgba(159,211,232,0.15)] p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-neon-cyan flex-shrink-0"
            >
              {/* Avatar Row */}
              <div className="flex items-center gap-3 mb-4">
                <img
                  src={t.avatar}
                  alt={t.name}
                  className="w-12 h-12 rounded-full border-2 border-[rgba(159,211,232,0.3)] object-cover"
                />
                <div>
                  <p className="text-base font-orbitron font-semibold text-white">{t.name}</p>
                  <p className="text-xs font-rajdhani text-white/40">{t.username}</p>
                </div>
              </div>

              {/* Stars */}
              <div className="flex gap-0.5 mb-3">
                {Array.from({ length: t.rating }).map((_, j) => (
                  <Star key={j} className="w-4 h-4 text-[#FFD740] fill-[#FFD740]" />
                ))}
              </div>

              {/* Review */}
              <p className="text-sm font-rajdhani text-white/80 leading-relaxed">
                "{t.review}"
              </p>

              {/* Game Tag */}
              <span className="inline-block mt-4 px-3 py-1 rounded-lg text-[10px] font-orbitron uppercase tracking-wider text-[#9FD3E8] bg-[rgba(159,211,232,0.1)]">
                {t.game}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
