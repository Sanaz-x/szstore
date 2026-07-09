import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from 'lucide-react'

export type ToastType = 'success' | 'error' | 'warning' | 'info'

interface Toast {
  id: string
  type: ToastType
  message: string
}

interface ToastContextType {
  addToast: (message: string, type?: ToastType) => void
  removeToast: (id: string) => void
}

const ToastContext = createContext<ToastContextType | null>(null)

const typeConfig = {
  success: { icon: CheckCircle, color: 'border-l-[#00E5FF] text-[#00E5FF]' },
  error: { icon: AlertCircle, color: 'border-l-[#FF4081] text-[#FF4081]' },
  warning: { icon: AlertTriangle, color: 'border-l-[#FFD740] text-[#FFD740]' },
  info: { icon: Info, color: 'border-l-[#9FD3E8] text-[#9FD3E8]' },
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const addToast = useCallback((message: string, type: ToastType = 'info') => {
    const id = Math.random().toString(36).substring(2, 9)
    setToasts((prev) => [...prev, { id, type, message }])
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 4000)
  }, [])

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}
      <div className="fixed top-20 right-4 z-[90] flex flex-col gap-3">
        {toasts.map((toast) => {
          const config = typeConfig[toast.type]
          const Icon = config.icon
          return (
            <div
              key={toast.id}
              className={`flex items-center gap-3 min-w-[300px] max-w-[400px] bg-[#1a1f35] border border-white/10 border-l-[3px] ${config.color} rounded-xl px-4 py-3 shadow-deep animate-in slide-in-from-right duration-300`}
            >
              <Icon className="w-5 h-5 shrink-0" />
              <p className="text-sm text-white/90 font-rajdhani flex-1">{toast.message}</p>
              <button onClick={() => removeToast(toast.id)} className="text-white/40 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>
          )
        })}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within ToastProvider')
  return ctx
}
