export default function BackgroundAnimation() {
  return (
    <div className="fixed inset-0 -z-10 pointer-events-none" aria-hidden>
      <div className="absolute inset-0 bg-gradient-to-b from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-950 dark:to-slate-900" />
      <div className="absolute inset-x-0 top-0 h-56 bg-gradient-to-b from-blue-100/40 to-transparent dark:from-blue-500/10 dark:to-transparent" />
      <div className="absolute left-1/2 top-24 h-44 w-[40rem] -translate-x-1/2 rounded-full bg-blue-500/10 blur-3xl dark:bg-blue-400/10" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(148,163,184,0.18),_transparent_45%)] dark:bg-[radial-gradient(circle_at_top,_rgba(148,163,184,0.1),_transparent_45%)]" />
    </div>
  );
}
