import { useState } from 'react'
import { Plus, Edit2, Power } from 'lucide-react'

interface Gateway {
  id: number
  name: string
  merchantCode: string
  apiKey: string
  secretKey: string
  active: boolean
  callbackUrl: string
}

const initialGateways: Gateway[] = [
  { id: 1, name: 'Midtrans', merchantCode: 'MID_***', apiKey: 'mid_key_***', secretKey: 'mid_sec_***', active: true, callbackUrl: 'https://sztopup.id/webhook/midtrans' },
  { id: 2, name: 'Tripay', merchantCode: 'TP_***', apiKey: 'tp_key_***', secretKey: 'tp_sec_***', active: true, callbackUrl: 'https://sztopup.id/webhook/tripay' },
  { id: 3, name: 'Xendit', merchantCode: 'XN_***', apiKey: 'xn_key_***', secretKey: 'xn_sec_***', active: false, callbackUrl: 'https://sztopup.id/webhook/xendit' },
  { id: 4, name: 'Duitku', merchantCode: 'DK_***', apiKey: 'dk_key_***', secretKey: 'dk_sec_***', active: true, callbackUrl: 'https://sztopup.id/webhook/duitku' },
  { id: 5, name: 'iPaymu', merchantCode: 'IP_***', apiKey: 'ip_key_***', secretKey: 'ip_sec_***', active: false, callbackUrl: 'https://sztopup.id/webhook/ipaymu' },
]

export default function AdminPaymentGateways() {
  const [gateways, setGateways] = useState<Gateway[]>(initialGateways)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<Gateway | null>(null)
  const [form, setForm] = useState<Partial<Gateway>>({})

  const toggleActive = (id: number) => {
    setGateways((prev) => prev.map((g) => g.id === id ? { ...g, active: !g.active } : g))
  }

  const handleSave = () => {
    if (!form.name) return
    if (editing) {
      setGateways((prev) => prev.map((g) => g.id === editing.id ? { ...g, ...form } as Gateway : g))
    } else {
      const newGw: Gateway = {
        id: Date.now(),
        name: form.name || '',
        merchantCode: form.merchantCode || '',
        apiKey: form.apiKey || '',
        secretKey: form.secretKey || '',
        active: false,
        callbackUrl: form.callbackUrl || '',
      }
      setGateways((prev) => [...prev, newGw])
    }
    setShowForm(false)
    setEditing(null)
    setForm({})
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-orbitron font-semibold uppercase tracking-[0.03em] text-white">
          PAYMENT GATEWAY MANAGEMENT
        </h2>
        <button
          onClick={() => { setEditing(null); setForm({}); setShowForm(true) }}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-orbitron uppercase tracking-wider text-[#0A1020] transition-all hover:scale-[1.02] hover:shadow-neon-cyan"
          style={{ background: 'linear-gradient(135deg, #9FD3E8, #BEEAF5)' }}
        >
          <Plus className="w-4 h-4" /> TAMBAH GATEWAY
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {gateways.map((g) => (
          <div key={g.id} className="card-surface rounded-2xl border border-[rgba(159,211,232,0.15)] p-5 hover:border-[rgba(159,211,232,0.3)] transition-all">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-orbitron font-semibold text-white">{g.name}</h3>
              <button
                onClick={() => toggleActive(g.id)}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-[10px] font-orbitron uppercase tracking-wider transition-all border ${
                  g.active
                    ? 'bg-[rgba(0,229,255,0.1)] text-[#00E5FF] border-[rgba(0,229,255,0.3)]'
                    : 'bg-[rgba(255,64,129,0.1)] text-[#FF4081] border-[rgba(255,64,129,0.3)]'
                }`}
              >
                <Power className="w-3 h-3" />
                {g.active ? 'AKTIF' : 'NONAKTIF'}
              </button>
            </div>

            <div className="space-y-2.5">
              <div>
                <p className="text-[10px] font-orbitron uppercase tracking-wider text-white/30">Merchant Code</p>
                <p className="text-xs font-rajdhani text-white/60 font-mono">{g.merchantCode}</p>
              </div>
              <div>
                <p className="text-[10px] font-orbitron uppercase tracking-wider text-white/30">API Key</p>
                <p className="text-xs font-rajdhani text-white/60 font-mono">{g.apiKey}</p>
              </div>
              <div>
                <p className="text-[10px] font-orbitron uppercase tracking-wider text-white/30">Secret Key</p>
                <p className="text-xs font-rajdhani text-white/60 font-mono">{g.secretKey}</p>
              </div>
              <div>
                <p className="text-[10px] font-orbitron uppercase tracking-wider text-white/30">Callback URL</p>
                <p className="text-[10px] font-rajdhani text-[#9FD3E8] break-all">{g.callbackUrl}</p>
              </div>
            </div>

            <button
              onClick={() => { setEditing(g); setForm({ ...g }); setShowForm(true) }}
              className="mt-4 flex items-center gap-1 px-3 py-1.5 rounded-lg text-[10px] font-orbitron uppercase tracking-wider text-[#9FD3E8] border border-[rgba(159,211,232,0.2)] hover:bg-[rgba(159,211,232,0.1)] transition-all"
            >
              <Edit2 className="w-3 h-3" /> EDIT
            </button>
          </div>
        ))}
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="card-surface rounded-2xl border border-[rgba(159,211,232,0.2)] p-6 w-full max-w-lg">
            <h3 className="text-base font-orbitron font-semibold uppercase tracking-[0.03em] text-white mb-4">
              {editing ? 'EDIT GATEWAY' : 'TAMBAH GATEWAY'}
            </h3>
            <div className="space-y-3">
              {[
                { key: 'name', label: 'Gateway Name' },
                { key: 'merchantCode', label: 'Merchant Code' },
                { key: 'apiKey', label: 'API Key' },
                { key: 'secretKey', label: 'Secret Key' },
                { key: 'callbackUrl', label: 'Callback URL' },
              ].map((field) => (
                <div key={field.key}>
                  <label className="text-[10px] font-orbitron uppercase tracking-wider text-white/40 mb-1 block">{field.label}</label>
                  <input
                    type="text"
                    value={(form as Record<string, string>)[field.key] || ''}
                    onChange={(e) => setForm((prev) => ({ ...prev, [field.key]: e.target.value }))}
                    className="w-full px-3 py-2.5 rounded-xl card-surface border border-[rgba(159,211,232,0.15)] text-sm font-rajdhani text-white placeholder:text-white/20 focus:border-[#9FD3E8] focus:outline-none"
                  />
                </div>
              ))}
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => { setShowForm(false); setEditing(null) }} className="flex-1 py-2.5 rounded-xl text-xs font-orbitron uppercase tracking-wider text-white/60 border border-white/10 hover:bg-white/5 transition-all">
                BATAL
              </button>
              <button onClick={handleSave} className="flex-1 py-2.5 rounded-xl text-xs font-orbitron uppercase tracking-wider text-[#0A1020] transition-all hover:scale-[1.02] hover:shadow-neon-cyan" style={{ background: 'linear-gradient(135deg, #9FD3E8, #BEEAF5)' }}>
                SIMPAN
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
