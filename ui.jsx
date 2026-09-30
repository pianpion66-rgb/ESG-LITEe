import { useState } from "react";

export function Button({ children, variant = "primary", className = "", ...props }) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 font-display font-bold text-sm transition active:scale-[0.98] disabled:opacity-40 disabled:pointer-events-none";
  const variants = {
    primary: "bg-lime text-[#0A0E13] hover:brightness-95",
    secondary: "bg-transparent border border-line text-ink hover:border-lime/60",
    ghost: "bg-transparent text-muted hover:text-ink",
    danger: "bg-danger/15 text-danger border border-danger/40",
  };
  return (
    <button className={`${base} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
}

export function TierBadge({ tier, size = "md" }) {
  const sizes = { sm: "text-xs px-2.5 py-1", md: "text-sm px-3 py-1.5" };
  return (
    <span
      className={`inline-block rounded-full font-display font-extrabold text-[#14201a] ${sizes[size]}`}
      style={{ background: `linear-gradient(135deg, ${tier.from}, ${tier.to})` }}
    >
      {tier.label}
    </span>
  );
}

export function Pill({ active, children, ...props }) {
  return (
    <button
      className={`whitespace-nowrap text-xs font-semibold px-3 py-1.5 rounded-full border transition ${
        active ? "bg-lime text-[#0A0E13] border-lime" : "border-line text-muted"
      }`}
      {...props}
    >
      {children}
    </button>
  );
}

export function ProgressDots({ step, total }) {
  return (
    <div className="flex gap-1.5 mb-6">
      {Array.from({ length: total }).map((_, i) => (
        <span key={i} className={`h-1 flex-1 rounded-full ${i < step ? "bg-lime" : "bg-line"}`} />
      ))}
    </div>
  );
}

export function StatCard({ label, value, sub, accent }) {
  return (
    <div className="bg-surface border border-line rounded-xl2 p-4">
      <p className="text-muted text-xs font-semibold uppercase tracking-wide mb-1">{label}</p>
      <p className="font-display text-2xl font-extrabold text-ink">{value}</p>
      {sub && <p className={`text-xs mt-1 font-semibold ${accent || "text-muted"}`}>{sub}</p>}
    </div>
  );
}

export function Sparkline({ points, height = 90, color = "#C6FF4D" }) {
  const max = Math.max(...points, 100);
  const min = Math.min(...points, 0);
  const w = 100;
  const step = w / (points.length - 1 || 1);
  const coords = points.map((p, i) => {
    const x = i * step;
    const y = height - ((p - min) / (max - min || 1)) * (height - 10) - 5;
    return `${x},${y}`;
  });
  const path = "M" + coords.join(" L");
  const areaPath = `${path} L${w},${height} L0,${height} Z`;
  return (
    <svg viewBox={`0 0 ${w} ${height}`} className="w-full" preserveAspectRatio="none">
      <defs>
        <linearGradient id="sparkFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.35" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={areaPath} fill="url(#sparkFill)" stroke="none" />
      <path d={path} fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function BarRow({ label, pct, color }) {
  return (
    <div className="mb-4">
      <div className="flex justify-between text-sm font-semibold mb-1.5">
        <span>{label}</span>
        <span className="text-muted">{pct}%</span>
      </div>
      <div className="h-2 rounded-full bg-line overflow-hidden">
        <div className="h-full rounded-full transition-all duration-500" style={{ width: `${pct}%`, background: color }} />
      </div>
    </div>
  );
}

// Radar chart 3-sumbu (E/S/G) tanpa dependency eksternal.
// series: [{ name, color, values: {E,S,G} (0-100) }]
export function RadarChart({ series, size = 220 }) {
  const center = size / 2;
  const radius = size / 2 - 28;
  const axes = ["E", "S", "G"];
  const angleFor = (i) => (Math.PI * 2 * i) / axes.length - Math.PI / 2;

  const point = (value, i) => {
    const r = (value / 100) * radius;
    const a = angleFor(i);
    return [center + r * Math.cos(a), center + r * Math.sin(a)];
  };

  const rings = [0.33, 0.66, 1];

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {rings.map((r, i) => (
        <polygon
          key={i}
          points={axes.map((_, ai) => point(r * 100, ai).join(",")).join(" ")}
          fill="none"
          stroke="#26313B"
          strokeWidth="1"
        />
      ))}
      {axes.map((ax, i) => {
        const [x, y] = point(100, i);
        return <line key={ax} x1={center} y1={center} x2={x} y2={y} stroke="#26313B" strokeWidth="1" />;
      })}
      {series.map((s, si) => {
        const pts = axes.map((ax, i) => point(s.values[ax] ?? 0, i));
        return (
          <polygon
            key={si}
            points={pts.map((p) => p.join(",")).join(" ")}
            fill={s.color}
            fillOpacity="0.25"
            stroke={s.color}
            strokeWidth="2"
          />
        );
      })}
      {axes.map((ax, i) => {
        const [x, y] = point(118, i);
        return (
          <text key={ax} x={x} y={y} fontSize="11" fill="#8B95A1" textAnchor="middle" fontWeight="700">
            {ax}
          </text>
        );
      })}
    </svg>
  );
}

// Kontrol skala 0-3 berjangkar perilaku, dengan info tooltip ringkas.
export function ScaleControl({ value, onChange, anchors }) {
  const [showInfo, setShowInfo] = useState(false);
  return (
    <div>
      <div className="flex gap-2 mb-1.5">
        {anchors.map((a) => (
          <button
            key={a.level}
            onClick={() => onChange(a.level)}
            className={`flex-1 py-2 rounded-lg text-xs font-display font-bold transition ${
              value === a.level ? "bg-lime text-[#0A0E13]" : "bg-bg border border-line text-ink"
            }`}
          >
            {a.short}
          </button>
        ))}
      </div>
      <button onClick={() => setShowInfo((v) => !v)} className="text-[11px] text-muted underline">
        {showInfo ? "Sembunyikan rubrik" : "Lihat rubrik penilaian"}
      </button>
      {showInfo && (
        <ul className="mt-2 text-[11px] text-muted space-y-1 bg-bg border border-line rounded-lg p-2.5">
          {anchors.map((a) => (
            <li key={a.level}>
              <span className="text-ink font-semibold">{a.level} — {a.label}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export function Toggle({ checked, onChange, label }) {
  return (
    <label className="flex items-center gap-2.5 cursor-pointer select-none">
      <span
        onClick={() => onChange(!checked)}
        className={`w-10 h-6 rounded-full relative transition ${checked ? "bg-lime" : "bg-line"}`}
      >
        <span
          className={`absolute top-0.5 w-5 h-5 rounded-full bg-[#0A0E13] transition-all ${
            checked ? "left-[18px]" : "left-0.5"
          }`}
        />
      </span>
      <span className="text-sm">{label}</span>
    </label>
  );
}

export function Accordion({ items }) {
  const [open, setOpen] = useState(null);
  return (
    <div className="space-y-2">
      {items.map((it, i) => (
        <div key={i} className="bg-surface border border-line rounded-xl2 overflow-hidden">
          <button
            onClick={() => setOpen(open === i ? null : i)}
            className="w-full flex justify-between items-center p-4 text-left font-semibold text-sm"
          >
            {it.q}
            <span className="text-muted">{open === i ? "−" : "+"}</span>
          </button>
          {open === i && <div className="px-4 pb-4 text-sm text-muted">{it.a}</div>}
        </div>
      ))}
    </div>
  );
}

export function ConfidenceTag({ level }) {
  const styles = {
    Pasti: "text-lime border-lime/40",
    "Kemungkinan Besar": "text-silver border-line",
    Menebak: "text-danger/90 border-danger/30",
  };
  return (
    <span className={`text-[10px] font-bold uppercase tracking-wide border rounded px-1.5 py-0.5 ${styles[level] || ""}`}>
      {level}
    </span>
  );
}
