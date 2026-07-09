// src/components/PlaceholderPage.tsx
import { Construction } from "lucide-react";

interface PlaceholderPageProps {
  title: string;
}

export default function PlaceholderPage({ title }: PlaceholderPageProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <div className="w-16 h-16 rounded-2xl bg-[rgba(159,211,232,0.1)] border border-[rgba(159,211,232,0.2)] flex items-center justify-center mb-4">
        <Construction className="w-8 h-8 text-[#9FD3E8]" />
      </div>
      <h3 className="text-lg font-orbitron font-semibold text-white uppercase tracking-wider">
        {title}
      </h3>
      <p className="text-sm font-rajdhani text-white/40 mt-2">
        Halaman ini sedang dalam pengembangan
      </p>
    </div>
  );
}
