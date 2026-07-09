import { AlertTriangle, ArrowRight, CheckCircle2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getLaunchReadiness, type LaunchReadiness } from "@/services/launchReadinessService";

export default function AdminDemoModeBanner() {
  const [readiness, setReadiness] = useState<LaunchReadiness | null>(null);

  useEffect(() => {
    let active = true;
    getLaunchReadiness()
      .then((data) => {
        if (active) setReadiness(data);
      })
      .catch(() => {
        if (active) setReadiness(null);
      });

    return () => {
      active = false;
    };
  }, []);

  if (!readiness) return null;

  const isProduction = readiness.launchMode === "production";
  const Icon = isProduction ? CheckCircle2 : AlertTriangle;

  return (
    <div className={`mb-5 rounded-2xl border p-4 ${isProduction ? "border-green-400/20 bg-green-400/10" : "border-yellow-400/20 bg-yellow-400/10"}`}>
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="flex items-start gap-3">
          <Icon className={`mt-0.5 h-5 w-5 shrink-0 ${isProduction ? "text-green-300" : "text-yellow-300"}`} />
          <div>
            <p className="text-sm font-black uppercase tracking-wide text-white">
              {isProduction ? "Production Mode" : "Demo / Launch Review Mode"}
            </p>
            <p className="mt-1 text-sm text-gray-300">
              Readiness score: {readiness.readinessScore}%. {readiness.summary.recommendation}
            </p>
          </div>
        </div>
        <Link to="/admin/launch-readiness" className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-4 py-2 text-sm font-bold text-white hover:border-primary/40">
          Review Checks
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
