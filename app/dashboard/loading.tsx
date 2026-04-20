export default function Loading() {
  return (
    <div className="flex h-screen w-full items-center justify-center bg-[#090A0F]">
      <div className="flex flex-col items-center gap-4">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-zinc-800 border-t-coral" />
        <p className="font-mono text-xs font-bold uppercase tracking-widest text-zinc-500">
          Loading Instance...
        </p>
      </div>
    </div>
  );
}
