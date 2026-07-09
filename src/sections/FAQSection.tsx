import { useState } from 'react'
import { Plus, Minus } from 'lucide-react'
import { useScrollAnimation } from '../hooks/useScrollAnimation'

const faqs = [
  {
    q: 'Bagaimana cara top up game di SZTopup?',
    a: 'Pilih game yang ingin di-top up, masukkan User ID dan Server ID, pilih nominal, pilih metode pembayaran, lalu lakukan pembayaran. Diamond akan masuk otomatis dalam 1-5 menit.',
  },
  {
    q: 'Berapa lama proses top up?',
    a: 'Proses top up biasanya memakan waktu 1-5 menit setelah pembayaran berhasil. Untuk beberapa game mungkin memerlukan waktu hingga 15 menit.',
  },
  {
    q: 'Metode pembayaran apa saja yang tersedia?',
    a: 'Kami menerima QRIS, DANA, OVO, GoPay, ShopeePay, Transfer Bank (BCA, Mandiri, BNI, BRI), dan Pulsa.',
  },
  {
    q: 'Apakah SZTopup aman dan terpercaya?',
    a: 'Ya, SZTopup telah memproses 100.000+ transaksi dengan tingkat keberhasilan 99.9%. Kami menggunakan sistem enkripsi dan webhook otomatis.',
  },
  {
    q: 'Bagaimana jika top up gagal?',
    a: 'Jika top up gagal, uang Anda akan dikembalikan secara otomatis. Anda juga bisa menghubungi CS kami 24/7 melalui WhatsApp.',
  },
  {
    q: 'Apakah ada garansi?',
    a: 'Semua transaksi di SZTopup bergaransi 100%. Jika ada kendala, tim support kami siap membantu kapan saja.',
  },
]

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const headerRef = useScrollAnimation<HTMLDivElement>({ y: 20, opacity: 0, duration: 0.6 })
  const listRef = useScrollAnimation<HTMLDivElement>({ y: 30, opacity: 0, stagger: 0.08, duration: 0.5, childSelector: '.faq-item' })

  return (
    <section id="faq" className="bg-[#0A1020] py-16 lg:py-20">
      <div className="max-w-[800px] mx-auto px-6">
        {/* Header */}
        <div ref={headerRef} className="text-center mb-10">
          <h2 className="text-xl lg:text-4xl font-orbitron font-bold uppercase tracking-[0.03em] text-gradient-cyan">
            FAQ
          </h2>
        </div>

        {/* Accordion */}
        <div ref={listRef} className="space-y-3">
          {faqs.map((faq, i) => {
            const isOpen = openIndex === i
            return (
              <div
                key={i}
                className={`faq-item card-surface rounded-xl border transition-all duration-300 overflow-hidden ${
                  isOpen ? 'border-[rgba(159,211,232,0.4)] bg-[rgba(46,51,80,0.6)]' : 'border-[rgba(159,211,232,0.15)]'
                }`}
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  className="w-full flex items-center justify-between px-5 py-4 text-left"
                >
                  <span className="text-base font-rajdhani font-semibold text-white pr-4">{faq.q}</span>
                  {isOpen ? (
                    <Minus className="w-5 h-5 text-[#9FD3E8] shrink-0" />
                  ) : (
                    <Plus className="w-5 h-5 text-[#9FD3E8] shrink-0" />
                  )}
                </button>
                {isOpen && (
                  <div className="px-5 pb-4 border-t border-white/5 pt-3 animate-in fade-in slide-in-from-top-2 duration-300">
                    <p className="text-sm font-rajdhani text-white/70 leading-relaxed">{faq.a}</p>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
