import { Button, TierBadge, Sparkline, RadarChart, BarRow } from "../components/ui";
import { SCORE_HISTORY } from "../data/dummy";
import { monthsSince } from "../utils/format";

export default function Home({ profile, latest, onNavigate }) {
  const has = !!latest;
  const history = [...SCORE_HISTORY.map((h) => h.score), ...(has ? [latest.result.klaim.total] : [])];
  const prev = SCORE_HISTORY[SCORE_HISTORY.length - 1].score;
  const delta = has ? latest.result.klaim.total - prev : 0;
  const monthsAgo = has ? monthsSince(latest.date) : null;

  return (
    <div className="px-5 pb-6">
      <p className="text-muted text-sm mb-1">Selamat datang,</p>
      <h2 className="font-display text-xl font-extrabold mb-5">{profile?.nama || "Pelaku UKM"}</h2>

      {has ? (
        <div className="rounded-xl2 p-5 mb-4" style={{ background: `linear-gradient(135deg, ${latest.result.level.from}, ${latest.result.level.to})` }}>
          <p className="text-[#14201a]/70 text-xs font-bold uppercase tracking-wide mb-1">Skor Klaim</p>
          <div className="flex items-end gap-2 mb-3">
            <span className="font-display text-4xl font-extrabold text-[#14201a]">{latest.result.klaim.total}</span>
            <span className="text-[#14201a]/70 font-semibold mb-1">/ 100</span>
          </div>
          <div className="flex items-center justify-between">
            <TierBadge tier={{ ...latest.result.level, from: "rgba(20,32,26,0.15)", to: "rgba(20,32,26,0.15)" }} />
            <span className="text-[#14201a]/80 text-xs font-bold">
              {delta >= 0 ? "▲" : "▼"} {Math.abs(delta)} poin
            </span>
          </div>
        </div>
      ) : (
        <div className="rounded-xl2 p-5 mb-4 bg-surface border border-line">
          <p className="font-display font-bold mb-1">Belum ada asesmen</p>
          <p className="text-muted text-sm mb-4">Mulai asesmen pertamamu untuk mendapatkan Skor ESG Lite.</p>
          <Button onClick={() => onNavigate("asesmen")}>Mulai Asesmen</Button>
        </div>
      )}

      {has && (
        <div className="bg-surface border border-line rounded-xl2 p-4 mb-4">
          <div className="flex justify-between text-sm font-semibold mb-2">
            <span>Skor Berbukti</span>
            <span className="text-muted">{latest.result.berbukti.total} / 100</span>
          </div>
          <p className="text-[11px] text-muted mb-1">
            Selisih {latest.result.klaim.total - latest.result.berbukti.total} poin dari Skor Klaim — makin kecil selisihnya,
            makin banyak klaim yang didukung bukti.
          </p>
          {monthsAgo >= 12 && (
            <p className="text-[11px] text-danger font-semibold mt-2">
              Asesmen ini sudah {monthsAgo} bulan — berstatus kedaluwarsa, disarankan asesmen ulang.
            </p>
          )}
        </div>
      )}

      <div className="flex gap-3 mb-6">
        <Button variant="secondary" className="flex-1" onClick={() => onNavigate("asesmen")}>
          {has ? "Asesmen Ulang" : "Asesmen Baru"}
        </Button>
        <Button variant="secondary" className="flex-1" onClick={() => onNavigate("bank")}>
          Dashboard Bank
        </Button>
      </div>

      {has && (
        <div className="bg-surface border border-line rounded-xl2 p-4 mb-4 flex flex-col items-center">
          <p className="font-display font-bold text-sm self-start mb-2">Radar per pilar</p>
          <RadarChart
            series={[
              { name: "Klaim", color: "#C6FF4D", values: latest.result.klaim.pillarScores },
              { name: "Berbukti", color: "#6FB6FF", values: latest.result.berbukti.pillarScores },
            ]}
          />
          <div className="flex gap-4 text-[11px] text-muted mt-1">
            <span><span className="inline-block w-2 h-2 rounded-full bg-lime mr-1" />Klaim</span>
            <span><span className="inline-block w-2 h-2 rounded-full bg-[#6FB6FF] mr-1" />Berbukti</span>
          </div>
        </div>
      )}

      <div className="bg-surface border border-line rounded-xl2 p-4 mb-5">
        <div className="flex justify-between items-center mb-2">
          <p className="font-display font-bold text-sm">Tren Skor</p>
          <button onClick={() => onNavigate("riwayat")} className="text-lime text-xs font-bold">Lihat detail</button>
        </div>
        <Sparkline points={history} />
        <div className="flex justify-between text-xs text-muted mt-1">
          {SCORE_HISTORY.map((h) => <span key={h.period}>{h.period}</span>)}
          {has && <span className="text-lime font-bold">Now</span>}
        </div>
      </div>

      {has && latest.actionPlans?.length > 0 && (
        <div className="bg-surface border border-line rounded-xl2 p-4">
          <p className="font-display font-bold text-sm mb-3">Rencana aksi</p>
          <div className="space-y-2">
            {latest.actionPlans.map((ap, i) => (
              <div key={i} className="flex justify-between items-center text-sm">
                <span>{ap.text}</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-line text-muted">{ap.status}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
