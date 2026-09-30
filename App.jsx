import { useState } from "react";
import TopBar from "./components/TopBar";
import BottomNav from "./components/BottomNav";
import { Button } from "./components/ui";

import Landing from "./screens/Landing";
import Onboarding from "./screens/Onboarding";
import Home from "./screens/Home";
import Asesmen from "./screens/Asesmen";
import Hasil from "./screens/Hasil";
import Verifikasi from "./screens/Verifikasi";
import Laporan from "./screens/Laporan";
import Riwayat from "./screens/Riwayat";
import Dashboard from "./screens/Dashboard";
import Profil from "./screens/Profil";

import { DEMO_PRESETS } from "./data/dummy";
import { computeScore } from "./utils/scoring";

const TITLES = { home: "Beranda", riwayat: "Riwayat", bank: "Dashboard Bank", verifikasi: "Verifikasi", profil: "Profil" };
const CHROME_SCREENS = ["home", "riwayat", "bank", "verifikasi"];

export default function App() {
  const [screen, setScreen] = useState("landing");
  const [account, setAccount] = useState(null);
  const [profile, setProfile] = useState(null);
  const [legal, setLegal] = useState(null);
  const [consentBagi, setConsentBagi] = useState(false);
  const [latest, setLatest] = useState(null); // { modul, sektorDipilih, answers, result, core, sector, date, verificationStatus, auditLog, actionPlans }
  const [pendingAsesmen, setPendingAsesmen] = useState(null); // dipakai saat "Ubah Jawaban"

  function handleDemo(presetKey) {
    const preset = DEMO_PRESETS.find((p) => p.key === presetKey) || DEMO_PRESETS[0];
    setAccount({ nama: "Pengguna Demo", kontak: "demo@esglite.id" });
    setProfile(preset.profile);
    setLegal(null);
    setConsentBagi(true);
    setLatest(null);
    setScreen("home");
  }

  function handleOnboardingSelesai({ account: acc, profil, legal: lg }) {
    setAccount(acc);
    setProfile(profil);
    setLegal(lg);
    setScreen("home");
  }

  function handleAsesmenSelesai(data) {
    const coreOnly = computeScore(data.core, [], data.answers);
    const assessment = {
      ...data,
      coreOnlyTotal: coreOnly.klaim.total,
      date: new Date().toISOString(),
      verificationStatus: "Mandiri",
      auditLog: [],
      actionPlans: [],
    };
    setLatest(assessment);
    setPendingAsesmen(null);
    setScreen("hasil");
  }

  function handleVerifikasiSelesai({ verified, log, status }) {
    const newAnswers = { ...latest.answers };
    Object.entries(verified).forEach(([id, v]) => {
      newAnswers[id] = { ...newAnswers[id], level: v.level, evidence: true };
    });
    const result = computeScore(latest.core, latest.sector, newAnswers);
    const coreOnly = computeScore(latest.core, [], newAnswers);
    setLatest({ ...latest, answers: newAnswers, result, coreOnlyTotal: coreOnly.klaim.total, verificationStatus: status, auditLog: log });
    setScreen("laporan");
  }

  function goProfil() { setScreen("profil"); }

  function navigate(key) {
    if (key === "asesmen") setPendingAsesmen(null);
    setScreen(key);
  }

  const initial = (account?.nama || profile?.nama || "U").charAt(0).toUpperCase();

  return (
    <div className="min-h-screen bg-bg text-ink flex flex-col max-w-sm mx-auto font-body">
      {screen === "landing" && (
        <Landing onDaftar={() => setScreen("onboarding")} onDemo={handleDemo} />
      )}

      {screen === "onboarding" && (
        <Onboarding onSelesai={handleOnboardingSelesai} onBatal={() => setScreen("landing")} />
      )}

      {screen === "asesmen" && (
        <Asesmen
          profile={profile}
          initialModul={pendingAsesmen?.modul}
          initialSector={pendingAsesmen?.sektorDipilih}
          initialAnswers={pendingAsesmen?.answers}
          onSelesai={handleAsesmenSelesai}
          onBatal={() => { setPendingAsesmen(null); setScreen(latest ? "hasil" : "home"); }}
        />
      )}

      {screen === "hasil" && latest && (
        <Hasil
          assessment={latest}
          profile={profile}
          onUbah={() => { setPendingAsesmen(latest); setScreen("asesmen"); }}
          onKirimVerifikasi={() => setScreen("verifikasi")}
          onLihatLaporan={() => setScreen("laporan")}
        />
      )}

      {screen === "laporan" && latest && (
        <Laporan
          profile={profile}
          assessment={latest}
          verificationStatus={latest.verificationStatus}
          onKembali={() => setScreen("home")}
        />
      )}

      {CHROME_SCREENS.includes(screen) && (
        <>
          <TopBar title={TITLES[screen]} initial={initial} onProfil={goProfil} />
          <main className="flex-1 overflow-y-auto scroll-thin">
            {screen === "home" && <Home profile={profile} latest={latest} onNavigate={navigate} />}
            {screen === "riwayat" && <Riwayat latest={latest} />}
            {screen === "bank" && (
              <Dashboard
                myEntry={
                  consentBagi && latest
                    ? {
                        id: "mine",
                        name: profile?.nama,
                        sector: profile?.sektorUtama,
                        scale: profile?.skala,
                        coreScore: latest.coreOnlyTotal ?? latest.result.klaim.total,
                        totalScore: latest.result.klaim.total,
                        level: latest.result.level.key,
                        verification: latest.verificationStatus,
                        date: latest.date,
                      }
                    : null
                }
              />
            )}
            {screen === "verifikasi" &&
              (latest ? (
                <Verifikasi assessment={latest} onSelesai={handleVerifikasiSelesai} onBatal={() => setScreen("home")} />
              ) : (
                <div className="px-5 py-10 text-center">
                  <p className="text-muted text-sm mb-4">Belum ada asesmen untuk diverifikasi.</p>
                  <Button onClick={() => navigate("asesmen")}>Mulai Asesmen</Button>
                </div>
              ))}
          </main>
          <BottomNav active={screen} onNavigate={navigate} />
        </>
      )}

      {screen === "profil" && (
        <>
          <TopBar title="Profil" onBack={() => setScreen("home")} />
          <main className="flex-1 overflow-y-auto scroll-thin">
            <Profil
              account={account}
              profile={profile}
              legal={legal}
              latest={latest}
              consentBagi={consentBagi}
              onToggleConsent={setConsentBagi}
              onNavigate={navigate}
            />
          </main>
        </>
      )}
    </div>
  );
}
