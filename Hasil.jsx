import { useState, useMemo } from "react";
import { Button, TierBadge, BarRow, RadarChart } from "../components/ui";
import { PILLAR_META } from "../data/indicators";
import { computeScore, weakestIndicators, financingReadiness } from "../utils/scoring";

export default function Hasil({ assessment, profile, onUbah, onKirimVerifikasi, onLihatLaporan }) {
  const { core, sector, answers, result } = assessment;
  const [simAnswers, setSimAnswers] = useState(answers);
  const [simOn, setSimOn] = useState(false);

  const simResult = useMemo(() => computeScore(core, sector, simAnswers), [core, sector, simAnswers]);
  const shown = simOn ? simResult : result;

  const weakest = weakestIndicators(core, sector, answers, 3);
  const readiness = financingReadiness(shown.level, shown.evidencePct);

  function bumpLevel(id, delta) {
    setSimAnswers((a) => {
      const cur = a[id] || { level: 0, na: false };
      const next = Math.max(0, Math.min(3, (cur.level ?? 0) + delta));
      return { ...a, [id]: { ...cur, level: next, na: false } };
    });
    setSimOn(true);
  }

  return (
    <div className="px-5 pb-10">
      <p className="text-lime text-xs font-bold uppercase mb-1">Hasil Asesmen</p>
      <h2 className="font-display text-xl font-extrabold mb-4">{profile?.nama}</h2>

      <div className="rounded-xl2 p-6 text-center mb-4" style={{ background: `linear-gradient(135deg, ${shown.level.from}, ${shown.level.to})` }}>
        <p className="font-display text-5xl font-extrabold text-[#14201a]">{shown.klaim.total}</p>
        <p className="text-[#14201a]/70 text-sm font-semibold mb-3">Skor Klaim dari 100</p>
        <TierBadge tier={{ ...shown.level, from: "rgba(20,32,26,0.18)", to: "rgba(20,32,26,0.18)" }} />
        {simOn && <p className="text-[#14201a]/70 text-[11px] mt-2">Simulasi aktif — belum tersimpan</p>}
      </div>

      <div className="bg-surface border border-line rounded-xl2 p-4 mb-4 flex flex-col items-center">
        <RadarChart
          series={[
            { name: "Klaim", color: "#C6FF4D", values: shown.klaim.pillarScores },
            { name: "Berbukti", color: "#6FB6FF", values: shown.berbukti.pillarScores },
          ]}
        />
        <p className="text-[11px] text-muted mt-1">
          Skor Berbukti: <span className="text-ink font-semibold">{shown.berbukti.total}</span> · Bukti terlampir{" "}
          <span className="text-ink font-semibold">{shown.evidencePct}%</span>
        </p>
      </div>

      <div className="bg-surface border border-line rounded-xl2 p-4 mb-4">
        <p className="font-display font-bold text-sm mb-3">Rincian per pilar</p>
        {Object.entries(shown.klaim.pillarScores).map(([key, pct]) => (
          <BarRow key={key} label={PILLAR_META[key].label} pct={pct} color={PILLAR_META[key].color} />
        ))}
      </div>

      <div className="border-l-2 border-lime bg-surface rounded-r-xl2 p-4 mb-4">
        <p className="font-display font-bold text-sm mb-2">Rekomendasi perbaikan</p>
        <ul className="text-sm text-muted space-y-2">
          {weakest.map((q) => (
            <li key={q.id} className="flex justify-between gap-3">
              <span>{q.tip}</span>
              <button onClick={() => bumpLevel(q.id, 1)} className="shrink-0 text-lime text-xs font-bold underline">
                Simulasikan +1
              </button>
            </li>
          ))}
        </ul>
        {simOn && (
          <button onClick={() => { setSimAnswers(answers); setSimOn(false); }} className="text-xs text-muted underline mt-3">
            Reset simulasi
          </button>
        )}
      </div>

      <div className="bg-surface border border-line rounded-xl2 p-4 mb-6">
        <p className="font-display font-bold text-sm mb-1">
          Kesiapan pembiayaan hijau: <span className="text-lime">{readiness.label}</span>
        </p>
        <p className="text-muted text-xs mb-2">{readiness.detail}</p>
        <p className="text-[10px] text-muted italic">
          Label ini bersifat indikatif berdasarkan kerangka ESG Lite — bukan keputusan lembaga keuangan.
        </p>
      </div>

      <div className="flex flex-col gap-2.5">
        <div className="flex gap-2.5">
          <Button variant="secondary" className="flex-1" onClick={onUbah}>Ubah Jawaban</Button>
          <Button className="flex-1" onClick={onKirimVerifikasi}>Ajukan Verifikasi</Button>
        </div>
        <Button variant="ghost" onClick={onLihatLaporan}>Lihat Laporan Lengkap →</Button>
      </div>
    </div>
  );
}
