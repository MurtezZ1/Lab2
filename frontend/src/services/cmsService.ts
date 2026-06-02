import { apiClient } from "@/services/apiClient";

export type CmsContent = {
  hero: { title: string; subtitle: string };
  homepage: { featuredTitle: string };
  footer: { text: string };
  about: { text: string };
  contact: { email: string };
  banners: string[];
};

export async function getCmsContent() {
  const { data } = await apiClient.get("/cms");
  return data.data as CmsContent;
}

export async function updateCmsContent(content: CmsContent) {
  const { data } = await apiClient.put("/cms", content);
  return data.data as CmsContent;
}
