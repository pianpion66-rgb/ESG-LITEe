import { useMemo, useState } from "react";
import { Button, TierBadge, BarRow } from "../components/ui";
import { PILLAR_META } from "../data/indicators";
import { formatDate, generateReportNumber } from "../utils/format";

export default function Laporan({ profile, assessment, verificationStatus, onKembali }) {
  const [ringkas, setRingkas] = useState(false);
  const reportNo = useMemo(() => generateReportNumber(profile?.nama), [profile]);
  const today = new Date().toISOString();
  const qrData = encodeURIComponent(`ESGLITE|${reportNo}|${assessment.result.klaim.total}|${today.slice(0, 10)}`);
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=${qrData}`;

  return (
    <div className="px-5 pb-10">
      <div className="flex justify-between items-center mb-4 no-print">
        <Button variant="ghost" onClick={onKembali}>← Kembali</Button>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={() => setRingkas((r) => !r)}>{ringkas ? "Versi Lengkap" : "Versi Ringkas"}</Button>
          <Button onClick={() => window.print()}>Cetak / PDF</Button>
        </div>
      </div>

      <div className="bg-surface border border-line rounded-xl2 p-5">
        <div className="flex justify-between items-start mb-6">
          <div>
            <p className="font-display font-extrabold text-lg">Laporan Keberlanjutan ESG Lite</p>
            <p className="text-muted text-xs">No. Laporan: {reportNo}</p>
            <p className="text-muted text-xs">Tanggal: {formatDate(today)} · Versi instrumen: v1.0</p>
          </div>
          <img src={qrUrl} alt="QR verifikasi laporan" className="w-16 h-16 rounded bg-white p-1" />
        </div>

        <Section title="1. Profil Usaha dan Legalitas">
          <Row k="Nama usaha" v={profile?.nama} />
          <Row k="Sektor" v={profile?.sektorUtama} />
          <Row k="Skala usaha" v={profile?.skala} />
          <Row k="Kota" v={profile?.kota || "-"} />
        </Section>

        <Section title="2. Ringkasan Skor">
          <div className="flex items-center gap-4 mb-2">
            <TierBadge tier={assessment.result.level} />
            <span className="font-display text-2xl font-extrabold">{assessment.result.klaim.total}</span>
            <span className="text-muted text-sm">Skor Klaim</span>
          </div>
          <p className="text-sm text-muted">Skor Berbukti: {assessment.result.berbukti.total} · Bobot berbukti: {assessment.result.evidencePct}%</p>
        </Section>

        {!ringkas && (
          <Section title="3. Rincian per Pilar">
            {Object.entries(assessment.result.klaim.pillarScores).map(([k, pct]) => (
              <BarRow key={k} label={PILLAR_META[k].label} pct={pct} color={PILLAR_META[k].color} />
            ))}
          </Section>
        )}

        {!ringkas && (
          <Section title="4. Data Kuantitatif (Modul Lanjutan)">
            <p className="text-sm text-muted">
              {assessment.modul === "lanjutan"
                ? "Tersedia pada modul sektor yang dipilih — ringkasan intensitas ditampilkan di dashboard, belum dinormalisasi penuh pada versi prototype ini."
                : "Tidak diisi — usaha ini menggunakan ESG Lite Dasar."}
            </p>
          </Section>
        )}

        {!ringkas && (
          <Section title="5. Rencana Aksi dan Target">
            <p className="text-sm text-muted">
              Lihat rekomendasi pada halaman Hasil Asesmen untuk indikator dengan prioritas perbaikan tertinggi.
            </p>
          </Section>
        )}

        <Section title="6. Pernyataan Pemilik dan Status Verifikasi">
          <p className="text-sm mb-2">
            Status saat ini: <span className="font-semibold text-lime">{verificationStatus}</span>
          </p>
          <p className="text-[11px] text-muted italic">
            Verifikasi hanya menyatakan bahwa bukti konsisten dengan klaim pada tanggal pemeriksaan — bukan pernyataan
            bahwa usaha ini "berkelanjutan" secara keseluruhan atau permanen.
          </p>
        </Section>

        <Section title="7. Keaslian Laporan" last>
          <p className="text-sm text-muted">Pindai kode QR di atas untuk memeriksa skor, tanggal, dan status kedaluwarsa terkini laporan ini.</p>
        </Section>

        <p className="text-[10px] text-muted mt-6 border-t border-line pt-3">
          Laporan ini adalah hasil asesmen mandiri (self-assessment) berbasis kerangka ESG Lite, bukan sertifikasi resmi
          atau audit pihak ketiga yang mengikat.
        </p>
      </div>
    </div>
  );
}

function Section({ title, children, last }) {
  return (
    <div className={`mb-5 ${!last ? "pb-5 border-b border-line" : ""}`}>
      <p className="font-display font-bold text-sm mb-2.5">{title}</p>
      {children}
    </div>
  );
}
function Row({ k, v }) {
  return (
    <div className="flex justify-between text-sm py-1">
      <span className="text-muted">{k}</span>
      <span className="font-semibold">{v}</span>
    </div>
  );
}
