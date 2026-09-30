const ITEMS = [
  { key: "home", label: "Beranda", icon: "⌂" },
  { key: "riwayat", label: "Riwayat", icon: "📈" },
  { key: "asesmen", label: "", icon: "+", fab: true },
  { key: "verifikasi", label: "Verifikasi", icon: "🛡" },
  { key: "bank", label: "Bank", icon: "🏦" },
];

export default function BottomNav({ active, onNavigate }) {
  return (
    <nav className="sticky bottom-0 bg-surface/95 backdrop-blur border-t border-line px-3 pt-2 pb-[calc(10px+env(safe-area-inset-bottom))]">
      <div className="flex items-end justify-between max-w-sm mx-auto">
        {ITEMS.map((item) =>
          item.fab ? (
            <button
              key={item.key}
              onClick={() => onNavigate(item.key)}
              className="w-14 h-14 -mt-6 rounded-full bg-lime text-[#0A0E13] text-2xl font-bold flex items-center justify-center shadow-lg shadow-lime/20 active:scale-95 transition"
              aria-label="Mulai asesmen baru"
            >
              +
            </button>
          ) : (
            <button
              key={item.key}
              onClick={() => onNavigate(item.key)}
              className={`flex flex-col items-center gap-1 px-1.5 py-1 text-[10px] font-semibold ${
                active === item.key ? "text-lime" : "text-muted"
              }`}
            >
              <span className="text-base leading-none">{item.icon}</span>
              {item.label}
            </button>
          )
        )}
      </div>
    </nav>
  );
}
