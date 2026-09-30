import { Button, TierBadge, Toggle } from "../components/ui";
import { getTierFromScore } from "../utils/scoring";

export default function Profil({ account, profile, legal, latest, consentBagi, onToggleConsent, onNavigate }) {
  const tier = latest ? getTierFromScore(latest.result.klaim.total) : null;

  return (
    <div className="px-5 pb-10">
      <h2 className="font-display text-xl font-extrabold mb-5">Profil Usaha</h2>

      <div className="bg-surface border border-line rounded-xl2 p-5 mb-5 text-center">
        <div className="w-16 h-16 rounded-full bg-lime/20 text-lime flex items-center justify-center mx-auto mb-3 font-display font-extrabold text-xl">
          {(profile?.nama || "U").charAt(0).toUpperCase()}
        </div>
        <p className="font-display font-bold text-lg">{profile?.nama || "Belum ada data"}</p>
        <p className="text-muted text-sm mb-3">{profile?.sektorUtama}</p>
        {tier ? <TierBadge tier={tier} /> : <p className="text-muted text-xs">Belum ada asesmen</p>}
      </div>

      <div className="bg-surface border border-line rounded-xl2 divide-y divide-line mb-5">
        <InfoRow label="Pemilik" value={profile?.pemilik || "-"} />
        <InfoRow label="Skala usaha" value={cap(profile?.skala)} />
        <InfoRow label="Kota" value={profile?.kota || "-"} />
        <InfoRow label="NIB" value={legal?.nib ? maskMiddle(legal.nib) : "Belum diisi"} />
        <InfoRow label="NPWP" value={legal?.npwp ? maskMiddle(legal.npwp) : "Belum diisi"} />
      </div>

      <div className="bg-surface border border-line rounded-xl2 p-4 mb-5">
        <p className="font-display font-bold text-sm mb-3">Berbagi data ke lembaga keuangan</p>
        <Toggle checked={consentBagi} onChange={onToggleConsent} label="Izinkan hasil asesmen muncul di Dashboard Bank" />
        <p className="text-[11px] text-muted mt-2">Bisa dicabut kapan saja. Data hanya dibagikan ke lembaga yang kamu setujui.</p>
      </div>

      <div className="space-y-2 mb-6">
        <MenuRow icon="📄" label="Dokumen & pernyataan" />
        <MenuRow icon="🎓" label="Panduan pengisian ESG Lite" />
        <MenuRow icon="❓" label="Bantuan & pendampingan PLUT-KUMKM" />
      </div>

      <Button className="w-full" onClick={() => onNavigate("asesmen")}>
        {latest ? "Perbarui Asesmen" : "Mulai Asesmen Pertama"}
      </Button>
    </div>
  );
}

function InfoRow({ label, value }) {
  return (
    <div className="flex justify-between px-4 py-3 text-sm">
      <span className="text-muted">{label}</span>
      <span className="font-semibold">{value}</span>
    </div>
  );
}
function MenuRow({ icon, label }) {
  return (
    <button className="w-full flex items-center gap-3 bg-surface border border-line rounded-xl2 p-4 text-left">
      <span>{icon}</span>
      <span className="text-sm font-semibold flex-1">{label}</span>
      <span className="text-muted">›</span>
    </button>
  );
}
function cap(s) { return s ? s.charAt(0).toUpperCase() + s.slice(1) : "-"; }
function maskMiddle(v) {
  if (v.length < 6) return v;
  return v.slice(0, 3) + "•••••" + v.slice(-3);
}
