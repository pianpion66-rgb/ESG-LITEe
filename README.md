# ESG Lite — Prototype (sesuai PRD v0.1)

Prototype untuk konsep **ESG Lite**: platform asesmen keberlanjutan untuk UKM
lintas sektor, dibangun mengikuti cakupan MVP demo KTI pada PRD (§5.2):
Inti 12 indikator + 2 modul sektor penuh, dua lapis skor (Klaim vs Berbukti),
gating level, satu alur verifikasi end-to-end, dan laporan 7-bagian dengan QR.

## Cara menjalankan di VS Code

```bash
npm install
npm run dev
```
Buka alamat yang muncul di terminal (biasanya `http://localhost:5173`).

## Struktur folder

```
src/
  App.jsx                    -> state utama, alur Landing -> Onboarding -> App
  data/
    indicators.js            -> 12 indikator Inti + Modul Sektor (2 penuh, 7 pratinjau)
    sectors.js                -> daftar sektor, checklist aktivitas usaha, klasifikasi skala
    dummy.js                   -> data contoh: statistik landing, Dashboard Bank, preset demo
  utils/
    scoring.js                 -> mesin skor (PRD §9): dua lapis skor, bobot 70/30, gating level
    format.js                  -> format tanggal, nomor laporan, deteksi kedaluwarsa
  components/
    ui.jsx                      -> Button, Badge, RadarChart, ScaleControl, Accordion, dst.
    TopBar.jsx / BottomNav.jsx
  screens/
    Landing.jsx                 -> headline, cara kerja, statistik + sumber, FAQ
    Onboarding.jsx                -> wizard 3 langkah: akun, profil usaha, legalitas
    Home.jsx                       -> Skor Klaim/Berbukti, radar, tren, rencana aksi
    Asesmen.jsx                     -> pilih modul+sektor, form skala 0-3, bukti, N/A
    Hasil.jsx                        -> skor, radar, rekomendasi, simulator what-if
    Verifikasi.jsx                     -> alur verifikator: konfirmasi/koreksi + audit log
    Laporan.jsx                         -> laporan 7 bagian siap cetak/PDF + QR
    Dashboard.jsx                        -> sisi bank: Skor Inti terpisah, filter, consent
    Riwayat.jsx / Profil.jsx
```

## Cakupan vs PRD — apa yang disederhanakan

Mengikuti prinsip transparansi PRD sendiri (label **[Menebak]** dsb.), berikut
penyesuaian yang dibuat pada prototype ini dibanding spesifikasi penuh:

- **Modul sektor**: hanya "Makanan dan Minuman" dan "Jasa Berisiko Lingkungan"
  yang fungsional penuh (sesuai rekomendasi PRD §5.2). Tujuh sektor lain
  tampil sebagai pratinjau berlabel "tahap lanjutan".
- **Bukti unggahan**: disimulasikan sebagai checkbox "Lampirkan bukti", bukan
  unggah file sungguhan — cukup untuk menunjukkan efeknya ke Skor Berbukti.
- **Laporan PDF**: dibuat sebagai halaman cetak (`window.print()`) dengan CSS
  khusus print, bukan generator PDF biner. Kode QR memakai API publik
  qrserver.com (butuh koneksi internet saat demo).
- **Data historis & Dashboard Bank**: memakai data contoh (dummy), bukan
  database sungguhan — sesuai arahan PRD bahwa ini cukup mock-up untuk MVP.
- **Autentikasi**: hanya form akun tanpa backend nyata; data tersimpan di
  React state selama sesi berjalan.
- **Validasi silang otomatis**: baru dicontohkan pada satu indikator (E1)
  sebagai bukti konsep, belum menyeluruh ke semua indikator kuantitatif.

## Yang bisa dikembangkan lanjut

- Ganti data dummy di `data/dummy.js` dengan pemanggilan API/database.
- Lengkapi modul sektor lain di `data/indicators.js` (struktur sudah siap,
  tinggal isi array `indicators` dan ubah `status` jadi `"full"`).
- Tambahkan backend (mis. Supabase/Firebase) untuk autentikasi dan
  penyimpanan permanen lintas sesi, plus ekspor/hapus data sesuai UU PDP.
