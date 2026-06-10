import { answerShoppingAssistant, getAIAnalytics } from "../services/aiShoppingAssistantService.js";
import { AppError } from "../utils/AppError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const shoppingAssistantController = asyncHandler(async (req, res) => {
  const message = String(req.body?.message ?? "").trim();
  if (!message) throw new AppError("Message is required.", 400);

  const data = await answerShoppingAssistant({
    message,
    userId: req.user?.id ?? null,
  });
  res.json({ success: true, data });
});

export const aiAnalyticsController = asyncHandler(async (_req, res) => {
  const data = await getAIAnalytics();
  res.json({ success: true, data });
});
