export default function TopBar({ title, onBack, onProfil, initial }) {
  return (
    <div className="flex items-center justify-between px-5 pt-5 pb-4">
      {onBack ? (
        <button onClick={onBack} className="w-9 h-9 rounded-full bg-surface flex items-center justify-center text-ink">
          ←
        </button>
      ) : (
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-lime" />
          <span className="font-display font-extrabold text-ink">ESG Lite</span>
        </div>
      )}
      <h1 className="font-display font-bold text-base text-ink">{title}</h1>
      <button
        onClick={onProfil}
        className="w-9 h-9 rounded-full bg-lime/20 text-lime flex items-center justify-center font-display font-extrabold text-sm"
      >
        {initial || "U"}
      </button>
    </div>
  );
}
