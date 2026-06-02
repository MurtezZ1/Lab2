import { downloadReport } from "@/services/reportExportService";

export default function AdminReportsPanel() {
  return (
    <div className="glass-card rounded-2xl p-6 mt-8">
      <h2 className="text-xl font-bold text-white">Reports Management</h2>
      <div className="mt-4 flex flex-wrap gap-3">
        <button onClick={() => downloadReport("pdf")} className="rounded-xl bg-primary px-4 py-2 font-bold text-white">PDF Export</button>
        <button onClick={() => downloadReport("excel")} className="rounded-xl border border-white/10 px-4 py-2 font-bold text-gray-200">Excel Export</button>
        <button onClick={() => downloadReport("csv")} className="rounded-xl border border-white/10 px-4 py-2 font-bold text-gray-200">CSV Export</button>
      </div>
    </div>
  );
}
