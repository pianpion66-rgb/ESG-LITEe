import { Button, Accordion, ConfidenceTag } from "../components/ui";
import { LANDING_STATS, DEMO_PRESETS } from "../data/dummy";

const STEPS = [
  { n: 1, t: "Isi profil usaha", d: "Nama usaha, sektor, dan skala — sekitar 2 menit." },
  { n: 2, t: "Jawab asesmen", d: "Indikator Inti + modul sektor, skala 0-3 dengan rubrik jelas." },
  { n: 3, t: "Lihat skor & rekomendasi", d: "Skor Klaim vs Berbukti, radar per pilar, langkah perbaikan konkret." },
  { n: 4, t: "Ajukan verifikasi", d: "Opsional — naikkan kredibilitas skor untuk lampiran pembiayaan." },
];

const FAQ = [
  { q: "Data saya dipakai untuk apa?", a: "Untuk menghitung skor ESG Lite usahamu. Data hanya dibagikan ke lembaga keuangan jika kamu menyetujuinya secara eksplisit, dan bisa dicabut kapan saja." },
  { q: "Siapa yang bisa melihat data saya?", a: "Hanya kamu, kecuali kamu memilih membagikannya ke lembaga keuangan mitra tertentu." },
  { q: "Apakah berbayar?", a: "Prototype ini gratis digunakan untuk simulasi dan keperluan demo." },
  { q: "Apakah skor ini sertifikasi resmi?", a: "Bukan. ESG Lite adalah asesmen mandiri yang bisa diperkuat lewat verifikasi, bukan pengganti audit atau sertifikasi formal." },
];

export default function Landing({ onDaftar, onDemo }) {
  return (
    <div className="px-5 pb-10 pt-6">
      <div className="flex items-center gap-2 mb-8">
        <span className="w-2.5 h-2.5 rounded-full bg-lime" />
        <span className="font-display font-extrabold">ESG Lite</span>
      </div>

      <div className="eyebrow text-lime text-xs font-bold uppercase mb-2">Asesmen keberlanjutan untuk UKM</div>
      <h1 className="font-display text-2xl font-extrabold leading-snug mb-3">
        Ukur praktik lingkungan, sosial, dan tata kelola usahamu — lalu siapkan lampiran untuk pengajuan pembiayaan hijau.
      </h1>
      <p className="text-muted text-sm mb-6">
        Skor bertingkat (Mandiri → Berbukti → Terverifikasi) dirancang agar tidak sekadar klaim, dan modul sektor
        menyesuaikan isu material sesuai jenis usahamu.
      </p>

      <div className="flex flex-col gap-2.5 mb-8">
        <Button onClick={onDaftar}>Daftar</Button>
        {DEMO_PRESETS.map((p) => (
          <Button key={p.key} variant="secondary" onClick={() => onDemo(p.key)}>
            Coba Demo: {p.label}
          </Button>
        ))}
      </div>

      <h2 className="font-display font-bold text-base mb-3">Cara kerja</h2>
      <div className="space-y-3 mb-8">
        {STEPS.map((s) => (
          <div key={s.n} className="flex gap-3 bg-surface border border-line rounded-xl2 p-4">
            <span className="w-7 h-7 rounded-full bg-lime/15 text-lime font-display font-extrabold text-sm flex items-center justify-center shrink-0">
              {s.n}
            </span>
            <div>
              <p className="font-semibold text-sm">{s.t}</p>
              <p className="text-muted text-xs">{s.d}</p>
            </div>
          </div>
        ))}
      </div>

      <h2 className="font-display font-bold text-base mb-3">Kenapa ini penting</h2>
      <div className="grid grid-cols-1 gap-3 mb-8">
        {LANDING_STATS.map((s, i) => (
          <div key={i} className="bg-surface border border-line rounded-xl2 p-4">
            <div className="flex items-baseline gap-2 mb-1">
              <span className="font-display text-xl font-extrabold text-lime">{s.value}</span>
              <ConfidenceTag level={s.confidence} />
            </div>
            <p className="text-sm mb-1">{s.label}</p>
            <p className="text-muted text-[11px]">Sumber: {s.source}</p>
          </div>
        ))}
      </div>

      <h2 className="font-display font-bold text-base mb-3">Pertanyaan umum</h2>
      <Accordion items={FAQ} />

      <p className="text-muted text-[11px] mt-8 text-center">
        Prototype riset untuk karya tulis ilmiah — bukan produk komersial akhir.
      </p>
    </div>
  );
}
