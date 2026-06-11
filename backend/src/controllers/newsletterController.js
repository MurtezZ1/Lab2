import { subscribeToNewsletter } from "../services/newsletterService.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const subscribeNewsletterController = asyncHandler(async (req, res) => {
  const subscription = await subscribeToNewsletter(req.body.email);

  res.status(201).json({
    success: true,
    data: {
      id: subscription.id,
      email: subscription.email,
      isActive: subscription.is_active,
    },
    message: "Newsletter subscription saved.",
  });
});
