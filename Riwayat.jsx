import { Sparkline, StatCard } from "../components/ui";
import { SCORE_HISTORY } from "../data/dummy";

export default function Riwayat({ latest }) {
  const latestScore = latest ? latest.result.klaim.total : null;
  const points = [...SCORE_HISTORY.map((h) => h.score), ...(latestScore !== null ? [latestScore] : [])];
  const labels = [...SCORE_HISTORY.map((h) => h.period), ...(latestScore !== null ? ["Terbaru"] : [])];
  const naik = latestScore !== null ? latestScore - SCORE_HISTORY[SCORE_HISTORY.length - 1].score : 0;

  return (
    <div className="px-5 pb-10">
      <h2 className="font-display text-xl font-extrabold mb-1">Riwayat & Tren</h2>
      <p className="text-muted text-sm mb-5">Perkembangan Skor Klaim dari waktu ke waktu.</p>

      <div className="bg-surface border border-line rounded-xl2 p-4 mb-5">
        <div className="flex justify-between items-baseline mb-3">
          <p className="font-display text-2xl font-extrabold">{latestScore ?? "—"}</p>
          {latestScore !== null && (
            <span className={`text-xs font-bold ${naik >= 0 ? "text-lime" : "text-danger"}`}>
              {naik >= 0 ? "▲" : "▼"} {Math.abs(naik)} poin
            </span>
          )}
        </div>
        <Sparkline points={points} height={110} />
        <div className="flex justify-between text-xs text-muted mt-2">
          {labels.map((l) => <span key={l}>{l}</span>)}
        </div>
        <p className="text-[10px] text-muted mt-3">
          Seluruh asesmen di atas memakai versi instrumen v1.0 — penanda versi ditampilkan agar tren tidak menyesatkan
          apabila indikator berubah di kemudian hari.
        </p>
      </div>

      <div className="bg-surface border border-line rounded-xl2 p-4">
        <p className="font-display font-bold text-sm mb-2">Catatan</p>
        <p className="text-muted text-sm">
          Riwayat pada prototype ini memakai data contoh untuk asesmen sebelumnya. Pada implementasi nyata, setiap
          asesmen yang dikirim akan tersimpan otomatis termasuk tren per pilar (Environment, Social, Governance).
        </p>
      </div>
    </div>
  );
}
