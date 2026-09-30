import { useState } from "react";
import { Button, ProgressDots, ScaleControl } from "../components/ui";
import { ANCHORS, PILLAR_META, SECTOR_MODULES } from "../data/indicators";
import { getActiveIndicators, computeScore } from "../utils/scoring";

export default function Asesmen({ profile, initialModul, initialSector, initialAnswers, onSelesai, onBatal }) {
  const [step, setStep] = useState(0); // 0: pilih modul, 1: form, 2: review
  const [modul, setModul] = useState(initialModul || (profile?.skala === "menengah" ? "lanjutan" : "dasar"));
  const [sektorDipilih, setSektorDipilih] = useState(initialSector || (profile?.sektorUtama ? [profile.sektorUtama] : []));
  const [answers, setAnswers] = useState(initialAnswers || {});
  const [warnings, setWarnings] = useState({});

  const { core, sector, all } = getActiveIndicators(modul === "lanjutan" ? sektorDipilih : []);

  function setAnswer(id, patch) {
    setAnswers((a) => ({ ...a, [id]: { level: 0, na: false, naReason: "", evidence: false, ...a[id], ...patch } }));
  }

  function toggleSektor(slug) {
    setSektorDipilih((s) => {
      if (s.includes(slug)) return s.filter((x) => x !== slug);
      if (s.length >= 2) return s; // maksimal 2 modul sektor sesuai cakupan MVP
      return [...s, slug];
    });
  }

  function checkValidasiSilang(id, val) {
    // Contoh sederhana validasi silang (PRD §7.4) — tidak memblokir, hanya menandai.
    if (id === "E1" && val > 800) {
      setWarnings((w) => ({ ...w, [id]: "Nilai tampak tinggi untuk skala usaha ini — akan ditandai untuk ditinjau." }));
    } else {
      setWarnings((w) => ({ ...w, [id]: null }));
    }
  }

  const answeredAll = core.every((q) => answers[q.id]) && sector.every((q) => answers[q.id]);

  function submit() {
    const result = computeScore(core, sector, answers);
    onSelesai({ modul, sektorDipilih, answers, result, core, sector });
  }

  return (
    <div className="px-5 pb-10">
      <ProgressDots step={step + 1} total={2} />

      {step === 0 && (
        <div>
          <p className="text-lime text-xs font-bold uppercase mb-1">Sebelum mulai</p>
          <h2 className="font-display text-xl font-extrabold mb-4">Pilih modul asesmen</h2>

          <ModulCard
            title="ESG Lite Dasar"
            desc="12 indikator Inti saja, label ringkas Belum/Sebagian/Ya. Cocok untuk usaha mikro-kecil yang baru mulai melapor."
            selected={modul === "dasar"}
            onClick={() => setModul("dasar")}
          />
          <ModulCard
            title="ESG Lite Lanjutan"
            desc="Inti + hingga 2 modul sektor, skala penuh 0-3 dengan rubrik, plus unggah bukti per indikator."
            selected={modul === "lanjutan"}
            onClick={() => setModul("lanjutan")}
          />

          {modul === "lanjutan" && (
            <div className="mt-4">
              <p className="text-sm font-semibold mb-2">Pilih hingga 2 modul sektor</p>
              <div className="space-y-2">
                {Object.entries(SECTOR_MODULES).map(([slug, m]) => (
                  <button
                    key={slug}
                    disabled={m.status !== "full" && !sektorDipilih.includes(slug)}
                    onClick={() => toggleSektor(slug)}
                    className={`w-full text-left flex justify-between items-center bg-surface border rounded-xl2 p-3.5 ${
                      sektorDipilih.includes(slug) ? "border-lime" : "border-line"
                    } ${m.status !== "full" ? "opacity-50" : ""}`}
                  >
                    <span className="text-sm font-semibold">{m.label}</span>
                    {m.status !== "full" && <span className="text-[10px] text-muted">Pratinjau — tahap lanjutan</span>}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="flex justify-between mt-6">
            <Button variant="ghost" onClick={onBatal}>Batal</Button>
            <Button onClick={() => setStep(1)} disabled={modul === "lanjutan" && sektorDipilih.length === 0}>
              Mulai Isi
            </Button>
          </div>
        </div>
      )}

      {step === 1 && (
        <div>
          <p className="text-lime text-xs font-bold uppercase mb-1">Formulir asesmen</p>
          <h2 className="font-display text-xl font-extrabold mb-1">Indikator Inti</h2>
          <p className="text-muted text-sm mb-4">Jawab sesuai kondisi usaha saat ini. Data tersimpan otomatis.</p>

          {core.map((q) => (
            <QuestionCard
              key={q.id}
              q={q}
              modul={modul}
              answer={answers[q.id]}
              warning={warnings[q.id]}
              onChange={(patch) => setAnswer(q.id, patch)}
              onQuantCheck={(v) => checkValidasiSilang(q.id, v)}
            />
          ))}

          {sector.length > 0 && (
            <>
              <h2 className="font-display text-xl font-extrabold mb-1 mt-6">Modul Sektor</h2>
              <p className="text-muted text-sm mb-4">Indikator tambahan sesuai sektor yang kamu pilih.</p>
              {sector.map((q) => (
                <QuestionCard key={q.id} q={q} modul={modul} answer={answers[q.id]} onChange={(patch) => setAnswer(q.id, patch)} />
              ))}
            </>
          )}

          <div className="flex justify-between mt-6">
            <Button variant="ghost" onClick={onBatal}>Lanjutkan Nanti</Button>
            <Button onClick={submit} disabled={!answeredAll}>Lihat Hasil</Button>
          </div>
        </div>
      )}
    </div>
  );
}

function QuestionCard({ q, modul, answer, warning, onChange, onQuantCheck }) {
  const a = answer || { level: null, na: false, naReason: "", evidence: false };
  const meta = PILLAR_META[q.pillar];

  return (
    <div className="bg-surface border border-line rounded-xl2 p-4 mb-3">
      <div className="flex items-center justify-between mb-2">
        <span
          className="inline-block text-xs font-bold px-2.5 py-0.5 rounded-full"
          style={{ background: `${meta.color}22`, color: meta.color }}
        >
          {meta.label} · {q.id}
        </span>
        <label className="flex items-center gap-1.5 text-[11px] text-muted">
          <input type="checkbox" checked={a.na} onChange={(e) => onChange({ na: e.target.checked })} />
          Tidak relevan (N/A)
        </label>
      </div>

      <p className="font-semibold text-sm mb-3">{q.text}</p>

      {a.na ? (
        <input
          className="input text-sm"
          placeholder="Alasan singkat kenapa tidak relevan..."
          value={a.naReason}
          onChange={(e) => onChange({ naReason: e.target.value })}
        />
      ) : (
        <>
          {modul === "dasar" ? (
            <div className="flex gap-2">
              {["Belum", "Sebagian", "Ya"].map((label, i) => {
                const val = i === 0 ? 0 : i === 1 ? 1 : 3;
                return (
                  <button
                    key={label}
                    onClick={() => onChange({ level: val })}
                    className={`flex-1 py-2 rounded-lg text-xs font-display font-bold transition ${
                      a.level === val ? "bg-lime text-[#0A0E13]" : "bg-bg border border-line text-ink"
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          ) : (
            <ScaleControl value={a.level} onChange={(lvl) => onChange({ level: lvl })} anchors={ANCHORS} />
          )}

          {modul === "lanjutan" && (
            <label className="flex items-center gap-2 mt-3 text-xs text-muted">
              <input type="checkbox" checked={a.evidence} onChange={(e) => onChange({ evidence: e.target.checked })} />
              Lampirkan bukti (foto/nota/sertifikat) — disimulasikan sebagai tanda centang pada prototype ini
            </label>
          )}

          {warning && <p className="text-[11px] text-danger mt-2">{warning}</p>}
        </>
      )}
    </div>
  );
}

function ModulCard({ title, desc, selected, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left bg-surface border rounded-xl2 p-4 mb-3 transition ${selected ? "border-lime" : "border-line"}`}
    >
      <p className="font-display font-bold mb-1">{title}</p>
      <p className="text-muted text-sm">{desc}</p>
    </button>
  );
}
