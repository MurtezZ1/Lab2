import { apiClient } from "@/services/apiClient";
import type { Product } from "@/types";

export type AIShoppingAssistantResponse = {
  answer: string;
  products: Product[];
  extracted: {
    category: string | null;
    budget: number | null;
    brand: string | null;
    purpose: string | null;
    features: string[];
  };
  followUp: string;
  mode: "openai" | "local";
};

export type AIAnalytics = {
  totalChats: number;
  commonQuestions: Array<{ question: string; count: number }>;
  requestedCategories: Array<{ category: string; count: number }>;
};

export async function askShoppingAssistant(message: string) {
  const { data } = await apiClient.post("/ai/shopping-assistant", { message });
  return data.data as AIShoppingAssistantResponse;
}

export async function getAIAnalytics() {
  const { data } = await apiClient.get("/ai/analytics");
  return data.data as AIAnalytics;
}
