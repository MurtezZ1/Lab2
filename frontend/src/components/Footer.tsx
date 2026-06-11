import { FormEvent, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  AtSign,
  BadgePercent,
  BriefcaseBusiness,
  Camera,
  Clock,
  Cookie,
  Cpu,
  ExternalLink,
  FileText,
  Heart,
  Home,
  Mail,
  MapPin,
  Music2,
  Phone,
  Send,
  Share2,
  ShieldCheck,
  ShoppingCart,
  Tags,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import GoogleMapLocation from "@/components/GoogleMapLocation";
import { getCmsContent, type CmsContent } from "@/services/cmsService";
import { subscribeNewsletter } from "@/services/newsletterService";

type FooterContent = CmsContent["footer"];
type FooterQuickLink =
  | { label: string; to: string; href?: never; icon: LucideIcon }
  | { label: string; href: string; to?: never; icon: LucideIcon };

const fallbackFooter: FooterContent = {
  text: "Electronic Online Shop",
  about:
    "Electronic Online Shop is a modern e-commerce platform dedicated to providing high-quality electronics, accessories and technology products. Our mission is to deliver the best shopping experience through innovation, reliability and customer satisfaction.",
  companyName: "Electronic Online Shop",
  address: "Dukagjini Center\nPrishtinë, Kosovo",
  phone: "+383 XX XXX XXX",
  email: "info@electronicshop.com",
  workingHours: {
    mondayFriday: "09:00 - 18:00",
    saturday: "10:00 - 16:00",
    sunday: "Closed",
  },
  socialLinks: {
    facebook: "https://www.facebook.com/",
    instagram: "https://www.instagram.com/",
    linkedin: "https://www.linkedin.com/",
    tiktok: "https://www.tiktok.com/",
    x: "https://x.com/",
  },
};

const quickLinks: FooterQuickLink[] = [
  { label: "Home", to: "/", icon: Home },
  { label: "Products", to: "/products", icon: Cpu },
  { label: "Categories", to: "/categories", icon: Tags },
  { label: "Deals", to: "/deals", icon: BadgePercent },
  { label: "Wishlist", to: "/wishlist", icon: Heart },
  { label: "Cart", to: "/cart", icon: ShoppingCart },
  { label: "Contact Us", href: "#footer-contact", icon: Mail },
  { label: "About Us", href: "#footer-about", icon: FileText },
];

const policyLinks = [
  { label: "Privacy Policy", href: "#privacy-policy", icon: ShieldCheck },
  { label: "Terms of Service", href: "#terms-of-service", icon: FileText },
  { label: "Cookie Policy", href: "#cookie-policy", icon: Cookie },
];

function normalizeExternalUrl(url: string) {
  const value = url.trim();
  if (!value) return "#";
  if (/^(https?:)?\/\//i.test(value)) return value;
  return `https://${value}`;
}

function mergeFooter(cmsFooter?: FooterContent | null): FooterContent {
  return {
    ...fallbackFooter,
    ...(cmsFooter ?? {}),
    workingHours: {
      ...fallbackFooter.workingHours,
      ...(cmsFooter?.workingHours ?? {}),
    },
    socialLinks: {
      ...fallbackFooter.socialLinks,
      ...(cmsFooter?.socialLinks ?? {}),
    },
  };
}

export default function Footer() {
  const [cmsFooter, setCmsFooter] = useState<FooterContent | null>(null);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  useEffect(() => {
    let active = true;

    getCmsContent()
      .then((content) => {
        if (active) setCmsFooter(content.footer);
      })
      .catch(() => {
        if (active) setCmsFooter(null);
      });

    return () => {
      active = false;
    };
  }, []);

  const footer = useMemo(() => mergeFooter(cmsFooter), [cmsFooter]);

  const socialLinks = [
    { label: "Facebook", href: footer.socialLinks.facebook, icon: Share2 },
    { label: "Instagram", href: footer.socialLinks.instagram, icon: Camera },
    { label: "LinkedIn", href: footer.socialLinks.linkedin, icon: BriefcaseBusiness },
    { label: "TikTok", href: footer.socialLinks.tiktok, icon: Music2 },
    { label: "X (Twitter)", href: footer.socialLinks.x, icon: AtSign },
  ];

  const submitNewsletter = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextEmail = email.trim();
    if (!nextEmail) return;

    setStatus("submitting");
    setMessage("");

    try {
      await subscribeNewsletter(nextEmail);
      setStatus("success");
      setMessage("Thank you for subscribing.");
      setEmail("");
    } catch (_error) {
      setStatus("error");
      setMessage("Subscription could not be saved. Please try again.");
    }
  };

  return (
    <footer className="mt-16 border-t border-white/10 bg-zinc-950/95 text-gray-300">
      <div className="container mx-auto px-6 py-12 lg:px-12">
        <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-4">
          <section id="footer-about" className="min-w-0">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-primary/20 p-2">
                <Cpu className="h-6 w-6 text-accent" />
              </div>
              <div>
                <p className="text-sm font-black uppercase tracking-wide text-white">{footer.companyName}</p>
                <p className="text-xs text-gray-500">{footer.text}</p>
              </div>
            </div>

            <h2 className="mt-6 text-lg font-black text-white">About Us</h2>
            <p className="mt-3 text-sm leading-6 text-gray-400">{footer.about}</p>

            <div className="mt-6">
              <h2 className="text-lg font-black text-white">Social Media</h2>
              <div className="mt-3 flex flex-wrap gap-2">
                {socialLinks.map((item) => {
                  const Icon = item.icon;
                  return (
                    <a
                      key={item.label}
                      href={normalizeExternalUrl(item.href)}
                      target="_blank"
                      rel="noreferrer"
                      title={item.label}
                      aria-label={item.label}
                      className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-white/[0.03] text-gray-300 transition-colors hover:border-primary/40 hover:bg-primary/10 hover:text-white"
                    >
                      <Icon className="h-4 w-4" />
                    </a>
                  );
                })}
              </div>
            </div>
          </section>

          <section className="min-w-0">
            <h2 className="text-lg font-black text-white">Company Information</h2>
            <div className="mt-4 space-y-4 text-sm">
              <InfoRow label="Company Name" value={footer.companyName} />
              <div>
                <p className="font-bold text-gray-200">Address:</p>
                <div className="mt-1 space-y-1 text-gray-400">
                  {footer.address.split("\n").map((line) => (
                    <p key={line}>{line}</p>
                  ))}
                </div>
              </div>
              <InfoRow label="Phone" value={footer.phone} href={`tel:${footer.phone.replace(/\s/g, "")}`} />
              <InfoRow label="Email" value={footer.email} href={`mailto:${footer.email}`} />
            </div>

            <div className="mt-6">
              <h3 className="flex items-center gap-2 text-sm font-black uppercase tracking-wide text-white">
                <Clock className="h-4 w-4 text-primary" />
                Working Hours
              </h3>
              <div className="mt-3 space-y-2 text-sm text-gray-400">
                <p><span className="font-bold text-gray-200">Monday - Friday:</span> {footer.workingHours.mondayFriday}</p>
                <p><span className="font-bold text-gray-200">Saturday:</span> {footer.workingHours.saturday}</p>
                <p><span className="font-bold text-gray-200">Sunday:</span> {footer.workingHours.sunday}</p>
              </div>
            </div>
          </section>

          <section id="footer-contact" className="min-w-0">
            <h2 className="text-lg font-black text-white">Quick Links</h2>
            <nav className="mt-4 grid grid-cols-2 gap-2 text-sm">
              {quickLinks.map((item) => {
                const Icon = item.icon;
                const className = "inline-flex items-center gap-2 rounded-lg px-2 py-2 text-gray-400 transition-colors hover:bg-white/[0.04] hover:text-white";

                if (item.to) {
                  return (
                    <Link key={item.label} to={item.to} className={className}>
                      <Icon className="h-4 w-4 text-primary" />
                      {item.label}
                    </Link>
                  );
                }

                return (
                  <a key={item.label} href={item.href} className={className}>
                    <Icon className="h-4 w-4 text-primary" />
                    {item.label}
                  </a>
                );
              })}
            </nav>

            <div className="mt-8">
              <h2 className="text-lg font-black text-white">Contact Us</h2>
              <div className="mt-4 space-y-3 text-sm text-gray-400">
                <ContactLine icon={Phone} href={`tel:${footer.phone.replace(/\s/g, "")}`} value={footer.phone} />
                <ContactLine icon={Mail} href={`mailto:${footer.email}`} value={footer.email} />
                <ContactLine icon={MapPin} value={footer.address.replace("\n", ", ")} />
              </div>
              <a
                href={`mailto:${footer.email}`}
                className="mt-5 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-primary/80"
              >
                Get In Touch
                <Send className="h-4 w-4" />
              </a>
            </div>
          </section>

          <section className="min-w-0">
            <h2 className="text-lg font-black text-white">Newsletter</h2>
            <form onSubmit={submitNewsletter} className="mt-4 space-y-3">
              <input
                type="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="Enter your email"
                className="w-full rounded-lg border border-white/10 bg-black/40 px-4 py-3 text-sm text-white outline-none transition-colors placeholder:text-gray-500 focus:border-primary"
              />
              <button
                type="submit"
                disabled={status === "submitting"}
                className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-3 text-sm font-bold text-white transition-colors hover:bg-primary/80 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {status === "submitting" ? "Subscribing..." : "Subscribe"}
                <Send className="h-4 w-4" />
              </button>
              {message && (
                <p className={`text-sm ${status === "success" ? "text-green-300" : "text-red-300"}`}>
                  {message}
                </p>
              )}
            </form>

            <div className="mt-6">
              <GoogleMapLocation />
            </div>
          </section>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container mx-auto flex flex-col gap-4 px-6 py-5 text-sm text-gray-500 lg:flex-row lg:items-center lg:justify-between lg:px-12">
          <p>© 2026 Electronic Online Shop. All Rights Reserved.</p>
          <div className="flex flex-wrap gap-3">
            {policyLinks.map((item) => {
              const Icon = item.icon;
              return (
                <a key={item.label} href={item.href} className="inline-flex items-center gap-2 transition-colors hover:text-white">
                  <Icon className="h-4 w-4" />
                  {item.label}
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </footer>
  );
}

function InfoRow({ label, value, href }: { label: string; value: string; href?: string }) {
  const content = href ? (
    <a href={href} className="text-gray-400 transition-colors hover:text-white">
      {value}
    </a>
  ) : (
    <p className="text-gray-400">{value}</p>
  );

  return (
    <div>
      <p className="font-bold text-gray-200">{label}:</p>
      <div className="mt-1">{content}</div>
    </div>
  );
}

function ContactLine({ icon: Icon, value, href }: { icon: LucideIcon; value: string; href?: string }) {
  const content = href ? (
    <a href={href} className="transition-colors hover:text-white">
      {value}
    </a>
  ) : (
    <span>{value}</span>
  );

  return (
    <p className="flex items-start gap-3">
      <Icon className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
      {content}
    </p>
  );
}
