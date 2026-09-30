import { CORE_INDICATORS, SECTOR_MODULES } from "../data/indicators";

// Menggabungkan indikator Inti + indikator modul sektor yang dipilih (maks 2,
// sesuai cakupan MVP PRD §5.2).
export function getActiveIndicators(selectedSectorSlugs = []) {
  const sectorIndicators = selectedSectorSlugs
    .map((slug) => SECTOR_MODULES[slug])
    .filter((m) => m && m.status === "full")
    .flatMap((m) => m.indicators);
  return { core: CORE_INDICATORS, sector: sectorIndicators, all: [...CORE_INDICATORS, ...sectorIndicators] };
}

// answers: { [indikatorId]: { level: 0-3|null, na: bool, naReason: string, evidence: bool } }
function pillarAverage(indicators, answers, requireEvidence) {
  const applicable = indicators.filter((q) => {
    const a = answers[q.id];
    if (!a || a.na) return false;
    if (requireEvidence && !a.evidence) return false;
    return true;
  });
  if (applicable.length === 0) return null;
  const sum = applicable.reduce((s, q) => s + (answers[q.id].level ?? 0) / 3, 0);
  return Math.round((sum / applicable.length) * 100);
}

function computeLayer(core, sector, answers, requireEvidence) {
  const pillars = ["E", "S", "G"];
  const pillarScores = {};
  pillars.forEach((p) => {
    const coreForP = core.filter((q) => q.pillar === p);
    const sectorForP = sector.filter((q) => q.pillar === p);
    const coreAvg = pillarAverage(coreForP, answers, requireEvidence);
    const sectorAvg = sectorForP.length ? pillarAverage(sectorForP, answers, requireEvidence) : null;
    if (coreAvg === null && sectorAvg === null) {
      pillarScores[p] = 0;
    } else if (sectorAvg === null) {
      pillarScores[p] = coreAvg ?? 0;
    } else if (coreAvg === null) {
      pillarScores[p] = sectorAvg;
    } else {
      pillarScores[p] = Math.round(coreAvg * 0.7 + sectorAvg * 0.3);
    }
  });
  const total = Math.round(pillarScores.E * 0.33 + pillarScores.S * 0.33 + pillarScores.G * 0.34);
  return { pillarScores, total };
}

export function computeScore(core, sector, answers) {
  const klaim = computeLayer(core, sector, answers, false);
  const berbukti = computeLayer(core, sector, answers, true);

  const answeredCount = Object.values(answers).filter((a) => a && !a.na).length;
  const evidenceCount = Object.values(answers).filter((a) => a && !a.na && a.evidence).length;
  const evidencePct = answeredCount ? Math.round((evidenceCount / answeredCount) * 100) : 0;

  const g2 = answers["G2"];
  const level = getLevel(klaim.total, klaim.pillarScores, g2?.level ?? 0, evidencePct);

  return { klaim, berbukti, evidencePct, level };
}

export function getLevel(total, pillarScores, g2Level, evidencePct) {
  const minPillar = Math.min(pillarScores.E, pillarScores.S, pillarScores.G);
  if (total >= 80 && minPillar >= 60 && g2Level >= 2 && evidencePct >= 50) {
    return { key: "emas", label: "Emas", from: "#F4E5A1", to: "#C9A227" };
  }
  if (total >= 60 && minPillar >= 40) {
    return { key: "perak", label: "Perak", from: "#E7ECF1", to: "#9CA7B3" };
  }
  if (total >= 40) {
    return { key: "perunggu", label: "Perunggu", from: "#F0B98A", to: "#B4693A" };
  }
  return { key: "pemula", label: "Pemula", from: "#3A4550", to: "#232C34" };
}

export function getTierFromScore(score) {
  if (score >= 80) return { key: "emas", label: "Emas", from: "#F4E5A1", to: "#C9A227" };
  if (score >= 60) return { key: "perak", label: "Perak", from: "#E7ECF1", to: "#9CA7B3" };
  if (score >= 40) return { key: "perunggu", label: "Perunggu", from: "#F0B98A", to: "#B4693A" };
  return { key: "pemula", label: "Pemula", from: "#3A4550", to: "#232C34" };
}

export function weakestIndicators(core, sector, answers, limit = 3) {
  const all = [...core, ...sector];
  const answered = all
    .filter((q) => answers[q.id] && !answers[q.id].na)
    .map((q) => ({ ...q, level: answers[q.id].level }))
    .sort((a, b) => a.level - b.level);
  return answered.slice(0, limit);
}

export function financingReadiness(level, evidencePct) {
  if (level.key === "emas") return { label: "Siap", detail: "Memenuhi seluruh syarat batas minimum ESG Lite." };
  if (level.key === "perak")
    return {
      label: "Hampir Siap",
      detail: "Perkuat pilar dengan skor terendah dan tambahkan bukti dokumen agar memenuhi syarat Emas.",
    };
  return {
    label: "Perlu Perbaikan",
    detail: "Lengkapi indikator dasar (khususnya legalitas dan pencatatan keuangan) sebelum mengajukan pembiayaan hijau.",
  };
}
