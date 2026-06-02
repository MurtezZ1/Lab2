import { prisma } from "../config/prisma.js";

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

export async function updateCmsContent(value, userId) {
  return prisma.setting.upsert({
    where: { key: "cms_content" },
    update: { value, updated_by: userId },
    create: { key: "cms_content", value, created_by: userId, updated_by: userId },
  });
}
