import { useMemo, useState } from "react";
import { Pill, TierBadge, StatCard } from "../components/ui";
import { BANK_DASHBOARD_DATA } from "../data/dummy";
import { getTierFromScore } from "../utils/scoring";
import { isExpiredAssessment, formatDate } from "../utils/format";

export default function Dashboard({ myEntry }) {
  const [sector, setSector] = useState("Semua");
  const [level, setLevel] = useState("Semua");
  const [detail, setDetail] = useState(null);

  const combined = useMemo(() => {
    const rest = BANK_DASHBOARD_DATA.filter((b) => b.name !== myEntry?.name);
    const mine = myEntry ? [{ ...myEntry, mine: true }] : [];
    return [...mine, ...rest].sort((a, b) => b.totalScore - a.totalScore);
  }, [myEntry]);

  const sectors = ["Semua", ...new Set(combined.map((b) => b.sector))];
  const levels = ["Semua", "emas", "perak", "perunggu", "pemula"];

  const filtered = combined.filter(
    (b) => (sector === "Semua" || b.sector === sector) && (level === "Semua" || b.level === level)
  );

  const avgCore = Math.round(combined.reduce((s, b) => s + b.coreScore, 0) / combined.length);

  return (
    <div className="px-5 pb-10">
      <h2 className="font-display text-xl font-extrabold mb-1">Dashboard Skor ESG Lite</h2>
      <p className="text-muted text-sm mb-1">Simulasi tampilan lembaga pembiayaan.</p>
      <p className="text-[11px] text-muted mb-5">
        Hanya UKM yang menyetujui berbagi data yang muncul di sini. Skor Inti ditampilkan terpisah agar perbandingan
        lintas sektor tetap adil (bobot modul sektor berbeda-beda).
      </p>

      <div className="grid grid-cols-2 gap-3 mb-5">
        <StatCard label="UKM Terdaftar" value={combined.length} />
        <StatCard label="Rata-rata Skor Inti" value={avgCore} />
      </div>

      <p className="text-xs font-semibold text-muted mb-1.5">Sektor</p>
      <div className="flex gap-2 overflow-x-auto pb-1 mb-3 scroll-thin">
        {sectors.map((s) => (
          <Pill key={s} active={sector === s} onClick={() => setSector(s)}>{s}</Pill>
        ))}
      </div>
      <p className="text-xs font-semibold text-muted mb-1.5">Level</p>
      <div className="flex gap-2 overflow-x-auto pb-1 mb-4 scroll-thin">
        {levels.map((l) => (
          <Pill key={l} active={level === l} onClick={() => setLevel(l)}>{l === "Semua" ? l : l[0].toUpperCase() + l.slice(1)}</Pill>
        ))}
      </div>

      <div className="space-y-2">
        {filtered.map((b) => {
          const tier = getTierFromScore(b.totalScore);
          const expired = isExpiredAssessment(b.date);
          return (
            <button
              key={b.id}
              onClick={() => setDetail(b)}
              className={`w-full text-left bg-surface border rounded-xl2 p-4 ${b.mine ? "border-lime" : "border-line"}`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-display font-bold text-sm">{b.name} {b.mine && <span className="text-lime text-xs">• baru</span>}</p>
                  <p className="text-muted text-xs">{b.sector}</p>
                  <p className="text-muted text-[10px] mt-0.5">
                    Skor Inti: <span className="text-ink font-semibold">{b.coreScore}</span> · {b.verification}
                    {expired && <span className="text-danger font-semibold"> · Kedaluwarsa</span>}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <p className="font-display font-extrabold">{b.totalScore}</p>
                  <TierBadge tier={tier} size="sm" />
                </div>
              </div>
            </button>
          );
        })}
        {filtered.length === 0 && <p className="text-muted text-sm text-center py-8">Tidak ada usaha yang cocok filter.</p>}
      </div>

      {detail && (
        <div className="fixed inset-0 bg-black/60 flex items-end z-20" onClick={() => setDetail(null)}>
          <div className="bg-surface w-full max-w-sm mx-auto rounded-t-2xl p-5" onClick={(e) => e.stopPropagation()}>
            <p className="font-display font-extrabold text-lg mb-1">{detail.name}</p>
            <p className="text-muted text-sm mb-4">{detail.sector} · {detail.scale}</p>
            <Row k="Skor Inti" v={detail.coreScore} />
            <Row k="Skor Total" v={detail.totalScore} />
            <Row k="Status verifikasi" v={detail.verification} />
            <Row k="Tanggal asesmen" v={formatDate(detail.date)} />
            <div className="flex gap-2 mt-4">
              <button className="flex-1 py-2.5 rounded-lg border border-line text-sm font-semibold" onClick={() => setDetail(null)}>
                Tutup
              </button>
              <button
                className="flex-1 py-2.5 rounded-lg bg-lime text-[#0A0E13] text-sm font-bold"
                onClick={() => { alert("Permintaan data tambahan terkirim (simulasi) — menunggu persetujuan UKM."); setDetail(null); }}
              >
                Minta Data Tambahan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Row({ k, v }) {
  return (
    <div className="flex justify-between text-sm py-1.5 border-b border-line">
      <span className="text-muted">{k}</span>
      <span className="font-semibold">{v}</span>
    </div>
  );
}
