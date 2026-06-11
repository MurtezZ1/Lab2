import { prisma } from "../config/prisma.js";
import {
  AUDIT_ACTIONS,
  AUDIT_ENTITIES,
  recordAuditLogSafe,
} from "./auditLogService.js";

const defaultFooter = {
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

const defaultCms = {
  hero: { title: "Elevate Your Digital Lifestyle", subtitle: "Discover premium tech." },
  homepage: { featuredTitle: "Trending Now" },
  footer: { text: "Sunspot Electronic Online Shop", ...defaultFooter },
  about: { text: "Premium technology store." },
  contact: { email: "support@sunspot.com" },
  banners: [],
};

export async function getCmsContent() {
  const setting = await prisma.setting.findUnique({ where: { key: "cms_content" } });
  return mergeCmsDefaults(setting?.value);
}

export async function updateCmsContent(value, userId, auditContext = {}) {
  const previousValue = await getCmsContent();
  const setting = await prisma.setting.upsert({
    where: { key: "cms_content" },
    update: { value, updated_by: userId },
    create: { key: "cms_content", value, created_by: userId, updated_by: userId },
  });
  await recordAuditLogSafe({
    userId,
    action: AUDIT_ACTIONS.CMS_UPDATE,
    entity: AUDIT_ENTITIES.CMS,
    entityId: "cms_content",
    oldValue: previousValue,
    newValue: setting.value,
    ...auditContext,
  });
  return setting;
}

function mergeCmsDefaults(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return defaultCms;

  return {
    ...defaultCms,
    ...value,
    hero: { ...defaultCms.hero, ...(value.hero ?? {}) },
    homepage: { ...defaultCms.homepage, ...(value.homepage ?? {}) },
    footer: {
      ...defaultCms.footer,
      ...(value.footer ?? {}),
      workingHours: {
        ...defaultCms.footer.workingHours,
        ...(value.footer?.workingHours ?? {}),
      },
      socialLinks: {
        ...defaultCms.footer.socialLinks,
        ...(value.footer?.socialLinks ?? {}),
      },
    },
    about: { ...defaultCms.about, ...(value.about ?? {}) },
    contact: { ...defaultCms.contact, ...(value.contact ?? {}) },
    banners: Array.isArray(value.banners) ? value.banners : defaultCms.banners,
  };
}
