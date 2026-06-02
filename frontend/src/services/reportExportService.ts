export function downloadReport(format: "pdf" | "excel" | "csv") {
  const baseUrl = import.meta.env.VITE_API_URL ?? "http://localhost:5000/api";
  window.open(`${baseUrl}/reports/export/${format}`, "_blank");
}
