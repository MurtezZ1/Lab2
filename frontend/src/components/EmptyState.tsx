import { ArrowRight, LucideIcon } from "lucide-react";
import { Link } from "react-router-dom";

export default function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  actionTo,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel: string;
  actionTo: string;
}) {
  return (
    <div className="glass-card relative overflow-hidden rounded-3xl border border-white/10 p-8 text-center sm:p-10">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/70 to-transparent" />
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-primary/30 bg-primary/10 text-primary shadow-[0_0_30px_rgba(10,132,255,0.18)]">
        <Icon className="h-8 w-8" />
      </div>
      <h2 className="mt-6 text-2xl font-black text-white">{title}</h2>
      <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-gray-400">{description}</p>
      <Link
        to={actionTo}
        className="mt-7 inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 font-bold text-white transition-colors hover:bg-primary/90"
      >
        {actionLabel}
        <ArrowRight className="h-4 w-4" />
      </Link>
    </div>
  );
}

