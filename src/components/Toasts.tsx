import { useStore, dismissToast } from "../lib/store";

export default function Toasts() {
  const toasts = useStore((s) => s.toasts);
  if (!toasts.length) return null;
  return (
    <div className="toasts" aria-live="polite">
      {toasts.map((t) => (
        <button key={t.id} type="button" className="toast" onClick={() => dismissToast(t.id)} aria-label={`${t.title}. ${t.desc}. Dismiss`}>
          <span className="toast__stamp" aria-hidden="true">
            ★
          </span>
          <span className="toast__body">
            <b>{t.title}</b>
            <span>{t.desc}</span>
          </span>
        </button>
      ))}
    </div>
  );
}
