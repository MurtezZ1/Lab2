import { prisma } from "../config/prisma.js";
import {
  AUDIT_ACTIONS,
  AUDIT_ENTITIES,
  recordAuditLogSafe,
} from "./auditLogService.js";

const defaultCms = {
  hero: { title: "Elevate Your Digital Lifestyle", subtitle: "Discover premium tech." },
  homepage: { featuredTitle: "Trending Now" },
  footer: { text: "Sunspot Electronic Online Shop" },
  about: { text: "Premium technology store." },
  contact: { email: "support@sunspot.com" },
  banners: [],
};

export async function getCmsContent() {
  const setting = await prisma.setting.findUnique({ where: { key: "cms_content" } });
  return setting?.value ?? defaultCms;
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
