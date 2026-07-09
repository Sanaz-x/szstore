import { useEffect, useState } from 'react'
import { CheckCircle, Users, Headphones, TrendingUp } from 'lucide-react'
import { useInView } from '../hooks/useInView'

const stats = [
  { icon: CheckCircle, number: 100000, suffix: '+', label: 'TRANSAKSI SUKSES', format: true },
  { icon: Users, number: 50000, suffix: '+', label: 'PENGGUNA AKTIF', format: true },
  { icon: Headphones, number: 24, suffix: '/7', label: 'CUSTOMER SUPPORT', format: false },
  { icon: TrendingUp, number: 99.9, suffix: '%', label: 'SUCCESS RATE', format: false },
]

function AnimatedCounter({ target, suffix, format, started }: { target: number; suffix: string; format: boolean; started: boolean }) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!started) return

    const duration = 2000
    const startTime = Date.now()
    const isDecimal = target % 1 !== 0

    const animate = () => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      const current = eased * target

      if (isDecimal) {
        setCount(parseFloat(current.toFixed(1)))
      } else {
        setCount(Math.floor(current))
      }

      if (progress < 1) {
        requestAnimationFrame(animate)
      }
    }

    requestAnimationFrame(animate)
  }, [target, started])

  const display = format
    ? count >= 1000
      ? (count / 1000).toFixed(0) + '.' + ((count % 1000) / 100).toFixed(0) + '00'
      : count.toString()
    : count.toString()

  return (
    <span>
      {format && count >= 1000 ? display.replace('.', '.') : display}
      {suffix === '%' || suffix === '/7' ? '' : ''}
      <span className="text-[#9FD3E8]">{suffix}</span>
    </span>
  )
}

export default function Statistics() {
  const { ref, isInView } = useInView(0.3)

  return (
    <section id="stats" ref={ref} className="bg-[#050816] py-12 lg:py-16">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, i) => {
            const Icon = stat.icon
            return (
              <div key={i} className="text-center">
                <Icon className="w-8 h-8 text-[#9FD3E8] mx-auto mb-3" />
                <p className="text-2xl lg:text-4xl font-orbitron font-extrabold text-white tracking-[0.02em]">
                  {stat.label === 'CUSTOMER SUPPORT' ? (
                    <span>24<span className="text-[#9FD3E8]">/7</span></span>
                  ) : stat.label === 'SUCCESS RATE' ? (
                    <AnimatedCounter target={99.9} suffix="%" format={false} started={isInView} />
                  ) : (
                    <AnimatedCounter
                      target={stat.number}
                      suffix={stat.suffix}
                      format={stat.format}
                      started={isInView}
                    />
                  )}
                </p>
                <p className="text-xs font-orbitron uppercase tracking-[0.08em] text-[rgba(159,211,232,0.6)] mt-2">
                  {stat.label}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
