import { Link } from "react-router-dom";
import { ArrowRight, Boxes } from "lucide-react";

const content: Record<string, { title: string; description: string; actions: Array<{ label: string; to: string }> }> = {
  products: {
    title: "Products Management",
    description: "Add products, edit catalog information, delete products safely, and manage inventory from the main admin dashboard tools.",
    actions: [{ label: "Open Admin Tools", to: "/admin" }, { label: "View Products", to: "/products" }],
  },
  orders: {
    title: "Orders Management",
    description: "View all orders, update order statuses, and review payments from the admin dashboard and reports modules.",
    actions: [{ label: "Open Admin Tools", to: "/admin" }, { label: "Reports", to: "/admin/reports" }],
  },
  reports: {
    title: "Reports",
    description: "Access sales, revenue, product, customer, and inventory reports with export support.",
    actions: [{ label: "Open Analytics", to: "/admin/analytics" }, { label: "Open Admin Reports", to: "/admin" }],
  },
  cms: {
    title: "CMS",
    description: "Edit homepage content, banners, footer, about, and contact content using the CMS panel in the admin dashboard.",
    actions: [{ label: "Open CMS Panel", to: "/admin" }],
  },
  notifications: {
    title: "Notifications",
    description: "Send system notifications and review notification activity using the notifications module.",
    actions: [{ label: "View Notifications", to: "/notifications" }, { label: "Open Admin Tools", to: "/admin" }],
  },
  settings: {
    title: "Settings",
    description: "Review site settings, theme settings, and global configuration for the Electronic Online Shop.",
    actions: [{ label: "Open Admin Tools", to: "/admin" }],
  },
};

export default function AdminSectionPage({ section }: { section: keyof typeof content }) {
  const item = content[section];
  return (
    <div className="glass-card rounded-2xl p-8">
      <Boxes className="h-9 w-9 text-primary" />
      <h1 className="mt-5 text-3xl font-black text-white">{item.title}</h1>
      <p className="mt-3 max-w-3xl text-gray-400">{item.description}</p>
      <div className="mt-6 flex flex-wrap gap-3">
        {item.actions.map((action) => (
          <Link key={action.to + action.label} to={action.to} className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-4 py-3 text-sm font-bold text-gray-200 hover:border-primary/40 hover:text-white">
            {action.label}
            <ArrowRight className="h-4 w-4" />
          </Link>
        ))}
      </div>
    </div>
  );
}
