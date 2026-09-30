export function formatRupiah(n) {
  const v = Number(n) || 0;
  return "Rp" + v.toLocaleString("id-ID");
}

export function formatDate(dateStr) {
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return "-";
  return d.toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
}

export function monthsSince(dateStr) {
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return 0;
  const now = new Date();
  return (now.getFullYear() - d.getFullYear()) * 12 + (now.getMonth() - d.getMonth());
}

export function isExpiredAssessment(dateStr) {
  return monthsSince(dateStr) > 12;
}

export function generateReportNumber(businessName) {
  const seed = (businessName || "ESG").replace(/\s+/g, "").slice(0, 3).toUpperCase();
  const y = new Date().getFullYear();
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `ESGL-${y}-${seed}-${rand}`;
}
