import mongoose from "mongoose";

const baseOptions = { timestamps: true };

export const MongoNotification =
  mongoose.models.MongoNotification ??
  mongoose.model(
    "MongoNotification",
    new mongoose.Schema(
      { userId: String, title: String, message: String, type: String, read: Boolean },
      baseOptions,
    ),
  );

export const SearchHistory =
  mongoose.models.SearchHistory ??
  mongoose.model(
    "SearchHistory",
    new mongoose.Schema({ userId: String, scope: String, query: String }, baseOptions),
  );

export const UserActivity =
  mongoose.models.UserActivity ??
  mongoose.model(
    "UserActivity",
    new mongoose.Schema({ userId: String, action: String, metadata: Object }, baseOptions),
  );

export const ProductViewHistory =
  mongoose.models.ProductViewHistory ??
  mongoose.model(
    "ProductViewHistory",
    new mongoose.Schema({ userId: String, productId: String, productName: String }, baseOptions),
  );

export const AIChatHistory =
  mongoose.models.AIChatHistory ??
  mongoose.model(
    "AIChatHistory",
    new mongoose.Schema(
      {
        userId: String,
        question: String,
        response: String,
        extractedIntent: Object,
        productIds: [String],
      },
      baseOptions,
    ),
  );
