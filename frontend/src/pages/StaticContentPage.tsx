import { Link } from "react-router-dom";
import { ArrowRight, Mail, MapPin, Phone } from "lucide-react";

const pages = {
  about: {
    eyebrow: "About Us",
    title: "Electronic Online Shop",
    body: [
      "Electronic Online Shop is a modern e-commerce platform focused on high-quality electronics, accessories and smart technology products.",
      "The platform combines real product catalog management, secure checkout, analytics, machine learning recommendations and admin operations in one complete system.",
    ],
  },
  contact: {
    eyebrow: "Contact",
    title: "Contact Electronic Online Shop",
    body: [
      "Our team is available for customer support, product questions and order assistance.",
      "Visit us at Dukagjini Center, Prishtine, Kosovo or contact us through email and phone.",
    ],
  },
  privacy: {
    eyebrow: "Privacy Policy",
    title: "How We Protect Customer Data",
    body: [
      "Customer accounts, orders and payments are protected using authentication, role-based access control and secure backend validation.",
      "Sensitive payment processing is delegated to Stripe when configured, and secrets are stored through environment variables.",
    ],
  },
  terms: {
    eyebrow: "Terms of Service",
    title: "Shopping Terms",
    body: [
      "Customers are responsible for providing accurate account, shipping and payment information during checkout.",
      "Orders may be reviewed, shipped, cancelled or returned according to product availability and support policies.",
    ],
  },
  returns: {
    eyebrow: "Returns Policy",
    title: "Returns and Refunds",
    body: [
      "Products can be returned when they match the return rules shown in the order and support modules.",
      "Returned items are reviewed by the admin team before refund or replacement processing.",
    ],
  },
  shipping: {
    eyebrow: "Shipping Policy",
    title: "Shipping Information",
    body: [
      "Shipping details are collected at checkout and connected to order management for fulfillment tracking.",
      "Administrators can manage shipping and order statuses from the admin dashboard.",
    ],
  },
  cookies: {
    eyebrow: "Cookie Policy",
    title: "Cookies and Local Storage",
    body: [
      "The application stores authentication tokens and user preferences locally to keep the shopping experience smooth.",
      "Analytics and recommendation features use activity data to improve product discovery.",
    ],
  },
};

export default function StaticContentPage({ page }: { page: keyof typeof pages }) {
  const content = pages[page];
  return (
    <main className="container mx-auto px-6 py-12">
      <section className="glass-card rounded-3xl p-8 md:p-12">
        <p className="text-sm font-black uppercase tracking-[0.25em] text-primary">{content.eyebrow}</p>
        <h1 className="mt-4 max-w-4xl text-4xl font-black text-white md:text-6xl">{content.title}</h1>
        <div className="mt-8 grid gap-6 text-lg leading-8 text-gray-300 lg:grid-cols-2">
          {content.body.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          <ContactCard icon={MapPin} label="Address" value="Dukagjini Center, Prishtine, Kosovo" />
          <ContactCard icon={Phone} label="Phone" value="+383 XX XXX XXX" />
          <ContactCard icon={Mail} label="Email" value="info@electronicshop.com" />
        </div>

        <Link to="/products" className="mt-10 inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 font-bold text-white hover:bg-primary/80">
          Continue Shopping
          <ArrowRight className="h-4 w-4" />
        </Link>
      </section>
    </main>
  );
}

function ContactCard({ icon: Icon, label, value }: { icon: typeof MapPin; label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
      <Icon className="h-5 w-5 text-primary" />
      <p className="mt-4 text-xs font-black uppercase tracking-wide text-gray-500">{label}</p>
      <p className="mt-1 font-bold text-white">{value}</p>
    </div>
  );
}
