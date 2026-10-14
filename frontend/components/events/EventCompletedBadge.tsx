export default function EventCompletedBadge({ className = "" }: { className?: string }) {
  return (
    <span
      className={`inline-flex rounded-full bg-foreground/85 px-3 py-1 text-xs font-semibold tracking-wide text-white uppercase shadow-sm ${className}`}
    >
      Completed
    </span>
  );
}
