import { useRef, useState, useEffect, type ReactNode } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

interface LaserCardRevealProps {
  children: ReactNode
  index?: number
}

export default function LaserCardReveal({ children, index = 0 }: LaserCardRevealProps) {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const laserRef = useRef<HTMLDivElement>(null)
  const particlesContainerRef = useRef<HTMLDivElement>(null)
  const [hasRevealed, setHasRevealed] = useState(false)

  useEffect(() => {
    if (hasRevealed) return

    const tween = gsap.timeline({
      scrollTrigger: {
        trigger: wrapperRef.current,
        start: 'top 85%',
        toggleActions: 'play none none none',
        once: true,
      },
      onComplete: () => setHasRevealed(true),
    })

    // Create particles
    const particleCount = window.innerWidth < 768 ? 40 : 80
    const colors = ['#00E5FF', '#9FD3E8', '#E040FB', '#FF4081', '#FFD740']
    const fragment = document.createDocumentFragment()

    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div')
      particle.className = 'particle'
      const size = gsap.utils.random(4, 8)
      particle.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        background-color: ${colors[Math.floor(Math.random() * colors.length)]};
        left: 50%;
        top: 50%;
        opacity: 0;
        border-radius: 0;
        box-shadow: 0 0 6px currentColor;
      `
      fragment.appendChild(particle)
    }
    particlesContainerRef.current?.appendChild(fragment)

    // Build timeline
    tween
      .set(contentRef.current, { clipPath: 'inset(0 100% 0 0)' })
      .set(laserRef.current, { x: '-120%', opacity: 1 })
      .to(laserRef.current, { x: '120%', duration: 1.25, ease: 'cubic-bezier(0.19, 1, 0.22, 1)' }, 0)
      .to(contentRef.current, { clipPath: 'inset(0 0% 0 0)', duration: 1.25, ease: 'cubic-bezier(0.19, 1, 0.22, 1)' }, 0)

    if (particlesContainerRef.current) {
      tween
        .to(particlesContainerRef.current.children, { opacity: 1, duration: 0.01 }, 0.75)
        .to(
          particlesContainerRef.current.children,
          {
            x: () => gsap.utils.random(-80, 80),
            y: () => gsap.utils.random(-40, -120),
            rotation: () => gsap.utils.random(-180, 180),
            opacity: 0,
            duration: 0.6,
            ease: 'power2.out',
            stagger: { amount: 0.4, from: 'center' },
          },
          0.75
        )
    }

    tween.set(laserRef.current, { opacity: 0 }, 1.2)
    tween.delay(index * 0.15)

    return () => {
      tween.kill()
    }
  }, [hasRevealed, index])

  return (
    <div ref={wrapperRef} className="scanline-reveal-wrapper relative overflow-hidden rounded-2xl" style={{ transform: 'translateZ(0)' }}>
      <div
        ref={laserRef}
        className="laser-line absolute top-0 left-0 w-full h-1 z-20 pointer-events-none opacity-0"
      />
      <div ref={contentRef} className="card-content relative z-10">
        {children}
      </div>
      <div
        ref={particlesContainerRef}
        className="pixel-particles-container absolute inset-0 z-30 pointer-events-none"
      />
    </div>
  )
}
