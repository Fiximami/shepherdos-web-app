export function AuthAmbientBackdrop() {
  return (
    <div
      className="pointer-events-none absolute inset-0 opacity-70 dark:opacity-40"
      aria-hidden
    >
      <div className="absolute -left-24 top-0 h-[28rem] w-[28rem] rounded-full bg-amber-200/50 blur-3xl dark:bg-amber-900/25" />
      <div className="absolute right-0 top-1/3 h-[22rem] w-[22rem] rounded-full bg-violet-200/45 blur-3xl dark:bg-violet-900/20" />
      <div className="absolute bottom-0 left-1/3 h-[18rem] w-[18rem] rounded-full bg-sky-200/40 blur-3xl dark:bg-sky-900/15" />
    </div>
  );
}
