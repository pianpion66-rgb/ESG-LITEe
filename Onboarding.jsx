import { useState } from "react";
import { Button, ProgressDots, Toggle } from "../components/ui";
import { SECTORS, ACTIVITY_CHECKLIST, classifyScale, validateNIB, validateNPWP } from "../data/sectors";

const SCALE_LABEL = { mikro: "Mikro", kecil: "Kecil", menengah: "Menengah", besar: "Besar" };

export default function Onboarding({ onSelesai, onBatal }) {
  const [step, setStep] = useState(0);
  const [akun, setAkun] = useState({ nama: "", kontak: "", password: "", consentSkor: false, consentBagi: false });
  const [profil, setProfil] = useState({
    nama: "",
    pemilik: "",
    tahunBerdiri: "",
    kota: "",
    sektorUtama: SECTORS[0].slug,
    sektorTambahan: [],
    karyawan: "",
    omzet: "",
    aktivitas: [],
  });
  const [legal, setLegal] = useState({ nib: "", npwp: "", dokumen: {} });
  const [skipLegal, setSkipLegal] = useState(false);

  const skala = classifyScale(profil.omzet);

  function toggleActivity(key) {
    setProfil((p) => ({
      ...p,
      aktivitas: p.aktivitas.includes(key) ? p.aktivitas.filter((a) => a !== key) : [...p.aktivitas, key],
    }));
  }

  function toggleSektorTambahan(slug) {
    setProfil((p) => ({
      ...p,
      sektorTambahan: p.sektorTambahan.includes(slug)
        ? p.sektorTambahan.filter((s) => s !== slug)
        : [...p.sektorTambahan, slug],
    }));
  }

  function legalCompleteness() {
    let filled = 0;
    const total = 2;
    if (validateNIB(legal.nib)) filled++;
    if (validateNPWP(legal.npwp)) filled++;
    return Math.round((filled / total) * 100);
  }

  function selesai() {
    onSelesai({ akun, profil: { ...profil, skala }, legal: skipLegal ? null : legal });
  }

  return (
    <div className="px-5 pb-10 pt-6">
      <ProgressDots step={step + 1} total={3} />

      {step === 0 && (
        <div>
          <p className="text-lime text-xs font-bold uppercase mb-1">Langkah 1 dari 3</p>
          <h2 className="font-display text-xl font-extrabold mb-4">Buat akun</h2>

          <Field label="Nama lengkap">
            <input className="input" value={akun.nama} onChange={(e) => setAkun({ ...akun, nama: e.target.value })} />
          </Field>
          <Field label="Email atau nomor WhatsApp">
            <input className="input" value={akun.kontak} onChange={(e) => setAkun({ ...akun, kontak: e.target.value })} />
          </Field>
          <Field label="Kata sandi">
            <input type="password" className="input" value={akun.password} onChange={(e) => setAkun({ ...akun, password: e.target.value })} />
          </Field>

          <div className="space-y-3 mt-4 mb-2">
            <Toggle
              checked={akun.consentSkor}
              onChange={(v) => setAkun({ ...akun, consentSkor: v })}
              label="Saya setuju data dipakai untuk menghitung Skor ESG Lite"
            />
            <Toggle
              checked={akun.consentBagi}
              onChange={(v) => setAkun({ ...akun, consentBagi: v })}
              label="Saya setuju hasil dibagikan ke lembaga keuangan mitra (opsional, bisa diubah nanti)"
            />
          </div>

          <div className="flex justify-between mt-6">
            <Button variant="ghost" onClick={onBatal}>Batal</Button>
            <Button onClick={() => setStep(1)} disabled={!akun.nama || !akun.kontak || !akun.consentSkor}>
              Lanjut
            </Button>
          </div>
        </div>
      )}

      {step === 1 && (
        <div>
          <p className="text-lime text-xs font-bold uppercase mb-1">Langkah 2 dari 3</p>
          <h2 className="font-display text-xl font-extrabold mb-1">Profil usaha</h2>
          <p className="text-muted text-sm mb-4">Dipakai untuk mengaktifkan indikator yang relevan dengan usahamu.</p>

          <Field label="Nama usaha">
            <input className="input" value={profil.nama} onChange={(e) => setProfil({ ...profil, nama: e.target.value })} />
          </Field>
          <Field label="Nama pemilik">
            <input className="input" value={profil.pemilik} onChange={(e) => setProfil({ ...profil, pemilik: e.target.value })} />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Tahun berdiri">
              <input className="input" value={profil.tahunBerdiri} onChange={(e) => setProfil({ ...profil, tahunBerdiri: e.target.value })} />
            </Field>
            <Field label="Kota">
              <input className="input" value={profil.kota} onChange={(e) => setProfil({ ...profil, kota: e.target.value })} />
            </Field>
          </div>

          <Field label="Sektor utama">
            <select className="input" value={profil.sektorUtama} onChange={(e) => setProfil({ ...profil, sektorUtama: e.target.value })}>
              {SECTORS.map((s) => (
                <option key={s.slug} value={s.slug}>{s.label}</option>
              ))}
            </select>
          </Field>

          <Field label="Sektor tambahan (jika usaha punya lebih dari satu lini)">
            <div className="flex flex-wrap gap-2">
              {SECTORS.filter((s) => s.slug !== profil.sektorUtama).map((s) => (
                <button
                  key={s.slug}
                  onClick={() => toggleSektorTambahan(s.slug)}
                  className={`text-xs px-3 py-1.5 rounded-full border ${
                    profil.sektorTambahan.includes(s.slug) ? "bg-lime text-[#0A0E13] border-lime" : "border-line text-muted"
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Jumlah karyawan">
              <input type="number" className="input" value={profil.karyawan} onChange={(e) => setProfil({ ...profil, karyawan: e.target.value })} />
            </Field>
            <Field label="Omzet tahunan (Rp)">
              <input type="number" className="input" value={profil.omzet} onChange={(e) => setProfil({ ...profil, omzet: e.target.value })} />
            </Field>
          </div>
          {profil.omzet && (
            <p className="text-xs text-muted -mt-2 mb-4">
              Skala usaha terdeteksi otomatis: <span className="text-lime font-semibold">{SCALE_LABEL[skala]}</span>{" "}
              (mengacu PP 7/2021 — perlu verifikasi ulang nominal pasal sebelum dikutip final)
            </p>
          )}

          <Field label="Profil aktivitas usaha">
            <div className="space-y-2">
              {ACTIVITY_CHECKLIST.map((a) => (
                <label key={a.key} className="flex items-center gap-2.5 text-sm bg-surface border border-line rounded-lg p-3">
                  <input type="checkbox" checked={profil.aktivitas.includes(a.key)} onChange={() => toggleActivity(a.key)} />
                  {a.label}
                </label>
              ))}
            </div>
          </Field>

          <div className="flex justify-between mt-6">
            <Button variant="ghost" onClick={() => setStep(0)}>Kembali</Button>
            <Button onClick={() => setStep(2)} disabled={!profil.nama || !profil.omzet}>Lanjut</Button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div>
          <p className="text-lime text-xs font-bold uppercase mb-1">Langkah 3 dari 3</p>
          <h2 className="font-display text-xl font-extrabold mb-1">Legalitas</h2>
          <p className="text-muted text-sm mb-4">Boleh dilewati — legalitas tidak menjadi syarat untuk mulai asesmen.</p>

          {!skipLegal && (
            <>
              <Field label="NIB (13 digit)">
                <input className="input" value={legal.nib} onChange={(e) => setLegal({ ...legal, nib: e.target.value })} placeholder="13 digit angka" />
                {legal.nib && !validateNIB(legal.nib) && <p className="text-danger text-xs mt-1">Format NIB harus 13 digit angka.</p>}
              </Field>
              <Field label="NPWP (15-16 digit)">
                <input className="input" value={legal.npwp} onChange={(e) => setLegal({ ...legal, npwp: e.target.value })} placeholder="15-16 digit angka" />
                {legal.npwp && !validateNPWP(legal.npwp) && <p className="text-danger text-xs mt-1">Format NPWP harus 15-16 digit angka.</p>}
              </Field>
              <div className="bg-surface border border-line rounded-xl2 p-4 mb-4">
                <p className="text-sm font-semibold mb-2">Kelengkapan legalitas</p>
                <div className="h-2 rounded-full bg-line overflow-hidden">
                  <div className="h-full bg-lime rounded-full transition-all" style={{ width: `${legalCompleteness()}%` }} />
                </div>
                <p className="text-[11px] text-muted mt-1.5">
                  Kelengkapan ini terpisah dari Skor ESG — tidak dihitung ganda ke dalam skor keberlanjutan.
                </p>
              </div>
            </>
          )}

          <button onClick={() => setSkipLegal((v) => !v)} className="text-xs text-lime underline mb-6">
            {skipLegal ? "Batalkan lewati" : "Lewati langkah ini"}
          </button>

          <div className="flex justify-between">
            <Button variant="ghost" onClick={() => setStep(1)}>Kembali</Button>
            <Button onClick={selesai}>Selesai</Button>
          </div>
        </div>
      )}
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div className="mb-4">
      <label className="block text-sm font-semibold mb-1.5">{label}</label>
      {children}
    </div>
  );
}
