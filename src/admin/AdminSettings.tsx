// src/admin/AdminSettings.tsx
import { useState, useEffect } from "react";
import { Save, Globe, Bell, Shield, Webhook, Loader2 } from "lucide-react";
import { supabase } from "../lib/supabase";

const sections = [
  {
    icon: Globe,
    title: "Website Settings",
    description: "Nama website, logo, deskripsi, dan pengaturan umum",
  },
  {
    icon: Bell,
    title: "Notification Channels",
    description: "WhatsApp, Email, Telegram, Discord integrations",
  },
  {
    icon: Webhook,
    title: "Webhook URLs",
    description: "Callback URLs dan webhook endpoints",
  },
  {
    icon: Shield,
    title: "Security Settings",
    description: "JWT, 2FA, CAPTCHA, Rate Limiting",
  },
];

export default function AdminSettings() {
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [settings, setSettings] = useState<any>({
    site_name: "",
    site_url: "",
    whatsapp: "",
    email: "",
    telegram: "",
    discord: "",
    webhook_base: "",
    jwt_secret: "",
    enable_2fa: false,
    enable_captcha: true,
    rate_limit: 100,
  });

  useEffect(() => {
    async function fetchSettings() {
      setLoading(true);
      const { data, error } = await supabase
        .from("settings")
        .select("*")
        .limit(1)
        .single();
      if (data) setSettings(data);
      setLoading(false);
    }
    fetchSettings();
  }, []);

  const update = (key: string, value: string | boolean | number) => {
    setSettings((prev: any) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    const { error } = await supabase
      .from("settings")
      .update(settings)
      .eq("id", settings.id);
    if (error) alert("Gagal menyimpan pengaturan: " + error.message);
    else alert("Pengaturan berhasil disimpan!");
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="flex justify-center p-20">
        <Loader2 className="animate-spin text-[#9FD3E8] w-8 h-8" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-sm font-orbitron font-semibold uppercase tracking-[0.03em] text-white">
        PENGATURAN SISTEM
      </h2>

      <div className="flex flex-col lg:flex-row gap-4">
        {/* Sidebar tabs */}
        <div className="lg:w-64 flex lg:flex-col gap-2 overflow-x-auto lg:overflow-visible">
          {sections.map((section, i) => {
            const Icon = section.icon;
            return (
              <button
                key={i}
                onClick={() => setActiveTab(i)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all whitespace-nowrap ${
                  activeTab === i
                    ? "bg-[rgba(159,211,232,0.1)] border border-[rgba(159,211,232,0.3)] text-[#9FD3E8]"
                    : "border border-transparent text-white/50 hover:text-white/70 hover:bg-white/5"
                }`}
              >
                <Icon className="w-5 h-5 shrink-0" />
                <div className="min-w-0">
                  <p className="text-xs font-orbitron font-medium uppercase tracking-wider">
                    {section.title}
                  </p>
                  <p className="text-[10px] font-rajdhani text-white/30 hidden lg:block truncate">
                    {section.description}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Content */}
        <div className="flex-1 card-surface rounded-2xl border border-[rgba(159,211,232,0.15)] p-6 bg-[rgba(10,16,32,0.5)]">
          {activeTab === 0 && (
            <div className="space-y-4">
              <h3 className="text-sm font-orbitron font-semibold text-white uppercase tracking-wider mb-4">
                Website Settings
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { key: "site_name", label: "Site Name" },
                  { key: "site_url", label: "Site URL" },
                ].map((field) => (
                  <div key={field.key}>
                    <label className="text-[10px] font-orbitron uppercase tracking-wider text-white/40 mb-1.5 block">
                      {field.label}
                    </label>
                    <input
                      type="text"
                      value={settings[field.key]}
                      onChange={(e) => update(field.key, e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl bg-[rgba(10,16,32,0.5)] border border-[rgba(159,211,232,0.15)] text-sm font-rajdhani text-white focus:outline-none"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 1 && (
            <div className="space-y-4">
              <h3 className="text-sm font-orbitron font-semibold text-white uppercase tracking-wider mb-4">
                Notification Channels
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { key: "whatsapp", label: "WhatsApp Number" },
                  { key: "email", label: "Email Support" },
                  { key: "telegram", label: "Telegram Bot" },
                  { key: "discord", label: "Discord Invite" },
                ].map((field) => (
                  <div key={field.key}>
                    <label className="text-[10px] font-orbitron uppercase tracking-wider text-white/40 mb-1.5 block">
                      {field.label}
                    </label>
                    <input
                      type="text"
                      value={settings[field.key]}
                      onChange={(e) => update(field.key, e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl bg-[rgba(10,16,32,0.5)] border border-[rgba(159,211,232,0.15)] text-sm font-rajdhani text-white focus:outline-none"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 2 && (
            <div className="space-y-4">
              <h3 className="text-sm font-orbitron font-semibold text-white uppercase tracking-wider mb-4">
                Webhook Configuration
              </h3>
              <div>
                <label className="text-[10px] font-orbitron uppercase tracking-wider text-white/40 mb-1.5 block">
                  Base Webhook URL
                </label>
                <input
                  type="text"
                  value={settings.webhook_base}
                  onChange={(e) => update("webhook_base", e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-[rgba(10,16,32,0.5)] border border-[rgba(159,211,232,0.15)] text-sm font-rajdhani text-white focus:outline-none"
                />
              </div>
            </div>
          )}

          {activeTab === 3 && (
            <div className="space-y-4">
              <h3 className="text-sm font-orbitron font-semibold text-white uppercase tracking-wider mb-4">
                Security Settings
              </h3>
              <div>
                <label className="text-[10px] font-orbitron uppercase tracking-wider text-white/40 mb-1.5 block">
                  JWT Secret Key
                </label>
                <input
                  type="password"
                  value={settings.jwt_secret}
                  onChange={(e) => update("jwt_secret", e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-[rgba(10,16,32,0.5)] border border-[rgba(159,211,232,0.15)] text-sm font-rajdhani text-white focus:outline-none"
                />
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-[rgba(10,16,32,0.3)] border border-white/5">
                <div>
                  <p className="text-sm font-rajdhani text-white">
                    Two-Factor Authentication (2FA)
                  </p>
                  <p className="text-[10px] font-rajdhani text-white/40">
                    Verifikasi tambahan untuk login admin
                  </p>
                </div>
                <button
                  onClick={() => update("enable_2fa", !settings.enable_2fa)}
                  className={`w-12 h-6 rounded-full transition-all duration-200 relative ${
                    settings.enable_2fa ? "bg-[#00E5FF]" : "bg-white/20"
                  }`}
                >
                  <span
                    className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-all duration-200 ${
                      settings.enable_2fa ? "left-[26px]" : "left-0.5"
                    }`}
                  />
                </button>
              </div>
              <div>
                <label className="text-[10px] font-orbitron uppercase tracking-wider text-white/40 mb-1.5 block">
                  Rate Limit (requests/minute)
                </label>
                <input
                  type="number"
                  value={settings.rate_limit}
                  onChange={(e) =>
                    update("rate_limit", parseInt(e.target.value) || 0)
                  }
                  className="w-full px-3 py-2.5 rounded-xl bg-[rgba(10,16,32,0.5)] border border-[rgba(159,211,232,0.15)] text-sm font-rajdhani text-white focus:outline-none"
                />
              </div>
            </div>
          )}

          <div className="mt-6 pt-4 border-t border-white/5">
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-orbitron uppercase tracking-wider text-[#0A1020] transition-all hover:scale-[1.02] bg-gradient-to-r from-[#9FD3E8] to-[#BEEAF5] disabled:opacity-50"
            >
              <Save className="w-4 h-4" />{" "}
              {saving ? "MENYIMPAN..." : "SIMPAN PERUBAHAN"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
