// Data contoh untuk demo/prototype. Semua angka di LANDING_STATS memakai label
// kepastian sesuai PRD §2 — jangan dihapus saat dipakai untuk materi lomba.

export const LANDING_STATS = [
  {
    value: "±65,5 juta",
    label: "unit UMKM di Indonesia",
    source: "Kementerian UMKM/BPS (perlu verifikasi rilis resmi)",
    confidence: "Kemungkinan Besar",
  },
  {
    value: "±61,9%",
    label: "kontribusi UMKM terhadap PDB",
    source: "Kementerian UMKM/BPS (perlu verifikasi rilis resmi)",
    confidence: "Kemungkinan Besar",
  },
  {
    value: "69%",
    label: "pelaku UMKM belum memahami SDGs",
    source: "Survei Apindo (metodologi belum diverifikasi)",
    confidence: "Menebak",
  },
];

export const BANK_DASHBOARD_DATA = [
  { id: "b1", name: "Kopi Lestari Malang", sector: "Makanan dan Minuman", scale: "kecil", coreScore: 88, totalScore: 91, level: "emas", verification: "Terverifikasi", date: "2026-09-10" },
  { id: "b2", name: "Batik Asri Pekalongan", sector: "Manufaktur, Kerajinan, Tekstil, Fashion", scale: "kecil", coreScore: 74, totalScore: 76, level: "perak", verification: "Berbukti", date: "2026-09-02" },
  { id: "b3", name: "Warung Sehat Semarang", sector: "Makanan dan Minuman", scale: "mikro", coreScore: 68, totalScore: 70, level: "perak", verification: "Berbukti", date: "2026-08-20" },
  { id: "b4", name: "Tani Makmur Boyolali", sector: "Pertanian, Perikanan, Peternakan", scale: "mikro", coreScore: 60, totalScore: 62, level: "perunggu", verification: "Mandiri", date: "2026-08-05" },
  { id: "b5", name: "Bengkel Jaya Cilacap", sector: "Jasa Berisiko Lingkungan (bengkel, laundry, percetakan)", scale: "kecil", coreScore: 51, totalScore: 53, level: "perunggu", verification: "Berbukti", date: "2026-07-15" },
  { id: "b6", name: "Konveksi Rapi Solo", sector: "Manufaktur, Kerajinan, Tekstil, Fashion", scale: "mikro", coreScore: 34, totalScore: 36, level: "pemula", verification: "Mandiri", date: "2025-08-01" },
  { id: "b7", name: "Meubel Jati Jepara", sector: "Manufaktur, Kerajinan, Tekstil, Fashion", scale: "menengah", coreScore: 80, totalScore: 83, level: "emas", verification: "Terverifikasi", date: "2026-09-18" },
  { id: "b8", name: "Laundry Bersih Boyolali", sector: "Jasa Berisiko Lingkungan (bengkel, laundry, percetakan)", scale: "mikro", coreScore: 44, totalScore: 45, level: "perunggu", verification: "Mandiri", date: "2026-06-11" },
];

export const SCORE_HISTORY = [
  { period: "Asesmen 1", instrumentVersion: "v1.0", score: 41 },
  { period: "Asesmen 2", instrumentVersion: "v1.0", score: 54 },
  { period: "Asesmen 3", instrumentVersion: "v1.0", score: 63 },
];

export const DEMO_PRESETS = [
  {
    key: "kuliner",
    label: "Kedai Kopi (Makanan & Minuman)",
    profile: {
      nama: "Kedai Kopi Contoh",
      sektorUtama: "makanan-minuman",
      sektorTambahan: [],
      skala: "kecil",
      omzet: 800_000_000,
      karyawan: 6,
      aktivitas: ["produksi", "pelanggan_langsung", "punya_karyawan", "jual_pangan"],
    },
  },
  {
    key: "bengkel",
    label: "Bengkel Motor (Jasa Berisiko Lingkungan)",
    profile: {
      nama: "Bengkel Contoh",
      sektorUtama: "jasa-berisiko-lingkungan",
      sektorTambahan: [],
      skala: "mikro",
      omzet: 350_000_000,
      karyawan: 3,
      aktivitas: ["bahan_kimia", "pelanggan_langsung", "punya_karyawan"],
    },
  },
];
