// Struktur indikator sesuai PRD §8.
// CORE_INDICATORS: 12 indikator inti, berlaku semua usaha (skala 0-3).
// SECTOR_MODULES: modul sektor. Sesuai cakupan MVP (PRD §5.2), hanya
// "Makanan dan Minuman" serta "Jasa Berisiko Lingkungan" yang diimplementasikan
// penuh; sektor lain berstatus pratinjau (mock-up) — lihat sectors.js.

export const ANCHORS = [
  { level: 0, label: "Belum ada", short: "Belum" },
  { level: 1, label: "Informal / sebagian diterapkan", short: "Sebagian" },
  { level: 2, label: "Konsisten dijalankan", short: "Konsisten" },
  { level: 3, label: "Terdokumentasi dan rutin", short: "Rutin" },
];

// Pemetaan label ringkas Modul Dasar -> skala 0-3 internal (PRD §7.4).
export const DASAR_LABEL_MAP = { Belum: 0, Sebagian: 1, Ya: 3 };

export const CORE_INDICATORS = [
  {
    id: "E1",
    pillar: "E",
    text: "Pemakaian energi dan air (upaya hemat, pemantauan tagihan)",
    tip: "Mulai catat tagihan listrik/air bulanan dan bandingkan antar bulan — langkah termudah menuju level 'terdokumentasi'.",
    activityKey: null,
  },
  {
    id: "E2",
    pillar: "E",
    text: "Pengelolaan limbah (pemilahan, penampungan, penyaluran termasuk limbah khusus)",
    tip: "Pisahkan sampah organik dan non-organik, lalu jalin kerja sama dengan bank sampah atau pengepul resmi terdekat.",
    activityKey: null,
  },
  {
    id: "E3",
    pillar: "E",
    text: "Efisiensi bahan dan kemasan (pengurangan, penggunaan ulang, daur ulang)",
    tip: "Tinjau kemasan yang bisa dikurangi atau diganti bahan yang lebih mudah didaur ulang.",
    activityKey: "produksi",
  },
  {
    id: "E4",
    pillar: "E",
    text: "Dokumen/izin lingkungan sesuai tingkat risiko (mis. SPPL/UKL-UPL bila dipersyaratkan)",
    tip: "Cek ke DLH setempat apakah skala usahamu memerlukan SPPL — banyak usaha kecil hanya perlu dokumen sederhana.",
    activityKey: "produksi",
  },
  {
    id: "S1",
    pillar: "S",
    text: "Pengupahan sesuai UMK setempat, tepat waktu",
    tip: "Cek angka UMK kabupaten/kota terbaru dan sesuaikan struktur upah secara bertahap.",
    activityKey: "punya_karyawan",
  },
  {
    id: "S2",
    pillar: "S",
    text: "Jaminan sosial pekerja (BPJS Ketenagakerjaan/Kesehatan)",
    tip: "Daftarkan pekerja tetap ke BPJS Ketenagakerjaan segmen bukan penerima upah/penerima upah sesuai skala usaha.",
    activityKey: "punya_karyawan",
  },
  {
    id: "S3",
    pillar: "S",
    text: "Keselamatan dan kesehatan kerja (APD, kebersihan, prosedur)",
    tip: "Sediakan APD dasar sesuai jenis proses (sarung tangan, masker, alas kaki tertutup) dan jaga kebersihan area kerja.",
    activityKey: null,
  },
  {
    id: "S4",
    pillar: "S",
    text: "Kebijakan non-diskriminasi dan jalur pengaduan pekerja",
    tip: "Buat kesepakatan tertulis sederhana bahwa rekrutmen dan perlakuan pekerja tidak membeda-bedakan, plus satu jalur pengaduan (mis. WA pemilik).",
    activityKey: "punya_karyawan",
  },
  {
    id: "G1",
    pillar: "G",
    text: "Pencatatan keuangan rutin, terpisah dari keuangan pribadi",
    tip: "Mulai dari mencatat kas masuk-keluar harian secara konsisten, minimal sesuai SAK EMKM.",
    activityKey: null,
  },
  {
    id: "G2",
    pillar: "G",
    text: "Legalitas usaha (NIB, NPWP, izin usaha sesuai risiko)",
    tip: "Daftar NIB gratis lewat OSS — prasyarat dasar untuk semua skema pembiayaan formal.",
    activityKey: null,
  },
  {
    id: "G3",
    pillar: "G",
    text: "Legalitas produk/layanan sesuai sektor (PIRT/BPOM/halal, SNI, izin profesi)",
    tip: "Untuk usaha pangan, siapkan sertifikasi halal sebelum tenggat wajib 18 Oktober 2026.",
    activityKey: "jual_pangan",
  },
  {
    id: "G4",
    pillar: "G",
    text: "Rantai pasok dan hubungan pelanggan (daftar pemasok, ketertelusuran, penanganan keluhan)",
    tip: "Buat daftar sederhana pemasok utama dan satu kanal resmi untuk menerima keluhan pelanggan.",
    activityKey: null,
  },
];

// Modul sektor — dua sektor diimplementasikan penuh sesuai rekomendasi PRD §5.2.
export const SECTOR_MODULES = {
  "makanan-minuman": {
    label: "Makanan dan Minuman",
    status: "full",
    indicators: [
      {
        id: "MM1",
        pillar: "E",
        text: "Pengelolaan minyak jelantah dan sisa pangan",
        tip: "Kumpulkan minyak jelantah untuk disetor ke pengepul/bank sampah, bukan dibuang ke saluran air.",
        activityKey: "jual_pangan",
      },
      {
        id: "MM2",
        pillar: "S",
        text: "Higiene dan sanitasi dapur/area produksi",
        tip: "Terapkan jadwal pembersihan rutin dan pastikan pekerja produksi menggunakan penutup kepala/sarung tangan.",
        activityKey: "jual_pangan",
      },
      {
        id: "MM3",
        pillar: "G",
        text: "Izin pangan (PIRT/BPOM) sesuai skala produk",
        tip: "Ajukan PIRT ke DPMPTSP setempat — prosesnya kini bisa dimulai daring lewat OSS.",
        activityKey: "jual_pangan",
      },
      {
        id: "MM4",
        pillar: "G",
        text: "Sertifikasi halal (wajib bertahap sesuai UU 33/2014 & PP 42/2024)",
        tip: "Manfaatkan jalur Self-Declare BPJPH untuk UMK yang memenuhi syarat — lebih cepat dan berbiaya rendah.",
        activityKey: "jual_pangan",
      },
      {
        id: "MM5",
        pillar: "G",
        text: "Ketertelusuran bahan baku (dari siapa, kapan diterima)",
        tip: "Simpan nota pembelian bahan baku secara rutin sebagai dasar ketertelusuran sederhana.",
        activityKey: "jual_pangan",
      },
    ],
  },
  "jasa-berisiko-lingkungan": {
    label: "Jasa Berisiko Lingkungan (bengkel, laundry, percetakan)",
    status: "full",
    indicators: [
      {
        id: "JB1",
        pillar: "E",
        text: "Penampungan dan penyaluran limbah B3 (oli bekas, kimia, tinta)",
        tip: "Jalin kerja sama dengan pengepul oli bekas berizin atau bank sampah B3 terdekat.",
        activityKey: "bahan_kimia",
      },
      {
        id: "JB2",
        pillar: "E",
        text: "Pengelolaan air limbah proses (mis. air bekas cucian, pelarut)",
        tip: "Pasang bak pengendapan sederhana sebelum air dibuang ke saluran umum.",
        activityKey: "bahan_kimia",
      },
      {
        id: "JB3",
        pillar: "S",
        text: "K3 untuk bahan berbahaya (APD khusus, penyimpanan aman)",
        tip: "Simpan bahan kimia dalam wadah tertutup berlabel, jauh dari jangkauan dan sumber api.",
        activityKey: "bahan_kimia",
      },
      {
        id: "JB4",
        pillar: "G",
        text: "Izin lingkungan/operasional sesuai risiko limbah",
        tip: "Konsultasikan ke DLH setempat kebutuhan izin sesuai volume limbah yang dihasilkan.",
        activityKey: "bahan_kimia",
      },
    ],
  },
  pertanian: { label: "Pertanian, Perikanan, Peternakan", status: "preview", indicators: [] },
  manufaktur: { label: "Manufaktur, Kerajinan, Tekstil, Fashion", status: "preview", indicators: [] },
  retail: { label: "Perdagangan dan Retail", status: "preview", indicators: [] },
  jasa: { label: "Jasa Umum (salon, profesional, pendidikan, digital)", status: "preview", indicators: [] },
  pariwisata: { label: "Pariwisata dan Penginapan", status: "preview", indicators: [] },
  logistik: { label: "Transportasi dan Logistik", status: "preview", indicators: [] },
  lainnya: { label: "Lainnya", status: "preview", indicators: [] },
};

export const PILLAR_META = {
  E: { label: "Environment", color: "#7CD87A" },
  S: { label: "Social", color: "#6FB6FF" },
  G: { label: "Governance", color: "#C6FF4D" },
};
