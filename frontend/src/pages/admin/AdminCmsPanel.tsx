import type { CmsContent } from "@/services/cmsService";
import type { ReactNode } from "react";

type AdminCmsPanelProps = {
  cms: CmsContent;
  onChange: (cms: CmsContent) => void;
  onSave: () => void;
};

export default function AdminCmsPanel({ cms, onChange, onSave }: AdminCmsPanelProps) {
  const updateFooter = (footer: Partial<CmsContent["footer"]>) => {
    onChange({ ...cms, footer: { ...cms.footer, ...footer } });
  };

  const updateWorkingHours = (workingHours: Partial<CmsContent["footer"]["workingHours"]>) => {
    updateFooter({ workingHours: { ...cms.footer.workingHours, ...workingHours } });
  };

  const updateSocialLinks = (socialLinks: Partial<CmsContent["footer"]["socialLinks"]>) => {
    updateFooter({ socialLinks: { ...cms.footer.socialLinks, ...socialLinks } });
  };

  return (
    <div className="glass-card rounded-2xl p-6 mt-8 space-y-4">
      <h2 className="text-xl font-bold text-white">CMS Management</h2>
      <div className="grid gap-4 lg:grid-cols-2">
        <Field label="Hero Title">
          <input value={cms.hero.title} onChange={(event) => onChange({ ...cms, hero: { ...cms.hero, title: event.target.value } })} className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none" />
        </Field>
        <Field label="Hero Subtitle">
          <input value={cms.hero.subtitle} onChange={(event) => onChange({ ...cms, hero: { ...cms.hero, subtitle: event.target.value } })} className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none" />
        </Field>
        <Field label="Featured Title">
          <input value={cms.homepage.featuredTitle} onChange={(event) => onChange({ ...cms, homepage: { featuredTitle: event.target.value } })} className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none" />
        </Field>
        <Field label="Legacy Footer Text">
          <input value={cms.footer.text} onChange={(event) => updateFooter({ text: event.target.value })} className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none" />
        </Field>
        <Field label="About Text">
          <input value={cms.about.text} onChange={(event) => onChange({ ...cms, about: { text: event.target.value } })} className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none" />
        </Field>
        <Field label="Contact Email">
          <input value={cms.contact.email} onChange={(event) => onChange({ ...cms, contact: { email: event.target.value } })} className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none" />
        </Field>
      </div>

      <div className="border-t border-white/10 pt-5">
        <h3 className="text-lg font-bold text-white">Global Footer</h3>
        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          <Field label="Company Description">
            <textarea value={cms.footer.about} onChange={(event) => updateFooter({ about: event.target.value })} rows={4} className="w-full resize-none rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none" />
          </Field>
          <Field label="Address">
            <textarea value={cms.footer.address} onChange={(event) => updateFooter({ address: event.target.value })} rows={4} className="w-full resize-none rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none" />
          </Field>
          <Field label="Company Name">
            <input value={cms.footer.companyName} onChange={(event) => updateFooter({ companyName: event.target.value })} className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none" />
          </Field>
          <Field label="Phone">
            <input value={cms.footer.phone} onChange={(event) => updateFooter({ phone: event.target.value })} className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none" />
          </Field>
          <Field label="Email">
            <input type="email" value={cms.footer.email} onChange={(event) => updateFooter({ email: event.target.value })} className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none" />
          </Field>
          <Field label="Monday - Friday">
            <input value={cms.footer.workingHours.mondayFriday} onChange={(event) => updateWorkingHours({ mondayFriday: event.target.value })} className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none" />
          </Field>
          <Field label="Saturday">
            <input value={cms.footer.workingHours.saturday} onChange={(event) => updateWorkingHours({ saturday: event.target.value })} className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none" />
          </Field>
          <Field label="Sunday">
            <input value={cms.footer.workingHours.sunday} onChange={(event) => updateWorkingHours({ sunday: event.target.value })} className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none" />
          </Field>
        </div>
        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          <Field label="Facebook URL">
            <input value={cms.footer.socialLinks.facebook} onChange={(event) => updateSocialLinks({ facebook: event.target.value })} className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none" />
          </Field>
          <Field label="Instagram URL">
            <input value={cms.footer.socialLinks.instagram} onChange={(event) => updateSocialLinks({ instagram: event.target.value })} className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none" />
          </Field>
          <Field label="LinkedIn URL">
            <input value={cms.footer.socialLinks.linkedin} onChange={(event) => updateSocialLinks({ linkedin: event.target.value })} className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none" />
          </Field>
          <Field label="TikTok URL">
            <input value={cms.footer.socialLinks.tiktok} onChange={(event) => updateSocialLinks({ tiktok: event.target.value })} className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none" />
          </Field>
          <Field label="X / Twitter URL">
            <input value={cms.footer.socialLinks.x} onChange={(event) => updateSocialLinks({ x: event.target.value })} className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none" />
          </Field>
        </div>
      </div>

      <button onClick={onSave} className="rounded-xl bg-primary px-4 py-2 font-bold text-white">Save CMS</button>
    </div>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-bold uppercase tracking-wide text-gray-400">{label}</span>
      {children}
    </label>
  );
}
