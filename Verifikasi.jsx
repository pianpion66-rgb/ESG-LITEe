import { useState } from "react";
import { Button } from "../components/ui";
import { PILLAR_META, ANCHORS } from "../data/indicators";

export default function Verifikasi({ assessment, onSelesai, onBatal }) {
  const { core, sector, answers } = assessment;
  const all = [...core, ...sector];
  const [reviewOpen, setReviewOpen] = useState(null);
  const [verified, setVerified] = useState({}); // id -> { level, temuan, akarMasalah, rekomendasi }
  const [log, setLog] = useState([]);

  function confirmSesuai(q) {
    const claimed = answers[q.id]?.level ?? 0;
    setVerified((v) => ({ ...v, [q.id]: { level: claimed, temuan: "Sesuai klaim pemilik usaha.", akarMasalah: "", rekomendasi: "" } }));
    setLog((l) => [...l, { aktor: "Verifikator", aksi: `Konfirmasi ${q.id}`, dari: claimed, ke: claimed, waktu: new Date().toLocaleString("id-ID") }]);
  }

  function saveAdjust(q, data) {
    const claimed = answers[q.id]?.level ?? 0;
    setVerified((v) => ({ ...v, [q.id]: data }));
    setLog((l) => [...l, { aktor: "Verifikator", aksi: `Koreksi ${q.id}`, dari: claimed, ke: data.level, waktu: new Date().toLocaleString("id-ID") }]);
    setReviewOpen(null);
  }

  const reviewedCount = Object.keys(verified).length;

  function selesaikan() {
    onSelesai({ verified, log, status: "Terverifikasi" });
  }

  return (
    <div className="px-5 pb-10">
      <p className="text-lime text-xs font-bold uppercase mb-1">Peran: Verifikator</p>
      <h2 className="font-display text-xl font-extrabold mb-1">Tinjau asesmen</h2>
      <p className="text-muted text-sm mb-4">
        Verifikasi hanya menyatakan bukti konsisten dengan klaim pada tanggal pemeriksaan ini — bukan jaminan
        keberlanjutan usaha secara permanen.
      </p>
      <p className="text-xs text-muted mb-4">{reviewedCount} dari {all.length} indikator ditinjau</p>

      <div className="space-y-2.5 mb-6">
        {all.map((q) => {
          const claimed = answers[q.id] || {};
          const v = verified[q.id];
          const meta = PILLAR_META[q.pillar];
          return (
            <div key={q.id} className="bg-surface border border-line rounded-xl2 p-4">
              <div className="flex justify-between items-start gap-2 mb-2">
                <div>
                  <span className="text-xs font-bold" style={{ color: meta.color }}>{q.id} · {meta.label}</span>
                  <p className="text-sm font-semibold">{q.text}</p>
                </div>
                <span className="text-xs text-muted shrink-0">Klaim: {claimed.na ? "N/A" : claimed.level}</span>
              </div>

              {v ? (
                <p className="text-xs text-lime">✓ Ditinjau — level terverifikasi: {v.level}</p>
              ) : reviewOpen === q.id ? (
                <VerifyForm anchors={ANCHORS} claimedLevel={claimed.level ?? 0} onSave={(data) => saveAdjust(q, data)} onCancel={() => setReviewOpen(null)} />
              ) : (
                <div className="flex gap-2">
                  <Button variant="secondary" className="flex-1 !py-2 !text-xs" onClick={() => confirmSesuai(q)} disabled={claimed.na}>
                    Sesuai Klaim
                  </Button>
                  <Button variant="ghost" className="flex-1 !py-2 !text-xs" onClick={() => setReviewOpen(q.id)} disabled={claimed.na}>
                    Koreksi
                  </Button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {log.length > 0 && (
        <div className="bg-surface border border-line rounded-xl2 p-4 mb-6">
          <p className="font-display font-bold text-sm mb-2">Log audit</p>
          <div className="space-y-1.5 text-[11px] text-muted">
            {log.map((l, i) => (
              <p key={i}>{l.waktu} — {l.aktor} {l.aksi}: level {l.dari} → {l.ke}</p>
            ))}
          </div>
        </div>
      )}

      <div className="flex justify-between">
        <Button variant="ghost" onClick={onBatal}>Kembali</Button>
        <Button onClick={selesaikan} disabled={reviewedCount < all.length}>Selesaikan Verifikasi</Button>
      </div>
    </div>
  );
}

function VerifyForm({ anchors, claimedLevel, onSave, onCancel }) {
  const [level, setLevel] = useState(claimedLevel);
  const [temuan, setTemuan] = useState("");
  const [akarMasalah, setAkarMasalah] = useState("");
  const [rekomendasi, setRekomendasi] = useState("");

  return (
    <div className="mt-2 space-y-2.5">
      <div className="flex gap-2">
        {anchors.map((a) => (
          <button
            key={a.level}
            onClick={() => setLevel(a.level)}
            className={`flex-1 py-1.5 rounded-lg text-[11px] font-bold ${level === a.level ? "bg-lime text-[#0A0E13]" : "bg-bg border border-line"}`}
          >
            {a.short}
          </button>
        ))}
      </div>
      <textarea className="input text-xs" rows={2} placeholder="Temuan..." value={temuan} onChange={(e) => setTemuan(e.target.value)} />
      <textarea className="input text-xs" rows={2} placeholder="Akar masalah..." value={akarMasalah} onChange={(e) => setAkarMasalah(e.target.value)} />
      <textarea className="input text-xs" rows={2} placeholder="Rekomendasi..." value={rekomendasi} onChange={(e) => setRekomendasi(e.target.value)} />
      <div className="flex gap-2">
        <Button variant="ghost" className="flex-1 !py-2 !text-xs" onClick={onCancel}>Batal</Button>
        <Button className="flex-1 !py-2 !text-xs" onClick={() => onSave({ level, temuan, akarMasalah, rekomendasi })}>
          Simpan
        </Button>
      </div>
    </div>
  );
}
