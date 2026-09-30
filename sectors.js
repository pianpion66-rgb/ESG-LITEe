export const SECTORS = [
  { slug: "makanan-minuman", label: "Makanan dan Minuman" },
  { slug: "pertanian", label: "Pertanian, Perikanan, Peternakan" },
  { slug: "manufaktur", label: "Manufaktur, Kerajinan, Tekstil, Fashion" },
  { slug: "retail", label: "Perdagangan dan Retail" },
  { slug: "jasa", label: "Jasa Umum (salon, profesional, pendidikan, digital)" },
  { slug: "jasa-berisiko-lingkungan", label: "Jasa Berisiko Lingkungan (bengkel, laundry, percetakan)" },
  { slug: "pariwisata", label: "Pariwisata dan Penginapan" },
  { slug: "logistik", label: "Transportasi dan Logistik" },
  { slug: "lainnya", label: "Lainnya" },
];

// Checklist profil aktivitas usaha (PRD §7.2 Langkah 2) — menentukan indikator
// mana yang aktif, menggantikan penentuan murni berdasar nama sektor.
export const ACTIVITY_CHECKLIST = [
  { key: "bahan_kimia", label: "Menggunakan bahan kimia/oli dalam operasional" },
  { key: "produksi", label: "Memiliki proses produksi/pengolahan" },
  { key: "armada", label: "Memiliki armada kendaraan operasional" },
  { key: "pelanggan_langsung", label: "Menerima pelanggan langsung di lokasi usaha" },
  { key: "punya_karyawan", label: "Mempekerjakan orang lain selain pemilik" },
  { key: "jual_pangan", label: "Menjual produk pangan/makanan-minuman" },
];

// Klasifikasi skala usaha otomatis dari omzet tahunan, mengacu PP 7/2021
// (nominal perlu diverifikasi ulang ke pasal resmi sebelum dikutip final di KTI).
export function classifyScale(omzetTahunanRupiah) {
  const v = Number(omzetTahunanRupiah) || 0;
  if (v <= 2_000_000_000) return "mikro";
  if (v <= 15_000_000_000) return "kecil";
  if (v <= 50_000_000_000) return "menengah";
  return "besar";
}

export function validateNIB(v) {
  return /^\d{13}$/.test((v || "").replace(/\s/g, ""));
}
export function validateNPWP(v) {
  const digits = (v || "").replace(/\D/g, "");
  return digits.length === 15 || digits.length === 16;
}
