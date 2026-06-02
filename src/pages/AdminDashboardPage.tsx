import { useProducts } from "@/hooks/useProducts";
import { useAppSelector } from "@/redux/hooks";
import { BarChart3, Package, Users, Upload } from "lucide-react";
import { downloadReport } from "@/services/reportExportService";

export default function AdminDashboardPage() {
  const { products } = useProducts();
  const users = useAppSelector((state) => state.users.items.length || 1);

  return (
    <div className="container mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold text-white mb-8 flex items-center gap-3">
        <BarChart3 className="w-8 h-8 text-primary" />
        Admin Dashboard
      </h1>
      <div className="grid sm:grid-cols-3 gap-4 mb-8">
        <div className="glass-card rounded-2xl p-6"><Package className="w-7 h-7 text-primary" /><p className="mt-6 text-sm text-gray-400">Products</p><h2 className="text-3xl font-black text-white">{products.length}</h2></div>
        <div className="glass-card rounded-2xl p-6"><Users className="w-7 h-7 text-accent" /><p className="mt-6 text-sm text-gray-400">Users</p><h2 className="text-3xl font-black text-white">{users}</h2></div>
        <div className="glass-card rounded-2xl p-6"><BarChart3 className="w-7 h-7 text-purple-400" /><p className="mt-6 text-sm text-gray-400">Reports</p><h2 className="text-3xl font-black text-white">Ready</h2></div>
      </div>
      <div className="glass-card rounded-2xl p-6">
        <h2 className="text-xl font-bold text-white flex items-center gap-2"><Upload className="w-5 h-5 text-primary" /> Product Image Upload</h2>
        <input type="file" accept="image/*" className="mt-4 block w-full text-sm text-gray-300 file:mr-4 file:rounded-xl file:border-0 file:bg-primary file:px-4 file:py-2 file:font-bold file:text-white" />
      </div>
      <div className="glass-card rounded-2xl p-6 mt-8">
        <h2 className="text-xl font-bold text-white">Dynamic Reports</h2>
        <div className="mt-4 flex flex-wrap gap-3">
          <button onClick={() => downloadReport("pdf")} className="rounded-xl bg-primary px-4 py-2 font-bold text-white">PDF Export</button>
          <button onClick={() => downloadReport("excel")} className="rounded-xl border border-white/10 px-4 py-2 font-bold text-gray-200">Excel Export</button>
          <button onClick={() => downloadReport("csv")} className="rounded-xl border border-white/10 px-4 py-2 font-bold text-gray-200">CSV Export</button>
        </div>
      </div>
    </div>
  );
}
