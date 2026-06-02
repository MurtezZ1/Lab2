import type { CmsContent } from "@/services/cmsService";

type AdminCmsPanelProps = {
  cms: CmsContent;
  onChange: (cms: CmsContent) => void;
  onSave: () => void;
};

export default function AdminCmsPanel({ cms, onChange, onSave }: AdminCmsPanelProps) {
  return (
    <div className="glass-card rounded-2xl p-6 mt-8 space-y-4">
      <h2 className="text-xl font-bold text-white">CMS Management</h2>
      <input value={cms.hero.title} onChange={(event) => onChange({ ...cms, hero: { ...cms.hero, title: event.target.value } })} className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none" />
      <input value={cms.hero.subtitle} onChange={(event) => onChange({ ...cms, hero: { ...cms.hero, subtitle: event.target.value } })} className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none" />
      <input value={cms.homepage.featuredTitle} onChange={(event) => onChange({ ...cms, homepage: { featuredTitle: event.target.value } })} className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none" />
      <input value={cms.footer.text} onChange={(event) => onChange({ ...cms, footer: { text: event.target.value } })} className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none" />
      <input value={cms.about.text} onChange={(event) => onChange({ ...cms, about: { text: event.target.value } })} className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none" />
      <input value={cms.contact.email} onChange={(event) => onChange({ ...cms, contact: { email: event.target.value } })} className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none" />
      <button onClick={onSave} className="rounded-xl bg-primary px-4 py-2 font-bold text-white">Save CMS</button>
    </div>
  );
}
